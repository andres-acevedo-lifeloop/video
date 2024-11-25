import React, { useEffect, useRef } from 'react';
import { getVideoUrl } from '../api/video.api';

const VideoPlayer = ({ video }) => {

    const videoPlayer = useRef(null);

    useEffect(() => {
        if (!video.name) {
            return;
        }
        async function loadVideo() {
            const videoUrl = await getVideoUrl(video.name, video.type);
            console.log(videoUrl);
            videoPlayer.current.src = videoUrl.data;
        }
        loadVideo();
    }, [video]);


    return (
        <div className='mt-4'>
            <video
                ref={videoPlayer}
                controls
                width="600"
            />
        </div>
    );
};

export default VideoPlayer;
