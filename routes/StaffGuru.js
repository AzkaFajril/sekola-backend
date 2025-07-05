import express from "express";
import { getAllStaffGuru, createStaffGuru, deleteStaffGuru, updateStaffGuru } from "../controllers/staffGuruController.js";
import upload from "../multerCloudinary.js"; // jika pakai upload foto

const router = express.Router();

router.get("/", getAllStaffGuru);
router.post("/", upload.single("foto"), createStaffGuru);
router.delete("/:id", deleteStaffGuru);
router.put("/:id", upload.single("foto"), updateStaffGuru);

export default router;