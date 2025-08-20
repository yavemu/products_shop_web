const CURRENCY_CONFIG = {
  style: "currency" as const,
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const LOCALE = "es-ES";

export const currencyFormatter = new Intl.NumberFormat(LOCALE, CURRENCY_CONFIG);

export const formatCurrency = (amount: number = 0): string => {
  return currencyFormatter.format(amount);
};
