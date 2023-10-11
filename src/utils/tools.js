export function decimalToBinaryArray(decimal) {
    return decimal.toString(2).split('').map(Number);
}