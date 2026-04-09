import GuestNavigation from './GuestNavigation/GuestNavigation';
import CustomerNavigation from './CustomerNavigation/CustomerNavigation';
import { useCurrentUser } from '../../utils/hooks/useCurrentUser/useCurretUser';
import CateringNavigation from './CateringNavigation/CateringNavigation';
import { FC } from 'react';
import ManagerNavigation from './ManagerNavigation/ManagerNavigation';
/**
 * Contains 2 menu types: guest/customer
 */
interface Navigation {
    /**
     * Click on menu item redirects to link and close menu
     */
    handleItemMenuClick: React.MouseEventHandler<HTMLElement>;
}
const Navigation: FC<Navigation> = (props) => {
    const { isLogin, currentUser } = useCurrentUser();
    const role = currentUser?.role;

    return <nav>{isLogin ? role === 'CLIENT' ? <CustomerNavigation handleItemMenuClick={props.handleItemMenuClick} /> : role === 'OWNER' ? <CateringNavigation handleItemMenuClick={props.handleItemMenuClick} /> : role === 'MANAGER' ? <ManagerNavigation handleItemMenuClick={props.handleItemMenuClick} /> : null : <GuestNavigation handleItemMenuClick={props.handleItemMenuClick} />}</nav>;
};

export default Navigation;
