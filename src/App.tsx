import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Page/Login/login";
import Home from "./Page/Home/home";
import "./styles/reset.css";
import "./styles/fonts.css";
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element=<Login /> />
          <Route path="/dashboard" element=<Home /> />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
