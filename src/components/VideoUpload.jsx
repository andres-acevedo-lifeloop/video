import React, { useRef, useState } from 'react';
import { uploadVideo } from '../api/video.api';

const fileSizeLimit = 10;

export default function VideoUpload({setNeedToLoadVideos, setLoading, loading}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const fileButton = useRef(null);

    const handleFileChange = (event) => {

        const file = event.target.files[0];

        if (event.target.files.length > 1) {
            setUploadMessage('Please upload only one file.');
            event.target.value = ''; // Clear the input
            return;
        }

        if (file.size > fileSizeLimit * 1024 * 1024) { // 10 MB in bytes
            setUploadMessage(`File size exceeds  ${fileSizeLimit} MB.`);
            event.target.value = ''; // Clear the input
            return;
        }
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage('Please select a video file first.');
            return;
        }

        setLoading(true);
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
        setLoading(false);

        setTimeout(() => setUploadMessage(''), 2000);

    };

    return (
        <div className='flex mt-8 flex-col w-[600px] gap-2'>
            <div className='flex justify-between w-full'>
                <input hidden type="file" accept="video/*" onChange={handleFileChange} ref={fileButton}  />
                <button className='bg-slate-400 text-white px-4 rounded-md h-8 font-semibold hover:bg-slate-500'
                    onClick={() => fileButton.current.click()}
                >Select</button>
                {uploadMessage && <p>{uploadMessage}</p>}
                <button onClick={() => handleUpload()} className='bg-slate-400 text-white px-4 rounded-md h-8 font-semibold hover:bg-slate-500'>Upload</button>
            </div>
            <div className='mt-4 bg-slate-200 px-4 rounded-md '>
                {selectedFile && <>
                    <span className='font-semibold'>Selected file:</span> <span>{selectedFile.name}</span>
                </>}
            </div>
        </div>
    );
};

