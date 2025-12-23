import time
import board
import adafruit_dht
import json
import paho.mqtt.client as mqtt
from gpiozero import DistanceSensor
import smbus2 

# ===========================================================
# 1. 설정 및 초기화 (안전장치 추가)
# ===========================================================

# MQTT 설정
broker_server_ip = "192.168.137.106"
port = 1883
pubTopic = "/test"

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

# MQTT 연결
try:
    client.username_pw_set("user1", "pw")
    client.connect(broker_server_ip, port)
    client.loop_start()
    print(f" MQTT 브로커({broker_server_ip}) 연결 성공")
except Exception as e:
    print(f" MQTT 초기 연결 실패: {e}")
   

# ----------------------------------------
# 하드웨어 초기화 (실패해도 프로그램이 죽지 않게 Try 처리)
# ----------------------------------------

# DHT11
try:
    DHT11 = adafruit_dht.DHT11(board.D4)
except Exception as e:
    print(f" DHT11 초기화 실패: {e}")
    DHT11 = None

# 초음파
try:
    HC_SR04 = DistanceSensor(echo=24, trigger=23)
except Exception as e:
    print(f" 초음파 센서 초기화 실패: {e}")
    HC_SR04 = None

# 자이로 (I2C)
bus = None
try:
    bus = smbus2.SMBus(1)
    bus.write_byte_data(0x68, 0x6B, 0) # Wake up
    print("자이로 센서 초기화 성공")
except Exception as e:
    print(f" 자이로 센서 초기화 실패 (선 연결 확인): {e}")

# ===========================================================
# 2. 안전한 센서 읽기 함수들 (Safe Reader Functions)
# ===========================================================

def get_gyro_data():
    global bus
    if bus is None: return None

    try:
        
        def read_word(addr):
            high = bus.read_byte_data(0x68, addr)
            low = bus.read_byte_data(0x68, addr + 1)
            val = (high << 8) | low
            if val > 32768:
                val = val - 65536
            return val

        data = {
            "X": read_word(0x43),
            "Y": read_word(0x45),
            "Z": read_word(0x47)
        }
        return data

    except OSError:
        
        print("Error: 자이로 I/O 에러")
        return None
    except Exception as e:
        print(f"Error: 자이로 읽기 중 알 수 없는 오류: {e}")
        return None

def get_dht_data():
    """온습도 읽기. 실패 시 (None, None) 반환"""
    if DHT11 is None: return None, None
    
    try:
        t = DHT11.temperature
        h = DHT11.humidity
        return t, h
    except RuntimeError:
        
        return None, None
    except Exception as e:
        print(f"Error: DHT 읽기 오류: {e}")
        return None, None

def get_ultrasonic_data():
    
    if HC_SR04 is None: return None

    try:
        dist = HC_SR04.distance * 100
        return round(dist, 2)
    except Exception as e:
        print(f"Error: 초음파 읽기 오류: {e}")
        return None

# ===========================================================
# 3. 메인 실행 루프
# ===========================================================

try:
    while True:
        gyro_result = get_gyro_data()
        temp, hum = get_dht_data()
        dist_cm = get_ultrasonic_data()

        data = {
            "timestamp": time.time(), # 언제 데이터인지 알면 좋음
            "temperature": temp,
            "humidity": hum,
            "ultrasonic": dist_cm,
            "gyro": gyro_result  
        }

        
        payload = json.dumps(data)
        
        try:
            info = client.publish(pubTopic, payload)
        except Exception as e:
            print(f" MQTT 전송 실패: {e}")

        time.sleep(0.5)

except KeyboardInterrupt:
    print("\n 프로그램 종료 요청")

finally:
    print(" 리소스 정리 중...")
    client.loop_stop()
    client.disconnect()
    
    if DHT11 is not None: DHT11.exit()
    if bus is not None: bus.close()
    if HC_SR04 is not None: HC_SR04.close()
    
    print("종료 완료.")