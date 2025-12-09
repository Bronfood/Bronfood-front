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

    const mealsToCategory = allMeals.filter((meal) => !meal.category);

    const handleMealToggle = (mealId: number) => {
        setSelectedMeals((prev) => {
            const newSelectedMeals = prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId];
            setValue('meals', newSelectedMeals);

            return newSelectedMeals;
        });
    };

    const handleFormSubmit = (data: FieldValues) => {
        onSubmit(data);
    };

    return (
        <form name="form-add-category" onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            {isPending && <Preloader />}
            <div className={styles.form__conteiner}>
                <Input name="name" type="string" nameLabel={t('pages.cateringManagement.nameLabelName')} placeholder={t('pages.cateringManagement.placeholderCategory')} register={register} errors={errors} pattern={regexClientName} value={values.name}></Input>
                {defaultValues ? (
                    <div className={styles.form__add}>
                        <ButtonIconAdd>{t('pages.cateringManagement.addMealToList')}</ButtonIconAdd>
                    </div>
                ) : (
                    <p className={styles.form__subtitle}>{t('pages.cateringManagement.subtitleAddCategory')}</p>
                )}
            </div>
            {allMeals.length > 0 && <ul className={styles.form__list}>{defaultValues ? defaultValues.meals.map((meal) => <CategoryMealCard key={meal.id} meal={meal} isChecked={selectedMeals.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} exclude={true} />) : mealsToCategory.map((meal) => <CategoryMealCard key={meal.id} meal={meal} isChecked={selectedMeals.includes(meal.id)} onToggle={() => handleMealToggle(meal.id)} includes={true} />)}</ul>}
            <Button type="submit">{defaultValues ? t('pages.cateringManagement.buttonSave') : t('pages.cateringManagement.buttonAdd')}</Button>
        </form>
    );
};

export default RegistrationCategory;
