import Prestasi from '../models/Prestasi.js';

// Ambil semua prestasi (terbaru di atas)
export const getPrestasi = async (req, res) => {
  try {
    const data = await Prestasi.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data prestasi' });
  }
};

// Tambah prestasi
export const addPrestasi = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    let image = req.body.image;
    if (req.file && req.file.path) {
      image = req.file.path; // URL Cloudinary
    }
    if (!title || !description || !content || !image) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }
    const prestasi = new Prestasi({ title, description, content, image });
    await prestasi.save();
    res.status(201).json({ message: 'Prestasi berhasil ditambahkan', prestasi });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah prestasi' });
  }
};

// Edit prestasi
export const updatePrestasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;
    let image = req.body.image;
    if (req.file && req.file.path) {
      image = req.file.path; // URL Cloudinary
    }
    const prestasi = await Prestasi.findByIdAndUpdate(
      id,
      { title, description, content, image },
      { new: true }
    );
    if (!prestasi) return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
    res.json({ message: 'Prestasi berhasil diupdate', prestasi });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update prestasi' });
  }
};

// Hapus prestasi
export const deletePrestasi = async (req, res) => {
  try {
    const { id } = req.params;
    const prestasi = await Prestasi.findByIdAndDelete(id);
    if (!prestasi) return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
    res.json({ message: 'Prestasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus prestasi' });
  }
};