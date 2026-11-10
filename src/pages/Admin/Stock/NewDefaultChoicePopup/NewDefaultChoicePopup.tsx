import { useTranslation } from 'react-i18next';
import styles from './NewDefaultChoicePopup.module.scss';
import Button from '../../../../components/Button/Button';
import { useState } from 'react';
import { MealChoice } from '../../../../utils/api/adminStockService/adminStockService';
import Modal from '../../../../components/Modal/Modal';

type NewDefaultChoicePopupProps = {
    availableChoices: MealChoice[];
    onClose: () => void;
    onConfirm: (newDefaultId: number) => void;
    isLoading?: boolean;
};

function NewDefaultChoicePopup({ availableChoices, onClose, onConfirm, isLoading }: NewDefaultChoicePopupProps) {
    const { t } = useTranslation();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <Modal>
            <div className={styles.popup__content}>
                <h2 className={styles.popup__title}>{t('pages.admin.selectNewDefaultOption')}</h2>
                <button className={styles.popup__close} type="button" onClick={onClose}></button>

                <ul className={styles.popup__list}>
                    {availableChoices.map((choice) => (
                        <li key={choice.id}>
                            <label className={styles.popup__item_label}>
                                <input className={styles.popup__item_input} type="radio" name="newDefault" value={choice.id} checked={selectedId === choice.id} onChange={() => setSelectedId(choice.id)} />
                                <span className={styles.popup__item_name}>{choice.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>

                <Button type="button" onClick={() => selectedId && onConfirm(selectedId)} disabled={!selectedId || isLoading}>
                    {t('pages.admin.saveChanges')}
                </Button>

                <div className={styles.popup__info}>
                    <div className={styles.popup__info_icon} />
                    <p className={styles.popup__info_text}>{t('pages.admin.chooseWhichTheRemainingOptionsWillBeMain')}</p>
                </div>
            </div>
        </Modal>
    );
}

export default NewDefaultChoicePopup;
