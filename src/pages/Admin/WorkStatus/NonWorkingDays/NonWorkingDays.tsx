import styles from './NonWorkingDays.module.scss';

type NonWorkingDaysProps = {
    days: string[] | [];
};

function NonWorkingDays({ days }: NonWorkingDaysProps) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Выходные в этом месяце</h2>
            <ul className={styles.list}>
                {days.map((day) => {
                    return (
                        <li key={`${day}`}>
                            <p>{day}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default NonWorkingDays;
