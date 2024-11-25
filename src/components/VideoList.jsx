import React from 'react';

export default function VideoList({videos, setSelectedVideo}) {

    const truncateString = (str, num) => {
        if (str.length > num) {
            return str.slice(0, num) + '...';
        } else {
            return str;
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl">Video List</h2>
            {videos.map(video =>(
                <div key={video} className="flex items-center justify-between w-[600px] mt-4">
                    <p>{truncateString(video, 10)}</p>
                    <div>
                        <button className="bg-slate-400 text-white px-4 rounded-md h-8 font-semibold mr-4 hover:bg-slate-500" 
                        onClick={()=> setSelectedVideo({
                            name: video,
                            type: 'blob'
                        })}>Play from blob</button>
                        
                        <button className="bg-slate-400 text-white px-4 rounded-md h-8 font-semibold hover:bg-slate-500" 
                        onClick={()=> setSelectedVideo({
                            name: video,
                            type: 'cdn'
                        })}>Play from cdn</button>
                    </div>
                </div>
            ))}
        </div>
    )
}