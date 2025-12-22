import { useState } from 'react'
import styles from './CmdBox.module.css' // CmdBox.module.css로 임포트 경로 수정

function CmdBox() {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (text.trim()) {
      console.log('제출된 내용:', text)
      setText('') // 제출 후 초기화
    }
  }

  const handleKeyDown = (e) => {
    // Shift + Enter는 줄바꿈이 되어야 하므로 제외
    // 그냥 Enter만 눌렀을 때 handleSubmit 실행
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // 엔터 시 줄바꿈 방지
      handleSubmit()
    }
  }

  return (
    <div className={styles.cmdBoxStyle}>
      {/* 입력창 영역 */}
      <textarea
        className={styles.cmdBoxMl}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요 (Enter로 전송)"
      />

      {/* 하단 버튼 영역 */}
      <div>
        <button onClick={handleSubmit} className={styles.cmdBoxBtn}>
          전송
        </button>
      </div>
    </div>
  )
}

export default CmdBox
