import { FC, ReactNode } from 'react';
import styles from './RadioInputs.module.scss';
import { CookMethod, PreOrderType } from '../../../../../utils/api/adminService/adminService';

interface CookMethodRadio {
    method: CookMethod;
    checked: boolean;
    onClick: (method: CookMethod) => void;
    radioNameText: string;
    radioAboutText: string;
}

export const CookMethodRadio: FC<CookMethodRadio> = (props) => {
    return (
        <div className={`${styles.radio} ${props.method === 'now' ? styles.radio__now : ''}`} onClick={() => props.onClick(props.method)}>
            <input type="radio" name="cookMethod" checked={props.checked} readOnly />
            <div className={styles.radio__text}>
                <p className={styles.radio__text_name}>{props.radioNameText}</p>
                <p className={styles.radio__text_about}>{props.radioAboutText}</p>
            </div>
        </div>
    );
};

interface PreOrderTypeRadio {
    type: PreOrderType;
    input?: ReactNode;
    checked: boolean;
    onClick: (type: PreOrderType) => void;
}

export const PreOrderTypeRadioLayout: FC<PreOrderTypeRadio> = (props) => {
    return (
        <div className={styles.layout} onClick={() => props.onClick(props.type)}>
            <input type="radio" name="preOrderType" checked={props.checked} readOnly />
            {props.input}
        </div>
    );
};
