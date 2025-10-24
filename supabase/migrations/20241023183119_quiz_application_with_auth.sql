-- Location: supabase/migrations/20241023183119_quiz_application_with_auth.sql
-- Schema Analysis: Fresh project - creating complete schema for quiz application
-- Integration Type: Complete new schema with authentication
-- Dependencies: auth.users (Supabase built-in)

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.quiz_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE public.payment_status AS ENUM ('pending', 'succeeded', 'failed', 'cancelled');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');

-- 2. Core Tables
-- User Profiles (extends auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'user'::public.user_role,
    stripe_customer_id TEXT UNIQUE,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Questions
CREATE TABLE public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL UNIQUE,
    options JSONB NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Sessions
CREATE TABLE public.quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.quiz_status DEFAULT 'in_progress'::public.quiz_status,
    current_question INTEGER DEFAULT 1,
    total_questions INTEGER DEFAULT 7,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    preparation_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Answers
CREATE TABLE public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    answered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, question_id)
);

-- Products (for checkout)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    quiz_session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
    payment_intent_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    payment_method TEXT,
    transaction_id TEXT,
    payment_date TIMESTAMPTZ,
    billing_info JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Payment Transactions
CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_intent_id TEXT,
    stripe_charge_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    status TEXT NOT NULL,
    transaction_type TEXT DEFAULT 'payment',
    gateway TEXT DEFAULT 'stripe',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes for Performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_status ON public.quiz_sessions(status);
CREATE INDEX idx_quiz_answers_session_id ON public.quiz_answers(session_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);

-- 4. Functions (MUST BE BEFORE RLS POLICIES)
-- Function for auto profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function to check admin role using auth metadata (recommended pattern)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Function to check admin role from user_profiles (for non-user tables)
CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Pattern 1: Core User Tables - Simple policies only
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin access to all user profiles using auth metadata
CREATE POLICY "admins_view_all_user_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.is_admin_from_auth());

-- Pattern 4: Public Read for quiz questions (everyone can see questions)
CREATE POLICY "public_can_read_quiz_questions"
ON public.quiz_questions
FOR SELECT
TO public
USING (true);

-- Admin can manage questions using non-user table pattern
CREATE POLICY "admins_manage_quiz_questions"
ON public.quiz_questions
FOR ALL
TO authenticated
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

-- Pattern 2: Simple User Ownership for quiz sessions
CREATE POLICY "users_manage_own_quiz_sessions"
ON public.quiz_sessions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin can view all sessions
CREATE POLICY "admins_view_all_quiz_sessions"
ON public.quiz_sessions
FOR SELECT
TO authenticated
USING (public.has_admin_role());

-- Pattern 2: Quiz answers - users can only access their own
CREATE POLICY "users_manage_own_quiz_answers"
ON public.quiz_answers
FOR ALL
TO authenticated
USING (session_id IN (
    SELECT id FROM public.quiz_sessions WHERE user_id = auth.uid()
))
WITH CHECK (session_id IN (
    SELECT id FROM public.quiz_sessions WHERE user_id = auth.uid()
));

-- Admin can view all answers
CREATE POLICY "admins_view_all_quiz_answers"
ON public.quiz_answers
FOR SELECT
TO authenticated
USING (public.has_admin_role());

-- Pattern 4: Public Read for products (everyone can see products)
CREATE POLICY "public_can_read_products"
ON public.products
FOR SELECT
TO public
USING (is_active = true);

-- Admin can manage products
CREATE POLICY "admins_manage_products"
ON public.products
FOR ALL
TO authenticated
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

-- Pattern 2: Orders - users can only see their own
CREATE POLICY "users_manage_own_orders"
ON public.orders
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin can view all orders
CREATE POLICY "admins_view_all_orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_admin_role());

-- Payment transactions - users can only see their own
CREATE POLICY "users_view_own_payment_transactions"
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (order_id IN (
    SELECT id FROM public.orders WHERE user_id = auth.uid()
));

-- Admin can view all transactions
CREATE POLICY "admins_view_all_payment_transactions"
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (public.has_admin_role());

-- 7. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    quiz_session_uuid UUID := gen_random_uuid();
    product_uuid UUID := gen_random_uuid();
    q1_uuid UUID := gen_random_uuid();
    q2_uuid UUID := gen_random_uuid();
    q3_uuid UUID := gen_random_uuid();
    q4_uuid UUID := gen_random_uuid();
    q5_uuid UUID := gen_random_uuid();
    q6_uuid UUID := gen_random_uuid();
    q7_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@quiz.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Administrador", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@quiz.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Usuário Teste", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert quiz questions
    INSERT INTO public.quiz_questions (id, question_text, question_order, options, category) VALUES
        (q1_uuid, 'Há quanto tempo você estuda para concursos?', 1, 
         '["Estou começando agora", "De 1 a 6 meses", "De 6 meses a 1 ano", "Mais de 1 ano"]'::jsonb, 'preparation'),
        (q2_uuid, 'Quantas horas por dia você consegue dedicar aos estudos?', 2,
         '["Menos de 1 hora", "1-2 horas", "2-4 horas", "Mais de 4 horas"]'::jsonb, 'dedication'),
        (q3_uuid, 'Qual sua maior dificuldade nos estudos?', 3,
         '["Falta de organização", "Falta de tempo", "Dificuldade com o conteúdo", "Falta de motivação"]'::jsonb, 'challenges'),
        (q4_uuid, 'Você já prestou algum concurso antes?', 4,
         '["Não, será minha primeira vez", "Sim, mas não fui aprovado", "Sim, já fui aprovado antes", "Sim, já sou servidor público"]'::jsonb, 'experience'),
        (q5_uuid, 'Qual área de concurso mais te interessa?', 5,
         '["Área fiscal/tributária", "Área policial/militar", "Área administrativa", "Área da saúde", "Área educacional", "Outras áreas"]'::jsonb, 'interest'),
        (q6_uuid, 'Como você avalia seu conhecimento atual?', 6,
         '["Iniciante", "Básico", "Intermediário", "Avançado"]'::jsonb, 'knowledge'),
        (q7_uuid, 'Qual seu principal objetivo com a aprovação?', 7,
         '["Estabilidade financeira", "Realização pessoal", "Crescimento profissional", "Servir à sociedade"]'::jsonb, 'motivation');

    -- Create a sample product for checkout
    INSERT INTO public.products (id, name, description, price, currency) VALUES
        (product_uuid, 'Plano de Estudos Personalizado', 
         'Receba um plano de estudos completo e personalizado baseado no seu perfil', 4.90, 'BRL');

    -- Create a sample quiz session
    INSERT INTO public.quiz_sessions (id, user_id, status, preparation_score, completed_at) VALUES
        (quiz_session_uuid, user_uuid, 'completed', 78, now());

    -- Create sample quiz answers
    INSERT INTO public.quiz_answers (session_id, question_id, answer_text, question_order) VALUES
        (quiz_session_uuid, q1_uuid, 'De 6 meses a 1 ano', 1),
        (quiz_session_uuid, q2_uuid, '2-4 horas', 2),
        (quiz_session_uuid, q3_uuid, 'Falta de organização', 3),
        (quiz_session_uuid, q4_uuid, 'Sim, mas não fui aprovado', 4),
        (quiz_session_uuid, q5_uuid, 'Área administrativa', 5),
        (quiz_session_uuid, q6_uuid, 'Intermediário', 6),
        (quiz_session_uuid, q7_uuid, 'Crescimento profissional', 7);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;