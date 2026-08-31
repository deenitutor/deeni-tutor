-- ====================================================================
-- DEENI TUTOR — COMPLETE POSTGRESQL SCHEMA & RLS POLICIES (SUPABASE)
-- Blueprint Sections: 8, 9, 10, 20, 21, 30
-- ====================================================================

-- 1. Create custom enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'parent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status_type AS ENUM (
        'draft', 
        'submitted', 
        'under_review', 
        'approved', 
        'rejected', 
        'suspended'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE teacher_gender AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type_enum AS ENUM (
        'identity_document',
        'madrasa_certificate',
        'academic_qualification',
        'teaching_certificate',
        'other_proof'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_status_enum AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proficiency_level_enum AS ENUM (
        'beginner',
        'intermediate',
        'advanced',
        'all_levels'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table (Base table synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'student',
    timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka',
    phone TEXT,
    country TEXT DEFAULT 'Bangladesh',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id VARCHAR(64) PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('arabic', 'quran', 'islamic_studies')),
    description TEXT,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Teacher Profiles Table
CREATE TABLE IF NOT EXISTS public.teacher_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT NOT NULL DEFAULT '',
    about_teaching TEXT DEFAULT '',
    institution TEXT NOT NULL,
    gender teacher_gender NOT NULL DEFAULT 'male',
    city TEXT NOT NULL DEFAULT 'Dhaka',
    district TEXT NOT NULL DEFAULT 'Dhaka',
    experience_years INTEGER NOT NULL DEFAULT 1 CHECK (experience_years >= 0),
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 10.00 CHECK (hourly_rate >= 3.00),
    trial_price NUMERIC(10, 2) NOT NULL DEFAULT 4.00 CHECK (trial_price >= 0.00),
    trial_available BOOLEAN NOT NULL DEFAULT TRUE,
    trial_duration INTEGER NOT NULL DEFAULT 30, -- minutes
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status verification_status_type NOT NULL DEFAULT 'draft',
    intro_video_url TEXT,
    qualifications TEXT[] DEFAULT '{}',
    certificates TEXT[] DEFAULT '{}',
    teaching_languages TEXT[] DEFAULT '{"Bengali", "English", "Arabic"}',
    levels TEXT[] DEFAULT '{"Beginner (Noorani Qaida / Alphabet)", "Elementary (A1-A2)", "Intermediate (B1-B2)"}',
    total_lessons INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    review_count INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Teacher Documents Table (Private Storage references)
CREATE TABLE IF NOT EXISTS public.teacher_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(user_id) ON DELETE CASCADE,
    document_type document_type_enum NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT,
    status document_status_enum NOT NULL DEFAULT 'pending',
    reviewer_notes TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Teacher Subjects Junction Table
CREATE TABLE IF NOT EXISTS public.teacher_subjects (
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(user_id) ON DELETE CASCADE,
    subject_id VARCHAR(64) NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    level proficiency_level_enum NOT NULL DEFAULT 'all_levels',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (teacher_id, subject_id)
);

-- 7. Teacher Availability Table (7 Days Schedule)
CREATE TABLE IF NOT EXISTS public.teacher_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(user_id) ON DELETE CASCADE,
    day_of_week VARCHAR(16) NOT NULL CHECK (day_of_week IN ('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')),
    day_name VARCHAR(16) NOT NULL,
    day_short VARCHAR(8) NOT NULL,
    start_time TIME NOT NULL DEFAULT '18:00',
    end_time TIME NOT NULL DEFAULT '22:00',
    slots_description TEXT NOT NULL DEFAULT '18:00 - 22:00 (Evening)',
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Dhaka',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (teacher_id, day_of_week)
);

-- 8. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    preferred_language TEXT DEFAULT 'English',
    learning_goals TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Children Table (For Parent accounts)
CREATE TABLE IF NOT EXISTS public.children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 25),
    learning_level TEXT NOT NULL DEFAULT 'Beginner (Noorani Qaida)',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Teacher Reviews Table
CREATE TABLE IF NOT EXISTS public.teacher_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(user_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    student_name TEXT NOT NULL,
    student_country TEXT NOT NULL DEFAULT 'UK',
    subject_taken TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Teacher Availability Exceptions Table (Blueprint Section 11 & 20)
CREATE TABLE IF NOT EXISTS public.teacher_availability_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT FALSE,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (teacher_id, date)
);

-- 12. Bookings Table (Blueprint Section 12 & 20)
DO $$ BEGIN
    CREATE TYPE booking_status_type AS ENUM (
        'pending', 
        'confirmed', 
        'rejected', 
        'cancelled', 
        'completed', 
        'no_show', 
        'disputed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lesson_type_enum AS ENUM ('trial', 'regular');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(user_id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    lesson_type lesson_type_enum NOT NULL DEFAULT 'regular',
    scheduled_at TIMESTAMPTZ NOT NULL, -- Stored strictly in UTC
    duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes IN (30, 45, 60, 90)),
    price_usd NUMERIC(10, 2) NOT NULL CHECK (price_usd >= 0.00),
    status booking_status_type NOT NULL DEFAULT 'pending',
    meeting_link TEXT,
    student_notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast duplicate / conflict checking
CREATE INDEX IF NOT EXISTS idx_bookings_teacher_scheduled 
    ON public.bookings (teacher_id, scheduled_at, status);

CREATE INDEX IF NOT EXISTS idx_bookings_student 
    ON public.bookings (student_id, status);

-- 13. Booking Events Table (Audit / Event Log — Blueprint Section 12 & 20)
CREATE TABLE IF NOT EXISTS public.booking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    actor_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Payments Table (Blueprint Section 14, 15 & 20)
DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(user_id) ON DELETE CASCADE,
    provider VARCHAR(32) NOT NULL DEFAULT 'stripe',
    provider_transaction_id TEXT,
    gross_amount NUMERIC(10, 2) NOT NULL CHECK (gross_amount >= 0),
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    teacher_amount NUMERIC(10, 2) NOT NULL CHECK (teacher_amount >= 0),
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    status payment_status_type NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Favourites Table (Blueprint Section 6 & 20)
CREATE TABLE IF NOT EXISTS public.favourites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, teacher_id)
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — SECTION 21
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        (auth.jwt() ->> 'email' = 'deenitutor@gmail.com')
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- RLS: PROFILES
-- --------------------------------------------------------------------
-- Anyone can view profile summaries (public names/avatars for teachers)
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can insert and update their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- --------------------------------------------------------------------
-- RLS: TEACHER_PROFILES
-- --------------------------------------------------------------------
-- Public can ONLY view approved teachers (is_approved = true)
-- Teachers can view their own profile regardless of approval status
-- Admins can view all teacher profiles
CREATE POLICY "Public can only view approved teachers"
    ON public.teacher_profiles FOR SELECT
    USING (
        is_approved = true 
        OR auth.uid() = user_id 
        OR public.is_admin()
    );

-- Teachers can insert their own initial profile during registration
CREATE POLICY "Teachers can insert own profile"
    ON public.teacher_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Teachers can update their own profile fields, but only Admins can set is_approved = true
CREATE POLICY "Teachers can update own profile"
    ON public.teacher_profiles FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (
        -- If not admin, teacher cannot unilaterally approve themselves
        (auth.uid() = user_id AND (is_approved = (SELECT is_approved FROM public.teacher_profiles WHERE user_id = auth.uid())))
        OR public.is_admin()
    );

-- --------------------------------------------------------------------
-- RLS: TEACHER_DOCUMENTS (Private documents storage security)
-- --------------------------------------------------------------------
-- Private: Only the teacher who owns the document or Admins can SELECT
CREATE POLICY "Teachers and Admins can view verification documents"
    ON public.teacher_documents FOR SELECT
    USING (auth.uid() = teacher_id OR public.is_admin());

-- Teacher can upload own verification documents
CREATE POLICY "Teachers can upload own verification documents"
    ON public.teacher_documents FOR INSERT
    WITH CHECK (auth.uid() = teacher_id OR public.is_admin());

-- Only Admins or Teacher can update document status/record
CREATE POLICY "Teachers and Admins can update documents"
    ON public.teacher_documents FOR UPDATE
    USING (auth.uid() = teacher_id OR public.is_admin());

-- --------------------------------------------------------------------
-- RLS: SUBJECTS & TEACHER_SUBJECTS
-- --------------------------------------------------------------------
CREATE POLICY "Subjects are viewable by everyone"
    ON public.subjects FOR SELECT
    USING (true);

CREATE POLICY "Admin can manage subjects"
    ON public.subjects FOR ALL
    USING (public.is_admin());

CREATE POLICY "Teacher subjects viewable if teacher approved or self"
    ON public.teacher_subjects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.teacher_profiles 
            WHERE user_id = teacher_subjects.teacher_id 
            AND (is_approved = true OR auth.uid() = teacher_id OR public.is_admin())
        )
    );

CREATE POLICY "Teachers can manage own subjects"
    ON public.teacher_subjects FOR ALL
    USING (auth.uid() = teacher_id OR public.is_admin());

-- --------------------------------------------------------------------
-- RLS: TEACHER_AVAILABILITY
-- --------------------------------------------------------------------
CREATE POLICY "Availability viewable by everyone"
    ON public.teacher_availability FOR SELECT
    USING (true);

CREATE POLICY "Teachers can manage own availability"
    ON public.teacher_availability FOR ALL
    USING (auth.uid() = teacher_id OR public.is_admin());

-- --------------------------------------------------------------------
-- RLS: STUDENT_PROFILES & CHILDREN
-- --------------------------------------------------------------------
CREATE POLICY "Students can view and manage own profile"
    ON public.student_profiles FOR ALL
    USING (auth.uid() = user_id OR auth.uid() = parent_id OR public.is_admin());

CREATE POLICY "Parents can view and manage own children"
    ON public.children FOR ALL
    USING (auth.uid() = parent_id OR public.is_admin());

-- --------------------------------------------------------------------
-- RLS: TEACHER_REVIEWS
-- --------------------------------------------------------------------
CREATE POLICY "Reviews viewable by everyone"
    ON public.teacher_reviews FOR SELECT
    USING (true);

CREATE POLICY "Students can insert reviews"
    ON public.teacher_reviews FOR INSERT
    WITH CHECK (auth.uid() = student_id OR public.is_admin());

-- --------------------------------------------------------------------
-- RLS: TEACHER_AVAILABILITY_EXCEPTIONS
-- --------------------------------------------------------------------
CREATE POLICY "Exceptions viewable by everyone"
    ON public.teacher_availability_exceptions FOR SELECT
    USING (true);

CREATE POLICY "Teachers can manage own availability exceptions"
    ON public.teacher_availability_exceptions FOR ALL
    USING (auth.uid() = teacher_id OR public.is_admin());

-- --------------------------------------------------------------------
-- RLS: BOOKINGS (Students & Teachers can view and manage their bookings)
-- --------------------------------------------------------------------
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (
        auth.uid() = student_id 
        OR auth.uid() = teacher_id 
        OR public.is_admin()
    );

CREATE POLICY "Students can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students and Teachers can update their bookings"
    ON public.bookings FOR UPDATE
    USING (
        auth.uid() = student_id 
        OR auth.uid() = teacher_id 
        OR public.is_admin()
    );

-- --------------------------------------------------------------------
-- RLS: BOOKING_EVENTS (Audit trail)
-- --------------------------------------------------------------------
CREATE POLICY "Users can view events for their bookings"
    ON public.booking_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE bookings.id = booking_events.booking_id 
            AND (bookings.student_id = auth.uid() OR bookings.teacher_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "System and participants can insert booking events"
    ON public.booking_events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE bookings.id = booking_events.booking_id 
            AND (bookings.student_id = auth.uid() OR bookings.teacher_id = auth.uid() OR public.is_admin())
        )
    );

-- --------------------------------------------------------------------
-- RLS: PAYMENTS
-- --------------------------------------------------------------------
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (
        auth.uid() = student_id 
        OR auth.uid() = teacher_id 
        OR public.is_admin()
    );

CREATE POLICY "Admin or webhook can insert/update payments"
    ON public.payments FOR ALL
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- RLS: FAVOURITES
-- --------------------------------------------------------------------
CREATE POLICY "Students can view and manage own favourites"
    ON public.favourites FOR ALL
    USING (auth.uid() = student_id OR public.is_admin());


-- ====================================================================
-- SEED INITIAL SUBJECTS DATA
-- ====================================================================
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('arabic-language', 'Arabic Language (Fusha)', 'arabic', 'Modern Standard & Classical Arabic grammar, vocabulary, and sentence construction.')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('quranic-arabic', 'Quranic Arabic & Tafseer', 'quran', 'Understand the direct vocabulary and structure of the Holy Quran verses.')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('quran-reading', 'Quran Reading (Nazira)', 'quran', 'Learn to recite the Holy Quran smoothly from basic Qaida to full Khatam.')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('tajweed', 'Tajweed & Makharij', 'quran', 'Master the exact articulation points and rules of Quran recitation with certified Qaris.')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('nahw', 'Arabic Syntax (Ilm an-Nahw)', 'arabic', 'Classical grammatical analysis (Hidayatun Nahw, Kafiya, Ajrumiyyah).')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('sarf', 'Arabic Morphology (Ilm as-Sarf)', 'arabic', 'Master root word derivations, verb conjugations, and verb patterns (Bab).')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('islamic-studies', 'Islamic Studies & Fiqh', 'islamic_studies', 'Aqeedah, Hanafi Fiqh, Seerah of the Prophet (SAW), and everyday Deen practicals.')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('arabic-for-kids', 'Arabic for Kids & Youth', 'arabic', 'Engaging, interactive Arabic lessons designed specially for children growing up abroad.')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO public.subjects (id, name, category, description) VALUES
    ('arabic-conversation', 'Spoken Arabic Conversation', 'arabic', 'Practical daily conversation skills for travel, work, or conversational fluency.')
    ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- SUPER ADMIN ROLE & PERMISSIONS MIGRATION (deenitutor@gmail.com)
-- ====================================================================

-- 1. Automatically update profiles role to 'admin' whenever deenitutor@gmail.com registers or updates
UPDATE public.profiles
SET role = 'admin', full_name = COALESCE(full_name, 'Super Administrator')
WHERE user_id IN (
    SELECT id FROM auth.users WHERE LOWER(email) = 'deenitutor@gmail.com'
);

-- 2. Trigger to ensure future syncs always maintain role = 'admin' for superadmin email
CREATE OR REPLACE FUNCTION public.handle_superadmin_role_sync()
RETURNS TRIGGER AS $$
BEGIN
    IF LOWER(NEW.email) = 'deenitutor@gmail.com' THEN
        INSERT INTO public.profiles (user_id, full_name, role, country, timezone)
        VALUES (NEW.id, 'Super Administrator', 'admin', 'Bangladesh', 'Asia/Dhaka')
        ON CONFLICT (user_id) DO UPDATE
        SET role = 'admin';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_superadmin_user_created ON auth.users;
CREATE TRIGGER on_superadmin_user_created
    AFTER INSERT OR UPDATE OF email ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_superadmin_role_sync();

