import React from 'react';

const VideoPlayer = ({ video }) => {

    return (
        <div className='mt-4'>
            <video
                controls
                width="600"
                src={video ? `http://localhost:5000/video/${video}` : ''}
            />
        </div>
    );
};

export default VideoPlayer;
