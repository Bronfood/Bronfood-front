import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './AdminFooter.module.scss';

function AdminFooter() {
    const [isOrdersActive, setIsOrdersActive] = useState(false);
    const [isWorkStatusActive, setIsWorkStatusActive] = useState(false);
    const { t } = useTranslation();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/manager') {
            setIsOrdersActive(false);
            setIsWorkStatusActive(false);
        }
        if (location.pathname === '/manager/orders') {
            setIsOrdersActive(true);
            setIsWorkStatusActive(false);
        }
        if (location.pathname === '/manager/work-status') {
            setIsWorkStatusActive(true);
            setIsOrdersActive(false);
        }
    }, [location.pathname]);

    return (
        <footer className={styles['admin-footer']}>
            <div className={`${styles['admin-footer__container']}`}>
                <Link to={isOrdersActive ? '/manager' : '/manager/orders'} className={styles['admin-footer__element_container']}>
                    <button
                        title={t('pages.admin.orders')}
                        className={`
                            ${styles['admin-footer__icon']}
                            ${styles['admin-footer__orders']}
                            ${isOrdersActive ? styles['admin-footer__orders_active'] : ''}
                        `}
                    />
                    <h3 className={`${styles['admin-footer__element_title']} ${isOrdersActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.orders')}</h3>
                </Link>
                <Link to={isWorkStatusActive ? '/manager' : '/manager/work-status'} className={styles['admin-footer__element_container']}>
                    <button
                        title={t('pages.admin.workStatus')}
                        className={`
                            ${styles['admin-footer__icon']}
                            ${styles['admin-footer__work_status']}
                            ${isWorkStatusActive ? styles['admin-footer__work_status_active'] : ''}
                        `}
                    />
                    <h3 className={`${styles['admin-footer__element_title']} ${isWorkStatusActive ? styles['admin-footer__element_title_active'] : ''}`}>{t('pages.admin.workStatus')}</h3>
                </Link>
            </div>
        </footer>
    );
}

export default AdminFooter;
