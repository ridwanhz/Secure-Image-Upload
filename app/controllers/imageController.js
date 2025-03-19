const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Image = require('../models/Image');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

function encryptFile(inputPath, outputPath) {
    if (ENCRYPTION_KEY.length !== 32) {
        throw new Error('Encryption key must be 32 characters');
      }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);
  output.write(iv);
  input.pipe(cipher).pipe(output);

  return new Promise((resolve, reject) => {
    output.on('finish', () => resolve(iv.toString('hex')));
    output.on('error', reject);
  });
}

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const tempPath = req.file.path;
    const encryptedFilename = Date.now() + '-' + req.file.originalname + '.enc';
    const encryptedPath = path.join('encrypted', encryptedFilename);

    await encryptFile(tempPath, encryptedPath);
    fs.unlinkSync(tempPath);  // hapus file temp

    await Image.create({
      filename: encryptedFilename,
      path: encryptedPath,
      userId: req.user.id,
      mimetype: req.file.mimetype
    });

    res.json({ message: 'Image uploaded & encrypted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};

exports.getGallery = async (req, res) => {
    try {
      const images = await Image.findAll({
        where: { userId: req.user.id },
        attributes: ['id', 'filename']
      });
      res.json({ images });
    } catch (err) {
      res.status(500).json({ error: 'Failed to load gallery', details: err.message });
    }
};

exports.viewImage = async (req, res) => {
    try {
      const image = await Image.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });
  
      if (!image) return res.status(404).json({ error: 'Image not found' });
  
      const encryptedPath = image.path;
      const input = fs.createReadStream(encryptedPath);
  
      const ivBuffer = Buffer.alloc(IV_LENGTH);
      const fd = fs.openSync(encryptedPath, 'r');
      fs.readSync(fd, ivBuffer, 0, IV_LENGTH, 0);
      fs.closeSync(fd);
  
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), ivBuffer);
  
      const encryptedStream = fs.createReadStream(encryptedPath, { start: IV_LENGTH });
      res.setHeader('Content-Type', image.mimetype);
  
      encryptedStream.pipe(decipher).pipe(res);
    } catch (err) {
      res.status(500).json({ error: 'Failed to view image', details: err.message });
    }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findOne({
      where: { id: Number(req.params.id), userId: Number(req.user.id) }
    });

    if (!image) {
      console.log('Image not found in DB');
      return res.status(404).json({ error: 'Image not found' });
    }

    if (fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    }

    await image.destroy();
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Delete failed:', err.message);
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};




  
  
  
  
