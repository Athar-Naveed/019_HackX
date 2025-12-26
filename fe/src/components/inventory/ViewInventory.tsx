"use client";

import { getInventory } from "@/handlers/inventoryHandler";
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const ViewInventory = ({
  organizationData,
  orgId,
  setOrgId,
}: {
  organizationData: any[];
  orgId: string;
  setOrgId: any;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const callFetchInventory = async () => {
      try {
        const resp = await getInventory(orgId);
        setInventory(resp.message);
      } catch (error) {
        console.error(`Error! ${error}`);
      }
    };
    callFetchInventory();
  }, [orgId]);

  const filteredInventory = inventory.filter((item: any) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  return (
    <div className="w-full">
      {/* Organization Selection */}
      <div className="space-y-4 my-5">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Choose Organization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizationData && organizationData.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Organization
              </label>
              <div className="relative">
                <select
                  name="organizationId"
                  value={orgId}
                  onChange={(e) => setOrgId(e.currentTarget.value)}
                  className="w-full rounded-lg border px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 shadow-theme-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden transition-all duration-200 appearance-none"
                >
                  {organizationData.map((org: any) => (
                    <option key={org._id} value={org._id}>
                      {org.orgName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Organization ID
              </label>
              <div className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
                {orgId}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          View Inventory
        </h1>
        <div className="flex items-center gap-2">
          {/* <button className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/30 transition-colors">
            <Filter className="h-4 w-4 mr-1.5" />
            Filter
          </button> */}
          <button className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium bg-success-50 text-success-700 hover:bg-success-100 dark:bg-success-900/20 dark:text-success-400 dark:hover:bg-success-900/30 transition-colors">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto sm:mx-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full h-11 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 py-2.5 pl-4 pr-12 text-sm text-gray-800 dark:text-white shadow-theme-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 dark:focus:border-brand-600 transition-all duration-200"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
            <Search className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-theme-sm">
        <table className="w-full min-w-[640px] text-sm text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {[
                "Product Name",
                "Product Price",
                "Quantity",
                "Total Cost",
                "Product Unit",
                "Price Unit",
              ].map((title) => (
                <th
                  key={title}
                  className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => (
                <tr
                  key={item._id}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900/50"
                  } hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.productPrice}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.productQuantity}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {item.productPrice * item.productQuantity}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.productUnit}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.priceUnit}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No inventory items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredInventory.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredInventory.length)} of{" "}
            {filteredInventory.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInventory;
