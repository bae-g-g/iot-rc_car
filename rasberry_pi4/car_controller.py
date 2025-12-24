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
    
    global throttle_data, steering_data 
    topic = msg.topic
    
    if topic ==  "/joystick" :

        try:
            payload_str = msg.payload.decode('utf-8')
            print(f"받은 원본 데이터: {payload_str}")
        
            json_data = json.loads(payload_str)
        
            if 'cmd' in json_data:
                command = int(json_data['cmd']) # 혹시 문자열로 와도 숫자로 변환
            
            # 4. 명령에 따른 동작
            if command == 1:   # [전진 가속]
                throttle_data += 50
                
            elif command == 4: # [후진/감속]
                throttle_data -= 50
                
            elif command == 2: # [좌회전]
                steering_data += 30 
            
            elif command == 3: # [우회전]
                steering_data -= 30 
                
            elif command == 5: # [정지/초기화]
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
        
    elif topic == "/moter":  # moter -> motor (철자 수정 권장)
        print("motor")
        try:
            # 1. 디코딩 및 공백 제거 (.strip 추가)
            payload_str = msg.payload.decode('utf-8').strip()
            print(f"받은 원본 데이터: {payload_str}")

        # 2. 형 변환 시도
            data = int(payload_str)

        # 3. 로직 처리
            if data < 10:
                print("정지 (데이터가 10 미만)")
                steering_data = 255
                throttle_data = 0
            else:
                # 10 이상일 때의 처리 로직도 필요할 수 있습니다.
                pass 

        except ValueError:
        # 숫자로 변환할 수 없는 데이터가 들어왔을 때 프로그램이 죽지 않도록 방어
            print(f"오류: 숫자가 아닌 데이터가 수신되었습니다. -> {payload_str}")
        except Exception as e:
            print(f"알 수 없는 오류 발생: {e}")
            payload_str = msg.payload.decode('utf-8')
            print(f"받은 원본 데이터: {payload_str}")
        



def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("MQTT 연결 성공!")
        client.subscribe(sub_joystic_Topic)
        client.subscribe("/moter")
    else:
        print(f"연결 실패: {rc}")

# ------------------------------------------------------
# 3. MQTT 연결
# ------------------------------------------------------

broker_server_ip = "192.168.137.106"
port = 1883

sub_joystic_Topic = "/joystick"

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
