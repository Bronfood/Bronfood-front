import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import LocationStep from './LocationStep/LocationStep';
import MediaStep from './MediaStep/MediaStep';
import TypeStep from './TypeStep/TypeStep';
import LegalStep from './LegalStep/LegalStep';

type RegistrationStepsCateringProps = {
    title: string;
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: FieldValues;
};

const RegistrationStepsCatering = ({ title, onSubmit, defaultValues }: RegistrationStepsCateringProps) => {
    return (
        <RegistrationForm title={title} onSubmit={onSubmit} defaultValues={defaultValues} nameForm="registration-form-catering">
            <TypeStep />
            <LocationStep />
            <MediaStep />
            <LegalStep />
        </RegistrationForm>
    );
};

export default RegistrationStepsCatering;
