const getImages = (name) => {
    return [
        {"name": name}
    ];
}

const getImageUrl = (imageId) => {
    return `https://dropki.blob.core.windows.net/books/${imageId}.png`;
}

export {getImages, getImageUrl}