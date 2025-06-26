// import React from "react";
// import closeIcon from "../../assets/close.svg";
// import trashIcon from "../../assets/trash.svg";
// import { Button } from "../Ui/Button/button";

// interface DeleteModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onDelete: () => void;
//   invoiceNumber: string;
// }

// const DeleteModal: React.FC<DeleteModalProps> = ({
//   isOpen,
//   onClose,
//   onDelete,
//   invoiceNumber,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

//       {/* Modal */}
//       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[453px] h-[291px] bg-white rounded-lg shadow-lg z-50">
//         <div className="flex rounded-sm flex-col items-center p-6 relative">
//           {/* Close Icon */}
//           <img
//             src={closeIcon}
//             alt="close"
//             className="w-6 h-6 absolute top-4 right-4 cursor-pointer"
//             onClick={onClose}
//           />

//           {/* Trash Icon */}
//           <img src={trashIcon} alt="trash" className="w-10 h-10 mb-4 mt-2" />

//           {/* Message */}
//           <p className="text-[23px] font-[600] text-center mb-6">
//             آیا مایل به حذف فاکتور {invoiceNumber} هستید؟
//           </p>

//           {/* Buttons */}
//           <div className="flex gap-4 mt-8">
//             <Button
//               label="حذف"
//               color="#DE4949"
//               radius={15}
//               style={{
//                 width: "135px",
//                 height: "48px",
//                 fontSize: "23px",
//                 fontWeight: "600",
//               }}
//               onClick={onDelete}
//             />
//             <Button
//               label="انصراف"
//               color="#DE4949"
//               variant="outline"
//               radius={15}
//               style={{
//                 width: "135px",
//                 height: "48px",
//                 fontSize: "23px",
//                 fontWeight: "600",
//                 border: "2px solid #DE4949",
//               }}
//               onClick={onClose}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DeleteModal;
