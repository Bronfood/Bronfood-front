import { useFormContext } from 'react-hook-form';
import Input from '../../../../../../components/Input/Input';
import { regexClientName } from '../../../../../../utils/consts';
import styles from './AddAdditivePopup.module.scss';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Button from '../../../../../../components/ButtonIconSquare/ButtonIconSquare';
import ButtonSubmit from '../../../../../../components/Button/Button';

function AddAdditivePopup({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const [isInfo, setIsInfo] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleInfoToggle = () => {
        setIsInfo(!isInfo);
    };

    return (
        <div className={styles.popup__overlay}>
            <div className={styles.popup}>
                <div className={styles.popup__content}>
                    <div onClick={onClose} className={styles.popup__close}>
                        <Button type="button" icon="close" />
                    </div>
                    <div>
                        <h1 className={styles.popup__title}>
                            {t('pages.cateringManagement.titleAddAdditivePopup')}
                            <button type="button" className={styles.info} onClick={handleInfoToggle}></button>
                        </h1>

                        {isInfo && (
                            <div className={styles.info__wrapper}>
                                <p className={styles.info__text}>{t('pages.cateringManagement.infoTextMainMealSizes')}</p>
                            </div>
                        )}
                    </div>
                    <Input type="string" nameLabel={t('pages.cateringManagement.nameLabelAddAdditive')} placeholder={t('pages.cateringManagement.placeholderAddAdditive')} register={register} errors={errors} pattern={regexClientName} name="addAdditive" />

                    <ul>
                        <div className={styles.additive}>
                            <div className={styles.additive__inputs}>
                                <input name="additiveName" type="string" className={`${styles.additive__input}`} placeholder="Название" />
                                <input name="additivePrice" type="number" className={`${styles.additive__input}`} placeholder="Цена" />
                            </div>
                            <button type="button" className={`${styles.additive__button} ${styles.additive__button_delete}`}></button>
                        </div>
                    </ul>

                    <button type="button" className={styles.additive__button_wrapper}>
                        <div className={styles.additive__button_add}></div>
                    </button>

                    <ButtonSubmit type="button">{t('pages.cateringManagement.buttonSave')}</ButtonSubmit>
                </div>
            </div>
        </div>
    );
}

export default AddAdditivePopup;
