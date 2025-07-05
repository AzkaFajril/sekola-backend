import StaffGuru from "../models/StaffGuru.js";

// Ambil semua guru & staff
export const getAllStaffGuru = async (req, res) => {
  try {
    const data = await StaffGuru.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tambah guru/staff
export const createStaffGuru = async (req, res) => {
  try {
    let foto = "";
    if (req.file && req.file.path) {
      foto = req.file.path; // URL dari Cloudinary
    }
    const { nama, jabatan } = req.body;
    const staffGuru = new StaffGuru({ nama, jabatan, foto });
    await staffGuru.save();
    res.status(201).json(staffGuru);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hapus guru/staff
export const deleteStaffGuru = async (req, res) => {
  try {
    await StaffGuru.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff/Guru berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update guru/staff
export const updateStaffGuru = async (req, res) => {
  try {
    let foto = req.body.foto;
    if (req.file && req.file.path) {
      foto = req.file.path;
    }
    const { nama, jabatan } = req.body;
    const updated = await StaffGuru.findByIdAndUpdate(
      req.params.id,
      { nama, jabatan, foto },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};