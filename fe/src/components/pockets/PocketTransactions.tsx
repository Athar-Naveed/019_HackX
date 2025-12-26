"use client";
import { getPocketTransactions } from "@/handlers/transactions/transactionHandler";
import { IPocket } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const PocketTransactionsTable = ({ pocketId }: { pocketId: string }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pocket, setPocket] = useState<IPocket | undefined>(undefined);

  useEffect(() => {
    const fetchPocketTransactions = async () => {
      try {
        const response = await getPocketTransactions(pocketId);
        // document.title = response.pocket?.name || "Transactions";

        if (response.status === 200) {
          setTransactions(response.data.reverse());
          setPocket(response.pocket);
        } else {
          console.error("Failed to fetch transactions:", response.message);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPocketTransactions();
  }, [pocketId]);

  return (
    <div className="container my-5">
      <div className="grid sm:flex sm:justify-between">
        <div className="heading text-white font-bold text-xl">
          <h1>
            {pocket?.pocketName} -- Rs. {pocket?.pocketBalance}/-
          </h1>
        </div>
        <Link
          href={"/admin/pockets"}
          className="text-xl font-semibold mb-4 text-black dark:text-white"
        >
          Create new transaction
        </Link>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-white">No transactions found</p>
      ) : (
        <div className="overflow-x-auto my-10">
          <table className="min-w-full border border-gray-100 rounded-md">
            <thead className="bg-gray-700 dark:bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">To</th>
                <th className="px-4 py-2 border">From</th>
                <th className="px-4 py-2 border">Purpose</th>
                <th className="px-4 py-2 border">Transaction Amount</th>
                <th className="px-4 py-2 border">New Balance</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Creation Date</th>
                <th className="px-4 py-2 border">Updation Date</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr className="text-white" key={index}>
                  <td className="px-4 py-2 border">{txn.to}</td>
                  <td className="px-4 py-2 border">{txn.from}</td>
                  <td className="px-4 py-2 border">{txn.purpose}</td>
                  <td className="px-4 py-2 border">
                    {txn.txnAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {txn.newBalance.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{txn.expenseType}</td>
                  <td className="px-4 py-2 border">{txn.category}</td>
                  <td className="px-4 py-2 border">
                    {new Date(txn.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true, // shows AM/PM
                    })}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(txn.updatedAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td className="px-4 py-2 border text-white">{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PocketTransactionsTable;
