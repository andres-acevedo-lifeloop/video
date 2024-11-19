const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const cors = require('cors');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'videos'); // Save uploaded videos in the 'videos' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Date now for unique names
    }
});

const upload = multer({ storage });

app.use(cors());

const baseUrl = '/video';

// Get list of videos
app.get(`${baseUrl}/list`, (req, res) => {
    const videoPath = path.join(__dirname, '../videos');
    const videos = fs.readdirSync(videoPath);
    res.status(200).json({
        message: 'Videos retrieved successfully!',
        data: videos,
    });
});

app.get(`${baseUrl}/:id`, (req, res) => {
    const range = req.headers.range;
    if (!range) {
        return res.status(400).send('Range header required');
    }

    const videoPath = path.resolve(__dirname, '../videos', req.params.id);

    let videoSize;
    try {
        videoSize = fs.statSync(videoPath).size;
    } catch (err) {
        console.error(`Error accessing video file: ${err.message}`);
        return res.status(404).send('Video file not found');
    }

    // Parse range
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? Math.min(parseInt(parts[1], 10), videoSize - 1) : videoSize - 1;

    if (start >= videoSize || end >= videoSize || start > end) {
        return res.status(416).send(`Requested range not satisfiable. Available range: 0-${videoSize - 1}`);
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const head = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/*',
        'Access-Control-Allow-Origin': '*', // Adjust for production
    };

    console.log(`Serving range ${start}-${end} for video: ${req.params.id}`);

    res.writeHead(206, head);
    file.pipe(res);
});

// Endpoint for uploading a video
app.post(`${baseUrl}/upload`, upload.single('video'), (req, res) => {
    if (req.file) {
        res.status(200).json({ message: 'Video uploaded successfully!' });
    } else {
        res.status(400).json({ message: 'Video upload failed.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});