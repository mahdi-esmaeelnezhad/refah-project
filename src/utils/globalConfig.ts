// import { toPersianNumber } from './numberToPersianWord';

// Extend Number prototype to add Persian formatting
declare global {
  interface Number {
    toPersian(): string;
  }
}

// Add toPersian method to Number prototype
// Number.prototype.toPersian = function(this: number): string {
//   return toPersianNumber(this);
// };

// Configure Intl.NumberFormat for the entire application
const persianNumberFormat = new Intl.NumberFormat('fa-IR', {
  style: 'decimal',
  useGrouping: true,
});

// Override default number formatting
// const originalToString = Number.prototype.toString;
Number.prototype.toString = function(this: number): string {
  return persianNumberFormat.format(this);
};

export const setupPersianNumbers = () => {
  // This function can be called in your app's entry point
}; 