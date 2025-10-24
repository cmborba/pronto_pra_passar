import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // ✅ CORS preflight
  if (req?.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*", // DO NOT CHANGE THIS
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*" // DO NOT CHANGE THIS
      }
    });
  }
  
  try {
    const { 
      customerName, 
      customerEmail, 
      planType, 
      amount, 
      currency, 
      orderNumber, 
      purchaseDate, 
      quizAnswers 
    } = await req?.json();

    // Validate required fields
    if (!customerName || !customerEmail || !planType) {
      throw new Error('Dados obrigatórios não fornecidos');
    }

    // Format quiz answers for email
    const formatQuizAnswers = (answers) => {
      if (!answers || !Array.isArray(answers)) return 'Nenhuma resposta disponível';
      
      return answers?.map((answer, index) => {
        return `${index + 1}. ${answer?.question_text}\nResposta: ${answer?.answer_text}`;
      })?.join('\n\n');
    };

    // Get Resend API key from environment
    const RESEND_API_KEY = globalThis.Deno?.env?.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurado');
    }

    // Email content
    const emailSubject = 'Novo Plano de Estudo - Informações do Cliente';
    const emailHtml = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 25px; padding: 15px; border-left: 4px solid #007bff; background-color: #f8f9fa; }
            .quiz-answers { background-color: #e9ecef; padding: 15px; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            h2 { color: #007bff; margin-top: 0; }
            .highlight { background-color: #fff3cd; padding: 2px 5px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 Nova Compra - Plano de Estudos</h1>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>📋 Dados do Cliente</h2>
              <p><strong>Nome:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
            </div>
            
            <div class="section">
              <h2>💰 Informações da Compra</h2>
              <p><strong>Plano:</strong> <span class="highlight">${planType}</span></p>
              <p><strong>Valor:</strong> ${currency} ${amount}</p>
              <p><strong>Número do Pedido:</strong> ${orderNumber}</p>
              <p><strong>Data da Compra:</strong> ${new Date(purchaseDate)?.toLocaleString('pt-BR')}</p>
            </div>
            
            <div class="section">
              <h2>📝 Respostas do Questionário</h2>
              <div class="quiz-answers">
                <pre style="white-space: pre-wrap; font-family: inherit;">${formatQuizAnswers(quizAnswers)}</pre>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Este email foi gerado automaticamente pelo sistema de pagamentos.</p>
            <p>Data de envio: ${new Date()?.toLocaleString('pt-BR')}</p>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'planodeestudos@prontoprapassar.shop',
        to: ['planodeestudos@prontoprapassar.shop'], // Configure your admin email here
        subject: emailSubject,
        html: emailHtml,
        reply_to: customerEmail
      }),
    });

    if (!emailResponse?.ok) {
      const emailError = await emailResponse?.text();
      throw new Error(`Erro no envio do email: ${emailError}`);
    }

    const emailResult = await emailResponse?.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Email enviado com sucesso para o administrador',
      emailId: emailResult.id
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // DO NOT CHANGE THIS
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // DO NOT CHANGE THIS
      }
    });
  }
});