from gpiozero import DistanceSensor
from time import sleep

sensor = DistanceSensor(echo=24, trigger=23)

print("초음파 센서 테스트 시작")

try:
    while True:
        # gpiozero의 Distance 반환값은 mm
        distance_cm = sensor.distance * 100 
        
        print(f"거리: {distance_cm:.1f} cm")
        
        
        sleep(0.5) # 출력 속도 조절용 (없어도 다른 작업 가능)

except KeyboardInterrupt:
    print("종료")
