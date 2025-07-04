// create-admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const MONGO_URI = 'mongodb+srv://azka0012:azka0012@cluster0.lwbtjeg.mongodb.net/test'; // Ganti jika perlu

const username = '3123';      // Ganti username sesuai keinginan
const password = '3123';   // Ganti password sesuai keinginan

async function createAdmin() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();
  console.log('Admin user created:', username);
  mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error('Error creating admin:', err.message);
  mongoose.disconnect();
});