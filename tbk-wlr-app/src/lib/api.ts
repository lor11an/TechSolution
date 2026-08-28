import type { Supplier, WeighingHeader, WeighingItem, Deductions, WeighingFormData } from '../types';

// Mock in-memory database for demonstration
// In production, this would be replaced with actual API calls to a backend

let suppliers: Supplier[] = [
  { id: 1, code: 'SUP001', name: 'PT. Sumber Makmur', location: 'Kebonagung' },
  { id: 2, code: 'SUP002', name: 'CV. Berkah Jaya', location: 'Wonosari' },
  { id: 3, code: 'SUP003', name: 'UD. Rejeki Nompo', location: 'Plembutan' },
];

let weighingHeaders: WeighingHeader[] = [];
let weighingItems: WeighingItem[] = [];
let deductions: Deductions[] = [];

let headerIdCounter = 1;
let itemIdCounter = 1;
let deductionIdCounter = 1;

/**
 * Get all suppliers
 */
export async function getSuppliers(): Promise<Supplier[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(suppliers), 100);
  });
}

/**
 * Create a new weighing session (header + items + deductions)
 */
export async function createWeighingSession(formData: WeighingFormData): Promise<{
  header: WeighingHeader;
  items: WeighingItem[];
  deduction: Deductions;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create header
      const header: WeighingHeader = {
        id: headerIdCounter++,
        transaction_code: formData.transaction_code,
        supplier_id: formData.supplier_id,
        date: formData.date,
        status: 'completed',
        location_stamp: formData.location_stamp,
        signee_name: formData.signee_name,
      };
      weighingHeaders.push(header);

      // Create items
      const items: WeighingItem[] = formData.items.map((item) => ({
        id: itemIdCounter++,
        header_id: header.id,
        item_no: item.item_no,
        item_label: item.item_label,
        gross_weight: item.gross_weight,
        net_weight: item.net_weight,
        price_per_kg: item.price_per_kg,
        subtotal: item.subtotal,
      }));
      weighingItems.push(...items);

      // Create deductions
      const total_deduction = 
        formData.deductions.ppn_amount + 
        formData.deductions.kasut_amount + 
        formData.deductions.keranjang_amount;
      
      const total_gross_hasil = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
      const final_payout = total_gross_hasil - total_deduction;

      const deduction: Deductions = {
        id: deductionIdCounter++,
        header_id: header.id,
        ppn_amount: formData.deductions.ppn_amount,
        kasut_amount: formData.deductions.kasut_amount,
        keranjang_amount: formData.deductions.keranjang_amount,
        total_deduction,
        final_payout,
      };
      deductions.push(deduction);

      resolve({ header, items, deduction });
    }, 200);
  });
}

/**
 * Get weighing session by ID
 */
export async function getWeighingSession(id: number): Promise<{
  header: WeighingHeader | null;
  items: WeighingItem[];
  deduction: Deductions | null;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const header = weighingHeaders.find((h) => h.id === id) || null;
      const items = weighingItems.filter((i) => i.header_id === id);
      const deduction = deductions.find((d) => d.header_id === id) || null;
      resolve({ header, items, deduction });
    }, 100);
  });
}

/**
 * Get all weighing sessions
 */
export async function getAllWeighingSessions(): Promise<WeighingHeader[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(weighingHeaders), 100);
  });
}

/**
 * Update weighing session
 */
export async function updateWeighingSession(
  id: number,
  formData: WeighingFormData
): Promise<{
  header: WeighingHeader;
  items: WeighingItem[];
  deduction: Deductions;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update header
      const headerIndex = weighingHeaders.findIndex((h) => h.id === id);
      if (headerIndex === -1) {
        throw new Error('Weighing session not found');
      }
      
      weighingHeaders[headerIndex] = {
        ...weighingHeaders[headerIndex],
        transaction_code: formData.transaction_code,
        supplier_id: formData.supplier_id,
        date: formData.date,
        location_stamp: formData.location_stamp,
        signee_name: formData.signee_name,
      };

      // Remove old items and add new ones
      weighingItems = weighingItems.filter((i) => i.header_id !== id);
      const items: WeighingItem[] = formData.items.map((item) => ({
        id: itemIdCounter++,
        header_id: id,
        item_no: item.item_no,
        item_label: item.item_label,
        gross_weight: item.gross_weight,
        net_weight: item.net_weight,
        price_per_kg: item.price_per_kg,
        subtotal: item.subtotal,
      }));
      weighingItems.push(...items);

      // Update deductions
      const deductionIndex = deductions.findIndex((d) => d.header_id === id);
      const total_deduction = 
        formData.deductions.ppn_amount + 
        formData.deductions.kasut_amount + 
        formData.deductions.keranjang_amount;
      
      const total_gross_hasil = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
      const final_payout = total_gross_hasil - total_deduction;

      if (deductionIndex !== -1) {
        deductions[deductionIndex] = {
          ...deductions[deductionIndex],
          ppn_amount: formData.deductions.ppn_amount,
          kasut_amount: formData.deductions.kasut_amount,
          keranjang_amount: formData.deductions.keranjang_amount,
          total_deduction,
          final_payout,
        };
      }

      resolve({ 
        header: weighingHeaders[headerIndex], 
        items, 
        deduction: deductions.find((d) => d.header_id === id)! 
      });
    }, 200);
  });
}

/**
 * Delete weighing session
 */
export async function deleteWeighingSession(id: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const headerIndex = weighingHeaders.findIndex((h) => h.id === id);
      if (headerIndex === -1) {
        resolve(false);
        return;
      }
      
      weighingHeaders.splice(headerIndex, 1);
      weighingItems = weighingItems.filter((i) => i.header_id !== id);
      deductions = deductions.filter((d) => d.header_id !== id);
      
      resolve(true);
    }, 100);
  });
}
