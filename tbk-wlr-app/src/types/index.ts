// Database Schema Types

export interface Supplier {
  id: number;
  code: string;
  name: string;
  location: string;
}

export interface WeighingHeader {
  id: number;
  transaction_code: string;
  supplier_id: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  location_stamp: string;
  signee_name: string;
}

export interface WeighingItem {
  id: number;
  header_id: number;
  item_no: number;
  item_label: string;
  gross_weight: number;
  net_weight: number;
  price_per_kg: number;
  subtotal: number;
}

export interface Deductions {
  id: number;
  header_id: number;
  ppn_amount: number;
  kasut_amount: number;
  keranjang_amount: number;
  total_deduction: number;
  final_payout: number;
}

// Form & UI Types

export interface WeighingItemInput {
  item_no: number;
  item_label: string;
  gross_weight: number;
  net_weight: number;
  price_per_kg: number;
  subtotal: number;
}

export interface DeductionsInput {
  ppn_amount: number;
  kasut_amount: number;
  keranjang_amount: number;
}

export interface WeighingFormData {
  transaction_code: string;
  supplier_id: number;
  date: string;
  location_stamp: string;
  signee_name: string;
  items: WeighingItemInput[];
  deductions: DeductionsInput;
}

export interface CalculationSummary {
  total_gross: number;
  total_net: number;
  total_gross_hasil: number;
  avg_price: number;
  total_deductions: number;
  final_net_payout: number;
}
