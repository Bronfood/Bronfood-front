import { Outlet } from 'react-router-dom';
import Drawer from './Drawer/Drawer';
import { useMapContext } from '../../utils/hooks/useMap/useMap';

function Restaurants() {
    const { isDrawerOpen, setIsDrawerOpen } = useMapContext();
    return (
        <>
            <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
            <Outlet />
        </>
    );
}

export default Restaurants;
