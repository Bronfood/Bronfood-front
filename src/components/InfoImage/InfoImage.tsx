import { FC } from 'react';
import styles from './InfoImage.module.scss';

interface InfoImage {
    /**
     * Choose type of image
     */
    mode: 'red_tube' | 'without_tube' | 'stars_tube' | 'default_screen' | 'question_tube';
}

const InfoImage: FC<InfoImage> = (props) => {
    return <div className={`${styles['image-info']} ${styles[`image-info_${props.mode}`]}`}></div>;
};

export default InfoImage;
