import express from 'express';
import upload from '../multerCloudinary.js';
import {
  getPrestasi,
  addPrestasi,
  updatePrestasi,
  deletePrestasi
} from '../controllers/prestasiController.js';

const router = express.Router();

router.get('/', getPrestasi);
router.post('/', upload.single('image'), addPrestasi);
router.put('/:id', upload.single('image'), updatePrestasi);
router.delete('/:id', deletePrestasi);

export default router;