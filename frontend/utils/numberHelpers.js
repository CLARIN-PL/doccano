
export function getIntegerLog10(number) {
    return Math.floor(Math.log10(number)) 
}

export function roundWithMaxPrecision(n, precision = 2) {
  const precisionWithPow10 = Math.pow(10, precision)
  return Math.round(n* precisionWithPow10) / precisionWithPow10
}  