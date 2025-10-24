import { supabase } from '../lib/supabase';

export const quizService = {
  // Get all quiz questions
  async getQuizQuestions() {
    try {
      const { data, error } = await supabase?.from('quiz_questions')?.select('*')?.order('question_order', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create a new quiz session
  async createQuizSession(userId) {
    try {
      const { data, error } = await supabase?.from('quiz_sessions')?.insert({
          user_id: userId,
          status: 'in_progress',
          current_question: 1,
          total_questions: 7,
          started_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update quiz session progress
  async updateQuizSession(sessionId, updates) {
    try {
      const { data, error } = await supabase?.from('quiz_sessions')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', sessionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Save quiz answer
  async saveQuizAnswer(sessionId, questionId, answerText, questionOrder) {
    try {
      const { data, error } = await supabase?.from('quiz_answers')?.upsert({
          session_id: sessionId,
          question_id: questionId,
          answer_text: answerText,
          question_order: questionOrder,
          answered_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Complete quiz session
  async completeQuizSession(sessionId, preparationScore) {
    try {
      const { data, error } = await supabase?.from('quiz_sessions')?.update({
          status: 'completed',
          preparation_score: preparationScore,
          completed_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        })?.eq('id', sessionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's quiz sessions
  async getUserQuizSessions(userId) {
    try {
      const { data, error } = await supabase?.from('quiz_sessions')?.select(`
          *,
          quiz_answers!quiz_answers_session_id_fkey (
            answer_text,
            question_order,
            answered_at
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get quiz session with answers
  async getQuizSessionWithAnswers(sessionId) {
    try {
      const { data, error } = await supabase?.from('quiz_sessions')?.select(`
          *,
          quiz_answers!quiz_answers_session_id_fkey (
            id,
            question_id,
            answer_text,
            question_order,
            answered_at
          )
        `)?.eq('id', sessionId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Calculate preparation score based on answers
  calculatePreparationScore(answers) {
    if (!answers || answers?.length === 0) return 0;

    let score = 50; // Base score

    answers?.forEach(answer => {
      const answerText = answer?.answer_text?.toLowerCase() || '';
      
      // Study time scoring
      if (answerText?.includes('mais de 1 ano')) score += 15;
      else if (answerText?.includes('6 meses a 1 ano')) score += 10;
      else if (answerText?.includes('1 a 6 meses')) score += 5;
      
      // Dedication scoring
      if (answerText?.includes('mais de 4 horas')) score += 15;
      else if (answerText?.includes('2-4 horas')) score += 10;
      else if (answerText?.includes('1-2 horas')) score += 5;
      
      // Knowledge level scoring
      if (answerText?.includes('avançado')) score += 15;
      else if (answerText?.includes('intermediário')) score += 10;
      else if (answerText?.includes('básico')) score += 5;
      
      // Experience scoring
      if (answerText?.includes('já sou servidor')) score += 15;
      else if (answerText?.includes('já fui aprovado')) score += 10;
      else if (answerText?.includes('não fui aprovado')) score += 5;
    });

    // Ensure score is between 0 and 100
    return Math.min(100, Math.max(0, score));
  },

  // Get quiz statistics for admin
  async getQuizStatistics() {
    try {
      const { data: sessions, error: sessionsError } = await supabase?.from('quiz_sessions')?.select('*');

      if (sessionsError) throw sessionsError;

      const { data: answers, error: answersError } = await supabase?.from('quiz_answers')?.select('*');

      if (answersError) throw answersError;

      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter(s => s?.status === 'completed')?.length || 0;
      const abandonedSessions = sessions?.filter(s => s?.status === 'abandoned')?.length || 0;
      const averageScore = completedSessions > 0 
        ? sessions?.filter(s => s?.status === 'completed' && s?.preparation_score)?.reduce((sum, s) => sum + (s?.preparation_score || 0), 0) / completedSessions
        : 0;

      return {
        data: {
          totalSessions,
          completedSessions,
          abandonedSessions,
          completionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100)?.toFixed(1) : 0,
          averageScore: Math.round(averageScore),
          totalAnswers: answers?.length || 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  }
};