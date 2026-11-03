import { useEffect, useRef, useState } from 'react';
import styles from './InfoTooltip.module.scss';

interface InfoTooltipProps {
    text: string;
}

const InfoTooltip = ({ text }: InfoTooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const isClickInsideTrigger = triggerRef.current?.contains(e.target as Node);
            const isClickInsideContent = contentRef.current?.contains(e.target as Node);

            if (isOpen && !isClickInsideTrigger && !isClickInsideContent) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={styles.container}>
            <button type="button" className={styles.container__button} onClick={handleToggle} ref={triggerRef} />
            {isOpen && (
                <div className={styles.container__content} ref={contentRef}>
                    <p className={styles.container__content_text}>{text}</p>
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
