import React from "react";
import Login from "./screens/Login";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SigninProcessScreen from "./screens/SigninProcessScreen";
import PaymentSuccess, { PaymentFailed } from "./screens/SigninProcess/PaymentStatus";
import { SigninProvider } from "./context/signinContext";
import Dashboard from "./screens/Dashboard";
import MenuScreen from "./screens/MenuScreen";
import AddMenuItem, { UpdateMenu } from "./controllers/MenuController";
import AdsScreen from "./screens/AdsScreen";
import OutletInfoScreen from "./screens/OutletInfo";
import HelpCenterScreen from "./screens/HelpCenterScreen";
import CreateAds, { UpdateAd } from "./controllers/AdController";
import ActiveOrderScreen from "./screens/ActiveOrderScreen";
import PastOrderScreen from "./screens/PastOrderScreen";
import UpdateOutlet from "./controllers/UpdateOutlet";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <SigninProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signinProcess" element={<SigninProcessScreen />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailed />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restaurant/menu" element={<MenuScreen />} />
            <Route path="/restaurant/add-menu-item" element={<AddMenuItem />} />
            <Route path="/restaurant/update-menu-item/:id" element={<UpdateMenu />} />
            <Route path="/restaurant/active-orders" element={<ActiveOrderScreen />} />
            <Route path="/restaurant/past-orders" element={<PastOrderScreen />} />
            <Route path="/restaurant/ads" element={<AdsScreen />} />
            <Route path="/restaurant/create-ads" element={<CreateAds />} />
            <Route path="/restaurant/update-ad/:adId" element={<UpdateAd />} />
            <Route path="/restaurant/info" element={<OutletInfoScreen />} />
            <Route path="/restaurant/update-outlet" element={<UpdateOutlet />} />
            <Route path="/restaurant/help" element={<HelpCenterScreen />} />
          </Routes>
        </SigninProvider>
      </div>
    </BrowserRouter>
  );
};

export default App;