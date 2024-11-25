const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

// Replace with your storage account name and SAS token
const accountName = 'lifeloopvideos';
const sasToken = 'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-01-01T01:01:11Z&st=2024-11-25T17:01:11Z&spr=https,http&sig=VAOp5O2K4aoKx6fZKwXR%2FvyVtBbsFFqvWlYk%2BbWfVTs%3D';
const containerName = 'videos';
const cdnUrl = 'videos-hdd6dtfcevb0eran.z02.azurefd.net'

// Create a BlobServiceClient
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);


async function uploadVideoToAzure(fileBuffer, fileName, mimeType) {

    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create a unique name for the blob
    const blobName = `${uuidv4()}-${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file
    try {
        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: { blobContentType: mimeType }
        });
        console.log(`Upload of ${blobName} successful`);
        return { message: 'File uploaded successfully.', blobName };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Error uploading file to Azure Blob Storage.');
    }
}

/**
 * Asynchronously lists all video blobs in the specified Azure Blob Storage container.
 *
 * @async
 * @function listVideos
 * @returns {Promise<string[]>} A promise that resolves to an array of blob names.
 */
async function listVideos() {
    let blobs = [];
    const containerClient = blobServiceClient.getContainerClient(containerName);

    for await (const blob of containerClient.listBlobsFlat()) {
        blobs.push(blob.name);
    }

    return blobs;
}

/**
 * Retrieves the URL of a video blob from Azure Blob Storage.
 *
 * @param {string} name - The name of the video blob.
 * @returns {Promise<string>} - A promise that resolves to the URL of the video blob.
 */
async function getVideoUrl(name, cdn = false){
    if(cdn){
        return `https://${cdnUrl}/${containerName}/${name}`;
    }
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(name);
    const url = blobClient.url;
    return url;
}

module.exports = {
    uploadVideoToAzure,
    listVideos,
    getVideoUrl
}