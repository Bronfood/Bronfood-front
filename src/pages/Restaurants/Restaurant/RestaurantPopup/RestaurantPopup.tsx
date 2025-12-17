import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect } from 'react';
import styles from './RestaurantPopup.module.scss';
import Button from '../../../../components/ButtonIconRound/ButtonIconRound';
import { useEsc } from '../../../../utils/hooks/useEsc/useEsc';
import { useParams } from 'react-router-dom';
import { useFavoritesMutations } from '../../../../utils/hooks/useFavorites/useFavorites';
import { useCurrentUser } from '../../../../utils/hooks/useCurrentUser/useCurretUser';
import { Restaurant } from '../../../../utils/api/restaurantsService/restaurantsService';

type RestaurantPopupProps = {
    close: () => void;
    isMealPageOpen: boolean;
    setIsMealPageOpen: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
    restaurant: Restaurant;
};

const RestaurantPopup = ({ close, isMealPageOpen, setIsMealPageOpen, children, restaurant }: RestaurantPopupProps) => {
    const { addFavorite, deleteFavorite } = useFavoritesMutations();
    const params = useParams();
    const mealId = parseInt(params.mealId ? params.mealId : '');
    const { isLogin } = useCurrentUser();
    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };
    useEsc(() => !isMealPageOpen && close(), [isMealPageOpen, close]);
    useEffect(() => {
        if (!mealId) {
            setIsMealPageOpen(false);
        }
    }, [mealId, setIsMealPageOpen]);
    const handleFavoriteClick = async () => {
        if (restaurant) {
            if (restaurant.isFavorite) {
                await deleteFavorite.mutate(restaurant.id);
            } else {
                await addFavorite.mutate(restaurant.id);
            }
        }
    };

    return (
        <div className={styles['restaurant-popup_overlay']} onClick={handleOverlayClick}>
            <div className={styles['restaurant-popup']}>
                {isLogin && (
                    <div className={`${styles['restaurant-popup_button']} ${styles['restaurant-popup_button_like']}`}>
                        <Button type="button" onClick={() => handleFavoriteClick()} icon="favorite" isActive={restaurant.isFavorite ? true : false} />
                    </div>
                )}
                <div className={`${styles['restaurant-popup_button']} ${styles['restaurant-popup_button_close']}`}>
                    <Button type="button" onClick={close} icon="close" />
                </div>
                {children}
            </div>
        </div>
    );
};

export default RestaurantPopup;
