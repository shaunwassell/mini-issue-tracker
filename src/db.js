const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./issues.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM issues", (err, row) => {
    if (err) {
      console.error(err);
      return;
    }

    if (row.count === 0) {
      db.run(
        "INSERT INTO issues (title, description) VALUES (?, ?)",
        ["Welcome", "This is the first issue in the demo application."]
      );

      db.run(
        "INSERT INTO issues (title, description) VALUES (?, ?)",
        ["Security review", "Review this application for security problems."]
      );
    }
  });
});

module.exports = db;