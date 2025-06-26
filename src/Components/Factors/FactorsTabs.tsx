import React from "react";

const tabs = [
  { key: "today", label: "لیست فاکتورهای امروز" },
  { key: "credit", label: "فاکتورهای اعتباری" },
  { key: "debt", label: "فاکتورهای نسیه" },
  { key: "courier", label: "ارسال با پیک" },
  { key: "canceled", label: "فاکتورهای ابطال شده" },
  { key: "waste", label: "ضایعات" },
];

interface Props {
  activeTab: string;
  onChange: (key: string) => void;
}

const FactorTabs: React.FC<Props> = ({ activeTab, onChange }) => (
  <div
    style={{
      width: 1512,
      height: 60,
      background: "#D1D1D1",
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
            width: 245,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: activeTab === tab.key ? "#7485E5" : "transparent",
            color: activeTab === tab.key ? "#fff" : "#000",
            fontWeight: 500,
            fontSize: 16,
            borderRadius: 10,
            cursor: "pointer",
            transition: "all 0.2s",
            userSelect: "none",
          }}
        >
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

export default FactorTabs;
