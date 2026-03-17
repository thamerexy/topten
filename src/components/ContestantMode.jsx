import { useGame } from '../context/GameContext'
import { AlertTriangle, Trophy } from 'lucide-react'

// Layout helper for the answers
const AnswerSlot = ({ rank, answer, isRevealed, points }) => {
  return (
    <div 
      className={`glass-panel flex-between ${isRevealed ? 'anim-flip-in' : ''}`}
      style={{ 
        padding: '1.2rem', 
        marginBottom: '1rem',
        minHeight: '80px',
        backgroundColor: isRevealed ? 'var(--bg-surface)' : 'rgba(10, 15, 29, 0.8)',
        borderColor: isRevealed ? 'var(--accent-gold)' : 'var(--glass-border)',
        boxShadow: isRevealed ? '0 0 15px rgba(251, 191, 36, 0.3)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 2 }}>
        <div style={{ 
          width: '45px', 
          height: '45px', 
          borderRadius: '50%', 
          background: isRevealed ? 'var(--accent-gold)' : 'var(--bg-primary)', 
          color: isRevealed ? '#000' : 'var(--text-muted)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: '900',
          fontSize: '1.5rem',
          border: '2px solid var(--accent-gold)'
        }}>
          {rank}
        </div>
        
        {isRevealed ? (
          <span style={{ fontSize: '1.8rem', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
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
          color: 'var(--accent-gold)', 
          background: 'rgba(0,0,0,0.5)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-sm)',
          zIndex: 2
        }}>
          {points}
        </span>
      )}
      
      {/* Background glow on reveal */}
      {isRevealed && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent)', zIndex: 1 }} />}
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
  // Assuming answers are sorted 1 to 10
  const column1 = answers.slice(0, 5) // Ranks 1-5
  const column2 = answers.slice(5, 10) // Ranks 6-10

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '250px 1fr 250px', 
      minHeight: '100vh',
      gap: '2rem',
      padding: '2rem'
    }}>
      
      {/* Team 1 Score Panel (Right side due to RTL) */}
      <div className="glass-panel flex-center anim-fade-in" style={{ 
        flexDirection: 'column', 
        border: session.current_team === 1 ? '3px solid var(--team1-color)' : '1px solid var(--glass-border)',
        boxShadow: session.current_team === 1 ? '0 0 30px var(--team1-glow)' : 'none',
        transition: 'all 0.5s',
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
                isRevealed={session.revealed_answers.includes(ans.rank)}
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
                isRevealed={session.revealed_answers.includes(ans.rank)}
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
        transition: 'all 0.5s',
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
