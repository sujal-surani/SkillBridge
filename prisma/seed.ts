import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SkillBridge database seeding...");

  // 1. Create Core Community Members
  const users = [
    {
      id: "member-1",
      email: "pooja.artist@gmail.com",
      name: "Pooja Sharma",
      fullName: "Pooja Sharma",
      age: 34,
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      occupationOrInterest: "Fine Artist & Watercolor Instructor",
      neighborhood: "C-Scheme",
      city: "Jaipur, RJ",
      modePreference: "HYBRID",
      spokenLanguages: JSON.stringify(["English", "Hindi"]),
      bio: "Practicing watercolor artist, plein-air sketcher, and botanical illustrator for 10+ years. I love guiding complete beginners through watercolor washes and pencil perspective drawing.",
      skillPointsBalance: 420,
      averageRating: 4.96,
      totalSessions: 22,
      role: "MEMBER",
      availability: JSON.stringify([
        { day: "Tuesday", timeSlots: ["16:00 - 18:30"] },
        { day: "Saturday", timeSlots: ["10:00 - 13:00"] },
      ]),
      teaching: [
        {
          name: "Watercolor Landscape Painting & Washes",
          pillar: "CREATIVE_PRACTICAL",
          category: "Drawing & Fine Arts",
          proficiency: "EXPERIENCED",
          yearsExperience: 10,
        },
        {
          name: "Pencil Sketching & Botanical Illustration",
          pillar: "CREATIVE_PRACTICAL",
          category: "Drawing & Fine Arts",
          proficiency: "EXPERIENCED",
          yearsExperience: 8,
        },
      ],
      learning: [
        {
          name: "Morning Hatha Yoga & Posture",
          pillar: "HEALTH_WELLNESS",
          category: "Health & Fitness",
          proficiency: "BEGINNER",
        },
        {
          name: "Healthy Balanced Meal Prep",
          pillar: "HEALTH_WELLNESS",
          category: "Nutrition & Health",
          proficiency: "BEGINNER",
        },
      ],
    },
    {
      id: "member-2",
      email: "kavita.nair@gmail.com",
      name: "Kavita Nair",
      fullName: "Kavita Nair",
      age: 39,
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
      occupationOrInterest: "Yoga Coach & Balcony Gardener",
      neighborhood: "Panampilly Nagar",
      city: "Kochi, KL",
      modePreference: "ONLINE",
      spokenLanguages: JSON.stringify(["English", "Malayalam", "Hindi"]),
      bio: "Certified Hatha Yoga teacher focusing on gentle restorative movement, desk worker posture correction, and breathwork. In my spare time, I grow microgreens and companion herbs.",
      skillPointsBalance: 310,
      averageRating: 4.92,
      totalSessions: 18,
      role: "MEMBER",
      availability: JSON.stringify([
        { day: "Monday", timeSlots: ["07:00 - 08:30"] },
        { day: "Saturday", timeSlots: ["08:00 - 11:00"] },
      ]),
      teaching: [
        {
          name: "Morning Hatha Yoga & Posture",
          pillar: "HEALTH_WELLNESS",
          category: "Health & Fitness",
          proficiency: "EXPERIENCED",
          yearsExperience: 7,
        },
        {
          name: "Balcony Herb & Microgreen Cultivation",
          pillar: "CREATIVE_PRACTICAL",
          category: "Gardening & Sustainability",
          proficiency: "INTERMEDIATE",
          yearsExperience: 4,
        },
      ],
      learning: [
        {
          name: "Watercolor Landscape Painting & Washes",
          pillar: "CREATIVE_PRACTICAL",
          category: "Drawing & Fine Arts",
          proficiency: "BEGINNER",
        },
      ],
    },
    {
      id: "member-3",
      email: "ramesh.kulkarni@gmail.com",
      name: "Ramesh Kulkarni",
      fullName: "Ramesh Kulkarni",
      age: 48,
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
      occupationOrInterest: "Senior Financial Analyst & Urban Gardener",
      neighborhood: "Koregaon Park",
      city: "Pune, MH",
      modePreference: "IN_PERSON",
      spokenLanguages: JSON.stringify(["English", "Marathi", "Hindi"]),
      bio: "Over 20 years managing household budgets, financial models, and Excel pivot sheets. Also an avid organic terrace vegetable grower and compost maker.",
      skillPointsBalance: 520,
      averageRating: 4.98,
      totalSessions: 34,
      role: "MEMBER",
      availability: JSON.stringify([
        { day: "Wednesday", timeSlots: ["18:00 - 20:00"] },
        { day: "Sunday", timeSlots: ["09:00 - 12:00"] },
      ]),
      teaching: [
        {
          name: "Personal Budgeting & Excel Pivot Modeling",
          pillar: "TECH_PROFESSIONAL",
          category: "Productivity & Tech",
          proficiency: "EXPERIENCED",
          yearsExperience: 15,
        },
        {
          name: "Organic Terrace Vegetable Gardening",
          pillar: "CREATIVE_PRACTICAL",
          category: "Gardening & Sustainability",
          proficiency: "EXPERIENCED",
          yearsExperience: 9,
        },
      ],
      learning: [
        {
          name: "Sourdough Bread Baking",
          pillar: "CREATIVE_PRACTICAL",
          category: "Culinary & Baking",
          proficiency: "BEGINNER",
        },
      ],
    },
  ];

  for (const u of users) {
    const { teaching, learning, ...userData } = u;

    // Upsert User
    const user = await prisma.user.upsert({
      where: { id: u.id },
      update: userData,
      create: userData,
    });

    // Clear and seed teaching skills
    await prisma.userSkill.deleteMany({
      where: { userId: user.id },
    });

    for (const t of teaching) {
      const skill = await prisma.skill.upsert({
        where: { name: t.name },
        update: {},
        create: {
          name: t.name,
          pillar: t.pillar,
          category: t.category,
          iconName: "Sparkles",
        },
      });

      await prisma.userSkill.create({
        data: {
          userId: user.id,
          skillId: skill.id,
          type: "TEACHING",
          proficiency: t.proficiency,
          yearsExperience: t.yearsExperience,
        },
      });
    }

    for (const l of learning) {
      const skill = await prisma.skill.upsert({
        where: { name: l.name },
        update: {},
        create: {
          name: l.name,
          pillar: l.pillar,
          category: l.category,
          iconName: "BookOpen",
        },
      });

      await prisma.userSkill.create({
        data: {
          userId: user.id,
          skillId: skill.id,
          type: "LEARNING",
          proficiency: l.proficiency,
          yearsExperience: 0,
        },
      });
    }

    console.log(`✓ Seeded user: ${user.fullName} (${user.id})`);
  }

  // 2. Seed an initial Exchange Proposal
  await prisma.exchangeProposal.upsert({
    where: { id: "prop-101" },
    update: {},
    create: {
      id: "prop-101",
      senderId: "member-2",
      senderName: "Kavita Nair",
      senderAvatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
      senderLocation: "Panampilly Nagar, Kochi",
      senderAge: 39,
      receiverId: "member-1",
      receiverName: "Pooja Sharma",
      receiverAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      offeredSkill: "Morning Hatha Yoga & Posture",
      requestedSkill: "Watercolor Landscape Painting & Washes",
      proposedTime: "Saturday at 10:00 AM IST",
      status: "PENDING",
      message:
        "Namaste Pooja! I've been admiring your watercolor sketches. I'd love to guide you through restorative Hatha Yoga stretches in exchange for a beginner sky wash demo!",
    },
  });

  // 3. Seed an initial Swap Session
  const session = await prisma.swapSession.upsert({
    where: { id: "session-201" },
    update: {},
    create: {
      id: "session-201",
      proposalId: "prop-101",
      roomId: "SB-482",
      topic: "1-on-1 Community Exchange: Watercolor Painting ⇄ Hatha Yoga",
      offeredSkill: "Watercolor Landscape Painting & Washes",
      requestedSkill: "Morning Hatha Yoga & Posture",
      scheduledFor: "Saturday, 10:00 AM - 11:00 AM IST",
      durationMinutes: 60,
      status: "UPCOMING",
      notesMarkdown:
        "# SkillBridge Community Exchange: Live Collaborative Notes\n\n**Mentors:** Pooja Sharma & Kavita Nair\n\n### 1. Skill Swap Fundamentals:\n- Key steps and references discussed.\n- Practical tips and posture adjustments.\n\n### 2. Action Items & Practice:\n- Follow-up exercises to practice before the next exchange.",
    },
  });

  // Seed participants for session-201
  await prisma.sessionParticipant.deleteMany({
    where: { sessionId: session.id },
  });

  await prisma.sessionParticipant.createMany({
    data: [
      {
        sessionId: session.id,
        userId: "member-1",
        role: "mentor",
      },
      {
        sessionId: session.id,
        userId: "member-2",
        role: "learner",
      },
    ],
  });

  // 4. Seed a Community Question and Reply
  const q1 = await prisma.communityQuestion.upsert({
    where: { id: "q-1" },
    update: {},
    create: {
      id: "q-1",
      authorId: "member-3",
      title:
        "How do I prevent 300 GSM watercolor paper from buckling when painting wet-on-wet landscapes?",
      content:
        "Whenever I try to paint cloudy skies using wet-on-wet watercolor washes, my paper forms ridges and puddles the pigment unevenly. Should I pre-stretch the sheet?",
      pillar: "CREATIVE_PRACTICAL",
      tags: JSON.stringify(["Drawing", "Watercolor", "Painting"]),
      upvotes: 21,
      isSolved: true,
    },
  });

  await prisma.questionReply.upsert({
    where: { id: "rep-1" },
    update: {},
    create: {
      id: "rep-1",
      questionId: q1.id,
      authorId: "member-1",
      content:
        "Hello Ramesh! Even 300 GSM paper buckles if you only wet one side. Wet BOTH sides evenly with a flat brush, wait 2 minutes for the cotton fibers to expand, then tape all 4 sides with water-activated tape onto a board. It will dry drum-tight!",
      isSolution: true,
      upvotes: 27,
    },
  });

  console.log("✨ SkillBridge database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
