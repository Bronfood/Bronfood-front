import { FC, useId } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Fulfillments.module.scss';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Fulfillment } from '../../../../../utils/api/adminService/adminService';
import { FULFILLMENTS } from '../../../../../utils/consts';

interface FulfillmentsProps {
    value: Fulfillment;
    name: string;
    register: UseFormRegister<FieldValues>;
}

const Fulfillments: FC<FulfillmentsProps> = (props) => {
    const { t } = useTranslation();
    const id = useId();

    return (
        <ul className={styles.fulfillments}>
            {FULFILLMENTS.map((item) => {
                const itemId = `${id}-${item.name}`;
                const checked = props.value === item.name;

                return (
                    <li key={item.name} className={`${styles.fulfillment} ${checked ? styles.fulfillment__active : ''}`}>
                        <label htmlFor={itemId}>{t(item.label)}</label>
                        <input id={itemId} type="radio" {...props.register(props.name)} value={item.name} checked={checked} />
                    </li>
                );
            })}
        </ul>
    );
};

export default Fulfillments;
