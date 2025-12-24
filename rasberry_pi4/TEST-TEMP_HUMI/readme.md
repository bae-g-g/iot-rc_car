# 온습도 센서 테스트
서

## 흐름

- `DHT11` 센서 모듈 사용
- **DATA(DHT11)** **->** **7번 핀 & GPIO4 (rpi4)**
- 2초에 1번씩 데이터를 읽어와 값을 프린트 
  

## 설치 패키지목록

``` bash
#시스템 패키지
sudo apt-get install libgpiod2

#파이썬 라이브러리
pip3 install adafruit-circuitpython-dht
pip3 install gpiozero

```

## 하드웨어 연결

`vcc` : 3.3V
`data` : GPIO 4 ( pin 7)
`gnd` : gnd



