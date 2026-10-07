import { Category } from '../../utils/api/categoryService/categoryService';
import styles from './CategoryFilter.module.scss';
import { useTranslation } from 'react-i18next';

type CategoryFilterProps = {
    categories?: Category[];
    selectedIds: number[];
    select: (id: number) => void;
    deselect: (id: number) => void;
    uncategorized?: {
        selected: boolean;
        onSelect: () => void;
        onDeselect: () => void;
    };
    hidden?: {
        selected: boolean;
        onSelect: () => void;
        onDeselect: () => void;
    };
};

const CategoryFilter = ({ categories, selectedIds, select, deselect, uncategorized, hidden }: CategoryFilterProps) => {
    const { t } = useTranslation();

    return (
        <ul className={styles.categories}>
            {hidden && (
                <li onClick={() => (hidden.selected ? hidden.onDeselect() : hidden.onSelect())} className={`${styles.categories__item} ${hidden.selected ? styles.categories__item_selected : ''}`}>
                    <p className={styles.categories__name}>{t('pages.admin.hidden')}</p>
                </li>
            )}
            {uncategorized && (
                <li onClick={() => (uncategorized.selected ? uncategorized.onDeselect() : uncategorized.onSelect())} className={`${styles.categories__item} ${uncategorized.selected ? styles.categories__item_selected : ''}`}>
                    <p className={styles.categories__name}>{t('pages.admin.uncategorized')}</p>
                </li>
            )}
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
