import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import MediaStep from './MediaStep/MediaStep';
import DetailsStep from './DetailsStep/DetailsStep';
import AdditivesStep from './AdditivesStep/AdditivesStep';
import { useState } from 'react';
import { CropState } from '../../../../utils/consts';

type RegistrationStepsMealProps = {
    title: string;
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: FieldValues;
};

const RegistrationStepsMeal = ({ title, onSubmit, defaultValues }: RegistrationStepsMealProps) => {
    const [cropState, setCropState] = useState<CropState>({ originalImages: {}, cropParams: {} });

    return (
        <RegistrationForm title={title} onSubmit={onSubmit} defaultValues={defaultValues} nameForm="registration-form-meal" stepFields={[['photo', 'name', 'base_price'], ['description', 'tags', 'waiting_time', 'disposableTableware'], ['features']]}>
            <MediaStep cropState={cropState} onCropStateChange={setCropState} />
            <DetailsStep />
            <AdditivesStep />
        </RegistrationForm>
    );
};

export default RegistrationStepsMeal;
