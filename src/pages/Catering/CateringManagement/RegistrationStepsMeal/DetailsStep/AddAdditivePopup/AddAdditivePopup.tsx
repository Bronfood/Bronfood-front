import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import Input from '../../../../../../components/Input/Input';
import { regexClientName } from '../../../../../../utils/consts';
import styles from './AddAdditivePopup.module.scss';
import { useTranslation } from 'react-i18next';

function AddAdditivePopup({ register, errors }: { register: UseFormRegister<FieldValues>; errors: FieldErrors }) {
    const { t } = useTranslation();
    return (
        <>
            <div>
                <h1>{t('pages.cateringManagement.titleAddAdditivePopup')}</h1>
                <button></button>
            </div>
            <Input type="string" nameLabel={t('pages.cateringManagement.nameLabelAddAdditive')} placeholder={t('pages.cateringManagement.placeholderAddAdditive')} register={register} errors={errors} pattern={regexClientName} name="addAdditive" />
            <div className={styles.size__info}>
                <div className={styles.sizes}>
                    <div className={styles.sizes__list}>
                        <input type="string" className={`${styles.sizes__input}`} placeholder="Название" />
                        <input type="number" className={`${styles.sizes__input}`} placeholder="Цена" />
                    </div>
                    <button type="button" className={`${styles.sizes__button} ${styles.sizes__button_delete}`}></button>
                </div>
            </div>
        </>
    );
}

export default AddAdditivePopup;
