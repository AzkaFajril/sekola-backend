import Banner from "../models/Banner.js";

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Banner tidak ditemukan" });
    }
    res.json({ message: "Banner berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file && req.file.path) {
      imageUrl = req.file.path; // URL dari Cloudinary
    }
    const { title, description } = req.body;
    const banner = new Banner({ title, description, imageUrl });
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    let updateData = {};
    if (req.file && req.file.path) {
      updateData.imageUrl = req.file.path;
    }
    // Jika ada title/description di body, tambahkan juga
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;

    const updated = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Banner tidak ditemukan" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 