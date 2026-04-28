import { db, usersTable, projectsTable, skillsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding demo profile: aditya");

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, "aditya"))
    .limit(1);

  let userId: string;
  if (existing.length > 0) {
    userId = existing[0].id;
    console.log("Aditya already exists — refreshing data");
    await db
      .update(usersTable)
      .set({
        name: "Aditya D Agnihotri",
        email: "aditya@example.com",
        bio: "I'm a passionate full-stack engineer who loves building polished, performant products end-to-end. Currently focused on TypeScript, React, and developer tooling.",
        headline: "Full-Stack Developer · TypeScript · React · Node",
        location: "Bengaluru, India",
        avatarUrl: "",
        resumeUrl: "",
        templateId: "neon",
        socialLinks: {
          github: "https://github.com/aditya",
          linkedin: "https://linkedin.com/in/aditya",
          twitter: "https://twitter.com/aditya",
          website: "https://aditya.dev",
        },
        isPro: true,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));
  } else {
    const [created] = await db
      .insert(usersTable)
      .values({
        username: "aditya",
        name: "Aditya D Agnihotri",
        email: "aditya@example.com",
        bio: "I'm a passionate full-stack engineer who loves building polished, performant products end-to-end. Currently focused on TypeScript, React, and developer tooling.",
        headline: "Full-Stack Developer · TypeScript · React · Node",
        location: "Bengaluru, India",
        templateId: "neon",
        socialLinks: {
          github: "https://github.com/aditya",
          linkedin: "https://linkedin.com/in/aditya",
          twitter: "https://twitter.com/aditya",
          website: "https://aditya.dev",
        },
        isPro: true,
      })
      .returning();
    userId = created.id;
  }

  // Wipe and re-seed projects + skills so the demo stays consistent
  await db.delete(projectsTable).where(eq(projectsTable.userId, userId));
  await db.delete(skillsTable).where(eq(skillsTable.userId, userId));

  await db.insert(projectsTable).values([
    {
      userId,
      title: "CodeFolio",
      description:
        "A multi-tenant developer-portfolio CMS. Sign up, fill in your projects and skills, pick a template — get a live URL. Built on React, Drizzle, Postgres, and Clerk.",
      techStack: ["React", "TypeScript", "Drizzle", "Postgres", "Clerk", "Tailwind"],
      githubLink: "https://github.com/aditya/codefolio",
      liveLink: "https://codefolio.dev",
      imageUrl: "",
      position: 0,
    },
    {
      userId,
      title: "DevPulse Analytics",
      description:
        "An open-source observability dashboard that ingests logs over OTLP and renders flame graphs, latency heatmaps, and SLO trends in real time.",
      techStack: ["Rust", "ClickHouse", "Grafana", "OpenTelemetry"],
      githubLink: "https://github.com/aditya/devpulse",
      liveLink: "",
      imageUrl: "",
      position: 1,
    },
    {
      userId,
      title: "Notebook AI",
      description:
        "A local-first knowledge-base app with retrieval-augmented chat over your own markdown notes. Embeddings indexed via SQLite + pgvector.",
      techStack: ["Next.js", "pgvector", "OpenAI", "Tauri"],
      githubLink: "https://github.com/aditya/notebook-ai",
      liveLink: "https://notebook.ai",
      imageUrl: "",
      position: 2,
    },
  ]);

  await db.insert(skillsTable).values([
    {
      userId,
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Rust", "Go", "SQL"],
      position: 0,
    },
    {
      userId,
      category: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Vite"],
      position: 1,
    },
    {
      userId,
      category: "Backend",
      items: ["Node.js", "Express", "Drizzle ORM", "PostgreSQL", "Redis"],
      position: 2,
    },
    {
      userId,
      category: "DevOps & Cloud",
      items: ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions"],
      position: 3,
    },
  ]);

  console.log("✓ Seed complete. Visit /aditya to view the portfolio.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
