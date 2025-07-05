import Prestasi from '../models/Prestasi.js';

// GET semua prestasi
export const getAllPrestasi = async (req, res) => {
  try {
    const prestasi = await Prestasi.find().sort({ createdAt: -1 });
    res.json(prestasi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET prestasi berdasarkan ID
export const getPrestasiById = async (req, res) => {
  try {
    const prestasi = await Prestasi.findById(req.params.id);
    if (!prestasi) {
      return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
    }
    res.json(prestasi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST prestasi baru
export const createPrestasi = async (req, res) => {
  try {
    const prestasiData = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.body.author
    };

    // Jika ada file gambar yang diupload
    if (req.file) {
      prestasiData.image = req.file.path;
    } else if (req.body.image) {
      // Jika menggunakan URL gambar
      prestasiData.image = req.body.image;
    }

    const prestasi = new Prestasi(prestasiData);
    const newPrestasi = await prestasi.save();
    res.status(201).json(newPrestasi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update prestasi
export const updatePrestasi = async (req, res) => {
  try {
    const prestasi = await Prestasi.findById(req.params.id);
    if (!prestasi) {
      return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
    }
    
    prestasi.title = req.body.title || prestasi.title;
    prestasi.description = req.body.description || prestasi.description;
    prestasi.content = req.body.content || prestasi.content;
    prestasi.author = req.body.author || prestasi.author;
    
    // Update gambar jika ada
    if (req.file) {
      prestasi.image = req.file.path;
    } else if (req.body.image) {
      prestasi.image = req.body.image;
    }
    
    const updatedPrestasi = await prestasi.save();
    res.json(updatedPrestasi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE prestasi
export const deletePrestasi = async (req, res) => {
  try {
    const prestasi = await Prestasi.findById(req.params.id);
    if (!prestasi) {
      return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
    }
    await prestasi.deleteOne();
    res.json({ message: 'Prestasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};