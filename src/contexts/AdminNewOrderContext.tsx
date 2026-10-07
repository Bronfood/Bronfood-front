import { createContext, FC, PropsWithChildren, useState, Dispatch, SetStateAction } from 'react';
import { AdminNewOrderClientData, CookMethod } from '../utils/api/adminNewOrderService/adminNewOrderService';
import { useCurrentUser } from '../utils/hooks/useCurrentUser/useCurretUser';

export type AdminNewOrderContext = {
    restaurantId: number | null;
    clientData: Partial<AdminNewOrderClientData>;
    setClientData: Dispatch<SetStateAction<Partial<AdminNewOrderClientData>>>;
    isClientDataValid: boolean;
    clearClientData: () => void;
    cookMethod: CookMethod;
    setCookMethod: (method: CookMethod) => void;
};

export const AdminNewOrderContext = createContext<AdminNewOrderContext>({
    restaurantId: null,
    clientData: {},
    setClientData: () => {},
    isClientDataValid: false,
    clearClientData: () => {},
    cookMethod: 'now',
    setCookMethod: () => {},
});

export const AdminNewOrderProvider: FC<PropsWithChildren> = ({ children }) => {
    const { restaurantId } = useCurrentUser();
    const [clientData, setClientData] = useState<Partial<AdminNewOrderClientData>>({});
    const [cookMethod, setCookMethod] = useState<CookMethod>('now');
    const clearClientData = () => setClientData({});

    const validateClientData = (data: Partial<AdminNewOrderClientData>): boolean => {
        const hasNameAndPhone = Boolean(data.user_name?.trim() && data.user_phone?.trim());
        const hasAddress = Boolean(data.delivery?.street?.trim() && data.delivery?.house?.trim());

        if (data.fulfillment === 'dine_in') {
            return true;
        } else if (data.fulfillment === 'delivery') {
            return hasNameAndPhone && hasAddress;
        } else if (data.fulfillment === 'pickup') {
            return hasNameAndPhone;
        }
        return false;
    };

    const isClientDataValid = validateClientData(clientData);

    return <AdminNewOrderContext.Provider value={{ restaurantId, clientData, setClientData, isClientDataValid, clearClientData, cookMethod, setCookMethod }}>{children}</AdminNewOrderContext.Provider>;
};
