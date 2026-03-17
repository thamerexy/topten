import { useGame } from '../context/GameContext'
import { AlertTriangle, Trophy, Crown } from 'lucide-react'

// Layout helper for the answers
const AnswerSlot = ({ rank, answer, isRevealed, points, revealedByTeam }) => {
  
  // Set colors dynamically based on what team answered it
  const isTeam1 = revealedByTeam === 1
  const isTeam2 = revealedByTeam === 2
  
  const bgColor = !isRevealed ? 'rgba(10, 15, 29, 0.8)' : isTeam1 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)'
  const borderColor = !isRevealed ? 'var(--glass-border)' : isTeam1 ? 'var(--team1-color)' : 'var(--team2-color)'
  const glowColor = !isRevealed ? 'none' : isTeam1 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)'
  const textShadowGlow = !isRevealed ? 'none' : isTeam1 ? '0 0 10px rgba(59, 130, 246, 0.8)' : '0 0 10px rgba(236, 72, 153, 0.8)'
  
  return (
    <div 
      className={`glass-panel flex-between ${isRevealed ? 'anim-flip-in' : ''}`}
      style={{ 
        padding: '1.2rem', 
        marginBottom: '1rem',
        minHeight: '80px',
        backgroundColor: bgColor,
        borderColor: borderColor,
        boxShadow: isRevealed ? `0 0 15px ${glowColor}` : 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.5s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 2 }}>
        <div style={{ 
          width: '45px', 
          height: '45px', 
          borderRadius: '50%', 
          background: isRevealed ? borderColor : 'var(--bg-primary)', 
          color: isRevealed ? '#fff' : 'var(--text-muted)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: '900',
          fontSize: '1.5rem',
          border: `2px solid ${isRevealed ? 'transparent' : 'var(--glass-border)'}`
        }}>
          {rank}
        </div>
        
        {isRevealed ? (
          <span style={{ fontSize: '1.8rem', fontWeight: '800', textShadow: textShadowGlow, color: '#fff' }}>
            {answer}
          </span>
        ) : (
          <div style={{ width: '150px', height: '10px', background: 'var(--text-muted)', opacity: 0.2, borderRadius: '4px' }} />
        )}
      </div>

      {isRevealed && (
        <span style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: borderColor, 
          background: 'rgba(0,0,0,0.6)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-sm)',
          zIndex: 2,
          border: `1px solid ${borderColor}`
        }}>
          {points}
        </span>
      )}
      
      {/* Background glow on reveal */}
      {isRevealed && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`, zIndex: 1 }} />}
    </div>
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

  const activeQuestion = questions.find(q => q.id === session.question_id)
  
  // Split answers into two columns for Top 10 layout
  const column1 = answers.slice(0, 5) // Ranks 1-5
  const column2 = answers.slice(5, 10) // Ranks 6-10
  
  const revealedMap = session.revealed_answers || {}

  // Determine Game state and Winners
  const isGameOver = !session.is_active;
  let winner = null;
  if (isGameOver) {
    if (session.team_1_score > session.team_2_score) winner = 1;
    else if (session.team_2_score > session.team_1_score) winner = 2;
    else winner = 0; // Tie
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '250px 1fr 250px', 
      minHeight: '100vh',
      gap: '2rem',
      padding: '2rem',
      position: 'relative'
    }}>
      
      {/* Winner Overlay Splash */}
      {isGameOver && (
        <div className="anim-fade-in" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 15, 29, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <div className="glass-panel anim-slide-down" style={{ 
            padding: '4rem', 
            textAlign: 'center',
            border: `3px solid ${winner === 1 ? 'var(--team1-color)' : winner === 2 ? 'var(--team2-color)' : 'var(--accent-gold)'}`,
            boxShadow: `0 0 50px ${winner === 1 ? 'var(--team1-glow)' : winner === 2 ? 'var(--team2-glow)' : 'rgba(251, 191, 36, 0.4)'}`
          }}>
            <Crown size={100} color={winner === 1 ? 'var(--team1-color)' : winner === 2 ? 'var(--team2-color)' : 'var(--accent-gold)'} style={{ margin: '0 auto 2rem' }} className="anim-pulse" />
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: winner === 1 ? 'var(--team1-color)' : winner === 2 ? 'var(--team2-color)' : 'var(--accent-gold)' }}>
              {winner === 1 ? 'فاز الفريق الأول!' : winner === 2 ? 'فاز الفريق الثاني!' : 'تعادل!'}
            </h1>
            <div style={{ display: 'flex', gap: '4rem', fontSize: '2.5rem', fontWeight: 'bold', justifyContent: 'center', marginTop: '3rem' }}>
               <div style={{ color: 'var(--team1-color)' }}>الفريق الأول: {session.team_1_score}</div>
               <div style={{ color: 'var(--team2-color)' }}>الفريق الثاني: {session.team_2_score}</div>
            </div>
          </div>
        </div>
      )}

      {/* Team 1 Score Panel (Right side due to RTL) */}
      <div className="glass-panel flex-center anim-fade-in" style={{ 
        flexDirection: 'column', 
        border: session.current_team === 1 ? '3px solid var(--team1-color)' : '1px solid var(--glass-border)',
        boxShadow: session.current_team === 1 ? '0 0 30px var(--team1-glow)' : 'none',
        transform: session.current_team === 1 ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {session.current_team === 1 && <div style={{ position: 'absolute', top: 0, width: '100%', height: '5px', background: 'var(--team1-color)' }} />}
        
        <h2 style={{ fontSize: '2.5rem', color: 'var(--team1-color)', marginBottom: '1rem' }}>الفريق الأول</h2>
        
        <div style={{ fontSize: '6rem', fontWeight: '900', textShadow: '0 0 20px var(--team1-glow)' }}>
          {session.team_1_score}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {[1,2,3].map(s => (
            <div key={s} className={s <= session.team_1_strikes ? 'anim-shake' : ''}>
              <AlertTriangle 
                size={50} 
                color={s <= session.team_1_strikes ? 'var(--accent-red)' : 'var(--text-muted)'} 
                style={{ opacity: s <= session.team_1_strikes ? 1 : 0.2, filter: s <= session.team_1_strikes ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' : 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Board Center */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* Topic Banner */}
        <div className="glass-panel flex-center anim-slide-down" style={{ 
          padding: '2rem', 
          marginBottom: '3rem', 
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
          borderBottom: '4px solid var(--accent-gold)'
        }}>
          <h1 className="title-glow" style={{ fontSize: '3.5rem', textAlign: 'center', lineHeight: '1.4' }}>
            {activeQuestion?.topic_ar}
          </h1>
        </div>

        {/* Answers Board */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', flex: 1 }}>
          
          {/* Right Column (Ranks 1-5 due to RTL) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {column1.map(ans => (
              <AnswerSlot 
                key={ans.id}
                rank={ans.rank}
                answer={ans.answer_ar}
                points={ans.points}
                isRevealed={!!revealedMap[ans.rank]}
                revealedByTeam={revealedMap[ans.rank]}
              />
            ))}
          </div>

          {/* Left Column (Ranks 6-10 due to RTL) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {column2.map(ans => (
              <AnswerSlot 
                key={ans.id}
                rank={ans.rank}
                answer={ans.answer_ar}
                points={ans.points}
                isRevealed={!!revealedMap[ans.rank]}
                revealedByTeam={revealedMap[ans.rank]}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Team 2 Score Panel (Left side due to RTL) */}
      <div className="glass-panel flex-center anim-fade-in" style={{ 
        flexDirection: 'column', 
        border: session.current_team === 2 ? '3px solid var(--team2-color)' : '1px solid var(--glass-border)',
        boxShadow: session.current_team === 2 ? '0 0 30px var(--team2-glow)' : 'none',
        transform: session.current_team === 2 ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {session.current_team === 2 && <div style={{ position: 'absolute', top: 0, width: '100%', height: '5px', background: 'var(--team2-color)' }} />}
        
        <h2 style={{ fontSize: '2.5rem', color: 'var(--team2-color)', marginBottom: '1rem' }}>الفريق الثاني</h2>
        
        <div style={{ fontSize: '6rem', fontWeight: '900', textShadow: '0 0 20px var(--team2-glow)' }}>
          {session.team_2_score}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {[1,2,3].map(s => (
            <div key={s} className={s <= session.team_2_strikes ? 'anim-shake' : ''}>
              <AlertTriangle 
                size={50} 
                color={s <= session.team_2_strikes ? 'var(--accent-red)' : 'var(--text-muted)'} 
                style={{ opacity: s <= session.team_2_strikes ? 1 : 0.2, filter: s <= session.team_2_strikes ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' : 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
