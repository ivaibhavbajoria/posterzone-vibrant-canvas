
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FileText, Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/currency';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  shipping_address?: ShippingAddress;
  items: OrderItem[];
  profiles?: {
    full_name: string;
  };
}

interface PDFInvoiceProps {
  order: Order;
}

const PDFInvoice: React.FC<PDFInvoiceProps> = ({ order }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const generatePDF = async () => {
    if (!invoiceRef.current) {
      toast.error("Invoice content not found");
      return;
    }
    
    try {
      setIsGenerating(true);
      toast.info("Generating PDF...");
      
      // Create a clone for PDF generation to avoid affecting the UI
      const clonedElement = invoiceRef.current.cloneNode(true) as HTMLElement;
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = '210mm';
      clonedElement.style.backgroundColor = '#ffffff';
      document.body.appendChild(clonedElement);
      
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123 // A4 height in pixels at 96 DPI
      });
      
      document.body.removeChild(clonedElement);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      const fileName = `PosterZone-Invoice-${order.id.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!invoiceRef.current) {
      toast.error("Invoice content not found");
      return;
    }

    try {
      setIsPrinting(true);
      toast.info("Preparing print...");

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Please allow popups to enable printing");
        return;
      }

      const printContent = invoiceRef.current.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PosterZone Invoice - ${order.id.slice(0, 8)}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.4; 
                color: #333;
                background: white;
              }
              .print-container { 
                max-width: 210mm; 
                margin: 0 auto; 
                padding: 20mm;
                background: white;
              }
              @media print {
                body { margin: 0; }
                .print-container { 
                  margin: 0; 
                  padding: 15mm;
                  box-shadow: none;
                  max-width: none;
                }
                .print\\:hidden { display: none !important; }
                .no-print { display: none !important; }
              }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
              .font-bold { font-weight: bold; }
              .text-lg { font-size: 1.125rem; }
              .text-xl { font-size: 1.25rem; }
              .text-2xl { font-size: 1.5rem; }
              .mb-2 { margin-bottom: 8px; }
              .mb-4 { margin-bottom: 16px; }
              .mb-6 { margin-bottom: 24px; }
              .mt-6 { margin-top: 24px; }
              .mt-8 { margin-top: 32px; }
              .py-2 { padding-top: 8px; padding-bottom: 8px; }
              .py-3 { padding-top: 12px; padding-bottom: 12px; }
              .px-2 { padding-left: 8px; padding-right: 8px; }
              .grid { display: grid; }
              .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
              .gap-6 { gap: 24px; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .justify-end { justify-content: flex-end; }
              .items-start { align-items: flex-start; }
              .border-t { border-top: 1px solid #d1d5db; }
              .border-gray-300 { border-color: #d1d5db; }
              .text-gray-600 { color: #6b7280; }
              .text-gray-800 { color: #1f2937; }
              .bg-green-100 { background-color: #dcfce7; }
              .bg-blue-100 { background-color: #dbeafe; }
              .bg-purple-100 { background-color: #e9d5ff; }
              .bg-red-100 { background-color: #fee2e2; }
              .bg-yellow-100 { background-color: #fef3c7; }
              .text-green-800 { color: #166534; }
              .text-blue-800 { color: #1e40af; }
              .text-purple-800 { color: #6b21a8; }
              .text-red-800 { color: #991b1b; }
              .text-yellow-800 { color: #92400e; }
              .px-2.py-1 { padding: 4px 8px; }
              .rounded-full { border-radius: 9999px; }
              .text-xs { font-size: 0.75rem; }
              .inline-block { display: inline-block; }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      toast.success("Print job sent successfully!");
    } catch (error) {
      console.error("Error printing:", error);
      toast.error("Failed to print. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-800 bg-green-100';
      case 'processing':
        return 'text-blue-800 bg-blue-100';
      case 'shipped':
        return 'text-purple-800 bg-purple-100';
      case 'cancelled':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-yellow-800 bg-yellow-100';
    }
  };

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const shippingCost = 0; // Free shipping
  const taxAmount = 0; // No tax for now
  const subtotal = calculateSubtotal();

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4 print:hidden no-print">
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={generatePDF}
          disabled={isGenerating || isPrinting}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-1" />
              Save as PDF
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={handlePrint}
          disabled={isGenerating || isPrinting}
        >
          {isPrinting ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Printing...
            </>
          ) : (
            <>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </>
          )}
        </Button>
      </div>

      <div 
        ref={invoiceRef}
        className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm print:shadow-none print:border-0"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PosterZone</h2>
            <p className="text-gray-600">Your Premium Poster Destination</p>
            <p className="text-gray-600">contact@posterzone.com</p>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-600 mb-1">Invoice # {order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-gray-600 mb-2">Date: {formatDate(order.created_at)}</p>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-gray-600 font-semibold mb-2">Bill To:</h3>
            <p className="font-medium text-gray-800">{order.profiles?.full_name || order.shipping_address?.name || "Customer"}</p>
            {order.shipping_address && (
              <>
                <p className="text-gray-600">{order.shipping_address.address}</p>
                <p className="text-gray-600">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p className="text-gray-600">{order.shipping_address.country}</p>
              </>
            )}
          </div>
          <div>
            <h3 className="text-gray-600 font-semibold mb-2">Ship To:</h3>
            <p className="font-medium text-gray-800">{order.profiles?.full_name || order.shipping_address?.name || "Customer"}</p>
            {order.shipping_address && (
              <>
                <p className="text-gray-600">{order.shipping_address.address}</p>
                <p className="text-gray-600">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p className="text-gray-600">{order.shipping_address.country}</p>
              </>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <table className="min-w-full mb-6">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-2 text-left text-gray-600 font-semibold">Item</th>
              <th className="py-2 px-2 text-center text-gray-600 font-semibold">Quantity</th>
              <th className="py-2 px-2 text-right text-gray-600 font-semibold">Unit Price</th>
              <th className="py-2 px-2 text-right text-gray-600 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-2 text-gray-800">{item.title}</td>
                <td className="py-3 px-2 text-center text-gray-800">{item.quantity}</td>
                <td className="py-3 px-2 text-right text-gray-800">{formatCurrency(item.price)}</td>
                <td className="py-3 px-2 text-right text-gray-800">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-800 font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-gray-800 font-medium">{formatCurrency(shippingCost)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax (GST):</span>
              <span className="text-gray-800 font-medium">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="font-semibold">Thank you for your order!</p>
          <p className="mt-2 text-sm">
            If you have any questions about your order, please contact our support at support@posterzone.com
          </p>
          <p className="mt-1 text-xs">
            This is a computer-generated invoice. No signature required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFInvoice;
