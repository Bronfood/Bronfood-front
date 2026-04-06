import { useEffect, useState } from 'react';
import styles from './Checkbox.module.scss';

type CheckboxProps = {
    /**
     * Initial state of the checkbox
     */
    initialState: boolean;
    /**
     * Text displayed on HTML element
     */
    text: string;
    /**
     * Fires when user checks checkbox
     */
    setValue: () => void;
    /**
     * Fires when user unchecks checkbox.
     */
    resetValue: () => void;
};

const Checkbox = (props: CheckboxProps) => {
    const [isActive, setIsActive] = useState(false);
    const handleChange = () => {
        if (isActive) {
            setIsActive(false);
            props.resetValue();
        } else {
            setIsActive(true);
            props.setValue();
        }
    };
    useEffect(() => setIsActive(props.initialState), [props.initialState]);

    return (
        <label className={`${styles['button-element']} ${isActive ? styles['button-element_active'] : ''}`}>
            <input className={styles['button-element_input']} type="checkbox" defaultChecked={false} onChange={handleChange} />
            <span className={`${styles['button-element_text']} ${isActive ? styles['button-element_text_active'] : ''}`}>{props.text}</span>
        </label>
    );
};

export default Checkbox;
