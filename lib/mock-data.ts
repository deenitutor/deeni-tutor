import { TeacherProfile, SubjectItem } from '@/types/teacher';

export const POPULAR_SUBJECTS: SubjectItem[] = [
  {
    id: 'arabic-language',
    name: 'Arabic Language (Fusha)',
    category: 'arabic',
    description: 'Modern Standard & Classical Arabic grammar, vocabulary, and sentence construction.',
  },
  {
    id: 'quranic-arabic',
    name: 'Quranic Arabic & Tafseer',
    category: 'quran',
    description: 'Understand the direct vocabulary and structure of the Holy Quran verses.',
  },
  {
    id: 'quran-reading',
    name: 'Quran Reading (Nazira)',
    category: 'quran',
    description: 'Learn to recite the Holy Quran smoothly from basic Qaida to full Khatam.',
  },
  {
    id: 'tajweed',
    name: 'Tajweed & Makharij',
    category: 'quran',
    description: 'Master the exact articulation points and rules of Quran recitation with certified Qaris.',
  },
  {
    id: 'nahw',
    name: 'Arabic Syntax (Ilm an-Nahw)',
    category: 'arabic',
    description: 'Classical grammatical analysis (Hidayatun Nahw, Kafiya, Ajrumiyyah).',
  },
  {
    id: 'sarf',
    name: 'Arabic Morphology (Ilm as-Sarf)',
    category: 'arabic',
    description: 'Master root word derivations, verb conjugations, and verb patterns (Bab).',
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies & Fiqh',
    category: 'islamic_studies',
    description: 'Aqeedah, Hanafi Fiqh, Seerah of the Prophet (SAW), and everyday Deen practicals.',
  },
  {
    id: 'classical-arabic',
    name: 'Classical Arabic Literature',
    category: 'arabic',
    description: 'Pre-Islamic and Islamic poetry, Balaghah (Rhetoric), and classical texts.',
  },
  {
    id: 'arabic-for-kids',
    name: 'Arabic for Kids & Youth',
    category: 'arabic',
    description: 'Engaging, interactive Arabic lessons designed specially for children growing up abroad.',
  },
  {
    id: 'arabic-conversation',
    name: 'Spoken Arabic Conversation',
    category: 'arabic',
    description: 'Practical daily conversation skills for travel, work, or conversational fluency.',
  },
];

export const MOCK_TEACHERS: TeacherProfile[] = [
  {
    id: 'tch-001',
    slug: 'mawlana-abdullah-al-mahmud',
    full_name: 'Mawlana Abdullah Al-Mahmud',
    title: 'Dawra-e-Hadith & Master of Arts in Arabic (Dhaka University)',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    gender: 'male',
    city: 'Dhaka',
    district: 'Dhaka',
    country: 'Bangladesh',
    madrasa_institution: 'Darul Uloom Hathazari & University of Dhaka',
    qualifications: [
      'Dawra-e-Hadith (Takmeel) - 1st Class',
      'MA in Arabic Literature (University of Dhaka)',
      'Sanad in 10 Qira\'at (Hafs an Asim)',
      '12+ Years Teaching Experience in Madrasa and Online'
    ],
    certificates: [
      'Certificate in Classical Arabic Pedagogy',
      'Ijazah in Tajweed Al-Quran Al-Kareem'
    ],
    years_of_experience: 12,
    total_lessons: 1480,
    rating: 4.96,
    review_count: 142,
    hourly_rate: 10,
    trial_rate: 4,
    trial_available: true,
    trial_duration_minutes: 30,
    bio: 'Assalamu Alaikum. I am Mawlana Abdullah. For over 12 years, I have taught Arabic grammar (Nahw & Sarf) and Quranic Arabic to hundreds of students in Bangladesh and across the UK, USA, and Canada. My approach combines traditional Dars-e-Nizami precision with modern interactive pedagogical tools.',
    about_teaching: 'I focus on building deep structural confidence. In Arabic grammar, we break down sentences step by step with live whiteboard analysis. In Quranic studies, we connect grammar directly to the verses so you start understanding the Quran without relying solely on translations.',
    subjects: [
      'Arabic Language (Fusha)',
      'Quranic Arabic & Tafseer',
      'Nahw',
      'Sarf',
      'Classical Arabic Literature'
    ],
    levels: [
      'Elementary (A1-A2)',
      'Intermediate (B1-B2)',
      'Advanced / Dawra-e-Hadith'
    ],
    teaching_languages: ['English', 'Bengali', 'Arabic', 'Urdu'],
    timezone: 'Asia/Dhaka (GMT+6)',
    verification_status: 'approved',
    is_verified: true,
    is_approved: true,
    featured: true,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    documents: [
      {
        id: 'doc-001',
        teacher_id: 'tch-001',
        document_type: 'identity_document',
        title: 'National NID Card',
        file_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
        file_name: 'nid_abdullah_mahmud.pdf',
        status: 'verified',
        created_at: '2026-01-10'
      },
      {
        id: 'doc-002',
        teacher_id: 'tch-001',
        document_type: 'madrasa_certificate',
        title: 'Dawra-e-Hadith (Takmeel) Sanad',
        file_url: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&q=80&w=600',
        file_name: 'takmeel_sanad_hathazari.pdf',
        status: 'verified',
        created_at: '2026-01-10'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        student_name: 'Zubair K.',
        student_country: 'London, UK',
        rating: 5,
        date: '2026-02-14',
        comment: 'Ustadh Abdullah is phenomenal. I struggled with Nahw for years until his method made the sentence logic crystal clear. His English is fluent and his patience is boundless.',
        subject_taken: 'Nahw & Quranic Arabic'
      },
      {
        id: 'rev-2',
        student_name: 'Dr. Sarah Ahmad',
        student_country: 'Toronto, Canada',
        rating: 5,
        date: '2026-01-28',
        comment: 'The trial lesson convinced me immediately. We enrolled our teenage son as well. Very disciplined and punctual.',
        subject_taken: 'Arabic Language (Fusha)'
      }
    ]
  },
  {
    id: 'tch-002',
    slug: 'ustadha-fatima-jannat',
    full_name: 'Ustadha Fatima Jannat',
    title: 'Hafiza, Alimah & Specialist in Tajweed & Arabic for Sisters & Kids',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    gender: 'female',
    city: 'Sylhet',
    district: 'Sylhet',
    country: 'Bangladesh',
    madrasa_institution: 'Jamia Islamia Mahila Madrasa & Islamic Arabic University',
    qualifications: [
      'Alimah Degree (Fazilat & Takmeel) with Distinction',
      'Hafiza of the Holy Quran',
      'Certified Tajweed Instructor (Makharij & Sifaat)',
      '7 Years Online Teaching for International Sisters & Children'
    ],
    certificates: [
      'Sanad in Quranic Recitation',
      'Child Islamic Psychology & Teaching Certificate'
    ],
    years_of_experience: 7,
    total_lessons: 1120,
    rating: 4.98,
    review_count: 98,
    hourly_rate: 9,
    trial_rate: 3,
    trial_available: true,
    trial_duration_minutes: 30,
    bio: 'Assalamu Alaikum wa Rahmatullah. I am Ustadha Fatima from Sylhet. I specialize in teaching Tajweed, Quran memorization, and foundational Arabic exclusively to sisters, young girls, and children. My goal is to make Quran learning a joyful and spiritually uplifting daily habit.',
    about_teaching: 'For children, I use visual interactive slides and gentle encouragement. For sisters, I guide thorough Tajweed correction from beginner Qaida up to advanced fluency with correct Makharij.',
    subjects: [
      'Quran Reading (Nazira)',
      'Tajweed & Makharij',
      'Arabic for Kids & Youth',
      'Islamic Studies & Fiqh'
    ],
    levels: [
      'Beginner (Noorani Qaida / Alphabet)',
      'Elementary (A1-A2)',
      'Intermediate (B1-B2)'
    ],
    teaching_languages: ['English', 'Bengali', 'Sylheti', 'Arabic'],
    timezone: 'Asia/Dhaka (GMT+6)',
    verification_status: 'approved',
    is_verified: true,
    is_approved: true,
    featured: true,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    reviews: [
      {
        id: 'rev-3',
        student_name: 'Amina & Maryam (Mother)',
        student_country: 'Birmingham, UK',
        rating: 5,
        date: '2026-02-05',
        comment: 'My 7-year-old daughter looks forward to her Quran classes with Ustadha Fatima every week. Her recitation has improved tremendously in just 2 months.',
        subject_taken: 'Quran Reading & Tajweed'
      }
    ]
  },
  {
    id: 'tch-003',
    slug: 'qari-muhammad-hasan',
    full_name: 'Qari Muhammad Hasan',
    title: 'Chief Qari & Tajweed Master, Winner of National Quran Competition',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    gender: 'male',
    city: 'Chittagong',
    district: 'Chattogram',
    country: 'Bangladesh',
    madrasa_institution: 'Jamia Darul Ma\'arif Al-Islamia & Baitul Mukarram Academy',
    qualifications: [
      'Ijazah in Qira\'ah Asharah (10 styles of recitation)',
      'Kamil in Hadith & Tafseer',
      'Certified International Judge in Quran Competitions',
      '10 Years Teaching Quran & Tajweed Online'
    ],
    certificates: [
      'Official Ijazah from Sheikh of Reciters (Egypt/Bangladesh)',
      'Advanced Sanad in Matn Al-Jazariyyah'
    ],
    years_of_experience: 10,
    total_lessons: 2150,
    rating: 4.95,
    review_count: 210,
    hourly_rate: 12,
    trial_rate: 5,
    trial_available: true,
    trial_duration_minutes: 30,
    bio: 'Alhamdulillah, I have dedicated my life to the recitation and science of the Holy Quran. I teach adult professionals, youth, and aspiring Hujjaj how to recite with melodic beauty, precision, and adherence to authentic classical rules of Tajweed.',
    about_teaching: 'Every lesson includes live phonetic analysis, breath control techniques, and line-by-line correction of your recitation until perfection.',
    subjects: [
      'Tajweed & Makharij',
      'Quran Reading (Nazira)',
      'Quranic Arabic & Tafseer'
    ],
    levels: [
      'Beginner (Noorani Qaida / Alphabet)',
      'Elementary (A1-A2)',
      'Intermediate (B1-B2)',
      'Advanced / Dawra-e-Hadith'
    ],
    teaching_languages: ['English', 'Bengali', 'Arabic'],
    timezone: 'Asia/Dhaka (GMT+6)',
    verification_status: 'approved',
    is_verified: true,
    is_approved: true,
    featured: true,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    reviews: [
      {
        id: 'rev-4',
        student_name: 'Rashid Al-Mansoor',
        student_country: 'Dubai, UAE',
        rating: 5,
        date: '2026-02-18',
        comment: 'Qari Hasan is a master of phonetics. He spotted subtle mistakes in my Ghunnah and Ikhfa that nobody had caught before.',
        subject_taken: 'Tajweed & Makharij'
      }
    ]
  },
  {
    id: 'tch-004',
    slug: 'mufti-tanvir-hossain',
    full_name: 'Mufti Tanvir Hossain',
    title: 'Ifta Graduate, Specialist in Islamic Jurisprudence (Fiqh) & Classical Nahw',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    gender: 'male',
    city: 'Dhaka',
    district: 'Dhaka',
    country: 'Bangladesh',
    madrasa_institution: 'Jamia Rahmania Arabia Dhaka',
    qualifications: [
      'Takhassus Fil Ifta (Specialization in Islamic Law/Fiqh)',
      'Dawra-e-Hadith Top Merit Award',
      '8 Years Experience in Online Fiqh and Arabic Teaching'
    ],
    certificates: [
      'Ijazah in Sahih Al-Bukhari and Sahih Muslim',
      'Arabic Dialectology & Classical Translation'
    ],
    years_of_experience: 8,
    total_lessons: 890,
    rating: 4.92,
    review_count: 76,
    hourly_rate: 11,
    trial_rate: 4,
    trial_available: true,
    trial_duration_minutes: 30,
    bio: 'Mufti Tanvir specializes in teaching Fiqh of worship, contemporary Halal/Haram transactions, and deep classical Arabic grammar. Highly structured lessons tailored for university students and working professionals.',
    about_teaching: 'Structured syllabus based on classical texts like Quduri and Nurul Idah with contemporary case studies.',
    subjects: [
      'Islamic Studies & Fiqh',
      'Nahw',
      'Sarf',
      'Classical Arabic Literature'
    ],
    levels: [
      'Intermediate (B1-B2)',
      'Advanced / Dawra-e-Hadith'
    ],
    teaching_languages: ['English', 'Bengali', 'Arabic', 'Urdu'],
    timezone: 'Asia/Dhaka (GMT+6)',
    verification_status: 'approved',
    is_verified: true,
    is_approved: true,
    featured: false,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    reviews: []
  },
  {
    id: 'tch-005',
    slug: 'ustadha-nusrat-zahan',
    full_name: 'Ustadha Nusrat Zahan',
    title: 'Arabic Language Educator & Quranic Vocabulary Specialist',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    gender: 'female',
    city: 'Rajshahi',
    district: 'Rajshahi',
    country: 'Bangladesh',
    madrasa_institution: 'Rajshahi Mahila Kamil Madrasa & Rajshahi University',
    qualifications: [
      'Masters in Arabic Language & Islamic Studies',
      'Fazil & Kamil Honours',
      '6 Years Experience Teaching Women and Children'
    ],
    certificates: [
      'Interactive Online Pedagogy Certification',
      'Quranic Arabic Etymology & Roots Sanad'
    ],
    years_of_experience: 6,
    total_lessons: 740,
    rating: 4.94,
    review_count: 64,
    hourly_rate: 8,
    trial_rate: 3,
    trial_available: true,
    trial_duration_minutes: 30,
    bio: 'Dedicated to helping Muslim sisters unlock the beauty of the Quranic language. I focus on roots, high-frequency Quran words, and conversational Arabic.',
    about_teaching: 'Gentle, methodical, and packed with practical exercises.',
    subjects: [
      'Arabic Language (Fusha)',
      'Quranic Arabic & Tafseer',
      'Arabic for Kids & Youth',
      'Arabic Conversation'
    ],
    levels: [
      'Beginner (Noorani Qaida / Alphabet)',
      'Elementary (A1-A2)',
      'Intermediate (B1-B2)'
    ],
    teaching_languages: ['English', 'Bengali', 'Arabic'],
    timezone: 'Asia/Dhaka (GMT+6)',
    verification_status: 'approved',
    is_verified: true,
    is_approved: true,
    featured: true,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    reviews: []
  },
  {
    id: 'tch-006',
    slug: 'mawlana-saidur-rahman',
    full_name: 'Mawlana Saidur Rahman',
    title: 'Spoken Arabic & Classical Grammar Coach for Non-Native Speakers',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    gender: 'male',
    city: 'Dhaka',
    district: 'Dhaka',
    country: 'Bangladesh',
    madrasa_institution: 'Jamia Qurania Arabia Lalbagh Dhaka',
    qualifications: [
      'Dawra-e-Hadith with Gold Medal',
      'Diploma in Arabic Spoken Fluency (Sudan/Bangladesh)',
      '9 Years Teaching International Students'
    ],
    certificates: [
      'Arabic Conversation Trainer Certification',
      'Advanced Sarf & Morphology Specialist'
    ],
    years_of_experience: 9,
    total_lessons: 1340,
    rating: 4.91,
    review_count: 115,
    hourly_rate: 10,
    trial_rate: 4,
    trial_available: true,
    trial_duration_minutes: 30,
    bio: 'I help students overcome hesitation in speaking Arabic while maintaining high grammatical accuracy through conversational immersion and morphological drills.',
    about_teaching: 'Active dialogue sessions combined with daily Sarf derivation exercises.',
    subjects: [
      'Arabic Conversation',
      'Arabic Language (Fusha)',
      'Sarf',
      'Nahw'
    ],
    levels: [
      'Beginner (Noorani Qaida / Alphabet)',
      'Elementary (A1-A2)',
      'Intermediate (B1-B2)',
      'Advanced / Dawra-e-Hadith'
    ],
    teaching_languages: ['English', 'Bengali', 'Arabic'],
    timezone: 'Asia/Dhaka (GMT+6)',
    verification_status: 'approved',
    is_verified: true,
    is_approved: true,
    featured: false,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    reviews: []
  },
  {
    id: 'tch-007-pending',
    slug: 'mawlana-hafizur-rahman',
    full_name: 'Mawlana Hafizur Rahman',
    title: 'Dawra-e-Hadith Scholar & Nahw Instructor',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    gender: 'male',
    city: 'Brahmanbaria',
    district: 'Brahmanbaria',
    country: 'Bangladesh',
    madrasa_institution: 'Jamia Islamia Yunusia Brahmanbaria',
    qualifications: [
      'Dawra-e-Hadith (Takmeel) - 1st Division',
      'Hafiz of the Holy Quran'
    ],
    certificates: [
      'Takmeel Certificate',
      'Tajweed Ijazah'
    ],
    years_of_experience: 5,
    total_lessons: 0,
    rating: 5.0,
    review_count: 0,
    hourly_rate: 9,
    trial_rate: 3,
    trial_available: true,
    trial_duration_minutes: 30,
    bio: 'Experienced in teaching classical Nahw and Quran reading to beginners and intermediate students.',
    about_teaching: 'Clear step-by-step grammatical analysis with focus on Tajweed articulation.',
    subjects: [
      'Nahw',
      'Sarf',
      'Tajweed & Makharij'
    ],
    levels: [
      'Beginner (Noorani Qaida / Alphabet)',
      'Elementary (A1-A2)',
      'Intermediate (B1-B2)'
    ],
    teaching_languages: ['English', 'Bengali'],
    timezone: 'Asia/Dhaka (GMT+6)',
    verification_status: 'under_review',
    is_verified: false,
    is_approved: false,
    featured: false,
    documents: [
      {
        id: 'doc-007-1',
        teacher_id: 'tch-007-pending',
        document_type: 'identity_document',
        title: 'National NID Card',
        file_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
        file_name: 'nid_hafizur_rahman.pdf',
        status: 'pending',
        created_at: '2026-08-25'
      },
      {
        id: 'doc-007-2',
        teacher_id: 'tch-007-pending',
        document_type: 'madrasa_certificate',
        title: 'Takmeel Certificate',
        file_url: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&q=80&w=600',
        file_name: 'takmeel_yunusia.pdf',
        status: 'pending',
        created_at: '2026-08-25'
      }
    ],
    reviews: []
  },
  {
    id: 'tch-008-pending',
    slug: 'ustadha-ayesha-siddiqua',
    full_name: 'Ustadha Ayesha Siddiqua',
    title: 'Kamil Graduate & Arabic for Kids Specialist',
    photo_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    gender: 'female',
    city: 'Rajshahi',
    district: 'Rajshahi',
    country: 'Bangladesh',
    madrasa_institution: 'Rajshahi Women Kamil Madrasa',
    qualifications: [
      'Kamil in Hadith & MA in Arabic',
      'Certified Online Child Educator'
    ],
    certificates: [
      'Kamil Degree Sanad',
      'University Transcript'
    ],
    years_of_experience: 4,
    total_lessons: 0,
    rating: 5.0,
    review_count: 0,
    hourly_rate: 8,
    trial_rate: 3,
    trial_available: true,
    trial_duration_minutes: 30,
    bio: 'Passionate about teaching Arabic vocabulary, phonetics, and Noorani Qaida to young children and sisters.',
    about_teaching: 'Interactive games, colorful slides, and patient repetition.',
    subjects: [
      'Arabic for Kids & Youth',
      'Quran Reading (Nazira)',
      'Tajweed & Makharij'
    ],
    levels: [
      'Beginner (Noorani Qaida / Alphabet)',
      'Elementary (A1-A2)'
    ],
    teaching_languages: ['English', 'Bengali', 'Arabic'],
    timezone: 'Asia/Dhaka (GMT+6)',
    verification_status: 'under_review',
    is_verified: false,
    is_approved: false,
    featured: false,
    documents: [
      {
        id: 'doc-008-1',
        teacher_id: 'tch-008-pending',
        document_type: 'identity_document',
        title: 'National NID Card',
        file_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
        file_name: 'nid_ayesha.pdf',
        status: 'pending',
        created_at: '2026-08-26'
      },
      {
        id: 'doc-008-2',
        teacher_id: 'tch-008-pending',
        document_type: 'academic_qualification',
        title: 'Kamil Sanad & Transcript',
        file_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
        file_name: 'kamil_sanad.pdf',
        status: 'pending',
        created_at: '2026-08-26'
      }
    ],
    reviews: []
  }
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    quote: 'Finding an authentic madrasa teacher who speaks fluent English and is so flexible with UK evenings was a game-changer. My son finished his first Juz of Tajweed with proper Makharij!',
    author: 'Sultana Begum',
    role: 'Parent of 9-year-old',
    location: 'London, United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    subject: 'Tajweed & Quran Reading'
  },
  {
    id: 't-2',
    quote: 'I study Nahw & Sarf with Ustadh Abdullah. The classical depth of Bangladeshi Dars-e-Nizami graduates is world-class. At $10/hour, it is unmatched anywhere in North America.',
    author: 'Imran Tariq',
    role: 'Software Engineer & Student',
    location: 'Dallas, Texas, USA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    subject: 'Nahw & Quranic Arabic'
  },
  {
    id: 't-3',
    quote: 'As an expat family in Dubai, we wanted our daughters to learn Quran from trusted female scholars. Ustadha Fatima is so nurturing, punctual, and disciplined.',
    author: 'Farhan & Nargis Chowdhury',
    role: 'Expat Parents',
    location: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    subject: 'Arabic for Kids & Tajweed'
  }
];

export const FAQS = [
  {
    category: 'For Students & Parents',
    questions: [
      {
        q: 'How does trial lesson booking work?',
        a: 'Every verified teacher offers a discounted 30-minute trial lesson (starting from $3–$5). You can pick an available time slot in your own local timezone, book securely, and meet the teacher online before committing to regular weekly lessons.'
      },
      {
        q: 'How are Bangladeshi teachers verified on Deeni Tutor?',
        a: 'Every teacher undergoes strict 4-step admin verification: government identity verification, academic madrasa certificates (Dawra-e-Hadith/Takmeel/Fazilat), background review, and an oral interview assessing teaching aptitude and language clarity.'
      },
      {
        q: 'What languages do the teachers speak?',
        a: 'All listed teachers speak fluent Bengali, Classical Arabic, and English. Many also speak Urdu and Hindi, making communication effortless for international diaspora families.'
      },
      {
        q: 'Can parents manage lessons for multiple children?',
        a: 'Yes! Parent accounts allow you to schedule, monitor, and manage separate lesson tracks for each child under a single unified dashboard.'
      },
      {
        q: 'What video platform is used for the classes?',
        a: 'Classes are conducted via integrated secure 1-on-1 video rooms (Google Meet/Zoom links) automatically generated upon booking confirmation.'
      }
    ]
  },
  {
    category: 'For Teachers',
    questions: [
      {
        q: 'Who can apply to become a teacher on Deeni Tutor?',
        a: 'Qualified madrasa graduates (Dawra-e-Hadith / Takmeel / Fazil / Kamil), university Arabic graduates, certified Hafiz/Hafiza, and Sanad-holding Qaris with a passion for teaching.'
      },
      {
        q: 'How do teachers receive payouts in Bangladesh?',
        a: 'Teachers receive secure direct payouts to their Bangladeshi bank accounts or bKash/Nagad wallets at competitive platform rates with zero hidden deductions.'
      },
      {
        q: 'Can I set my own schedule and hourly rate?',
        a: 'Yes. You have 100% control over your weekly availability slots, your trial lesson price, and your hourly rate.'
      }
    ]
  }
];
