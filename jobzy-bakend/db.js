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
        "https://media.licdn.com/dms/image/v2/D560BAQGDLy4STCnHbg/company-logo_200_200/B56ZnZxDipI0AI-/0/1760295142304/amazon_logo?e=1772668800&v=beta&t=cmNBUhONKV9GN45uCfwTmTZbDaV5JWHrf1E97ouwprc",
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
        "https://media.licdn.com/dms/image/v2/D560BAQHtneRyv-iofA/company-logo_200_200/B56Za6BjbWHgAM-/0/1746877692629/flipkart_logo?e=1772668800&v=beta&t=bFcTuib6kGn3-ynABVRIaXG5GP82eZXcmtLdFwgTx_8",
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
        "https://media.licdn.com/dms/image/v2/D560BAQH32RJQCl3dDQ/company-logo_200_200/B56ZYQ0mrGGoAM-/0/1744038948046/microsoft_logo?e=1772668800&v=beta&t=gb0rIIW9kppYHzXxiSUso2n2g-SpamqCdpvfvUiUjCA",
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
        "https://media.licdn.com/dms/image/v2/D560BAQHilaKdJueUVg/company-logo_200_200/B56ZodIp56HUAM-/0/1761425400480?e=1772668800&v=beta&t=xZjFsB_uub_4thavHkkzOHqIG8PsCWUve-guvks7ezY",
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
        "https://media.licdn.com/dms/image/v2/D4E0BAQGMva5_E8pUjw/company-logo_200_200/company-logo_200_200/0/1736276678240/netflix_logo?e=1772668800&v=beta&t=Lb42LAtCa_eapdnaz-Ix7n2uyfQI1MuwOo6ORH56kPw",
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
        "https://media.licdn.com/dms/image/v2/D4E0BAQGv3cqOuUMY7g/company-logo_200_200/B4EZmhegXHGcAM-/0/1759350753990/google_logo?e=1772668800&v=beta&t=sBOqGZcQ7BTqo7tu3FSRP8xRi-lDmnBhTkqLJjjawlM",
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
        "http://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdUIhQCTegyuo6ZuTmrG8m2Qt73AXaVN9z2w&s",
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
        "https://media.licdn.com/dms/image/v2/D560BAQEv67uGFge5Sw/company-logo_200_200/B56ZfEsEVpHoAM-/0/1751351576332/infosys_logo?e=1772668800&v=beta&t=7mPlhBjn7svON9z-OTw4bcWSRJ-idVkGH5VeXt7hZSY",
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
        "https://media.licdn.com/dms/image/v2/C560BAQHdAaarsO-eyA/company-logo_200_200/company-logo_200_200/0/1630637844948/apple_logo?e=1772668800&v=beta&t=84b-xSJ4sLYbQzhDM3BDb95mfFSZOypKfMmQMvHH0NA",
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
        "https://media.licdn.com/dms/image/v2/D560BAQGQd2ttfKKnew/company-logo_200_200/company-logo_200_200/0/1688947071810?e=1772668800&v=beta&t=lUSGMHg2I9nA1P9nAcjW0wvw2ZDwa73KwZT3xnR7T9k",
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
