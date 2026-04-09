import { useNavigate } from 'react-router-dom';
import Preloader from '../../../components/Preloader/Preloader';
import Popup from '../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import { useGetCaterings } from '../../../utils/hooks/useCatering/useCatering';
import { CateringsList, EmptyCateringsList } from './CateringsList/CateringsList';

const Administrators = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: caterings, isLoading } = useGetCaterings();

    const onClose = () => {
        navigate('/');
    };

    const handleClickCatering = (cateringId: number) => {
        navigate(`/catering/${cateringId}/managers`);
    };

    return (
        <Popup title={t('pages.administrators.addAdministrator')} arrowBack onClose={onClose}>
            {isLoading && <Preloader />}
            {caterings?.data && caterings.data.length > 0 ? <CateringsList caterings={caterings.data} onClick={handleClickCatering} /> : <EmptyCateringsList />}
        </Popup>
    );
};

export default Administrators;
