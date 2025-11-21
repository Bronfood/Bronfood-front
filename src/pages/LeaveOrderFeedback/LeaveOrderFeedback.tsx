import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './LeaveOrderFeedback.module.scss';
import Popup from '../../components/Popups/Popup/Popup';
import { FC, useEffect, useState } from 'react';
import { useOrderFeedback } from '../../utils/hooks/useOrderFeedback/useOrderFeedback';
import ReviewForm from './ReviewForm/ReviewForm';
import PopupFeedbackThanks from '../PopupFeedbackThanks/PopupFeedbackThanks';
import Preloader from '../../components/Preloader/Preloader';

interface LocationState {
    orderId: number;
    restaurantId: number;
}

const LeaveOrderFeedback: FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [orderId, setOrderId] = useState<number | null>(null);
    const [restaurantId, setRestaurantId] = useState<number | null>(null);
    const [showThanksPopup, setShowThanksPopup] = useState(false);

    useEffect(() => {
        const state = location.state as LocationState;
        if (state && state.orderId) setOrderId(state.orderId);
        if (state && state.restaurantId) setRestaurantId(state.restaurantId);
    }, [location.state]);

    const { rating, review, filledStars, isSubmitting, handleRatingChange, handleReviewChange, triggerFilledStars, resetFilledStars, handleSubmitReview, resetFeedback } = useOrderFeedback({
        restaurantId: restaurantId!,
        orderId: orderId!,
        onFeedbackSubmitted: () => setShowThanksPopup(true),
    });

    const navigate = useNavigate();

    const handleSkipOrClose = () => {
        resetFeedback();
        triggerFilledStars();
        setTimeout(() => navigate('/my-orders'), 2000);
    };

    if (showThanksPopup) {
        return <PopupFeedbackThanks />;
    }

    return (
        <Popup onClose={handleSkipOrClose}>
            <div className={styles['leave-order-feedback__layout']}>
                <h3 className={styles['leave-order-feedback__subtitle']}>{t('pages.leaveOrderFeedback.evaluate')}</h3>
                <ReviewForm rating={rating} review={review} onRatingChange={handleRatingChange} onReviewChange={handleReviewChange} filledStars={filledStars} triggerFilledStars={triggerFilledStars} resetFilledStars={resetFilledStars} onSubmit={handleSubmitReview} onSkipOrClose={handleSkipOrClose} isSubmitting={isSubmitting} />
            </div>
            {isSubmitting && (
                <div className={styles['leave-order-feedback__preloader_wrapper']}>
                    <Preloader />
                </div>
            )}
        </Popup>
    );
};

export default LeaveOrderFeedback;
