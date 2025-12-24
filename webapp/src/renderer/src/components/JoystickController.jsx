import joystickController from './joystickController.module.css'
import { sendJoystickCommand } from '../mqtt/publisher'

function JoystickController() {
  // 전체 컨테이너: 3x3 그리드
  // 매핑: ▲(1), ▼(2), ◀(3), ▶(4), ●(5)
  return (
    <div className={joystickController.containerStyle}>
      {/* 1행 */}
      <div />
      <button className={joystickController.buttonStyle} onClick={() => sendJoystickCommand('1')}>
        ▲
      </button>
      <div />

      {/* 2행 */}
      <button className={joystickController.buttonStyle} onClick={() => sendJoystickCommand('2')}>
        ◀
      </button>
      <button className={joystickController.buttonStyle} onClick={() => sendJoystickCommand('5')}>
        ●
      </button>
      <button className={joystickController.buttonStyle} onClick={() => sendJoystickCommand('3')}>
        ▶
      </button>

      {/* 3행 */}
      <div />
      <button className={joystickController.buttonStyle} onClick={() => sendJoystickCommand('4')}>
        ▼
      </button>
      <div />
    </div>
  )
}

export default JoystickController
