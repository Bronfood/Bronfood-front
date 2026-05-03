import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import './DatePicker.scss';
import { ru } from 'react-day-picker/locale';

type DatePickerProps = {
    modifiers: Record<string, Date[]>;
    month: Date | undefined;
    onDateChange: (date: Date, modifiers?: object) => void;
};

export function DatePicker({ modifiers, month, onDateChange }: DatePickerProps) {
    return <DayPicker animate mode="single" modifiers={modifiers} modifiersClassNames={{ regular: 'regular', override: 'override', closed: 'closed' }} month={month} onDayClick={onDateChange} onNextClick={onDateChange} onPrevClick={onDateChange} navLayout="around" locale={ru} showOutsideDays hideWeekdays />;
}
