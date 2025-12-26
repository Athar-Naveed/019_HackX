"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box, ChevronLeft } from "lucide-react";
import ViewInventory from "./ViewInventory";
import AddInventory from "./AddInventory";
import adminStore from "@/store/adminStore";
import { getOrgHandler } from "@/handlers/orgHandler";
import MainHeader from "../ui/header/MainHeader";
import TabButton from "../ui/button/TabButton";

const MainInventory = () => {
  const [createInventory, setInventory] = useState<boolean>(true);
  const { unit, setUnit } = adminStore();
  const [editing, setEditing] = useState(false);
  const [tempUnit, setTempUnit] = useState(unit);
  const [organizationData, setOrganizationData] = useState<any[]>([]);
  const [orgId, setOrgId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const handleBlur = () => {
    setUnit(tempUnit.trim() || unit); // fallback to old value if empty
    setEditing(false);
  };

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await getOrgHandler();

        if (!response || !response.data) {
          throw new Error("Failed to fetch organization data");
        }
        setOrganizationData(response.data);
        if (response.data.length > 0) {
          setOrgId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  // Show loading state while fetching
  if (loading) return <p>Loading...</p>;

  // If no dukaan exists, prompt user to create one
  if (organizationData.length === 0) {
    return (
      <div className="w-full text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">No Dukaan Found</h2>
        <p className="text-gray-500 mb-6">
          You need to create a dukaan first to manage your inventory.
        </p>
        <button
          onClick={() => (window.location.href = "/create-dukaan")} // redirect to create dukaan page
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Dukaan
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MainHeader state={createInventory} page={"Inventory"} />

      {/* Tab navigation with more color */}
      <div className="flex mb-8 bg-gray-500 dark:bg-gray-dark text-gray-dark rounded-lg p-1 border border-gray-200">
        <TabButton
          active={createInventory}
          onClick={() => setInventory(true)}
          icon={<Box className="w-4 h-4 mr-2" />}
          text="Add Inventory"
        />
        <TabButton
          active={!createInventory}
          onClick={() => setInventory(false)}
          icon={<Box className="w-4 h-4 mr-2" />}
          text="View Inventory"
        />
      </div>

      {/* Price unit section */}
      {!editing ? (
        <h1 className="text-slate-500 flex">
          By default, the price unit is set to &nbsp;
          <span
            onClick={() => setEditing(true)}
            className="cursor-pointer hover:underline font-semibold"
          >
            {unit}
          </span>
          . <ChevronLeft />
          Change it by clicking here.
        </h1>
      ) : (
        <input
          type="text"
          value={tempUnit}
          onChange={(e) => setTempUnit(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="border border-zinc-300 dark:border-zinc-700 rounded-sm px-2 py-1 bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100"
        />
      )}

      {/* Inventory section */}
      <motion.div
        key={createInventory ? "add" : "view"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {createInventory ? (
          <AddInventory
            organizationData={organizationData}
            orgId={orgId}
            setOrgId={setOrgId}
            unit={unit}
          />
        ) : (
          <ViewInventory
            organizationData={organizationData}
            orgId={orgId}
            setOrgId={setOrgId}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MainInventory;
