import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import MediaStep from './MediaStep/MediaStep';
import DetailsStep from './DetailsStep/DetailsStep';
import { useState } from 'react';
import AdditivesStep from './AdditivesStep/AdditivesStep';
import AddAdditivePopup from './AdditivesStep/AddAdditivePopup/AddAdditivePopup';
import { MealAdditive, MealSauce, MealSize } from '../../../../utils/api/cateringService/cateringService';

type RegistrationStepsMealProps = {
    title: string;
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: FieldValues;
};

const RegistrationStepsMeal = ({ title, onSubmit, defaultValues }: RegistrationStepsMealProps) => {
    const [popupType, setPopupType] = useState<{
        type: string;
        data?: MealAdditive[] | MealSauce[] | MealSize[];
    } | null>(null);

    const handleOpenPopup = (type: string, data?: MealAdditive[] | MealSauce[] | MealSize[]) => {
        setPopupType({ type, data });
    };

    const handleClosePopup = () => setPopupType(null);

    return (
        <RegistrationForm title={title} onSubmit={onSubmit} defaultValues={defaultValues} additionalPopup={popupType && <AddAdditivePopup type={popupType.type as 'additive' | 'sauce' | 'size'} data={popupType.data} onClose={handleClosePopup} />}>
            <MediaStep />
            <DetailsStep />
            <AdditivesStep onOpenAddAdditive={handleOpenPopup} />
        </RegistrationForm>
    );
};

export default RegistrationStepsMeal;
