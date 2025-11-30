import { FC, useCallback, useEffect, useState } from 'react';

type OrderTimerProps = {
    startTime: string;
    waitingTime: string;
};

const parseWaitingTime = (timeStr: string): number => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
};

function pluralize(number: number, one: string, few: string, many: string): string {
    const mod10 = number % 10;
    const mod100 = number % 100;

    if (mod100 >= 11 && mod100 <= 14) {
        return many;
    }
    if (mod10 === 1) {
        return one;
    }
    if (mod10 >= 2 && mod10 <= 4) {
        return few;
    }
    return many;
}

function formatApproximateTime(totalSeconds: number): string {
    const totalMinutes = Math.ceil(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const hoursPart = hours > 0 ? `${hours} ${pluralize(hours, 'час', 'часа', 'часов')}` : '';

    const minutesPart = minutes > 0 ? `${minutes} ${pluralize(minutes, 'минута', 'минуты', 'минут')}` : '';

    if (hoursPart && minutesPart) {
        return `${hoursPart} ${minutesPart}`;
    } else if (hoursPart) {
        return `${hoursPart}`;
    } else {
        return `${minutesPart}`;
    }
}

const MyOrderTimer: FC<OrderTimerProps> = ({ startTime, waitingTime }) => {
    const deadline = new Date(startTime).getTime() + parseWaitingTime(waitingTime);

    const getRemaining = useCallback(() => {
        const now = Date.now();
        const diffInMs = Math.max(deadline - now, 0);
        const diffInSec = Math.floor(diffInMs / 1000);

        return {
            timeInSeconds: diffInSec,
            done: diffInMs <= 0,
        };
    }, [deadline]);

    const [timeLeft, setTimeLeft] = useState(getRemaining());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getRemaining());
        }, 60000);
        return () => clearInterval(interval);
    }, [getRemaining]);

    if (timeLeft.done) return <p>Задерживаемся, заказ скоро будет готов</p>;

    return <p>~ {formatApproximateTime(timeLeft.timeInSeconds)}</p>;
};

export default MyOrderTimer;
