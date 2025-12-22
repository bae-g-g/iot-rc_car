import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Sun } from 'lucide-react';
import styles from './Dashboard.module.css';

// 샘플 데이터 (시간대별 데이터)
const data = [
  { time: '09:00', temp: 22, humidity: 45, light: 300 },
  { time: '12:00', temp: 26, humidity: 40, light: 800 },
  { time: '15:00', temp: 28, humidity: 38, light: 750 },
  { time: '18:00', temp: 24, humidity: 50, light: 200 },
  { time: '21:00', temp: 21, humidity: 55, light: 10 },
];

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
);

function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>환경 모니터링 대시보드</h1>

      {/* 상단 카드 섹션 */}
      <div className={styles.cardsContainer}>
        <StatCard title="온도" value="24.5" unit="°C" icon={Thermometer} color="#ff6b6b" />
        <StatCard title="습도" value="48" unit="%" icon={Droplets} color="#4dabf7" />
        <StatCard title="조도" value="450" unit="lux" icon={Sun} color="#fcc419" />
      </div>

      {/* 차트 섹션 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>시간대별 데이터 변화</h3>
        <div className={styles.chartContainer}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ev-c-gray-2)" />
              <XAxis dataKey="time" stroke="var(--ev-c-text-2)" />
              <YAxis stroke="var(--ev-c-text-2)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--ev-c-black-mute)', border: '1px solid var(--ev-c-gray-3)', color: 'var(--ev-c-text-1)' }}
              />
              <Line type="monotone" dataKey="temp" stroke="#ff6b6b" name="온도(°C)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="humidity" stroke="#4dabf7" name="습도(%)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="light" stroke="#fcc419" name="조도(lux)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;