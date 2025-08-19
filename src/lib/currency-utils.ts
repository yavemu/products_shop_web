const CURRENCY_CONFIG = {
  style: "currency" as const,
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const LOCALE = "es-ES";

// Formateador reutilizable
export const currencyFormatter = new Intl.NumberFormat(LOCALE, CURRENCY_CONFIG);

// Función helper con valor por defecto
export const formatCurrency = (amount: number = 0): string => {
  return currencyFormatter.format(amount);
};
