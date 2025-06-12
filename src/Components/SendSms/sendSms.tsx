import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
import { Button } from "../Ui/Button/button";
import changeNumber from "../../assets/changeNumber.svg";
import ChangePassword from "../ChangePassword/changePassword";

interface SendSmsProps {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
}

const SendSms: React.FC<SendSmsProps> = ({
  phoneNumber,
  onBack,
  onSuccess,
}) => {
  const [timer, setTimer] = useState<number>(90); // 1:30 in seconds
  const [canResend, setCanResend] = useState<boolean>(false);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [resetTimer, setResetTimer] = useState<number>(0); // Add this to trigger timer reset
  const [otpError, setOtpError] = useState<string>("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resetTimer]); // Add resetTimer as a dependency

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(90);
      setCanResend(false);
      setResetTimer((prev) => prev + 1); // Increment to trigger useEffect
      // Add your resend SMS logic here
      console.log("Resending SMS...");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return; // Only allow digits

    setOtpError("");
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const otp = otpValues.join("");
    if (otp.length !== 6) {
      setOtpError("لطفا کد را کامل وارد کنید");
      return;
    }

    try {
      // Fake API call - consider "123456" as the valid OTP
      if (otp === "123456") {
        onSuccess();
      } else {
        setOtpError("کد وارد شده اشتباه است");
        // Set red border for all inputs when there's an error
        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach((input) => {
          (input as HTMLElement).style.borderColor = "#ff4d4f";
        });
      }
    } catch (error) {
      setOtpError("خطا در تایید کد");
    }
  };

  const handleChangePasswordSuccess = () => {
    // Go back to login page
    window.location.reload();
  };

  if (showChangePassword) {
    return (
      <ChangePassword
        onBack={() => setShowChangePassword(false)}
        onSuccess={handleChangePasswordSuccess}
      />
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ position: "relative", width: "438px" }}>
        <div
          style={{
            width: "438px",
            height: "72.43px",
            backgroundColor: "#E7E7E7",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            position: "relative",
          }}
        >
          <img
            src={changeNumber}
            alt="change number"
            style={{
              width: 34,
              height: 34,
              cursor: "pointer",
            }}
            onClick={onBack}
          />
          <p
            style={{
              fontSize: "25px",
              fontWeight: "500",
              direction: "rtl",
            }}
          >
            {phoneNumber}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "438px",
          marginTop: "20px",
        }}
      >
        <Button
          style={{
            width: "162px",
            height: "52px",
            backgroundColor: canResend ? "#479E55" : "#B4B4B4",
          }}
          label="ارسال مجدد"
          color="#fff"
          radius={52}
          onClick={handleResend}
          disabled={!canResend}
        />
        <span style={{ color: "#7E7E7E", fontSize: "25px", fontWeight: "600" }}>
          {formatTime(timer)} ثانیه
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "30px",
            direction: "ltr",
          }}
        >
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              style={{
                backgroundColor: "#E7E7E7",
                width: "80px",
                height: "80px",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "500",
                border: otpError ? "1px solid #ff4d4f" : "1px solid #ccc",
                borderRadius: "15px",
                outline: "none",
              }}
              maxLength={1}
            />
          ))}
        </div>
        {otpError && (
          <span
            style={{ color: "#DE4949", fontSize: "20px", fontWeight: "500" }}
          >
            {otpError}
          </span>
        )}
      </div>

      <Button
        style={{
          width: "438px",
          marginTop: "40px",
          height: "75.43px",
          fontSize: "26px",
          fontWeight: "600",
        }}
        label="تایید"
        color="#7889F5"
        radius={15}
        onClick={handleContinue}
      />
    </div>
  );
};

export default SendSms;
