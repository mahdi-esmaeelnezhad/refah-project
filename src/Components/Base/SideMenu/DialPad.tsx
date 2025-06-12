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

export function DialPad({ value, onChange, onConfirm, onClose }: DialPadProps) {
  const handlePress = (input: string) => {
    if (input === "delete") {
      if (value.length > 1) {
        onChange(value.slice(0, -1));
      } else if (value.length === 1) {
        onChange("1");
      }
    } else if (input === "tick") {
      console.log(2);

      onClose();
    } else {
      if (value === "1" && input !== ".") {
        onChange(input);
      } else if (value === "" && input === ".") {
        onChange("0.");
      } else if (input === "." && value.includes(".")) {
        return;
      } else {
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
          3
        </DialButton>
        <DialButton className="bg-our-choice" onClick={() => handlePress("2")}>
          2
        </DialButton>
        <DialButton className="bg-our-choice" onClick={() => handlePress("1")}>
          1
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
              6
            </DialButton>
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("5")}
            >
              5
            </DialButton>
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("4")}
            >
              4
            </DialButton>
          </div>
          <div className="flex gap-2">
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("9")}
            >
              9
            </DialButton>
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("8")}
            >
              8
            </DialButton>
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress("7")}
            >
              7
            </DialButton>
          </div>
          <div className="flex gap-2">
            <DialButton
              className="bg-our-choice"
              onClick={() => handlePress(".")}
            >
              .
            </DialButton>
            <DialButton
              className="bg-our-choice w-[138px]"
              onClick={() => handlePress("0")}
            >
              0
            </DialButton>
          </div>
        </div>
      </div>
    </div>
  );
}
