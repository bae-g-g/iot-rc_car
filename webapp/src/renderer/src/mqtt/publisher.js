import { client } from './subscriber'

// 조이스틱 명령을 MQTT로 전송하는 함수
export const sendJoystickCommand = (command) => {
  // command: 1, 2, 3, 4, 5
  if (client && client.connected) {
    // 오브젝트 스트링 형식으로 변환 ({ cmd: 1 })
    const payload = JSON.stringify({ cmd: parseInt(command, 10) })
    client.publish('/joystick', payload)
    console.log(`MQTT Published: /joystick -> ${payload}`)
  } else {
    console.warn('MQTT Client is not connected.')
  }
}

export const sendPreImageComand = (base64Image) => {
  if (client && client.connected) {
    // 오브젝트 스트링 형식으로 변환 ({ cmd: 1 })
    const payload = JSON.stringify({ image: base64Image })
    client.publish('/image', payload)
    console.log(`MQTT Published: /image -> ${payload}`)
  } else {
    console.warn('MQTT Client is not connected.')
  }
}
