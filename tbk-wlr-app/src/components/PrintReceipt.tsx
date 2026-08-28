import React from 'react';
import { X } from 'lucide-react';
import type { WeighingItemInput, DeductionsInput, Supplier } from '../types';
import { calculateSummary, formatCurrency, formatDate } from '../lib/calculations';

interface PrintReceiptProps {
  transactionCode: string;
  supplier?: Supplier;
  date: string;
  locationStamp: string;
  signeeName: string;
  items: WeighingItemInput[];
  deductions: DeductionsInput;
  onClose: () => void;
}

export default function PrintReceipt({
  transactionCode,
  supplier,
  date,
  locationStamp,
  signeeName,
  items,
  deductions,
  onClose,
}: PrintReceiptProps) {
  const summary = calculateSummary(items, deductions);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Print Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-area" className="p-8">
          {/* Header */}
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold mb-2">LAPORAN TBK WLR 2026</h1>
            <p className="text-sm">Transaction Code: {transactionCode}</p>
            <p className="text-sm">Date: {formatDate(date)}</p>
          </div>

          {/* Supplier Info */}
          <div className="mb-6">
            <p><strong>Supplier:</strong> {supplier?.name || 'N/A'} ({supplier?.code || ''})</p>
            <p><strong>Location:</strong> {locationStamp}</p>
            <p><strong>Signee:</strong> {signeeName}</p>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border border-black mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black px-3 py-2 text-left">NO</th>
                <th className="border border-black px-3 py-2 text-left">ITEM LABEL</th>
                <th className="border border-black px-3 py-2 text-right">GROSS (kg)</th>
                <th className="border border-black px-3 py-2 text-right">NET (kg)</th>
                <th className="border border-black px-3 py-2 text-right">PRICE/kg</th>
                <th className="border border-black px-3 py-2 text-right">HASIL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.item_no}>
                  <td className="border border-black px-3 py-2">{item.item_no}</td>
                  <td className="border border-black px-3 py-2">{item.item_label}</td>
                  <td className="border border-black px-3 py-2 text-right">{item.gross_weight.toFixed(2)}</td>
                  <td className="border border-black px-3 py-2 text-right">{item.net_weight.toFixed(2)}</td>
                  <td className="border border-black px-3 py-2 text-right">{item.price_per_kg.toFixed(2)}</td>
                  <td className="border border-black px-3 py-2 text-right">{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Section */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Summary Totals */}
            <div>
              <h3 className="font-bold border-b border-black mb-2">Summary</h3>
              <p>Total Gross: {summary.total_gross.toFixed(2)} kg</p>
              <p>Total Net: {summary.total_net.toFixed(2)} kg</p>
              <p>Total Hasil: {formatCurrency(summary.total_gross_hasil)}</p>
              <p>Avg Price: {summary.avg_price.toFixed(2)} /kg</p>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-bold border-b border-black mb-2">Deductions</h3>
              <p>PPN: {formatCurrency(deductions.ppn_amount)}</p>
              <p>Kasut: {formatCurrency(deductions.kasut_amount)}</p>
              <p>Keranjang: {formatCurrency(deductions.keranjang_amount)}</p>
              <p className="font-bold mt-2">Total Deductions: {formatCurrency(summary.total_deductions)}</p>
              <p className="font-bold text-lg mt-2">Final Payout: {formatCurrency(summary.final_net_payout)}</p>
            </div>
          </div>

          {/* Footer with Signee */}
          <div className="mt-12 flex justify-end">
            <div className="text-center">
              <p>{locationStamp}, {formatDate(date)}</p>
              <div className="h-20"></div>
              <p className="font-bold border-t border-black pt-2 inline-block px-8">{signeeName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
