import Num2Persian from 'num2persian';

export function numberToPersianToman(amount: string | number) {
    if (typeof amount !== 'number') {
        amount = Number(amount.toString().replace(/,/g, ''));
    }

    if (isNaN(amount)) return '';

    const rounded = Math.round(amount);
    return `${Num2Persian(rounded)} ریال`;
}

export function commaSeparator(number: string | number) {
    // replace , with .
    if (number === null || number === undefined) return '';

    const num = Number(number.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';

    return num.toLocaleString('fa-IR');
}

export function toPersianDigits(str: string) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return str.replace(/\d/g, (d) => persianDigits[+d]);
}

export function addCommas(num: string) {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatPersianNumber(num: string) {
  return toPersianDigits(addCommas(num.replace(/,/g, "")));
}
