import { useContext } from 'react';
import { AdminNewOrderContext } from '../../../contexts/AdminNewOrderContext';

export const useAdminNewOrderContext = () => useContext(AdminNewOrderContext);
