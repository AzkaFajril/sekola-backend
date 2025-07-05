import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import prestasiRoutes from './routes/prestasi.js';
import bannerRoutes from "./routes/banner.js";
import staffGuruRoutes from "./routes/StaffGuru.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portalberita';
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

let client;
let db;

async function connectDB() {
  if (!client || !client.topology?.isConnected()) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB);
  }
  return db;
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }

    const db = await connectDB();
    const users = db.collection("users");

    // Cek apakah username sudah ada
    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    await users.insertOne({ username, password: hashedPassword });

    return res.status(201).json({ message: "Register berhasil" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Gagal register", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 

app.use('/api/prestasi', prestasiRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/staff-guru", staffGuruRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export untuk Vercel
export default app;

// Hanya jalankan server jika file dijalankan langsung
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}