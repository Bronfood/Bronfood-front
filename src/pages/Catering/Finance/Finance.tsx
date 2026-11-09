import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Popup from '../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import FinanceNavigation from './FinanceNavigation/FinanceNavigation';

const Finance = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const isFinanceRoot = location.pathname.endsWith('/finance');

    if (isFinanceRoot) {
        return (
            <Popup title={t('pages.finance.finance')} arrowBack onClose={() => navigate('/')}>
                <FinanceNavigation />
            </Popup>
        );
    }

    return <Outlet />;
};

export default Finance;
