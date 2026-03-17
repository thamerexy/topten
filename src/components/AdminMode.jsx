import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Play, PlayCircle, Eye, EyeOff, AlertTriangle, RefreshCcw } from 'lucide-react'

export default function AdminMode() {
  const { session, questions, answers, loading, startNewGame, updateSession } = useGame()
  const [selectedTopic, setSelectedTopic] = useState('')

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <h2 className="title-glow anim-pulse">جاري التحميل...</h2>
      </div>
    )
  }

  // If no session is active, show topic selector
  if (!session || !session.is_active) {
    return (
      <div className="container anim-fade-in" style={{ maxWidth: '600px', padding: '1rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 className="title-glow" style={{ marginBottom: '2rem', textAlign: 'center' }}>إدارة اللعبة - اختيار الموضوع</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="glass-surface"
              style={{ padding: '1rem', color: '#fff', fontSize: '1.2rem', fontFamily: 'inherit', outline: 'none', border: '1px solid var(--glass-border)' }}
            >
              <option value="" disabled style={{ color: '#000' }}>اختر موضوعاً للبدء</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id} style={{ color: '#000' }}>
                  {q.topic_ar}
                </option>
              ))}
            </select>
            
            <button 
              className="btn btn-primary" 
              disabled={!selectedTopic}
              onClick={() => startNewGame(selectedTopic)}
              style={{ padding: '1.2rem', fontSize: '1.2rem', marginTop: '1rem' }}
            >
              <PlayCircle size={24} /> ابدأ اللعبة
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Active Session View
  const activeQuestion = questions.find(q => q.id === session.question_id)
  
  const handleReveal = (rank) => {
    if (session.revealed_answers.includes(rank)) return
    
    // Add points to the current team
    const answer = answers.find(a => a.rank === rank)
    const points = answer?.points || 10
    
    const updates = {
      revealed_answers: [...session.revealed_answers, rank]
    }
    
    if (session.current_team === 1) {
      updates.team_1_score = session.team_1_score + points
    } else {
      updates.team_2_score = session.team_2_score + points
    }
    
    updateSession(updates)
  }

  const handleStrike = (team) => {
    if (team === 1 && session.team_1_strikes < 3) {
      updateSession({ team_1_strikes: session.team_1_strikes + 1 })
    } else if (team === 2 && session.team_2_strikes < 3) {
      updateSession({ team_2_strikes: session.team_2_strikes + 1 })
    }
  }

  const handleSwitchTeam = (team) => {
    updateSession({ current_team: team })
  }

  const handleEndGame = () => {
    if (window.confirm('هل أنت متأكد من إنهاء اللعبة الحالية؟')) {
      updateSession({ is_active: false })
    }
  }

  return (
    <div className="container anim-slide-down" style={{ maxWidth: '800px', paddingBottom: '3rem' }}>
      
      {/* Header Info */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-highlight)' }}>
          {activeQuestion?.topic_ar}
        </h2>
        <button className="btn btn-ghost" style={{ padding: '0.5rem 1rem', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }} onClick={handleEndGame}>
           إنهاء
        </button>
      </div>

      {/* Teams Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        
        {/* Team 1 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '1.5rem', 
            textAlign: 'center', 
            border: session.current_team === 1 ? '2px solid var(--team1-color)' : '1px solid var(--glass-border)',
            boxShadow: session.current_team === 1 ? '0 0 15px var(--team1-glow)' : 'none',
            transition: 'all 0.3s'
          }}
          onClick={() => handleSwitchTeam(1)}
        >
          <h3 style={{ color: 'var(--team1-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>الفريق الأول</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{session.team_1_score}</p>
          
          {/* Strikes */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '1rem 0' }}>
            {[1,2,3].map(s => (
              <AlertTriangle key={s} size={32} color={s <= session.team_1_strikes ? 'var(--accent-red)' : 'var(--text-muted)'} />
            ))}
          </div>

          <button 
            className="btn" 
            style={{ width: '100%', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)' }}
            onClick={(e) => { e.stopPropagation(); handleStrike(1); }}
            disabled={session.team_1_strikes >= 3}
          >
            ❌ خطأ (Strike)
          </button>
        </div>

        {/* Team 2 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '1.5rem', 
            textAlign: 'center',
            border: session.current_team === 2 ? '2px solid var(--team2-color)' : '1px solid var(--glass-border)',
            boxShadow: session.current_team === 2 ? '0 0 15px var(--team2-glow)' : 'none',
            transition: 'all 0.3s'
          }}
          onClick={() => handleSwitchTeam(2)}
        >
          <h3 style={{ color: 'var(--team2-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>الفريق الثاني</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{session.team_2_score}</p>
          
          {/* Strikes */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '1rem 0' }}>
            {[1,2,3].map(s => (
              <AlertTriangle key={s} size={32} color={s <= session.team_2_strikes ? 'var(--accent-red)' : 'var(--text-muted)'} />
            ))}
          </div>

          <button 
            className="btn" 
            style={{ width: '100%', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)' }}
            onClick={(e) => { e.stopPropagation(); handleStrike(2); }}
            disabled={session.team_2_strikes >= 3}
          >
            ❌ خطأ (Strike)
          </button>
        </div>

      </div>

      {/* Answers Grid for Admin */}
      <h3 className="title-glow" style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>لوحة الإجابات</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {answers.map((ans, idx) => {
          const isRevealed = session.revealed_answers.includes(ans.rank)
          
          return (
            <div 
              key={ans.id}
              className="glass-panel flex-between"
              style={{ 
                padding: '1rem 1.5rem',
                backgroundColor: isRevealed ? 'rgba(34, 197, 94, 0.2)' : 'var(--bg-card)',
                borderColor: isRevealed ? 'var(--accent-green)' : 'var(--glass-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--btn-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {ans.rank}
                </div>
                <span style={{ fontSize: '1.3rem', fontWeight: '600', color: isRevealed ? '#fff' : 'var(--text-muted)' }}>
                  {ans.answer_ar}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="badge" style={{ background: 'var(--bg-surface)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
                  {ans.points} نقطة
                </span>
                
                <button 
                  className="btn"
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: isRevealed ? 'transparent' : 'var(--accent-green)',
                    color: isRevealed ? 'var(--accent-green)' : '#fff',
                    border: isRevealed ? '1px solid var(--accent-green)' : 'none'
                  }}
                  onClick={() => handleReveal(ans.rank)}
                  disabled={isRevealed}
                >
                  {isRevealed ? <Eye size={20} /> : <EyeOff size={20} />}
                  {isRevealed ? 'مكشوف' : 'كشف'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
