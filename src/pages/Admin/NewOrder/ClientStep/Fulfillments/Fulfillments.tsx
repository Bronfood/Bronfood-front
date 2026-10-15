import { FC, useId } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Fulfillments.module.scss';
import { Fulfillment } from '../../../../../utils/api/adminNewOrderService/adminNewOrderService';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

const FULFILLMENTS: { name: Fulfillment; label: string }[] = [
    { name: 'pickup', label: 'pages.admin.pickup' },
    { name: 'delivery', label: 'pages.admin.delivery' },
    { name: 'dine_in', label: 'pages.admin.inHall' },
];

interface FulfillmentsProps {
    value: Fulfillment;
    name: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

const Fulfillments: FC<FulfillmentsProps> = (props) => {
    const { t } = useTranslation();
    const id = useId();
    const errorMessage = (props.errors[props.name]?.message as string) || undefined;

    return (
        <ul className={styles.fulfillments}>
            {FULFILLMENTS.map((item) => {
                const itemId = `${id}-${item.name}`;
                const checked = props.value === item.name;

                return (
                    <>
                        <li key={item.name} className={`${styles.fulfillment} ${checked ? styles.fulfillment__active : ''}`}>
                            <label htmlFor={itemId}>{t(item.label)}</label>
                            <input id={itemId} type="radio" {...props.register(props.name)} value={item.name} checked={checked} readOnly />
                        </li>
                        {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
                    </>
                );
            })}
        </ul>
    );
};

export default Fulfillments;
