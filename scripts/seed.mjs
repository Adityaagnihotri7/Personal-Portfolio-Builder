import bcrypt from "bcryptjs";
import { db, usersTable, projectsTable, skillsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const username = "aditya";
const email = "adityadagnihotri7@gmail.com";

const existing = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.username, username))
  .limit(1);

let userId;
if (existing.length > 0) {
  userId = existing[0].id;
  console.log("Aditya already exists:", userId);
} else {
  const passwordHash = await bcrypt.hash("changeme123", 10);
  const [u] = await db
    .insert(usersTable)
    .values({
      name: "Aditya D Agnihotri",
      email,
      username,
      passwordHash,
      bio: "I build scalable solutions and AI-powered applications that solve real-world problems.",
      role: "Software Developer",
      location: "India",
      avatarUrl: "",
      templateId: "neon",
      socialLinks: {
        github: "https://github.com/AnmolMathad15",
        linkedin: "https://www.linkedin.com/in/aditya-d-agnihotri",
      },
      isPro: true,
    })
    .returning();
  userId = u.id;
  console.log("Created Aditya:", userId);

  await db.insert(projectsTable).values([
    {
      userId,
      title: "JCET Hub",
      subtitle: "Smart Campus Management & Engagement Platform",
      description:
        "A full-stack campus platform integrating event management, QR-based attendance, and real-time engagement using WebSockets. Features role-based dashboards (Admin, Faculty, Student), activity tracking, and resume-building tools.",
      techStack: ["Node.js", "Express.js", "PostgreSQL", "WebSockets", "Tailwind CSS"],
      githubLink: "https://github.com/AnmolMathad15/JCET_HUB",
      sortOrder: 1,
    },
    {
      userId,
      title: "NextStop JGI",
      subtitle: "Real-Time College Bus Tracking System",
      description:
        "A real-time GPS-based bus tracking system with Student, Driver, and Admin modules. Uses WebSockets for live updates and PostgreSQL for route and data management.",
      techStack: ["Node.js", "Express.js", "PostgreSQL", "WebSockets"],
      githubLink: "https://github.com/AnmolMathad15/Nextstop--JGI",
      sortOrder: 2,
    },
    {
      userId,
      title: "AI Complaint Resolver",
      subtitle: "Intelligent Ticket Triage & Resolution",
      description:
        "An AI-powered complaint resolution system that analyzes user queries and generates intelligent responses using NLP and automation workflows.",
      techStack: ["Python", "AI/ML", "NLP", "APIs"],
      githubLink:
        "https://github.com/AnmolMathad15/AICustomerComplaintResolutionAgent-ResolveAI-Hackoclock",
      sortOrder: 3,
    },
    {
      userId,
      title: "TrustChain AI",
      subtitle: "Blockchain + AI for Trusted Data",
      description:
        "A blockchain + AI-powered system designed to ensure trust, transparency, and secure data handling in digital ecosystems.",
      techStack: ["Blockchain", "AI", "Web Tech"],
      githubLink: "https://github.com/AnmolMathad15/TrustChain",
      sortOrder: 4,
    },
  ]);
  console.log("Inserted 4 projects");

  await db.insert(skillsTable).values([
    { userId, category: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "SQL"], sortOrder: 1 },
    { userId, category: "Frontend", items: ["React", "Tailwind CSS", "Framer Motion", "Vite"], sortOrder: 2 },
    { userId, category: "Backend", items: ["Node.js", "Express.js", "WebSockets", "REST APIs"], sortOrder: 3 },
    { userId, category: "Database", items: ["PostgreSQL", "MongoDB", "Drizzle ORM"], sortOrder: 4 },
    { userId, category: "AI / Tools", items: ["Prompt Engineering", "LLM APIs", "Git", "DSA"], sortOrder: 5 },
  ]);
  console.log("Inserted skills");
}
console.log("Done");
process.exit(0);
