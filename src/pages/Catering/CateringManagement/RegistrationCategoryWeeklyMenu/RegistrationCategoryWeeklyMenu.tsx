import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useGetCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Preloader from '../../../../components/Preloader/Preloader';
import Input from '../../../../components/Input/Input';
import { useMemo, useState } from 'react';
import { regexClientName } from '../../../../utils/consts';
import styles from './RegistrationCategoryWeeklyMenu.module.scss';
import Button from '../../../../components/Button/Button';
import { useGetCategories } from '../../../../utils/hooks/useCategory/useCategory';
import CategoryMealCard from '../../../../components/Cards/CategoryMealCard/CategoryMealCard';

type RegistrationCategoryWeeklyMenuProps = {
    onSubmit: SubmitHandler<FieldValues>;
    defaultValues?: {
        name: string;
        mealIds: number[];
    };
};

const RegistrationCategoryWeeklyMenu = ({ onSubmit, defaultValues }: RegistrationCategoryWeeklyMenuProps) => {
    const { cateringId } = useParams();
    const { t } = useTranslation();
    const { data: meals, isSuccess, isPending } = useGetCateringMeals(Number(cateringId));
    const { data: categories } = useGetCategories(Number(cateringId));
    const [selectedMeals, setSelectedMeals] = useState<number[]>(defaultValues?.mealIds.map((id) => id) || []);
    const allMeals = isSuccess ? meals.data : [];
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const currentMeals = selectedCategoryIds.length === 0 ? allMeals : allMeals.filter((meal) => meal.category?.id && selectedCategoryIds.includes(meal.category.id));
    const currentCategoryMeals = allMeals.filter((meal) => selectedMeals.includes(meal.id));
    const {
        register,
        formState: { errors },
        watch,
        setValue,
        handleSubmit,
    } = useForm<FieldValues>({ defaultValues });

    const values = watch();

    const categoriesWithPhoto = useMemo(() => {
        if (!categories?.data || !meals?.data) return [];
        return categories.data.map((category) => ({
            ...category,
            photo: category.photo || meals.data.find((meal) => meal.id === category.meal_ids?.[0])?.photo,
        }));
    }, [categories, meals]);

    const handleMealToggle = (mealId: number) => {
        setSelectedMeals((prev) => {
            const updated = prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId];
            setValue('mealIds', updated);
            return updated;
        });
    };

    const handleDeleteCategoryWeeklyMenu = (mealId: number) => {
        setSelectedMeals((prev) => {
            const updated = prev.filter((id) => id !== mealId);
            setValue('mealIds', updated);
            return updated;
        });
    };

    const handleSortMeals = (categoryId: number) => {
        setSelectedCategoryIds((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
    };

    const handleFormSubmit = (data: FieldValues) => {
        onSubmit({
            ...data,
            meal_ids: selectedMeals,
        });
    };

    return (
        <form className={styles.form} name="form-category-weekly-menu" onSubmit={handleSubmit(handleFormSubmit)}>
            {isPending && <Preloader />}
            <Input name="name" type="string" nameLabel={t('pages.cateringManagement.nameLabelName')} placeholder={t('pages.cateringManagement.placeholderCategory')} register={register} errors={errors} pattern={regexClientName} value={values.name}></Input>

            {defaultValues && currentCategoryMeals.length > 0 && (
                <ul className={styles.form__list}>
                    {currentCategoryMeals.map((meal) => (
                        <CategoryMealCard key={meal.id} meal={meal} available={false} onDelete={() => handleDeleteCategoryWeeklyMenu(meal.id)} />
                    ))}
                </ul>
            )}

            <div className={styles.form__title}>{allMeals.length === 0 ? <p className={styles.form__text}>{t('pages.cateringManagement.thereAreNoAvailableMealToAdd')}</p> : <p className={styles.form__text}>{t('pages.cateringManagement.chooseMeal')}</p>}</div>

            {categories && categories.data.length > 0 && (
                <ul className={styles.form__category}>
                    {categoriesWithPhoto.map((category) => (
                        <li key={category.id} className={`${styles.form__category_item} ${selectedCategoryIds.includes(category.id) ? styles.form__category_active : ''}`} onClick={() => handleSortMeals(category.id)}>
                            <div className={styles.form__category_photo} style={{ backgroundImage: `url(${category.photo})` }}></div>
                            <p className={styles.form__category_name}>{category.name}</p>
                        </li>
                    ))}
                </ul>
            )}

            {allMeals.length > 0 && currentMeals.length > 0 && (
                <ul className={styles.form__list}>
                    {currentMeals.map((meal) => (
                        <CategoryMealCard key={meal.id} meal={meal} isChecked={selectedMeals.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} available={true} />
                    ))}
                </ul>
            )}

            <Button type="submit">{t('pages.cateringManagement.save')}</Button>
        </form>
    );
};

export default RegistrationCategoryWeeklyMenu;
