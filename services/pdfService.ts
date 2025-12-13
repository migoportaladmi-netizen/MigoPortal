import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense, Trip } from '../types';

// Helper to format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

export const generateExpensesPDF = (expenses: Expense[]) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text("MigoPortal Expenses Report", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Table Data
  const tableColumn = ["Date", "Merchant", "Category", "Amount", "Status", "Tax Deductible"];
  const tableRows = expenses.map(expense => [
    expense.date,
    expense.merchant,
    expense.category,
    formatCurrency(expense.amount, expense.currency),
    expense.status,
    expense.taxDeductibility || '-'
  ]);

  // Calculate Total
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Generate Table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  // Total Footer
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total Expenses: ${formatCurrency(totalAmount, 'USD')}`, 14, finalY + 15);

  doc.save('MigoPortal_Expenses_Report.pdf');
};

export const generateItineraryPDF = (trip: Trip, itineraryContent: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const maxLineWidth = pageWidth - (margin * 2);

  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229);
  doc.text(trip.destination, margin, 22);

  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text(`${trip.purpose}`, margin, 32);
  doc.text(`${trip.startDate} to ${trip.endDate}`, margin, 38);

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, 45, pageWidth - margin, 45);

  // Content Processing
  // Remove bold/markdown markers for cleaner plain text in PDF
  let cleanText = itineraryContent
    .replace(/\*\*/g, '') // Remove bold
    .replace(/## /g, '') // Remove H2 markers
    .replace(/# /g, '')  // Remove H1 markers
    .replace(/`/g, '');  // Remove code ticks
  
  // Split text to fit page
  doc.setFontSize(11);
  doc.setTextColor(30);
  const lines = doc.splitTextToSize(cleanText, maxLineWidth);
  
  doc.text(lines, margin, 55);

  doc.save(`Itinerary_${trip.destination.replace(/\s+/g, '_')}.pdf`);
};