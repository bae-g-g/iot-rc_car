# 블루트스 조작 조이스틱
[조이스틱 CODE rp4](./rasberry_pi4/TEST-BLUETOOTH/RC_car.py)
[조이스틱 CODE esp32](./rasberry_pi4/TEST-BLUETOOTH/bluetooth_controller.ino)

- esp32가 조이스틱을 adc값으로 받아옴 
- esp32와 라즈베리4가 블루투스로 연결
- esp32에서 50ms마다 현재 값 x(0~4096),y(0~4096)을 송신
- 값을 수신하여 스로틀(-255 ~ 255), 핸들(110~370)값을 매핑
- 해당하는 모터헷 라이브러리를 통해 pwm값을 전달하여 rc카 조정
  
# 앱 조작 조이스틱

[앱 조작 CODE](./rasberry_pi4/car_controller.py)

-  rpi subscrive (topic = /joystick)
-  rpi subscrive (topic = /motor)
-  데스크톱 앱에서 커맨드 (1~5)형태로 전송
-  수신하여 (전후진,좌우측조향)
-  초음파센서값이 10cm 이하인경우 긴급제동   


# 센서로깅

[센서 로깅 CODE](./rasberry_pi4/sensor.py)

- 자이로센서(mpu6050)
- 초음파센서(HC-SR04)
- 온습도센서(DHT11)
- json형식으로 데이터 합치기
- ras pi4 publish (topic = /test) 약 0.5초 간격

- 초음파센서값 10cm 이하의 경우
- ras pi4 publish (topic = /motor)

### gpio map
- DHT11	GPIO 4	온도 및 습도 측정
- HC-SR04 Trig: 23, Echo: 24	거리 측정 (초음파)
- MPU6050 I2C (0x68)	자이로/가속도 데이터 수집

# 이미지 전송

[이미지전송 CODE](./rasberry_pi4/camer.py)

- 이미지 캡처: picam2.capture_array()를 통해 원본 배열(Array) 데이터를 가져옵니다.
- cv2.imencode('.jpg', ...)를 사용해 JPG 포맷으로 압축
- 압축된 이미지를 Base64로 인코딩.
- ras pi4 publish (topic = /test)  2초 간격 

