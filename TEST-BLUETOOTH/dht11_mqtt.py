import time
import board
import adafruit_dht

import json
import paho.mqtt.client as mqtt

#broker ip 
broker_server_ip = "192.168.137.106"
port = 1883
#topic fromController
pubTopic = "/test"
#topic toController
subTopic = "/test"

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.connect(broker_server_ip, port)


# DHT11 센서인 경우:
dhtDevice = adafruit_dht.DHT11(board.D4)


while True:
    try:
      
        temperature_c = dhtDevice.temperature
        humidity = dhtDevice.humidity

        try:
            # 3. 브로커 연결
     
            client.connect(broker_server_ip, port)

            # 4. 메시지 전송 (Publish)
            data = {
                "temperature": temperature_c,
                "humidity": humidity
            } 
            message = json.dumps(data)

            client.loop_start()       # 통신 루프 시작 (비동기 처리를 위해 필요)

            # publish(토픽, 메시지)
            info = client.publish(pubTopic, message)

            # 전송이 실제로 완료될 때까지 기다림 (선택 사항)
            info.wait_for_publish()


            client.loop_stop() # 루프 종료
            client.disconnect() # 연결 종료

        except Exception as e:
            print(f"에러 발생: {e}")

    except RuntimeError as error:
        # 센서 읽기 실패 시 자주 발생하는 에러 (무시하고 계속 진행)
        print(f"읽기 오류 (재시도 중): {error.args[0]}")
        time.sleep(2.0)
        continue
    except Exception as error:
        dhtDevice.exit()
        raise error

    # 2초 대기 (DHT 센서는 2초 이상의 간격이 필요함)
    time.sleep(2.0)

