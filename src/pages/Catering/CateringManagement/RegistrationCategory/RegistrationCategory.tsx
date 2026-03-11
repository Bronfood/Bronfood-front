import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../../components/Input/Input';
import { useTranslation } from 'react-i18next';
import { regexClientName } from '../../../../utils/consts';
import CategoryMealCard from './CategoryMealCard/CategoryMealCard';
import { useGetCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import Button from '../../../../components/Button/Button';
import styles from './RegistrationCategory.module.scss';
import { useState } from 'react';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useGetCategories } from '../../../../utils/hooks/useCategory/useCategory';
import { CateringMeal } from '../../../../utils/api/cateringMealService/cateringMealService';
import { useParams } from 'react-router-dom';

type RegistrationCategoryProps = {
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: {
        name: string;
        photo?: string;
        meals: CateringMeal[];
    };
    category?: boolean;
};

const RegistrationCategory = ({ onSubmit, defaultValues, category }: RegistrationCategoryProps) => {
    const { cateringId } = useParams();
    const { t } = useTranslation();
    const { data: meal, isSuccess, isPending } = useGetCateringMeals(Number(cateringId));
    const [showAvailableMeals, setShowAvailableMeals] = useState(false);
    const { data: categories } = useGetCategories();
    const allMeals = isSuccess ? meal.data : [];
    const [selectedMeals, setSelectedMeals] = useState<number[]>(defaultValues?.meals.map((meal) => meal.id) || []);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        setValue,
    } = useForm<FieldValues>({ defaultValues, mode: 'onChange' });

    const values = watch();
    const categoryMealIds = defaultValues?.meals.map((meal) => meal.id) || [];
    const availableMeals = allMeals.filter((meal) => !selectedMeals.includes(meal.id) || !categoryMealIds.includes(meal.id));
    const currentCategoryMeals = allMeals.filter((meal) => selectedMeals.includes(meal.id));
    const filteredAvailableMeals = selectedCategoryIds.length > 0 ? availableMeals.filter((meal) => meal.category && selectedCategoryIds.includes(meal.category.id)) : availableMeals;

    const validateMeals = (value: number[]) => {
        return value?.length > 0 || t('pages.error.addAtLeastOneMeal');
    };

    const handleMealToggle = (mealId: number) => {
        setSelectedMeals((prev) => {
            const newSelectedMeals = prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId];
            setValue('meals', newSelectedMeals, { shouldValidate: true });
            return newSelectedMeals;
        });
    };

    const handleDeleteCategory = (mealId: number) => {
        setSelectedMeals((prev) => {
            const newSelectedMeals = prev.filter((id) => id !== mealId);
            setValue('meals', newSelectedMeals);
            return newSelectedMeals;
        });
    };

    const toggleClickAvailable = () => {
        setShowAvailableMeals(!showAvailableMeals);
    };

    const handleFormSubmit = (data: FieldValues) => {
        const mealsData = allMeals.filter((meal) => selectedMeals.includes(meal.id));
        const photo = !defaultValues && !data.photo && mealsData.length > 0 ? mealsData[0].photo : data.photo;
        onSubmit({ ...data, meals: mealsData, photo });
    };

    const handleClickCategory = (categoryId: number) => {
        setSelectedCategoryIds((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
    };

    return (
        <form name="form-add-category" onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            {isPending && <Preloader />}
            <div className={styles.form__conteiner}>
                <Input name="name" type="string" nameLabel={t('pages.cateringManagement.nameLabelName')} placeholder={t('pages.cateringManagement.placeholderCategory')} register={register} errors={errors} pattern={regexClientName} value={values.name}></Input>
                <input
                    type="hidden"
                    {...register('meals', {
                        validate: validateMeals,
                    })}
                />
                {defaultValues && !showAvailableMeals && availableMeals.length !== 0 ? (
                    <div className={styles.form__add}>
                        <ButtonIconAdd onClick={toggleClickAvailable}>{t('pages.cateringManagement.addMealToList')}</ButtonIconAdd>
                    </div>
                ) : availableMeals.length === 0 ? (
                    <p className={styles.form__subtitle}>{t('pages.cateringManagement.thereAreNoAvailableMealToAdd')}</p>
                ) : (
                    <div className={styles.form__component}>
                        <p className={styles.form__subtitle}>{t('pages.cateringManagement.subtitleAddMeal')}</p>
                        {category && categories && categories.data.length > 0 && (
                            <ul className={styles.form__category}>
                                {categories.data
                                    /* .filter((cat) => availableMeals.some((meal) => meal.category?.id === cat.id)) */
                                    .map((cat) => {
                                        const hasAvailableMeals = availableMeals.some((meal) => meal.category?.id === cat.id);
                                        return (
                                            <li
                                                className={`${styles.form__category_item}
                        ${selectedCategoryIds.includes(cat.id) ? styles.form__category_select : ''}
                        ${!hasAvailableMeals ? styles.form__category_disabled : ''}`}
                                                key={cat.id}
                                                onClick={() => hasAvailableMeals && handleClickCategory(cat.id)}
                                            >
                                                <div className={styles.form__category_photo} style={{ backgroundImage: `url(${cat.photo})` }}></div>
                                                <p className={styles.form__category_name}>{cat.name}</p>
                                            </li>
                                        );
                                    })}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {!defaultValues && availableMeals.length > 0 && (
                <ul className={styles.form__list}>
                    {filteredAvailableMeals.map((meal) => (
                        <CategoryMealCard key={meal.id} meal={meal} isChecked={selectedMeals.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} available={true} />
                    ))}
                </ul>
            )}
            {defaultValues && (
                <>
                    {showAvailableMeals && availableMeals.length > 0 && (
                        <>
                            <ul className={styles.form__list}>
                                {filteredAvailableMeals.map((meal) => (
                                    <CategoryMealCard key={meal.id} meal={meal} isChecked={selectedMeals.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} available={true} />
                                ))}
                            </ul>
                            <Button type="submit">{t('pages.cateringManagement.buttonAdd')}</Button>
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
            {errors.meals && (
                <div className={styles.form__error}>
                    <ErrorMessage message={errors.meals.message as string} />
                </div>
            )}
            {!showAvailableMeals && <Button type="submit">{defaultValues ? t('pages.cateringManagement.buttonSave') : t('pages.cateringManagement.buttonAdd')}</Button>}
        </form>
    );
};

export default RegistrationCategory;
