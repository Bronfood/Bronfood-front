import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPopup from '../AdminPopup/AdminPopup';
import { DatePicker } from '../../../components/DatePicker/DatePicker';

function WorkStatus() {
    const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
    const navigate = useNavigate();
    const close = () => {
        navigate('/admin');
    };

    return (
        <>
            <AdminPopup close={close}>
                <DatePicker selected={selectedDates} setSelected={setSelectedDates} />
            </AdminPopup>
        </>
    );
}

export default WorkStatus;
