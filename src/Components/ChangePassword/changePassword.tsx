import React, { useState } from "react";
import Input from "../Ui/Input/input";
import { Button } from "../Ui/Button/button";
// import axios from "axios";

interface ChangePasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  onBack,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("تکرار رمز عبور اشتباه وارد شده است");
      return;
    }

    try {
      // Fake API call
      //   await axios.post("https://fake-api.example.com/change-password", {
      //     newPassword,
      //   });

      // If successful, go back to login
      onSuccess();
    } catch (error) {
      setError("خطا در تغییر رمز عبور");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: "25px",
          fontWeight: "500",
          color: "#000000",
          marginBottom: "20px",
        }}
      >
        رمز عبور جدید
      </p>
      <Input
        type="text"
        width={"438px"}
        height={62.43}
        placeholder="رمز عبور جدید"
        placeholderStyle={{
          textAlign: "center",
          fontSize: "22px",
          color: "#7E7E7E",
          fontWeight: "500",
        }}
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setError("");
        }}
        style={{ marginBottom: "20px" }}
      />
      <p
        style={{
          textAlign: "center",
          fontSize: "25px",
          fontWeight: "500",
          color: "#000000",
          marginBottom: "20px",
        }}
      >
        تکرار رمز عبور جدید
      </p>
      <Input
        type="text"
        width={"438px"}
        height={62.43}
        placeholder="تکرار رمز عبور جدید"
        placeholderStyle={{
          textAlign: "center",
          fontSize: "22px",
          color: "#7E7E7E",
          fontWeight: "500",
        }}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setError("");
        }}
        error={error}
        variant={error ? "error" : "default"}
        errorStyle={{
          fontSize: "20px",
          fontWeight: "500",
          color: "#DE4949",
        }}
      />
      <Button
        style={{
          width: "438px",
          marginTop: "40px",
          height: "75.43px",
          fontSize: "26px",
          fontWeight: "600",
        }}
        label="ثبت"
        color="#7889F5"
        radius={15}
        onClick={handleSubmit}
      />
    </div>
  );
};

export default ChangePassword;
