import { formatCurrency } from '../../currency-utils'

describe('currency-utils', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(10000)).toBe('10.000\u00A0COP')
      expect(formatCurrency(15000)).toBe('15.000\u00A0COP')
      expect(formatCurrency(1000000)).toBe('1.000.000\u00A0COP')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0\u00A0COP')
    })

    it('should format small numbers', () => {
      expect(formatCurrency(100)).toBe('100\u00A0COP')
      expect(formatCurrency(999)).toBe('999\u00A0COP')
    })

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567)).toBe('1.234.567\u00A0COP')
    })

    it('should handle decimal numbers by rounding correctly', () => {
      expect(formatCurrency(10000.9)).toBe('10.001\u00A0COP')
      expect(formatCurrency(15000.1)).toBe('15.000\u00A0COP')
    })

    it('should handle negative numbers', () => {
      expect(formatCurrency(-10000)).toBe('-10.000\u00A0COP')
      expect(formatCurrency(-5000)).toBe('-5000\u00A0COP')
    })
  })
})