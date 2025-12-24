import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import paho.mqtt.client as mqtt
from datetime import datetime

# ================= 설정 영역 =================
# 1. Firebase 설정
# 다운로드 받은 서비스 계정 키 파일 경로



# 2. MQTT 설정
MQTT_BROKER = "192.168.137.106" # 사용할 브로커 주소 (예시: 공용 브로커)
MQTT_PORT = 1883
MQTT_TOPIC = "/test"  
# ============================================

# Firebase 초기화
try:
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': FIREBASE_DB_URL
    })
    print("✅ Firebase 연결 성공")
except Exception as e:
    print(f"❌ Firebase 초기화 실패: {e}")
    exit()

# MQTT 연결 성공 시 콜백
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"✅ MQTT 브로커 연결 성공 ({MQTT_BROKER})")
        client.subscribe(MQTT_TOPIC)
        print(f"📡 토픽 구독 시작: {MQTT_TOPIC}")
    else:
        print(f"❌ 연결 실패, 코드: {rc}")

# MQTT 메시지 수신 시 콜백 (여기서 Firebase로 전송)
def on_message(client, userdata, msg):
    try:
        # 1. 메시지 디코딩
        payload_str = msg.payload.decode('utf-8')
        print(f"📩 수신 데이터: {payload_str}")

        # 2. 데이터 포맷팅 (JSON이면 파싱, 아니면 문자열 그대로)
        try:
            data_to_save = json.loads(payload_str)
        except json.JSONDecodeError:
            data_to_save = {
                "raw_message": payload_str
            }

        # 3. 타임스탬프 등 메타데이터 추가 (선택사항)
        # Firebase push()를 쓰면 자동으로 시간순 정렬이 되지만, 명시적 필드를 추가할 수도 있습니다.
        # data_to_save['topic'] = msg.topic
        
        # 4. Firebase 업로드
        # push()는 고유 ID를 생성하며 데이터를 리스트처럼 쌓습니다.
        # 덮어쓰려면 set()을 사용하세요.
        custom_key = datetime.now().strftime("%Y-%m-%d_%H-%M-%S_%f")

        if "capture_array" in data_to_save:
           
            ref = db.reference('image_logs')
            ref.child(custom_key).set(data_to_save)
            print(f"🚀 Firebase 업로드 완료! ")
        else :
            ref = db.reference('sensors_logs')
            ref.child(custom_key).set(data_to_save)
            print(f"🚀 Firebase 업로드 완료! ")

    except Exception as e:
        print(f"⚠️ 데이터 처리 중 오류 발생: {e}")

# 클라이언트 생성 및 실행
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    # 네트워크 루프 실행 (Ctrl+C로 종료 전까지 계속 실행)
    client.loop_forever()
except KeyboardInterrupt:
    print("\n프로그램을 종료합니다.")
    client.disconnect()