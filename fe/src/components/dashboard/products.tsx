"use client";

import { getInvento } from "@/handlers/inventoryHandler";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface InventoryItem {
  _id: string;
  productImage: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productUnit: string;
  priceUnit: string;
  createdAt: string;
}

interface OrderProduct {
  productName: string;
  productPrice: number;
  priceUnit: string;
  productQuantity: number;
  productUnit: string;
}

interface OrderItem {
  _id: string;
  orderStatus: string;
  products: OrderProduct[];
  createdAt: string;
}

const Products = () => {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    const callFetchInventory = async () => {
      try {
        const resp = await getInvento();
        console.log("resp", resp.data);
        setInventories(resp.data.inventories || []);
        setOrders(resp.data.orders || []);
      } catch (error) {
        console.error(`Error! ${error}`);
      }
    };
    callFetchInventory();
  }, []);

  const formatCurrency = (amount: number, currency = "PKR") =>
    `${currency} ${amount.toFixed(2)}`;

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 bg-gray-900">
      {/* Inventories Section */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
        Inventories
      </h1>
      <div className="grid col-span-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 w-full">
        {inventories.map((item) => (
          <div
            key={item._id}
            className={`${
              item.productQuantity <= 0 ? "bg-red-800/50" : "bg-gray-800"
            } rounded-lg p-4 flex flex-col items-center space-y-2 w-full`}
          >
            {item.productImage ? (
              <img
                src={item.productImage}
                alt={item.productName}
                className="h-20 w-20 object-cover rounded"
              />
            ) : (
              <div className="h-20 w-20 bg-gray-700 flex items-center justify-center rounded text-white font-bold text-xl">
                {item.productName.charAt(0)}
              </div>
            )}
            <h3 className="text-white font-semibold text-center">
              {item.productName}
            </h3>
            <p className="text-gray-400 text-sm text-center">
              Price: {formatCurrency(item.productPrice, item.priceUnit)}
            </p>
            <p className="text-gray-400 text-sm text-center">
              Qty: {item.productQuantity} {item.productUnit}
            </p>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Orders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col space-y-2 w-full"
          >
            <div className="flex justify-between mb-1">
              <span className="text-white font-semibold text-sm truncate">
                Order ID: {order._id}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  order.orderStatus === "Pending"
                    ? "bg-yellow-500 text-black"
                    : "bg-green-500 text-white"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              Created: {format(new Date(order.createdAt), "PPP")}
            </p>
            <div className="flex flex-col space-y-1 mt-1">
              {order.products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex justify-between bg-gray-700 rounded px-2 py-1 text-xs"
                >
                  <span className="text-white font-medium truncate">
                    {product.productName}
                  </span>
                  <span className="text-gray-300">
                    {product.productQuantity} {product.productUnit}
                  </span>
                  <span className="text-gray-300">
                    {formatCurrency(product.productPrice, product.priceUnit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
