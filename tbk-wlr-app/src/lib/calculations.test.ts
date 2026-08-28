import { describe, it, expect } from 'vitest';
import {
  calculateItemSubtotal,
  calculateSummary,
  updateItemSubtotal,
  generateTransactionCode,
  formatCurrency,
  formatWeight,
  formatDate,
} from './calculations';
import type { WeighingItemInput, DeductionsInput } from '../types';

describe('Calculation Module', () => {
  describe('calculateItemSubtotal', () => {
    it('should calculate subtotal correctly', () => {
      expect(calculateItemSubtotal(10, 5000)).toBe(50000);
      expect(calculateItemSubtotal(5.5, 10000)).toBe(55000);
      expect(calculateItemSubtotal(0, 1000)).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateItemSubtotal(3.333, 1000)).toBe(3333);
    });
  });

  describe('calculateSummary', () => {
    const mockItems: WeighingItemInput[] = [
      { item_no: 1, item_label: 'Item 1', gross_weight: 100, net_weight: 90, price_per_kg: 5000, subtotal: 450000 },
      { item_no: 2, item_label: 'Item 2', gross_weight: 80, net_weight: 70, price_per_kg: 6000, subtotal: 420000 },
    ];

    const mockDeductions: DeductionsInput = {
      ppn_amount: 10000,
      kasut_amount: 5000,
      keranjang_amount: 3000,
    };

    it('should calculate total_gross correctly', () => {
      const summary = calculateSummary(mockItems, mockDeductions);
      expect(summary.total_gross).toBe(180);
    });

    it('should calculate total_net correctly', () => {
      const summary = calculateSummary(mockItems, mockDeductions);
      expect(summary.total_net).toBe(160);
    });

    it('should calculate total_gross_hasil correctly', () => {
      const summary = calculateSummary(mockItems, mockDeductions);
      expect(summary.total_gross_hasil).toBe(870000);
    });

    it('should calculate avg_price correctly', () => {
      const summary = calculateSummary(mockItems, mockDeductions);
      // 870000 / 160 = 5437.5
      expect(summary.avg_price).toBe(5437.5);
    });

    it('should calculate total_deductions correctly', () => {
      const summary = calculateSummary(mockItems, mockDeductions);
      expect(summary.total_deductions).toBe(18000);
    });

    it('should calculate final_net_payout correctly', () => {
      const summary = calculateSummary(mockItems, mockDeductions);
      // 870000 - 18000 = 852000
      expect(summary.final_net_payout).toBe(852000);
    });

    it('should handle empty items array', () => {
      const emptyItems: WeighingItemInput[] = [];
      const summary = calculateSummary(emptyItems, mockDeductions);
      
      expect(summary.total_gross).toBe(0);
      expect(summary.total_net).toBe(0);
      expect(summary.total_gross_hasil).toBe(0);
      expect(summary.avg_price).toBe(0);
      expect(summary.final_net_payout).toBe(-18000);
    });

    it('should handle zero deductions', () => {
      const zeroDeductions: DeductionsInput = {
        ppn_amount: 0,
        kasut_amount: 0,
        keranjang_amount: 0,
      };
      
      const summary = calculateSummary(mockItems, zeroDeductions);
      expect(summary.total_deductions).toBe(0);
      expect(summary.final_net_payout).toBe(870000);
    });
  });

  describe('updateItemSubtotal', () => {
    it('should update subtotal based on net_weight and price_per_kg', () => {
      const item: WeighingItemInput = {
        item_no: 1,
        item_label: 'Test',
        gross_weight: 100,
        net_weight: 90,
        price_per_kg: 5000,
        subtotal: 0,
      };

      const updated = updateItemSubtotal(item);
      expect(updated.subtotal).toBe(450000);
    });
  });

  describe('generateTransactionCode', () => {
    it('should generate code with correct format', () => {
      const code = generateTransactionCode('2026-05-05');
      expect(code).toMatch(/^TBK-WLR-20260505-\d{4}$/);
    });

    it('should use current date when not provided', () => {
      const code = generateTransactionCode();
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      expect(code).toMatch(new RegExp(`^TBK-WLR-${today}-\\d{4}$`));
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in Indonesian Rupiah', () => {
      expect(formatCurrency(1000000)).toContain('Rp');
      expect(formatCurrency(1000000)).toContain('1.000.000');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toContain('Rp');
    });
  });

  describe('formatWeight', () => {
    it('should format weight with kg suffix', () => {
      expect(formatWeight(100.5)).toBe('100.50 kg');
      expect(formatWeight(50)).toBe('50.00 kg');
    });
  });

  describe('formatDate', () => {
    it('should format date in Indonesian locale', () => {
      const formatted = formatDate('2026-05-05');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('Mei');
    });
  });
});
