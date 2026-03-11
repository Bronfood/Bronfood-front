import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import MediaStep from './MediaStep/MediaStep';
import DetailsStep from './DetailsStep/DetailsStep';
import AdditivesStep from './AdditivesStep/AdditivesStep';

type RegistrationStepsMealProps = {
    title: string;
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: FieldValues;
};

const RegistrationStepsMeal = ({ title, onSubmit, defaultValues }: RegistrationStepsMealProps) => {
    return (
        <RegistrationForm title={title} onSubmit={onSubmit} defaultValues={defaultValues}>
            <MediaStep />
            <DetailsStep />
            <AdditivesStep />
        </RegistrationForm>
    );
};

export default RegistrationStepsMeal;
