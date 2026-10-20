import { createContext, FC, PropsWithChildren, useState, Dispatch, SetStateAction } from 'react';
import { useCurrentUser } from '../utils/hooks/useCurrentUser/useCurretUser';
import { AdminNewOrderClientData, CookMethod, PreOrderType } from '../utils/api/adminService/adminService';

export type AdminNewOrderContext = {
    restaurantId: number | null;
    clientData: Partial<AdminNewOrderClientData>;
    setClientData: Dispatch<SetStateAction<Partial<AdminNewOrderClientData>>>;
    isClientDataValid: boolean;
    clearClientData: () => void;
    cookMethod: CookMethod;
    setCookMethod: (method: CookMethod) => void;
    preOrderType: PreOrderType;
    setPreOrderType: (type: PreOrderType) => void;
    isPreOrderOpen: boolean;
    setIsPreOrderOpen: Dispatch<SetStateAction<boolean>>;
};

export const AdminNewOrderContext = createContext<AdminNewOrderContext>({
    restaurantId: null,
    clientData: {},
    setClientData: () => {},
    isClientDataValid: false,
    clearClientData: () => {},
    cookMethod: 'now',
    setCookMethod: () => {},
    preOrderType: 'inTime',
    setPreOrderType: () => {},
    isPreOrderOpen: false,
    setIsPreOrderOpen: () => {},
});

export const AdminNewOrderProvider: FC<PropsWithChildren> = ({ children }) => {
    const { restaurantId } = useCurrentUser();
    const [clientData, setClientData] = useState<Partial<AdminNewOrderClientData>>({
        fulfillment: 'pickup',
    });
    const [cookMethod, setCookMethod] = useState<CookMethod>('now');
    const [preOrderType, setPreOrderType] = useState<PreOrderType>('inTime');
    const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);

    const clearClientData = () => setClientData({});

    const validateClientData = (data: Partial<AdminNewOrderClientData>): boolean => {
        const hasNameAndPhone = Boolean(data.user_name?.trim() && data.user_phone?.trim());
        const hasAddress = Boolean(data.delivery?.street?.trim() && data.delivery?.house?.trim() && data.delivery?.apartment?.trim());
        const hasDeliveryDuration = Boolean(data.delivery_duration?.trim());

        if (data.fulfillment === 'dine_in') {
            return true;
        } else if (data.fulfillment === 'delivery') {
            return hasNameAndPhone && hasAddress && hasDeliveryDuration;
        } else if (data.fulfillment === 'pickup') {
            return hasNameAndPhone;
        }
        return false;
    };

    const isClientDataValid = validateClientData(clientData);

    return <AdminNewOrderContext.Provider value={{ restaurantId, clientData, setClientData, isClientDataValid, clearClientData, cookMethod, setCookMethod, preOrderType, setPreOrderType, isPreOrderOpen, setIsPreOrderOpen }}>{children}</AdminNewOrderContext.Provider>;
};
