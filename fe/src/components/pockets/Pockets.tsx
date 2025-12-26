"use client";
import { useEffect, useState, useTransition } from "react";
import NewPocket from "./NewPocket";
import { getPockets } from "@/handlers/pockets/pocketHandler";
import toast from "react-hot-toast";
import Link from "next/link";
import AddTransaction from "./AddTransaction";

const CreatingPockets = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [pockets, setPockets] = useState<any[]>([]);

  useEffect(() => {
    const fetchPockets = async () => {
      startTransition(async () => {
        try {
          const resp = await getPockets();

          if (resp.status === 200) {
            setPockets(resp.pockets); // should be pockets
          } else {
            toast.error(resp.message || "Failed to fetch pockets");
          }
        } catch (error) {
          console.error("Error fetching pockets:", error);
          toast.error("Something went wrong while fetching pockets");
        }
      });
    };
    fetchPockets();
  }, []);

  return (
    <section className="my-10">
      <div className="grid overflow-x-auto md:grid-cols-2 lg:grid-cols-3">
        {/* ✅ map through fetched pockets */}
        {pockets.length > 0 ? (
          pockets.map((pocket) => (
            <Link
              href={`${`/admin/pockets/${pocket._id}`}`}
              key={pocket._id}
              className="pocket text-black bg-gray-800/60 dark:text-white border border-gray-800 rounded-md m-3"
            >
              <div className="flex justify-between items-center p-5">
                <div className="pocket-title text-2xl">
                  <h1>{pocket.pocketName}</h1>
                </div>
                <div className="expense-type text-gray-400">
                  <p>{pocket.pocketType}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center py-6">
            No pockets yet
          </p>
        )}

        {/* create new pocket button */}
        <NewPocket isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
      <AddTransaction pockets={pockets} />
    </section>
  );
};

export default CreatingPockets;
