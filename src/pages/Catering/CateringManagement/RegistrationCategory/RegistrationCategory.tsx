import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../../components/Input/Input';
import { useTranslation } from 'react-i18next';
import { regexClientName } from '../../../../utils/consts';
import CategoryMealCard from './CategoryMealCard/CategoryMealCard';
import { useGetCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import Button from '../../../../components/Button/Button';
import styles from './RegistrationCategory.module.scss';
import { useEffect, useState } from 'react';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useParams } from 'react-router-dom';

type RegistrationCategoryProps = {
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: {
        name: string;
        photo?: string;
        meal_ids: number[];
    };
    renderDeleteButton?: React.ReactNode;
};

const RegistrationCategory = ({ onSubmit, defaultValues, renderDeleteButton }: RegistrationCategoryProps) => {
    const { cateringId } = useParams();
    const { t } = useTranslation();
    const { data: meals, isSuccess, isPending } = useGetCateringMeals(Number(cateringId));
    const allMeals = isSuccess ? meals.data : [];
    const [showAvailableMeals, setShowAvailableMeals] = useState(false);
    const [selectedMeals, setSelectedMeals] = useState<number[]>(defaultValues?.meal_ids.map((id) => id) || []);
    const [tempSelected, setTempSelected] = useState<number[]>([]);
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        setValue,
    } = useForm<FieldValues>({ defaultValues });

    const values = watch();
    const availableMeals = allMeals.filter((meal) => !selectedMeals.includes(meal.id));
    const currentCategoryMeals = allMeals.filter((meal) => selectedMeals.includes(meal.id));

    const handleMealToggle = (mealId: number) => {
        setTempSelected((prev) => (prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]));
    };

    const handleDeleteCategory = (mealId: number) => {
        setSelectedMeals((prev) => {
            const newSelectedMeals = prev.filter((id) => id !== mealId);
            setValue('meal_ids', newSelectedMeals);
            return newSelectedMeals;
        });
    };

    const toggleClickAvailable = () => {
        setShowAvailableMeals((prev) => {
            if (!prev) {
                setTempSelected([]);
            }
            return !prev;
        });
    };

    const handleFormSubmit = (data: FieldValues) => {
        const finalMealIds = [...selectedMeals, ...tempSelected];
        onSubmit({
            ...data,
            meal_ids: finalMealIds,
        });
        setTempSelected([]);
    };

    useEffect(() => {
        setSelectedMeals(defaultValues?.meal_ids || []);
        setTempSelected([]);
    }, [defaultValues]);

    return (
        <form name="form-add-category" onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            {isPending && <Preloader />}
            <div className={styles.form__conteiner}>
                <Input name="name" type="string" nameLabel={t('pages.cateringManagement.nameLabelName')} placeholder={t('pages.cateringManagement.placeholderCategory')} register={register} errors={errors} pattern={regexClientName} value={values.name}></Input>
                <input
                    type="hidden"
                    {...register('meal_ids', {
                        validate: (value: number[]) => (value && value.length > 0) || t('components.input.necessaryAddAtLeastOneMeal'),
                    })}
                />
                {defaultValues && !showAvailableMeals && availableMeals.length !== 0 ? (
                    <div className={styles.form__add}>
                        <ButtonIconAdd onClick={toggleClickAvailable}>{t('pages.cateringManagement.addMeal')}</ButtonIconAdd>
                    </div>
                ) : availableMeals.length === 0 ? (
                    <p className={styles.form__subtitle}>{t('pages.cateringManagement.thereAreNoAvailableMealToAdd')}</p>
                ) : (
                    <div className={styles.form__component}>
                        <p className={styles.form__subtitle}>{t('pages.cateringManagement.chooseMeal')}</p>
                    </div>
                )}
            </div>
            {!defaultValues && availableMeals.length > 0 && (
                <ul className={styles.form__list}>
                    {availableMeals.map((meal) => (
                        <CategoryMealCard key={meal.id} meal={meal} isChecked={tempSelected.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} available={true} />
                    ))}
                </ul>
            )}
            {defaultValues && (
                <>
                    {showAvailableMeals && availableMeals.length > 0 && (
                        <>
                            <ul className={styles.form__list}>
                                {availableMeals.map((meal) => (
                                    <CategoryMealCard key={meal.id} meal={meal} isChecked={tempSelected.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} available={true} />
                                ))}
                            </ul>
                            <Button type="submit">{t('pages.cateringManagement.add')}</Button>
                        </>
                    )}
                    {currentCategoryMeals.length > 0 && (
                        <ul className={`${styles.form__list} ${currentCategoryMeals ? styles.form__list_current : ''}`}>
                            {currentCategoryMeals.map((meal) => (
                                <CategoryMealCard key={meal.id} meal={meal} available={false} onDelete={() => handleDeleteCategory(meal.id)} />
                            ))}
                        </ul>
                    )}
                </>
            )}
            {errors.meal_ids && <p className={styles.form__error}>{errors.meal_ids.message as string}</p>}
            {renderDeleteButton}
            {!showAvailableMeals && <Button type="submit">{defaultValues ? t('pages.cateringManagement.save') : t('pages.cateringManagement.add')}</Button>}
        </form>
    );
};

export default RegistrationCategory;
