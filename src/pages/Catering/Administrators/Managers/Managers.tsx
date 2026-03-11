import styles from './Managers.module.scss';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useGetManagers } from '../../../../utils/hooks/useManagers/useManagers';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../../components/Preloader/Preloader';
import { useTranslation } from 'react-i18next';
import Popup from '../../../../components/Popups/Popup/Popup';
import ManagerDetails from './ManagerDetails/ManagerDetails';

const Managers = () => {
    const { t } = useTranslation();
    const { cateringId } = useParams();
    const navigate = useNavigate();
    const { data, isSuccess, isPending } = useGetManagers(Number(cateringId));
    const managers = isSuccess ? data.data : [];

    const onClose = () => {
        navigate('/');
    };

    const addManager = () => {
        navigate(`/catering/${cateringId}/managers/add-manager`);
    };

    const editManager = (managerId: number) => {
        navigate(`/catering/${cateringId}/managers/${managerId}`);
    };

    return (
        <Popup title={t('pages.administrators.titleAdd')} arrowBack onClose={onClose}>
            {isPending && <Preloader />}
            <ul className={styles.managers}>
                {managers.map((manager) => {
                    return (
                        <li key={manager.id}>
                            <ManagerDetails manager={manager} onEdit={() => editManager(manager.id)} />
                        </li>
                    );
                })}
            </ul>
            <ButtonIconAdd onClick={addManager}>{t('pages.administrators.buttonAdd')}</ButtonIconAdd>
        </Popup>
    );
};

export default Managers;
