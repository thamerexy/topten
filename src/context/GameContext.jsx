import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [session, setSession] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)

  // Step 1: Initial Boot - Load initial data once
  useEffect(() => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      loadInitialData()
    } else {
      setLoading(false)
    }
  }, [])

  // Step 2: Session Monitoring & Realtime - Setup realtime subscription for active session
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) return

    const sessionSub = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'top_game_sessions',
        },
        async (payload) => {
          console.log('Realtime change received!', payload)
          if (payload.new) {
            // If it's a completely new session or update to current one
            // OR if a new active session is inserted (e.g., from another client)
            if (!session || payload.new.id === session.id || (payload.eventType === 'INSERT' && payload.new.is_active)) {
              setSession(payload.new)
              // If the question changed, fetch its answers
              if (payload.new.question_id !== session?.question_id) {
                await loadAnswersForQuestion(payload.new.question_id)
              }
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(sessionSub)
    }
  }, [session?.id, session?.question_id]) // Depend on session ID and question ID to re-evaluate subscription if session changes

  async function loadInitialData() {
    setLoading(true)
    try {
      const { data: qs } = await supabase.from('top_questions').select('*')
      if (qs) setQuestions(qs)
      
      // Load the active session if any
      const { data: activeSessions } = await supabase
        .from('top_game_sessions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)

      if (activeSessions && activeSessions.length > 0) {
        const activeSession = activeSessions[0]
        setSession(activeSession)
        // Proactively load answers if we have a question_id
        if (activeSession.question_id) {
          await loadAnswersForQuestion(activeSession.question_id)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadAnswersForQuestion(questionId) {
    if (!questionId) return
    try {
      const { data: ans, error } = await supabase
        .from('top_answers')
        .select('*')
        .eq('question_id', questionId)
        .order('rank', { ascending: true })
      
      if (error) throw error
      if (ans) {
        console.log(`Loaded ${ans.length} answers for question ${questionId}`)
        setAnswers(ans)
      }
    } catch (err) {
      console.error("Error loading answers:", err)
    }
  }

  async function startNewGame(questionId, team1Name = "الفريق الأول", team2Name = "الفريق الثاني") {
    console.log("Starting new game for question:", questionId, { team1Name, team2Name })
    
    try {
      // 1. End any active games first
      const { error: endError } = await supabase
        .from('top_game_sessions')
        .update({ is_active: false })
        .eq('is_active', true)
      
      if (endError) {
        console.warn("Minor error ending old sessions:", endError)
        // We continue anyway, as the next insert might succeed
      }

      // 2. Create new session
      const { data, error } = await supabase
        .from('top_game_sessions')
        .insert({
          question_id: questionId,
          team_1_name: team1Name,
          team_2_name: team2Name,
          is_active: true,
          current_team: 1,
          team_1_score: 0,
          team_2_score: 0,
          team_1_strikes: 0,
          team_2_strikes: 0,
          revealed_answers: {}
        })
        .select()
        .single()

      if (error) {
        console.error("Critical error creating new game session:", error)
        let msg = "فشل بدء اللعبة. "
        if (error.message.includes('column "team_1_name" does not exist')) {
          msg += "تأكد من تشغيل ملف الترقية (Migration) في Supabase لإضافة أعمدة الأسماء."
        } else {
          msg += "خطأ: " + error.message
        }
        alert(msg)
        return
      }

      if (data) {
        console.log("Successfully created session:", data.id)
        setSession(data)
        await loadAnswersForQuestion(questionId)
      }
    } catch (err) {
      console.error("Unexpected exception in startNewGame:", err)
      alert("حدث خطأ غير متوقع: " + err.message)
    }
  }

  async function updateSession(updates) {
    if (!session?.id) return
    const { data, error } = await supabase
      .from('top_game_sessions')
      .update(updates)
      .eq('id', session.id)
      .select()
      .single()

    if (error) {
      console.error('Update session error:', error)
    }
    if (data) {
      setSession(data)
    }
  }

  const value = {
    session,
    questions,
    answers,
    loading,
    startNewGame,
    updateSession
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGame = () => useContext(GameContext)
