import express from "express";
import { getAllBanners, createBanner, deleteBanner, updateBanner } from "../controllers/bannerController.js";
import upload from "../multerCloudinary.js";

const router = express.Router();

router.get("/", getAllBanners);
router.post("/", upload.single("image"), createBanner);
router.delete("/:id", deleteBanner);
router.put("/:id", upload.single("image"), updateBanner);

export default router; 