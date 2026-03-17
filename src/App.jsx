import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import AdminMode from './components/AdminMode'
import ContestantMode from './components/ContestantMode'
import { Trophy } from 'lucide-react'

function App() {
  return (
    <div className="app-container">
      <header className="glass-panel" style={{ padding: '1rem', margin: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-highlight)' }}>
          <Trophy size={28} />
          <h1 className="title-glow" style={{ fontSize: '1.5rem', margin: 0 }}>توب 10 (Top 10)</h1>
        </Link>
      </header>

      <main style={{ flex: 1, position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminMode />} />
          <Route path="/contestant" element={<ContestantMode />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
