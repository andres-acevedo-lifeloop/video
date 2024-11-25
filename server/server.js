const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
const { uploadVideoToAzure, listVideos, getVideoUrl } = require('./controllers/azure.controller');
const multer = require('multer');

app.use(cors());

const baseUrl = '/video';

const fileSizeLimit = 10;
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: fileSizeLimit * 1024 * 1024 } 
});

app.get(`${baseUrl}/list`, (req, res) => {
    listVideos().then((videos) => {
        res.status(200).json({data: videos, message: 'Videos retrieved successfully'});
    }).catch((err) => {
        res.status(500).json({message: 'Error listing videos'});
    });
});

app.get(`${baseUrl}/blob/:name`, (req, res) => {
    const { name } = req.params;
    getVideoUrl(name).then((url) => {
        res.status(200).json({
            data: url,
            message: 'Video URL retrieved successfully'
        });
    });
});

app.get(`${baseUrl}/cdn/:name`, (req, res) => {
    const { name } = req.params;
    getVideoUrl(name, true).then((url) => {
        res.status(200).json({
            data: url,
            message: 'Video URL retrieved successfully'
        });
    });
});

// Endpoint for uploading a video
app.post(`${baseUrl}/upload`, (req, res) => {
    upload.single('video')(req, res, async (err) => {
        if (err && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: `File size exceeds ${fileSizeLimit} MB.` });
        } else if (err) {
            return res.status(500).json({
                message: 'Video upload failed'
            });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        
        try { 
            uploadVideoToAzure(req.file.buffer, req.file.originalname, req.file.mimetype).then(() => {
                res.status(200).json({message: 'Video uploaded successfully'});
            });
        } catch (error) {
            return res.status(500).json({message: 'Video upload failed'});
        }
    });


});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});