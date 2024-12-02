const ffmpeg = require('fluent-ffmpeg');

function getVideoResolution(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);

            const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');
            if (!videoStream) return reject(new Error('No video stream found'));

            resolve({ width: videoStream.width, height: videoStream.height });
        });
    });
}

function resizeVideo(inputPath, outputPath, resolution) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .size(resolution)
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err))
            .run();
    });
}

module.exports = {
    resizeVideo,
    getVideoResolution,
};
