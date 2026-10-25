import { FC } from 'react';
import styles from './ClientsList.module.scss';
import { RegularClient } from '../../../../../utils/api/adminClientService/adminClientService';
import { formatPhoneForDisplay } from '../../../../../utils/serviceFuncs/formatPhoneNumber';

interface ClientsList {
    clients: RegularClient[];
    onClick: (client: RegularClient) => void;
}

const ClientsList: FC<ClientsList> = (props) => {
    if (props.clients.length === 0) return null;

    return (
        <ul className={`${styles.clients} ${props.clients.length > 4 ? styles.clients__scroll : ''}`}>
            {props.clients.map((client) => (
                <li key={client.id} className={styles.clients__item} onClick={() => props.onClick(client)}>
                    <p className={styles.clients__item_phone}>{formatPhoneForDisplay(client.phone)}</p>
                    <p className={styles.clients__item_name}>{client.name}</p>
                </li>
            ))}
        </ul>
    );
};

export default ClientsList;
