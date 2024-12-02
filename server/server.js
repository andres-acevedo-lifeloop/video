const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
const { uploadVideoToAzure, listVideos, getVideoUrl } = require('./controllers/azure.controller');
const multer = require('multer');
const { resizeVideo, getVideoResolution } = require('./controllers/ffmpeg.controller');
const path = require('path');
const fs = require('fs');

app.use(cors());

const baseUrl = '/video';

const fileSizeLimit = 100;

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        // Use the original file name
        const originalName = file.originalname;
        cb(null, originalName);
    },
});

const upload = multer({
    limits: { fileSize: fileSizeLimit * 1024 * 1024 }, 
    storage,
});

const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir);
}

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
app.post(`${baseUrl}/upload`, upload.single('video'), async (req, res) => {
    const { file } = req; // Uploaded video

    try {

        //Upload the original video to Azure
        await uploadVideoToAzure(file.path, `${file.fieldname}-original.mp4`, file.mimetype)

        // Resize the video and upload 720p
        let outputFilePath = path.join(videosDir, `${file.fieldname}-720p.mp4`);
        await resizeVideo(file.path, outputFilePath, '1280x720');
        await uploadVideoToAzure(outputFilePath, `${file.fieldname}-720p.mp4`, file.mimetype)

        // Resize the video and upload 480p
        outputFilePath = path.join(videosDir, `${file.fieldname}-480p.mp4`);
        await resizeVideo(file.path, outputFilePath, '854x480');
        await uploadVideoToAzure(outputFilePath, `${file.fieldname}-480p.mp4`, file.mimetype)

        res.json({ message: 'Video resized successfully'});
    } catch (err) {
        console.error('Error processing video:', err);
        res.status(500).send('Error resizing video');
    } finally {
        // Clean up the uploaded file
        fs.unlinkSync(file.path);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});