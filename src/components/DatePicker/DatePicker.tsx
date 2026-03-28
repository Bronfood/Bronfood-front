import { Dispatch, SetStateAction } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import './DatePicker.scss';
import { ru } from 'react-day-picker/locale';

type DatePickerProps = {
    month: Date;
    setMonth: Dispatch<SetStateAction<Date>>;
    selected: Date | undefined;
    onSelect: () => void;
    onChange: () => void;
    onDayBlur: () => void;
};

export function DatePicker({ month, setMonth, selected, onSelect, onChange, onDayBlur }: DatePickerProps) {
    return <DayPicker animate mode="single" month={month} onMonthChange={setMonth} selected={selected} onSelect={onSelect} onDayClick={onChange} onDayKeyDown={onChange} onNextClick={onChange} onPrevClick={onChange} onDayBlur={onDayBlur} navLayout="around" locale={ru} showOutsideDays hideWeekdays />;
}
