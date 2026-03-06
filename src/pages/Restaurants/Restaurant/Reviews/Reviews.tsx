import { useTranslation } from 'react-i18next';
import { Review as ReviewType } from '../../../../utils/api/restaurantsService/restaurantsService';
import styles from './Reviews.module.scss';

function Review({ review }: { review: ReviewType }) {
    const { t } = useTranslation();
    const getDays = (date: Date) => {
        const todaysDate = new Date();
        const days = Math.floor((Date.parse(todaysDate.toString()) - Date.parse(date.toString())) / 1000 / 60 / 60 / 24);
        if (days === 0) {
            return `${t('pages.restaurant.today')}`;
        } else if (days === 1) {
            return `${t('pages.restaurant.yesterday')}`;
        } else if (days > 1 && days < 5) {
            return `${days} ${t('pages.restaurant.daysyaAgo')}`;
        } else {
            return `${days} ${t('pages.restaurant.daysAgo')}`;
        }
    };
    const daysAgo = getDays(review.created_at);

    return (
        <div className={styles.review}>
            <div className={styles.review__heading}>
                <h3 className={styles.review__heading_client}>{review.client}</h3>
                <p className={styles.review__heading_ago}>
                    {daysAgo}
                    <span className={styles.review__heading_rating}>{review.rating}</span>
                </p>
                <div className={styles.review__heading_icon} />
            </div>
            <p className={styles.review__comment}>{review.comment}</p>
        </div>
    );
}

function Reviews({ reviews }: { reviews: ReviewType[] }) {
    const { t } = useTranslation();

    return (
        <div className={styles.reviews__container}>
            {reviews.length === 0 ? (
                <p className={styles[`reviews__no-reviews-message`]}>{t('pages.restaurant.noReviewsYet')}</p>
            ) : (
                <div>
                    <h4 className={styles.reviews__title}>{t('pages.restaurant.reviews')}</h4>
                    <ul className={`${styles.reviews} bronfood-scrollbar `}>
                        {reviews.map((review, index) => (
                            <li key={`${review.rating}-${index}`}>
                                <Review review={review} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Reviews;
