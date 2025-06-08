import { useState, useEffect } from "react";
import leftPatter from "../../assets/img/Pattern - White 1.png";
import patterleft from "../../assets/img/pattern 3.png";
import rightPatern from "../../assets/img/Pattern - White 2.png";
import paternRight from "../../assets/img/pattern 4.png";
import logoAsset from "../../assets/img/Asset 46@2x copy 1.png";
import logoGroup from "../../assets/img/Group 4483.png";
import logoGroupOne from "../../assets/img/Group 4483 (1).png";
import "./Login.css"; // فایل CSS برای انیمیشن‌ها

const Login = () => {
  const [showInitial, setShowInitial] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // شروع انیمیشن fade-out

      // بعد از اتمام انیمیشن خروج، صفحه اصلی را نشان بده
      setTimeout(() => setShowInitial(false), 500); // مدت انیمیشن: 0.5 ثانیه
    }, 2000); // تأخیر اولیه: 2 ثانیه

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="login-container">
      {showInitial ? (
        <div className={`initial-screen ${fadeOut ? "fade-out" : ""}`}>
          <div>
            <img src={rightPatern} alt="right pattern" />
          </div>
          <div
            style={{
              marginTop: "425px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              style={{ marginBottom: "10px" }}
              src={logoGroup}
              alt="logo group"
            />
            <img src={logoAsset} alt="logo asset" />
          </div>
          <div>
            <img
              style={{ marginTop: "64px" }}
              src={leftPatter}
              alt="left pattern"
            />
          </div>
        </div>
      ) : (
        <div className="main-screen fade-in">
          <div>
            <img src={paternRight} alt="right pattern" />
          </div>
          <div style={{ marginTop: "425px" }}>
            <p>mahdi</p>
          </div>
          <div>
            <img
              style={{ marginTop: "64px" }}
              src={patterleft}
              alt="left pattern"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
