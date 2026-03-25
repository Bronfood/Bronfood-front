import { Category } from '../../../../utils/api/categoryService/categoryService';
import styles from './CategoriesList.module.scss';
import { useTranslation } from 'react-i18next';

type CategoriesListProps = {
    onClick?: (categoryId: number) => void;
    categories: Category[];
};

const CategoriesList = ({ onClick, categories }: CategoriesListProps) => {
    const { t } = useTranslation();
    return (
        <ul className={styles.categories}>
            {categories.map((category) => (
                <li key={category.id} className={styles.category} onClick={() => onClick && onClick(category.id)}>
                    <div className={styles.category__image}>{category.photo ? <div className={styles.category__imageBg} style={{ backgroundImage: `url(${category.photo})` }} /> : <p className={styles.category__noPhoto}>{t('pages.cateringManagement.noPhoto')}</p>}</div>
                    <p className={styles.category__name}>{category.name}</p>
                </li>
            ))}
        </ul>
    );
};

export default CategoriesList;
