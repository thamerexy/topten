import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { PlayCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react'

export default function AdminMode() {
  const { session, questions, answers, loading, startNewGame, updateSession } = useGame()
  const [selectedTopic, setSelectedTopic] = useState('')
  const [team1Name, setTeam1Name] = useState('الفريق الأول')
  const [team2Name, setTeam2Name] = useState('الفريق الثاني')

  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    if (!selectedTopic || !team1Name || !team2Name) return
    setIsStarting(true)
    try {
      await startNewGame(selectedTopic, team1Name, team2Name)
    } catch (err) {
      console.error(err)
      alert("Error starting game. Please check your connection.")
    } finally {
      setIsStarting(false)
    }
  }

  const handleHardReset = () => {
    if (confirm("سيتم إعادة تشغيل التطبيق بالكامل. هل أنت متأكد؟")) {
      window.location.reload(true)
    }
  }

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '2rem' }}>
        <h2 className="title-glow anim-pulse">جاري التحميل...</h2>
        <button className="btn" onClick={handleHardReset} style={{ fontSize: '0.9rem', opacity: 0.7 }}>إعادة تحميل الصفحة</button>
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
            <input 
              type="text" 
              value={team1Name} 
              onChange={e => setTeam1Name(e.target.value)} 
              placeholder="اسم الفريق الأول" 
              maxLength={30}
              className="glass-surface" 
              style={{ padding: '1rem', color: '#fff', fontSize: '1.2rem', fontFamily: 'inherit', outline: 'none', border: '1px solid var(--team1-color)' }}
            />
            
            <input 
              type="text" 
              value={team2Name} 
              onChange={e => setTeam2Name(e.target.value)} 
              placeholder="اسم الفريق الثاني" 
              maxLength={30}
              className="glass-surface" 
              style={{ padding: '1rem', color: '#fff', fontSize: '1.2rem', fontFamily: 'inherit', outline: 'none', border: '1px solid var(--team2-color)' }}
            />

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
              disabled={!selectedTopic || !team1Name || !team2Name || isStarting}
              onClick={handleStart}
              style={{ padding: '1.2rem', fontSize: '1.2rem', marginTop: '1rem' }}
            >
              {isStarting ? <div className="anim-pulse">جاري التحميل...</div> : <><PlayCircle size={24} /> ابدأ اللعبة</>}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Active Session View
  const activeQuestion = questions.find(q => q.id === session.question_id)

  // If we have a session but data isn't fully loaded yet (race condition)
  if (!activeQuestion && session.is_active) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <h2 className="title-glow anim-pulse">جاري تحميل بيانات السؤال...</h2>
      </div>
    )
  }
  
  // Safely parse JSONB column object
  let revealedMap = {}
  try {
    revealedMap = typeof session.revealed_answers === 'string' ? JSON.parse(session.revealed_answers) : session.revealed_answers || {}
  } catch(e) { /* ignore */ }
  if (Array.isArray(revealedMap)) revealedMap = {};
  
  // Calculate if the game is over
  const totalRevealed = Object.keys(revealedMap).length
  const allRevealed = totalRevealed === 10
  const bothEliminated = session.team_1_strikes >= 3 && session.team_2_strikes >= 3
  const isGameOver = allRevealed || bothEliminated

  const t1Name = session.team_1_name || 'الفريق الأول'
  const t2Name = session.team_2_name || 'الفريق الثاني'
  
  const handleReveal = (rank) => {
    if (revealedMap[rank] || isGameOver) return
    
    // Determine points and update the score map
    const answer = answers.find(a => a.rank === rank)
    const points = answer?.points || 10
    
    // Add rank to the current team's solved list
    const newRevealedMap = { ...revealedMap, [rank]: session.current_team }
    
    const updates = {
      revealed_answers: newRevealedMap
    }
    
    // Add points to current team
    if (session.current_team === 1) {
      updates.team_1_score = session.team_1_score + points
    } else {
      updates.team_2_score = session.team_2_score + points
    }

    // Check if game ends
    if (Object.keys(newRevealedMap).length >= 10) {
      updates.is_active = false // All 10 revealed -> auto end game
    } else {
      // User rule: Auto-switch turn on correct answer too!
      // But we ONLY pass the turn if the other team has less than 3 strikes.
      const otherTeam = session.current_team === 1 ? 2 : 1;
      const otherTeamStrikes = otherTeam === 1 ? session.team_1_strikes : session.team_2_strikes;
      
      if (otherTeamStrikes < 3) {
           updates.current_team = otherTeam; // Pass turn
      }
    }
    
    updateSession(updates)
  }

  const handleStrike = (team) => {
    if (isGameOver) return
    
    const updates = {}
    
    let newTeam1Strikes = session.team_1_strikes
    let newTeam2Strikes = session.team_2_strikes

    if (team === 1 && newTeam1Strikes < 3) {
      newTeam1Strikes += 1;
      updates.team_1_strikes = newTeam1Strikes;
    } else if (team === 2 && newTeam2Strikes < 3) {
      newTeam2Strikes += 1;
      updates.team_2_strikes = newTeam2Strikes;
    }

    // Check if both teams are locked out -> game over
    if (newTeam1Strikes >= 3 && newTeam2Strikes >= 3) {
      updates.is_active = false
    } else {
      // Automatic Turn Switching Rule: 
      // If the current team gets a strike, the turn PASSES to the other team.
      // But we ONLY pass the turn if the other team has less than 3 strikes.
      const otherTeam = session.current_team === 1 ? 2 : 1;
      const otherTeamStrikes = otherTeam === 1 ? newTeam1Strikes : newTeam2Strikes;
      
      if (otherTeamStrikes < 3) {
           updates.current_team = otherTeam; // Pass turn
      } 
      // Else: the other team has 3 strikes, so the turn STAYS with the current team.
    }

    updateSession(updates)
  }

  const handleEndGame = () => {
    if (window.confirm('هل أنت متأكد من إنهاء اللعبة الحالية وإعلان النتيجة؟')) {
      updateSession({ is_active: false })
    }
  }

  return (
    <div className="anim-slide-down" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '120px' }}>
      
      <div className="container" style={{ flex: 1 }}>
        {/* Header Info */}
        <div className="glass-panel" style={{ padding: '0.8rem 1.2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--text-highlight)', margin: 0 }}>
              {activeQuestion?.topic_ar || "جاري التحميل..."} 
            </h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
              <button onClick={handleHardReset} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', textDecoration: 'underline', padding: 0 }}>تحديث البيانات</button>
            </div>
          </div>
          
          <button className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }} onClick={handleEndGame} disabled={isGameOver}>
             إنهاء اللعبة
          </button>
        </div>

        {/* Swipeable Answers Cards for Admin */}
        <div className="carousel-container">
          {answers.length === 0 && (
            <div className="carousel-card glass-panel flex-center" style={{ minHeight: '300px' }}>
              <p className="anim-pulse">جاري تحميل الإجابات...</p>
            </div>
          )}
          {answers.map((ans) => {
            const answeringTeam = revealedMap[ans.rank]
            const isRevealed = !!answeringTeam
            
            const rowColor = !isRevealed ? 'var(--bg-card)' : answeringTeam === 1 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)'
            const borderColor = !isRevealed ? 'var(--glass-border)' : answeringTeam === 1 ? 'var(--team1-color)' : 'var(--team2-color)'
            const iconColor = !isRevealed ? '#fff' : answeringTeam === 1 ? 'var(--team1-color)' : 'var(--team2-color)'
            
            return (
              <div 
                key={ans.id}
                className={`carousel-card glass-panel ${isRevealed ? 'anim-fade-in' : ''}`}
                style={{ 
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backgroundColor: rowColor,
                  borderColor: borderColor,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: isRevealed ? borderColor : 'var(--btn-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.3rem', color: '#fff', flexShrink: 0 }}>
                    {ans.rank}
                  </div>
                  <span className="badge" style={{ background: 'var(--bg-surface)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '1rem', color: 'var(--accent-gold)' }}>
                    {ans.points} نقطة
                  </span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: isRevealed ? '#fff' : 'var(--text-muted)', lineHeight: '1.4' }}>
                    {ans.answer_ar}
                  </span>
                  {isRevealed && (
                    <span style={{ fontSize: '0.9rem', color: borderColor, fontWeight: 'bold', marginTop: '0.5rem' }}>
                      (أجاب: {answeringTeam === 1 ? t1Name : t2Name})
                    </span>
                  )}
                </div>
                
                <button 
                  className="btn"
                  style={{ 
                    width: '100%',
                    padding: '0.8rem', 
                    background: isRevealed ? 'transparent' : 'var(--accent-green)',
                    color: isRevealed ? iconColor : '#fff',
                    border: isRevealed ? `1px solid ${borderColor}` : 'none',
                    fontSize: '1.1rem'
                  }}
                  onClick={() => handleReveal(ans.rank)}
                  disabled={isRevealed}
                >
                  {isRevealed ? 'مكشوفة' : 'كشف الإجابة'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky Footer for Controls */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, left: 0, right: 0, 
        background: 'rgba(10, 15, 29, 0.95)', 
        backdropFilter: 'blur(10px)', 
        borderTop: '1px solid var(--glass-border)', 
        padding: '0.8rem', 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '0.8rem', 
        zIndex: 50 
      }}>
        
        {/* Team 1 Footer Panel */}
        <div style={{ 
          background: session.team_1_strikes >= 3 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)',
          border: session.current_team === 1 ? '2px solid var(--team1-color)' : '1px solid var(--glass-border)',
          boxShadow: session.current_team === 1 ? '0 0 10px var(--team1-glow)' : 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem',
          textAlign: 'center',
          opacity: session.team_1_strikes >= 3 ? 0.6 : 1
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--team1-color)', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {session.current_team === 1 ? '▼ ' : ''}{t1Name} ({session.team_1_score})
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', margin: '0.3rem 0' }}>
            {[1,2,3].map(s => <AlertTriangle key={s} size={16} color={s <= session.team_1_strikes ? 'var(--accent-red)' : 'rgba(255,255,255,0.2)'} />)}
          </div>
          <button 
            className="btn" 
            style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)' }}
            onClick={() => handleStrike(1)}
            disabled={session.team_1_strikes >= 3 || isGameOver || session.current_team !== 1}
          >
            ❌ خطأ
          </button>
        </div>

        {/* Team 2 Footer Panel */}
        <div style={{ 
          background: session.team_2_strikes >= 3 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)',
          border: session.current_team === 2 ? '2px solid var(--team2-color)' : '1px solid var(--glass-border)',
          boxShadow: session.current_team === 2 ? '0 0 10px var(--team2-glow)' : 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem',
          textAlign: 'center',
          opacity: session.team_2_strikes >= 3 ? 0.6 : 1
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--team2-color)', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {session.current_team === 2 ? '▼ ' : ''}{t2Name} ({session.team_2_score})
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', margin: '0.3rem 0' }}>
            {[1,2,3].map(s => <AlertTriangle key={s} size={16} color={s <= session.team_2_strikes ? 'var(--accent-red)' : 'rgba(255,255,255,0.2)'} />)}
          </div>
          <button 
            className="btn" 
            style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)' }}
            onClick={() => handleStrike(2)}
            disabled={session.team_2_strikes >= 3 || isGameOver || session.current_team !== 2}
          >
            ❌ خطأ
          </button>
        </div>

      </div>
    </div>
  )
}
