// hooks/useGenerateInvoicePDF.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

const useGenerateInvoicePDF = (invoiceData) => {
  const generatePDF = () => {
    // Create the document with proper configuration
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 15, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: ${invoiceData.invoice_number}`, 14, 30);
    doc.text(`Invoice Date: ${format(new Date(invoiceData.invoice_date), 'dd/MM/yyyy')}`, 14, 35);
    doc.text(`PO Number: ${invoiceData.po_number || 'N/A'}`, 14, 40);
    
    const vendorInfoX = 196;
    doc.text(`Vendor:`, vendorInfoX, 30, { align: "right" });
    doc.text(`${invoiceData.vendor.name}`, vendorInfoX, 35, { align: "right" });
    doc.text(`${invoiceData.vendor.address}`, vendorInfoX, 40, { align: "right" });
    doc.text(`GSTIN: ${invoiceData.vendor.gstin}`, vendorInfoX, 45, { align: "right" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Sold To:", 14, 55);
    doc.text("Ship To:", 105, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${invoiceData.sold_to.name}`, 14, 60);
    doc.text(`${invoiceData.sold_to.address}`, 14, 65);
    doc.text(`GSTIN: ${invoiceData.sold_to.gstin}`, 14, 70);
    
    doc.text(`${invoiceData.ship_to.name}`, 105, 60);
    doc.text(`${invoiceData.ship_to.address}`, 105, 65);
    
    const tableColumns = [
      { header: "Description", dataKey: "description" },
      { header: "Qty", dataKey: "quantity" },
      { header: "Unit Price (₹)", dataKey: "unit_rate" },
      { header: "Amount (₹)", dataKey: "amount" }
    ];
    
    const tableRows = invoiceData.line_items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unit_rate: item.unit_rate.toFixed(2),
      amount: item.amount.toFixed(2)
    }));
    
    // Use autoTable as a standalone function with doc as first parameter
    autoTable(doc, {
      head: [tableColumns.map(col => col.header)],
      body: tableRows.map(row => tableColumns.map(col => row[col.dataKey])),
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
      foot: [
        [{ content: 'Subtotal', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `₹${invoiceData.subtotal.toFixed(2)}`],
        [{ content: 'CGST', colSpan: 3, styles: { halign: 'right' } }, `₹${invoiceData.taxes.cgst.toFixed(2)}`],
        [{ content: 'SGST', colSpan: 3, styles: { halign: 'right' } }, `₹${invoiceData.taxes.sgst.toFixed(2)}`],
        [{ content: 'Total Tax', colSpan: 3, styles: { halign: 'right' } }, `₹${(invoiceData.taxes.cgst + invoiceData.taxes.sgst).toFixed(2)}`],
        [{ content: 'Total Amount', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `₹${invoiceData.total_amount.toFixed(2)}`]
      ]
    });
    
    // Access the final Y position from the last table
    const finalY = doc.lastAutoTable.finalY || 150;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Amount in Words:", 14, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.amount_in_words, 50, finalY + 10);
    
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, finalY + 20);
    doc.setFont("helvetica", "normal");
    let noteY = finalY + 25;
    invoiceData.notes.forEach(note => {
      doc.text(`• ${note}`, 14, noteY);
      noteY += 5;
    });
    
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text("Thank you for your business!", 105, pageHeight - 20, { align: "center" });
    
    doc.line(14, pageHeight - 40, 60, pageHeight - 40);
    doc.line(150, pageHeight - 40, 196, pageHeight - 40);
    doc.text("Authorized Signature", 37, pageHeight - 35, { align: "center" });
    doc.text("Customer Signature", 173, pageHeight - 35, { align: "center" });
    
    doc.save(`Invoice_${invoiceData.invoice_number}.pdf`);
  };

  return generatePDF;
};

export default useGenerateInvoicePDF;