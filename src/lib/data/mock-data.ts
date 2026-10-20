export interface CommunityMember {
  id: string;
  fullName: string;
  age: number;
  avatarUrl: string;
  email: string;
  occupationOrInterest: string; // e.g. "Fine Artist & Watercolorist", "Terrace Gardening Enthusiast", "Yoga Coach"
  neighborhood: string;
  city: string;
  modePreference: "ONLINE" | "HYBRID" | "IN_PERSON";
  spokenLanguages: string[];
  bio: string;
  skillPointsBalance: number;
  averageRating: number;
  totalSessions: number;
  teachingSkills: {
    name: string;
    pillar: "TECH_PROFESSIONAL" | "HEALTH_WELLNESS" | "CREATIVE_PRACTICAL" | "ACADEMIC_LANGUAGES";
    category: string;
    proficiency: "BEGINNER" | "INTERMEDIATE" | "EXPERIENCED";
    yearsExperience: number;
  }[];
  learningSkills: {
    name: string;
    pillar: "TECH_PROFESSIONAL" | "HEALTH_WELLNESS" | "CREATIVE_PRACTICAL" | "ACADEMIC_LANGUAGES";
    category: string;
    targetProficiency: "BEGINNER" | "INTERMEDIATE" | "EXPERIENCED";
  }[];
  availability: {
    day: string;
    timeSlots: string[];
  }[];
}

export const INITIAL_MEMBERS: CommunityMember[] = [
  {
    id: "member-1",
    fullName: "Pooja Sharma",
    age: 34,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    email: "pooja.artist@gmail.com",
    occupationOrInterest: "Fine Artist & Watercolor Instructor",
    neighborhood: "C-Scheme",
    city: "Jaipur, RJ",
    modePreference: "HYBRID",
    spokenLanguages: ["English", "Hindi"],
    bio: "Practicing watercolor artist, plein-air sketcher, and botanical illustrator for 10+ years. I love guiding complete beginners through watercolor washes, color mixing, and pencil perspective drawing. Looking for a neighbor to teach me morning Hatha Yoga and healthy posture habits for long desk/easel hours.",
    skillPointsBalance: 420,
    averageRating: 4.96,
    totalSessions: 22,
    teachingSkills: [
      { name: "Watercolor Landscape Painting & Washes", pillar: "CREATIVE_PRACTICAL", category: "Drawing & Fine Arts", proficiency: "EXPERIENCED", yearsExperience: 10 },
      { name: "Pencil Sketching & Botanical Illustration", pillar: "CREATIVE_PRACTICAL", category: "Drawing & Fine Arts", proficiency: "EXPERIENCED", yearsExperience: 8 },
    ],
    learningSkills: [
      { name: "Morning Hatha Yoga & Posture", pillar: "HEALTH_WELLNESS", category: "Health & Fitness", targetProficiency: "BEGINNER" },
      { name: "Healthy Balanced Meal Prep", pillar: "HEALTH_WELLNESS", category: "Nutrition & Health", targetProficiency: "BEGINNER" },
    ],
    availability: [
      { day: "Tuesday", timeSlots: ["16:00 - 18:30"] },
      { day: "Thursday", timeSlots: ["16:00 - 18:30"] },
      { day: "Saturday", timeSlots: ["10:00 - 13:00"] },
    ],
  },
  {
    id: "member-2",
    fullName: "Kavita Nair",
    age: 39,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    email: "kavita.yoga@gmail.com",
    occupationOrInterest: "Yoga Instructor & Holistic Wellness Coach",
    neighborhood: "Panampilly Nagar",
    city: "Kochi, KL",
    modePreference: "HYBRID",
    spokenLanguages: ["English", "Malayalam", "Hindi"],
    bio: "Certified 500-hour Yoga Alliance instructor focusing on restorative Hatha Yoga, gentle spine alignment, and stress-reduction breathwork. I love teaching everyday working adults and elders how to move pain-free. Wanting to learn watercolor painting and pencil sketching as a creative mindful hobby.",
    skillPointsBalance: 460,
    averageRating: 5.0,
    totalSessions: 28,
    teachingSkills: [
      { name: "Morning Hatha Yoga & Posture", pillar: "HEALTH_WELLNESS", category: "Health & Fitness", proficiency: "EXPERIENCED", yearsExperience: 11 },
      { name: "Pranayama Breathwork & Meditation", pillar: "HEALTH_WELLNESS", category: "Health & Fitness", proficiency: "EXPERIENCED", yearsExperience: 9 },
    ],
    learningSkills: [
      { name: "Watercolor Landscape Painting & Washes", pillar: "CREATIVE_PRACTICAL", category: "Drawing & Fine Arts", targetProficiency: "BEGINNER" },
      { name: "Organic Terrace Vegetable Gardening", pillar: "CREATIVE_PRACTICAL", category: "Gardening & Sustainability", targetProficiency: "BEGINNER" },
    ],
    availability: [
      { day: "Monday", timeSlots: ["07:00 - 09:00"] },
      { day: "Wednesday", timeSlots: ["07:00 - 09:00"] },
      { day: "Saturday", timeSlots: ["10:00 - 13:00"] },
    ],
  },
  {
    id: "member-3",
    fullName: "Ramesh Kulkarni",
    age: 45,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
    email: "ramesh.kulkarni@gmail.com",
    occupationOrInterest: "Organic Terrace Gardening Enthusiast",
    neighborhood: "Koregaon Park",
    city: "Pune, MH",
    modePreference: "HYBRID",
    spokenLanguages: ["English", "Hindi", "Marathi"],
    bio: "Have cultivated organic terrace tomatoes, leafy greens, and compost bins for 8+ years. Passionate about teaching potting soil ratios, natural neem pest sprays, and kitchen composting. Wanting to learn acoustic guitar chords so I can sing bhajans and acoustic melodies with my family on weekends.",
    skillPointsBalance: 390,
    averageRating: 4.95,
    totalSessions: 18,
    teachingSkills: [
      { name: "Organic Terrace Vegetable Gardening", pillar: "CREATIVE_PRACTICAL", category: "Gardening & Sustainability", proficiency: "EXPERIENCED", yearsExperience: 8 },
      { name: "Kitchen Waste Composting & Soil Care", pillar: "CREATIVE_PRACTICAL", category: "Gardening & Sustainability", proficiency: "EXPERIENCED", yearsExperience: 6 },
    ],
    learningSkills: [
      { name: "Acoustic Guitar Basics & Chords", pillar: "CREATIVE_PRACTICAL", category: "Music & Performing Arts", targetProficiency: "BEGINNER" },
      { name: "Smartphone Digital Banking Safety", pillar: "TECH_PROFESSIONAL", category: "Everyday Tech", targetProficiency: "BEGINNER" },
    ],
    availability: [
      { day: "Saturday", timeSlots: ["09:00 - 12:00"] },
      { day: "Sunday", timeSlots: ["09:00 - 12:00"] },
      { day: "Wednesday", timeSlots: ["18:00 - 19:30"] },
    ],
  },
  {
    id: "member-4",
    fullName: "Meera Joshi",
    age: 52,
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256",
    email: "meera.bakes@gmail.com",
    occupationOrInterest: "Artisanal Baker & Traditional Culinary Mentor",
    neighborhood: "Bandra West",
    city: "Mumbai, MH",
    modePreference: "HYBRID",
    spokenLanguages: ["English", "Hindi", "Marathi", "Gujarati"],
    bio: "Baking sourdough bread, whole-wheat pita, and authentic regional Indian dishes for 25+ years. I love hosting small kitchen classes for neighbors. Seeking someone patient to teach me Canva design and smartphone photography so I can publish my handwritten recipe book.",
    skillPointsBalance: 510,
    averageRating: 4.98,
    totalSessions: 29,
    teachingSkills: [
      { name: "Artisanal Sourdough & Baking", pillar: "CREATIVE_PRACTICAL", category: "Culinary & Baking", proficiency: "EXPERIENCED", yearsExperience: 16 },
      { name: "Traditional Regional Cooking & Ferments", pillar: "CREATIVE_PRACTICAL", category: "Culinary & Baking", proficiency: "EXPERIENCED", yearsExperience: 25 },
    ],
    learningSkills: [
      { name: "Canva Design & Recipe Card Layouts", pillar: "TECH_PROFESSIONAL", category: "Design & Media", targetProficiency: "BEGINNER" },
      { name: "Pencil Sketching & Botanical Illustration", pillar: "CREATIVE_PRACTICAL", category: "Drawing & Fine Arts", targetProficiency: "BEGINNER" },
    ],
    availability: [
      { day: "Tuesday", timeSlots: ["15:00 - 18:00"] },
      { day: "Thursday", timeSlots: ["15:00 - 18:00"] },
      { day: "Saturday", timeSlots: ["15:00 - 18:00"] },
    ],
  },
  {
    id: "member-5",
    fullName: "Aisha Siddiqui",
    age: 26,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
    email: "aisha.nutrition@gmail.com",
    occupationOrInterest: "Clinical Nutritionist & Emergency First Aid Volunteer",
    neighborhood: "Banjara Hills",
    city: "Hyderabad, TS",
    modePreference: "ONLINE",
    spokenLanguages: ["English", "Hindi", "Urdu", "Telugu"],
    bio: "Nutrition counselor and Red Cross volunteer certified in CPR and First Aid. I teach neighbors practical blood-sugar management, heart-healthy meal planning, and burn/choking management. In exchange, I want to learn French for my upcoming travel and basic watercolor painting.",
    skillPointsBalance: 375,
    averageRating: 4.92,
    totalSessions: 19,
    teachingSkills: [
      { name: "First Aid Basics & Emergency CPR", pillar: "HEALTH_WELLNESS", category: "Health & Safety", proficiency: "EXPERIENCED", yearsExperience: 4 },
      { name: "Healthy Balanced Meal Prep", pillar: "HEALTH_WELLNESS", category: "Nutrition & Health", proficiency: "EXPERIENCED", yearsExperience: 5 },
    ],
    learningSkills: [
      { name: "Conversational French for Travel", pillar: "ACADEMIC_LANGUAGES", category: "Languages & Culture", targetProficiency: "BEGINNER" },
      { name: "Watercolor Landscape Painting & Washes", pillar: "CREATIVE_PRACTICAL", category: "Drawing & Fine Arts", targetProficiency: "BEGINNER" },
    ],
    availability: [
      { day: "Monday", timeSlots: ["19:00 - 21:00"] },
      { day: "Wednesday", timeSlots: ["19:00 - 21:00"] },
      { day: "Sunday", timeSlots: ["16:00 - 19:00"] },
    ],
  },
  {
    id: "member-6",
    fullName: "Siddharth Roy",
    age: 29,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    email: "siddharth.music@gmail.com",
    occupationOrInterest: "Acoustic Guitarist & Songwriter",
    neighborhood: "Indiranagar",
    city: "Bengaluru, KA",
    modePreference: "HYBRID",
    spokenLanguages: ["English", "Hindi", "Bengali"],
    bio: "Fingerstyle guitarist and vocal coach playing for 9 years. Love demystifying guitar chords, strumming rhythms, and ear training for total novices. Looking for someone to teach me watercolor sketching and terrace gardening so I can relax after long studio sessions.",
    skillPointsBalance: 330,
    averageRating: 4.88,
    totalSessions: 15,
    teachingSkills: [
      { name: "Acoustic Guitar Basics & Chords", pillar: "CREATIVE_PRACTICAL", category: "Music & Performing Arts", proficiency: "EXPERIENCED", yearsExperience: 9 },
      { name: "Vocal Warmups & Pitch Training", pillar: "CREATIVE_PRACTICAL", category: "Music & Performing Arts", proficiency: "EXPERIENCED", yearsExperience: 6 },
    ],
    learningSkills: [
      { name: "Watercolor Landscape Painting & Washes", pillar: "CREATIVE_PRACTICAL", category: "Drawing & Fine Arts", targetProficiency: "BEGINNER" },
      { name: "Organic Terrace Vegetable Gardening", pillar: "CREATIVE_PRACTICAL", category: "Gardening & Sustainability", targetProficiency: "BEGINNER" },
    ],
    availability: [
      { day: "Tuesday", timeSlots: ["18:30 - 20:30"] },
      { day: "Thursday", timeSlots: ["18:30 - 20:30"] },
      { day: "Saturday", timeSlots: ["11:00 - 14:00"] },
    ],
  },
  {
    id: "member-7",
    fullName: "Harish Patel",
    age: 58,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    email: "harish.patel.teacher@gmail.com",
    occupationOrInterest: "Retired Educator & Public Speaking Coach",
    neighborhood: "Navrangpura",
    city: "Ahmedabad, GJ",
    modePreference: "HYBRID",
    spokenLanguages: ["English", "Gujarati", "Hindi"],
    bio: "Former high school principal and Toastmasters mentor with 32 years of teaching. Love helping community members build confidence in spoken English, conversational fluency, and interview speaking. Eager to learn basic pencil drawing and organic composting.",
    skillPointsBalance: 480,
    averageRating: 4.97,
    totalSessions: 31,
    teachingSkills: [
      { name: "Spoken English Fluency & Confidence", pillar: "ACADEMIC_LANGUAGES", category: "Languages & Speech", proficiency: "EXPERIENCED", yearsExperience: 30 },
      { name: "Public Speaking & Storytelling", pillar: "ACADEMIC_LANGUAGES", category: "Languages & Speech", proficiency: "EXPERIENCED", yearsExperience: 25 },
    ],
    learningSkills: [
      { name: "Pencil Sketching & Botanical Illustration", pillar: "CREATIVE_PRACTICAL", category: "Drawing & Fine Arts", targetProficiency: "BEGINNER" },
      { name: "Organic Terrace Vegetable Gardening", pillar: "CREATIVE_PRACTICAL", category: "Gardening & Sustainability", targetProficiency: "BEGINNER" },
    ],
    availability: [
      { day: "Monday", timeSlots: ["10:00 - 13:00"] },
      { day: "Thursday", timeSlots: ["10:00 - 13:00"] },
      { day: "Sunday", timeSlots: ["15:00 - 18:00"] },
    ],
  },
  {
    id: "member-8",
    fullName: "Deepak Verma",
    age: 31,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    email: "deepak.diy@gmail.com",
    occupationOrInterest: "Home DIY, Woodcraft & Repair Specialist",
    neighborhood: "Hauz Khas",
    city: "New Delhi, DL",
    modePreference: "IN_PERSON",
    spokenLanguages: ["English", "Hindi"],
    bio: "Passionate DIY maker who can fix almost anything in a house: leaky faucets, drill anchoring, door locks, basic wiring, and wood restoration. Want to trade hands-on repair knowledge for yoga postures and spoken English practice.",
    skillPointsBalance: 310,
    averageRating: 4.89,
    totalSessions: 14,
    teachingSkills: [
      { name: "Basic Home Electrical & Plumbing Repairs", pillar: "CREATIVE_PRACTICAL", category: "Practical Crafts & DIY", proficiency: "EXPERIENCED", yearsExperience: 7 },
      { name: "Wood Finishing & Furniture Care", pillar: "CREATIVE_PRACTICAL", category: "Practical Crafts & DIY", proficiency: "EXPERIENCED", yearsExperience: 6 },
    ],
    learningSkills: [
      { name: "Morning Hatha Yoga & Posture", pillar: "HEALTH_WELLNESS", category: "Health & Fitness", targetProficiency: "BEGINNER" },
      { name: "Spoken English Fluency & Confidence", pillar: "ACADEMIC_LANGUAGES", category: "Languages & Speech", targetProficiency: "INTERMEDIATE" },
    ],
    availability: [
      { day: "Saturday", timeSlots: ["14:00 - 18:00"] },
      { day: "Sunday", timeSlots: ["10:00 - 14:00"] },
    ],
  },
];

export interface CommunityQuestion {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAge: number;
  authorOccupation: string;
  authorNeighborhood: string;
  authorAvatar: string;
  pillar: "TECH_PROFESSIONAL" | "HEALTH_WELLNESS" | "CREATIVE_PRACTICAL" | "ACADEMIC_LANGUAGES";
  tags: string[];
  createdAt: string;
  upvotes: number;
  isSolved: boolean;
  repliesCount: number;
  replies: {
    id: string;
    authorName: string;
    authorOccupation: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
    isSolution: boolean;
    upvotes: number;
  }[];
}

export const INITIAL_COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  {
    id: "q-1",
    title: "How do I prevent 300 GSM watercolor paper from buckling when painting wet-on-wet landscapes?",
    content: "Whenever I try to paint cloudy skies using wet-on-wet watercolor washes, my paper forms ridges and puddles the pigment unevenly even though I taped the borders down. Should I pre-stretch the sheet with water or use a stretching board?",
    authorName: "Siddharth Roy",
    authorAge: 29,
    authorOccupation: "Guitarist & Beginner Watercolorist",
    authorNeighborhood: "Indiranagar, Bengaluru",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    pillar: "CREATIVE_PRACTICAL",
    tags: ["Drawing", "Watercolor", "Art Supplies", "Painting"],
    createdAt: "2 hours ago",
    upvotes: 21,
    isSolved: true,
    repliesCount: 1,
    replies: [
      {
        id: "rep-1",
        authorName: "Pooja Sharma",
        authorOccupation: "Watercolor Instructor (34, Jaipur)",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
        content: "Hello Siddharth! Even 300 GSM cold-pressed paper buckles if you only wet the front side. The secret is to wet BOTH sides evenly with a flat hake brush, wait 2 minutes for the cotton fibers to expand, and then tape all 4 sides with water-activated gummed tape or heavy masking tape onto a wooden board. It will dry drum-tight without a single buckle! I'd be happy to show you my wash setup in a live 20-min session.",
        createdAt: "1 hour ago",
        isSolution: true,
        upvotes: 27,
      },
    ],
  },
  {
    id: "q-2",
    title: "What daily gentle yoga postures help relieve neck and lower-back stiffness for desk workers?",
    content: "I sit for 7-8 hours a day and wake up with tension in my neck and lower back. I find forward bends painful. Can someone suggest 3 gentle daily postures that can be done without gym equipment?",
    authorName: "Harish Patel",
    authorAge: 58,
    authorOccupation: "Retired Educator & Public Speaker",
    authorNeighborhood: "Navrangpura, Ahmedabad",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    pillar: "HEALTH_WELLNESS",
    tags: ["Health", "Yoga", "Back Pain", "Posture", "Wellness"],
    createdAt: "3 hours ago",
    upvotes: 19,
    isSolved: true,
    repliesCount: 1,
    replies: [
      {
        id: "rep-2",
        authorName: "Kavita Nair",
        authorOccupation: "Hatha Yoga & Wellness Coach (39, Kochi)",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
        content: "Namaste Harishji! Please avoid deep forward bends when your lower back is sensitive. Try: 1) Cat-Cow pose (Marjaryasana-Bitilasana) on a soft mat for 10 slow breaths. 2) Supine Figure-4 stretch lying on your back to gently release tight glutes. 3) Bhujangasana (Gentle Baby Cobra with elbows bent) to strengthen upper back muscles. Let's do a 30-minute morning session together on SkillBridge to check your alignment!",
        createdAt: "2 hours ago",
        isSolution: true,
        upvotes: 23,
      },
    ],
  },
  {
    id: "q-3",
    title: "How to stop tomato plant leaves from turning yellow on an apartment terrace?",
    content: "My cherry tomato plants were doing great in terracotta pots, but now the lower leaves are turning pale yellow and dropping off. Is this overwatering or lack of nutrients?",
    authorName: "Kavita Nair",
    authorAge: 39,
    authorOccupation: "Yoga Coach & Balcony Gardener",
    authorNeighborhood: "Panampilly Nagar, Kochi",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    pillar: "CREATIVE_PRACTICAL",
    tags: ["Gardening", "Organic", "Terrace", "Plant Care"],
    createdAt: "5 hours ago",
    upvotes: 14,
    isSolved: true,
    repliesCount: 1,
    replies: [
      {
        id: "rep-3",
        authorName: "Ramesh Kulkarni",
        authorOccupation: "Terrace Gardening Enthusiast (45, Pune)",
        authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
        content: "Hello Kavitaji! In humid weather, lower yellowing leaves usually mean waterlogging or nitrogen depletion. Top-dress with 2 fistfuls of well-rotted vermicompost, water only when top soil is dry, and trim the bottom-most 3 inches of foliage to keep leaves off damp soil.",
        createdAt: "4 hours ago",
        isSolution: true,
        upvotes: 18,
      },
    ],
  },
];
