-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_engagement_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STUDENTS TABLE POLICIES
-- ============================================================================
-- Students can view their own profile
CREATE POLICY "students_select_own" ON public.students
  FOR SELECT USING (auth.uid() = id);

-- Students can update their own profile
CREATE POLICY "students_update_own" ON public.students
  FOR UPDATE USING (auth.uid() = id);

-- Students can insert their own profile (on signup)
CREATE POLICY "students_insert_own" ON public.students
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Institution admins can view students enrolled in their institution
CREATE POLICY "institution_admins_view_students" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.institution_admins ia
      WHERE ia.user_id = auth.uid()
      AND ia.institution_id = (
        SELECT institution_id FROM public.student_enrollment
        WHERE student_id = public.students.id
      )
    )
  );

-- ============================================================================
-- INSTITUTIONS TABLE POLICIES
-- ============================================================================
-- Anyone can view public institutions
CREATE POLICY "institutions_public_select" ON public.institutions
  FOR SELECT USING (is_verified = true);

-- Institution admins can update their own institution
CREATE POLICY "institution_admins_update_own" ON public.institutions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.institution_admins
      WHERE institution_id = public.institutions.id
      AND user_id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- ============================================================================
-- INSTITUTION ADMINS TABLE POLICIES
-- ============================================================================
-- Institution admins can view admins in their own institution
CREATE POLICY "institution_admins_select" ON public.institution_admins
  FOR SELECT USING (
    institution_id IN (
      SELECT institution_id FROM public.institution_admins
      WHERE user_id = auth.uid()
    )
  );

-- Institution admins can manage admins in their own institution
CREATE POLICY "institution_admins_manage" ON public.institution_admins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.institution_admins ia
      WHERE ia.institution_id = public.institution_admins.institution_id
      AND ia.user_id = auth.uid()
      AND ia.role = 'admin'
    )
  );

-- ============================================================================
-- PROGRAMS TABLE POLICIES
-- ============================================================================
-- Anyone can view active programs from verified institutions
CREATE POLICY "programs_public_select" ON public.programs
  FOR SELECT USING (
    is_active = true AND
    institution_id IN (
      SELECT id FROM public.institutions WHERE is_verified = true
    )
  );

-- Institution admins can manage programs in their institution
CREATE POLICY "programs_institution_manage" ON public.programs
  FOR ALL USING (
    institution_id IN (
      SELECT institution_id FROM public.institution_admins
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- ============================================================================
-- FEE STRUCTURES TABLE POLICIES
-- ============================================================================
-- Anyone can view fee structures for public programs
CREATE POLICY "fee_structures_public_select" ON public.fee_structures
  FOR SELECT USING (
    program_id IN (
      SELECT id FROM public.programs WHERE is_active = true
    )
  );

-- Institution admins can manage fee structures for their programs
CREATE POLICY "fee_structures_manage" ON public.fee_structures
  FOR ALL USING (
    program_id IN (
      SELECT id FROM public.programs
      WHERE institution_id IN (
        SELECT institution_id FROM public.institution_admins
        WHERE user_id = auth.uid()
        AND role IN ('admin', 'manager')
      )
    )
  );

-- ============================================================================
-- FINANCING PRODUCTS TABLE POLICIES
-- ============================================================================
-- Anyone can view active financing products
CREATE POLICY "financing_products_select" ON public.financing_products
  FOR SELECT USING (is_active = true);

-- ============================================================================
-- FINANCING APPLICATIONS TABLE POLICIES
-- ============================================================================
-- Students can view their own applications
CREATE POLICY "financing_apps_student_select" ON public.financing_applications
  FOR SELECT USING (student_id = auth.uid());

-- Students can create their own applications
CREATE POLICY "financing_apps_student_insert" ON public.financing_applications
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can update their own draft applications
CREATE POLICY "financing_apps_student_update" ON public.financing_applications
  FOR UPDATE USING (student_id = auth.uid() AND status = 'draft');

-- Institution admins can view applications from their students
CREATE POLICY "financing_apps_institution_select" ON public.financing_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_enrollment se
      INNER JOIN public.institution_admins ia ON ia.institution_id = se.institution_id
      WHERE se.student_id = public.financing_applications.student_id
      AND ia.user_id = auth.uid()
    )
  );

-- ============================================================================
-- PAYMENT TRANSACTIONS TABLE POLICIES
-- ============================================================================
-- Students can view their own transactions
CREATE POLICY "payments_student_select" ON public.payment_transactions
  FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.financing_applications fa
      WHERE fa.id = payment_for_id
      AND fa.student_id = auth.uid()
    )
  );

-- Institution admins can view transactions for their students
CREATE POLICY "payments_institution_select" ON public.payment_transactions
  FOR SELECT USING (
    student_id IN (
      SELECT se.student_id FROM public.student_enrollment se
      INNER JOIN public.institution_admins ia ON ia.institution_id = se.institution_id
      WHERE ia.user_id = auth.uid()
    )
  );

-- ============================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================================================
-- Users can view their own notifications
CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT USING (recipient_id = auth.uid());

-- ============================================================================
-- MESSAGES TABLE POLICIES
-- ============================================================================
-- Users can view messages they're part of
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

-- Users can create messages
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- ============================================================================
-- STUDENT ENGAGEMENT LOG POLICIES
-- ============================================================================
-- Only system can insert/update engagement logs
CREATE POLICY "engagement_log_system_write" ON public.student_engagement_log
  FOR ALL WITH CHECK (true);

-- Students can view their own engagement data
CREATE POLICY "engagement_log_student_select" ON public.student_engagement_log
  FOR SELECT USING (student_id = auth.uid());

-- Institution admins can view engagement data for their students
CREATE POLICY "engagement_log_institution_select" ON public.student_engagement_log
  FOR SELECT USING (
    student_id IN (
      SELECT se.student_id FROM public.student_enrollment se
      INNER JOIN public.institution_admins ia ON ia.institution_id = se.institution_id
      WHERE ia.user_id = auth.uid()
    )
  );

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS students_email_idx ON public.students(email);
CREATE INDEX IF NOT EXISTS students_created_at_idx ON public.students(created_at DESC);
CREATE INDEX IF NOT EXISTS institutions_name_idx ON public.institutions(name);
CREATE INDEX IF NOT EXISTS institutions_verified_idx ON public.institutions(is_verified);
CREATE INDEX IF NOT EXISTS programs_institution_idx ON public.programs(institution_id);
CREATE INDEX IF NOT EXISTS programs_is_active_idx ON public.programs(is_active);
CREATE INDEX IF NOT EXISTS financing_apps_student_idx ON public.financing_applications(student_id);
CREATE INDEX IF NOT EXISTS financing_apps_status_idx ON public.financing_applications(status);
CREATE INDEX IF NOT EXISTS payments_student_idx ON public.payment_transactions(student_id);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payment_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_recipient_idx ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS messages_recipient_idx ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS engagement_student_idx ON public.student_engagement_log(student_id);
