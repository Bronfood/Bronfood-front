import styles from './Preloader.module.scss';

const Preloader = ({ className = '' }: { className?: string }) => {
    return (
        <div className={`${styles.preloader} ${className}`}>
            <div className={styles.preloader__load}></div>
        </div>
    );
};

export default Preloader;
