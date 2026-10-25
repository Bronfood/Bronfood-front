import { MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './AdminFooter.module.scss';
import { useGetAdminBasket } from '../../../utils/hooks/useAdminBasket/useAdminBasket';
import { useAdminOrderContext } from '../../../utils/hooks/useAdminOrders/useAdminOrderContext';
const NEW_ORDER_PATH = '/manager/new-order';
const CLIENT_STEP_PATH = `${NEW_ORDER_PATH}/client-step`;
const MEAL_STEP_PATH = `${NEW_ORDER_PATH}/meal-step`;
const BASKET_STEP_PATH = `${NEW_ORDER_PATH}/basket-step`;

function NewOrderLinks({ isBasketActive, isClientActive, isFoodActive }: { isBasketActive: boolean; isClientActive: boolean; isFoodActive: boolean }) {
    const { t } = useTranslation();
    const { data: basket } = useGetAdminBasket();
    const { isClientDataValid } = useAdminOrderContext();
    const count = basket?.data?.meals?.reduce((sum, m) => sum + m.count, 0) ?? 0;
    const isFoodDisabled = !isClientDataValid;
    const isBasketDisabled = count === 0 || !isClientDataValid;

    const preventIf = (disabled: boolean) => (e: MouseEvent) => {
        if (disabled) e.preventDefault();
    };
    const disabledLinkProps = (disabled: boolean) => (disabled ? { 'aria-disabled': true, tabIndex: -1 } : {});

    return (
        <>
            <Link to={CLIENT_STEP_PATH} title={t('pages.admin.aboutClient')} className={styles['admin-footer__element_container']}>
                <span className={`${styles['admin-footer__icon']} ${styles['admin-footer__client']} ${isClientActive ? styles['admin-footer__client_active'] : ''}`} />
                <h3 className={`${styles['admin-footer__element_title']} ${isClientActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.aboutClient')}</h3>
            </Link>
            <Link to={MEAL_STEP_PATH} title={t('pages.admin.order')} className={`${styles['admin-footer__element_container']} ${!isClientDataValid ? styles['admin-footer__element_container_disabled'] : ''}`} onClick={preventIf(isFoodDisabled)} {...disabledLinkProps(isFoodDisabled)}>
                <span className={`${styles['admin-footer__icon']} ${styles['admin-footer__food']} ${isFoodActive ? styles['admin-footer__food_active'] : ''} ${isFoodDisabled ? styles['admin-footer__food_disabled'] : ''}`} />
                <h3 className={`${styles['admin-footer__element_title']} ${!isClientDataValid ? styles['admin-footer__element_title_disabled'] : ''} ${isFoodActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.order')}</h3>
            </Link>
            <Link to={BASKET_STEP_PATH} title={t('pages.admin.basket')} className={`${styles['admin-footer__element_container']} ${isBasketDisabled ? styles['admin-footer__element_container_disabled'] : ''}`} onClick={preventIf(isBasketDisabled)} {...disabledLinkProps(isBasketDisabled)}>
                <span className={`${styles['admin-footer__icon']} ${styles['admin-footer__basket']} ${isBasketActive ? styles['admin-footer__basket_active'] : ''} ${isBasketDisabled ? styles['admin-footer__basket_empty'] : ''}`}>{count > 0 && <span className={`${styles['admin-footer__basket_count']} ${!isClientDataValid ? styles['admin-footer__basket_count_disabled'] : ''}`}>{count}</span>}</span>
                <h3 className={`${styles['admin-footer__element_title']} ${isBasketDisabled ? styles['admin-footer__element_title_disabled'] : ''} ${isBasketActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.basket')}</h3>
            </Link>
        </>
    );
}

function AdminFooter() {
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const isOrdersActive = pathname === '/manager/orders';
    const isStockActive = pathname === '/manager/stock';
    const isNewOrderActive = pathname.startsWith(NEW_ORDER_PATH);
    const isClientActive = pathname === CLIENT_STEP_PATH;
    const isFoodActive = pathname === MEAL_STEP_PATH;
    const isBasketActive = pathname === BASKET_STEP_PATH;

    return (
        <footer className={styles['admin-footer']}>
            <div className={`${styles['admin-footer__container']}`}>
                <Link to={isOrdersActive ? '/manager' : '/manager/orders'} title={t('pages.admin.main')} className={styles['admin-footer__element_container']}>
                    <button title={t('pages.admin.main')} className={`${styles['admin-footer__icon']} ${styles['admin-footer__orders']} ${isOrdersActive ? styles['admin-footer__orders_active'] : ''}`} />
                    <h3 className={`${styles['admin-footer__element_title']} ${isOrdersActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.main')}</h3>
                </Link>
                {isNewOrderActive ? (
                    <NewOrderLinks isBasketActive={isBasketActive} isClientActive={isClientActive} isFoodActive={isFoodActive} />
                ) : (
                    <>
                        <Link to={NEW_ORDER_PATH} title={t('pages.admin.newOrder')} className={styles['admin-footer__element_container']}>
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
