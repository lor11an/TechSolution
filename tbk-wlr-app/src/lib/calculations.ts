import type { WeighingItemInput, DeductionsInput, CalculationSummary } from '../types';

/**
 * Calculate subtotal for a single weighing item
 * Formula: subtotal = net_weight * price_per_kg
 */
export function calculateItemSubtotal(netWeight: number, pricePerKg: number): number {
  return parseFloat((netWeight * pricePerKg).toFixed(2));
}

/**
 * Calculate summary totals from weighing items and deductions
 */
export function calculateSummary(
  items: WeighingItemInput[],
  deductions: DeductionsInput
): CalculationSummary {
  // Summary Totals
  const total_gross = items.reduce((sum, item) => sum + item.gross_weight, 0);
  const total_net = items.reduce((sum, item) => sum + item.net_weight, 0);
  const total_gross_hasil = items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Average Price (rounded to 2 decimal places)
  const avg_price = total_net > 0 
    ? parseFloat((total_gross_hasil / total_net).toFixed(2))
    : 0;
  
  // Deductions & Net Payout
  const total_deductions = deductions.ppn_amount + deductions.kasut_amount + deductions.keranjang_amount;
  const final_net_payout = parseFloat((total_gross_hasil - total_deductions).toFixed(2));
  
  return {
    total_gross: parseFloat(total_gross.toFixed(2)),
    total_net: parseFloat(total_net.toFixed(2)),
    total_gross_hasil: parseFloat(total_gross_hasil.toFixed(2)),
    avg_price,
    total_deductions: parseFloat(total_deductions.toFixed(2)),
    final_net_payout,
  };
}

/**
 * Auto-calculate item subtotal when inputs change
 */
export function updateItemSubtotal(item: WeighingItemInput): WeighingItemInput {
  return {
    ...item,
    subtotal: calculateItemSubtotal(item.net_weight, item.price_per_kg),
  };
}

/**
 * Generate unique transaction code
 * Format: TBK-WLR-YYYYMMDD-XXXX
 */
export function generateTransactionCode(date: string = new Date().toISOString().split('T')[0]): string {
  const dateStr = date.replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `TBK-WLR-${dateStr}-${randomNum}`;
}

/**
 * Format currency for display (Indonesian Rupiah)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format weight for display
 */
export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} kg`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
