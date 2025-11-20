import { FC } from 'react';
import styles from './LocalInput.module.scss';
import { useId } from 'react';

interface LocalInputProps {
    /**
     * HTML type for the input
     */
    type: string;
    /**
     * Title for input
     */
    nameLabel: string;
    /**
     * Placeholder for input
     */
    placeholder: string;
    /**
     * Current value
     */
    value: string | number;
    /**
     * Name attribute for the input
     */
    name: string;
    /**
     * Change handler
     */
    onChange: (value: string) => void;
    /**
     * Optional error message
     */
    error?: string;
    /**
     * Optional delete button
     */
    delete?: boolean;
    /**
     * Optional onClick delete button
     */
    onClick?: () => void;
}

const LocalInput: FC<LocalInputProps> = (props) => {
    const id = useId();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.target.value);
    };

    return (
        <div className={styles.input}>
            <label htmlFor={id} className={`${styles.input__label} ${props.error ? styles.input__label__error : ''}`}>
                {props.nameLabel}
            </label>
            <input id={id} name={props.name} className={styles.input__place} type={props.type} placeholder={props.placeholder} onChange={handleInputChange} value={props.value} />
            {props.delete && <button className={styles.input__delete} onClick={props.onClick}></button>}
            {props.error && <p className={styles.input__error}>{props.error}</p>}
        </div>
    );
};

export default LocalInput;
