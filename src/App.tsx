import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Page/Login/login";
import Home from "./Page/Home/home";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./store/authSlice";
import Products from "./Page/Products/products";
import Delivery from "./Page/Delivery/Delivery";
import Factors from "./Page/Factors/Factors";
import Unregistered from "./Page/Unregistered/Unregistered";
import Customers from "./Page/Customers/Customers";
import GlobalHeader from "./Components/Base/SideMenu/GlobalHeader";
import PageWrapper from "./Components/Layout/PageWrapper";
import "./styles/index.css";
import "./styles/fonts.css";
import "./styles/App.css";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, []);

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
          </Routes>
        </PageWrapper>
      </main>
    </Router>
  );
};

export default App;
