import { useContext } from 'react';
import { AdminNewOrderContext } from '../../../contexts/AdminNewOrderContext';

export const useAdminOrderContext = () => useContext(AdminNewOrderContext);
