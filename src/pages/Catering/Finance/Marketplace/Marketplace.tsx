import { useState } from 'react';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../../../components/Preloader/Preloader';
import { useGetPayoutRequisites, useUpdatePayoutRequisites } from '../../../../utils/hooks/useFinance/useFinance';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import InfoCard from './InfoCard/InfoCard';
import styles from './Marketplace.module.scss';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FormPaymentRequisites from './FormPaymentRequisites/FormPaymentRequisites';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { PayloadPaymentRequisitesCard } from '../../../../utils/api/financeService/financeService';

const Marketplace = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: requisites, isLoading, error: requisitesError } = useGetPayoutRequisites();
    const { mutateAsync: updateRequisites, isPending, error: updateError } = useUpdatePayoutRequisites();

    const [isEditing, setIsEditing] = useState(false);
    const error = requisitesError || updateError;
    const errorMessage = error ? getErrorMessage(error, 'pages.finance.') : '';

    const handleClickEdit = () => {
        setIsEditing(!isEditing);
    };

    const cardItems: {
        label: string;
        value: string;
    }[] = [
        { label: t('pages.finance.nameLabelRecipientType'), value: requisites?.data.recipient_type || 'IP' },
        { label: t('pages.finance.nameLabelTax'), value: requisites?.data.tax_id || '' },
        { label: t('pages.finance.nameLabelBank'), value: requisites?.data.bank_name || '' },
        { label: t('pages.finance.nameLabelIBAN'), value: requisites?.data.iban || '' },
        { label: t('pages.finance.nameLabelIBic'), value: requisites?.data.bic || '' },
    ];

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        await updateRequisites(data as PayloadPaymentRequisitesCard);
        setIsEditing(false);
    };

    return (
        <Popup title={t('pages.finance.payoutsMarketplace')} arrowBack onClose={() => navigate('/catering/finance')}>
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            {(isLoading || isPending) && <Preloader />}

            {requisites?.data &&
                (!isEditing ? (
                    <div className={styles.marketplace}>
                        <InfoCard items={cardItems} />
                        <button type="button" className={styles.marketplace__button} onClick={handleClickEdit}>
                            {t('pages.finance.changeRequisite')}
                        </button>
                        <div className={styles.marketplace__info}>
                            <div className={styles.marketplace__info_icon} />
                            <p className={styles.marketplace__info_text}>{t('pages.finance.detailsForTransferringFundsFromOrdersWithBronfood')}</p>
                        </div>
                    </div>
                ) : (
                    <FormPaymentRequisites
                        onSubmit={onSubmit}
                        defaultValues={{
                            recipient_type: requisites?.data.recipient_type,
                            tax_id: requisites?.data.tax_id,
                            iban: requisites?.data.iban,
                            bic: requisites?.data.bic,
                        }}
                        isLoading={isPending}
                    />
                ))}
        </Popup>
    );
};

export default Marketplace;
