import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageWatches from "./pages/ManageWatches";
import WatchForm from "./pages/WatchForm";
import ManageOrders from "./pages/ManageOrders";
import ManageUsers from "./pages/ManageUsers"; // Added component import

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/watches" element={<ManageWatches />} />
        <Route path="/watches/new" element={<WatchForm />} />
        <Route path="/watches/:id/edit" element={<WatchForm />} />
        <Route path="/orders" element={<ManageOrders />} />
        <Route path="/users" element={<ManageUsers />} /> {/* Added Manage Users route path */}
      </Routes>
    </BrowserRouter>
  );
}
