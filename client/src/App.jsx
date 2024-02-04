import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
// import { useSelector } from "react-redux";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderScreen from "./pages/OrderScreen";
import ProfilePage from "./pages/ProfilePage";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import OrderList from "./pages/admin/OrderList";
import ProductsList from "./pages/admin/ProductsList";
import ProductEditScreen from "./pages/admin/EditProduct";
import UserList from "./pages/admin/UserList";
import EditUser from "./pages/admin/EditUser"


function App() {
  return (
    <BrowserRouter>
      {/* <RouterProvider router={router} /> */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:keyword" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="" element={<ProtectedRoute />}>
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/profile" element={<ProfilePage />} />
        <Route path="" element={<AdminPrivateRoute />}>
            <Route path="/orderlist" element={<OrderList />} />
            <Route path="/productlist" element={<ProductsList />} />
            <Route path="/admin/product/:id" element={<ProductEditScreen />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/edituser/:id" element={<EditUser/>} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
