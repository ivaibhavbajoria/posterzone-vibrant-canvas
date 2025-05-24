
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const convertToINR = (usdAmount: number): number => {
  // Assuming 1 USD = 83 INR (this should be dynamic in real implementation)
  const exchangeRate = 83;
  return usdAmount * exchangeRate;
};
