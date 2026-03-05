import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("glowkin.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client'
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    pro_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    scheduled_at TEXT NOT NULL,
    total_price INTEGER NOT NULL,
    FOREIGN KEY (client_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Auth - In a real app, use OTP service
  app.post("/api/auth/login", (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });
    
    let user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
    if (!user) {
      const id = Math.random().toString(36).substr(2, 9);
      db.prepare("INSERT INTO users (id, phone, full_name, role) VALUES (?, ?, ?, ?)").run(id, phone, "Utilisateur GlowKin", "client");
      user = { id, phone, full_name: "Utilisateur GlowKin", role: "client" };
    }
    res.json(user);
  });

  app.get("/api/bookings/:userId", (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings WHERE client_id = ?").all(req.params.userId);
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { client_id, pro_id, service_name, scheduled_at, total_price } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    db.prepare("INSERT INTO bookings (id, client_id, pro_id, service_name, scheduled_at, total_price) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, client_id, pro_id, service_name, scheduled_at, total_price);
    res.json({ success: true, id });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GlowKin Server running on http://localhost:${PORT}`);
  });
}

startServer();
