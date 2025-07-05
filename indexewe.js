import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import prestasiRoutes from './routes/prestasi.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/prestasi', prestasiRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});