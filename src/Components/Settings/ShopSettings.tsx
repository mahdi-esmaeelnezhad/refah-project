import React, { useEffect, useState } from "react";
import Input from "../Ui/Input/input";
import { Button } from "../Ui/Button/button";
import mapIcon from "../../assets/mapIcon.svg";
import { AUTH_ENDPOINTS } from "../../endpoint/login/login";
import map from "../../assets/map.svg";
import useRequest from "../../hooks/useRequest";

const ShopSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = localStorage.getItem("token");
  const [shopInfo, setShopInfo] = useState<any>(null);

  const { execute: changePasswordRequest } = useRequest<any>(
    AUTH_ENDPOINTS.changePassword,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  useEffect(() => {
    const shopInfo = localStorage.getItem("shopInfo");
    if (shopInfo) {
      setShopInfo(JSON.parse(shopInfo));
      console.log(JSON.parse(shopInfo));
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div
        style={{
          width: "1512px",
          height: "272px",
          backgroundColor: "#EFEFEF",
          borderRadius: "15px",
          padding: "30px",
        }}
      >
        <div
          style={{
            fontSize: "21px",
            fontWeight: 600,
            color: "black",
            marginBottom: "20px",
          }}
        >
          اطلاعات فروشگاه
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#363636",
              }}
            >
              نام فروشگاه:
            </span>
            <div
              style={{
                width: "293px",
                height: "42px",
                backgroundColor: "white",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                fontSize: "21px",
                fontWeight: 600,
                color: "#363636",
              }}
            >
              {shopInfo?.extraData?.shopName}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#363636",
              }}
            >
              کد فروشگاه:
            </span>
            <div
              style={{
                width: "293px",
                height: "42px",
                backgroundColor: "white",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                fontSize: "21px",
                fontWeight: 600,
                color: "#363636",
              }}
            >
              {shopInfo?.extraData?.shopCode}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#363636",
              }}
            >
              شماره موبایل:
            </span>
            <div
              style={{
                width: "293px",
                height: "42px",
                backgroundColor: "white",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                fontSize: "21px",
                fontWeight: 600,
                color: "#363636",
              }}
            >
              {shopInfo?.mobile}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#363636",
              }}
            >
              شماره تلفن
            </span>
            <div
              style={{
                width: "293px",
                height: "42px",
                backgroundColor: "white",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                fontSize: "21px",
                fontWeight: 600,
                color: "#363636",
              }}
            >
              {shopInfo?.extraData?.shopPhone}
            </div>
          </div>

          <div
            className="mt-10"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#363636",
              }}
            >
              آدرس فروشگاه:
            </span>
            <div
              style={{
                width: "737px",
                height: "42px",
                backgroundColor: "white",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                gap: "10px",
                fontSize: "21px",
                fontWeight: 600,
                color: "#363636",
              }}
            >
              <img
                src={map}
                alt="map"
                style={{ width: "20px", height: "20px" }}
              />
              {shopInfo?.extraData?.shopAddress}
            </div>
            <img
              src={mapIcon}
              alt="map"
              style={{ width: "35px", height: "35px" }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "23px",
          fontWeight: 400,
          color: "#363636",
          margin: "10px 0",
        }}
      >
        برای ویرایش اطلاعات فروشگاه با پشتیبانی با شماره 2000 5897 021 تماس
        بگیرید.
      </div>

      <div
        style={{
          width: "1512px",
          backgroundColor: "#EFEFEF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "15px",
          height: "227px",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            fontSize: "21px",
            fontWeight: 600,
            color: "black",
            marginBottom: "20px",
          }}
        >
          تغیر رمز عبور
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#363636",
                textAlign: "center",
              }}
            >
              رمز عبور فعلی
            </span>
            <Input
              type="password"
              width="322px"
              height={56}
              placeholder="رمز عبور فعلی را وارد کنید"
              placeholderStyle={{
                textAlign: "center",
              }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{
                borderRadius: "53px",
                backgroundColor: "#fff",
                border: "2px solid #7485E5",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#363636",
                textAlign: "center",
              }}
            >
              رمز عبور جدید
            </span>
            <Input
              type="password"
              width="322px"
              height={56}
              placeholderStyle={{
                textAlign: "center",
              }}
              placeholder="رمز عبور جدید را وارد کنید"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                borderRadius: "53px",
                backgroundColor: "#fff",
                border: "2px solid #7485E5",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#363636",
                textAlign: "center",
              }}
            >
              تکرار رمز عبور
            </span>
            <Input
              type="password"
              width="322px"
              placeholderStyle={{
                textAlign: "center",
              }}
              height={56}
              placeholder="رمز عبور جدید را تکرار کنید"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                borderRadius: "53px",
                backgroundColor: "#fff",
                border: "2px solid #7485E5",
              }}
            />
          </div>

          <Button
            label="تغیر رمز عبور"
            color="#7485E5"
            radius={53}
            style={{
              width: "267px",
              height: "56px",
              fontSize: "18px",
              fontWeight: 500,
            }}
            onClick={() => {
              changePasswordRequest({
                currentPassword: currentPassword,
                newPassword: newPassword,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;
