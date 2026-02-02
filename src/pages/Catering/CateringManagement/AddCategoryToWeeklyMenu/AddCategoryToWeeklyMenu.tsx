import { FieldValues, SubmitHandler } from 'react-hook-form';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import RegistrationCategory from '../RegistrationCategory/RegistrationCategory';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useAddCategoryToWeeklyMenu } from '../../../../utils/hooks/useWeeklyMenu/useWeeklyMenu';

const AddCategoryToWeeklyMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { weekday } = location.state || {};
    const { mutateAsync, isPending, error } = useAddCategoryToWeeklyMenu();

    const onClose = () => {
        navigate(-1);
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
        console.log(data, categoryData);
    };

    return (
        <Popup title="Соберите категорию" onClose={onClose}>
            <RegistrationCategory onSubmit={onSubmit} />
            {isPending && <Preloader />}
            {error && <ErrorMessage message={error.message} />}
        </Popup>
    );
};

export default AddCategoryToWeeklyMenu;
