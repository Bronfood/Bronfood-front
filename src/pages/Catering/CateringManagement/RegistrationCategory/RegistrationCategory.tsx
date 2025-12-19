import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../../components/Input/Input';
import { useTranslation } from 'react-i18next';
import { regexClientName } from '../../../../utils/consts';
import CategoryMealCard from './CategoryMealCard/CategoryMealCard';
import { useGetCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import Button from '../../../../components/Button/Button';
import { CateringMeal } from '../../../../utils/api/cateringService/cateringService';
import styles from './RegistrationCategory.module.scss';
import { useState } from 'react';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';

type RegistrationCategoryProps = {
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: {
        name: string;
        photo: string;
        meals: CateringMeal[];
    };
};

const RegistrationCategory = ({ onSubmit, defaultValues }: RegistrationCategoryProps) => {
    const { t } = useTranslation();
    const { data: meal, isSuccess, isPending } = useGetCateringMeals();
    const [showAvailableMeals, setShowAvailableMeals] = useState(false);
    const allMeals = isSuccess ? meal.data : [];
    const [selectedMeals, setSelectedMeals] = useState<number[]>(defaultValues?.meals.map((meal) => meal.id) || []);
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        setValue,
    } = useForm<FieldValues>({ defaultValues });

    const values = watch();
    const categoryMealIds = defaultValues?.meals.map((meal) => meal.id) || [];

    const mealsWithoutCategory = allMeals.filter((meal) => !meal.category);
    const availableMeals = mealsWithoutCategory.filter((meal) => !categoryMealIds.includes(meal.id));
    const currentCategoryMeals = allMeals.filter((meal) => (defaultValues ? categoryMealIds.includes(meal.id) : selectedMeals.includes(meal.id)));

    const handleMealToggle = (mealId: number) => {
        setSelectedMeals((prev) => {
            const newSelectedMeals = prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId];
            setValue('meals', newSelectedMeals);

            return newSelectedMeals;
        });
    };

    const toggleClickAvailable = () => {
        setShowAvailableMeals(!showAvailableMeals);
    };

    const handleFormSubmit = (data: FieldValues) => {
        const mealsData = allMeals.filter((meal) => selectedMeals.includes(meal.id));
        onSubmit({ ...data, meals: mealsData });
    };

    return (
        <form name="form-add-category" onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            {isPending && <Preloader />}
            <div className={styles.form__conteiner}>
                <Input name="name" type="string" nameLabel={t('pages.cateringManagement.nameLabelName')} placeholder={t('pages.cateringManagement.placeholderCategory')} register={register} errors={errors} pattern={regexClientName} value={values.name}></Input>
                {defaultValues && !showAvailableMeals && availableMeals.length !== 0 ? (
                    <div className={styles.form__add}>
                        <ButtonIconAdd onClick={toggleClickAvailable}>{t('pages.cateringManagement.addMealToList')}</ButtonIconAdd>
                    </div>
                ) : availableMeals.length === 0 ? (
                    <p className={styles.form__subtitle}>Нет доступных блюд для добавления</p>
                ) : (
                    <p className={styles.form__subtitle}>{t('pages.cateringManagement.subtitleAddCategory')}</p>
                )}
            </div>
            {!defaultValues && availableMeals.length > 0 && (
                <ul className={styles.form__list}>
                    {availableMeals.map((meal) => (
                        <CategoryMealCard key={meal.id} meal={meal} isChecked={selectedMeals.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} available={true} />
                    ))}
                </ul>
            )}
            {defaultValues && currentCategoryMeals.length > 0 && (
                <>
                    {showAvailableMeals && availableMeals.length > 0 && (
                        <>
                            <ul className={styles.form__list}>
                                {availableMeals.map((meal) => (
                                    <CategoryMealCard key={meal.id} meal={meal} isChecked={selectedMeals.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} available={true} />
                                ))}
                            </ul>
                            <Button type="submit">{t('pages.cateringManagement.buttonAdd')}</Button>
                        </>
                    )}
                    <ul className={styles.form__list}>
                        {currentCategoryMeals.map((meal) => (
                            <CategoryMealCard key={meal.id} meal={meal} available={false} />
                        ))}
                    </ul>
                </>
            )}

            {!showAvailableMeals && <Button type="submit">{defaultValues ? t('pages.cateringManagement.buttonSave') : t('pages.cateringManagement.buttonAdd')}</Button>}
        </form>
    );
};

export default RegistrationCategory;
