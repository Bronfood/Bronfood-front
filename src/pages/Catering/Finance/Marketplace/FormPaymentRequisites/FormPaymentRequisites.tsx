import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Form from '../../../../../components/Form/Form';
import InputSelect from './InputSelect/InputSelect';
import FormInputs from '../../../../../components/FormInputs/FormInputs';
import Input from '../../../../../components/Input/Input';
import { regexNumber, regexNumberAndText } from '../../../../../utils/consts';
import Button from '../../../../../components/Button/Button';
import { useTranslation } from 'react-i18next';

type FormPaymentRequisitesProps = {
    onSubmit: SubmitHandler<FieldValues>;
    isLoading?: boolean;
    defaultValues?: {
        recipient_type: 'IP' | 'TOO';
        tax_id: string;
        iban: string;
        bic: string;
    };
};

function FormPaymentRequisites({ onSubmit, isLoading, defaultValues }: FormPaymentRequisitesProps) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({ defaultValues });

    const values = watch();

    const processSubmit = (data: FieldValues) => {
        onSubmit(data);
    };

    return (
        <Form name="amount-form" onSubmit={handleSubmit(processSubmit)}>
            <FormInputs>
                <InputSelect value={values.recipient_type} options={['IP', 'TOO']} onChange={(value) => setValue('recipient_type', value, { shouldValidate: true })} />
                <Input type="text" name="tax_id" nameLabel={t('pages.finance.nameLabelTax')} placeholder={t('pages.finance.placeholderTax')} errors={errors} register={register} pattern={regexNumber} value={values.tax_id} />
                <Input type="text" name="iban" nameLabel={t('pages.finance.nameLabelIBAN')} placeholder={t('pages.finance.placeholderIBAN')} errors={errors} register={register} pattern={regexNumberAndText} value={values.iban} />
                <Input type="text" name="bic" nameLabel={t('pages.finance.nameLabelIBic')} placeholder={t('pages.finance.placeholderBic')} errors={errors} register={register} pattern={regexNumberAndText} value={values.bic} />
            </FormInputs>

            <Button disabled={isLoading} type="submit">
                {t('pages.finance.saveChange')}
            </Button>
        </Form>
    );
}

export default FormPaymentRequisites;
