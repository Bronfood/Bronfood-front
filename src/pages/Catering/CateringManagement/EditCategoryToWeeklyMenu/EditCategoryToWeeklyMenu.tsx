import { FieldValues, SubmitHandler } from 'react-hook-form';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RegistrationCategory from '../RegistrationCategory/RegistrationCategory';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useGetWeeklyMenuByWeekday, useUpdateCategoryToWeeklyMenu } from '../../../../utils/hooks/useWeeklyMenu/useWeeklyMenu';
import { useTranslation } from 'react-i18next';
import { DailyCategory } from '../../../../utils/api/cateringWeeklyMenuService/cateringWeeklyMenuService';

const EditCategoryToWeeklyMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { dailyCategoryId } = useParams();
    const { weekday } = location.state || {};
    const { cateringId, day: selectedDay } = useParams<{ cateringId: string; day?: string }>();
    const { mutateAsync, isPending, error } = useUpdateCategoryToWeeklyMenu();
    const { data: menu } = useGetWeeklyMenuByWeekday(weekday);
    const dailyCategory = menu?.data?.daily_categories?.find((c: DailyCategory) => c.id === Number(dailyCategoryId));

    const onClose = () => {
        navigate(`/catering/${cateringId}/collect-weekly-menu/${selectedDay}`);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const categoryData = {
            id: Number(dailyCategoryId),
            name: data.name,
            meals: data.meals || [],
        };
        await mutateAsync({
            weekday: weekday,
            category: categoryData,
        });

        navigate(-1);
    };

    return (
        <Popup title={t('pages.cateringManagement.collectCategory')} onClose={onClose}>
            {error && <ErrorMessage message={error.message} />}
            {dailyCategory && <RegistrationCategory onSubmit={onSubmit} defaultValues={{ name: dailyCategory.name, mealIds: dailyCategory.meals?.map((meal) => meal.id) || [] }} />}
            {isPending && <Preloader />}
        </Popup>
    );
};

export default EditCategoryToWeeklyMenu;
