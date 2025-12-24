import mqtt from 'mqtt'
import { useSensorStore } from '../zustand/state'
import { upscaleImage } from '../huggingfaceModel/upscale'
import { objectDection } from '../huggingfaceModel/objectdection'
import { sendPreImageComand } from './publisher'

const client = mqtt.connect('ws://localhost:9001')
//mqtt가 연결되면 실행
client.on('connect', () => {
  //mqtt가 연결되어있는지 확인
  console.log(client.connected)
  //topic 구독
  client.subscribe('/test') //topic 구독
  //구독해놓은 메시지가 들어오면 실행
  client.on('message', (topic, message) => {
    if (topic === '/test') {
      const { image, imageLock } = useSensorStore.getState()
      const messageString = message.toString()
      const msgObj = JSON.parse(messageString)
      const temp = msgObj.temperature
      const humid = msgObj.humidity
      const capture_array = msgObj?.capture_array ? msgObj.capture_array : image

      const ultrasonic = msgObj.ultrasonic

      if (!imageLock) {
        if (ultrasonic < 20) {
          useSensorStore.setState({ imageLock: true })
          // 여기서 이미지 업데이트
          upscaleImage(capture_array)
            .then((res) => {
              // console.log('upscaleImage !!!', res)
              objectDection(res)
                .then((res) => {
                  console.log('objectDetection', res)
                  useSensorStore.setState({ image: res })
                  useSensorStore.setState({ imageLock: false })

                  // 이미지 뷰어 띄우기(Base64 -> blob)
                  const byteString = atob(res.split(',')[1])
                  const mimeString = res.split(',')[0].split(':')[1].split(';')[0]
                  const ab = new ArrayBuffer(byteString.length)
                  const ia = new Uint8Array(ab)
                  for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i)
                  }
                  const blob = new Blob([ab], { type: mimeString })
                  const blobUrl = URL.createObjectURL(blob)
                  window.open(blobUrl, '_blank', 'width=640,height=480')

                  // 이미지 전달
                  sendPreImageComand(res)
                })
                .catch((e) => {
                  console.log('objectDetection error', e)
                  useSensorStore.setState({ imageLock: false })
                })
            })
            .catch((e) => {
              console.log('upscaleImage error', e)
              useSensorStore.setState({ imageLock: false })
            })
        } else {
          useSensorStore.setState({ image: capture_array })
        }
      }
      const gyro = msgObj.gyro

      const now = new Date()
      // Generate time string in HH:mm:ss format
      const timeStr =
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0') +
        ':' +
        now.getSeconds().toString().padStart(2, '0')
      // console.log(temp, humid, timeStr, ultrasonic, gyro, capture_array)
      if (humid) {
        useSensorStore.setState({ temp, humid, timeStr, ultrasonic, gyro })
      }
    }
  })
})

export { client }
