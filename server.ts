import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("kudimed.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT, -- 'admin', 'doctor', 'patient', 'pharmacist'
    wallet_balance REAL DEFAULT 0.0
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT,
    doctor_id TEXT,
    specialty TEXT,
    date TEXT,
    status TEXT, -- 'scheduled', 'completed', 'cancelled'
    FOREIGN KEY(patient_id) REFERENCES users(id),
    FOREIGN KEY(doctor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT,
    doctor_id TEXT,
    content TEXT,
    date TEXT,
    FOREIGN KEY(patient_id) REFERENCES users(id),
    FOREIGN KEY(doctor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    pharmacy_name TEXT,
    lat REAL,
    lng REAL
  );
`);

// Seed data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (id, name, email, role, wallet_balance) VALUES (?, ?, ?, ?, ?)").run(
    "p1", "João Silva", "joao@example.com", "patient", 25000.0
  );
  db.prepare("INSERT INTO users (id, name, email, role, wallet_balance) VALUES (?, ?, ?, ?, ?)").run(
    "d1", "Dra. Ana Paula", "ana@kudimed.ao", "doctor", 0.0
  );
  db.prepare("INSERT INTO users (id, name, email, role, wallet_balance) VALUES (?, ?, ?, ?, ?)").run(
    "f1", "Farmácia Central", "central@farmacia.ao", "pharmacist", 0.0
  );

  db.prepare("INSERT INTO medications (name, price, pharmacy_name, lat, lng) VALUES (?, ?, ?, ?, ?)").run(
    "Paracetamol 500mg", 1200.0, "Farmácia Prenda", -8.8383, 13.2344
  );
  db.prepare("INSERT INTO medications (name, price, pharmacy_name, lat, lng) VALUES (?, ?, ?, ?, ?)").run(
    "Amoxicilina 1g", 4500.0, "Farmácia Talatona", -8.9167, 13.1833
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/me", (req, res) => {
    // Mocking auth - usually you'd get this from a session/token
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get("p1");
    res.json(user);
  });

  app.get("/api/appointments", (req, res) => {
    const { userId, role } = req.query;
    let appointments;
    if (role === 'doctor') {
      appointments = db.prepare(`
        SELECT a.*, u.name as patient_name 
        FROM appointments a 
        JOIN users u ON a.patient_id = u.id 
        WHERE a.doctor_id = ?
      `).all(userId);
    } else {
      appointments = db.prepare(`
        SELECT a.*, u.name as doctor_name 
        FROM appointments a 
        JOIN users u ON a.doctor_id = u.id 
        WHERE a.patient_id = ?
      `).all(userId);
    }
    res.json(appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const { patientId, doctorId, specialty, date } = req.body;
    const info = db.prepare("INSERT INTO appointments (patient_id, doctor_id, specialty, date, status) VALUES (?, ?, ?, ?, ?)").run(
      patientId, doctorId, specialty, date, 'scheduled'
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/medications", (req, res) => {
    const meds = db.prepare("SELECT * FROM medications").all();
    res.json(meds);
  });

  app.get("/api/prescriptions", (req, res) => {
    const { userId } = req.query;
    const prescriptions = db.prepare(`
      SELECT p.*, u.name as doctor_name 
      FROM prescriptions p 
      JOIN users u ON p.doctor_id = u.id 
      WHERE p.patient_id = ?
    `).all(userId);
    res.json(prescriptions);
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
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KudiMed Server running on http://localhost:${PORT}`);
  });
}

startServer();
