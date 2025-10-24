import { supabase } from '../lib/supabase';

export const paymentService = {
  // Get available products
  async getProducts() {
    try {
      const { data, error } = await supabase?.from('products')?.select('*')?.eq('is_active', true)?.order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create payment intent - UPDATED
  async createPaymentIntent(orderData, customerInfo) {
    try {
      const { data, error } = await supabase?.functions?.invoke('create-payment-intent', {
        body: {
          orderData,
          customerInfo
        }
      });

      if (error) {
        console.error('Payment intent creation error:', error);
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Payment intent service error:', error);
      return { data: null, error };
    }
  },

  // Confirm payment - UPDATED
  async confirmPayment(paymentIntentId) {
    try {
      const { data, error } = await supabase?.functions?.invoke('confirm-payment', {
        body: { paymentIntentId }
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Payment confirmation service error:', error);
      return { data: null, error };
    }
  },

  // Create order
  async createOrder(userId, productId, amount, currency = 'BRL', quizSessionId = null) {
    try {
      const orderNumber = `ORD-${new Date()?.getFullYear()}-${Math.random()?.toString()?.substr(2, 8)}`;
      
      const { data, error } = await supabase?.from('orders')?.insert({
          user_id: userId,
          product_id: productId,
          quiz_session_id: quizSessionId,
          order_number: orderNumber,
          amount,
          currency,
          status: 'pending',
          payment_status: 'pending'
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status, paymentStatus, paymentData = {}) {
    try {
      const updates = {
        status,
        payment_status: paymentStatus,
        updated_at: new Date()?.toISOString(),
        ...paymentData
      };

      const { data, error } = await supabase?.from('orders')?.update(updates)?.eq('id', orderId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user orders
  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          *,
          products!orders_product_id_fkey (
            name,
            description,
            price,
            currency
          ),
          quiz_sessions!orders_quiz_session_id_fkey (
            id,
            preparation_score,
            completed_at
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          *,
          products!orders_product_id_fkey (
            name,
            description,
            price,
            currency
          ),
          quiz_sessions!orders_quiz_session_id_fkey (
            id,
            preparation_score,
            completed_at
          ),
          user_profiles!orders_user_id_fkey (
            full_name,
            email
          )
        `)?.eq('id', orderId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create payment transaction record
  async createPaymentTransaction(orderId, paymentIntentId, amount, currency, status) {
    try {
      const { data, error } = await supabase?.from('payment_transactions')?.insert({
          order_id: orderId,
          payment_intent_id: paymentIntentId,
          amount,
          currency,
          status,
          gateway: 'stripe'
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update payment transaction
  async updatePaymentTransaction(transactionId, updates) {
    try {
      const { data, error } = await supabase?.from('payment_transactions')?.update(updates)?.eq('id', transactionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Format amount for display
  formatAmount(amount, currency = 'BRL') {
    if (typeof amount === 'string') {
      amount = parseFloat(amount);
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    })?.format(amount);
  },

  // Format amount for Stripe (cents)
  formatAmountForStripe(amount) {
    if (typeof amount === 'string') {
      amount = parseFloat(amount);
    }
    return Math.round(amount * 100);
  },

  // Get payment statistics for admin
  async getPaymentStatistics() {
    try {
      const { data: orders, error: ordersError } = await supabase?.from('orders')?.select('*');

      if (ordersError) throw ordersError;

      const { data: transactions, error: transactionsError } = await supabase?.from('payment_transactions')?.select('*');

      if (transactionsError) throw transactionsError;

      const totalOrders = orders?.length || 0;
      const paidOrders = orders?.filter(o => o?.payment_status === 'succeeded')?.length || 0;
      const pendingOrders = orders?.filter(o => o?.payment_status === 'pending')?.length || 0;
      const failedOrders = orders?.filter(o => o?.payment_status === 'failed')?.length || 0;
      
      const totalRevenue = orders
        ?.filter(o => o?.payment_status === 'succeeded')
        ?.reduce((sum, o) => sum + (parseFloat(o?.amount) || 0), 0) || 0;

      const conversionRate = totalOrders > 0 ? ((paidOrders / totalOrders) * 100)?.toFixed(1) : 0;

      return {
        data: {
          totalOrders,
          paidOrders,
          pendingOrders,
          failedOrders,
          totalRevenue,
          conversionRate,
          averageOrderValue: paidOrders > 0 ? (totalRevenue / paidOrders)?.toFixed(2) : 0,
          totalTransactions: transactions?.length || 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  }
};