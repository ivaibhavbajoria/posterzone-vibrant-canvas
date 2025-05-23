
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FileText, Printer } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  shipping_address?: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
}

interface PDFInvoiceProps {
  order: Order;
}

const PDFInvoice: React.FC<PDFInvoiceProps> = ({ order }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`order-invoice-${order.id}.pdf`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'processing':
        return 'text-blue-700 bg-blue-100';
      case 'shipped':
        return 'text-purple-700 bg-purple-100';
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-yellow-700 bg-yellow-100';
    }
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={generatePDF}
        >
          <FileText className="w-4 h-4 mr-1" />
          Save as PDF
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4 mr-1" />
          Print
        </Button>
      </div>

      <div 
        ref={invoiceRef}
        className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm print:shadow-none print:border-0"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">PosterZone</h2>
            <p className="text-gray-600">123 Poster Street, Art City</p>
            <p className="text-gray-600">contact@posterzone.com</p>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600"># {order.id.slice(0, 8)}</p>
            <p className="text-gray-600">Date: {formatDate(order.created_at)}</p>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-2 inline-block ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {order.shipping_address && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-2">Bill To:</h3>
                <p className="font-medium text-gray-800">{order.shipping_address.name}</p>
                <p className="text-gray-600">{order.shipping_address.address}</p>
                <p className="text-gray-600">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p className="text-gray-600">{order.shipping_address.country}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-2">Ship To:</h3>
                <p className="font-medium text-gray-800">{order.shipping_address.name}</p>
                <p className="text-gray-600">{order.shipping_address.address}</p>
                <p className="text-gray-600">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p className="text-gray-600">{order.shipping_address.country}</p>
              </div>
            </div>
            <hr className="my-6 border-gray-300" />
          </>
        )}

        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-2 text-left text-gray-600 font-semibold">Item</th>
              <th className="py-2 px-2 text-right text-gray-600 font-semibold">Quantity</th>
              <th className="py-2 px-2 text-right text-gray-600 font-semibold">Price</th>
              <th className="py-2 px-2 text-right text-gray-600 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-2 text-gray-800">{item.title}</td>
                <td className="py-3 px-2 text-right text-gray-800">{item.quantity}</td>
                <td className="py-3 px-2 text-right text-gray-800">${item.price.toFixed(2)}</td>
                <td className="py-3 px-2 text-right text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-800 font-medium">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-gray-800 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax:</span>
              <span className="text-gray-800 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-300 font-bold">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Thank you for your order!</p>
          <p className="mt-1 text-sm">If you have any questions, please contact our support at support@posterzone.com</p>
        </div>
      </div>
    </div>
  );
};

export default PDFInvoice;
