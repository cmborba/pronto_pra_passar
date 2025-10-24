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
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create a Stripe client
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Get the request body
    const { orderData, customerInfo } = await req.json();

    // Validate required data
    if (!orderData || !customerInfo) {
      return new Response(JSON.stringify({
        error: 'Order data and customer info are required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.random().toString().substr(2, 8)}`;

    // Calculate total amount in cents (Brazilian Real)
    const totalAmount = Math.round((orderData?.amount || 4.90) * 100);

    // Create or get Stripe customer
    let stripeCustomer;
    const customerData = {
      name: customerInfo?.fullName || customerInfo?.name,
      email: customerInfo?.email,
      phone: customerInfo?.phone,
      metadata: {
        user_id: customerInfo?.userId,
        order_number: orderNumber
      }
    };

    if (customerInfo?.stripeCustomerId) {
      // Update existing customer
      stripeCustomer = await stripe.customers.update(customerInfo.stripeCustomerId, customerData);
    } else {
      // Create new customer
      stripeCustomer = await stripe.customers.create(customerData);

      // Update user profile with Stripe customer ID
      if (customerInfo?.userId) {
        await supabase.from('user_profiles').update({ stripe_customer_id: stripeCustomer.id }).eq('id', customerInfo.userId);
      }
    }

    // Create payment intent data
    const paymentIntentData = {
      amount: totalAmount,
      currency: orderData?.currency || 'brl',
      customer: stripeCustomer?.id,
      description: `Plano de Estudos Personalizado - Pedido ${orderNumber}`,
      metadata: {
        order_number: orderNumber,
        customer_name: customerData?.name,
        customer_email: customerInfo?.email,
        user_id: customerInfo?.userId || '',
        product_name: orderData?.productName || 'Plano de Estudos'
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Brazilian compliance
      receipt_email: customerInfo?.email
    };

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    // Save order to database
    const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: customerInfo?.userId,
        product_id: orderData?.productId,
        quiz_session_id: orderData?.quizSessionId || null,
        order_number: orderNumber,
        payment_intent_id: paymentIntent.id,
        amount: orderData?.amount || 4.90,
        currency: orderData?.currency || 'BRL',
        status: 'pending',
        payment_status: 'pending',
        billing_info: {
          customer_name: customerData?.name,
          customer_email: customerInfo?.email,
          customer_phone: customerInfo?.phone
        }
      }).select().single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(JSON.stringify({
        error: 'Failed to create order in database'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    // Save payment transaction record
    await supabase.from('payment_transactions').insert({
        order_id: order.id,
        payment_intent_id: paymentIntent.id,
        amount: orderData?.amount || 4.90,
        currency: orderData?.currency || 'BRL',
        status: 'pending',
        gateway: 'stripe',
        metadata: {
          stripe_customer_id: stripeCustomer.id,
          created_at: new Date().toISOString()
        }
      });

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order.id,
      orderNumber: orderNumber,
      amount: totalAmount,
      currency: paymentIntent.currency,
      customerId: stripeCustomer.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});