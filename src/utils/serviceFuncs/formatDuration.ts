import { DurationUnit } from '../api/adminService/adminService';

export const formatDuration = (value: string | null | undefined, unit: DurationUnit): string | null => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const n = Number(value);
    if (!value || !Number.isFinite(n) || n <= 0) return null;
    const totalMin = unit === 'hour' ? n * 60 : n;
    return `${pad(Math.floor(totalMin / 60))}:${pad(totalMin % 60)}:00`;
};
