import styles from './RestaurantCardLarge.module.scss';
import { Restaurant } from '../../../utils/api/restaurantsService/restaurantsService';
import { useFavoritesMutations } from '../../../utils/hooks/useFavorites/useFavorites';
import { MouseEvent } from 'react';

type RestaurantCardLargeProps = {
    card: Restaurant;
    isFavorite?: boolean;
    onRestaurantClick: () => void;
};

function RestaurantCardLarge({ card, isFavorite = false, onRestaurantClick }: RestaurantCardLargeProps) {
    const { deleteFavorite } = useFavoritesMutations();
    const handleDeleteFavorite = (event: MouseEvent) => {
        event.stopPropagation();
        deleteFavorite.mutate(card.id);
    };
    const distance = card.distance_km ? card.distance_km.toFixed(1) : '';

    return (
        <div className={styles.card} onClick={onRestaurantClick}>
            <div className={styles.card__container}>
                {isFavorite ? <div className={styles.card__delete} onClick={handleDeleteFavorite}></div> : ''}
                <div className={styles.card__image} style={{ backgroundImage: `url(${card.photo})` }} />
                <div className={styles.card__description}>
                    <div className={styles.card__title_container}>
                        <p className={styles.card__title}>{card.name}</p>
                        <p className={styles.card__rating}>{card.rating}</p>
                        <div className={`${styles.card__icon} ${styles.card__icon_star} ${styles.card__icon_large}`} />
                    </div>
                    <div className={styles.card__feature}>
                        <div className={`${styles.card__icon} ${styles.card__icon_placemark} ${styles.card__icon_small}`} />
                        <p className={styles.card__feature_title}>{card.address}</p>
                        {distance && <p className={`${styles.card__feature_title_distance} ${styles.card__feature_title}`}>{`${distance} км`}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RestaurantCardLarge;
