import { Category } from '../../../../utils/api/cateringService/cateringService';
import styles from './CategoriesList.module.scss';

type CategoriesListProps = {
    categories: Category[];
    onClick?: (categoryId: number) => void;
};

const CategoriesList = ({ categories, onClick }: CategoriesListProps) => {
    return (
        <ul className={styles.categories}>
            {categories.map((category) => {
                return (
                    <li key={category.id} className={styles.category} onClick={() => onClick && onClick(category.id)}>
                        <div className={styles.category__image} style={{ backgroundImage: `url(${category.photo})` }}></div>
                        <p className={styles.category__name}>{category.name}</p>
                    </li>
                );
            })}
        </ul>
    );
};

export default CategoriesList;
