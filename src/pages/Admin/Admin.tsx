import { Outlet } from 'react-router-dom';
import AdminFooter from './AdminFooter/AdminFooter';
import { AdminNewOrderProvider } from '../../contexts/AdminNewOrderContext';

function Admin() {
    return (
        <>
            <AdminNewOrderProvider>
                <Outlet />
                <AdminFooter />
            </AdminNewOrderProvider>
        </>
    );
}

export default Admin;
