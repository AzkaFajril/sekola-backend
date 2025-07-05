import StaffGuru from "../models/StaffGuru.js";

// Get all staff guru
export const getAllStaffGuru = async (req, res) => {
  try {
    const staffGuru = await StaffGuru.find();
    res.status(200).json(staffGuru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff guru by ID
export const getStaffGuruById = async (req, res) => {
  try {
    const staffGuru = await StaffGuru.findById(req.params.id);
    if (!staffGuru) {
      return res.status(404).json({ message: "Staff guru not found" });
    }
    res.status(200).json(staffGuru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new staff guru
export const createStaffGuru = async (req, res) => {
  try {
    const staffGuruData = {
      ...req.body,
      foto: req.file ? req.file.path : null
    };
    
    const newStaffGuru = new StaffGuru(staffGuruData);
    const savedStaffGuru = await newStaffGuru.save();
    
    res.status(201).json(savedStaffGuru);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update staff guru
export const updateStaffGuru = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.foto = req.file.path;
    }
    
    const updatedStaffGuru = await StaffGuru.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedStaffGuru) {
      return res.status(404).json({ message: "Staff guru not found" });
    }
    
    res.status(200).json(updatedStaffGuru);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete staff guru
export const deleteStaffGuru = async (req, res) => {
  try {
    const deletedStaffGuru = await StaffGuru.findByIdAndDelete(req.params.id);
    
    if (!deletedStaffGuru) {
      return res.status(404).json({ message: "Staff guru not found" });
    }
    
    res.status(200).json({ message: "Staff guru deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};