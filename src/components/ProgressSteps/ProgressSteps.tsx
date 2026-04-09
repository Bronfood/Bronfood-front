import { FC } from 'react';
import styles from './ProgressSteps.module.scss';

interface ProgressSteps {
    currentStep: number;
    totalSteps: number;
}

const ProgressSteps: FC<ProgressSteps> = ({ ...props }) => {
    const stepArray = Array.from({ length: props.totalSteps }, (_, i) => i + 1);

    return (
        <div className={styles['progress']}>
            {stepArray.map((step, index) => {
                const isActive = step === props.currentStep;
                const isCompleted = step < props.currentStep;
                const isLast = index === stepArray.length - 1;

                return (
                    <div key={index} className={styles['progress__step-wrapper']}>
                        <div className={`${styles['progress__step']} ${isCompleted ? styles['progress__step--completed'] : ''} ${isActive ? styles['progress__step--active'] : ''}`}>{step}</div>
                        {!isLast && (
                            <div
                                className={`
                                ${styles['progress__line']} ${isCompleted ? styles['progress__line--completed'] : ''}
                            `}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProgressSteps;
