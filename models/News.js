import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('News', newsSchema); 