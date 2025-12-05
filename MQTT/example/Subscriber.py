# 모듈 추가
import os, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, ROOT)

from MyModule.MyMqtt import MyMqtt

BROKER = "broker.hivemq.com"      # 또는 Mosquitto 서버 IP
PORT = 1883
TOPICS = ["test/mosquitto"]

mqtt = MyMqtt()
mqtt.subscriber_start(TOPICS, BROKER, PORT)



# import time
# mqtt = MyMqtt()
# if mqtt.connect(TOPICS, BROKER, PORT) is False:
#     print("실행 불가 !!!")
#     exit(0)

# mqtt.subscriber()
