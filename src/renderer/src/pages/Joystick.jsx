import joystickCss from './joystick.module.css'
import JoystrickController from '../components/JoystickController'
import CameraController from '../components/CameraController'

function Joystick() {
  return (
    <div className={joystickCss.main1}>
      <div style={{ flex: 1 }}>
        <JoystrickController></JoystrickController>
      </div>
      <div className={joystickCss.main1_2} style={{ flex: 1 }}>
        <CameraController></CameraController>
      </div>
    </div>
  )
}

export default Joystick
