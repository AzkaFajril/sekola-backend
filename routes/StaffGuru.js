import express from "express";
import { getAllStaffGuru, getStaffGuruById, createStaffGuru, updateStaffGuru, deleteStaffGuru } from "../controllers/staffGuruController.js";
import upload from "../multerCloudinary.js"; // jika pakai upload foto

const router = express.Router();

router.get("/", getAllStaffGuru);
router.get("/:id", getStaffGuruById);
router.post("/", upload.single("foto"), createStaffGuru);
router.put("/:id", upload.single("foto"), updateStaffGuru);
router.delete("/:id", deleteStaffGuru);

export default router;