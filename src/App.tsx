import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from './components/Header/Header';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import YandexMap from './components/YandexMap/YandexMap';
import './index.scss';
import Basket from './pages/Basket/Basket';
import Logout from './pages/Logout/Logout';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import Profile from './pages/Profile/Profile';
import Restaurants from './pages/Restaurants/Restaurants';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import RestorePassword from './pages/RestorePassword/RestorePassword';
import MealPage from './pages/MealPage/MealPage';
import AboutUs from './components/AboutUs/AboutUs';
import Feedback from './pages/Feedback/Feedback';
import Favorites from './pages/Favorites/Favorites';
import Search from './pages/Search/Search';
import WaitingOrder from './pages/WaitingOrder/WaitingOrder/WaitingOrder';
import LeaveOrderFeedback from './pages/LeaveOrderFeedback/LeaveOrderFeedback';
import Admin from './pages/Admin/Admin';
import Orders from './pages/Admin/Orders/Orders';
import WorkStatus from './pages/Admin/WorkStatus/WorkStatus';
import Restaurant from './pages/Restaurants/Restaurant/Restaurant';
import { Analytics } from '@vercel/analytics/react';
import Administrators from './pages/Catering/Administrators/Administrators';
import Catering from './pages/Catering/Catering';
import AddAdministrator from './pages/Catering/Administrators/AddAdministrator/AddAdministrator';
import EditAdministrator from './pages/Catering/Administrators/EditAdministrator/EditAdministrator';
import Partnership from './pages/Partnership/Partnership';

function App() {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
    return (
        <div>
            <Header />
            <YandexMap isDrawerOpen={isDrawerOpen}></YandexMap>
            <Routes>
                <Route path="/waiting-order" element={<ProtectedRoute component={<WaitingOrder />} />} />
                <Route path="/leave-order-feedback" element={<ProtectedRoute component={<LeaveOrderFeedback />} />} />
                <Route path="/partnership" element={<Partnership />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<ProtectedRoute component={<Profile />} />} />
                <Route path="/logout" element={<ProtectedRoute component={<Logout />} />} />
                <Route path="/" element={<Restaurants isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />}>
                    <Route path="restaurants/:restaurantId" element={<Restaurant />}>
                        <Route path="meal/:mealId" element={<MealPage />} />
                    </Route>
                </Route>
                <Route path="/restore-password" element={<RestorePassword />} />
                <Route path="/basket" element={<ProtectedRoute component={<Basket />} />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/search" element={<Search />} />
                <Route path="/admin" element={<Admin />}>
                    <Route path="orders" element={<Orders />} />
                    <Route path="work-status" element={<WorkStatus />} />
                </Route>
                <Route path="/favorites" element={<ProtectedRoute component={<Favorites />} />} />
                <Route path="*" element={<PageNotFound />} />

                <Route path="/catering" element={<Catering />}>
                    <Route path="administrators">
                        <Route index element={<Administrators />} />
                        <Route path="add" element={<AddAdministrator />} />
                        <Route path=":administratorId" element={<EditAdministrator />} />
                    </Route>
                </Route>
            </Routes>
            <ReactQueryDevtools initialIsOpen={false} />
            <Analytics />
        </div>
    );
}

export default App;
