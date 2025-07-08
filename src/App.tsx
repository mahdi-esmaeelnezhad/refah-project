import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Page/Login/login";
import Home from "./Page/Home/home";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setToken } from "./store/authSlice";
import Products from "./Page/Products/products";
import Delivery from "./Page/Delivery/Delivery";
import Factors from "./Page/Factors/Factors";
import Credit from "./Page/Credit/Credit";
import Settings from "./Page/Settings/Settings";
import Unregistered from "./Page/Unregistered/Unregistered";
import Discounts from "./Page/Discounts/Discounts";
import Customers from "./Page/Customers/Customers";
import Waste from "./Page/Waste/Waste";
import GlobalHeader from "./Components/Base/SideMenu/GlobalHeader";
import PageWrapper from "./Components/Layout/PageWrapper";
import "./styles/index.css";
import "./styles/fonts.css";
import "./styles/App.css";

const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     dispatch(setToken(token));
  //   }
  // }, []);

  return (
    <Router>
      <main>
        <GlobalHeader />
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/factors" element={<Factors />} />
            <Route path="/unregistered" element={<Unregistered />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/waste" element={<Waste />} />
            <Route path="/credit" element={<Credit />} />
          </Routes>
        </PageWrapper>
      </main>
    </Router>
  );
};

export default App;
