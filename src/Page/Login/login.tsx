import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/authSlice";
import useRequest from "../../hooks/useRequest";
import { AUTH_ENDPOINTS } from "../../endpoint/login/login";
// import  { AxiosError } from "axios";
import leftPatter from "../../assets/img/Pattern - White 1.png";
import patterleft from "../../assets/img/pattern 3.png";
import rightPatern from "../../assets/img/Pattern - White 2.png";
import paternRight from "../../assets/img/pattern 4.png";
import logoAsset from "../../assets/img/Asset 46@2x copy 1.png";
import logoGroup from "../../assets/img/Group 4483.png";
import version from "../../assets/img/version.png";
import orgLogo from "../../assets/img/orgLogo.png";
import logoGroupOne from "../../assets/img/Group 4483 (1).png";
import Input from "../../Components/Ui/Input/input";
import { Button } from "../../Components/Ui/Button/button";
import phone from "../../assets/img/Group 2.png";
import user from "../../assets/user.svg";
import pass from "../../assets/pass.svg";
import key from "../../assets/key.svg";
import back from "../../assets/back.svg";
import "./login.css";
import ForgetPassword from "../../Components/ForgetPassword/forgetPassword";
import SendSms from "../../Components/SendSms/sendSms";
import ChangePassword from "../../Components/ChangePassword/changePassword";
import { useNavigate } from "react-router-dom";

type Step = "login" | "forgetPassword" | "sendSms" | "changePassword";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showInitial, setShowInitial] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [forgotPasswordPhoneNumber, setForgotPasswordPhoneNumber] =
    useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [rememberMe] = useState(false);

  const [currentStep, setCurrentStep] = useState<Step>("login");

  const {
    execute: loginRequest,
    loading,
    // error: loginError,
  } = useRequest<{ id_token: string }>(AUTH_ENDPOINTS.login, "POST");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShowInitial(false), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // const validatePhoneNumber = async () => {
  //   try {
  //     // const response = await axios.post(
  //     //   "https://fake-api.example.com/validate-phone",
  //     //   {
  //     //     phoneNumber: phoneNumber,
  //     //   }
  //     // );

  //     setPhoneError("");
  //     return true;
  //   } catch (error: unknown) {
  //     const axiosError = error as AxiosError;
  //     if (axiosError.response && axiosError.response.status === 404) {
  //       setPhoneError("برای این شماره فروشگاهی ثبت نشده است");
  //     } else {
  //       setPhoneError("برای این شماره فروشگاهی ثبت نشده است");
  //     }
  //     return false;
  //   }
  // };

  const handleLogin = async () => {
    setSubmitted(true);
    if (!phoneNumber || !password) return;

    try {
      const response = await loginRequest({
        username: phoneNumber,
        password: password,
        rememberMe: rememberMe,
      });

      if (response?.data?.id_token) {
        console.log(1);

        console.log(2);

        dispatch(setToken(response.data.id_token));

        localStorage.setItem("token", response.data.id_token);
        navigate("/dashboard");
      }
    } catch (error) {
      setError("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "changePassword":
        setCurrentStep("sendSms");
        break;
      case "sendSms":
        setCurrentStep("forgetPassword");
        break;
      case "forgetPassword":
        setCurrentStep("login");
        setForgotPasswordPhoneNumber("");
        break;
      default:
        setCurrentStep("login");
        setForgotPasswordPhoneNumber("");
    }
  };

  const handleForgetPasswordClick = () => {
    setCurrentStep("forgetPassword");
  };

  const handleSendSmsSuccess = (phoneNumber: string) => {
    setForgotPasswordPhoneNumber(phoneNumber);
    setCurrentStep("sendSms");
  };

  const handleSmsVerificationSuccess = () => {
    setCurrentStep("changePassword");
  };

  const handleChangePasswordSuccess = () => {
    setCurrentStep("login");
    setForgotPasswordPhoneNumber("");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "forgetPassword":
        return (
          <ForgetPassword
            onBack={handleBack}
            onSuccess={handleSendSmsSuccess}
          />
        );
      case "sendSms":
        return (
          <SendSms
            phoneNumber={forgotPasswordPhoneNumber}
            onBack={handleBack}
            onSuccess={handleSmsVerificationSuccess}
          />
        );
      case "changePassword":
        return (
          <ChangePassword
            onBack={handleBack}
            onSuccess={handleChangePasswordSuccess}
          />
        );
      default:
        return (
          <>
            <Input
              type="text"
              placeholder="نام کاربری"
              height={62.43}
              placeholderStyle={{
                fontSize: "22px",
                color: "#7E7E7E",
                fontWeight: "600",
                marginRight: "12px",
              }}
              width={"438px"}
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError("");
              }}
              variant={
                (submitted && !phoneNumber) || phoneError ? "error" : "default"
              }
              error={
                phoneError ||
                (submitted && !phoneNumber ? "نام کاربری وارد نشده است" : "")
              }
              required
              icon={
                <img
                  src={user}
                  alt="user icon"
                  style={{ width: 34, height: 34, marginLeft: "28px" }}
                />
              }
            />
            <Input
              type={showPassword ? "text" : "password"}
              width={"438px"}
              style={{ marginTop: "30px" }}
              height={62.43}
              placeholder="پسورد"
              placeholderStyle={{
                fontSize: "22px",
                color: "#7E7E7E",
                fontWeight: "600",
                marginRight: "12px",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant={submitted && !password ? "error" : "default"}
              error={submitted && !password ? " پسورد وارد نشده است" : ""}
              required
              // icon={
              //   <div
              //     style={{
              //       display: "flex",
              //       alignItems: "center",
              //       gap: "10px",
              //       width: "100%",
              //     }}
              //   >
              //     <img
              //       src={key}
              //       alt="key icon"
              //       style={{
              //         width: 34,
              //         height: 34,
              //         position: "absolute",
              //         right: "12px",
              //       }}
              //     />
              //     <img
              //       src={pass}
              //       alt="toggle password"
              //       onClick={() => setShowPassword((prev) => !prev)}
              //       style={{
              //         width: 40,
              //         height: 20,
              //         cursor: "pointer",
              //         position: "absolute",
              //         right: "370px",
              //       }}
              //     />
              //   </div>
              // }
              icon={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={key}
                    alt="user icon"
                    style={{ width: 48, height: 48, marginLeft: "28px" }}
                  />
                  <img
                    src={pass}
                    alt="toggle password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      width: 40,
                      height: 20,
                      cursor: "pointer",
                      position: "absolute",
                      right: "370px",
                    }}
                  />
                </div>
              }
            />
            <div
              style={{
                marginTop: "50px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {error && (
                <span
                  style={{
                    color: "#DE4949",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {error}
                </span>
              )}
              <Button
                style={{
                  width: "438px",
                  marginTop: "20px",
                  height: "75.43px",
                  fontSize: "26px",
                  fontWeight: "600",
                }}
                label={loading ? "در حال ورود..." : "ورود"}
                color="#7889F5"
                radius={15}
                onClick={handleLogin}
                disabled={loading}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "30px",
              }}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleForgetPasswordClick();
                }}
              >
                فراموشی رمز عبور!
              </a>
            </div>
          </>
        );
    }
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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ marginTop: "-30px", marginBottom: "60px" }}>
              <img src={orgLogo} alt="main logo" />
            </div>
            <div>
              <img
                style={{ marginTop: "0px" }}
                src={logoGroupOne}
                alt="logo group one"
              />
            </div>
            <div style={{ marginTop: "70px" }}>
              <div style={{ position: "relative", height: "300px" }}>
                {renderStep()}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ marginTop: "90px" }}
                  src={phone}
                  alt="phone illustration"
                />
              </div>
              <div
                style={{
                  marginTop: "60px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src={version} alt="version" />
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {currentStep !== "login" && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={back}
                  alt="back"
                  style={{ position: "absolute", top: "18px", left: "18px" }}
                />
                <p
                  style={{
                    width: "120px",
                    height: "40px",
                    position: "absolute",
                    top: "12px",
                    left: "10px",
                    zIndex: 10,
                    color: "#000",
                    cursor: "pointer",
                    fontSize: "23px",
                    fontWeight: "600",
                  }}
                  onClick={handleBack}
                >
                  بازگشت
                </p>
              </div>
            )}
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
