import { useState } from "react";
import "./forgetPassword.css";
import Input from "../Ui/Input/input";
import { Button } from "../Ui/Button/button";
import SendSms from "../SendSms/sendSms";
import { AUTH_ENDPOINTS } from "../../endpoint/login/login";
import useRequest from "../../hooks/useRequest";

interface ForgetPasswordProps {
  onBack: () => void;
  onSuccess: (phoneNumber: string) => void;
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({
  onBack,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [showSendSms, setShowSendSms] = useState(false);

  const { execute: resetPasswordRequest } = useRequest<any>(
    AUTH_ENDPOINTS.resetPassword,
    "POST",
    { validateStatus: () => true } // allow handling 204 manually
  );

  const handleContinue = async () => {
    setSubmitted(true);
    if (!phoneNumber) return;
    try {
      const response = await resetPasswordRequest({ mobile: phoneNumber });
      if (response?.status === 200) {
        setPhoneError("");
        onSuccess(phoneNumber);
      } else if (response?.status === 204) {
        setPhoneError("برای این شماره فروشگاهی ثبت نشده است");
      } else {
        setPhoneError("خطایی رخ داده است");
      }
    } catch (error: any) {
      setPhoneError(error?.response?.data?.message || "خطایی رخ داده است");
    }
  };

  const handleBack = () => {
    if (showSendSms) {
      setShowSendSms(false);
    } else {
      onBack();
    }
  };

  if (showSendSms) {
    return (
      <SendSms
        phoneNumber={phoneNumber}
        onBack={handleBack}
        onSuccess={handleContinue}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p style={{ textAlign: "center", fontSize: "23px", fontWeight: "500" }}>
        برای بازیابـی رمز عبور شماره تلفن همراه خود را وارد کنید
      </p>
      <Input
        type="text"
        width={"438px"}
        style={{ marginTop: "30px" }}
        height={62.43}
        placeholder="شماره تلفن همراه خود را وارد کنید"
        placeholderStyle={{
          textAlign: "center",
          fontSize: "22px",
          color: "#7E7E7E",
        }}
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
          setPhoneError(""); // Clear error when user types
        }}
        variant={
          (submitted && !phoneNumber) || phoneError ? "error" : "default"
        }
        error={
          phoneError ||
          (submitted && !phoneNumber ? "شماره تلفن همراه وارد نشده است" : "")
        }
        required
      />
      <Button
        style={{
          width: "438px",
          marginTop: "40px",
          height: "75.43px",
          fontSize: "26px",
          fontWeight: "600",
        }}
        label="ادامه"
        color="#7889F5"
        radius={15}
        onClick={handleContinue}
      />
    </div>
  );
};

export default ForgetPassword;
