from Raspi_MotorHAT import Raspi_MotorHAT, Raspi_DCMotor
from Raspi_PWM_Servo_Driver import PWM
import time
import paho.mqtt.client as mqtt
import json

# ------------------------------------------------------
# 1. 설정 및 초기화
# ------------------------------------------------------
mh = Raspi_MotorHAT(addr=0x6f)
myMotor = mh.getMotor(2)  # 0~255
servo = PWM(0x6F)  # 중앙 255 / 우측 한계 370 / 좌측 한계 110
servo.setPWMFreq(60)

# 전역 변수 초기값 설정
throttle_data = 0
steering_data = 255

# ------------------------------------------------------
# 2. MQTT 메시지 처리 (수신부)
# ------------------------------------------------------
def on_message(client, userdata, msg):
    # [중요] 함수 밖의 변수를 수정하려면 global 키워드가 필수입니다!
    global throttle_data, steering_data 

    try:
        payload_str = msg.payload.decode('utf-8')
        print(f"받은 원본 데이터: {payload_str}")
        
        json_data = json.loads(payload_str)
        
        if 'cmd' in json_data:
            command = int(json_data['cmd']) # 혹시 문자열로 와도 숫자로 변환
            
            # 4. 명령에 따른 동작
            if command == 1:   # [전진 가속]
                print("Command: 1 (전진)")
                throttle_data += 50
                
            elif command == 4: # [후진/감속]
                print("Command: 2 (후진)")
                throttle_data -= 50
                
            elif command == 2: # [좌회전]
                print("Command: 3 (좌회전)")
                steering_data += 30 
            
            elif command == 3: # [우회전]
                print("Command: 4 (우회전)")
                steering_data -= 30 
                
            elif command == 5: # [정지/초기화]
                print("Command: 5 (정지)")
                steering_data = 255
                throttle_data = 0
    
            else:
                print("알 수 없는 명령")

        
        if throttle_data > 255: throttle_data = 255
        if throttle_data < -255: throttle_data = -255
        
        
        if steering_data > 375: steering_data = 375
        if steering_data < 105: steering_data = 105

        print(f"현재 상태 -> 조향: {steering_data}, 속도: {throttle_data}")
            
    except Exception as e:
        print(f"에러 발생: {e}")

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("MQTT 연결 성공!")
        client.subscribe(subTopic)
    else:
        print(f"연결 실패: {rc}")

# ------------------------------------------------------
# 3. MQTT 연결
# ------------------------------------------------------
broker_server_ip = "192.168.137.106"
port = 1883
subTopic = "/joystick"

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

try:
    client.connect(broker_server_ip, port)
    client.loop_start() 
except Exception as e:
    print(f"연결 에러: {e}")

# ------------------------------------------------------
# 4. 메인 제어 루프 (실행부)
# ------------------------------------------------------
try:
    while True:        

        servo.setPWM(0, 0, int(steering_data))
        current_throttle = int(throttle_data)
        
        if current_throttle > 0:
            myMotor.setSpeed(current_throttle)
            myMotor.run(Raspi_MotorHAT.FORWARD)
        elif current_throttle < 0:
            myMotor.setSpeed(abs(current_throttle))
            myMotor.run(Raspi_MotorHAT.BACKWARD)
        else:
            myMotor.setSpeed(0)
            myMotor.run(Raspi_MotorHAT.RELEASE)

        time.sleep(0.05)

except KeyboardInterrupt:
    print("종료")
    myMotor.run(Raspi_MotorHAT.RELEASE)
    client.loop_stop()
    client.disconnect()
