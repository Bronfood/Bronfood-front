import NewPassword from './NewPassword/NewPassword';
import SMSVerify from '../../components/SMSVerify/SMSVerify';
import SuccessPasswordChange from './SuccessPasswordChange/SuccessPasswordChange';
import QueryPhone from './QueryPhone/QueryPhone';
import { useState } from 'react';
import Preloader from '../../components/Preloader/Preloader';
import { useCurrentUser } from '../../utils/hooks/useCurrentUser/useCurretUser';
import { getErrorMessage } from '../../utils/serviceFuncs/getErrorMessage';

type TypeStage = 'START' | 'PHONE-EXIST' | 'NEW-PASSWORD-GIVEN' | 'SUCCESS';

const RestorePassword = () => {
    const { restorePassword, confirmRestorePassword } = useCurrentUser();
    const restorePasswordErrorMessage = restorePassword.isError ? getErrorMessage(restorePassword.error, 'components.passwordRecovery.') : '';
    const confirmRestorePasswordErrorMessage = confirmRestorePassword.isError ? getErrorMessage(confirmRestorePassword.error, 'components.passwordRecovery.') : '';
    const isLoading = restorePassword.isPending || confirmRestorePassword.isPending;
    const [credentials, setCredentials] = useState({ newPassword: '', reNewPassword: '' });
    const [stage, setStage] = useState<TypeStage>('START');

    const onSubmitQueryPhone = async (phoneNumber: string) => {
        await restorePassword.mutateAsync({ phone: phoneNumber });
        setStage('PHONE-EXIST');
    };

    const onChangePassword = async (password: string, password_confirm: string) => {
        setCredentials({
            newPassword: password,
            reNewPassword: password_confirm,
        });
        setStage('NEW-PASSWORD-GIVEN');
    };

    const onSubmitApplyPassword = async (code: string) => {
        await confirmRestorePassword.mutateAsync({
            newPassword: credentials.newPassword,
            reNewPassword: credentials.reNewPassword,
            code,
        });
        setStage('SUCCESS');
        setCredentials({
            newPassword: '',
            reNewPassword: '',
        });
    };

    const renderStage = () => {
        switch (stage) {
            case 'START':
                return <QueryPhone isErrorVisible={restorePassword.isError} error={restorePasswordErrorMessage} onSubmit={onSubmitQueryPhone} />;

            case 'PHONE-EXIST':
                return <NewPassword onSubmit={onChangePassword} />;

            case 'NEW-PASSWORD-GIVEN':
                return <SMSVerify isErrorVisible={confirmRestorePassword.isError} error={confirmRestorePasswordErrorMessage} onSubmit={onSubmitApplyPassword} />;

            case 'SUCCESS':
                return <SuccessPasswordChange />;
        }
    };

    return <>{isLoading ? <Preloader /> : renderStage()}; </>;
};

export default RestorePassword;
