import React, { useRef, useState } from 'react';
import { uploadVideo } from '../api/video.api';

export default function VideoUpload({setNeedToLoadVideos}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const fileButton = useRef(null);

    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage('Please select a video file first.');
            return;
        }

        const formData = new FormData();
        formData.append('video', selectedFile);

        try {
            const response = await uploadVideo(formData);
            setUploadMessage(response.message);
            setSelectedFile(null);
            setNeedToLoadVideos(true);
        } catch (error) {
            console.error(error);
            setUploadMessage('Video upload failed.');
        }
        setTimeout(() => setUploadMessage(''), 3000);

    };

    return (
        <div className='flex mt-8 flex-col w-[600px] gap-2'>
            <div className='flex justify-between w-full'>
                <input hidden type="file" accept="video/*" onChange={handleFileChange} ref={fileButton} />
                <button className='bg-slate-400 text-white px-4 rounded-md h-8 font-semibold'
                    onClick={() => fileButton.current.click()}
                >Select</button>
                {uploadMessage && <p>{uploadMessage}</p>}
                <button onClick={handleUpload} className='bg-slate-400 text-white px-4 rounded-md h-8 font-semibold'>Upload</button>
            </div>
            <div className='mt-4 bg-slate-200 px-4 rounded-md'>
                {selectedFile && <>
                    <span className='font-semibold'>Selected file:</span> <span>{selectedFile.name}</span>
                </>}
            </div>
        </div>
    );
};
