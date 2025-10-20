import { Outlet } from 'react-router-dom';
import Drawer from './Drawer/Drawer';

function Restaurants({ isDrawerOpen, setIsDrawerOpen }) {
    return (
        <>
            <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
            <Outlet />
        </>
    );
}

export default Restaurants;
