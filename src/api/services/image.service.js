const modifyImageURI = (uri, attributes) => {
    const url = new URL(uri);
    const pathSegments = url.pathname.split('/');

    // Find the "upload" segment in the path and insert the attributes after it
    const uploadIndex = pathSegments.findIndex(segment => segment === 'upload');
    if (uploadIndex !== -1) {
        const attributesSegment = attributes.join(',');
        pathSegments.splice(uploadIndex + 1, 0, attributesSegment);
        url.pathname = pathSegments.join('/');
    }

    // Return the modified URI
    return url.href;
}

const ImageService = {
    modifyImageURI
}

export default ImageService