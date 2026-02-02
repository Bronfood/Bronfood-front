import Popup from '../../components/Popups/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import styles from './LisenceAgreement.module.scss';

function LisenceAgreement() {
    const navigate = useNavigate();
    const onClose = () => {
        navigate('/');
    };

    return (
        <Popup title="Публичная оферта (Лицензионное соглашение)" arrowBack previousPageRoute="/feedback" onClose={onClose}>
            <div className={styles['lisence-agreement__layout']}>
                <div className={styles['lisence-agreement__main']}>Бронфуд-это маркетплейс для заказа еды на вынос. Больше не нужно ждать, когда приготовят ваш заказ. Оплачивайте и приходите, когда уже всё готово!</div>
                <div>Юридическое название: ТОО Бронфуд БИН: 240340023652 Местоположение: Казахстан, город Астана, район Алматы, улица ШамшиКалдаякова, дом 1, кв. 3, почтовый индекс Z01B9H2</div>
            </div>
        </Popup>
    );
}

export default LisenceAgreement;
