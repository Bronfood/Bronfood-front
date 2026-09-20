import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './AdminFooter.module.scss';

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

            if (path === '/manager/new-order/client') {
                setIsClientActive(true);
            } else if (path === '/manager/new-order/food') {
                setIsFoodActive(true);
            } else if (path === '/manager/new-order/basket') {
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
                    <>
                        <Link to={isClientActive ? '/manager/new-order' : '/manager/new-order/client'} className={styles['admin-footer__element_container']}>
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
                        <Link to={isFoodActive ? '/manager/new-order' : '/manager/new-order/food'} className={styles['admin-footer__element_container']}>
                            <button
                                title={t('pages.admin.order')}
                                className={`
                            ${styles['admin-footer__icon']}
                            ${styles['admin-footer__food']}
                            ${isFoodActive ? styles['admin-footer__food_active'] : ''}
                        `}
                            />
                            <h3 className={`${styles['admin-footer__element_title']} ${isFoodActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.order')}</h3>
                        </Link>
                        <Link to={isBasketActive ? '/manager/new-order' : '/manager/new-order/basket'} className={styles['admin-footer__element_container']}>
                            <button
                                title={t('pages.admin.basket')}
                                className={`
                            ${styles['admin-footer__icon']}
                            ${styles['admin-footer__basket']}
                            ${isBasketActive ? styles['admin-footer__basket_active'] : ''}
                        `}
                            />
                            <h3 className={`${styles['admin-footer__element_title']} ${isBasketActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.basket')}</h3>
                        </Link>
                    </>
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
