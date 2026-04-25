import { FC, useState } from 'react';
import styles from './ImageCropPopup.module.scss';
import { cropImage } from '../../../utils/serviceFuncs/cropImage';
import Button from '../../Button/Button';
import { useTranslation } from 'react-i18next';
import { CropParams } from '../../../utils/consts';

interface ImageCropPopup {
    src: string;
    targetWidth: number;
    targetHeight: number;
    initialParams?: CropParams;
    onSave: (croppedDataUrl: string, params: CropParams) => void;
    onClose: () => void;
}

const ImageCropPopup: FC<ImageCropPopup> = (props) => {
    const { t } = useTranslation();
    const [scale, setScale] = useState(props.initialParams?.scale ?? 1);
    const [posX, setPosX] = useState(props.initialParams?.posX ?? 50);
    const [posY, setPosY] = useState(props.initialParams?.posY ?? 50);

    const handleApply = async () => {
        const params: CropParams = { scale, posX, posY };
        const cropped = await cropImage(props.src, scale, posX, posY, props.targetWidth, props.targetHeight);
        props.onSave(cropped, params);
    };

    return (
        <div className={styles.popup_overlay}>
            <div className={styles.popup}>
                <button className={styles.popup__close} type="button" onClick={props.onClose}></button>
                <h2 className={styles.popup__title}>{t('components.inputImage.selectArea')}</h2>
                <div className={styles.popup__content}>
                    <div className={styles.popup__content_image} style={{ backgroundImage: `url(${props.src})`, backgroundSize: `${scale * 100}%`, backgroundPosition: `${posX}% ${posY}%`, width: props.targetWidth, height: props.targetHeight }}></div>
                </div>
                <div className={styles.popup__controls}>
                    <div>
                        <label className={styles.popup__controls_label}>{t('components.inputImage.scale')}</label>
                        <span className={styles.popup__controls_info}>{Math.round(scale * 100)}%</span>
                        <input type="range" min="1" max="2" step="0.01" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
                    </div>
                    <div>
                        <label className={styles.popup__controls_label}>{t('components.inputImage.verticalPosition')}</label>
                        <span className={styles.popup__controls_info}>{posY}%</span>
                        <input type="range" min="0" max="100" step="1" value={posY} onChange={(e) => setPosY(parseFloat(e.target.value))} />
                    </div>
                    <div>
                        <label className={styles.popup__controls_label}>{t('components.inputImage.horizontalPosition')}</label>
                        <span className={styles.popup__controls_info}>{posX}%</span>
                        <input type="range" min="0" max="100" step="1" value={posX} onChange={(e) => setPosX(parseFloat(e.target.value))} />
                    </div>
                </div>
                <div className={styles.popup__button}>
                    <Button type="button" onClick={handleApply}>
                        {t('components.inputImage.save')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropPopup;
