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
    const [isOpenAddAdditive, setIsOpenAddAdditive] = useState(false);

    const handleOpenAddAdditive = () => {
        setIsOpenAddAdditive(true);
    };

    const handleCloseAddAdditive = () => {
        setIsOpenAddAdditive(false);
    };
    return (
        <RegistrationForm title={title} onSubmit={onSubmit} defaultValues={defaultValues} additionalPopup={isOpenAddAdditive && <AddAdditivePopup onClose={handleCloseAddAdditive} />}>
            <MediaStep />
            <DetailsStep onOpenAddAdditive={handleOpenAddAdditive} />
        </RegistrationForm>
    );
};

export default RegistrationStepsMeal;
