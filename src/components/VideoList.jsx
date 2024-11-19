import React from 'react';

export default function VideoList({videos, setSelectedVideo}) {

    return (
        <div className="mt-8">
            <h2 className="text-2xl">Video List</h2>
            {videos.map(video =>(
                <div key={video} className="flex items-center justify-between w-[600px] mt-4">
                    <p>{video}</p>
                    <button className="bg-slate-400 text-white px-4 rounded-md h-8 font-semibold" 
                    onClick={()=> setSelectedVideo(video)}>Play</button>
                </div>
            ))}
        </div>
    )
}