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
        <>
            <Carousel items={types} selectedItems={selectedTypes} select={addType} deselect={deleteType} />
        </>
    );
}

export default MealsFilter;
