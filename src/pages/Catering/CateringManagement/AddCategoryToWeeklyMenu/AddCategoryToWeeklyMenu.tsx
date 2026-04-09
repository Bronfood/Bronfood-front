import { FieldValues, SubmitHandler } from 'react-hook-form';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RegistrationCategory from '../RegistrationCategory/RegistrationCategory';
import Preloader from '../../../../components/Preloader/Preloader';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useAddCategoryToWeeklyMenu } from '../../../../utils/hooks/useWeeklyMenu/useWeeklyMenu';

const AddCategoryToWeeklyMenu = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const { weekday } = location.state || {};
    const { cateringId, day: selectedDay } = useParams<{ cateringId: string; day?: string }>();
    const { mutateAsync, isPending, error } = useAddCategoryToWeeklyMenu();

    const onClose = () => {
        navigate(`/catering/${cateringId}/collect-weekly-menu/${selectedDay}`);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const categoryData = {
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
            <RegistrationCategory onSubmit={onSubmit} />
            {isPending && <Preloader />}
        </Popup>
    );
};

export default AddCategoryToWeeklyMenu;
