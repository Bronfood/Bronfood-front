import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import './DatePicker.scss';

import { ru } from 'react-day-picker/locale';

export function DatePicker() {
    const [selected, setSelected] = useState<Date>();

    return <DayPicker animate mode="single" selected={selected} onSelect={setSelected} navLayout="around" locale={ru} showOutsideDays hideWeekdays />;
}
