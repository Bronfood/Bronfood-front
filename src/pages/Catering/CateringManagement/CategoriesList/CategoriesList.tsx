import Preloader from '../../../../components/Preloader/Preloader';
import { useGetCategories } from '../../../../utils/hooks/useCategory/useCategory';
import styles from './CategoriesList.module.scss';

type CategoriesListProps = {
    onClick?: (categoryId: number) => void;
};

const CategoriesList = ({ onClick }: CategoriesListProps) => {
    const { data: categories, isLoading } = useGetCategories();
    return (
        <>
            {isLoading && <Preloader />}
            {categories?.data && categories.data.length > 0 ? (
                <ul className={styles.categories}>
                    {categories?.data.map((category) => {
                        return (
                            <li key={category.id} className={styles.category} onClick={() => onClick && onClick(category.id)}>
                                <div className={styles.category__image} style={{ backgroundImage: `url(${category.photo})` }}></div>
                                <p className={styles.category__name}>{category.name}</p>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </>
    );
};

export default CategoriesList;
