const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// INTENTIONALLY VULNERABLE:
// Fake secret included for secret-scanning demonstrations.
// This is not a real credential.
const DEMO_API_KEY = "ghp_1234567890abcdefghijklmnopqrstuvwxyz";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

/*
 * List issues
 */
app.get("/api/issues", (req, res) => {
  db.all("SELECT * FROM issues ORDER BY id DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

/*
 * Create an issue
 */
app.post("/api/issues", (req, res) => {
  const { title, description } = req.body;

  db.run(
    "INSERT INTO issues (title, description) VALUES (?, ?)",
    [title, description],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        title,
        description
      });
    }
  );
});

/*
 * INTENTIONALLY VULNERABLE: SQL Injection
 *
 * Example:
 * /api/issues/search?q=Security
 */
app.get("/api/issues/search", (req, res) => {
  const query = req.query.q || "";

  const sql =
    `SELECT * FROM issues WHERE title LIKE '%${query}%'`;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

/*
 * INTENTIONALLY VULNERABLE: Command Injection
 *
 * Example:
 * /api/ping?host=localhost
 *
 * Keep this endpoint inside a disposable/local training
 * environment only.
 */
app.get("/api/ping", (req, res) => {
  const host = req.query.host || "localhost";

  exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(stderr);
    }

    res.type("text/plain").send(stdout);
  });
});

/*
 * INTENTIONALLY VULNERABLE: Path Traversal
 *
 * Example:
 * /api/files?name=demo.txt
 */
app.get("/api/files", (req, res) => {
  const filename = req.query.name;

  if (!filename) {
    return res.status(400).send("Missing filename");
  }

  const filePath = path.join(__dirname, "../files", filename);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).send("File not found");
    }

    res.type("text/plain").send(data);
  });
});

/*
 * INTENTIONALLY VULNERABLE: Reflected XSS
 *
 * The supplied name is inserted directly into HTML.
 */
app.get("/hello", (req, res) => {
  const name = req.query.name || "student";

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hello</title>
      </head>
      <body>
        <h1>Hello ${name}</h1>
        <p><a href="/">Back to issues</a></p>
      </body>
    </html>
  `);
});

/*
 * Endpoint exposing whether our fake demo secret exists.
 * We don't return the secret itself.
 */
app.get("/api/config", (req, res) => {
  res.json({
    apiConfigured: Boolean(DEMO_API_KEY)
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`mini-issue-tracker demo app running on http://localhost:${PORT} !!!!`);
  });
}

module.exports = app;
