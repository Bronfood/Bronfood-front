import { Manager } from '../../../../../utils/api/managerService/managerService';
import styles from './ManagerDetails.module.scss';

function ManagerDetails({ manager, onEdit }: { manager: Manager; onEdit: (id: number) => void }) {
    const { username, name, id } = manager;
    return (
        <div className={styles.administrator}>
            <p className={styles.administrator__login}>{username}</p>
            <p className={styles.administrator__login}>{name}</p>
            <button className={styles.administrator__button} onClick={() => onEdit(id)}></button>
        </div>
    );
}

export default ManagerDetails;
