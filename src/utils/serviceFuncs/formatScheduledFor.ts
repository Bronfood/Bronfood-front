import { CookMethod, DurationUnit, PreOrderType } from '../api/adminService/adminService';
import { RESTAURANT_UTC_OFFSET_MIN } from '../consts';

type ScheduledParams = {
    cookMethod: CookMethod;
    preOrderType: PreOrderType;
    inTime?: string;
    inTimeUnit: DurationUnit;
    certainTime?: string;
    utcOffsetMin?: number;
};

const formatWithOffset = (shifted: Date, offsetMin: number): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const sign = offsetMin >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMin);
    return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
};

export const formatScheduledFor = ({ cookMethod, preOrderType, inTime, inTimeUnit, certainTime, utcOffsetMin = RESTAURANT_UTC_OFFSET_MIN }: ScheduledParams): string | undefined => {
    if (cookMethod !== 'preOrder') return undefined;

    const nowShifted = new Date(Date.now() + utcOffsetMin * 60_000);

    if (preOrderType === 'inTime') {
        const n = Number(inTime);
        if (!n) return undefined;
        const ms = n * (inTimeUnit === 'hour' ? 3_600_000 : 60_000);
        return formatWithOffset(new Date(nowShifted.getTime() + ms), utcOffsetMin);
    }

    const match = /^(\d{1,2}):(\d{2})$/.exec(certainTime ?? '');
    if (!match) return undefined;
    const target = new Date(nowShifted);
    target.setUTCHours(Number(match[1]), Number(match[2]), 0, 0);
    if (target.getTime() <= nowShifted.getTime()) target.setUTCDate(target.getUTCDate() + 1);
    return formatWithOffset(target, utcOffsetMin);
};
