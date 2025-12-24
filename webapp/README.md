# webapp

## 구성
 - Electron : 데스크톱 애플리케이션 프레임워크
 - React : 프론트 엔드 프레임워크
 - Zustand : 리액트 상태관리
 - Recharts : 차트 그리기
 - Mqtt : 라즈베리파이 통신 프로토콜

## 화면 구성
1. 대시보드 화면
 - 라즈베리파이로 부터 받아온 센서값 출력
    - 온도
    - 습도
    - 거리(초음파)
    - 자이로
![대시보드](./대시보드.png)

2. 조이스틱 + RC카 카메라 화면
 - 조이스틱으로 RC카 제어
 - RC카 카메라 화면 출력
![조이스틱](./일렉트론-조이스틱.png)

## 동작 과정
1. 대시보드
    - RC카로 부터 MQTT로 센서값 수신
    - 센서값을 zustand로 저장
    - zustand로 저장된 센서값을 대시보드 화면에 출력(차트화)

2. 조이스틱
    - 버튼기반으로 방향을 RC카로 MQTT로 전송
    - RC카로 부터 MQTT로 카메라 이미지 수신
    - 카메라 이미지를 화면에 출력

## AI 동작 과정
초음파 센서 장애물 탐지 -> 이미지 업스케일링 -> 객체감지로 어떤 객체인지 확인
1. 이미지업 스케일링
    - hugging face의 "https://huggingface.co/valiantcat/Qwen-Image-Edit-2509-Upscale2K" 모델사용
    - hugging face의 API호출로 업스케일링 처리
2. 객체감지
    - hugging face의 "https://huggingface.co/jameslahm/yolov10n"모델사용
    - 모델이 가볍기 때문에 실제 모델을 로드해서 사용(일렉트론 앱에 내장된 상황)
    - 업스케일링 된 이미지를 사용해서 객체탐지 처리
    - 객체 탐지 결과를 zustand로 저장
    - zustand로 저장된 객체 탐지 결과를 팝업 화면으로 출력
![AI동작](./AI동작.png)

## 실행
1. npm run dev : 개발환경 실행
2. npm run build:(win, linux, max) : os별로 빌드 실행


