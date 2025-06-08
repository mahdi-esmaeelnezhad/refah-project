import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Page/Login/login";
import "./App.css";

const App = () => {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element=<Login /> />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
