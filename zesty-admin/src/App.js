import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomeScreen from "./screens/HomeScreen";
import SigninScreen from "./screens/SigninScreen";
// import SignupScreen from "./screens/SignupScreen";
import 'react-toastify/dist/ReactToastify.css';
import OrdersScreen from "./screens/OrdersScreen";
import UsersScreen from "./screens/UsersScreen";
// import RiderScreen from "./screens/RiderScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import CouponsScreen from "./screens/CouponsScreen";
import UpdateCoupons, { CreateCoupon } from "./controllers/CouponsController";
import Example from "./components/Example";
import CategoryScreen from "./screens/CategoryScreen";
import UpdateCategory, { CreateCategory } from "./controllers/CategoryController";
import Notification from "./screens/Notification";
import ZestyMart from "./screens/ZestyMart";
import AddMartItem, { UpdateZestyMart } from "./controllers/ZestyMartController";

function App() {
  return (
    <BrowserRouter>
      <div>
        <main>
          <ToastContainer position="bottom-center" limit={1} />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            {/* <Route path="/admin/signin" element={<SigninScreen />} /> */}
            <Route path="/admin/signin" element={<SigninScreen />} />
            <Route path="/admin/orders" element={<OrdersScreen />} />
            <Route path="/admin/users" element={<UsersScreen />} />
            {/* <Route path="/admin/rider" element={<RiderScreen />} /> */}
            <Route path="/admin/reataurants" element={<RestaurantScreen />} />
            <Route path="/admin/coupons" element={<CouponsScreen />} />
            <Route path="/admin/add-coupon" element={<CreateCoupon />} />
            <Route path="/admin/update-coupon/:id" element={<UpdateCoupons />} />
            <Route path="/admin/categories" element={<CategoryScreen />} />
            <Route path="/admin/add-category" element={<CreateCategory />} />
            <Route path="/admin/update-category/:id" element={<UpdateCategory />} />
            <Route path="/admin/notifications" element={<Notification />} />
            <Route path="/admin/zesty-mart" element={<ZestyMart />} />
            <Route path="/admin/add-mart-item" element={<AddMartItem />} />
            <Route path="/admin/update-mart-item/:id" element={<UpdateZestyMart />} />
            <Route path="/example" element={<Example />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
