import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import MediaStep from './MediaStep/MediaStep';
import DetailsStep from './DetailsStep/DetailsStep';
import { useState } from 'react';
import AddAdditivePopup from './DetailsStep/AddAdditivePopup/AddAdditivePopup';
import ListMealStep from './ListMealStep/ListMealStep';
import { CateringMeal } from '../../../../utils/api/cateringService/cateringService';

type RegistrationStepsMealProps = {
    title: string;
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: FieldValues;
};

type DraftMeal = Omit<CateringMeal, 'id'>;

const RegistrationStepsMeal = ({ title, onSubmit, defaultValues }: RegistrationStepsMealProps) => {
    const [popupType, setPopupType] = useState<null | 'additive' | 'sauce' | 'size'>(null);
    const [meals, setMeals] = useState<DraftMeal[]>([]);
    const [currentStep, setCurrentStep] = useState(1);

    const handleOpenPopup = (type: 'additive' | 'sauce' | 'size') => setPopupType(type);

    const handleClosePopup = () => setPopupType(null);

    const handleDeleteMeal = (index: number) => {
        setMeals((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEditMeal = (index: number) => {
        setCurrentStep(1);
        setMeals((prev) => [...prev.filter((_, i) => i === index)]);
    };

    const handleNextStep = (data: FieldValues, currentStep: number) => {
        if (currentStep === 2) {
            const newMeal: DraftMeal = {
                name: data.name,
                photo: data.photo,
                description: data.description,
                price: data.price,
                disposableTableware: data.disposableTableware,
                mealSizes: data.mealSizes,
                mealSauces: data.mealSauces,
                mealAdditives: data.mealAdditives,
                type: data.type,
                waitingTime: data.waitingTime,
                tags: data.tags,
            };
            setMeals((prev) => [...prev, newMeal]);
        }
    };

    const handleFormSubmit: SubmitHandler<FieldValues> = async (data) => {
        const finalData = { ...data, meals };
        await onSubmit(finalData);
    };

    return (
        <RegistrationForm title={title} onSubmit={handleFormSubmit} defaultValues={defaultValues} additionalPopup={popupType && <AddAdditivePopup type={popupType} onClose={handleClosePopup} />} onNextStep={handleNextStep} onPrevStep={(currentStep) => currentStep !== 3} currentStep={currentStep} onStepChange={setCurrentStep}>
            <MediaStep />
            <DetailsStep onOpenAddAdditive={handleOpenPopup} />
            <ListMealStep meals={meals} onDelete={handleDeleteMeal} onEdit={handleEditMeal} onAddMeal={() => setCurrentStep(1)} />
        </RegistrationForm>
    );
};

export default RegistrationStepsMeal;
