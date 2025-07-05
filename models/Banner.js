import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  imageUrl: String,
});

export default mongoose.model("Banner", bannerSchema); 