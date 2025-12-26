"use client";

import { useState, useRef, useMemo } from "react";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { format } from "date-fns";
import { toPng } from "html-to-image";
import Link from "next/link";

interface Product {
  productName: string;
  productPrice: number;
  priceUnit: string;
  productQuantity: number;
  productUnit: string;
}

interface OrderDetails {
  organizationId: string;
  products: Product[];
  personName?: string;
  personNumber?: string;
  orderStatus: string;
}

const OrderTemplate = ({
  orderDetail,
  orgName,
  setPreview,
}: {
  orderDetail: OrderDetails;
  orgName: string | undefined;
  setPreview: (value: boolean) => void;
}) => {
  const [invoiceNumber] = useState(
    `INV-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [invoiceDate] = useState(new Date());
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [delivery, setDelivery] = useState<number>(0);

  const total = useMemo(() => {
    return (
      orderDetail.products.reduce(
        (sum, product) => sum + product.productPrice * product.productQuantity,
        0
      ) + delivery
    );
  }, [orderDetail.products, delivery]);

  const handleDownloadPNG = () => {
    const node = invoiceRef.current;
    if (!node) return;

    // Use dark mode background
    const bgColor =
      getComputedStyle(document.body).backgroundColor || "#111827";

    toPng(node, {
      cacheBust: true,
      backgroundColor: bgColor,
      pixelRatio: 2,
      style: { backgroundColor: bgColor },
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `invoice-${orderDetail.personName || "unknown"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Failed to generate PNG", err));
  };

  const handlePrint = () => {
    const printContents = invoiceRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = `
        <html>
          <head>
            <title>Invoice ${orderDetail.personName}</title>
            <style>
              @media print {
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  padding: 20px;
                  background-color: #111827;
                  color: #f9fafb;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  color: #f9fafb;
                }
                th, td {
                  padding: 12px;
                  text-align: left;
                  border-bottom: 1px solid #374151;
                }
                th {
                  background-color: #1f2937;
                  font-weight: 600;
                }
              }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  const formatCurrency = (amount: number, currency = "PKR") =>
    `${currency} ${amount.toFixed(2)}`;

  return (
    <div className="bg-gray-900 dark:bg-gray-900 min-h-screen my-5">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-10 shadow-theme-sm">
        <div className="max-w-5xl mx-auto grid md:flex justify-between items-center">
          <button
            onClick={() => setPreview(false)}
            className="flex items-center text-gray-300 hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Editor</span>
          </button>
          <div className="flex space-x-2 my-5">
            <button
              onClick={handlePrint}
              className="flex items-center px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              <span className="text-sm">Print</span>
            </button>
            <button
              onClick={handleDownloadPNG}
              className="flex items-center px-3 py-1.5 rounded-lg bg-brand-900/20 text-brand-400 hover:bg-brand-900/30 transition-colors"
            >
              <Download className="h-4 w-4 mr-1.5" />
              <span className="text-sm">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="w-full my-8">
        <div className="overflow-x-auto md:overflow-visible">
          <div className="min-w-[794px] mx-auto p-6 md:p-8 bg-gray-900 shadow-theme-md border border-gray-800 rounded-lg">
            <div ref={invoiceRef} className="p-2 sm:p-8">
              {/* Invoice Header */}
              <div className="flex flex-row justify-between items-start mb-10">
                <div className="mb-6">
                  <div className="h-12 w-12 rounded-lg bg-brand-500 text-white flex items-center justify-center text-xl font-bold mb-3">
                    {orgName ? orgName.charAt(0) : "O"}
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    {orgName || "Organization Name"}
                  </h1>
                  <p className="text-gray-400 mt-1">123 Business Street</p>
                  <p className="text-gray-400">City, State 12345</p>
                  <p className="text-gray-400">contact@organization.com</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 w-auto text-white">
                  <h2 className="text-xl font-bold mb-4">Invoice</h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="text-gray-400">Invoice Number:</div>
                    <div className="font-medium">{invoiceNumber}</div>
                    <div className="text-gray-400">Order Status:</div>
                    <div className="font-medium border border-green-500 text-green-500 px-4 py-2 rounded-xl w-fit">
                      {orderDetail.orderStatus}
                    </div>
                    <div className="text-gray-400">Date Issued:</div>
                    <div className="font-medium">
                      {format(invoiceDate, "MMMM dd, yyyy")}
                    </div>
                    <div className="text-gray-400">Due Date:</div>
                    <div className="font-medium">
                      {format(
                        new Date(
                          invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000
                        ),
                        "MMMM dd, yyyy"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill To Section */}
              <div className="mb-8">
                <h3 className="text-sm font-medium uppercase text-gray-400 mb-3">
                  Bill To
                </h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-white">
                    Customer Name: {orderDetail.personName}
                  </p>
                  <p className="text-gray-400">
                    Customer no.: {orderDetail.personNumber}
                  </p>
                </div>
              </div>

              {/* Products Table */}
              <div className="mb-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 text-left">
                      <th className="px-4 py-3 text-sm font-semibold text-gray-300 rounded-tl-lg">
                        Item
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-300">
                        Unit
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-300">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-300">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-300 text-right rounded-tr-lg">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {orderDetail.products.map((product, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-4 text-white font-medium">
                          {product.productName}
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {product.productUnit}
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {product.productQuantity}
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {formatCurrency(
                            product.productPrice,
                            product.priceUnit
                          )}
                        </td>
                        <td className="px-4 py-4 text-white font-medium text-right">
                          {formatCurrency(
                            product.productPrice * product.productQuantity,
                            product.priceUnit
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex flex-row justify-between mb-8">
                <div className="md:w-1/2 mb-6">
                  <h3 className="text-sm font-medium uppercase text-gray-400 mb-3">
                    Payment Information
                  </h3>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="font-medium text-white">Bank Transfer</p>
                    <p className="text-gray-400 mt-1">
                      Account Name: {orgName || "Organization"}
                    </p>
                    <p className="text-gray-400">
                      Account Number: XXXX-XXXX-XXXX-1234
                    </p>
                    <p className="text-gray-400">Routing: 123456789</p>
                  </div>
                </div>

                <div className="md:w-1/3">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(
                          orderDetail.products.reduce(
                            (sum, product) =>
                              sum +
                              product.productPrice * product.productQuantity,
                            0
                          ),
                          orderDetail.products[0]?.priceUnit || "PKR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Delivery/Tax (5%):</span>
                      <span className="text-white font-medium">
                        {formatCurrency(
                          delivery,
                          orderDetail.products[0]?.priceUnit || "PKR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 mt-2">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-brand-400 font-bold">
                        {formatCurrency(
                          total,
                          orderDetail.products[0]?.priceUnit || "PKR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="note text-center text-white">
                <p>
                  Invoice generated using{" "}
                  <b className="text-brand-400">Hisaab Kitaab App</b>. For info
                  visit:{" "}
                  <span className="text-brand-400">
                    https://apna-hisaab.vercel.app
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="max-w-5xl mx-auto mb-10 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-brand-900/20 text-brand-400 hover:bg-brand-900/30 transition-colors"
          >
            <Printer className="h-4 w-4 mr-2" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTemplate;
