-- Add Student Enrollment Table
CREATE TABLE IF NOT EXISTS public.student_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id),
  enrollment_date DATE DEFAULT NOW(),
  status TEXT DEFAULT 'active', -- active, graduated, withdrawn
  expected_graduation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, program_id)
);

-- Add notifications and engagement log tables
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  payment_for_id UUID,
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'INR',
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  payment_method TEXT, -- card, upi, bank_transfer, loan
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financing_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.financing_applications(id) ON DELETE CASCADE,
  approved_amount BIGINT NOT NULL,
  approval_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  disbursement_date TIMESTAMP WITH TIME ZONE,
  disbursement_status TEXT DEFAULT 'pending', -- pending, partial, completed
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_engagement_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- login, view_program, apply_financing, complete_payment, etc.
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
  relation TEXT NOT NULL, -- Father, Mother, Guardian
  occupation TEXT,
  annual_income BIGINT,
  is_co_applicant BOOLEAN DEFAULT FALSE,
  consent_status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- SSC, HSC, Aadhar, PAN, Income_Proof, etc.
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.student_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_engagement_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_enrollment_student ON public.student_enrollment(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollment_institution ON public.student_enrollment(institution_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_student ON public.payment_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_financing_approvals_application ON public.financing_approvals(application_id);
CREATE INDEX IF NOT EXISTS idx_engagement_log_student ON public.student_engagement_log(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_guardians_student ON public.parent_guardians(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_student ON public.student_documents(student_id);
