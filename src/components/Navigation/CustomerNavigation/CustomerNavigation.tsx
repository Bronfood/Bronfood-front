import { Link } from 'react-router-dom';
import styles from '../Navigation.module.scss';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
interface CustomerNavigation {
    /**
     * Click on menu item redirects to link and close menu
     */
    handleItemMenuClick: React.MouseEventHandler<HTMLElement>;
}
const CustomerNavigation: FC<CustomerNavigation> = (props) => {
    const { t } = useTranslation();

    return (
        <ul className={`${styles.nav__menu} ${styles.nav__menu_user}`}>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_customer}`}></div>
                <Link to="/profile" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.customerNavigation.editPersonalData')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_order}`}></div>
                <Link to="/my-orders" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.customerNavigation.myOrders')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_list}`}></div>
                <Link to="/feedback" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.customerNavigation.aboutService')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_exit}`}></div>
                <Link
                    to="/logout"
                    className={styles.nav__link}
                    onClick={(e) => {
                        props.handleItemMenuClick(e);
                    }}
                >
                    {t('components.customerNavigation.signOut')}
                </Link>
            </li>
        </ul>
    );
};

export default CustomerNavigation;
