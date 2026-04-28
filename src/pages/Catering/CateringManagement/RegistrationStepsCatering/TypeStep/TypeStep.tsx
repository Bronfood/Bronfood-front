import styles from './TypeStep.module.scss';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import InputTag from '../../../../../components/InputTag/InputTag';
import { TYPES } from '../../../../../utils/api/cateringService/cateringService';

const TypeStep = () => {
    const { t } = useTranslation();
    const { setValue, watch, register } = useFormContext();
    const [currentTag, setCurrentTag] = useState('');
    const [error, setError] = useState<string>('');

    const selectedType = watch('type');
    const tags: { name: string }[] = watch('tags') || [];

    const handleTypeChange = (type: string) => {
        setValue('type', type, { shouldValidate: true });
    };

    const handleAddTag = (tag: string) => {
        if (tags.length >= 10) {
            setError(t('components.input.maximumTenTags'));
            return;
        }
        const newTags = [...tags, { name: tag }];
        setValue('tags', newTags, { shouldValidate: true });
        setCurrentTag('');
        setError('');
    };

    const handleDeleteTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setValue('tags', newTags, { shouldValidate: true });
        setError('');
    };

    const handleTagChange = (tag: string) => {
        setCurrentTag(tag);
        if (error) setError('');
    };

    return (
        <fieldset className={styles.fieldset}>
            <div className={styles.types}>
                <input
                    type="hidden"
                    {...register('type', {
                        required: t('components.input.required'),
                    })}
                />

                <p className={styles.types__title}>{t('pages.cateringManagement.chooseTypeOfVenue')}</p>
                <ul className={styles.types__list}>
                    {TYPES.map((type, index) => {
                        const isSelected = selectedType === type;
                        return (
                            <li key={index}>
                                <label htmlFor={type} className={styles.type__container}>
                                    <input id={type} className={styles.type__input} type="radio" checked={isSelected} onChange={() => handleTypeChange(type)} value={type} />
                                    <span className={styles.type__text}>{t(`pages.cateringManagement.${type}`)}</span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <InputTag tags={tags} errors={error} onDelete={handleDeleteTag} onAdd={handleAddTag} onChange={handleTagChange} nameLabel={t('pages.cateringManagement.nameLabelTags')} placeholder={t('pages.cateringManagement.placeholderTags')} value={currentTag} />
        </fieldset>
    );
};

export default TypeStep;
