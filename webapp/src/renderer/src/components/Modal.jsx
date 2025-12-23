// Modal.jsx (팝업 컴포넌트)
// import './Modal.module.css'

const Modal = ({ onClose, imageUrl }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {' '}
        {/* 클릭 이벤트 전파 막기 */}
        <img src={imageUrl} alt="팝업 이미지" className="modal-image" />
        <button onClick={onClose} className="close-button">
          닫기
        </button>
      </div>
    </div>
  )
}

export default Modal
