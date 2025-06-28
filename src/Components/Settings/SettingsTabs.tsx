import React from "react";
import settingIcon from "../../assets/setting.svg";
import generalSettingIcon from "../../assets/generalSetting.svg";
import peykIcon from "../../assets/peyk.svg";

interface TabItem {
  key: string;
  label: string;
  icon: string;
}

interface SettingsTabsProps {
  activeTab: string;
  onChange: (key: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onChange }) => {
  const tabs: TabItem[] = [
    {
      key: "shop",
      label: "تنظیمات فروشگاه",
      icon: settingIcon,
    },
    {
      key: "general",
      label: "تنظیمات عمومی",
      icon: generalSettingIcon,
    },
    {
      key: "couriers",
      label: "پیک ها",
      icon: peykIcon,
    },
  ];

  return (
    <div
      style={{
        width: 1512,
        height: 60,
        background: "#E7E7E7",
        marginTop: 20,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      {tabs.map((tab, idx) => (
        <React.Fragment key={tab.key}>
          <div
            onClick={() => onChange(tab.key)}
            style={{
              width: "504px",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: activeTab === tab.key ? "#7485E5" : "transparent",
              color: activeTab === tab.key ? "#fff" : "#000",
              fontWeight: 500,
              fontSize: "23px",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.2s",
              userSelect: "none",
              gap: "8px",
            }}
          >
            {activeTab === tab.key && (
              <img
                src={tab.icon}
                alt={tab.label}
                style={{ width: "20px", height: "20px" }}
              />
            )}
            {tab.label}
          </div>
          {idx < tabs.length - 1 && (
            <div
              style={{
                width: 1,
                height: 37,
                background: "#D1D1D1",
                margin: "0 8px",
                alignSelf: "center",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SettingsTabs;
