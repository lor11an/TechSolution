import React, { useMemo } from 'react';
import type { WeighingItemInput, DeductionsInput, CalculationSummary } from '../types';
import { calculateSummary, formatCurrency } from '../lib/calculations';

interface CalculationSummaryProps {
  items: WeighingItemInput[];
  deductions: DeductionsInput;
  onDeductionChange: (field: keyof DeductionsInput, value: number) => void;
}

export default function CalculationSummary({ 
  items, 
  deductions, 
  onDeductionChange 
}: CalculationSummaryProps) {
  // Calculate summary using the calculation module
  const summary: CalculationSummary = useMemo(() => {
    return calculateSummary(items, deductions);
  }, [items, deductions]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Summary & Deductions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Totals */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 border-b pb-2">Summary Totals</h3>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Total Gross Weight:</span>
            <span className="font-medium">{summary.total_gross.toFixed(2)} kg</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Total Net Weight:</span>
            <span className="font-medium">{summary.total_net.toFixed(2)} kg</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Total Hasil:</span>
            <span className="font-medium">{formatCurrency(summary.total_gross_hasil)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Average Price:</span>
            <span className="font-medium">{summary.avg_price.toFixed(2)} /kg</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 border-b pb-2">Deductions</h3>
          
          <div className="flex justify-between items-center">
            <label className="text-gray-600">PPN:</label>
            <input
              type="number"
              value={deductions.ppn_amount || ''}
              onChange={(e) => onDeductionChange('ppn_amount', parseFloat(e.target.value) || 0)}
              className="w-32 px-2 py-1 border border-gray-300 rounded text-right"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <label className="text-gray-600">Kasut:</label>
            <input
              type="number"
              value={deductions.kasut_amount || ''}
              onChange={(e) => onDeductionChange('kasut_amount', parseFloat(e.target.value) || 0)}
              className="w-32 px-2 py-1 border border-gray-300 rounded text-right"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <label className="text-gray-600">Keranjang:</label>
            <input
              type="number"
              value={deductions.keranjang_amount || ''}
              onChange={(e) => onDeductionChange('keranjang_amount', parseFloat(e.target.value) || 0)}
              className="w-32 px-2 py-1 border border-gray-300 rounded text-right"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-600 font-medium">Total Deductions:</span>
            <span className="font-medium text-red-600">{formatCurrency(summary.total_deductions)}</span>
          </div>
          
          <div className="flex justify-between border-t-2 border-gray-800 pt-2 mt-2">
            <span className="text-gray-800 font-bold text-lg">Final Net Payout:</span>
            <span className="font-bold text-green-600 text-lg">{formatCurrency(summary.final_net_payout)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
