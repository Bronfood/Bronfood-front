import { Link } from 'react-router-dom';
import styles from '../Navigation.module.scss';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
interface ManagerNavigation {
    /**
     * Click on menu item redirects to link and close menu
     */
    handleItemMenuClick: React.MouseEventHandler<HTMLElement>;
}

const ManagerNavigation: FC<ManagerNavigation> = (props) => {
    const { t } = useTranslation();

    return (
        <ul className={`${styles.nav__menu}`}>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_calendar}`}></div>
                <Link to="/manager/work-status" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.managerNavigation.workStatus')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_exit}`}></div>
                <Link to="/logout" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.managerNavigation.signOut')}
                </Link>
            </li>
        </ul>
    );
};

export default ManagerNavigation;
