import React, { useState } from "react";
import Input from "../Ui/Input/input";
import { Button } from "../Ui/Button/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearToken } from "../../store/authSlice";
import question from "../../assets/question.svg";
import ticket from "../../assets/ticket.svg";
import software from "../../assets/softwere.svg";
import key from "../../assets/key copy.svg";
import logout from "../../assets/logout.svg";
import reload from "../../assets/reload.svg";
import LogoutConfirmModal from "../Modal/LogoutConfirmModal";

// Simple tab component for two-item tabs
interface SimpleTabProps {
  items: string[];
  activeItem: string;
  onItemChange: (item: string) => void;
  width?: string;
  height?: string;
}

const SimpleTab: React.FC<SimpleTabProps> = ({
  items,
  activeItem,
  onItemChange,
  width = "340px",
  height = "40px",
}) => (
  <div
    style={{
      width,
      height,
      background: "#fff",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    }}
  >
    {items.map((item, idx) => (
      <React.Fragment key={item}>
        <div
          onClick={() => onItemChange(item)}
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: activeItem === item ? "#7485E5" : "transparent",
            color: activeItem === item ? "#fff" : "#000",
            fontWeight: 500,
            fontSize: 16,
            cursor: "pointer",
            borderRadius: "10px",
            transition: "all 0.2s",
            userSelect: "none",
          }}
        >
          {item}
        </div>
        {idx < items.length - 1 && (
          <div
            style={{
              width: 1,
              height: "70%",
              background: "#D1D1D1",
              alignSelf: "center",
            }}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

const GeneralSettings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [vatStatus, setVatStatus] = useState("فعال");
  const [currency, setCurrency] = useState("ریال");
  const [secondMonitor, setSecondMonitor] = useState("فعال");
  const [shopName, setShopName] = useState("");
  const [terminalId, setTerminalId] = useState("");
  const [receiverNumber, setReceiverNumber] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    dispatch(clearToken());
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              width: "476px",
              height: "290px",
              backgroundColor: "#EFEFEF",
              borderRadius: "15px",
              padding: "20px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "21px",
                fontWeight: 600,
                color: "black",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              اطلاعات فروشگاه
            </div>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "21px",
                  fontWeight: 600,
                  color: "#363636",
                  marginBottom: "15px",
                }}
              >
                مالیات بر ارزش افزوده:
              </div>
              <SimpleTab
                items={["فعال", "غیر فعال"]}
                activeItem={vatStatus}
                onItemChange={setVatStatus}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "21px",
                  fontWeight: 600,
                  color: "#363636",
                  marginBottom: "15px",
                }}
              >
                واحد پول:
              </div>
              <SimpleTab
                items={["ریال", "تومان"]}
                activeItem={currency}
                onItemChange={setCurrency}
              />
            </div>
          </div>

          <div
            style={{
              width: "476px",
              height: "290px",
              backgroundColor: "#EFEFEF",
              borderRadius: "15px",
              padding: "20px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                fontSize: "21px",
                fontWeight: 600,
                color: "black",
                marginBottom: "30px",
              }}
            >
              تنظیمات دستگاه
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "21px",
                  fontWeight: 600,
                  color: "#363636",
                  marginBottom: "15px",
                }}
              >
                مانیتور دوم:
              </div>
              <SimpleTab
                items={["فعال", "غیر فعال"]}
                activeItem={secondMonitor}
                onItemChange={setSecondMonitor}
              />
            </div>
          </div>
        </div>

        {/* Support Box */}
        <div
          style={{
            width: "966px",
            height: "304px",
            backgroundColor: "#EFEFEF",
            borderRadius: "15px",
            padding: "20px 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              fontSize: "21px",
              fontWeight: 600,
              color: "black",
              marginBottom: "40px",
            }}
          >
            پشتیبانی
          </div>

          <div
            style={{
              width: "716px",
              height: "53px",
              backgroundColor: "white",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "#363636",
              marginBottom: "30px",
            }}
          >
            جهت مشاوره و پشتیبانی با شماره 2000 5897 021 تماس حاصل بفرمایید
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <Button
              label=""
              color="#7485E5"
              radius={10}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "263px",
                height: "55px",
                fontSize: "16px",
                fontWeight: 500,
              }}
              onClick={() => console.log("سوالات متداول")}
            >
              <img className="mx-2" src={question} alt="question" />
              <span style={{ fontSize: "18px", fontWeight: 500 }}>
                سوالات متداول
              </span>
            </Button>
            <Button
              label=""
              color="#7485E5"
              radius={10}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "263px",
                height: "55px",
                fontSize: "16px",
                fontWeight: 500,
              }}
              onClick={() => console.log("ارسال تیکت")}
            >
              <img className="mx-2" src={ticket} alt="ticket" />
              <span style={{ fontSize: "18px", fontWeight: 500 }}>
                ارسال تیکت
              </span>
            </Button>
            <Button
              label=""
              color="#7485E5"
              radius={10}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "263px",
                height: "55px",
                fontSize: "16px",
                fontWeight: 500,
              }}
              onClick={() => console.log("آموزش نرم افزار")}
            >
              <img className="mx-2" src={software} alt="software" />
              <span style={{ fontSize: "18px", fontWeight: 500 }}>
                آموزش نرم افزار
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div
        style={{
          width: "493px",
          height: "389px",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            marginBottom: "50px",
            backgroundColor: "#EFEFEF",
            borderRadius: "15px",

            padding: "20px 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{ marginBottom: "30px" }}
            className="flex justify-between items-center w-full"
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#363636",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "21px", fontWeight: 600 }}>
                نام فروشگاه:
              </span>
            </div>
            <Input
              type="text"
              width="269px"
              height={48}
              backgroundColor="#fff"
              placeholder="نام فروشگاه را وارد کنید"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              style={{
                borderRadius: "55px",
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div
            style={{ marginBottom: "30px" }}
            className="flex justify-between items-center w-full"
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#363636",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "21px", fontWeight: 600 }}>
                شناسه ترمینال:
              </span>
            </div>
            <Input
              type="text"
              width="269px"
              height={48}
              backgroundColor="#fff"
              placeholder="شناسه ترمینال را وارد کنید"
              value={terminalId}
              onChange={(e) => setTerminalId(e.target.value)}
              style={{
                borderRadius: "55px",
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div
            style={{ marginBottom: "30px" }}
            className="flex justify-between items-center w-full"
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#363636",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "21px", fontWeight: 600 }}>
                شماره پذیرنده:
              </span>
            </div>
            <Input
              type="text"
              width="269px"
              height={48}
              backgroundColor="#fff"
              placeholder="شماره پذیرنده را وارد کنید"
              value={receiverNumber}
              onChange={(e) => setReceiverNumber(e.target.value)}
              style={{
                borderRadius: "55px",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <Button
            label=""
            color="#7485E5"
            radius={10}
            style={{
              width: "364px",
              height: "60px",
              fontSize: "18px",
              fontWeight: 500,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => console.log("تبادل کلید")}
          >
            <img className="mx-2" src={key} alt="key" />
            <span style={{ fontSize: "18px", fontWeight: 500 }}>
              تبادل کلید
            </span>
          </Button>
        </div>
        <div>
          <Button
            label=""
            color="#7485E5"
            radius={10}
            style={{
              width: "364px",
              height: "60px",
              fontSize: "18px",
              fontWeight: 500,
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => console.log("به روز رسانی شاپین پرو")}
          >
            <img className="mx-2" src={reload} alt="reload" />
            <span style={{ fontSize: "18px", fontWeight: 500 }}>
              به روز رسانی شاپین پرو
            </span>
          </Button>

          {/* Version Text */}
          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 500,
              color: "#363636",
              marginBottom: "45px",
            }}
          >
            نسخه فعلی: ۱.۲.۴
          </div>

          {/* Logout Button */}
          <Button
            label=""
            color="#DE4949"
            radius={10}
            style={{
              width: "364px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 500,
            }}
            onClick={handleLogoutClick}
          >
            <img className="mx-2" src={logout} alt="logout" />
            <span style={{ fontSize: "18px", fontWeight: 500 }}>خروج</span>
          </Button>
        </div>
      </div>

      {/* Logout Confirm Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default GeneralSettings;
