import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import LocationStep from './LocationStep/LocationStep';
import MediaStep from './MediaStep/MediaStep';
import TypeStep from './TypeStep/TypeStep';
import LegalStep from './LegalStep/LegalStep';
import { useState } from 'react';
import { CropState } from '../../../../utils/consts';

type RegistrationStepsCateringProps = {
    title: string;
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: FieldValues;
};

const RegistrationStepsCatering = ({ title, onSubmit, defaultValues }: RegistrationStepsCateringProps) => {
    const [cropState, setCropState] = useState<CropState>({ originalImages: {}, cropParams: {} });

    return (
        <RegistrationForm title={title} onSubmit={onSubmit} defaultValues={defaultValues} nameForm="registration-form-catering">
            <TypeStep />
            <LocationStep />
            <MediaStep cropState={cropState} onCropStateChange={setCropState} />
            <LegalStep />
        </RegistrationForm>
    );
};

export default RegistrationStepsCatering;
