
import cv2
from picamera2 import Picamera2
import time
import base64
import numpy as np
import json
import paho.mqtt.client as mqtt

picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"format": "BGR888", "size": (640, 480)}))
picam2.start()

# -- MQTT 설정 ---
broker_server_ip = "192.168.137.106"
port = 1883
pubTopic = "/test"

# --- 1. 클라이언트 생성 및 연결 ---
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

try:
    client.connect(broker_server_ip, port)
    client.loop_start() # 백그라운드에서 네트워크 메시지 처리를 담당하는 스레드 시작
    print(f"MQTT 브로커({broker_server_ip})에 연결되었습니다.")
except Exception as e:
    print(f"초기 연결 실패: {e}")
    # 연결 실패 시 프로그램 종료



try:
    while True:
        try:
            #센서 데이터 읽기

            frame = picam2.capture_array()
            
            if frame is not None:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

                success, encoded_img = cv2.imencode('.jpg', frame_rgb) 
                
                if success:
                    b64_string = base64.b64encode(encoded_img).decode('utf-8')
                    
                    data = {
                        "capture_array": b64_string,
                        "shape": frame.shape, 
                        "timestamp": time.time()
                    }
                    
                    message = json.dumps(data)
                    info = client.publish(pubTopic, message)
                    print("JSON 생성 성공, 데이터 길이:", len(message))

            else:
                print("캡쳐 실패")

    
        except Exception as error:
            print(f"에러 발생: {error} 실행 종료")
            picam2.stop()
            client.loop_stop()
            client.disconnect()
            raise error
            
        # 2초 대기
        time.sleep(2.0)

except KeyboardInterrupt:
    print("프로그램 종료 요청 받음")

finally:
    # --- 4. 프로그램 종료 시 정리 (마지막에 1회 실행) ---
    print("연결 종료 및 리소스 해제")
    client.loop_stop()
    client.disconnect()
    picam2.stop()
