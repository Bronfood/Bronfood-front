import { FC, ReactNode } from 'react';
import styles from './Form.module.scss';

interface Form {
    /**
     * Form id
     */
    id?: string;
    /**
     * Form name
     */
    name: string;
    /**
     * Submit form action
     */
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    children?: ReactNode;
}

const Form: FC<Form> = (props) => {
    return (
        <form className={styles.form} id={props?.id} name={props.name} onSubmit={props.onSubmit}>
            {props.children}
        </form>
    );
};

export default Form;
