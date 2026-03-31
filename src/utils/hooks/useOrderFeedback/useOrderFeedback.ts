import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../api/orderService/orderService';

interface UseOrderFeedbackProps {
    orderId: number;
    restaurantId: number;
    onFeedbackSubmitted: () => void;
}

interface ReviewData {
    rating: number;
    review: string;
}

export const useOrderFeedback = ({ restaurantId, orderId, onFeedbackSubmitted }: UseOrderFeedbackProps) => {
    const queryClient = useQueryClient();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [filledStars, setFilledStars] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        setFilledStars(false);
    };

    const handleReviewChange = (newReview: string) => {
        setReview(newReview);
    };

    const triggerFilledStars = () => {
        setFilledStars(true);
    };

    const resetFilledStars = () => {
        setFilledStars(false);
    };

    const resetFeedback = () => {
        setRating(0);
        setReview('');
        resetFilledStars();
    };

    const { mutate: submitOrderFeedback, isPending: isSubmitting } = useMutation({
        mutationFn: (data: ReviewData) => orderService.submitOrderFeedback(restaurantId, orderId, data.rating, data.review),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['order', orderId, 'reviews'],
            });
            onFeedbackSubmitted();
            resetFeedback();
        },
        onError: (error) => {
            setErrorMessage(error.message);
            navigate('/');
        },
    });

    const handleSubmitReview = () => {
        if (rating === 0) {
            triggerFilledStars();
            setTimeout(() => submitOrderFeedback({ rating, review }), 1200);
        } else {
            submitOrderFeedback({ rating, review });
        }
    };

    return {
        rating,
        review,
        filledStars,
        isSubmitting,
        handleRatingChange,
        handleReviewChange,
        triggerFilledStars,
        resetFilledStars,
        handleSubmitReview,
        errorMessage,
        resetFeedback,
    };
};
