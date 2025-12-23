// const mqtt = require("mqtt")
import mqtt from 'mqtt'
import { useSensorStore } from '../zustand/state'

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
      const messageString = message.toString()
      const msgObj = JSON.parse(messageString)
      const temp = msgObj.temperature
      const humid = msgObj.humidity
      const image = msgObj.capture_array

      const now = new Date()
      // Generate time string in HH:mm:ss format
      const timeStr =
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0') +
        ':' +
        now.getSeconds().toString().padStart(2, '0')
      console.log(temp, humid, timeStr, image)
      useSensorStore.setState({ temp, humid, timeStr, image })
    }
  })
})

export { client }
