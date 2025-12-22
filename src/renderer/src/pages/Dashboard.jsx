import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Thermometer, Droplets, Sun } from 'lucide-react';

// 샘플 데이터 (시간대별 데이터)
const data = [
  { time: '09:00', temp: 22, humidity: 45, light: 300 },
  { time: '12:00', temp: 26, humidity: 40, light: 800 },
  { time: '15:00', temp: 28, humidity: 38, light: 750 },
  { time: '18:00', temp: 24, humidity: 50, light: 200 },
  { time: '21:00', temp: 21, humidity: 55, light: 10 },
];

const StatCard = ({ title, value, unit, icon: Icon, color }) => (
  <div style={{
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    flex: 1,
    minWidth: '200px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: '#666' }}>
      <Icon size={20} style={{ marginRight: '8px', color }} />
      <span>{title}</span>
    </div>
    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
      {value} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>{unit}</span>
    </div>
  </div>
);

function Dashboard() {
  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>환경 모니터링 대시보드</h1>
      
      {/* 상단 카드 섹션 */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <StatCard title="온도" value="24.5" unit="°C" icon={Thermometer} color="#ff6b6b" />
        <StatCard title="습도" value="48" unit="%" icon={Droplets} color="#4dabf7" />
        <StatCard title="조도" value="450" unit="lux" icon={Sun} color="#fcc419" />
      </div>

      {/* 차트 섹션 */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        <h3 style={{ marginBottom: '20px' }}>시간대별 데이터 변화</h3>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#ff6b6b" name="온도(°C)" strokeWidth={2} />
              <Line type="monotone" dataKey="humidity" stroke="#4dabf7" name="습도(%)" strokeWidth={2} />
              <Line type="monotone" dataKey="light" stroke="#fcc419" name="조도(lux)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;