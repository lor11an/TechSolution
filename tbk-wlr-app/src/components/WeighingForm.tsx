import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Save, FileDown, Printer } from 'lucide-react';
import type { WeighingItemInput, DeductionsInput, Supplier } from '../types';
import { calculateItemSubtotal, generateTransactionCode } from '../lib/calculations';
import CalculationSummary from './CalculationSummary';
import PrintReceipt from './PrintReceipt';
import { exportToPDF, exportToExcel } from '../lib/export';
import { createWeighingSession } from '../lib/api';

interface WeighingFormProps {
  suppliers: Supplier[];
}

const initialDeductions: DeductionsInput = {
  ppn_amount: 0,
  kasut_amount: 0,
  keranjang_amount: 0,
};

export default function WeighingForm({ suppliers }: WeighingFormProps) {
  const [transactionCode] = useState(() => generateTransactionCode());
  const [selectedSupplier, setSelectedSupplier] = useState<number>(suppliers[0]?.id || 1);
  const [date] = useState(() => new Date().toISOString().split('T')[0]);
  const [locationStamp, setLocationStamp] = useState('KEBONAGUNG');
  const [signeeName, setSigneeName] = useState('ABDULLAH');
  const [items, setItems] = useState<WeighingItemInput[]>([
    { item_no: 1, item_label: '', gross_weight: 0, net_weight: 0, price_per_kg: 0, subtotal: 0 },
  ]);
  const [deductions, setDeductions] = useState<DeductionsInput>(initialDeductions);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Auto-calculate subtotal when item changes
  const handleItemChange = useCallback((index: number, field: keyof WeighingItemInput, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate subtotal if net_weight or price_per_kg changes
        if (field === 'net_weight' || field === 'price_per_kg') {
          updatedItem.subtotal = calculateItemSubtotal(updatedItem.net_weight, updatedItem.price_per_kg);
        }
        
        return updatedItem;
      })
    );
  }, []);

  // Add new row
  const addRow = useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        item_no: prev.length + 1,
        item_label: '',
        gross_weight: 0,
        net_weight: 0,
        price_per_kg: 0,
        subtotal: 0,
      },
    ]);
  }, []);

  // Remove row
  const removeRow = useCallback((index: number) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const newItems = prev.filter((_, i) => i !== index);
      // Re-number items
      return newItems.map((item, i) => ({ ...item, item_no: i + 1 }));
    });
  }, []);

  // Handle deduction change
  const handleDeductionChange = useCallback((field: keyof DeductionsInput, value: number) => {
    setDeductions((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle save
  const handleSave = async () => {
    const formData = {
      transaction_code: transactionCode,
      supplier_id: selectedSupplier,
      date,
      location_stamp: locationStamp,
      signee_name: signeeName,
      items,
      deductions,
    };

    try {
      await createWeighingSession(formData);
      alert('Transaction saved successfully!');
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction');
    }
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    const formData = {
      transaction_code: transactionCode,
      supplier_id: selectedSupplier,
      date,
      location_stamp: locationStamp,
      signee_name: signeeName,
      items,
      deductions,
    };
    
    const summary = {
      total_gross: items.reduce((sum, item) => sum + item.gross_weight, 0),
      total_net: items.reduce((sum, item) => sum + item.net_weight, 0),
      total_gross_hasil: items.reduce((sum, item) => sum + item.subtotal, 0),
      avg_price: 0,
      total_deductions: deductions.ppn_amount + deductions.kasut_amount + deductions.keranjang_amount,
      final_net_payout: 0,
    };
    
    summary.avg_price = summary.total_net > 0 ? summary.total_gross_hasil / summary.total_net : 0;
    summary.final_net_payout = summary.total_gross_hasil - summary.total_deductions;
    
    exportToPDF(formData, summary);
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    const formData = {
      transaction_code: transactionCode,
      supplier_id: selectedSupplier,
      date,
      location_stamp: locationStamp,
      signee_name: signeeName,
      items,
      deductions,
    };
    
    const summary = {
      total_gross: items.reduce((sum, item) => sum + item.gross_weight, 0),
      total_net: items.reduce((sum, item) => sum + item.net_weight, 0),
      total_gross_hasil: items.reduce((sum, item) => sum + item.subtotal, 0),
      avg_price: 0,
      total_deductions: deductions.ppn_amount + deductions.kasut_amount + deductions.keranjang_amount,
      final_net_payout: 0,
    };
    
    summary.avg_price = summary.total_net > 0 ? summary.total_gross_hasil / summary.total_net : 0;
    summary.final_net_payout = summary.total_gross_hasil - summary.total_deductions;
    
    exportToExcel(formData, summary);
  };

  // Handle print
  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">LAPORAN TBK WLR 2026</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Code</label>
            <input
              type="text"
              value={transactionCode}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.code})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Stamp</label>
            <input
              type="text"
              value={locationStamp}
              onChange={(e) => setLocationStamp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Signee Name</label>
            <input
              type="text"
              value={signeeName}
              onChange={(e) => setSigneeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Weighing Items</h2>
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus size={18} />
            Add Row
          </button>
        </div>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left w-16">NO</th>
              <th className="border border-gray-300 px-4 py-2 text-left">ITEM LABEL</th>
              <th className="border border-gray-300 px-4 py-2 text-right w-32">GROSS (kg)</th>
              <th className="border border-gray-300 px-4 py-2 text-right w-32">NET (kg)</th>
              <th className="border border-gray-300 px-4 py-2 text-right w-32">PRICE/kg</th>
              <th className="border border-gray-300 px-4 py-2 text-right w-32">HASIL</th>
              <th className="border border-gray-300 px-4 py-2 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{item.item_no}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.item_label}
                    onChange={(e) => handleItemChange(index, 'item_label', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Item label"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={item.gross_weight || ''}
                    onChange={(e) => handleItemChange(index, 'gross_weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={item.net_weight || ''}
                    onChange={(e) => handleItemChange(index, 'net_weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={item.price_per_kg || ''}
                    onChange={(e) => handleItemChange(index, 'price_per_kg', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                  {item.subtotal.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => removeRow(index)}
                    disabled={items.length <= 1}
                    className="p-1 text-red-600 hover:text-red-800 disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary & Deductions */}
      <CalculationSummary items={items} deductions={deductions} onDeductionChange={handleDeductionChange} />

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save size={20} />
            Save Transaction
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Printer size={20} />
            Print Receipt
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FileDown size={20} />
            Export PDF
          </button>
          
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FileDown size={20} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <PrintReceipt
          transactionCode={transactionCode}
          supplier={suppliers.find((s) => s.id === selectedSupplier)}
          date={date}
          locationStamp={locationStamp}
          signeeName={signeeName}
          items={items}
          deductions={deductions}
          onClose={() => setShowPrintPreview(false)}
        />
      )}
    </div>
  );
}
