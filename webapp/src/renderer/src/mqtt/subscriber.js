import mqtt from 'mqtt'
import { useSensorStore } from '../zustand/state'
import { upscaleImage } from '../huggingfaceModel/upscale'
import { objectDection } from '../huggingfaceModel/objectdection'

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
      const { imageLock } = useSensorStore.getState()
      const messageString = message.toString()
      const msgObj = JSON.parse(messageString)
      const temp = msgObj.temperature
      const humid = msgObj.humidity

      const ultrasonic = msgObj.ultrasonic

      if (msgObj?.capture_array) {
        const image = msgObj.capture_array
        if (!imageLock) {
          // if (ultrasonic < 20) {
          useSensorStore.setState({ imageLock: true })
          // 여기서 이미지 업데이트
          upscaleImage(image)
            .then((res) => {
              console.log('upscaleImage', res)
              objectDection(res)
                .then((res) => {
                  console.log('objectDetection', res)
                  useSensorStore.setState({ image: res })
                  useSensorStore.setState({ imageLock: false })
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
          // } else {
          // useSensorStore.setState({ image })
          // }
        } else {
          // useSensorStore.setState({ image })
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
      console.log(temp, humid, timeStr, ultrasonic, gyro)
      useSensorStore.setState({ temp, humid, timeStr, ultrasonic, gyro })
    }
  })
})

export { client }
