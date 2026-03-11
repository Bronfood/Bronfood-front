import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import styles from './DatePicker.module.scss';

export function DatePicker() {
    const [selected, setSelected] = useState<Date>();

    return <DayPicker className={styles['rdp-root']} animate mode="single" selected={selected} onSelect={setSelected} footer={selected ? `Selected: ${selected.toLocaleDateString()}` : 'Pick a day.'} />;
}
