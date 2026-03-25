import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from './components/Header/Header';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import YandexMap from './components/YandexMap/YandexMap';
import './index.scss';
import Basket from './pages/Basket/Basket';
import Logout from './pages/Logout/Logout';
import Main from './pages/Main/Main';
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
import AddCatering from './pages/Catering/CateringManagement/AddCatering/AddCatering';
import CateringDetails from './pages/Catering/CateringManagement/CateringDetails/CateringDetails';
import EditCatering from './pages/Catering/CateringManagement/EditCatering/EditCatering';
import AddMeal from './pages/Catering/CateringManagement/AddMeal/AddMeal';
import EditMeal from './pages/Catering/CateringManagement/EditMeal/EditMeal';
import AddCategory from './pages/Catering/CateringManagement/AddCategory/AddCategory';
import EditCategory from './pages/Catering/CateringManagement/EditCategory/EditCategory';
import CollectWeeklyMenu from './pages/Catering/CateringManagement/CollectWeeklyMenu/CollectWeeklyMenu';
import AddCategoryToWeeklyMenu from './pages/Catering/CateringManagement/AddCategoryToWeeklyMenu/AddCategoryToWeeklyMenu';
import EditCategoryToWeeklyMenu from './pages/Catering/CateringManagement/EditCategoryToWeeklyMenu/EditCategoryToWeeklyMenu';
import Menu from './pages/Catering/CateringManagement/Menu/Menu';
import Managers from './pages/Catering/Administrators/Managers/Managers';
import AddManager from './pages/Catering/Administrators/AddManager/AddManager';
import EditManager from './pages/Catering/Administrators/EditManager/EditManager';

function App() {
    const [city, setCity] = useState('');

    return (
        <div>
            <Header city={city} />
            <YandexMap setCity={setCity}></YandexMap>
            <Routes>
                <Route path="/waiting-order" element={<ProtectedRoute component={<WaitingOrder />} />} />
                <Route path="/leave-order-feedback" element={<ProtectedRoute component={<LeaveOrderFeedback />} />} />
                <Route path="/" element={<Main />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<ProtectedRoute component={<Profile />} />} />
                <Route path="/logout" element={<ProtectedRoute component={<Logout />} />} />
                <Route path="/restaurants" element={<Restaurants />}>
                    <Route path=":restaurantId" element={<Restaurant />}>
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
                    <Route path="add-catering" element={<AddCatering />} />
                    <Route path=":cateringId" element={<CateringDetails />} />
                    <Route path=":cateringId/edit-catering" element={<EditCatering />} />

                    <Route path=":cateringId/menu" element={<Menu />} />
                    <Route path=":cateringId/menu/add-meal" element={<AddMeal />} />
                    <Route path=":cateringId/menu/:cateringMealId" element={<EditMeal />} />

                    <Route path="administrators" element={<Administrators />} />
                    <Route path=":cateringId/managers" element={<Managers />} />
                    <Route path=":cateringId/managers/add-manager" element={<AddManager />} />
                    <Route path=":cateringId/managers/:managerId" element={<EditManager />} />

                    <Route path=":cateringId/menu/add-category" element={<AddCategory />} />
                    <Route path=":cateringId/menu/categories/:categoryId" element={<EditCategory />} />

                    <Route path=":cateringId/collect-weekly-menu">
                        <Route index element={<CollectWeeklyMenu />} />
                        <Route path=":day" element={<CollectWeeklyMenu />} />
                        <Route path=":day/add-category-weekly-menu" element={<AddCategoryToWeeklyMenu />} />
                        <Route path=":day/edit-category-weekly-menu/:dailyCategoryId" element={<EditCategoryToWeeklyMenu />} />
                    </Route>
                </Route>
            </Routes>
            <ReactQueryDevtools initialIsOpen={false} />
            <Analytics />
        </div>
    );
}

export default App;
