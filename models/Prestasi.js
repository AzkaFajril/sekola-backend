import mongoose from 'mongoose';

const prestasiSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    content: { type: String, required: false },
    image: String,
    author: String,
    level: String,
}, { timestamps: true });

export default mongoose.model('Prestasi', prestasiSchema);