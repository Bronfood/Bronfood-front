import { FC, useCallback, useEffect, useRef, useState } from 'react';
import ButtonUnderline from '../ButtonUnderline/ButtonUnderline';
import styles from './Captcha.module.scss';
import { formatSecondsToMinutes } from '../../utils/serviceFuncs/formatSecondsToMinutes';
import { useTranslation } from 'react-i18next';
import Preloader from '../Preloader/Preloader';
import { CaptchaResponse } from '../../utils/api/authService';

interface Captcha {
    data?: CaptchaResponse;
    refetch: () => Promise<unknown>;
    isLoading?: boolean;
}

const Captcha: FC<Captcha> = ({ data, refetch, isLoading }: Captcha) => {
    const { t } = useTranslation();
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isReloadingCaptcha = useRef(false);
    const isFirstRender = useRef(true);

    const handleReloadClick = useCallback(async () => {
        if (isReloadingCaptcha.current) return;
        isReloadingCaptcha.current = true;
        try {
            setTimer(0);
            await refetch();
        } finally {
            isReloadingCaptcha.current = false;
        }
    }, [refetch]);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (data?.ttl) {
            if (isFirstRender.current && data.ttl <= 0) return;
            setTimer(data.ttl);
        }
    }, [data]);

    useEffect(() => {
        clearTimer();

        if (timer > 0) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => {
            clearTimer();
        };
    }, [timer, clearTimer]);

    useEffect(() => {
        if (isFirstRender.current) return;
        if (timer === 0 && !isReloadingCaptcha.current) {
            refetch();
        }
    }, [timer, refetch]);

    useEffect(() => {
        isFirstRender.current = false;
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    return (
        <div className={styles.captcha}>
            {isLoading || !data ? (
                <Preloader />
            ) : (
                <div className={styles.captcha__content}>
                    <div style={{ backgroundImage: `url(${data.image})` }} className={styles.captcha__image}></div>
                    <ButtonUnderline type="button" onClick={handleReloadClick}>
                        {t('pages.signUp.reloadCaptcha')}
                        <div className={styles.captcha__timer}>
                            <span className={styles.captcha__timer_span}>(</span>
                            <p className={styles.captcha__timer_text}>{formatSecondsToMinutes(timer)}</p>
                            <span>)</span>
                        </div>
                    </ButtonUnderline>
                </div>
            )}
        </div>
    );
};

export default Captcha;
