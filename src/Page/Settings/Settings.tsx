import React, { useState } from "react";
import SettingsTabs from "../../Components/Settings/SettingsTabs";
import ShopSettings from "../../Components/Settings/ShopSettings";
import GeneralSettings from "../../Components/Settings/GeneralSettings";
import CouriersSettings from "../../Components/Settings/CouriersSettings";
import mainSettings from "../../assets/mainSetting.svg";

type TabKey = "shop" | "general" | "couriers";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("shop");

  const handleTabChange = (key: string) => {
    setActiveTab(key as TabKey);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "shop":
        return <ShopSettings />;
      case "general":
        return <GeneralSettings />;
      case "couriers":
        return <CouriersSettings />;
      default:
        return <ShopSettings />;
    }
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <img src={mainSettings} alt="" />
        <span
          className="text-black mr-2"
          style={{ fontSize: "30px", fontWeight: 500 }}
        >
          تنظیمات
        </span>
      </div>
      <SettingsTabs activeTab={activeTab} onChange={handleTabChange} />
      {renderContent()}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <a
          href="https://www.shopp.ir"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "#7485E5",
            textDecoration: "none",
          }}
        >
          www.shopp.ir
        </a>
      </div>
    </>
  );
};

export default Settings;
