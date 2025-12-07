from Raspi_MotorHAT import Raspi_MotorHAT, Raspi_DCMotor
from Raspi_PWM_Servo_Driver import PWM
import time
import bluetooth


mh = Raspi_MotorHAT(addr=0x6f)
myMotor = mh.getMotor(2)
servo = PWM(0x6F)
servo.setPWMFreq(60)

target_address = 'A4:E5:7C:DB:6A:A2'
port = 1 

sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)



def throttle(throttle_data):
    
    if throttle_data > 0 :
        myMotor.setSpeed(abs(throttle_data))
        myMotor.run(Raspi_MotorHAT.FORWARD)
    else :
        myMotor.setSpeed(abs(throttle_data))
        myMotor.run(Raspi_MotorHAT.BACKWARD)
   

def steering(steering_data):

    servo.setPWM(0, 0, int(steering_data))


try:
    conncet_check = sock.connect((target_address, port))
    print("✅ 연결 성공!")

    while True:
 
        data = sock.recv(30)       
        if not data:
            print("connect dismiss")
            break
            
         
        decoded_str = data.decode('utf-8').strip()
        data_list = decoded_str.split(' ')
        steering_data = int(data_list[0])
        steering_data = int( float(steering_data)*(280.0/4096.0) + 100.0)

        throttle_data = int(data_list[1])
        throttle_data = int( float(throttle_data)*(255.0/4096.0))-127
        throttle_data= throttle_data*2
        print(steering_data)
        print(throttle_data)
        steering(steering_data)
        throttle(throttle_data)
       




except bluetooth.btcommon.BluetoothError as e:
    print(f" 블루투스 연결 오류 발생: {e}")
    

finally:
    # 3. 연결 종료
    print("연결 종료.")
    sock.close()
