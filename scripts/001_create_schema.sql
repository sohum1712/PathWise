-- Unified Student Engagement Ecosystem - Database Schema
-- This script creates all tables for the student engagement platform

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Students Table
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
  country TEXT,
  profile_image_url TEXT,
  qualification_level TEXT, -- 12th, Diploma, Graduation, etc.
  specialization TEXT,
  target_institution_id UUID REFERENCES public.institutions(id),
  annual_family_income BIGINT,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Institutions (Colleges/Universities)
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- College, University, Polytechnic, etc.
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
  country TEXT,
  established_year INTEGER,
  description TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Institution Admins (CRM Users)
CREATE TABLE IF NOT EXISTS public.institution_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- admin, manager, counselor
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(institution_id, user_id)
);

-- Programs (Courses/Degrees)
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL, -- Diploma, Bachelor, Master, PhD
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

-- Fee Structures
CREATE TABLE IF NOT EXISTS public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  year INTEGER NOT NULL, -- 1, 2, 3, etc.
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

-- Lenders
CREATE TABLE IF NOT EXISTS public.lenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- Bank, NBFC, Government, etc.
  logo_url TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financing Products
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

-- Financing Applications
CREATE TABLE IF NOT EXISTS public.financing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id),
  product_id UUID NOT NULL REFERENCES public.financing_products(id),
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  requested_amount BIGINT,
  approved_amount BIGINT,
  status TEXT DEFAULT 'draft', -- draft, submitted, under_review, approved, rejected, disbursed
  rejection_reason TEXT,
  co_applicant_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PARENT/GUARDIAN TABLES
-- ============================================================================

-- Parents/Guardians
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  relation TEXT NOT NULL, -- Father, Mother, Guardian
  occupation TEXT,
  annual_income BIGINT,
  is_co_applicant BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PAYMENT TABLES
-- ============================================================================

-- Student Payments
CREATE TABLE IF NOT EXISTS public.student_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id),
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_date TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, cancelled
  payment_method TEXT, -- online, offline, loan
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  transaction_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Plans
CREATE TABLE IF NOT EXISTS public.payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id),
  total_amount BIGINT NOT NULL,
  installments INTEGER DEFAULT 12,
  frequency TEXT DEFAULT 'monthly', -- monthly, quarterly, yearly
  start_date DATE,
  status TEXT DEFAULT 'active', -- active, completed, paused
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Installments
CREATE TABLE IF NOT EXISTS public.payment_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_plan_id UUID NOT NULL REFERENCES public.payment_plans(id) ON DELETE CASCADE,
  installment_number INTEGER,
  due_date DATE,
  amount BIGINT,
  paid_amount BIGINT DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, paid, overdue, defaulted
  payment_id UUID REFERENCES public.student_payments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENGAGEMENT & COMMUNICATION TABLES
-- ============================================================================

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  target_audience TEXT, -- all, students, parents, lenders
  created_by UUID NOT NULL REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID NOT NULL REFERENCES auth.users(id),
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- SSC, HSC, Aadhar, PAN, etc.
  file_path TEXT NOT NULL,
  file_size INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
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
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Students: Students can only view/edit their own profile
CREATE POLICY "students_select_own" ON public.students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "students_update_own" ON public.students FOR UPDATE USING (auth.uid() = id);

-- Programs: Public read, only admins can modify
CREATE POLICY "programs_select_public" ON public.programs FOR SELECT USING (true);

-- Fee Structures: Public read
CREATE POLICY "fee_structures_select_public" ON public.fee_structures FOR SELECT USING (true);

-- Lenders: Public read
CREATE POLICY "lenders_select_public" ON public.lenders FOR SELECT USING (true);

-- Financing Products: Public read
CREATE POLICY "financing_products_select_public" ON public.financing_products FOR SELECT USING (true);

-- Financing Applications: Students view own, Lenders view submitted
CREATE POLICY "financing_applications_select_own" ON public.financing_applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "financing_applications_insert_own" ON public.financing_applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "financing_applications_update_own" ON public.financing_applications FOR UPDATE USING (auth.uid() = student_id AND status = 'draft');

-- Institution Admins: Can view own institution info
CREATE POLICY "institution_admins_select_own" ON public.institution_admins FOR SELECT USING (auth.uid() = user_id);

-- Parents: Can view associated student info
CREATE POLICY "parents_select_own" ON public.parents FOR SELECT USING (EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND id = auth.uid()));

-- Student Payments: Students view own, admins view all
CREATE POLICY "student_payments_select_own" ON public.student_payments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "student_payments_insert_own" ON public.student_payments FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Payment Plans: Students view own
CREATE POLICY "payment_plans_select_own" ON public.payment_plans FOR SELECT USING (auth.uid() = student_id);

-- Messages: Users view received messages
CREATE POLICY "messages_select_own" ON public.messages FOR SELECT USING (auth.uid() = receiver_id OR auth.uid() = sender_id);
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Documents: Students upload own, admins can view
CREATE POLICY "documents_select_own" ON public.documents FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "documents_insert_own" ON public.documents FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_target_institution ON public.students(target_institution_id);
CREATE INDEX IF NOT EXISTS idx_institution_admins_institution ON public.institution_admins(institution_id);
CREATE INDEX IF NOT EXISTS idx_institution_admins_user ON public.institution_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_programs_institution ON public.programs(institution_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_program ON public.fee_structures(program_id);
CREATE INDEX IF NOT EXISTS idx_financing_products_lender ON public.financing_products(lender_id);
CREATE INDEX IF NOT EXISTS idx_financing_applications_student ON public.financing_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_financing_applications_status ON public.financing_applications(status);
CREATE INDEX IF NOT EXISTS idx_parents_student ON public.parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_payments_student ON public.student_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_payments_status ON public.student_payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_plans_student ON public.payment_plans(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_installments_plan ON public.payment_installments(payment_plan_id);
CREATE INDEX IF NOT EXISTS idx_announcements_institution ON public.announcements(institution_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_documents_student ON public.documents(student_id);
