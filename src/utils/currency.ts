import { Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  SAR: { symbol: 'ر.س ', rate: 3.75, label: 'SAR (ر.س)' },
  AED: { symbol: 'د.إ ', rate: 3.67, label: 'AED (د.إ)' }
};

export function formatPrice(amountInUSD: number, currency: Currency): string {
  const { symbol, rate } = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round(amountInUSD * rate);
  
  if (currency === 'SAR' || currency === 'AED') {
    return `${converted.toLocaleString()} ${symbol.trim()}`;
  }
  return `${symbol}${converted.toLocaleString()}`;
}
