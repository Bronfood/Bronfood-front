import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import './DatePicker.scss';
import { ru } from 'react-day-picker/locale';

type DatePickerProps = {
    month: Date | undefined;
    onDateChange: (date: Date) => void;
};

export function DatePicker({ month, onDateChange }: DatePickerProps) {
    return <DayPicker animate mode="single" month={month} onDayClick={onDateChange} onNextClick={onDateChange} onPrevClick={onDateChange} navLayout="around" locale={ru} showOutsideDays hideWeekdays />;
}
