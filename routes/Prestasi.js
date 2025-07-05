import express from 'express';
import {
  getAllPrestasi,
  getPrestasiById,
  createPrestasi,
  updatePrestasi,
  deletePrestasi
} from '../controllers/prestasiController.js';
import auth from '../middlewares/auth.js';

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Konfigurasi storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portal-prestasi', // nama folder di Cloudinary
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', getAllPrestasi);
router.get('/:id', getPrestasiById);
router.post('/', auth, upload.single('image'), createPrestasi);
router.put('/:id', auth, upload.single('image'), updatePrestasi);
router.delete('/:id', auth, deletePrestasi);

export default router;