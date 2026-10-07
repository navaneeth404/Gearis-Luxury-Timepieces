import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import WatchDetail from "./pages/WatchDetail";
import Profile from "./pages/Profile";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/watch/:id" element={<WatchDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrders />} />
<Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}