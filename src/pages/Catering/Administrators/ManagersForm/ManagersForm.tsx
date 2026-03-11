import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Form from '../../../../components/Form/Form';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import InputPassword from '../../../../components/InputPassword/InputPassword';
import FormInputs from '../../../../components/FormInputs/FormInputs';
import { regexClientName } from '../../../../utils/consts';
import styles from './ManagersForm.module.scss';

type ManagersFormProps = {
    onSubmit: SubmitHandler<FieldValues>;
    isLoading?: boolean;
    defaultValues?: {
        username: string;
        name: string;
        password: string;
    };
    onCopied?: () => void;
    renderDeleteButton?: React.ReactNode;
};

const ManagersForm = ({ onSubmit, isLoading, defaultValues = { username: '', name: '', password: '' }, onCopied, renderDeleteButton }: ManagersFormProps) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({ defaultValues });

    const processSubmit = (data: FieldValues) => {
        onSubmit(data);
        const text = `Логин: ${data.username}\nФИО: ${data.name} \nПароль: ${data.password}`;

        navigator.clipboard.writeText(text).then(() => {
            onCopied?.();
        });
    };

    return (
        <Form name="form-administrators" onSubmit={handleSubmit(processSubmit)}>
            <FormInputs>
                {!defaultValues ? <Input type="text" name="username" placeholder={t('pages.administrators.placeholderLogin')} nameLabel={t('pages.administrators.nameLabelLogin')} register={register} errors={errors} pattern={regexClientName}></Input> : null}
                <Input type="text" name="name" placeholder={t('pages.administrators.placeholderFCs')} nameLabel={t('pages.administrators.nameLabelFCs')} register={register} errors={errors} pattern={regexClientName}></Input>
                <InputPassword name="password" nameLabel={t('pages.administrators.nameLabelPassword')} register={register} errors={errors} required></InputPassword>
            </FormInputs>
            <p className={styles['form__info_title']}>{t('pages.administrators.copyInvitationText')}</p>
            <Button type="submit" disabled={isLoading}>
                {t('pages.administrators.buttonSaveAndCopy')}
            </Button>
            {renderDeleteButton}
        </Form>
    );
};

export default ManagersForm;
