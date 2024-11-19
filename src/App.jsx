import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import VideoUpload from './components/VideoUpload';
import VideoList from './components/VideoList';
import {listVideos} from './api/video.api';

import './App.css';

function App() {

    const [videos, setVideos] = React.useState([]);
    const [needToLoadVideos, setNeedToLoadVideos] = React.useState(true);
    const [selectedVideo, setSelectedVideo] = React.useState(null);

    React.useEffect(() => {
        const loadVideos = async () => {
            const response = await listVideos();
            setVideos(response.data)
            setNeedToLoadVideos(false);
        };
        loadVideos();
    }, [needToLoadVideos]);


    return (
        <div className="w-100 flex items-center flex-col mt-4">
            <h1 className='text-4xl'>Video Streaming and Upload App</h1>
            <VideoPlayer video={selectedVideo} />
            <VideoUpload setNeedToLoadVideos={setNeedToLoadVideos} />
            {videos && videos.length > 0 && <VideoList videos={videos} setSelectedVideo={setSelectedVideo} />}
        </div>
    );
}

export default App;
