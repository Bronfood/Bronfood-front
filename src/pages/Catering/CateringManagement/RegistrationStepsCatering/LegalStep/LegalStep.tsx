import { useFormContext } from 'react-hook-form';
import Input from '../../../../../components/Input/Input';
import styles from './LegalStep.module.scss';
import { useTranslation } from 'react-i18next';
import { regexAddress, regexClientName, regexNumber, regexTextBasic } from '../../../../../utils/consts';
import FormInputs from '../../../../../components/FormInputs/FormInputs';

const LegalStep = () => {
    const { t } = useTranslation();
    const {
        register,
        formState: { errors },
        watch,
    } = useFormContext();

    const values = watch();

    return (
        <fieldset className={styles.fieldset}>
            <FormInputs>
                <Input name="legal_name" register={register} errors={errors} type="text" nameLabel={t('pages.cateringManagement.nameLegalName')} placeholder={t('pages.cateringManagement.placeholderLegalName')} pattern={regexTextBasic} value={values.legal_name} />
                <Input name="legal_address" register={register} errors={errors} type="text" nameLabel={t('pages.cateringManagement.nameLegalAddress')} placeholder={t('pages.cateringManagement.placeholderLegalAddress')} pattern={regexAddress} value={values.legal_address} />
                <Input name="legal_bin" register={register} errors={errors} type="text" nameLabel={t('pages.cateringManagement.nameLegalBin')} placeholder={t('pages.cateringManagement.placeholderLegalBin')} pattern={regexNumber} value={values.legal_bin} />
                <Input name="legal_director_fullname" register={register} errors={errors} type="text" nameLabel={t('pages.cateringManagement.nameLegalDirectorFullname')} placeholder={t('pages.cateringManagement.placeholderLegalDirectorFullname')} pattern={regexClientName} value={values.legal_director_fullname} />
            </FormInputs>
        </fieldset>
    );
};

export default LegalStep;
