
#include "BluetoothSerial.h"
BluetoothSerial SerialBT;

const int POT_STEERING_PIN = 34; // 조향 (좌우) 가변저항
const int POT_THROTTLE_PIN = 35; // 스로틀 (전후) 가변저항


void setup() {
  SerialBT.begin("ESP32_controller");
}

void loop() {
 if (SerialBT.hasClient()) {
    
    int steeringVal = analogRead(POT_STEERING_PIN);
    int throttleVal = analogRead(POT_THROTTLE_PIN);
    
    String data =  String(steeringVal) + " " + String(throttleVal);
    SerialBT.print(data);
    
    delay(50); // 50ms마다 현재 가변저항값 전송
    
  } 
  else {
    delay(1000); // 연결된 상태가 아니라면 1초간 대기
  }
}