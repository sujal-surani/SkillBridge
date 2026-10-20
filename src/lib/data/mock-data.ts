export interface StudentProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  collegeName: string;
  major: string;
  graduationYear: number;
  bio: string;
  city: string;
  modePreference: "ONLINE" | "HYBRID" | "OFFLINE";
  languages: string[];
  skillPointsBalance: number;
  averageRating: number;
  totalSessions: number;
  teachingSkills: {
    name: string;
    category: string;
    proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    yearsExperience: number;
  }[];
  learningSkills: {
    name: string;
    category: string;
    targetProficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  }[];
  availability: {
    day: string;
    timeSlots: string[];
  }[];
}

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: "student-1",
    fullName: "Aarav Sharma",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256",
    email: "aarav.sharma@cse.iitb.ac.in",
    collegeName: "IIT Bombay",
    major: "Computer Science & Engineering",
    graduationYear: 2026,
    bio: "Passionate about full-stack architectures and modern web tools. Built two production Next.js applications and looking for a peer to master Advanced Dynamic Programming and Graph Algorithms together.",
    city: "Mumbai, MH",
    modePreference: "HYBRID",
    languages: ["English", "Hindi"],
    skillPointsBalance: 320,
    averageRating: 4.9,
    totalSessions: 14,
    teachingSkills: [
      { name: "Next.js & React", category: "Web Dev", proficiency: "ADVANCED", yearsExperience: 2 },
      { name: "Tailwind CSS & UI Systems", category: "Web Dev", proficiency: "ADVANCED", yearsExperience: 2 },
      { name: "TypeScript", category: "Web Dev", proficiency: "INTERMEDIATE", yearsExperience: 1 },
    ],
    learningSkills: [
      { name: "C++ Data Structures & Algorithms", category: "DSA", targetProficiency: "ADVANCED" },
      { name: "System Design Fundamentals", category: "Core Eng", targetProficiency: "INTERMEDIATE" },
    ],
    availability: [
      { day: "Tuesday", timeSlots: ["17:00 - 19:00"] },
      { day: "Thursday", timeSlots: ["18:00 - 20:00"] },
      { day: "Saturday", timeSlots: ["10:00 - 13:00"] },
    ],
  },
  {
    id: "student-2",
    fullName: "Priya Patel",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    email: "priya.patel@vjti.ac.in",
    collegeName: "VJTI Mumbai",
    major: "Information Technology",
    graduationYear: 2026,
    bio: "Solved 450+ LeetCode problems in C++. Knight on LeetCode. Wanting to learn modern frontend web development and UI/UX design to build my own developer portfolio and hackathon projects.",
    city: "Mumbai, MH",
    modePreference: "HYBRID",
    languages: ["English", "Hindi", "Gujarati"],
    skillPointsBalance: 460,
    averageRating: 5.0,
    totalSessions: 22,
    teachingSkills: [
      { name: "C++ Data Structures & Algorithms", category: "DSA", proficiency: "ADVANCED", yearsExperience: 3 },
      { name: "Graph Algorithms & DP", category: "DSA", proficiency: "ADVANCED", yearsExperience: 2 },
      { name: "Object Oriented Design", category: "Core Eng", proficiency: "INTERMEDIATE", yearsExperience: 2 },
    ],
    learningSkills: [
      { name: "Next.js & React", category: "Web Dev", targetProficiency: "INTERMEDIATE" },
      { name: "Figma & UI/UX Design", category: "Design", targetProficiency: "BEGINNER" },
    ],
    availability: [
      { day: "Tuesday", timeSlots: ["17:00 - 19:00"] },
      { day: "Friday", timeSlots: ["16:00 - 18:00"] },
      { day: "Saturday", timeSlots: ["10:00 - 13:00"] },
    ],
  },
  {
    id: "student-3",
    fullName: "Rohan Verma",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    email: "rohan.verma@pilani.bits-pilani.ac.in",
    collegeName: "BITS Pilani",
    major: "Electrical & Electronics",
    graduationYear: 2025,
    bio: "Deep Learning enthusiast working on PyTorch computer vision models. Need someone to help me containerize microservices using Docker and set up PostgreSQL backend pipelines.",
    city: "Pilani, RJ",
    modePreference: "ONLINE",
    languages: ["English", "Hindi"],
    skillPointsBalance: 290,
    averageRating: 4.8,
    totalSessions: 11,
    teachingSkills: [
      { name: "Machine Learning with PyTorch", category: "AI/ML", proficiency: "ADVANCED", yearsExperience: 2 },
      { name: "Python for Data Science", category: "AI/ML", proficiency: "ADVANCED", yearsExperience: 3 },
    ],
    learningSkills: [
      { name: "Docker & Containerization", category: "DevOps", targetProficiency: "INTERMEDIATE" },
      { name: "PostgreSQL & Prisma", category: "Web Dev", targetProficiency: "INTERMEDIATE" },
    ],
    availability: [
      { day: "Monday", timeSlots: ["19:00 - 21:00"] },
      { day: "Wednesday", timeSlots: ["19:00 - 21:00"] },
      { day: "Sunday", timeSlots: ["14:00 - 17:00"] },
    ],
  },
  {
    id: "student-4",
    fullName: "Ananya Iyer",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256",
    email: "ananya.iyer@coep.ac.in",
    collegeName: "COEP Pune",
    major: "Computer Engineering",
    graduationYear: 2026,
    bio: "Lead UI/UX Designer for college technical festival. Designed 10+ Figma web & mobile kits. Eager to understand how to turn my designs into interactive cross-platform mobile apps using Flutter.",
    city: "Pune, MH",
    modePreference: "ONLINE",
    languages: ["English", "Hindi", "Marathi", "Tamil"],
    skillPointsBalance: 390,
    averageRating: 4.95,
    totalSessions: 18,
    teachingSkills: [
      { name: "Figma & UI/UX Design", category: "Design", proficiency: "ADVANCED", yearsExperience: 3 },
      { name: "Design Systems & Prototyping", category: "Design", proficiency: "ADVANCED", yearsExperience: 2 },
    ],
    learningSkills: [
      { name: "Flutter Mobile Development", category: "Mobile Dev", targetProficiency: "BEGINNER" },
      { name: "Tailwind CSS & UI Systems", category: "Web Dev", targetProficiency: "INTERMEDIATE" },
    ],
    availability: [
      { day: "Wednesday", timeSlots: ["18:00 - 20:00"] },
      { day: "Saturday", timeSlots: ["15:00 - 18:00"] },
      { day: "Sunday", timeSlots: ["11:00 - 14:00"] },
    ],
  },
  {
    id: "student-5",
    fullName: "Tanvi Deshmukh",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    email: "tanvi.deshmukh@dtu.ac.in",
    collegeName: "DTU Delhi",
    major: "Software Engineering",
    graduationYear: 2027,
    bio: "Java Spring Boot developer with an obsession for clean REST APIs and database schema normalization. Exploring OpenCV and Computer Vision basics for an upcoming semester robotics project.",
    city: "New Delhi, DL",
    modePreference: "ONLINE",
    languages: ["English", "Hindi"],
    skillPointsBalance: 210,
    averageRating: 4.75,
    totalSessions: 8,
    teachingSkills: [
      { name: "Java Spring Boot", category: "Web Dev", proficiency: "ADVANCED", yearsExperience: 2 },
      { name: "PostgreSQL & Relational DBs", category: "Database", proficiency: "INTERMEDIATE", yearsExperience: 2 },
    ],
    learningSkills: [
      { name: "Computer Vision & OpenCV", category: "AI/ML", targetProficiency: "BEGINNER" },
      { name: "Python for Data Science", category: "AI/ML", targetProficiency: "INTERMEDIATE" },
    ],
    availability: [
      { day: "Monday", timeSlots: ["17:00 - 19:00"] },
      { day: "Thursday", timeSlots: ["17:00 - 19:00"] },
    ],
  },
  {
    id: "student-6",
    fullName: "Kabir Mehta",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    email: "kabir.mehta@rvce.edu.in",
    collegeName: "RVCE Bengaluru",
    major: "Information Science",
    graduationYear: 2026,
    bio: "Backend developer writing Go microservices and Kubernetes manifests. Love distributed systems. Looking for a peer to explain React state management and Tailwind CSS for hackathon UIs.",
    city: "Bengaluru, KA",
    modePreference: "HYBRID",
    languages: ["English", "Hindi", "Kannada"],
    skillPointsBalance: 340,
    averageRating: 4.88,
    totalSessions: 15,
    teachingSkills: [
      { name: "Golang Microservices", category: "Core Eng", proficiency: "ADVANCED", yearsExperience: 2 },
      { name: "Docker & Containerization", category: "DevOps", proficiency: "INTERMEDIATE", yearsExperience: 1 },
    ],
    learningSkills: [
      { name: "Next.js & React", category: "Web Dev", targetProficiency: "BEGINNER" },
      { name: "Tailwind CSS & UI Systems", category: "Web Dev", targetProficiency: "INTERMEDIATE" },
    ],
    availability: [
      { day: "Tuesday", timeSlots: ["18:00 - 20:00"] },
      { day: "Thursday", timeSlots: ["18:00 - 20:00"] },
      { day: "Saturday", timeSlots: ["14:00 - 17:00"] },
    ],
  },
];

export interface CommunityDoubt {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorCollege: string;
  authorAvatar: string;
  tags: string[];
  createdAt: string;
  upvotes: number;
  isSolved: boolean;
  repliesCount: number;
  replies: {
    id: string;
    authorName: string;
    authorCollege: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
    isSolution: boolean;
    upvotes: number;
  }[];
}

export const INITIAL_DOUBTS: CommunityDoubt[] = [
  {
    id: "doubt-1",
    title: "How to conceptualize Memoization vs Tabulation in Grid Unique Paths problem?",
    content: "I can write the recursive solution for the m x n grid unique paths problem easily, but every time I try to invert it into bottom-up DP tabulation, my 2D array indexing gets off-by-one errors. Could someone explain an intuitive mental model to transition from recurrence relation to array loop?",
    authorName: "Tanvi Deshmukh",
    authorCollege: "DTU Delhi",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    tags: ["Dynamic Programming", "C++", "DSA", "Recursion"],
    createdAt: "3 hours ago",
    upvotes: 14,
    isSolved: true,
    repliesCount: 2,
    replies: [
      {
        id: "reply-1",
        authorName: "Priya Patel",
        authorCollege: "VJTI Mumbai",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
        content: "Great question Tanvi! The trick is to look at your base case in recursion. In recursion `f(0,0) = 1` and boundary conditions return 0. In tabulation, create a matrix `dp[m][n]`. Fill the first row and first column with 1 (because there's only 1 way to move strictly right or strictly down). Then iterate `i from 1 to m-1` and `j from 1 to n-1`, where `dp[i][j] = dp[i-1][j] + dp[i][j-1]`. Would love to hop on a 20-min session on SkillBridge if you want to walk through the visual tree together!",
        createdAt: "2 hours ago",
        isSolution: true,
        upvotes: 19,
      },
    ],
  },
  {
    id: "doubt-2",
    title: "Understanding Server Actions vs API Route Handlers in Next.js 14/15 App Router",
    content: "When should I use a Server Action (`'use server'`) inside a form submission versus writing a standard `route.ts` handler under `/api/...`? Does Server Action handle file uploads well?",
    authorName: "Kabir Mehta",
    authorCollege: "RVCE Bengaluru",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    tags: ["Next.js", "Web Dev", "Full-Stack", "TypeScript"],
    createdAt: "5 hours ago",
    upvotes: 9,
    isSolved: false,
    repliesCount: 1,
    replies: [
      {
        id: "reply-2",
        authorName: "Aarav Sharma",
        authorCollege: "IIT Bombay",
        authorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256",
        content: "Rule of thumb: If it's a direct user mutation triggered from UI (like form submit, button click, like/unlike) where you want automatic cache revalidation (`revalidatePath`), use Server Actions! If it's a webhook, public endpoint, or third-party callback, use Route Handlers.",
        createdAt: "4 hours ago",
        isSolution: false,
        upvotes: 12,
      },
    ],
  },
];
