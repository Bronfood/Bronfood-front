import styles from './Chip.module.scss';

type ChipProps = {
    /**
     * Text displayed on HTML element
     */
    text: string;
    /**
     * Determines whether chip is selected by user
     */
    isActive: boolean;
    /**
     * Fires when user clicks on meal's type. Sets type selected
     */
    add: () => void;
    /**
     * Fires when user clicks on meal's type. Sets type deselected
     */
    delete: () => void;
};

const Chip = (props: ChipProps) => {
    const handleChange = () => {
        if (props.isActive) {
            props.delete();
        } else {
            props.add();
        }
    };
    return (
        <label className={`${styles['chip-with-icon']} ${props.isActive ? styles['chip-with-icon_active'] : ''}`}>
            <input className={`${styles['chip-with-icon_input']}`} type="checkbox" defaultChecked={false} onChange={handleChange} />
            <span className={`${styles['chip-with-icon_text']} ${props.isActive ? styles['chip-with-icon_text_active'] : ''}`}>{props.text}</span>
        </label>
    );
};

export default Chip;
