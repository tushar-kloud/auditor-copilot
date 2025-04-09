import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, addDays, isAfter, isBefore } from "date-fns";

const InvoiceForm = ({formData, setFormData}) => {
  const invoiceGeneration = useSelector((state) => state.invoiceGeneration);
  const { loading, error, invoiceInfo } = invoiceGeneration;

  // State to track form data
  // const [formData, setFormData] = useState(null);
  // State to track which fields are editable
  const [editableFields, setEditableFields] = useState({
    invoice_number: false,
    invoice_date: true,
    po_number: true,
    sold_to: {
      name: false,
      address: true,
      gstin: false
    },
    ship_to: {
      name: false,
      address: true
    },
    vendor: {
      name: false,
      address: false,
      gstin: false
    },
    line_items: true, // Can edit line items
    notes: true // Can edit notes
  });

  // Date constraints for invoice date
  const today = new Date();
  const maxDate = addDays(today, 7);

  useEffect(() => {
    if (invoiceInfo) {
      // Initialize form data with invoice info
      setFormData({
        ...invoiceInfo,
        invoice_date: invoiceInfo.invoice_date ? new Date(invoiceInfo.invoice_date) : today
      });
    }
  }, [invoiceInfo]);

  // Function to convert number to words
  const convertToWords = (amount) => {
    // Define arrays for number words
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 
                'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
                'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Lakh', 'Crore'];
    
    // Handle zero case
    if (amount === 0) return 'Zero Rupees Only';
    
    // Function to convert a 3-digit group
    const convertGroup = (num) => {
      let result = '';
      
      // Handle hundreds place
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      
      // Handle tens and ones place
      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      }
      
      if (num > 0) {
        result += ones[num] + ' ';
      }
      
      return result;
    };
    
    // Split amount into rupees and paise
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    
    // Handle the Indian numbering system (lakhs, crores)
    let words = '';
    let groupIndex = 0;
    
    // Process groups according to Indian numbering system
    if (rupees >= 10000000) { // Crores
      const crores = Math.floor(rupees / 10000000);
      words += convertGroup(crores) + scales[3] + ' ';
      groupIndex++;
    }
    
    const remaining = rupees % 10000000;
    
    if (remaining >= 100000) { // Lakhs
      const lakhs = Math.floor(remaining / 100000);
      words += convertGroup(lakhs) + scales[2] + ' ';
      groupIndex++;
    }
    
    const afterLakhs = remaining % 100000;
    
    if (afterLakhs >= 1000) { // Thousands
      const thousands = Math.floor(afterLakhs / 1000);
      words += convertGroup(thousands) + scales[1] + ' ';
      groupIndex++;
    }
    
    const hundreds = afterLakhs % 1000;
    
    if (hundreds > 0) {
      words += convertGroup(hundreds);
    }
    
    // Add 'Rupees' suffix
    words += 'Rupees';
    
    // Add paise if any
    if (paise > 0) {
      words += ' and ' + convertGroup(paise) + 'Paise';
    }
    
    return words + ' Only';
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value
      }
    });
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...formData.line_items];
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      [field]: field === 'unit_rate' || field === 'quantity' ? parseFloat(value) : value
    };

    // Recalculate amount for the line item
    if (field === 'unit_rate' || field === 'quantity') {
      updatedLineItems[index].amount = 
        updatedLineItems[index].quantity * updatedLineItems[index].unit_rate;
    }

    setFormData({
      ...formData,
      line_items: updatedLineItems
    });

    // Recalculate totals after line item change
    recalculateTotals(updatedLineItems);
  };

  const recalculateTotals = (lineItems) => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const cgst = subtotal * 0.09; // Assuming 9% CGST
    const sgst = subtotal * 0.09; // Assuming 9% SGST
    const totalAmount = subtotal + cgst + sgst;
    
    // Update amount in words based on the new total
    const amountInWords = convertToWords(totalAmount);

    setFormData(prevData => ({
      ...prevData,
      subtotal,
      taxes: {
        cgst,
        sgst
      },
      total_amount: totalAmount,
      amount_in_words: amountInWords
    }));
  };

  const handleDateSelect = (date) => {
    // Ensure date is not before today and not after maxDate
    if (isAfter(date, today) && isBefore(date, maxDate) || date.toDateString() === today.toDateString()) {
      handleInputChange('invoice_date', date);
    }
  };

  if (!formData) return null;

  return (
    <CardContent>
      {/* General Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label className="text-xs text-muted-foreground">Invoice Number</Label>
          <Input 
            value={formData.invoice_number || ""} 
            className="mt-1" 
            readOnly={!editableFields.invoice_number}
            onChange={(e) => handleInputChange('invoice_number', e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Invoice Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full mt-1 justify-start text-left font-normal ${!editableFields.invoice_date ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!editableFields.invoice_date}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.invoice_date ? format(formData.invoice_date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.invoice_date}
                onSelect={handleDateSelect}
                disabled={(date) => isBefore(date, today) || isAfter(date, maxDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">PO Number</Label>
          <Input 
            value={formData.po_number || ""} 
            className="mt-1" 
            readOnly={!editableFields.po_number}
            onChange={(e) => handleInputChange('po_number', e.target.value)}
          />
        </div>
      </div>

      {/* Sold To and Ship To */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Sold To */}
        <div>
          <Label className="text-xs text-muted-foreground">Sold To</Label>
          <div className="mt-1 space-y-1">
            <Input 
              value={formData.sold_to.name || ""} 
              readOnly={!editableFields.sold_to.name}
              onChange={(e) => handleNestedInputChange('sold_to', 'name', e.target.value)}
            />
            <Input 
              value={formData.sold_to.address || ""} 
              readOnly={!editableFields.sold_to.address}
              onChange={(e) => handleNestedInputChange('sold_to', 'address', e.target.value)}
            />
            <Input 
              value={`GSTIN: ${formData.sold_to.gstin || ""}`} 
              readOnly={!editableFields.sold_to.gstin}
              onChange={(e) => handleNestedInputChange('sold_to', 'gstin', e.target.value.replace('GSTIN: ', ''))}
            />
          </div>
        </div>
        {/* Ship To */}
        <div>
          <Label className="text-xs text-muted-foreground">Ship To</Label>
          <div className="mt-1 space-y-1">
            <Input 
              value={formData.ship_to.name || ""} 
              readOnly={!editableFields.ship_to.name}
              onChange={(e) => handleNestedInputChange('ship_to', 'name', e.target.value)}
            />
            <Input 
              value={formData.ship_to.address || ""} 
              readOnly={!editableFields.ship_to.address}
              onChange={(e) => handleNestedInputChange('ship_to', 'address', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Vendor</Label>
        <div className="mt-1 space-y-1">
          <Input 
            value={formData.vendor.name || ""} 
            readOnly={!editableFields.vendor.name}
            onChange={(e) => handleNestedInputChange('vendor', 'name', e.target.value)}
          />
          <Input 
            value={formData.vendor.address || ""} 
            readOnly={!editableFields.vendor.address}
            onChange={(e) => handleNestedInputChange('vendor', 'address', e.target.value)}
          />
          <Input 
            value={`GSTIN: ${formData.vendor.gstin || ""}`} 
            readOnly={!editableFields.vendor.gstin}
            onChange={(e) => handleNestedInputChange('vendor', 'gstin', e.target.value.replace('GSTIN: ', ''))}
          />
        </div>
      </div>

      {/* Line Items */}
      <Label className="text-xs text-muted-foreground mb-2 block">Line Items</Label>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formData.line_items.map((item, index) => (
            <TableRow key={`${index}${item.hsn_code}`}>
              <TableCell>
                <Input 
                  value={item.description} 
                  readOnly={!editableFields.line_items}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Input 
                  value={item.quantity} 
                  type="number"
                  className="text-right"
                  readOnly={!editableFields.line_items}
                  onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Input 
                  value={item.unit_rate} 
                  type="number"
                  className="text-right"
                  readOnly={!editableFields.line_items}
                  onChange={(e) => handleLineItemChange(index, 'unit_rate', e.target.value)}
                  prefix="₹"
                />
              </TableCell>
              <TableCell className="text-right">₹{item.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
            <TableCell className="text-right">₹{formData.subtotal.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">CGST</TableCell>
            <TableCell className="text-right">₹{formData.taxes.cgst.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">SGST</TableCell>
            <TableCell className="text-right">₹{formData.taxes.sgst.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">Total Tax</TableCell>
            <TableCell className="text-right">₹{(formData.taxes.cgst + formData.taxes.sgst).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
            <TableCell className="text-right font-bold">₹{formData.total_amount.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Amount in Words */}
      <div className="mt-4">
        <Label className="text-xs text-muted-foreground">Amount in Words</Label>
        <Input 
          value={formData.amount_in_words || ""} 
          className="mt-1" 
          readOnly
        />
      </div>

      {/* Notes */}
      <div className="mt-4">
        <Label className="text-xs text-muted-foreground">Notes</Label>
        <div className="mt-1 space-y-1">
          {formData.notes.map((note, index) => (
            <Input 
              key={index} 
              value={note} 
              readOnly={!editableFields.notes}
              className="text-sm"
              onChange={(e) => {
                const updatedNotes = [...formData.notes];
                updatedNotes[index] = e.target.value;
                handleInputChange('notes', updatedNotes);
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <AlertCircle className="inline-block mr-2 h-4 w-4" />
          Please verify all fields before proceeding. Editable fields have been enabled for modification.
        </p>
      </div>
    </CardContent>
  );
};

export default InvoiceForm;