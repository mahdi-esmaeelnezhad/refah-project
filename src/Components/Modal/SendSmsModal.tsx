// import React, { useState, useEffect, useRef } from "react";
// import CloseIcon from "../../assets/close.svg";
// import useRequest from "../../hooks/useRequest";
// import { AUTH_ENDPOINTS } from "../../endpoint/login/login";

// interface SendSmsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   customerPhone: string;
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// const SendSmsModal: React.FC<SendSmsModalProps> = ({
//   isOpen,
//   onClose,
//   customerPhone,
//   onSuccess,
//   onCancel,
// }) => {
//   const [code, setCode] = useState<string[]>(Array(4).fill(""));
//   const [timer, setTimer] = useState(90);
//   const [isTimerActive, setIsTimerActive] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));

//   const { execute: verifyCodeRequest, loading: verifyLoading } =
//     useRequest<any>(AUTH_ENDPOINTS.verifyMobileCode, "POST");

//   const { execute: resendCodeRequest, loading: resendLoading } =
//     useRequest<any>(AUTH_ENDPOINTS.resetPassword, "POST");

//   useEffect(() => {
//     let interval: number;
//     if (isTimerActive && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       setIsTimerActive(false);
//     }
//     return () => clearInterval(interval);
//   }, [isTimerActive, timer]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleSendCode = async () => {
//     setIsLoading(true);
//     try {
//       const response = await resendCodeRequest({ mobile: customerPhone });
//       if (response?.status === 204) {
//         setIsTimerActive(true);
//         setTimer(90);
//       }
//     } catch (error: any) {
//       console.error("Error sending SMS:", error);
//       alert(error?.response?.data?.title || "خطا در ارسال کد");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCodeChange = (index: number, value: string) => {
//     if (value.length > 1) value = value[0];
//     if (!/^\d*$/.test(value)) return;

//     const newCode = [...code];
//     newCode[index] = value;
//     setCode(newCode);

//     if (value !== "" && index < 3) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === "Backspace" && code[index] === "" && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerifyCode = async () => {
//     const codeString = code.join("");
//     if (codeString.length !== 4) {
//       alert("لطفا کد تایید را کامل وارد کنید");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await verifyCodeRequest({
//         mobile: customerPhone,
//         code: codeString,
//       });
//       if (response?.status === 200) {
//         onSuccess();
//       }
//     } catch (error: any) {
//       console.error("Error verifying code:", error);
//       alert(error?.response?.data?.title || "کد وارد شده صحیح نیست");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendCode = () => {
//     handleSendCode();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-[500px] max-w-md">
//         <img
//           src={CloseIcon}
//           alt="بستن"
//           onClick={onClose}
//           style={{
//             position: "relative",
//             top: "0px",
//             right: "380px",
//           }}
//           className="cursor-pointer w-6 h-6"
//         />
//         {/* Header with close button */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-lg f-23 text-center flex-1">
//             ارسال کد به شماره {customerPhone} انجام شود؟
//           </h2>
//         </div>

//         {/* Send/Resend button */}
//         <div className="flex justify-between items-center mb-6">
//           <button
//             onClick={isTimerActive ? handleResendCode : handleSendCode}
//             disabled={isTimerActive || isLoading || resendLoading}
//             className="bg-[#479E55] text-white px-6 py-3 rounded-[52px] w-[162px] h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {resendLoading
//               ? "در حال ارسال..."
//               : isTimerActive
//               ? "ارسال مجدد"
//               : "ارسال"}
//           </button>
//           {isTimerActive && (
//             <span className="text-gray-600 font-medium">
//               {formatTime(timer)}
//             </span>
//           )}
//         </div>

//         {/* Code input */}
//         <div
//           style={{
//             display: "flex",
//             gap: "12px",
//             marginTop: "20px",
//             marginBottom: "20px",
//             direction: "ltr",
//             justifyContent: "center",
//           }}
//         >
//           {code.map((value, index) => (
//             <input
//               key={index}
//               ref={(el) => {
//                 inputRefs.current[index] = el;
//               }}
//               type="text"
//               value={value}
//               onChange={(e) => handleCodeChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               style={{
//                 backgroundColor: "#E7E7E7",
//                 width: "60px",
//                 height: "60px",
//                 textAlign: "center",
//                 fontSize: "20px",
//                 fontWeight: "500",
//                 border: "1px solid #ccc",
//                 borderRadius: "10px",
//                 outline: "none",
//               }}
//               maxLength={1}
//             />
//           ))}
//         </div>

//         {/* Action buttons */}
//         <div className="flex justify-between mt-10 gap-4">
//           <button
//             onClick={handleVerifyCode}
//             disabled={code.join("").length !== 4 || isLoading || verifyLoading}
//             className="flex-1 bg-[#7485E5] w-[165px] text-white py-3 rounded-[15px] font-medium " //disabled:opacity-50 disabled:cursor-not-allowed
//           >
//             {verifyLoading ? "در حال بررسی..." : "تایید"}
//           </button>
//           <button
//             onClick={onCancel}
//             className="flex-1 border border-[#7485E5] w-[165px] text-[#7485E5] py-3 rounded-[15px] font-medium"
//           >
//             رد شدن
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SendSmsModal;

import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "../../assets/close.svg";

interface SendSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerPhone: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SendSmsModal: React.FC<SendSmsModalProps> = ({
  isOpen,
  onClose,
  customerPhone,
  onSuccess,
  onCancel,
}) => {
  const [code, setCode] = useState<string[]>(Array(4).fill(""));
  const [timer, setTimer] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));

  useEffect(() => {
    let interval: number;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toLocaleString("fa-IR").padStart(2, "0")}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = () => {
    const codeString = code.join("");
    if (codeString.length !== 4) {
      alert("لطفا کد تایید را کامل وارد کنید");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (codeString === "1234") {
        onSuccess();
      } else {
        alert("کد وارد شده صحیح نیست");
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-md">
        <img
          src={CloseIcon}
          alt="بستن"
          onClick={onClose}
          style={{
            position: "relative",
            top: "0px",
            right: "380px",
          }}
          className="cursor-pointer w-6 h-6"
        />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg f-23 text-center flex-1">
            ارسال کد به شماره {customerPhone} انجام شود؟
          </h2>
        </div>

        {/* تایمر فقط نمایشی */}
        <div className="px-8 flex justify-between items-center mb-6">
          <button
            disabled
            className="bg-[#479E55] text-white px-6 py-3 rounded-[52px] w-[162px] h-[52px] opacity-50 cursor-not-allowed"
          >
            ارسال شده
          </button>
          {isTimerActive && (
            <span
              style={{ fontSize: "23px" }}
              className=" f-[23px] font-medium"
            >
              {/* convert timer to persian number */}
              {formatTime(timer)}
            </span>
          )}
        </div>

        {/* Code input */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
            marginBottom: "20px",
            direction: "ltr",
            justifyContent: "center",
          }}
        >
          {code.map((value, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={value}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              style={{
                backgroundColor: "#E7E7E7",
                width: "60px",
                height: "60px",
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "500",
                border: "1px solid #ccc",
                borderRadius: "10px",
                outline: "none",
              }}
              maxLength={1}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-10 gap-4">
          <button
            onClick={handleVerifyCode}
            disabled={code.join("").length !== 4 || isLoading}
            className="flex-1 bg-[#7485E5] w-[165px] text-white py-3 rounded-[15px] font-medium"
          >
            {isLoading ? "در حال بررسی..." : "تایید"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-[#7485E5] w-[165px] text-[#7485E5] py-3 rounded-[15px] font-medium"
          >
            رد شدن
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendSmsModal;
