import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './Checkbox.module.scss';

type CheckboxProps = {
    /**
     * Initial state of the checkbox
     */
    initialState: boolean;
    /**
     * Setter for initial state
     */
    setInitialState: Dispatch<SetStateAction<boolean>>;
    /**
     * Text displayed on HTML element
     */
    text: string;
    /**
     * Is checkbox disabled
     */
    disabled?: boolean;
    /**
     * Fires when user checks checkbox
     */
    setValue: () => void;
    /**
     * Fires when user unchecks checkbox
     */
    resetValue: () => void;
};

const Checkbox = (props: CheckboxProps) => {
    const [isActive, setIsActive] = useState(false);
    const handleChange = () => {
        if (isActive) {
            setIsActive(false);
            props.setInitialState(false);
            props.resetValue();
        } else {
            setIsActive(true);
            props.setInitialState(true);
            props.setValue();
        }
    };
    useEffect(() => {
        setIsActive(props.initialState);
        console.log(props.initialState);
    }, [props.initialState]);

    return (
        <label className={styles['checkbox']}>
            <input className={styles['checkbox_input']} type="checkbox" defaultChecked={false} onChange={handleChange} disabled={props.disabled} />
            <span className={styles['checkbox_text']}>{props.text}</span>
            <div className={`${styles['checkbox_icon']} ${isActive ? styles['checkbox_icon_active'] : ''}`}></div>
        </label>
    );
};

export default Checkbox;
