import { useState, MouseEvent } from 'react';
import BalanceCard from './BalanceCard/BalanceCard';
import FinanceStats from './FinanceStats/FinanceStats';
import PaymentMethods from './PaymentMethods/PaymentMethods';
import styles from './Wallet.module.scss';
import Input from '../../../../components/Input/Input';
import { regexNumber } from '../../../../utils/consts';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Form from '../../../../components/Form/Form';
import Button from '../../../../components/Button/Button';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeletePaymentRequisitesCard, useGetPaymentRequisitesCards, useGetWallet, useRefillWallet } from '../../../../utils/hooks/useFinance/useFinance';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import Preloader from '../../../../components/Preloader/Preloader';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';

const Wallet = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: requisitesCards, isLoading: requisitesCardsLoading, error: requisitesCardsError } = useGetPaymentRequisitesCards();
    const { data: wallet, isLoading: walletLoading, error: walletError } = useGetWallet();
    const { mutateAsync: refillWallet, isPending: isRefillWallet, error: refillWalletError } = useRefillWallet();
    const { mutateAsync: deleteMealRequisites, isPending: isDeleting, error: deleteError } = useDeletePaymentRequisitesCard();

    const [isClick, setIsClick] = useState(false);
    const [showConfirmationPopupDeleteCard, setShowConfirmationPopupDeleteCard] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm();
    const values = watch();
    const error = requisitesCardsError || walletError || refillWalletError || deleteError;
    const errorMessage = error ? getErrorMessage(error, 'pages.finance.') : '';

    const handleClickAdd = () => {
        console.log('add card');
    };

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopupDeleteCard(false);
        }
    };

    const handleClickDelete = (id: number) => {
        setCardToDelete(id);
        setShowConfirmationPopupDeleteCard(true);
    };

    const handleConfirmDelete = async () => {
        if (cardToDelete === null) return;
        await deleteMealRequisites(cardToDelete);
        setShowConfirmationPopupDeleteCard(false);
        setCardToDelete(null);
    };

    const handleClickRefill = () => {
        setIsClick(!isClick);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        await refillWallet(Number(data.amount));
        reset();
        setIsClick(false);
    };

    return (
        <>
            <Popup title={t('pages.finance.payoutsMarketplace')} arrowBack onClose={() => navigate('/catering/finance')}>
                {(requisitesCardsLoading || walletLoading || isRefillWallet || isDeleting) && <Preloader />}

                {error && (
                    <div style={{ padding: '0 20px' }}>
                        <ErrorMessage message={errorMessage} />
                    </div>
                )}

                {wallet?.data && wallet.data && (
                    <div className={styles.wallet}>
                        <BalanceCard balance={wallet?.data.balance} onClick={handleClickRefill} isClick={isClick} dailyDeduction={wallet.data.debit_day} />
                        {!isClick ? (
                            <>
                                <FinanceStats subtitle={{ subtitleCatering: String(wallet.data.caterings), subtitleDebitPerDay: `${wallet.data.debit_day.toLocaleString('ru-RU')} ₸`, subtitleDebtPerMonth: `${wallet.data.debit_monthly.toLocaleString('ru-RU')} ₸`, subtitleBalanceIsEnough: new Date(wallet.data.payment_date).toLocaleDateString('ru-RU') }} />
                                <PaymentMethods cards={requisitesCards?.data || []} onDelete={handleClickDelete} onAdd={handleClickAdd} />
                            </>
                        ) : (
                            <Form name="amount-form" onSubmit={handleSubmit(onSubmit)}>
                                <fieldset className={styles.wallet__fieldset}>
                                    <Input type="number" name="amount" nameLabel={t('pages.finance.nameLabelAmount')} placeholder={t('pages.finance.placeholderAmount')} register={register} errors={errors} pattern={regexNumber} value={values.amount} />
                                    <Button type="submit" disabled={isRefillWallet}>
                                        {t('pages.finance.refillCard')}
                                    </Button>
                                </fieldset>
                            </Form>
                        )}
                    </div>
                )}
            </Popup>

            {showConfirmationPopupDeleteCard && (
                <div className={styles['popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup
                        title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheCard')}
                        confirmButtonText={t('components.confirmationPopup.delete')}
                        onCancel={() => {
                            setShowConfirmationPopupDeleteCard(false);
                            setCardToDelete(null);
                        }}
                        onSubmit={handleConfirmDelete}
                    />
                    {isDeleting && (
                        <div className={styles['preloader-wrapper']}>
                            <Preloader />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Wallet;
