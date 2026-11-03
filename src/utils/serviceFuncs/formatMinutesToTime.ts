export const formatMinutesToTime = (minutes: string | number): string => {
    const mins = typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;
    if (isNaN(mins) || mins < 0) return '00:00:00';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    return `${String(hours).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}:00`;
};
