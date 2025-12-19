// src/components/AppLayout.jsx
import { Outlet } from 'react-router-dom'
import Header from './Header' // Header 컴포넌트 임포트

function AppLayout() {
  return (
    <div style={{ width: '100%', padding: '10px' }}>
      <Header />
      <main style={{ flex: 1, width: '100%' }}>
        {/* Outlet이 하위 라우트(Dashboard, Joystick)를 렌더링합니다 */}
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
