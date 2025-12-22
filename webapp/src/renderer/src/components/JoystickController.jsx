import joystickController from './joystickController.module.css'

function JoystickController() {
  // 전체 컨테이너: 3x3 그리드
  return (
    <div className={joystickController.containerStyle}>
      {/* 1행 */}
      <div />
      <button className={joystickController.buttonStyle}>▲</button>
      <div />

      {/* 2행 */}
      <button className={joystickController.buttonStyle}>◀</button>
      <button className={joystickController.buttonStyle}>●</button>
      <button className={joystickController.buttonStyle}>▶</button>

      {/* 3행 */}
      <div />
      <button className={joystickController.buttonStyle}>▼</button>
      <div />
    </div>
  )
}

export default JoystickController
