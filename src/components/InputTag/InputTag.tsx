import { FC, useId } from 'react';
import styles from './InputTag.module.scss';

interface InputTag {
    /**
     * List tags
     */
    tags?: { name: string }[];
    /**
     * Delete tag
     */
    onDelete: (index: number) => void;
    /**
     * Add tag
     */
    onAdd: (tag: string) => void;
    /**
     * Changing the input value
     */
    onChange: (tag: string) => void;
    /**
     * Name of input
     */
    nameLabel: string;
    /**
     * Placeholder for input
     */
    placeholder: string;
    /**
     * Input Value
     */
    value?: string;
}

const InputTag: FC<InputTag> = (props) => {
    const id = useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = props.value?.trim();
            if (value) {
                props.onAdd(value);
                props.onChange('');
            }
        }
    };

    return (
        <div className={styles.tags}>
            <label htmlFor={id} className={styles.tags__title}>
                {props.nameLabel}
            </label>
            <div className={styles.tags__container}>
                <ul className={styles.tags__list}>
                    {props.tags?.map((tag, index) => {
                        return (
                            <li key={index}>
                                <div className={styles.tag__container}>
                                    <p className={styles.tag__text}>{tag.name}</p>
                                    <button className={styles.tag__button} type="button" onClick={() => props.onDelete(index)}></button>
                                </div>
                            </li>
                        );
                    })}
                    <input id={id} className={styles.tags__input} type="text" placeholder={props.placeholder} value={props.value} onKeyDown={handleKeyDown} onChange={handleChange}></input>
                </ul>
            </div>
        </div>
    );
};

export default InputTag;
