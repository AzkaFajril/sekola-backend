export const createNews = async (req, res) => {
    try {
      const { title, content } = req.body;
      let image = req.body.image; // untuk URL manual
      if (req.file && req.file.path) {
        image = req.file.path; // URL Cloudinary
      }
      const news = new News({ title, content, image });
      await news.save();
      res.status(201).json(news);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };