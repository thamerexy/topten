import { useNavigate } from 'react-router-dom'
import { Play, Settings, Users } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="container flex-center anim-fade-in" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <h1 className="title-glow" style={{ fontSize: '3rem', marginBottom: '1rem' }}>لعبة توب 10</h1>
        <p className="anim-slide-down" style={{ marginBottom: '3rem', color: 'var(--text-muted)' }}>
          شاشة المدير للتحكم باللعبة، وشاشة المتسابقين للعرض
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <button 
            className="btn btn-primary" 
            style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(135deg, var(--team1-color), #2563eb)' }}
            onClick={() => navigate('/admin')}
          >
            <Settings size={48} />
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>شاشة المدير (Admin)</span>
            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>التحكم وإظهار الإجابات</span>
          </button>

          <button 
            className="btn btn-primary" 
            style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(135deg, var(--team2-color), #db2777)' }}
            onClick={() => navigate('/contestant')}
          >
            <Users size={48} />
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>شاشة العرض (Contestants)</span>
            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>عرض اللوحة للمتسابقين</span>
          </button>

        </div>
      </div>
    </div>
  )
}
