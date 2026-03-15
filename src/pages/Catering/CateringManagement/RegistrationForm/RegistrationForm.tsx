import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import React, { ReactNode, useState } from 'react';
import Form from '../../../../components/Form/Form';
import Button from '../../../../components/Button/Button';
import ProgressSteps from '../../../../components/ProgressSteps/ProgressSteps';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import RegistrationPopup from './RegistrationPopup/RegistrationPopup';

type RegistrationFormProps = {
    title: string;
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: FieldValues;
    isLoading?: boolean;
    children: ReactNode;
    additionalPopup?: ReactNode;
    nameForm: string;
};

const RegistrationForm = ({ title, onSubmit, defaultValues = {}, children, additionalPopup, nameForm }: RegistrationFormProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const methods = useForm<FieldValues>({
        defaultValues,
        mode: 'onChange',
    });
    const { trigger, handleSubmit } = methods;
    const [currentStep, setCurrentStep] = useState(1);
    const steps = React.Children.toArray(children);
    const totalSteps = steps.length;

    const onClose = () => {
        navigate(-1);
    };

    const handleNextClick = async () => {
        const isStepValid = await trigger(undefined, { shouldFocus: true });
        if (isStepValid) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevClick = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleFormSubmit = async (data: FieldValues) => {
        onSubmit(data);
    };

    return (
        <FormProvider {...methods}>
            <RegistrationPopup title={title} close={onClose} {...(currentStep !== 1 && { prevStep: handlePrevClick })}>
                <ProgressSteps currentStep={currentStep} totalSteps={totalSteps}></ProgressSteps>
                <Form name={nameForm} onSubmit={(e) => e.preventDefault()}>
                    {steps[currentStep - 1]}
                    {currentStep < totalSteps ? (
                        <Button type="button" onClick={handleNextClick}>
                            {t('pages.cateringManagement.buttonNext')}
                        </Button>
                    ) : (
                        <Button type="submit" onClick={handleSubmit(handleFormSubmit)}>
                            {t('pages.cateringManagement.buttonSave')}
                        </Button>
                    )}
                </Form>
            </RegistrationPopup>
            {additionalPopup}
        </FormProvider>
    );
};

export default RegistrationForm;
