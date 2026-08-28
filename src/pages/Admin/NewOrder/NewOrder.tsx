import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NewOrder.module.scss';
import Button from '../../../components/ButtonIconSquare/ButtonIconSquare';

function NewOrder() {
    const [clientData, setClientData] = useState({});
    const [foodsData, setFoodsData] = useState([]);
    const [basketData, setBasketData] = useState([]);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const close = () => {
        navigate('/manager');
    };

    return (
        <div className={styles['new-order__overlay']}>
            <div className={styles['new-order']}>
                <h2 className={styles['new-order__title']}>{t('pages.admin.newOrder')}</h2>
                <div className={`${styles['new-order__button']} ${styles['new-order__button_close']}`}>
                    <Button type="button" onClick={close} icon="close" />
                </div>
                <Outlet
                    context={{
                        clientData,
                        setClientData,
                        foodsData,
                        setFoodsData,
                        basketData,
                        setBasketData,
                    }}
                />
            </div>
        </div>
    );
}

export default NewOrder;
