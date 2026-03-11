export const formatCancellationTime = (minutes?: number): string => {
    if (!minutes) return '00:00:00';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
};
