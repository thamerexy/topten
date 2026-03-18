import { useGame } from '../context/GameContext'
import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, Trophy, Crown } from 'lucide-react'

// Layout helper for the answers
const AnswerSlot = ({ rank, answer, isRevealed, points, revealedByTeam, isSpotlight }) => {
  
  const isTeam1 = revealedByTeam === 1
  const isTeam2 = revealedByTeam === 2
  
  const bgColor = !isRevealed ? 'rgba(10, 15, 29, 0.8)' : isTeam1 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)'
  const borderColor = !isRevealed ? 'var(--glass-border)' : isTeam1 ? 'var(--team1-color)' : 'var(--team2-color)'
  const glowColor = !isRevealed ? 'none' : isTeam1 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)'
  const textShadowGlow = !isRevealed ? 'none' : isTeam1 ? '0 0 1vh rgba(59, 130, 246, 0.8)' : '0 0 1vh rgba(236, 72, 153, 0.8)'
  
  const cardContent = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2vh', zIndex: 2 }}>
        <div style={{ 
          width: isSpotlight ? '25vh' : '6vh', 
          height: isSpotlight ? '25vh' : '6vh', 
          borderRadius: '50%', 
          background: isRevealed ? borderColor : 'var(--bg-primary)', 
          color: isRevealed ? '#fff' : 'var(--text-muted)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: '900',
          fontSize: isSpotlight ? '12vh' : '3.5vh',
          border: `0.3vh solid ${isRevealed ? 'transparent' : 'var(--glass-border)'}`,
          transition: 'all 0.3s'
        }}>
          {rank}
        </div>
        
        {isRevealed ? (
          <span style={{ fontSize: isSpotlight ? '10vh' : '4vh', fontWeight: '800', textShadow: textShadowGlow, color: '#fff', transition: 'all 0.3s' }}>
            {answer}
          </span>
        ) : (
          <div style={{ width: '15vh', height: '1.5vh', background: 'var(--text-muted)', opacity: 0.2, borderRadius: '0.4vh' }} />
        )}
      </div>

      {isRevealed && (
        <span style={{ 
          fontSize: isSpotlight ? '8vh' : '3.5vh', 
          fontWeight: 'bold', 
          color: borderColor, 
          background: 'rgba(0,0,0,0.6)',
          padding: '0.5vh 1.5vh',
          borderRadius: 'var(--radius-sm)',
          zIndex: 2,
          border: `0.2vh solid ${borderColor}`,
          transition: 'all 0.3s'
        }}>
          {points}
        </span>
      )}
      
      {isRevealed && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`, zIndex: 1 }} />}
    </>
  )

  return (
    <>
      <div 
        className={`glass-panel flex-between ${isRevealed && !isSpotlight ? 'anim-flip-in' : ''}`}
        style={{ 
          padding: '1.2vh 2vh', 
          marginBottom: '1vh',
          height: '9vh',
          backgroundColor: bgColor,
          borderColor: borderColor,
          boxShadow: isRevealed && !isSpotlight ? `0 0 2vh ${glowColor}` : 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.5s ease-out',
          opacity: isSpotlight ? 0 : 1
        }}
      >
        {cardContent}
      </div>

      {isSpotlight && (
        <div className="spotlight-overlay">
          <div 
            className="glass-panel flex-between spotlight-card"
            style={{ 
              padding: '6vh', 
              backgroundColor: bgColor,
              borderColor: borderColor,
              boxShadow: `0 0 10vh ${glowColor}`,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '3vh',
              width: '90%'
            }}
          >
            {cardContent}
          </div>
        </div>
      )}
    </>
  )
}

export default function ContestantMode() {
  const { session, questions, answers, loading } = useGame()

  if (loading || !session) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem' }}>
        <Trophy size={80} color="var(--accent-gold)" className="anim-pulse" />
        <h1 className="title-glow" style={{ fontSize: '3rem' }}>في انتظار بدء اللعبة...</h1>
      </div>
    )
  }

  const [spotlightRank, setSpotlightRank] = useState(null)
  const [showStrike, setShowStrike] = useState(false)
  const prevKeys = useRef([])
  const prevStrikes = useRef({ t1: 0, t2: 0 })

  const activeQuestion = questions.find(q => q.id === session.question_id)
  
  // Split answers into two columns for Top 10 layout
  const column1 = answers.slice(0, 5) // Ranks 1-5
  const column2 = answers.slice(5, 10) // Ranks 6-10
  
  // Safely parse JSONB column object
  let revealedMap = {}
  try {
    revealedMap = typeof session.revealed_answers === 'string' ? JSON.parse(session.revealed_answers) : session.revealed_answers || {}
  } catch(e) { /* ignore */ }
  if (Array.isArray(revealedMap)) revealedMap = {};

  // Cinematic Spotlight trigger
  useEffect(() => {
    const currentKeys = Object.keys(revealedMap)
    if (currentKeys.length > prevKeys.current.length && prevKeys.current.length > 0) {
      const newKey = currentKeys.find(k => !prevKeys.current.includes(k))
      if (newKey) {
        setSpotlightRank(Number(newKey))
        setTimeout(() => setSpotlightRank(null), 3200)
      }
    }
    prevKeys.current = currentKeys
  }, [revealedMap])

  // Cinematic Strike trigger
  useEffect(() => {
    if (session.team_1_strikes > prevStrikes.current.t1 || session.team_2_strikes > prevStrikes.current.t2) {
      setShowStrike(true)
      setTimeout(() => setShowStrike(false), 1500)
    }
    prevStrikes.current = { t1: session.team_1_strikes, t2: session.team_2_strikes }
  }, [session.team_1_strikes, session.team_2_strikes])

  // Determine Game state and Winners
  const isGameOver = !session.is_active;
  
  const t1Name = session.team_1_name || 'الفريق الأول'
  const t2Name = session.team_2_name || 'الفريق الثاني'
  
  let winner = null;
  if (isGameOver) {
    if (session.team_1_score > session.team_2_score) winner = 1;
    else if (session.team_2_score > session.team_1_score) winner = 2;
    else winner = 0; // Tie
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '20% 60% 20%', 
      height: '100vh',
      maxHeight: '100vh',
      gap: '1vh',
      padding: '1vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-primary)'
    }}>
      
      {/* Winner Overlay Splash */}
      {isGameOver && (
        <div className="anim-fade-in" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 15, 29, 0.9)',
          backdropFilter: 'blur(2vh)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <div className="glass-panel anim-slide-down" style={{ 
            padding: '5vh', 
            textAlign: 'center',
            border: `0.5vh solid ${winner === 1 ? 'var(--team1-color)' : winner === 2 ? 'var(--team2-color)' : 'var(--accent-gold)'}`,
            boxShadow: `0 0 10vh ${winner === 1 ? 'var(--team1-glow)' : winner === 2 ? 'var(--team2-glow)' : 'rgba(251, 191, 36, 0.4)'}`,
            borderRadius: '3vh'
          }}>
            <Crown size={'15vh'} color={winner === 1 ? 'var(--team1-color)' : winner === 2 ? 'var(--team2-color)' : 'var(--accent-gold)'} style={{ margin: '0 auto 2vh' }} className="anim-pulse" />
            <h1 style={{ fontSize: '8vh', marginBottom: '1vh', color: winner === 1 ? 'var(--team1-color)' : winner === 2 ? 'var(--team2-color)' : 'var(--accent-gold)' }}>
              {winner === 1 ? `فاز ${t1Name}!` : winner === 2 ? `فاز ${t2Name}!` : 'التـــــعـــــادل!'}
            </h1>
            <div style={{ display: 'flex', gap: '5vh', fontSize: '5vh', fontWeight: 'bold', justifyContent: 'center', marginTop: '2vh' }}>
               <div style={{ color: 'var(--team1-color)' }}>{t1Name}: {session.team_1_score}</div>
               <div style={{ color: 'var(--team2-color)' }}>{t2Name}: {session.team_2_score}</div>
            </div>
          </div>
        </div>
      )}

      {/* Team 1 Score Panel */}
      <div className="glass-panel flex-center anim-fade-in" style={{ 
        flexDirection: 'column', 
        border: session.current_team === 1 ? '0.4vh solid var(--team1-color)' : '1px solid var(--glass-border)',
        boxShadow: session.current_team === 1 ? '0 0 4vh var(--team1-glow)' : 'none',
        transform: session.current_team === 1 ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        height: '98vh'
      }}>
        {session.current_team === 1 && <div style={{ position: 'absolute', top: 0, width: '100%', height: '0.8vh', background: 'var(--team1-color)' }} />}
        
        <h2 className="truncate" style={{ fontSize: '4vh', color: 'var(--team1-color)', marginBottom: '1vh', textAlign: 'center', width: '90%' }}>{t1Name}</h2>
        
        <div style={{ fontSize: '15vh', fontWeight: '900', textShadow: '0 0 3vh var(--team1-glow)', lineHeight: 1 }}>
          {session.team_1_score}
        </div>
        
        <div style={{ display: 'flex', gap: '1vh', marginTop: '2vh' }}>
          {[1,2,3].map(s => (
            <div key={s} className={s <= session.team_1_strikes ? 'anim-shake' : ''}>
              <AlertTriangle 
                size={'6vh'} 
                color={s <= session.team_1_strikes ? 'var(--accent-red)' : 'var(--text-muted)'} 
                style={{ opacity: s <= session.team_1_strikes ? 1 : 0.2, filter: s <= session.team_1_strikes ? 'drop-shadow(0 0 1vh rgba(239, 68, 68, 0.8))' : 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Board Center */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh', height: '98vh' }}>
        
        {/* Topic Banner - More compact */}
        <div className="glass-panel flex-center anim-slide-down" style={{ 
          padding: '1.5vh 1vh', 
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
          borderBottom: '0.4vh solid var(--accent-gold)',
          minHeight: '12vh'
        }}>
          <h1 className="title-glow" style={{ fontSize: '5vh', textAlign: 'center', lineHeight: '1.2', margin: 0 }}>
            {activeQuestion?.topic_ar}
          </h1>
        </div>

        {/* Answers Board */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vh', flex: 1, padding: '0.5vh' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {column1.map(ans => (
              <AnswerSlot 
                key={ans.id}
                rank={ans.rank}
                answer={ans.answer_ar}
                points={ans.points}
                isRevealed={!!revealedMap[ans.rank]}
                revealedByTeam={revealedMap[ans.rank]}
                isSpotlight={spotlightRank === ans.rank}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {column2.map(ans => (
              <AnswerSlot 
                key={ans.id}
                rank={ans.rank}
                answer={ans.answer_ar}
                points={ans.points}
                isRevealed={!!revealedMap[ans.rank]}
                revealedByTeam={revealedMap[ans.rank]}
                isSpotlight={spotlightRank === ans.rank}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Team 2 Score Panel */}
      <div className="glass-panel flex-center anim-fade-in" style={{ 
        flexDirection: 'column', 
        border: session.current_team === 2 ? '0.4vh solid var(--team2-color)' : '1px solid var(--glass-border)',
        boxShadow: session.current_team === 2 ? '0 0 4vh var(--team2-glow)' : 'none',
        transform: session.current_team === 2 ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        height: '98vh'
      }}>
        {session.current_team === 2 && <div style={{ position: 'absolute', top: 0, width: '100%', height: '0.8vh', background: 'var(--team2-color)' }} />}
        
        <h2 className="truncate" style={{ fontSize: '4vh', color: 'var(--team2-color)', marginBottom: '1vh', textAlign: 'center', width: '90%' }}>{t2Name}</h2>
        
        <div style={{ fontSize: '15vh', fontWeight: '900', textShadow: '0 0 3vh var(--team2-glow)', lineHeight: 1 }}>
          {session.team_2_score}
        </div>
        
        <div style={{ display: 'flex', gap: '1vh', marginTop: '2vh' }}>
          {[1,2,3].map(s => (
            <div key={s} className={s <= session.team_2_strikes ? 'anim-shake' : ''}>
              <AlertTriangle 
                size={'6vh'} 
                color={s <= session.team_2_strikes ? 'var(--accent-red)' : 'var(--text-muted)'} 
                style={{ opacity: s <= session.team_2_strikes ? 1 : 0.2, filter: s <= session.team_2_strikes ? 'drop-shadow(0 0 1vh rgba(239, 68, 68, 0.8))' : 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Strike Overlay Cinematic */}
      {showStrike && (
        <div className="strike-overlay">
          <div className="strike-icon" style={{ 
            fontSize: '60vh', 
            fontWeight: '900', 
            color: 'var(--accent-red)', 
            textShadow: '0 0 8vh rgba(239, 68, 68, 0.8)' 
          }}>
            X
          </div>
        </div>
      )}
    </div>
  )
}
