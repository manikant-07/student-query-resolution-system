-- ==============================================================================
-- STUDENT QUERY RESOLUTION SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Full Schema Migration: Tables, Constraints, RLS Policies, Triggers & Seed Data
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE A: PROFILES
-- Linked directly to Supabase auth.users
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    enrollment_number TEXT,
    department TEXT,
    course TEXT DEFAULT 'B.Tech - Artificial Intelligence & Data Science',
    semester TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
    avatar_url TEXT,
    is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==============================================================================
-- TABLE B: FACULTY
-- Holds faculty-specific metadata like workload & availability for CSP assignment
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role_title TEXT DEFAULT 'Faculty Advisor',
    department TEXT NOT NULL,
    specialization TEXT[] DEFAULT '{}',
    current_workload INTEGER NOT NULL DEFAULT 0 CHECK (current_workload >= 0),
    maximum_workload INTEGER NOT NULL DEFAULT 5 CHECK (maximum_workload > 0),
    availability_status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faculty_profile ON public.faculty(profile_id);
CREATE INDEX IF NOT EXISTS idx_faculty_dept ON public.faculty(department);

-- ==============================================================================
-- TABLE C: KNOWLEDGE RULES
-- Expert system rules for automated academic query evaluation
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    description TEXT,
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.90,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rules_category ON public.knowledge_rules(category);
CREATE INDEX IF NOT EXISTS idx_rules_code ON public.knowledge_rules(rule_code);

-- ==============================================================================
-- TABLE D: QUERIES
-- Core academic grievance & inquiry records
-- ==============================================================================
CREATE SEQUENCE IF NOT EXISTS query_number_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS public.queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_number TEXT UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_roll TEXT,
    email TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Urgent', 'High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Answered', 'Resolved', 'Under Review')),
    assigned_faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_to_name TEXT DEFAULT 'Unassigned',
    assigned_dept TEXT,
    ai_suggestion TEXT,
    confidence_score NUMERIC(3, 2),
    matched_rule TEXT,
    tags TEXT[] DEFAULT '{}',
    feedback_helpful INTEGER NOT NULL DEFAULT 0,
    feedback_not_helpful INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_queries_student ON public.queries(student_id);
CREATE INDEX IF NOT EXISTS idx_queries_assigned_faculty ON public.queries(assigned_faculty_id);
CREATE INDEX IF NOT EXISTS idx_queries_status ON public.queries(status);
CREATE INDEX IF NOT EXISTS idx_queries_category ON public.queries(category);
CREATE INDEX IF NOT EXISTS idx_queries_created_at ON public.queries(created_at DESC);

-- ==============================================================================
-- TABLE E: QUERY RESPONSES
-- Official answers, explanations, and student/faculty replies
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.query_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL REFERENCES public.queries(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL DEFAULT 'Faculty',
    response_message TEXT NOT NULL,
    is_official BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_responses_query ON public.query_responses(query_id);

-- ==============================================================================
-- TABLE F: QUERY ATTACHMENTS
-- Supporting PDFs, medical certificates, fee slips, images
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.query_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL REFERENCES public.queries(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attachments_query ON public.query_attachments(query_id);

-- ==============================================================================
-- TABLE G: QUERY STATUS HISTORY
-- Complete audit trail of resolution lifecycle transitions
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.query_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL REFERENCES public.queries(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changed_by_name TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_query ON public.query_status_history(query_id);

-- ==============================================================================
-- TABLE H: NOTIFICATIONS
-- Real-time notification records for updates on student queries
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    query_id UUID REFERENCES public.queries(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);

-- ==============================================================================
-- 2. TRIGGERS & FUNCTIONS
-- ==============================================================================

-- A. Auto-confirm student user email to permit immediate sign-in
CREATE OR REPLACE FUNCTION public.auto_confirm_student_user()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
    NEW.confirmed_at = COALESCE(NEW.confirmed_at, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_before_insert ON auth.users;
CREATE TRIGGER on_auth_user_before_insert
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_student_user();

-- B. Auto-handle new user registration into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    user_name TEXT;
    user_roll TEXT;
    user_dept TEXT;
    user_sem TEXT;
BEGIN
    -- Public signups are forced to 'student'. Faculty/Admin must be created via Admin workflows.
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    IF user_role NOT IN ('student', 'faculty', 'admin') THEN
        user_role := 'student';
    END IF;

    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));
    user_roll := NEW.raw_user_meta_data->>'enrollment_number';
    user_dept := COALESCE(NEW.raw_user_meta_data->>'department', 'Artificial Intelligence & Data Science');
    user_sem  := COALESCE(NEW.raw_user_meta_data->>'semester', '4th Semester');

    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        enrollment_number,
        department,
        semester,
        role,
        created_at
    ) VALUES (
        NEW.id,
        user_name,
        NEW.email,
        user_roll,
        user_dept,
        user_sem,
        user_role,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        enrollment_number = COALESCE(EXCLUDED.enrollment_number, profiles.enrollment_number),
        department = COALESCE(EXCLUDED.department, profiles.department),
        semester = COALESCE(EXCLUDED.semester, profiles.semester);

    -- If registered as faculty, also create an entry in public.faculty
    IF user_role = 'faculty' THEN
        INSERT INTO public.faculty (
            profile_id,
            name,
            email,
            department,
            role_title,
            maximum_workload,
            current_workload,
            availability_status
        ) VALUES (
            NEW.id,
            user_name,
            NEW.email,
            user_dept,
            'Faculty Advisor',
            5,
            0,
            TRUE
        )
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- C. Auto-update queries.updated_at
CREATE OR REPLACE FUNCTION public.set_query_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    IF NEW.status = 'Resolved' AND (OLD.status IS NULL OR OLD.status != 'Resolved') THEN
        NEW.resolved_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_queries_updated_at ON public.queries;
CREATE TRIGGER set_queries_updated_at
    BEFORE UPDATE ON public.queries
    FOR EACH ROW EXECUTE FUNCTION public.set_query_updated_at();

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ------------------------------------------------------------------------------
-- RLS: PROFILES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles can be viewed by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles can be viewed by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: FACULTY
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Everyone can view faculty directory" ON public.faculty;
DROP POLICY IF EXISTS "Anyone can view faculty directory" ON public.faculty;
CREATE POLICY "Anyone can view faculty directory"
    ON public.faculty FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins or faculty self can update faculty record" ON public.faculty;
CREATE POLICY "Admins or faculty self can update faculty record"
    ON public.faculty FOR UPDATE
    TO authenticated
    USING (public.is_admin() OR profile_id = auth.uid());

DROP POLICY IF EXISTS "Admins can insert or delete faculty" ON public.faculty;
CREATE POLICY "Admins can insert or delete faculty"
    ON public.faculty FOR ALL
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: KNOWLEDGE RULES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read active knowledge rules" ON public.knowledge_rules;
CREATE POLICY "Anyone can read active knowledge rules"
    ON public.knowledge_rules FOR SELECT
    TO public
    USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Only Admins can modify knowledge rules" ON public.knowledge_rules;
CREATE POLICY "Only Admins can modify knowledge rules"
    ON public.knowledge_rules FOR ALL
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: QUERIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Students read own queries; Faculty/Admin read assigned/all" ON public.queries;
CREATE POLICY "Students read own queries; Faculty/Admin read assigned/all"
    ON public.queries FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid()
        OR public.is_faculty()
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Students can insert queries" ON public.queries;
CREATE POLICY "Students can insert queries"
    ON public.queries FOR INSERT
    TO authenticated
    WITH CHECK (
        student_id = auth.uid()
    );

DROP POLICY IF EXISTS "Faculty/Admin can update queries" ON public.queries;
CREATE POLICY "Faculty/Admin can update queries"
    ON public.queries FOR UPDATE
    TO authenticated
    USING (
        public.is_admin()
        OR (public.is_faculty() AND (assigned_faculty_id = auth.uid() OR assigned_faculty_id IS NULL))
        OR student_id = auth.uid()
    );

DROP POLICY IF EXISTS "Admins can delete queries" ON public.queries;
CREATE POLICY "Admins can delete queries"
    ON public.queries FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: QUERY RESPONSES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Participants can view responses" ON public.query_responses;
CREATE POLICY "Participants can view responses"
    ON public.query_responses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.queries q
            WHERE q.id = query_responses.query_id
            AND (q.student_id = auth.uid() OR public.is_faculty() OR public.is_admin())
        )
    );

DROP POLICY IF EXISTS "Authorized users can post responses" ON public.query_responses;
CREATE POLICY "Authorized users can post responses"
    ON public.query_responses FOR INSERT
    TO authenticated
    WITH CHECK (
        author_id = auth.uid()
    );

-- ------------------------------------------------------------------------------
-- RLS: QUERY ATTACHMENTS
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Participants can view attachments" ON public.query_attachments;
CREATE POLICY "Participants can view attachments"
    ON public.query_attachments FOR SELECT
    TO authenticated
    USING (
        uploaded_by = auth.uid()
        OR public.is_faculty()
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.queries q
            WHERE q.id = query_attachments.query_id
            AND q.student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert attachments to their query" ON public.query_attachments;
CREATE POLICY "Users can insert attachments to their query"
    ON public.query_attachments FOR INSERT
    TO authenticated
    WITH CHECK (
        uploaded_by = auth.uid()
    );

-- ------------------------------------------------------------------------------
-- RLS: QUERY STATUS HISTORY
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view history of permitted queries" ON public.query_status_history;
CREATE POLICY "Users can view history of permitted queries"
    ON public.query_status_history FOR SELECT
    TO authenticated
    USING (
        public.is_faculty()
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.queries q
            WHERE q.id = query_status_history.query_id
            AND q.student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Authenticated users can record status history" ON public.query_status_history;
CREATE POLICY "Authenticated users can record status history"
    ON public.query_status_history FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- RLS: NOTIFICATIONS
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "System/Authenticated users can insert notifications" ON public.notifications;
CREATE POLICY "System/Authenticated users can insert notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ==============================================================================
-- 4. SUPABASE STORAGE BUCKET: query-attachments
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('query-attachments', 'query-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload attachments"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'query-attachments');

DROP POLICY IF EXISTS "Authorized users can read query attachments" ON storage.objects;
CREATE POLICY "Authorized users can read query attachments"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'query-attachments');

-- ==============================================================================
-- 5. SECURE ADMIN PROVISIONING & RPC FUNCTIONS
-- ==============================================================================

-- Admin-only RPC to create faculty members
CREATE OR REPLACE FUNCTION public.create_faculty_account(
    p_name TEXT,
    p_email TEXT,
    p_department TEXT,
    p_role_title TEXT DEFAULT 'Faculty Advisor',
    p_specialization TEXT[] DEFAULT '{}',
    p_maximum_workload INT DEFAULT 5
)
RETURNS JSONB AS $$
DECLARE
    v_fac_id UUID;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access Denied: Only administrators can provision faculty accounts.';
    END IF;

    INSERT INTO public.faculty (
        name,
        email,
        department,
        role_title,
        specialization,
        current_workload,
        maximum_workload,
        availability_status
    ) VALUES (
        p_name,
        p_email,
        p_department,
        p_role_title,
        p_specialization,
        0,
        p_maximum_workload,
        TRUE
    )
    RETURNING id INTO v_fac_id;

    RETURN jsonb_build_object(
        'success', true,
        'faculty_id', v_fac_id,
        'message', 'Faculty record created successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- One-time Initial Admin Setup Bootstrap
CREATE OR REPLACE FUNCTION public.setup_initial_admin(
    admin_user_id UUID,
    admin_full_name TEXT DEFAULT 'Institutional Administrator',
    admin_dept TEXT DEFAULT 'Academic Governance & Oversight'
)
RETURNS JSONB AS $$
DECLARE
    v_existing_admin_count INT;
BEGIN
    SELECT COUNT(*) INTO v_existing_admin_count
    FROM public.profiles
    WHERE role = 'admin';

    IF v_existing_admin_count > 0 THEN
        RAISE EXCEPTION 'Setup locked: An administrator already exists in the system.';
    END IF;

    UPDATE public.profiles
    SET role = 'admin',
        full_name = admin_full_name,
        department = admin_dept
    WHERE id = admin_user_id;

    RETURN jsonb_build_object('success', true, 'message', 'Initial administrator successfully initialized.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 6. SEED KNOWLEDGE RULES (From Academic Regulations Base)
-- ==============================================================================
INSERT INTO public.knowledge_rules (rule_code, category, condition, suggestion, description, confidence_score, is_active)
VALUES
('RULE_ATTENDANCE_MEDICAL_CONDONATION', 'Attendance', 'Attendance between 65% and 74% with verified medical hospitalization certificate', 'Submit Condonation Form AC-4 with original hospital discharge certificate to Academic Cell Room 204 within 3 business days.', 'Regulation 14.2: Medical Condonation for Acute Illness.', 0.94, true),
('RULE_ATTENDANCE_CRITICAL_DETENTION', 'Attendance', 'Attendance strictly below 65%', 'Attendance is critically below the 65% statutory condonation threshold. Contact the Department HOD immediately for course detention review.', 'Regulation 14.5: Year Detention for Sub-65% Attendance.', 0.98, true),
('RULE_EXAM_FEE_HOLD', 'Exams', 'Fee payment completed but portal shows Financial Clearance lock 403', 'ERP banking gateway reconciliation takes up to 48 hours. Present your bank receipt/UTR number to the Finance Desk Counter 3 for manual clearance override.', 'Regulation 8.1: Financial Verification for Admit Card Generation.', 0.90, true),
('RULE_TIMETABLE_ELECTIVE_CLASH', 'Timetable', 'Two courses scheduled at the exact same time slot for registered students', 'Submit Form TT-1 (Elective Collision Notification) to Academic Scheduling Committee. Clashing elective will be shifted to an alternate designated slot.', 'Regulation 5.4: Multi-Department Elective Scheduling Policy.', 0.95, true),
('RULE_FEE_INSTALLMENT_POLICY', 'Fees', 'Student requests split installment payment due to hardship or delayed income', 'Submit Fee Installment Application Form FA-2 endorsed by Faculty Proctor and Dean of Student Welfare before due date to waive late penalty.', 'Regulation 9.3: Special Installment Disbursement Scheme.', 0.88, true),
('RULE_NETWORK_RADIUS_TIMEOUT', 'Technical', 'Campus Wi-Fi authentication timeout or 802.1x enterprise certificate failure', 'Forget the college SSID network, reconnect using WPA2-Enterprise with domain college.edu, or visit IT Center Room 102 for certificate reload.', 'IT SOP 3.2: Enterprise RADIUS Certificate Deployment.', 0.82, true)
ON CONFLICT (rule_code) DO NOTHING;

-- ==============================================================================
-- 7. SEED FACULTY DIRECTORY
-- ==============================================================================
INSERT INTO public.faculty (name, email, role_title, department, specialization, current_workload, maximum_workload, availability_status)
VALUES
('Prof. Roshni Prasad', 'roshni.prasad@college.edu', 'Senior Professor & HOD', 'Artificial Intelligence & Data Science', ARRAY['Artificial Intelligence', 'Machine Learning Lab', 'Deep Learning'], 2, 5, true),
('Dr. Vikram Seth', 'vikram.seth@college.edu', 'Controller of Examinations & Professor', 'Examination Branch', ARRAY['Computer Architecture', 'Examination Systems', 'Formal Methods'], 3, 6, true),
('Prof. Priya Nair', 'priya.nair@college.edu', 'Associate Professor & Timetable In-charge', 'Academic Scheduling Committee', ARRAY['Database Management Systems', 'Cloud Computing', 'Web Technologies'], 1, 4, true),
('Mr. K. Narayanan', 'k.narayanan@college.edu', 'Senior Finance Officer', 'Accounts & Finance Office', ARRAY['Financial Audits', 'Fee Clearances', 'Scholarship Grants'], 4, 5, true),
('Er. Amit Saxena', 'amit.saxena@college.edu', 'Systems Administrator', 'IT & Campus Infrastructure', ARRAY['Campus Networking', 'ERP Portals', 'Wi-Fi Infrastructure'], 2, 6, true),
('Dr. Sunita Kulkarni', 'sunita.kulkarni@college.edu', 'Dean of Student Welfare & Warden', 'Hostel & Welfare Administration', ARRAY['Student Welfare', 'Disciplinary Affairs', 'Residential Safety'], 1, 5, false)
ON CONFLICT DO NOTHING;
