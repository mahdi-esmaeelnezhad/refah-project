import { useState, useEffect } from "react";
import leftPatter from "../../assets/img/Pattern - White 1.png";
import patterleft from "../../assets/img/pattern 3.png";
import rightPatern from "../../assets/img/Pattern - White 2.png";
import paternRight from "../../assets/img/pattern 4.png";
import logoAsset from "../../assets/img/Asset 46@2x copy 1.png";
import logoGroup from "../../assets/img/Group 4483.png";
import logoGroupOne from "../../assets/img/Group 4483 (1).png";
import Input from "../../Components/Ui/Input/input";
import { Button } from "../../Components/Ui/Button/button";
import phone from "../../assets/img/Group 2.png";
import user from "../../assets/user.svg";
import pass from "../../assets/pass.svg";
import "./Login.css"; // فایل CSS برای انیمیشن‌ها
import { CgEnter } from "react-icons/cg";

const Login = () => {
  const [showInitial, setShowInitial] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => setShowInitial(false), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const handleLogin = () => {
    setSubmitted(true);
    if (!phoneNumber || !password) return;

    console.log("Login with:", { phoneNumber, password });
  };

  return (
    <div className="login-container">
      {showInitial ? (
        <div className={`initial-screen ${fadeOut ? "fade-out" : ""}`}>
          <div>
            <img src={rightPatern} alt="right pattern" />
          </div>
          <div
            style={{
              marginTop: "390px",
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "Center",
              justifyContent: "center",
            }}
          >
            <div>
              <img
                style={{ marginTop: "0px" }}
                src={logoGroupOne}
                alt="left pattern"
              />
            </div>
            <div style={{ marginTop: "70px" }}>
              <Input
                type="text"
                placeholder="نام کاربری"
                height={62.43}
                width={"438px"}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                variant={submitted && !phoneNumber ? "error" : "default"}
                error={
                  submitted && !phoneNumber ? "نام کاربری وارد نشده است" : ""
                }
                required
                icon={
                  <img
                    src={user}
                    alt="user icon"
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                }
              />

              <Input
                type={showPassword ? "text" : "password"}
                width={"438px"}
                style={{ marginTop: "30px" }}
                height={62.43}
                placeholder="پسورد"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant={submitted && !password ? "error" : "default"}
                error={submitted && !password ? " پسورد وارد نشده است" : ""}
                required
                icon={
                  <img
                    src={pass}
                    alt="toggle password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      position: "absolute",
                      right: "380px",
                      bottom: "-10px",
                    }}
                  />
                }
              />

              <Button
                style={{ width: "438px", marginTop: "40px", height: "63.43px" }}
                label="ورود"
                color="#7889F5"
                radius={15}
                onClick={handleLogin}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "Center",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                <a href="/">فراموشی رمز عبور!</a>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "Center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ marginTop: "90px" }}
                  src={phone}
                  alt="left pattern"
                />
              </div>
            </div>
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
