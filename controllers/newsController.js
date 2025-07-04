import News from '../models/News.js';

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Berita tidak ditemukan' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    let image = req.body.image; // untuk URL manual
    if (req.file && req.file.path) {
      image = req.file.path; // URL Cloudinary
    }
    const news = new News({ title, description, content, image });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    let image = req.body.image;
    if (req.file && req.file.path) {
      image = req.file.path;
    }
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { title, description, content, image },
      { new: true }
    );
    if (!news) return res.status(404).json({ message: 'Berita tidak ditemukan' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: 'Berita tidak ditemukan' });
    res.json({ message: 'Berita dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 