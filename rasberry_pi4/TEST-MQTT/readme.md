# MQTT test

dht11(온습도)센서로 읽어 드린 값을 전송하는 테스트 코드

## 흐름

- rasberry pi 4 를 `DHT11` 센서로 온도 및 습도 데이터 수집
- MQTT 브로커( 서버기능을 할 예정인 노트북)에서 서비스 시작  
- rasberry pi 4 를 MQTT 브로커(`192.168.137.106`)에 연결
- 2초 간격으로 데이터 측정
- 데이터를 JSON 포맷으로 변환하여 `/test` 토픽으로 **Publish**


## 설치 패키지 목록

### rasberry pi 4
```bash
pip3 install paho-mqtt
```

### broker

```
sudo apt install mosquitto
```

## 연결 설정

1. 브로커 에서 mqtt 서비스 제공을 위해 `mosquitto`패키지 다운
2. sudo nano /etc/mosquitto/mosquitto.conf에서 연결 관련 설정파일 수정
   1. listener 1883
   2. allow_anonymous false ( 아무나 접속 하는것을 막음 )
   3. password_file /etc/mosquitto/passwd (해당 파일에 있는 비밀번호로 접속하는 경우만 허용)
