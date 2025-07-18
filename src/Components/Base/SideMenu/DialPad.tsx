import { EnterIcon, TickIcon } from "../../icons";

type DialButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const DialButton = ({ children, className = "", onClick }: DialButtonProps) => (
  <button
    onClick={onClick}
    className={`rounded-lg flex items-center justify-center h-16 w-16 active:opacity-75 transition-transform ${className}`}
  >
    {children}
  </button>
);

interface DialPadProps {
  value: string;
  onChange: (newValue: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function DialPad({ value, onChange, onClose }: DialPadProps) {
  // مپ اعداد انگلیسی به فارسی
  const toPersian = (d: string) => {
    const map: Record<string, string> = {
      "0": "۰",
      "1": "۱",
      "2": "۲",
      "3": "۳",
      "4": "۴",
      "5": "۵",
      "6": "۶",
      "7": "۷",
      "8": "۸",
      "9": "۹",
      ".": "٫",
    };
    return map[d] || d;
  };
  const handlePress = (input: string) => {
    if (input === "delete") {
      if (value.length > 1) {
        onChange(value.slice(0, -1));
      } else if (value.length === 1) {
        onChange("");
      }
    } else if (input === "tick") {
      onClose();
    } else {
      // if (value.length >= 12) {
      //   return;
      // }
      if (value === "" && input === "0") {
        return;
      }
      if (!/^[0-9.]$/.test(input)) {
        return;
      }
      if (value === "" && input.match(/[1-9]/)) {
        onChange(input);
      } else if (value !== "") {
        if (input === "." && value.includes(".")) {
          return;
        }
        onChange(value + input);
      }
    }
  };

  return (
    <div className="w-[330px] h-[320px] p-4 font-23 flex flex-col gap-2">
      {/* Top Row */}
      <div className="flex items-center justify-between gap-2">
        <DialButton
          className="bg-coming-soon h-16 w-20"
          onClick={() => handlePress("delete")}
        >
          <EnterIcon />
        </DialButton>
        <DialButton className="bg-our-choice" onClick={() => handlePress("3")}>
          {toPersian("3")}
        </DialButton>
        <DialButton className="bg-our-choice" onClick={() => handlePress("2")}>
          {toPersian("2")}
        </DialButton>
        <DialButton className="bg-our-choice" onClick={() => handlePress("1")}>
          {toPersian("1")}
        </DialButton>
      </div>

      {/* Remaining Pad */}
      <div className="flex gap-2">
        <DialButton
          className="bg-success h-[214px] min-w-20"
          onClick={() => handlePress("tick")}
        >
          <TickIcon />
        </DialButton>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("6")}
            >
              {toPersian("6")}
            </DialButton>
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("5")}
            >
              {toPersian("5")}
            </DialButton>
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("4")}
            >
              {toPersian("4")}
            </DialButton>
          </div>
          <div className="flex gap-2">
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("9")}
            >
              {toPersian("9")}
            </DialButton>
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("8")}
            >
              {toPersian("8")}
            </DialButton>
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("7")}
            >
              {toPersian("7")}
            </DialButton>
          </div>
          <div className="flex gap-2">
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress(".")}
            >
              {toPersian(".")}
            </DialButton>
            <DialButton
              className="bg-our-choice w-[138px]"
              onClick={() => handlePress("0")}
            >
              {toPersian("0")}
            </DialButton>
          </div>
        </div>
      </div>
    </div>
  );
}
