import { supabase } from '../lib/supabase';

export const emailService = {
  async sendOrderNotification(orderData) {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-order-email', {
        body: orderData
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      // Don't log service responses as bugs
      return { 
        success: false, 
        error: { 
          message: error?.message || 'Erro ao enviar email' 
        } 
      };
    }
  },

  async getQuizAnswersForEmail(sessionId) {
    try {
      // Get quiz answers for the session
      const { data: session, error: sessionError } = await supabase
        ?.from('quiz_sessions')
        ?.select(`
          *,
          quiz_answers!inner (
            id,
            answer_text,
            question_id,
            quiz_questions!inner (
              question_text
            )
          )
        `)
        ?.eq('id', sessionId)
        ?.single();

      if (sessionError) {
        throw sessionError;
      }

      // Format answers for email
      const formattedAnswers = session?.quiz_answers?.map(answer => ({
        question_text: answer?.quiz_questions?.question_text,
        answer_text: answer?.answer_text
      }));

      return { data: formattedAnswers };
    } catch (error) {
      // Don't log service responses as bugs
      return { 
        data: [], 
        error: { 
          message: error?.message || 'Erro ao buscar respostas do quiz' 
        } 
      };
    }
  }
};