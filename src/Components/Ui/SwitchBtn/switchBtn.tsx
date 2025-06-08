// import React, { useState } from 'react';

// interface SwitchProps {
//   initialValue?: boolean;
//   onChange?: (value: boolean) => void;
//   labels?: {
//     on: string;
//     off: string;
//   };
// }

// const SwitchBtn: React.FC<SwitchProps> = ({ 
//   initialValue = false, 
//   onChange, 
//   labels = { on: 'حضورك', off: 'بيك' } 
// }) => {
//   const [isOn, setIsOn] = useState(initialValue);

//   const handleToggle = () => {
//     const newValue = !isOn;
//     setIsOn(newValue);
//     if (onChange) {
//       onChange(newValue);
//     }
//   };

//   return (
//     <div style={switchContainerStyle}>
//       <div style={switchStyle(isOn)} onClick={handleToggle}>
//         <div style={knobStyle(isOn)}></div>
//       </div>
//       <span style={labelStyle(isOn)}>{isOn ? labels.on : labels.off}</span>
//       <span style={ratingStyle}>[978-4.8]</span>
//     </div>
//   );
// };

// // Styles
// const switchContainerStyle: React.CSSProperties = {
//   display: 'flex',
//   alignItems: 'center',
//   gap: '10px',
//   fontFamily: 'Arial, sans-serif',
//   direction: 'rtl', // For RTL languages like Arabic
// };

// const switchStyle = (isOn: boolean): React.CSSProperties => ({
//   position: 'relative',
//   width: '60px',
//   height: '30px',
//   backgroundColor: isOn ? '#4CAF50' : '#e0e0e0',
//   borderRadius: '15px',
//   cursor: 'pointer',
//   transition: 'background-color 0.3s',
// });

// const knobStyle = (isOn: boolean): React.CSSProperties => ({
//   position: 'absolute',
//   top: '3px',
//   right: isOn ? '3px' : 'calc(100% - 27px)',
//   width: '24px',
//   height: '24px',
//   backgroundColor: 'white',
//   borderRadius: '50%',
//   boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//   transition: 'right 0.3s',
// });

// const labelStyle = (isOn: boolean): React.CSSProperties => ({
//   fontWeight: isOn ? 'bold' : 'normal',
//   color: isOn ? '#000' : '#666',
// });

// const ratingStyle: React.CSSProperties = {
//   color: '#888',
//   fontSize: '0.9em',
// };

// export default SwitchBtn;