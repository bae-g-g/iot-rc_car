# 블루투스 테스트


## 흐름

`ESP32`(Controller) : 가변저항값(좌우, 전후진값) 송신 <br>  $\rightarrow$ `Bluetooth`(50ms)  <br> $\rightarrow$ `Raspberry Pi 4`(RC Car) : 데이터 수신, 데이터 매핑,모터제어 

![이미지](./TEST.gif)
> test영상 23초 로딩 오래걸릴 수 있음



## 설치 패키지목록

``` bash

#시스템 패키지
sudo apt install bluetooth libbluetooth-dev 

# 라이브러리
pip3 install pybluez

```

## 라즈베리파이 블루트스 허용

```bash
#  차단 해제 명령
sudo rfkill unblock bluetooth

# 장치 켜기
sudo hciconfig hci0 up

# 스캔 
sudo hcitool scan

```

위 `sudo hcitool scan`에 출력으로 나오는 값이 esp32의 MAC주소



