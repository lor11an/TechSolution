import type { WeighingFormData, CalculationSummary } from '../types';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Export weighing data to PDF
 */
export function exportToPDF(formData: WeighingFormData, summary: CalculationSummary): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.text('LAPORAN TBK WLR 2026', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Transaction Code: ${formData.transaction_code}`, 105, 30, { align: 'center' });
  doc.text(`Date: ${formData.date}`, 105, 38, { align: 'center' });
  
  // Supplier Info
  doc.setFontSize(10);
  doc.text(`Supplier ID: ${formData.supplier_id}`, 20, 50);
  doc.text(`Location: ${formData.location_stamp}`, 20, 56);
  doc.text(`Signee: ${formData.signee_name}`, 20, 62);
  
  // Items Table Header
  let yPos = 75;
  doc.setFontSize(10);
  doc.text('No', 20, yPos);
  doc.text('Item Label', 30, yPos);
  doc.text('Gross (kg)', 70, yPos);
  doc.text('Net (kg)', 95, yPos);
  doc.text('Price/kg', 120, yPos);
  doc.text('Subtotal', 150, yPos);
  
  // Draw header line
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  // Items
  yPos += 10;
  formData.items.forEach((item) => {
    doc.text(String(item.item_no), 20, yPos);
    doc.text(item.item_label, 30, yPos);
    doc.text(item.gross_weight.toFixed(2), 70, yPos);
    doc.text(item.net_weight.toFixed(2), 95, yPos);
    doc.text(String(item.price_per_kg), 120, yPos);
    doc.text(String(item.subtotal), 150, yPos);
    yPos += 8;
  });
  
  // Summary Section
  yPos += 10;
  doc.line(20, yPos - 5, 190, yPos - 5);
  doc.text(`Total Gross: ${summary.total_gross} kg`, 120, yPos);
  yPos += 6;
  doc.text(`Total Net: ${summary.total_net} kg`, 120, yPos);
  yPos += 6;
  doc.text(`Total Hasil: ${summary.total_gross_hasil}`, 120, yPos);
  yPos += 6;
  doc.text(`Avg Price: ${summary.avg_price}`, 120, yPos);
  yPos += 10;
  
  // Deductions
  doc.text('Deductions:', 20, yPos);
  yPos += 6;
  doc.text(`PPN: ${formData.deductions.ppn_amount}`, 25, yPos);
  yPos += 6;
  doc.text(`Kasut: ${formData.deductions.kasut_amount}`, 25, yPos);
  yPos += 6;
  doc.text(`Keranjang: ${formData.deductions.keranjang_amount}`, 25, yPos);
  yPos += 8;
  doc.text(`Total Deductions: ${summary.total_deductions}`, 120, yPos);
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Final Net Payout: ${summary.final_net_payout}`, 120, yPos);
  
  // Footer with signee
  yPos += 20;
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.location_stamp}, ${formData.date}`, 140, yPos);
  yPos += 25;
  doc.text(formData.signee_name, 140, yPos);
  
  // Save PDF
  doc.save(`${formData.transaction_code}.pdf`);
}

/**
 * Export weighing data to Excel
 */
export function exportToExcel(formData: WeighingFormData, summary: CalculationSummary): void {
  const wb = XLSX.utils.book_new();
  
  const data = [
    ['LAPORAN TBK WLR 2026'],
    ['Transaction Code:', formData.transaction_code],
    ['Date:', formData.date],
    ['Supplier ID:', formData.supplier_id],
    ['Location:', formData.location_stamp],
    ['Signee:', formData.signee_name],
    [],
    ['No', 'Item Label', 'Gross Weight (kg)', 'Net Weight (kg)', 'Price per kg', 'Subtotal'],
  ];
  
  formData.items.forEach((item) => {
    data.push([
      item.item_no,
      item.item_label,
      item.gross_weight,
      item.net_weight,
      item.price_per_kg,
      item.subtotal,
    ]);
  });
  
  data.push([]);
  data.push(['Summary', '', '', '', '', '']);
  data.push(['Total Gross', summary.total_gross, '', '', '', '']);
  data.push(['Total Net', summary.total_net, '', '', '', '']);
  data.push(['Total Hasil', summary.total_gross_hasil, '', '', '', '']);
  data.push(['Average Price', summary.avg_price, '', '', '', '']);
  data.push([]);
  data.push(['Deductions', '', '', '', '', '']);
  data.push(['PPN', formData.deductions.ppn_amount, '', '', '', '']);
  data.push(['Kasut', formData.deductions.kasut_amount, '', '', '', '']);
  data.push(['Keranjang', formData.deductions.keranjang_amount, '', '', '', '']);
  data.push(['Total Deductions', summary.total_deductions, '', '', '', '']);
  data.push(['Final Net Payout', summary.final_net_payout, '', '', '', '']);
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Weighing Report');
  XLSX.writeFile(wb, `${formData.transaction_code}.xlsx`);
}
