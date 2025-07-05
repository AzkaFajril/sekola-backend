import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Cek apakah header Authorization ada
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    // Ambil token dari header
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token telah expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

export default auth; 