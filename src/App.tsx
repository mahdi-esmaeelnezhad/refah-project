import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Page/Login/login";
import Home from "./Page/Home/home";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./store/authSlice";
import Products from "./Page/Products/products";
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
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
