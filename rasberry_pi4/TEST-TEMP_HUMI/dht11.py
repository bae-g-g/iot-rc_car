import time
import board
import adafruit_dht핀
import json

#7번
dhtDevice = adafruit_dht.DHT11(board.D4)

try:
    while True:
        try:
            temperature_c = dhtDevice.temperature
            humidity = dhtDevice.humidity

            # 센서 데이터가 유효한지 확인 (None이 들어오는 경우가 있음)
            if temperature_c is not None and humidity is not None:
                data = {
                    "temperature": temperature_c,
                    "humidity": humidity
                }
                message = json.dumps(data)
                print(message)
            else:
                print("유효한 값 읽지 못함")

            continue
        except RuntimeError as error:
            print(f"런타임 에러 발생: {error}")
        except Exception as error:
            print(f"일반 에러 발생: {error} 실행 종료")
            dhtDevice.exit()
            raise error
        #1회 실행 후 2초간 휴식
        time.sleep(2.0)
finally:
# --- 4. 프로그램 종료 시 정리 (마지막에 1회 실행) ---
    print("종료")
    dhtDevice.exit()