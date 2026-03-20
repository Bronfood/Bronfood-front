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
};

export function DatePicker({ month, setMonth, selected, setSelected }: DatePickerProps) {
    return <DayPicker animate mode="single" month={month} onMonthChange={setMonth} selected={selected} onSelect={setSelected} navLayout="around" locale={ru} showOutsideDays hideWeekdays />;
}
