-- ============================================================================
-- StudyHub - Full Database Setup (Run this single script in Supabase SQL Editor)
-- ============================================================================

-- ============================================================================
-- CORE TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'College',
  affiliation TEXT,
  accreditation TEXT,
  logo_url TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  established_year INTEGER,
  description TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  profile_image_url TEXT,
  qualification_level TEXT,
  specialization TEXT,
  degree_stream TEXT,
  board_exam_score NUMERIC,
  target_institution_id UUID REFERENCES public.institutions(id),
  annual_family_income BIGINT,
  budget_range TEXT,
  location_preference TEXT,
  desired_stream TEXT,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.institution_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(institution_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Bachelor',
  duration_years NUMERIC,
  total_fees BIGINT,
  currency TEXT DEFAULT 'INR',
  description TEXT,
  eligibility_criteria TEXT,
  seats_available INTEGER,
  admission_start_date DATE,
  admission_end_date DATE,
  program_start_date DATE,
  placement_rate NUMERIC,
  average_package BIGINT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  tuition_fee BIGINT,
  hostel_fee BIGINT,
  exam_fee BIGINT,
  library_fee BIGINT,
  miscellaneous_fee BIGINT,
  total_fee BIGINT,
  payment_due_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(program_id, year)
);

-- ============================================================================
-- FINANCING TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'NBFC',
  logo_url TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financing_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_id UUID NOT NULL REFERENCES public.lenders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  min_loan_amount BIGINT,
  max_loan_amount BIGINT,
  interest_rate_min NUMERIC,
  interest_rate_max NUMERIC,
  tenure_years_min INTEGER,
  tenure_years_max INTEGER,
  processing_fee_percent NUMERIC,
  eligibility_criteria TEXT,
  documents_required TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id),
  product_id UUID NOT NULL REFERENCES public.financing_products(id),
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  requested_amount BIGINT,
  approved_amount BIGINT,
  status TEXT DEFAULT 'draft',
  rejection_reason TEXT,
  co_applicant_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financing_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.financing_applications(id) ON DELETE CASCADE,
  approved_amount BIGINT NOT NULL,
  approval_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  disbursement_date TIMESTAMP WITH TIME ZONE,
  disbursement_status TEXT DEFAULT 'pending',
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PAYMENT TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  payment_for_id UUID,
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'INR',
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id),
  total_amount BIGINT NOT NULL,
  installments INTEGER DEFAULT 12,
  frequency TEXT DEFAULT 'monthly',
  start_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_plan_id UUID NOT NULL REFERENCES public.payment_plans(id) ON DELETE CASCADE,
  installment_number INTEGER,
  due_date DATE,
  amount BIGINT,
  paid_amount BIGINT DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_id UUID REFERENCES public.payment_transactions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENGAGEMENT & COMMUNICATION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.student_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id),
  enrollment_date DATE DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  expected_graduation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, program_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_engagement_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.parent_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  relation TEXT NOT NULL,
  occupation TEXT,
  annual_income BIGINT,
  is_co_applicant BOOLEAN DEFAULT FALSE,
  consent_status TEXT DEFAULT 'pending',
  consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL DEFAULT 'document',
  file_size INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  target_audience TEXT DEFAULT 'all',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_engagement_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Students
CREATE POLICY "students_select_own" ON public.students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "students_insert_own" ON public.students FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "students_update_own" ON public.students FOR UPDATE USING (auth.uid() = id);

-- Institutions: anyone can view (including unverified - needed for new signups)
CREATE POLICY "institutions_select_all" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "institutions_insert_own" ON public.institutions FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "institutions_update_own" ON public.institutions FOR UPDATE USING (auth.uid() = created_by);

-- Institution Admins
CREATE POLICY "institution_admins_select_own" ON public.institution_admins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "institution_admins_insert_own" ON public.institution_admins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Programs: public read
CREATE POLICY "programs_select_public" ON public.programs FOR SELECT USING (true);
CREATE POLICY "programs_manage" ON public.programs FOR ALL USING (
  institution_id IN (SELECT institution_id FROM public.institution_admins WHERE user_id = auth.uid())
);

-- Fee Structures: public read
CREATE POLICY "fee_structures_select_public" ON public.fee_structures FOR SELECT USING (true);
CREATE POLICY "fee_structures_manage" ON public.fee_structures FOR ALL USING (
  program_id IN (
    SELECT p.id FROM public.programs p
    INNER JOIN public.institution_admins ia ON ia.institution_id = p.institution_id
    WHERE ia.user_id = auth.uid()
  )
);

-- Lenders: public read
CREATE POLICY "lenders_select_public" ON public.lenders FOR SELECT USING (true);

-- Financing Products: public read
CREATE POLICY "financing_products_select_public" ON public.financing_products FOR SELECT USING (true);

-- Financing Applications
CREATE POLICY "financing_apps_select_own" ON public.financing_applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "financing_apps_insert_own" ON public.financing_applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "financing_apps_update_own" ON public.financing_applications FOR UPDATE USING (auth.uid() = student_id);

-- Financing Approvals
CREATE POLICY "financing_approvals_select" ON public.financing_approvals FOR SELECT USING (
  application_id IN (SELECT id FROM public.financing_applications WHERE student_id = auth.uid())
);

-- Payment Transactions
CREATE POLICY "payments_select_own" ON public.payment_transactions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "payments_insert_own" ON public.payment_transactions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "payments_update_own" ON public.payment_transactions FOR UPDATE USING (auth.uid() = student_id);

-- Payment Plans
CREATE POLICY "payment_plans_select_own" ON public.payment_plans FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "payment_plans_insert_own" ON public.payment_plans FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Payment Installments
CREATE POLICY "payment_installments_select" ON public.payment_installments FOR SELECT USING (
  payment_plan_id IN (SELECT id FROM public.payment_plans WHERE student_id = auth.uid())
);

-- Student Enrollment
CREATE POLICY "enrollment_select_own" ON public.student_enrollment FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "enrollment_insert_own" ON public.student_enrollment FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT WITH CHECK (true);

-- Messages
CREATE POLICY "messages_select_own" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Engagement Log
CREATE POLICY "engagement_log_select_own" ON public.student_engagement_log FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "engagement_log_insert" ON public.student_engagement_log FOR INSERT WITH CHECK (true);

-- Parent Guardians
CREATE POLICY "parent_guardians_select_own" ON public.parent_guardians FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE id = auth.uid())
);
CREATE POLICY "parent_guardians_insert_own" ON public.parent_guardians FOR INSERT WITH CHECK (
  student_id = auth.uid()
);

-- Student Documents
CREATE POLICY "student_documents_select_own" ON public.student_documents FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "student_documents_insert_own" ON public.student_documents FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Announcements
CREATE POLICY "announcements_select_public" ON public.announcements FOR SELECT USING (true);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_institution_admins_user ON public.institution_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_institution_admins_institution ON public.institution_admins(institution_id);
CREATE INDEX IF NOT EXISTS idx_programs_institution ON public.programs(institution_id);
CREATE INDEX IF NOT EXISTS idx_financing_apps_student ON public.financing_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_student ON public.payment_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_engagement_log_student ON public.student_engagement_log(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_student ON public.student_enrollment(student_id);

-- ============================================================================
-- SEED DATA - Sample lenders and financing products
-- ============================================================================

INSERT INTO public.lenders (name, type, description, is_verified) VALUES
  ('EduLoan Bank', 'Bank', 'Leading education loan provider with competitive rates', true),
  ('Finance Plus', 'NBFC', 'Fast approvals and flexible repayment options', true),
  ('Student Finance Co.', 'NBFC', 'Specialized in student education financing', true),
  ('Credit Trust', 'Bank', 'Trusted banking partner for education loans', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.financing_products (lender_id, name, description, min_loan_amount, max_loan_amount, interest_rate_min, interest_rate_max, tenure_years_min, tenure_years_max, processing_fee_percent, is_active)
SELECT
  l.id,
  p.name,
  p.description,
  p.min_amount,
  p.max_amount,
  p.rate_min,
  p.rate_max,
  p.tenure_min,
  p.tenure_max,
  p.processing_fee,
  true
FROM public.lenders l
CROSS JOIN (VALUES
  ('EduLoan Bank', 'Standard Education Loan', 'Flexible education loan for all courses', 100000, 2000000, 7.5, 9.0, 3, 10, 1.0),
  ('Finance Plus', 'Premium Education Finance', 'High-value loans with extended tenure', 150000, 3000000, 8.0, 10.0, 5, 12, 1.5),
  ('Student Finance Co.', 'Quick Student Loan', 'Fast approval with minimal documentation', 75000, 1500000, 7.2, 8.5, 2, 8, 0.8),
  ('Credit Trust', 'Education Credit Line', 'Revolving credit for ongoing education expenses', 200000, 4000000, 8.5, 11.0, 5, 15, 2.0)
) AS p(lender_name, name, description, min_amount, max_amount, rate_min, rate_max, tenure_min, tenure_max, processing_fee)
WHERE l.name = p.lender_name
ON CONFLICT DO NOTHING;
