export const cropImage = (src: string, scale: number, posX: number, posY: number, targetWidth: number, targetHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const dpr = Math.min(img.width / targetWidth, img.height / targetHeight);
            const drawWidth = targetWidth * scale;
            const drawHeight = img.height * (drawWidth / img.width);
            const drawX = (targetWidth - drawWidth) * (posX / 100);
            const drawY = (targetHeight - drawHeight) * (posY / 100);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject('Нет контекста canvas');
                return;
            }

            canvas.width = targetWidth * dpr;
            canvas.height = targetHeight * dpr;

            ctx.scale(dpr, dpr);

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject('Ошибка загрузки изображения');
        img.src = src;
    });
};
