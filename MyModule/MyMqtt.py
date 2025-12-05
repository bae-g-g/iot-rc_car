import paho.mqtt.client as mqtt
import time

class MyMqtt():
    def __init__(self):
        super().__init__()
        self.client = mqtt.Client()
        self.TOPICS = ["test/mosquitto"]
        self.BROKER = "broker.hivemq.com"
        self.PORT = 1883
        self.On = False
        self.client.on_connect = self.on_connect
    

    def connect(self, TOPICS = [], BROKER = "", PORT = 0):
        if TOPICS is not None:
            self.TOPIC = TOPICS
        if BROKER is not None:
            self.BROKER = BROKER
        if PORT > 1000:
            self.PORT = PORT
        
        self.client.connect(self.BROKER, self.PORT, 60)
        self.client.loop_start()

        # 이따구로 만드러 뒀기 때문에 모듈 asyncio-mqtt로 고쳐야 된다...
        _count = 0
        while 1:
            if self.On is True:
                break
            if _count > 20:
                return False
            _count += 1
            time.sleep(0.3)

        return True
    
    def subscriber(self):
        if self.On is False:
            print("Is Not Connected Brocker !!!")
            return
        
        self.client.on_message = self.on_message

    
    def publisher(self):
        if self.On is False:
            print("Is Not Connected Brocker !!!")
            return
        
    
    def subscriber_start(self, TOPICS = [], BROKER = "", PORT = 0):
        if TOPICS is not None:
            self.TOPIC = TOPICS
        if BROKER is not None:
            self.BROKER = BROKER
        if PORT > 1000:
            self.PORT = PORT
        
        self.client.on_message = self.on_message
        self.client.connect(self.BROKER, self.PORT, 60)
        self.client.loop_forever()
        
    
    def publisher_start(self, TOPICS = [], BROKER = "", PORT = 0):
        if TOPICS is not None:
            self.TOPIC = TOPICS
        if BROKER is not None:
            self.BROKER = BROKER
        if PORT > 1000:
            self.PORT = PORT
        
        self.client.connect(self.BROKER, self.PORT, 60)


    def on_connect(self, client, userdata, flags, rc):
        print("Connected with result code : "+ str(rc))
        if rc == 0:
            # 다중 구독
            self.client.subscribe(self.TOPICS[0])
            self.On = True
        else:
            self.On = False


    def on_message(self, client, userdata, msg):
        print(f"[{msg.topic}] {msg.payload.decode()}") 


    def disconnect(self):
        self.client.disconnect()

    
    def send_publish(self, TOPIC, msg):
        self.client.publish(TOPIC, msg)

