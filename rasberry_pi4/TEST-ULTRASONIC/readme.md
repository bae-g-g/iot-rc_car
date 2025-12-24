# 초음파 센서 테스트

## 흐름

-`HC-SR04` 모듈 사용
- **Trigger** **->** **GPIO 23**
- **Echo** **-- 3k 옴 -->** **GPIO 24**
- 0.5초에 1번씩 거리를 측정하여 cm 단위로 출력

## 설치 패키지목록

``` bash

#파이썬 라이브러리
pip3 install gpiozero
pip3 install rpi-lgpio

```

## 하드웨어 연결

`vcc` : 5V
`trig` : GPIO 23 ( pin 16 )
`echo` : GPIO 24 ( pin 18 )
    - **5V로 연결되어있으며 output또한  5V이다. 3.3V로 전압을 맞춰주기 위해 약 3k옴 을 직렬로 연결한다.**
`gnd` : gnd



