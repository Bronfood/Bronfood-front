import { Category } from '../../utils/api/categoryService/categoryService';
import styles from './CategoryFilter.module.scss';

type CategoryFilterProps = {
    categories: Category[];
    selectedIds: number[];
    select: (id: number) => void;
    deselect: (id: number) => void;
    customFilters?: {
        name: string;
        text: string;
        selected: boolean;
        onSelect: () => void;
        onDeselect: () => void;
    }[];
};

const CategoryFilter = ({ categories, selectedIds, select, deselect, customFilters }: CategoryFilterProps) => {
    return (
        <ul className={styles.categories}>
            {customFilters?.map((filter) => (
                <li key={filter.name} onClick={() => (filter.selected ? filter.onDeselect() : filter.onSelect())} className={`${styles.categories__item} ${filter.selected ? styles.categories__item_selected : ''}`}>
                    <p className={styles.categories__name}>{filter.text}</p>
                </li>
            ))}
            {categories &&
                categories.map((category) => {
                    const isSelected = selectedIds.includes(category.id);
                    const handleClick = () => (isSelected ? deselect(category.id) : select(category.id));

                    return (
                        <li key={category.id} onClick={handleClick} className={`${styles.categories__item} ${isSelected ? styles.categories__item_selected : ''}`}>
                            <p className={styles.categories__name}>{category.name}</p>
                        </li>
                    );
                })}
        </ul>
    );
};

export default CategoryFilter;
