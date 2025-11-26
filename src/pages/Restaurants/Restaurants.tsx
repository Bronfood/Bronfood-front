import { Dispatch, SetStateAction } from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer/Drawer';

function Restaurants({ isDrawerOpen, setIsDrawerOpen }: { isDrawerOpen: boolean; setIsDrawerOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <>
            <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
            <Outlet />
        </>
    );
}

export default Restaurants;
