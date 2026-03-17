import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [session, setSession] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch initial questions and setup realtime subscription for active session
  useEffect(() => {
    // Only fetch if supabase is actually configured (not placeholder)
    if (import.meta.env.VITE_SUPABASE_URL) {
      loadInitialData()
      
      const sessionSub = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'top_game_sessions',
          },
          (payload) => {
            console.log('Realtime change received!', payload)
            // Update the local session state when changes occur in DB
            if (payload.new && (!session || payload.new.id === session.id)) {
              setSession(payload.new)
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(sessionSub)
      }
    } else {
      setLoading(false)
    }
  }, [session?.id])

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
        setSession(activeSessions[0])
        await loadAnswersForQuestion(activeSessions[0].question_id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadAnswersForQuestion(questionId) {
    if (!questionId) return
    const { data: ans } = await supabase
      .from('top_answers')
      .select('*')
      .eq('question_id', questionId)
      .order('rank', { ascending: true })
    if (ans) setAnswers(ans)
  }

  async function startNewGame(questionId) {
    // End active games
    await supabase
      .from('top_game_sessions')
      .update({ is_active: false })
      .eq('is_active', true)

    // Create new session
    const { data, error } = await supabase
      .from('top_game_sessions')
      .insert({
        question_id: questionId,
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

    if (error) console.error(error)
    if (data) {
      setSession(data)
      await loadAnswersForQuestion(questionId)
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
