
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';

// PDF generation would typically use a library like jspdf or react-to-pdf

export const OrderInvoice = ({ order }) => {
  // This is just a mockup of an invoice, not a real PDF generator
  // In a real app, you'd use a library like jspdf or react-to-pdf
  
  // Mock function to simulate PDF download
  const handleDownloadInvoice = () => {
    alert('PDF download functionality would be implemented here');
    // In a real app, this would generate and download a PDF
  };

  // Mock function to simulate printing
  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-gray-500" />
          <h2 className="text-xl font-semibold">Order Invoice</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
      
      <div className="border-t border-b border-gray-200 py-4 mb-4 print:border">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">PosterZone</h2>
            <p className="text-gray-500">Invoice #{order.id}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Date Issued</p>
            <p>{format(new Date(order.date), 'dd MMM yyyy')}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="font-semibold mb-2">Bill To:</p>
          <p>{order.customer}</p>
          <p>{order.email}</p>
          <p>123 Customer St.</p>
          <p>Customer City, Country</p>
        </div>
        <div>
          <p className="font-semibold mb-2">Order Details:</p>
          <div className="flex justify-between">
            <p>Order Number:</p>
            <p>{order.id}</p>
          </div>
          <div className="flex justify-between">
            <p>Order Date:</p>
            <p>{format(new Date(order.date), 'dd MMM yyyy')}</p>
          </div>
          <div className="flex justify-between">
            <p>Status:</p>
            <p className="capitalize">{order.status}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Mock order items */}
            <tr>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded object-cover" 
                         src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52a"
                         alt="Poster" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Abstract Geometry Lines
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-center text-sm text-gray-900">
                2
              </td>
              <td className="px-4 py-4 text-right text-sm text-gray-900">
                $34.99
              </td>
              <td className="px-4 py-4 text-right text-sm text-gray-900">
                $69.98
              </td>
            </tr>
            <tr>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded object-cover" 
                         src="https://images.unsplash.com/photo-1493382051629-7eb03ec93ea2"
                         alt="Poster" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Minimalist Nature
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-center text-sm text-gray-900">
                1
              </td>
              <td className="px-4 py-4 text-right text-sm text-gray-900">
                $29.99
              </td>
              <td className="px-4 py-4 text-right text-sm text-gray-900">
                $29.99
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end mb-6">
        <div className="w-80">
          <div className="flex justify-between py-2">
            <p className="font-medium">Subtotal</p>
            <p className="font-medium">${(order.total - 5).toFixed(2)}</p>
          </div>
          <div className="flex justify-between py-2">
            <p>Shipping</p>
            <p>$5.00</p>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
            <p className="font-semibold text-lg">Total</p>
            <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 text-center">
        <p className="text-gray-500">Thank you for shopping with PosterZone!</p>
        <p className="text-gray-500 text-sm mt-2">If you have any questions about your order, please contact support@posterzone.com</p>
      </div>
    </div>
  );
};

export default OrderInvoice;
