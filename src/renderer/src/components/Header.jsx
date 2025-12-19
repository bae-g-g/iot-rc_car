import { useNavigate } from 'react-router-dom'
import { usePageStore } from '../zustand/state'

function Header() {
  const navigate = useNavigate()
  const { page, changePage } = usePageStore((state) => state)

  const handleDashboardClick = () => {
    navigate('/')
    changePage(0)
  }

  const handleJoystickClick = () => {
    navigate('/joystick')
    changePage(1)
  }

  return (
    <>
      <div style={{ position: 'absolute', top: 0, right: 0, height: '50px', zIndex: 100 }}>
        <div
          id="header_tab"
          style={{
            height: '50px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <button onClick={handleDashboardClick} disabled={page === 0}>
            Dashboard
          </button>
          <button onClick={handleJoystickClick} disabled={page === 1}>
            Joystick
          </button>
        </div>
      </div>
    </>
  )
}

export default Header
