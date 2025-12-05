# 모듈 추가
import os, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, ROOT)

from MyModule.MyMqtt import MyMqtt
import time

BROKER = "broker.hivemq.com"    # 또는 Mosquitto 서버 IP
PORT = 1883
TOPIC = "test/mosquitto"

client = MyMqtt()
client.publisher_start([], BROKER, PORT)

for i in range(5):
    msg = f"Mosquitto Test Message {i}"
    client.send_publish(TOPIC, msg)
    print("Sent:", msg)
    time.sleep(1)

client.disconnect()
