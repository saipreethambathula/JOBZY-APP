const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();

const dbPath = path.resolve(__dirname, "jobzy.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("SQLite connection error:", err.message);
  }
});

/* ===================== CREATE TABLES ===================== */
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company_name TEXT NOT NULL,
      job_role TEXT NOT NULL,
      icon TEXT,
      description TEXT NOT NULL,
      long_description TEXT,
      skills TEXT,
      package TEXT,
      applyLink TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(title, company_name)
    )
  `);

  /* ===================== DEFAULT ADMIN ===================== */
  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [process.env.ADMIN_EMAIL],
    async (err, row) => {
      if (err) return;

      if (!row) {
        const hashedPassword = await bcrypt.hash(
          process.env.ADMIN_PASSWORD,
          10,
        );

        db.run(
          `INSERT INTO users (name, email, password, role)
           VALUES (?, ?, ?, ?)`,
          ["Admin", process.env.ADMIN_EMAIL, hashedPassword, "admin"],
        );
      }
    },
  );

  /* ===================== DEFAULT JOB SEED ===================== */
  db.get(`SELECT COUNT(*) as count FROM jobs`, (err, row) => {
    if (err || !row || row.count !== 0) return;

    const defaultJobs = [
      [
        "Software Development Engineer I",
        "Amazon",
        "Backend Developer",
        "https://logo.clearbit.com/amazon.com",
        "Build scalable backend systems serving millions of customers.",
        "Design and develop highly scalable distributed systems powering global services. Optimize APIs, improve latency, ensure reliability, and collaborate with cross-functional teams. Strong understanding of system design, algorithms, and operational excellence required.",
        "Java, Data Structures, AWS, System Design",
        "18 - 28 LPA",
        "https://www.amazon.jobs/",
      ],
      [
        "Frontend Engineer",
        "Flipkart",
        "React Developer",
        "https://logo.clearbit.com/flipkart.com",
        "Develop high-performance e-commerce UI.",
        "Build fast and responsive web interfaces handling millions of users. Work with designers and backend teams to implement reusable components and optimize performance across devices.",
        "React.js, Redux, JavaScript, REST API",
        "12 - 20 LPA",
        "https://www.flipkartcareers.com/",
      ],
      [
        "Software Engineer",
        "Microsoft",
        "Full Stack Developer",
        "https://logo.clearbit.com/microsoft.com",
        "Build enterprise cloud applications.",
        "Develop secure and scalable cloud-based enterprise systems using Azure. Participate in architecture discussions, DevOps practices, and deliver production-ready solutions.",
        "C#, .NET, Azure, React",
        "20 - 35 LPA",
        "https://careers.microsoft.com/",
      ],
      [
        "UI Engineer",
        "Adobe",
        "Frontend Developer",
        "https://logo.clearbit.com/adobe.com",
        "Create interactive web applications.",
        "Design and implement modern UI components used by creative professionals worldwide. Ensure cross-browser compatibility and high performance.",
        "JavaScript, TypeScript, CSS, React",
        "18 - 30 LPA",
        "https://careers.adobe.com/",
      ],
      [
        "Platform Engineer",
        "Netflix",
        "Backend Engineer",
        "https://logo.clearbit.com/netflix.com",
        "Build global streaming infrastructure.",
        "Design distributed microservices and optimize backend systems delivering seamless streaming experiences to millions globally.",
        "Java, Spring Boot, Microservices, AWS",
        "35 - 60 LPA",
        "https://jobs.netflix.com/",
      ],
      [
        "Software Engineer",
        "Google",
        "SDE",
        "https://logo.clearbit.com/google.com",
        "Work on large-scale distributed systems.",
        "Develop highly scalable systems processing massive datasets across distributed environments. Optimize algorithms and infrastructure performance.",
        "C++, Python, Algorithms, Distributed Systems",
        "25 - 45 LPA",
        "https://careers.google.com/",
      ],
      [
        "Assistant System Engineer",
        "TCS",
        "Software Engineer",
        "https://logo.clearbit.com/tcs.com",
        "Develop enterprise solutions for global clients.",
        "Work on enterprise applications across multiple domains including banking and healthcare. Participate in development and deployment cycles.",
        "Java, SQL, Spring, Git",
        "3 - 7 LPA",
        "https://www.tcs.com/careers",
      ],
      [
        "Systems Engineer",
        "Infosys",
        "Full Stack Developer",
        "https://logo.clearbit.com/infosys.com",
        "Build enterprise-grade applications.",
        "Design and maintain scalable applications for international clients while adhering to secure coding standards.",
        "Java, Angular, SQL, REST API",
        "3.5 - 8 LPA",
        "https://www.infosys.com/careers",
      ],
      [
        "iOS Developer",
        "Apple",
        "Mobile App Developer",
        "https://logo.clearbit.com/apple.com",
        "Develop high-performance iOS applications.",
        "Build intuitive and reliable applications within the Apple ecosystem using Swift and modern iOS frameworks.",
        "Swift, iOS, Xcode, UI Design",
        "22 - 40 LPA",
        "https://jobs.apple.com/",
      ],
      [
        "Android Developer",
        "Samsung",
        "Mobile Developer",
        "https://logo.clearbit.com/samsung.com",
        "Develop Android apps for Samsung devices.",
        "Design and optimize Android applications ensuring device compatibility and performance across Samsung hardware.",
        "Kotlin, Android, Java, API Integration",
        "10 - 18 LPA",
        "https://www.samsungcareers.com/",
      ],
    ];

    const insertQuery = `
      INSERT OR IGNORE INTO jobs
      (title, company_name, job_role, icon, description, long_description, skills, package, applyLink)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(insertQuery);

    defaultJobs.forEach((job) => {
      stmt.run(job);
    });

    stmt.finalize();
  });
});

module.exports = db;
