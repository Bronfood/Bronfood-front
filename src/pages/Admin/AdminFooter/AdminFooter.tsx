import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './AdminFooter.module.scss';
import { useGetAdminBasket } from '../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';
import { useAdminNewOrderContext } from '../../../utils/hooks/useAdminNewOrder/useAdminNewOrderContext';

function NewOrderLinks({ isBasketActive, isClientActive, isFoodActive }: { isBasketActive: boolean; isClientActive: boolean; isFoodActive: boolean }) {
    const { t } = useTranslation();
    const { data: basket } = useGetAdminBasket();
    const { isClientDataValid } = useAdminNewOrderContext();
    const count = basket?.data?.meals?.reduce((sum, m) => sum + m.count, 0) ?? 0;
    const isEmpty = count === 0;

    return (
        <>
            <Link to={isClientActive ? '/manager/new-order' : '/manager/new-order/client-step'} className={styles['admin-footer__element_container']}>
                <button
                    title={t('pages.admin.aboutClient')}
                    className={`
                            ${styles['admin-footer__icon']}
                            ${styles['admin-footer__client']}
                            ${isClientActive ? styles['admin-footer__client_active'] : ''}
                        `}
                />
                <h3 className={`${styles['admin-footer__element_title']} ${isClientActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.aboutClient')}</h3>
            </Link>
            <Link
                to={isFoodActive ? '/manager/new-order' : '/manager/new-order/meal-step'}
                className={`${styles['admin-footer__element_container']} ${!isClientDataValid ? styles['admin-footer__element_container_disabled'] : ''}`}
                onClick={(e) => {
                    if (!isClientDataValid) e.preventDefault();
                }}
            >
                <button
                    title={t('pages.admin.order')}
                    className={`
                            ${styles['admin-footer__icon']}
                            ${styles['admin-footer__food']}
                            ${isFoodActive ? styles['admin-footer__food_active'] : ''}
                            ${!isClientDataValid ? styles['admin-footer__food_disabled'] : ''}
                        `}
                />
                <h3 className={`${styles['admin-footer__element_title']} ${!isClientDataValid ? styles['admin-footer__element_title_disabled'] : ''} ${isFoodActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.order')}</h3>
            </Link>
            <Link
                to={isBasketActive ? '/manager/new-order' : '/manager/new-order/basket-step'}
                className={`${styles['admin-footer__element_container']} ${isEmpty || !isClientDataValid ? styles['admin-footer__element_container_disabled'] : ''}`}
                onClick={(e) => {
                    if (isEmpty || !isClientDataValid) e.preventDefault();
                }}
            >
                <button
                    title={t('pages.admin.basket')}
                    className={`
                    ${styles['admin-footer__icon']}
                    ${styles['admin-footer__basket']}
                    ${isBasketActive ? styles['admin-footer__basket_active'] : ''}
                    ${isEmpty || !isClientDataValid ? styles['admin-footer__basket_empty'] : ''}
                `}
                >
                    {count > 0 && <span className={`${styles['admin-footer__basket_count']} ${!isClientDataValid ? styles['admin-footer__basket_count_disabled'] : ''}`}>{count}</span>}
                </button>
                <h3 className={`${styles['admin-footer__element_title']} ${isEmpty || !isClientDataValid ? styles['admin-footer__element_title_disabled'] : ''} ${isBasketActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.basket')}</h3>
            </Link>
        </>
    );
}

function AdminFooter() {
    const [isOrdersActive, setIsOrdersActive] = useState(false);
    const [isStockActive, setIsStockActive] = useState(false);
    const [isNewOrderActive, setIsNewOrderActive] = useState(false);

    const [isClientActive, setIsClientActive] = useState(false);
    const [isFoodActive, setIsFoodActive] = useState(false);
    const [isBasketActive, setIsBasketActive] = useState(false);

    const { t } = useTranslation();
    const location = useLocation();

    useEffect(() => {
        const resetAll = () => {
            setIsOrdersActive(false);
            setIsStockActive(false);
            setIsNewOrderActive(false);
            setIsClientActive(false);
            setIsFoodActive(false);
            setIsBasketActive(false);
        };

        const path = location.pathname;

        if (path === '/manager/orders') {
            resetAll();
            setIsOrdersActive(true);
        } else if (path === '/manager/stock') {
            resetAll();
            setIsStockActive(true);
        } else if (path.startsWith('/manager/new-order')) {
            resetAll();
            setIsNewOrderActive(true);

            if (path === '/manager/new-order/client-step') {
                setIsClientActive(true);
            } else if (path === '/manager/new-order/meal-step') {
                setIsFoodActive(true);
            } else if (path === '/manager/new-order/basket-step') {
                setIsBasketActive(true);
            }
        } else {
            resetAll();
        }
    }, [location.pathname]);

    return (
        <footer className={styles['admin-footer']}>
            <div className={`${styles['admin-footer__container']}`}>
                <Link to={isOrdersActive ? '/manager' : '/manager/orders'} className={styles['admin-footer__element_container']}>
                    <button
                        title={t('pages.admin.main')}
                        className={`
                            ${styles['admin-footer__icon']}
                            ${styles['admin-footer__orders']}
                            ${isOrdersActive ? styles['admin-footer__orders_active'] : ''}
                        `}
                    />
                    <h3 className={`${styles['admin-footer__element_title']} ${isOrdersActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.main')}</h3>
                </Link>
                {isNewOrderActive ? (
                    <NewOrderLinks isBasketActive={isBasketActive} isClientActive={isClientActive} isFoodActive={isFoodActive} />
                ) : (
                    <>
                        <Link to={isNewOrderActive ? '/manager' : '/manager/new-order'} className={styles['admin-footer__element_container']}>
                            <button title={t('pages.admin.newOrder')} className={`${styles['admin-footer__new-order']}`}>
                                <div className={`${styles['admin-footer__new-order_icon']}`} />
                            </button>
                            <h3 className={`${styles['admin-footer__element_title']} ${styles['admin-footer__element_title_active']}`}>{t('pages.admin.newOrder')}</h3>
                        </Link>
                        <Link to={isStockActive ? '/manager' : '/manager/stock'} className={styles['admin-footer__element_container']}>
                            <button
                                title={t('pages.admin.stock')}
                                className={`
                            ${styles['admin-footer__icon']}
                            ${styles['admin-footer__stock']}
                            ${isStockActive ? styles['admin-footer__stock_active'] : ''}
                        `}
                            />
                            <h3 className={`${styles['admin-footer__element_title']} ${isStockActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.stock')}</h3>
                        </Link>
                    </>
                )}
            </div>
        </footer>
    );
}

export default AdminFooter;
