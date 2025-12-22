# pjt_1

An Electron application with React

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### MQTT 실행

토픽 시작 명령어 : mosquitto_sub -h localhost -t /토픽명
mosquitto_pub -h localhost -t /test -m "Hello liyo"

추가 설정 : mosquitto.conf(C:\Program Files\mosquitto <= 디폴트) 제일 마지막에 아래 내용 추가
``` 

# 포트 설정
# 1. 기본 MQTT 포트 (CMD 테스트용)
listener 1883
allow_anonymous true

# 2. 웹소켓 포트 (일렉트론 렌더러용)
listener 9001
protocol websockets
allow_anonymous true
```