import cameraController from './cameraController.module.css'
import { useSensorStore } from '../zustand/state'

function CameraController() {
  // const [imageSrc] = useState(null)
  const { image } = useSensorStore()
  const imageDisplay = image ? 'block' : 'none'

  return (
    <div className={cameraController.containerStyle}>
      {image ? (
        <img
          src={image.startsWith('data:image') ? image : 'data:image/png;base64, ' + image}
          alt="Camera Stream"
          className={cameraController.imageStyle}
          style={{ display: imageDisplay }}
        />
      ) : (
        <div className={{ color: '#fff' }}>No Carmera</div>
      )}
    </div>
  )
}

export default CameraController
