import { Link } from 'react-router-dom';
import styles from '../Navigation.module.scss';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetCaterings } from '../../../utils/hooks/useCatering/useCatering';
import Preloader from '../../Preloader/Preloader';

interface CateringNavigation {
    /**
     * Click on menu item redirects to link and close menu
     */
    handleItemMenuClick: React.MouseEventHandler<HTMLElement>;
}

const CateringNavigation: FC<CateringNavigation> = (props) => {
    const { t } = useTranslation();
    const { data: caterings, isLoading } = useGetCaterings();

    return (
        <ul className={`${styles.nav__menu} ${styles.nav__menu_user}`}>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_catering}`}></div>
                <p className={styles.nav__link}>{t('components.cateringNavigation.myCaterings')}</p>
                <div className={styles.nav__optionals}>
                    {caterings?.data &&
                        caterings.data.length > 0 &&
                        caterings.data.map((catering) => (
                            <Link key={catering.id} to={`/catering/${catering.id}`} className={styles.nav__optionals_item} onClick={props.handleItemMenuClick}>
                                {catering.name}
                            </Link>
                        ))}
                    {isLoading && (
                        <div className={styles.nav__preloader}>
                            <Preloader />
                        </div>
                    )}
                    <Link to="/catering/add-catering" className={styles.nav__addcatering} onClick={props.handleItemMenuClick}>
                        <p className={styles.nav__addcatering__text}> {t('components.cateringNavigation.addCatering')}</p>
                        <div className={styles.nav__addcatering__plus}></div>
                    </Link>
                </div>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_add}`}></div>
                <Link to="/catering/administrators" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.cateringNavigation.administrators')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_list}`}></div>
                <Link to="/catering/feedback" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.cateringNavigation.aboutService')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_support}`}></div>
                <Link to="/support" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.guestNavigation.support')}
                </Link>
            </li>
            <li className={styles.nav__item}>
                <div className={`${styles.nav__icon} ${styles.nav__icon_exit}`}></div>
                <Link to="/logout" className={styles.nav__link} onClick={props.handleItemMenuClick}>
                    {t('components.cateringNavigation.signOut')}
                </Link>
            </li>
        </ul>
    );
};

export default CateringNavigation;
