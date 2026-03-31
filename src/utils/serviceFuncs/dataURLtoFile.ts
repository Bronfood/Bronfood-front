export const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const uint8arr = new Uint8Array(n);
    while (n--) {
        uint8arr[n] = bstr.charCodeAt(n);
    }
    return new File([uint8arr], filename, { type: mime });
};
