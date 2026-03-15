import styles from './MealsFilter.module.scss';
import { MealType } from '../../../../utils/api/restaurantsService/restaurantsService';
import Chip from './Chip/Chip';

type MealsFilterProps = {
    types: MealType[];
    selectedTypes: MealType[];
    addType: (type: MealType) => void;
    deleteType: (type: MealType) => void;
};

function MealsFilter({ types, selectedTypes, addType, deleteType }: MealsFilterProps) {
    return (
        <ul className={`${styles['meals-filter']}`}>
            {types.map((type, index) => {
                const isActive = selectedTypes.includes(type);
                return (
                    <li key={`${type}-${index}`}>
                        <Chip text={type} isActive={isActive} add={() => addType(type)} delete={() => deleteType(type)} />
                    </li>
                );
            })}
        </ul>
    );
}

export default MealsFilter;
