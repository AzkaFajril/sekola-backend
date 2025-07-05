import mongoose from "mongoose";

const staffGuruSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jabatan: { type: String, required: true },
  foto: { type: String },
});

export default mongoose.model("StaffGuru", staffGuruSchema); 