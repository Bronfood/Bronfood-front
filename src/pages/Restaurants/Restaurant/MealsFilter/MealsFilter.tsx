import styles from './MealsFilter.module.scss';
import { MealType } from '../../../../utils/api/restaurantsService/restaurantsService';
import Carousel from '../../../../components/Carousel/Carousel';

type MealsFilterProps = {
    types: MealType[];
    selectedTypes: MealType[];
    addType: (type: MealType) => void;
    deleteType: (type: MealType) => void;
};

function MealsFilter({ types, selectedTypes, addType, deleteType }: MealsFilterProps) {
    return (
        <div className={`${styles['meals-filter']}`}>
            <Carousel items={types} selectedItems={selectedTypes} select={addType} deselect={deleteType} />
        </div>
    );
}

export default MealsFilter;
