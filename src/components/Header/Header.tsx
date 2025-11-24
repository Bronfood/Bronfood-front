import { useEffect, useState, useRef, useCallback } from 'react';
import Navigation from '../Navigation/Navigation';
import styles from './Header.module.scss';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../utils/hooks/useCurrentUser/useCurretUser';
import { useGetBasket } from '../../utils/hooks/useBasket/useBasket';

const Header = () => {
    const menuRef = useRef<HTMLDivElement>(null);
    const { isLogin } = useCurrentUser();
    const [isMenuActive, setIsMenuActive] = useState(false);
    const { t } = useTranslation();
    const { data, isSuccess } = useGetBasket();
    const meals = isSuccess && data.data.meals;
    const mealsCount = meals && data.data.meals.reduce((acc, curr) => acc + curr.count, 0);
    const [isContentVisible, setIsContentVisible] = useState(true);
    const handleMenuActive = () => {
        setIsContentVisible(false);
        setIsMenuActive(!isMenuActive);
    };
    const [isPageFavorites, setIsPageFavorites] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/favorites') {
            setIsPageFavorites(true);
        } else {
            setIsPageFavorites(false);
        }
    }, [location.pathname]);

    const closeOpenMenus = useCallback(
        (e: MouseEvent) => {
            if (isMenuActive && e.target instanceof HTMLElement && !menuRef.current?.contains(e.target)) {
                setIsMenuActive(false);
                setTimeout(() => {
                    setIsContentVisible(true);
                }, 300);
            }
        },
        [isMenuActive]
    );

    useEffect(() => {
        document.addEventListener('mousedown', closeOpenMenus);
        return () => document.removeEventListener('mousedown', closeOpenMenus);
    }, [closeOpenMenus]);

    useEffect(() => {
        if (!isMenuActive) {
            setTimeout(() => {
                setIsContentVisible(true);
            }, 300);
        }
    }, [isMenuActive]);

    return (
        <header className={styles.header}>
            <div className={`${styles.header__container} ${!isContentVisible ? styles.header__container_hidden : ''}`}>
                <button title={t('components.header.burgerTitleHover')} className={`${styles.header__burger} ${styles.header__icon}`} onClick={handleMenuActive}></button>
                <div className={styles.header__buttons}>
                    {isLogin ? (
                        <>
                            <Link to="/favorites">
                                <button title={t('components.header.favouritesTitleHover')} className={`${styles.header__favorite} ${styles.header__icon} ${isPageFavorites ? styles.header__favorite_active : ''}`}></button>
                            </Link>
                            <Link to="/basket">
                                <div className={styles.header__basket_container}>
                                    <button title={t('components.header.basketTitleHover')} className={`${styles.header__basket} ${styles.header__icon}`} />
                                    {mealsCount && <span className={styles.header__chip}>{mealsCount}</span>}
                                </div>
                            </Link>
                        </>
                    ) : (
                        <Link to="/search">
                            <button title={t('components.header.favouritesTitleHover')} className={`${styles.header__search} ${styles.header__icon}`}></button>
                        </Link>
                    )}
                </div>
            </div>
            <div ref={menuRef} className={`${styles.header__menu} ${isMenuActive ? styles.header__menu_active : ''}`}>
                <div className={styles.header__upblock}>
                    <Link title={t('components.header.logoTitleHover')} className={styles.header__logo} to="/"></Link>
                    <button title={t('components.header.buttonCloseTitleHover')} className={`${styles.header__close} ${styles.header__icon}`} onClick={handleMenuActive}></button>
                </div>
                <Navigation handleItemMenuClick={handleMenuActive} />
            </div>
        </header>
    );
};

export default Header;
