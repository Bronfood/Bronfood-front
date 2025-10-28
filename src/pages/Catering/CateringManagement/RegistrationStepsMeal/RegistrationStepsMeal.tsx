import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import MediaStep from './MediaStep/MediaStep';
import DetailsStep from './DetailsStep/DetailsStep';
import { useState } from 'react';
import AddAdditivePopup from './DetailsStep/AddAdditivePopup/AddAdditivePopup';

type RegistrationStepsMealProps = {
    title: string;
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: FieldValues;
};

const RegistrationStepsMeal = ({ title, onSubmit, defaultValues }: RegistrationStepsMealProps) => {
    const [popupType, setPopupType] = useState<null | 'additive' | 'sauce' | 'size'>(null);

    const handleOpenPopup = (type: 'additive' | 'sauce' | 'size') => setPopupType(type);

    const handleClosePopup = () => setPopupType(null);

    return (
        <RegistrationForm title={title} onSubmit={onSubmit} defaultValues={defaultValues} additionalPopup={popupType && <AddAdditivePopup type={popupType} onClose={handleClosePopup} />}>
            <MediaStep />
            <DetailsStep onOpenAddAdditive={handleOpenPopup} />
        </RegistrationForm>
    );
};

export default RegistrationStepsMeal;
