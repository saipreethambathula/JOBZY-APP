const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyUser, verifyAdmin } = require("../middleware/auth");

// ===================== GET ALL JOBS =====================
// Users & Admins can see jobs
router.get("/", verifyUser, (req, res) => {
  db.all("SELECT * FROM jobs ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// ===================== GET SINGLE JOB =====================
// Users & Admins can see a specific job by ID
router.get("/:id", verifyUser, (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM jobs WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!row) return res.status(404).json({ message: "Job not found" });

    res.json(row);
  });
});

// ===================== ADD JOB (ADMIN ONLY) =====================
router.post("/add", verifyAdmin, (req, res) => {
  const {
    title,
    company_name,
    job_role,
    icon,
    description,
    long_description,
    skills,
    package: pkg,
    applyLink,
  } = req.body;

  db.run(
    `INSERT INTO jobs 
     (title, company_name, job_role, icon, description, long_description, skills, package, applyLink)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      company_name,
      job_role,
      icon,
      description,
      long_description,
      skills,
      pkg,
      applyLink,
    ],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });

      res.json({
        message: "Job added successfully",
        jobId: this.lastID,
      });
    },
  );
});

// ===================== EDIT JOB (ADMIN ONLY) =====================
router.put("/edit/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const {
    title,
    company_name,
    job_role,
    icon,
    description,
    long_description,
    skills,
    package: pkg,
    applyLink,
  } = req.body;

  db.run(
    `UPDATE jobs SET
      title=?,
      company_name=?,
      job_role=?,
      icon=?,
      description=?,
      long_description=?,
      skills=?,
      package=?,
      applyLink=?
     WHERE id=?`,
    [
      title,
      company_name,
      job_role,
      icon,
      description,
      long_description,
      skills,
      pkg,
      applyLink,
      id,
    ],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      if (this.changes === 0)
        return res.status(404).json({ message: "Job not found" });

      res.json({ message: "Job updated successfully" });
    },
  );
});

// ===================== DELETE JOB (ADMIN ONLY) =====================
router.delete("/delete/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM jobs WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully" });
  });
});

module.exports = router;
