import { Dispatch, SetStateAction } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import './DatePicker.scss';
import { ru } from 'react-day-picker/locale';

type DatePickerProps = {
    month: Date;
    setMonth: Dispatch<SetStateAction<Date>>;
    selected: Date | undefined;
    setSelected: Dispatch<SetStateAction<Date | undefined>>;
    onDayBlur: Dispatch<SetStateAction<boolean>>;
};

export function DatePicker({ month, setMonth, selected, setSelected, onDayBlur }: DatePickerProps) {
    return <DayPicker animate mode="single" month={month} onMonthChange={setMonth} selected={selected} onSelect={setSelected} onDayBlur={onDayBlur} navLayout="around" locale={ru} showOutsideDays hideWeekdays />;
}
