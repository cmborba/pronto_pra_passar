import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*'
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req?.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    // Create clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Get the request body
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return new Response(JSON.stringify({
        error: 'Payment Intent ID is required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Find corresponding order
    const { data: order, error: orderError } = await supabase.from('orders').select(`
        *,
        user_profiles!orders_user_id_fkey (
          id,
          full_name,
          email,
          total_orders,
          total_spent
        )
      `).eq('payment_intent_id', paymentIntentId).single();

    if (orderError || !order) {
      return new Response(JSON.stringify({
        error: 'Order not found'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }

    // Determine order and payment status based on Stripe payment intent
    let orderStatus = 'pending';
    let paymentStatus = 'pending';
    let paymentData = {};

    switch (paymentIntent.status) {
      case 'succeeded':
        orderStatus = 'processing';
        paymentStatus = 'succeeded';
        paymentData = {
          payment_method: paymentIntent.payment_method_types?.[0] || 'card',
          transaction_id: paymentIntent.latest_charge,
          payment_date: new Date().toISOString()
        };
        break;
      case 'requires_payment_method': 
      case 'requires_confirmation': 
      case 'requires_action':
        orderStatus = 'pending';
        paymentStatus = 'pending';
        break;
      case 'canceled':
        orderStatus = 'cancelled';
        paymentStatus = 'cancelled';
        break;
      default:
        orderStatus = 'pending';
        paymentStatus = 'pending';
    }

    // Update order in database
    const { data: updatedOrder, error: updateError } = await supabase.from('orders').update({
        status: orderStatus,
        payment_status: paymentStatus,
        ...paymentData,
        updated_at: new Date().toISOString()
      }).eq('id', order.id).select().single();

    if (updateError) {
      console.error('Order update error:', updateError);
      return new Response(JSON.stringify({
        error: 'Failed to update order status'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    // Update payment transaction
    await supabase.from('payment_transactions').update({
        status: paymentIntent.status,
        stripe_charge_id: paymentIntent.latest_charge,
        metadata: {
          stripe_payment_intent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
          },
          confirmed_at: new Date().toISOString()
        }
      }).eq('payment_intent_id', paymentIntentId);

    // Update user profile statistics if payment succeeded
    if (paymentStatus === 'succeeded') {
      const currentOrders = (order.user_profiles?.total_orders || 0) + 1;
      const currentSpent = (parseFloat(order.user_profiles?.total_spent) || 0) + parseFloat(order.amount);

      await supabase.from('user_profiles').update({
          total_orders: currentOrders,
          total_spent: currentSpent,
          updated_at: new Date().toISOString()
        }).eq('id', order.user_id);
    }

    return new Response(JSON.stringify({
      success: true,
      order: updatedOrder,
      payment_intent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      },
      message: paymentStatus === 'succeeded' ? 'Payment confirmed successfully' 
        : `Payment status: ${paymentStatus}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});