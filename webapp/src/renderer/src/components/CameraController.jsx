import { useState } from 'react'
import cameraController from './cameraController.module.css'

function CameraController() {
  const [imageSrc] = useState(null)

  const imageDisplay = imageSrc ? 'block' : 'none'

  return (
    <div className={cameraController.containerStyle}>
      {imageSrc ? (
        <img
          src={imageSrc}
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
