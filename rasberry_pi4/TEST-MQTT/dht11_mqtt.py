import time
import board
import adafruit_dht
import json
import paho.mqtt.client as mqtt

# DHT11 센서 설정
dhtDevice = adafruit_dht.DHT11(board.D4)

# -- MQTT 설정 ---
broker_server_ip = "192.168.137.106"
port = 1883
pubTopic = "/test"

# --- 1. 클라이언트 생성 및 연결 ---
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

try:
    client.username_pw_set("user1", "pw")
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
            temperature_c = dhtDevice.temperature
            humidity = dhtDevice.humidity
            
            # 센서 데이터가 유효한지 확인 (None이 들어오는 경우가 있음)
            if temperature_c is not None and humidity is not None:
                data = {
                    "temperature": temperature_c,
                    "humidity": humidity
                }
                # json 형태로 전환
                message = json.dumps(data)
                
                # 퍼블리시
                info = client.publish(pubTopic, message) 

            else:
                print("센서 데이터 읽기 실패 (값 없음)")

        except RuntimeError as error:
            print(f"런타임 에러 발생 : {error.args[0]}")
            continue

        except Exception as error:
            print(f"일반 에러 발생: {error} 실행 종료")
            dhtDevice.exit()
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
    dhtDevice.exit()