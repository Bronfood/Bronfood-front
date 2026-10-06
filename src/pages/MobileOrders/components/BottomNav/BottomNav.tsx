import { useState } from 'react';
import styles from './BottomNav.module.scss';

function BottomNav() {
    const [activeItem, setActiveItem] = useState('home');

    const items = [
        { id: 'home', label: 'Главная', icon: 'home' },
        { id: 'new', label: 'Новый заказ', icon: 'plus' },
        { id: 'inStock', label: 'В наличии', icon: 'stock' },
    ];

    return (
        <nav className={styles['bottom-nav']}>
            <div className={styles['bottom-nav__container']}>
                {items.map((item) => (
                    <button key={item.id} className={`${styles['bottom-nav-item']} ${activeItem === item.id ? styles['bottom-nav-item-active'] : ''}`} onClick={() => setActiveItem(item.id)}>
                        {item.icon === 'plus' ? (
                            <div className={styles['bottom-nav-item__plus']}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                        ) : (
                            <div className={styles['bottom-nav-item__icon']}>
                                {item.icon === 'home' && (
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <path d="M4 13L14 4L24 13V24C24 24.55 23.55 25 23 25H5C4.45 25 4 24.55 4 24V13Z" stroke="#282828" strokeWidth="2" strokeLinejoin="round" />
                                        <path d="M10 25V17H18V25" stroke="#282828" strokeWidth="2" strokeLinejoin="round" />
                                        <path d="M9 10L14 5L19 10" stroke="#ff8f0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                {item.icon === 'stock' && (
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <rect x="4" y="6" width="20" height="18" rx="2" stroke="#282828" strokeWidth="2" />
                                        <path d="M4 12H24" stroke="#282828" strokeWidth="2" />
                                        <path d="M10 6V2M18 6V2" stroke="#282828" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M14 16L17 19L22 14" stroke="#ff8f0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        )}
                        <span className={`${styles['bottom-nav-item__label']} ${activeItem === item.id ? styles['bottom-nav-item__label_active'] : ''}`}>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default BottomNav;
