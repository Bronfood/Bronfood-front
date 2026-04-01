import styles from './CarouselChip.module.scss';

type CarouselChipProps = {
    /**
     * Text displayed on HTML element
     */
    text: string;
    /**
     * Determines whether chip is selected by user
     */
    isActive: boolean;
    /**
     * Fires when user clicks on deselected chip.
     */
    select: () => void;
    /**
     * Fires when user clicks on selected chip.
     */
    deselect: () => void;
};

const CarouselChip = (props: CarouselChipProps) => {
    const handleChange = () => {
        if (props.isActive) {
            props.deselect();
        } else {
            props.select();
        }
    };
    return (
        <label className={`${styles['chip']} ${props.isActive ? styles['chip_active'] : ''}`}>
            <input className={`${styles['chip__input']}`} type="checkbox" defaultChecked={false} onChange={handleChange} />
            <span className={`${styles['chip__text']} ${props.isActive ? styles['chip__text_active'] : ''}`}>{props.text}</span>
        </label>
    );
};

export default CarouselChip;
