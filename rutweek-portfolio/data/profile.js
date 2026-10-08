// ─────────────────────────────────────────────────────────────────────────
//  EVERYTHING PERSONAL ON THE SITE LIVES IN THIS FILE.
//  Edit the text, links and lists below and the whole portfolio updates.
//  (Sourced from your October resume — all URLs are the ones embedded in it.)
// ─────────────────────────────────────────────────────────────────────────

export const PROFILE = {
  name: "Rutweek Vaidya",
  firstName: "Rutweek",
  logo: "RUTWEEK", // big hero heading + navbar logo
  role: "Full-Stack Developer",
  email: "rutvikbvaidya36@gmail.com",
  phone: "+91 8080332829",
  phoneHref: "tel:+918080332829",
  linkedin: "https://linkedin.com/in/rutweek-vaidya",
  github: "https://github.com/Rutweek25",
  leetcode: "https://leetcode.com/u/Rutweek25/",
  codechef: "https://www.codechef.com/users/rutweek25",
  codeforces: "https://codeforces.com/profile/rutweek25",
  resume: "/resume.pdf",
  metaDescription:
    "Rutweek Vaidya — B.Tech CSE student and full-stack developer building secure, real-time web applications with React, Node.js, Express and MongoDB.",
};

// Big scroll-driven sentence in the middle of the page.
export const SCROLL_STATEMENT = "I Build Full-Stack Products That Solve Real Problems.";

// About section — two short paragraphs.
export const ABOUT = [
  "Rutweek Vaidya is a B.Tech CSE student at KI University, Vijayawada, building full-stack web applications with React.js, Node.js, Express.js and MongoDB.",
  "He focuses on secure APIs, real-time systems and clean, modular architecture, backed by a strong foundation in DSA, OOP, DBMS and Operating Systems.",
];

// The four cards under the About text.
export const EXPERTISE = [
  {
    title: "Full-Stack Web Development",
    body: "React.js, Node.js, Express.js and MongoDB applications, from responsive UI to deployment on Vercel and Render.",
  },
  {
    title: "Secure Backend APIs",
    body: "RESTful services with JWT authentication, role-based authorization, request validation and centralized error handling.",
  },
  {
    title: "Real-Time Systems",
    body: "Socket.IO powered notifications and live dashboards with JWT-authenticated, room-based communication.",
  },
  {
    title: "Problem Solving",
    body: "Strong DSA fundamentals, practiced consistently on LeetCode, CodeChef and Codeforces.",
  },
];

// Stat tiles inside the About card (replaces the portrait photo).
export const ABOUT_CARD = {
  initials: "RV",
  caption: "B.Tech CSE · KI University",
  stats: [
    { value: "8.9", label: "CGPA" },
    { value: "2027", label: "Graduating" },
    { value: "3", label: "Projects" },
  ],
};

// `href: null` renders a non-clickable row. Add a URL any time to make it a link.
export const PROJECTS = [
  {
    name: "Lab Management System",
    role: "Personal Project · 2025 – Present",
    note: "Node.js, Express.js, React.js, MongoDB, Prisma, Socket.IO, JWT. A full-stack laboratory platform with role-based workflows for doctors, technicians and admins: patient registration, test ordering, payments, PDF reports, audit logging and real-time updates.",
    href: "https://labmanagementpbn.netlify.app/login",
    kind: "Live Demo",
  },
  {
    name: "CampusEdge – Campus Recruitment Platform",
    role: "Personal Project · 2024 – 2025",
    note: "React.js, Node.js, Express.js, MongoDB, JWT. Helps students explore placement opportunities, with RESTful APIs, a responsive interface and production deployment on Vercel.",
    href: "https://campus-edgee.vercel.app/",
    kind: "Live Demo",
  },
  {
    name: "Grocery Store Application",
    role: "Academic Project · 2023 – 2024",
    note: "Python, Flask, React.js, SQL. Built through Agile sprints with a secure CRUD backend, structured SQL data models, and a React UI integrated with Flask REST APIs.",
    href: null,
    kind: "Academic",
  },
];

export const SKILLS = [
  { name: "Languages", role: "C, Java, JavaScript, Python", kind: "Stack" },
  {
    name: "Frameworks & Libraries",
    role: "React.js, Node.js, Express.js, Flask, Socket.IO, Prisma ORM",
    kind: "Stack",
  },
  { name: "Databases", role: "SQL, MongoDB", kind: "Stack" },
  { name: "Tools", role: "Git, Docker, Jenkins, Vercel, Render", kind: "Stack" },
  {
    name: "Strong Subjects",
    role: "Data Structures & Algorithms, OOP, DBMS, Operating Systems",
    kind: "Core",
  },
];

// Marquee showcase items
export const MARQUEE_ITEMS = [
  "Full-Stack Developer",
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Socket.IO",
  "Prisma",
  "JWT",
  "Java",
  "Python",
  "Docker",
  "Git",
  "DSA",
];

// Heading of the education timeline.
export const EDUCATION_SECTION = {
  eyebrow: "04 / ACADEMIC JOURNEY",
  titleTop: "Where the",
  titleAccent: "journey began.",
};

// Oldest first — the timeline alternates left / right from the top.
// `id` is also the logo file name: public/logos/<id>.png
export const EDUCATION = [
  {
    id: "his",
    initials: "BVM",
    school: "Bal Vidya Mandir",
    year: "2013 — 2021",
    level: "SSC · CLASS X",
    score: "97.6%",
    blurb: "The starting point for a curious, disciplined learner.",
  },
  {
    id: "dav",
    initials: "MGM",
    school: "Mahatma Gandhi Junior College",
    year: "2021 — 2023",
    level: "AISSCE · CLASS XII",
    score: "78.17%",
    blurb: "A focused foundation in mathematics and computer science.",
  },
  {
    id: "klu",
    initials: "KLU",
    school: "KL University",
    year: "2023 — 2027",
    level: "B.TECH · COMPUTER SCIENCE & ENGINEERING",
    score: "9.00 CGPA",
    blurb: "Growing through software, systems, and emerging technology.",
  },
];

// Certifications & Credentials showcase
export const CERTIFICATIONS_SECTION = {
  eyebrow: "05 / CERTIFICATIONS & CREDENTIALS",
  titleTop: "Validated depth,",
  titleAccent: "proven execution.",
  subtitle:
    "Industry credentials, specialized academic foundations, and competitive problem-solving milestones.",
};

export const CERTIFICATIONS = [
  {
    id: "mongodb-associate-developer",
    title: "MongoDB Associate Developer – Node.js",
    issuer: "MongoDB University",
    badge: "Verified Credential",
    category: "Database & Backend",
    year: "2024",
    credentialId: "MDB-NODE-2024",
    href: "https://university.mongodb.com/",
    kind: "Verified",
    accentColor: "#00ED64",
    logo: "/certifications/mongodb.svg",
    skills: ["MongoDB", "Node.js", "Aggregation Pipeline", "Mongoose", "Optimization"],
    blurb:
      "Comprehensive certification validating proficiency in Node.js backend development with MongoDB, aggregation pipelines, schema modeling, Mongoose ODM, and database optimization.",
  },
  {
    id: "mongodb-associate-dba",
    title: "MongoDB Associate Database Administrator",
    issuer: "MongoDB",
    badge: "Verified Credential",
    category: "Database & Administration",
    year: "2024",
    credentialId: "198daf73-43d5-4b76-8c81-e40fbe885e4e",
    href: "https://www.credly.com/badges/198daf73-43d5-4b76-8c81-e40fbe885e4e/public_url",
    kind: "Verified",
    accentColor: "#13AA52",
    logo: "/certifications/mongodb.svg",
    skills: ["Database Administration", "Replication", "Sharding", "Security", "Backup & Recovery"],
    blurb:
      "Industry credential validating expertise in deploying, configuring, maintaining, and administering production MongoDB database clusters, replication sets, and sharded environments.",
  },
  {
    id: "azure-ai-engineer-associate",
    title: "Microsoft Certified: Azure AI Engineer Associate",
    issuer: "Microsoft",
    badge: "Associate Certification",
    category: "Cloud & AI",
    year: "2024",
    credentialId: "120851df73008097",
    href: "https://learn.microsoft.com/en-us/users/rutweek/credentials/120851df73008097",
    kind: "Verified",
    accentColor: "#0078D4",
    logo: "/certifications/azure.svg",
    skills: ["Azure OpenAI", "Cognitive Services", "Computer Vision", "NLP", "AI Search"],
    blurb:
      "Validates technical skills in architecting and implementing cognitive services, Azure OpenAI solutions, computer vision models, conversational AI, and natural language processing pipelines.",
  },
  {
    id: "github-foundations",
    title: "GitHub Foundations",
    issuer: "GitHub",
    badge: "Foundational Credential",
    category: "DevOps & Git",
    year: "2024",
    credentialId: "5a9835235ac9b3cb",
    href: "https://learn.microsoft.com/en-us/users/rutweek/credentials/5a9835235ac9b3cb",
    kind: "Verified",
    accentColor: "#8957E5",
    logo: "/certifications/github.svg",
    skills: ["Git", "GitHub Actions", "Collaborative Workflows", "CI/CD", "Repository Management"],
    blurb:
      "Validates core competencies in version control, collaborative workflows, GitHub Actions CI/CD automation, security best practices, and enterprise repository management.",
  },
];

export const ACHIEVEMENTS = [
  {
    name: "MongoDB Associate Developer – Node.js",
    role: "Certification · MongoDB University",
    href: "https://university.mongodb.com/",
    kind: "Verified",
  },
  {
    name: "MongoDB Associate Database Administrator",
    role: "Certification · Credly",
    href: "https://www.credly.com/badges/198daf73-43d5-4b76-8c81-e40fbe885e4e/public_url",
    kind: "Verified",
  },
  {
    name: "Microsoft Certified: Azure AI Engineer Associate",
    role: "Certification · Microsoft",
    href: "https://learn.microsoft.com/en-us/users/rutweek/credentials/120851df73008097",
    kind: "Verified",
  },
  {
    name: "GitHub Foundations",
    role: "Certification · GitHub / Microsoft",
    href: "https://learn.microsoft.com/en-us/users/rutweek/credentials/5a9835235ac9b3cb",
    kind: "Verified",
  },
];
