import { FC, ButtonHTMLAttributes } from 'react';
import styles from './ButtonIconRound.module.scss';

/* Can be any button from this design: https://www.figma.com/file/9H7H1cGkW9CYB7iFRpm7x3/bronfood.com?type=design&node-id=279-1206&mode=design&t=ZP4xbFL1UkoD1zb6-4  */

interface ButtonIconRoundProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button's state
     */
    isActive?: boolean;
    /**
     * Icon inside button
     */
    icon?: 'close' | 'edit' | 'back' | 'favorite' | 'delete';
}

const ButtonIconRound: FC<ButtonIconRoundProps> = ({ isActive = false, icon = 'close', ...props }) => {
    return (
        <button
            {...props}
            className={`
                ${styles['button-icon-round']}
                ${styles[`button-icon-round__icon_${isActive && (icon === 'delete' || icon === 'favorite') ? `${icon}_active` : icon}`]}
                ${isActive && icon === 'delete' ? styles['button-icon-round_outlined'] : ''}
                ${!isActive ? styles['button-icon-round__background_white'] : icon === 'delete' ? styles['button-icon-round__background_red'] : styles['button-icon-round__background_grey']}
            `}
        />
    );
};

export default ButtonIconRound;
