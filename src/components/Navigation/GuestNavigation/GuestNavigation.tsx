import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from '../Navigation.module.scss';
interface GuestNavigation {
    /**
     * Click on menu item redirects to link and close menu
     */
    handleItemMenuClick: React.MouseEventHandler<HTMLElement>;
}
const GuestNavigation: FC<GuestNavigation> = (props) => {
    const { t } = useTranslation();
    return (
        <ul className={`${styles.nav__menu}`}>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_list}`}></div>
                <Link to="/feedback" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.guestNavigation.aboutService')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_customer}`}></div>
                <Link to="/signup" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.guestNavigation.signUpAsABuyer')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_catering}`}></div>
                <Link to="/partnership" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.guestNavigation.partnership')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_enter}`}></div>
                <Link to="/signin" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.guestNavigation.signIn')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_enter}`}></div>
                <Link to="/admin" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.guestNavigation.signInAsAdmin')}
                </Link>
            </li>
        </ul>
    );
};

export default GuestNavigation;
