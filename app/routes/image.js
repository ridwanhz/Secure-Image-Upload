const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../middleware/authMiddleware');
const imageController = require('../controllers/imageController');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only .jpg and .png files allowed'));
    }
    cb(null, true);
  }
});

router.post('/upload', authenticate, upload.single('image'), imageController.uploadImage);
router.get('/gallery', authenticate, imageController.getGallery);
router.get('/view/:id', authenticate, imageController.viewImage);
router.delete('/delete/:id', authenticate, imageController.deleteImage);


module.exports = router;
