import Num2Persian from 'num2persian';

export function numberToPersianToman(amount: string | number) {
    if (typeof amount !== 'number') {
        amount = Number(amount.toString().replace(/,/g, ''));
    }

    if (isNaN(amount)) return '';

    const rounded = Math.round(amount);
    return `${Num2Persian(rounded)} تومان`;
}

export function commaSeparator(number: string | number) {
    if (number === null || number === undefined) return '';

    const num = Number(number.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';

    return num.toLocaleString('fa-IR'); // or 'fa-IR' if Persian numerals are needed
}
