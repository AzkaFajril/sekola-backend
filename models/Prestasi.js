import mongoose from 'mongoose';

const prestasiSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    content: String,
    image: String,
    author: String,
    level: String,
}, { timestamps: true });

export default mongoose.model('Prestasi', prestasiSchema);