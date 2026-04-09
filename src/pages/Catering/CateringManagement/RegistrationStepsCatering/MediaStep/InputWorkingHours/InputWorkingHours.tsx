import { UseFormRegister, FieldValues } from 'react-hook-form';
import styles from './InputWorkingHours.module.scss';
import { regexTime } from '../../../../../../utils/consts';

function InputWorkingHours({ register, placeholder, name, value, pairValue, onChange, errors }: { register: UseFormRegister<FieldValues>; name: string; onChange: (value: string) => void; placeholder: string; value: string; pairValue: string; errors: string | '' }) {
    const registration = register(name, {
        required: {
            value: !!pairValue,
            message: errors,
        },
        pattern: {
            value: regexTime,
            message: errors,
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        registration.onChange(e);
        onChange(e.target.value);
    };

    return (
        <div className={styles.input}>
            <input className={styles.input__place} type="text" placeholder={placeholder} {...registration} onChange={handleChange} value={value || ''}></input>
        </div>
    );
}

export default InputWorkingHours;
