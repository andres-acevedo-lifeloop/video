
const basePath= 'http://localhost:5000/video';

export async function listVideos() {
  const response = await fetch(`${basePath}/list`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
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
  return {
    message: jsonResponse.message,
  };
}

export async function getVideoUrl(name,type) {
  const response = await fetch(`${basePath}/${type}/${name}`, {
    method: 'GET',
    headers: {
      'ngrok-skip-browser-warning': 'true'
    },
  });
  const jsonResponse = await response.json();
  return {
    message: jsonResponse.message,
    data: jsonResponse.data,
  };
}