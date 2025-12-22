import joystickCss from './joystick.module.css'
import JoystrickController from '../components/JoystickController'
import CameraController from '../components/CameraController'
import CmdBox from '../components/CmdBox'

function Joystick() {
  return (
    <div className={joystickCss.main1}>
      <div style={{ flex: 1 }}>
        <JoystrickController></JoystrickController>
      </div>
      <div className={joystickCss.main1_2} style={{ flex: 1 }}>
        <CameraController></CameraController>
        <CmdBox></CmdBox>
      </div>
    </div>
  )
}

export default Joystick
