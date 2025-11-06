import ButtonIconAdd from '../../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useTranslation } from 'react-i18next';
import { CateringMeal } from '../../../../../utils/api/cateringService/cateringService';
import { useState } from 'react';
import ListMealItem from './ListMealItem/ListMealItem';
import styles from './ListMealStep.module.scss';

const ListMealStep = ({ meals, onDelete, onEdit, onAddMeal }: { meals: Omit<CateringMeal, 'id'>[]; onDelete: (index: number) => void; onEdit: (index: number) => void; onAddMeal: () => void }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {meals.length > 0 && (
                <ul className={styles.list}>
                    {meals.map((meal, index) => (
                        <ListMealItem key={index} onClick={toggleClick} meal={meal} isOpen={isOpen} onDelete={() => onDelete(index)} onEdit={() => onEdit(index)} />
                    ))}
                </ul>
            )}
            <ButtonIconAdd onClick={onAddMeal}>{t('pages.cateringManagement.addMealToList')}</ButtonIconAdd>
        </>
    );
};

export default ListMealStep;
