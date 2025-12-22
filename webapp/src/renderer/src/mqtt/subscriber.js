// const mqtt = require("mqtt")
import mqtt from 'mqtt'
const client = mqtt.connect('ws://localhost:9001')
//mqtt가 연결되면 실행
client.on('connect', () => {
  //mqtt가 연결되어있는지 확인
  console.log(client.connected)
  //topic 구독
  client.subscribe('testTopic') //topic 구독
  //구독해놓은 메시지가 들어오면 실행
  client.on('message', (topic, message) => {
    const messageString = message.toString()
    console.log(topic, messageString)
  })
})

export { client }
