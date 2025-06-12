import { useState } from "react";
import axios, { AxiosError } from "axios";
import "./forgetPassword.css";
import Input from "../Ui/Input/input";
import { Button } from "../Ui/Button/button";
import SendSms from "../SendSms/sendSms";

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

  const validatePhoneNumber = async () => {
    try {
      //   const response = await axios.post(
      //     "https://fake-api.example.com/validate-phone",
      //     {
      //       phoneNumber: phoneNumber,
      //     }
      //   );
      console.log(phoneNumber, "phoneNumber");

      // For demo purposes, let's consider "09123456789" as a valid number
      if (phoneNumber === "09123456789") {
        console.log("valid");

        setPhoneError("");
        return true;
      }

      setPhoneError("برای این شماره فروشگاهی ثبت نشده است");
      return false;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 404) {
        setPhoneError("برای این شماره فروشگاهی ثبت نشده است");
      } else {
        setPhoneError("برای این شماره فروشگاهی ثبت نشده است");
      }
      return false;
    }
  };

  const handleContinue = async () => {
    setSubmitted(true);
    if (!phoneNumber) return;

    const isPhoneValid = await validatePhoneNumber();
    if (isPhoneValid) {
      onSuccess(phoneNumber);
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
