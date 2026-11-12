import { useEffect, useRef, useState, FC } from 'react';
import styles from './InfoTooltip.module.scss';

interface InfoTooltip {
    /**
     * Text tooltip
     */
    text: string;
}

const InfoTooltip: FC<InfoTooltip> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={styles.container} ref={containerRef}>
            <button type="button" className={styles.container__button} onClick={handleToggle} />
            {isOpen && (
                <div className={styles.container__content}>
                    <p className={styles.container__content_text}>{props.text}</p>
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
