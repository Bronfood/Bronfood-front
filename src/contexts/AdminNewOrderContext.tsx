import { createContext, FC, PropsWithChildren, useState, Dispatch, SetStateAction, useCallback } from 'react';
import { useCurrentUser } from '../utils/hooks/useCurrentUser/useCurretUser';
import { AdminNewOrderClientData, CookMethod, NewOrderTimeData, PreOrderType } from '../utils/api/adminService/adminService';
import { INITIAL_CLIENT_DATA, INITIAL_TIME_DATA } from '../utils/consts';

export type AdminNewOrderContext = {
    restaurantId: number | null;
    clientData: Partial<AdminNewOrderClientData>;
    setClientData: Dispatch<SetStateAction<Partial<AdminNewOrderClientData>>>;
    timeData: NewOrderTimeData;
    setTimeData: Dispatch<SetStateAction<NewOrderTimeData>>;
    isClientDataValid: boolean;
    clearClientData: () => void;
    cookMethod: CookMethod;
    setCookMethod: (method: CookMethod) => void;
    preOrderType: PreOrderType;
    setPreOrderType: (type: PreOrderType) => void;
    isPreOrderOpen: boolean;
    setIsPreOrderOpen: Dispatch<SetStateAction<boolean>>;
    clearNewOrderData: () => void;
};

export const AdminNewOrderContext = createContext<AdminNewOrderContext>({
    restaurantId: null,
    clientData: INITIAL_CLIENT_DATA,
    setClientData: () => {},
    timeData: INITIAL_TIME_DATA,
    setTimeData: () => {},
    isClientDataValid: false,
    clearClientData: () => {},
    cookMethod: 'now',
    setCookMethod: () => {},
    preOrderType: 'inTime',
    setPreOrderType: () => {},
    isPreOrderOpen: false,
    setIsPreOrderOpen: () => {},
    clearNewOrderData: () => {},
});

export const AdminNewOrderProvider: FC<PropsWithChildren> = ({ children }) => {
    const { restaurantId } = useCurrentUser();
    const [clientData, setClientData] = useState<Partial<AdminNewOrderClientData>>(INITIAL_CLIENT_DATA);
    const [timeData, setTimeData] = useState<NewOrderTimeData>(INITIAL_TIME_DATA);
    const [cookMethod, setCookMethod] = useState<CookMethod>('now');
    const [preOrderType, setPreOrderType] = useState<PreOrderType>('inTime');
    const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);

    const clearClientData = () => setClientData(INITIAL_CLIENT_DATA);

    const validate = (): boolean => {
        const data = clientData;
        const phoneDigits = (data.user_phone ?? '').replace(/\D/g, '');
        const hasNameAndPhone = Boolean(data.user_name?.trim()) && phoneDigits.length === 11;
        const hasAddress = Boolean(data.delivery?.street?.trim() && data.delivery?.house?.trim() && data.delivery?.apartment?.trim());
        const hasDeliveryDuration = Number(data.delivery_duration) > 0;
        const needsPreOrderTime = data.fulfillment !== 'dine_in' && cookMethod === 'preOrder';
        const hasPreOrderTime = preOrderType === 'inTime' ? Number(timeData.inTime) > 0 : /^\d{1,2}:\d{2}$/.test(timeData.certainTime);
        if (needsPreOrderTime && !hasPreOrderTime) return false;

        switch (data.fulfillment) {
            case 'dine_in':
                return true;
            case 'delivery':
                return hasNameAndPhone && hasAddress && hasDeliveryDuration;
            case 'pickup':
                return hasNameAndPhone;
            default:
                return false;
        }
    };

    const isClientDataValid = validate();

    const clearNewOrderData = useCallback(() => {
        setClientData(INITIAL_CLIENT_DATA);
        setTimeData(INITIAL_TIME_DATA);
        setCookMethod('now');
        setPreOrderType('inTime');
        setIsPreOrderOpen(false);
    }, []);

    return <AdminNewOrderContext.Provider value={{ restaurantId, clientData, setClientData, timeData, setTimeData, isClientDataValid, clearClientData, cookMethod, setCookMethod, preOrderType, setPreOrderType, isPreOrderOpen, setIsPreOrderOpen, clearNewOrderData }}>{children}</AdminNewOrderContext.Provider>;
};
