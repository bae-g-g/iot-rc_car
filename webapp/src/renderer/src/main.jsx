import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Joystick from './pages/Joystick'
import Dashboard from './pages/Dashboard'
import AppLayout from './components/AppLayout'

import { client } from './mqtt/subscriber'
import { upscaleImage_Test } from './huggingfaceModel/upscale'
import { objectDection } from './huggingfaceModel/objectdection'

(async () => {
  const curTime = new Date().getTime()
  upscaleImage_Test(null).then((res) => {
    console.log(res)
    objectDection(res).then((res) => {
      const resultTime = new Date().getTime();
      console.log('결과 !!!', res, resultTime - curTime)
    })
  })
})()

// 되면 파일 따로 만들기
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // AppLayout이 기본 레이아웃이 됩니다.
    children: [
      // 하위 페이지들은 AppLayout 내부의 Outlet에 표시됩니다.
      {
        index: true, // 부모 경로('/')와 동일할 때 기본으로 렌더링
        element: <Dashboard />
      },
      {
        path: 'joystick', // 완성된 경로는 '/joystick'
        element: <Joystick />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
