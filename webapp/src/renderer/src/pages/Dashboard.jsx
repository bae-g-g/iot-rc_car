import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Thermometer, Droplets, Activity, Wifi } from 'lucide-react'
import styles from './Dashboard.module.css'
import { useSensorStore } from '../zustand/state'
import { useState, useEffect } from 'react'

// eslint-disable-next-line react/prop-types
const StatCard = ({ title, value, unit, icon: Icon, color }) => (
  <div className={styles.statCard}>
    <div className={styles.cardHeader}>
      <Icon size={20} style={{ marginRight: '8px', color }} />
      <span>{title}</span>
    </div>
    <div className={styles.cardValue}>
      {value} <span className={styles.cardUnit}>{unit}</span>
    </div>
  </div>
)

function Dashboard() {
  const { temp, humid, gyro, ultrasonic, timeStr } = useSensorStore()
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChartData((prev) => {
      const newData = [
        ...prev,
        {
          time: timeStr,
          temp: temp,
          humidity: humid,
          ultrasonic: ultrasonic
        }
      ]

      console.log(newData)
      // Keep only the latest 20 data points
      if (newData.length > 20) {
        return newData.slice(newData.length - 20)
      }
      return newData
    })
  }, [temp, humid, ultrasonic, timeStr])

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>환경 모니터링 대시보드</h1>

      {/* 상단 카드 섹션 */}
      <div className={styles.cardsContainer}>
        <StatCard title="온도" value={temp} unit="°C" icon={Thermometer} color="#ff6b6b" />
        <StatCard title="습도" value={humid} unit="%" icon={Droplets} color="#4dabf7" />
        <StatCard title="초음파" value={ultrasonic} unit="cm" icon={Wifi} color="#fcc419" />
        <StatCard
          title="자이로"
          value={`X:${gyro?.x} Y:${gyro?.y} Z:${gyro?.z}`}
          unit=""
          icon={Activity}
          color="#20c997"
        />
      </div>

      {/* 차트 섹션 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>시간대별 데이터 변화</h3>
        <div className={styles.chartContainer}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ev-c-gray-2)" />
              <XAxis dataKey="time" stroke="var(--ev-c-text-2)" />
              <YAxis stroke="var(--ev-c-text-2)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--ev-c-black-mute)',
                  border: '1px solid var(--ev-c-gray-3)',
                  color: 'var(--ev-c-text-1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#ff6b6b"
                name="온도(°C)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#4dabf7"
                name="습도(%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="ultrasonic"
                stroke="#fcc419"
                name="초음파(cm)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
