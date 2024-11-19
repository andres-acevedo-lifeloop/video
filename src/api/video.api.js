
const basePath= 'http://localhost:5000/video';

export async function listVideos() {
  const response = await fetch(`${basePath}/list`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const jsonResponse = await response.json();
  return {
    message: jsonResponse.message,
    data: jsonResponse.data,
  };
}

export async function uploadVideo(formData) {
  const response = await fetch(`${basePath}/upload`, {
    method: 'POST',
    body: formData,
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  return {
    message: jsonResponse.message,
  };
}

export async function getVideoChunk(name, start, end) {
  const response = await fetch(`${basePath}/${name}`, {
    method: 'GET',
    headers: {
      'Range': `bytes=${start}-${end}`,
    },
  });
  return response;
}