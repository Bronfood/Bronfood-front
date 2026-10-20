import { FC } from 'react';
import styles from './ClientsList.module.scss';
import { RegularClient } from '../../../../../utils/api/adminNewOrderService/adminNewOrderService';

interface ClientsList {
    clients: RegularClient[];
    onClick: (client: RegularClient) => void;
}

const ClientsList: FC<ClientsList> = (props) => {
    return (
        props.clients.length > 0 && (
            <ul className={`${styles.clients} ${props.clients.length > 4 ? styles.clients__scroll : ''}`}>
                {props.clients.map((client) => (
                    <li key={client.id} className={styles.clients__item} onClick={() => props.onClick(client)}>
                        <p className={styles.clients__item_phone}>{client.phone}</p>
                        <p className={styles.clients__item_name}>{client.name}</p>
                    </li>
                ))}
            </ul>
        )
    );
};

export default ClientsList;
