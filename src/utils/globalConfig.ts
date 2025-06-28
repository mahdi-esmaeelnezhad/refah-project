
declare global {
  interface Number {
    toPersian(): string;
  }
}
const persianNumberFormat = new Intl.NumberFormat('fa-IR', {
  style: 'decimal',
  useGrouping: true,
});
Number.prototype.toString = function(this: number): string {
  return persianNumberFormat.format(this);
};

export const setupPersianNumbers = () => {
}; 