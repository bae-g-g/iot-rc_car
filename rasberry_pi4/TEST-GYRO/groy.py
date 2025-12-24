import smbus2  # I2C 통신 라이브러리 (없으면 pip install smbus2)
import time
import csv
from datetime import datetime

# ------------------------------------------------------
# 1. I2C 및 센서 설정
# ------------------------------------------------------
BUS_NUM = 1          # 라즈베리파이 I2C 버스 번호
DEVICE_ADDR = 0x68   # 자이로 센서 주소

# 레지스터 주소 (보내주신 정보)
PWR_MGMT_1  = 0x6B   # 전원 관리 레지스터 (센서를 깨우기 위해 필요)
GYRO_XOUT_H = 0x43
GYRO_YOUT_H = 0x45
GYRO_ZOUT_H = 0x47

# I2C 버스 객체 생성
bus = smbus2.SMBus(BUS_NUM)

def init_sensor():
    """센서를 깨우는 함수 (슬립 모드 해제)"""
    # 0x6B 레지스터에 0을 쓰면 센서가 깨어납니다.
    bus.write_byte_data(0x68, 0x6B, 0)
    print("센서 초기화 완료 (Wake Up)")

def read_raw_data(addr):
    
    high = bus.read_byte_data(DEVICE_ADDR, addr)
    low = bus.read_byte_data(DEVICE_ADDR, addr + 1)
    value = ((high << 8) | low)
    
    if value > 32768:
        value = value - 65536
    return value

# ------------------------------------------------------
# 2. 메인 로깅 루프
# ------------------------------------------------------

init_sensor()

try:
        
     while True:
            # 1. 데이터 읽기
        gyro_x = read_raw_data(GYRO_XOUT_H) # 0x43, 0x44 읽음
        gyro_y = read_raw_data(GYRO_YOUT_H) # 0x45, 0x46 읽음
        gyro_z = read_raw_data(GYRO_ZOUT_H) # 0x47, 0x48 읽음
            
            
            
            # 4. 화면에도 출력 (확인용)
        print(f" X: {gyro_x:6d} | Y: {gyro_y:6d} | Z: {gyro_z:6d}")
            
            # 0.1초 대기 (1초에 10번 저장)
        time.sleep(0.5)

except KeyboardInterrupt:
    print("\n로그 저장을 종료합니다.")
except Exception as e:
    print(f"\n에러 발생: {e}")
finally:
    bus.close()
