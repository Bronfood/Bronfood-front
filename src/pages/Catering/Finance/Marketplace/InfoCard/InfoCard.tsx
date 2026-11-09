import styles from './InfoCard.module.scss';

function InfoCard({
    items,
}: {
    items: {
        label: string;
        value: string;
    }[];
}) {
    return (
        <dl className={styles['list']}>
            {items.map((item, index) => (
                <div key={index} className={styles['list__item']}>
                    <dt className={styles['list__item_label']}>{item.label}</dt>
                    <dd className={styles['list__item_value']}>{item.value}</dd>
                </div>
            ))}
        </dl>
    );
}

export default InfoCard;
