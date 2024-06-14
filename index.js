const express = require('express');
const cloudinary = require('cloudinary').v2;
const upload = require('./multer-config');
const app = express();
require('dotenv').config();
const path = require('path');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Serve a simple HTML form for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Express route for image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert buffer to a readable stream and upload to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'folder_name' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }
        res.json({ imageUrl: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading image to Cloudinary' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
