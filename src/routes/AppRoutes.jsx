import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/customer/Home";
import Menu from "../pages/customer/Menu";
import Product from "../pages/customer/Product";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import Payment from "../pages/customer/Payment";
import OrderSuccess from "../pages/customer/OrderSuccess";
import TrackOrder from "../pages/customer/TrackOrder";

import Login from "../pages/admin/Login";
import CashierLogin from "../pages/cashier/Login";
import KitchenLogin from "../pages/kitchen/Login";

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import ProductDetails from "../pages/admin/ProductDetails";
import Orders from "../pages/admin/Orders";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";

import Kitchen from "../pages/kitchen/Kitchen";
import AdminKitchen from "../pages/admin/AdminKitchen";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= CUSTOMER ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track-order" element={<TrackOrder />} />

        {/* ================= LOGIN ================= */}

        <Route path="/admin/login" element={<Login />} />
        <Route path="/cashier/login" element={<CashierLogin />} />
        <Route path="/kitchen/login" element={<KitchenLogin />} />

        {/* ================= ADMIN PANEL ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "cashier"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="products/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={["admin", "cashier"]}>
                <Orders />
              </ProtectedRoute>
            }
          />
<Route
  path="kitchen"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminKitchen />
    </ProtectedRoute>
  }
/>
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* ================= KITCHEN ================= */}

<Route
  path="/kitchen"
  element={
    <ProtectedRoute allowedRoles={["kitchen"]}>
      <Kitchen />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}