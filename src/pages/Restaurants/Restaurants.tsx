import { Dispatch, SetStateAction } from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer/Drawer';

function Restaurants({ isDrawerOpen, setIsDrawerOpen, city }: { isDrawerOpen: boolean; setIsDrawerOpen: Dispatch<SetStateAction<boolean>>; city: string }) {
    return (
        <>
            <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} city={city} />
            <Outlet />
        </>
    );
}

export default Restaurants;
