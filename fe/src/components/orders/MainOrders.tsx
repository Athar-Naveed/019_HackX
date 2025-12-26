"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MainHeader from "../ui/header/MainHeader";
import TabButton from "../ui/button/TabButton";

import adminStore from "@/store/adminStore";
import { getOrgHandler } from "@/handlers/orgHandler";
import CreateOrder from "./CreateOrder";
import { Box, ChevronLeft } from "lucide-react";
import ViewOrders from "./ViewOrders";
import { Organization } from "@/types";

const MainOrderPanel = () => {
  const [orderPanel, setOrderPanel] = useState<boolean>(true);
  const { unit, setUnit } = adminStore();
  const [editing, setEditing] = useState(false);
  const [tempUnit, setTempUnit] = useState(unit);
  const [organizationData, setOrganizationData] = useState<Organization[]>([]);
  const [orgId, setOrgId] = useState<string>("");
  const handleBlur = () => {
    setUnit(tempUnit.trim() || unit); // fallback to old value if empty
    setEditing(false);
  };
  useEffect(() => {
    const fetchOrganizationId = async () => {
      try {
        const response = await getOrgHandler();
        if (!response) {
          throw new Error("Failed to fetch organization ID");
        }
        setOrganizationData(response.data);
        if (response.data.length > 0) {
          setOrgId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching organization ID:", error);
      }
    };

    fetchOrganizationId();
  }, []);
  return (
    <>
      <div>
        <MainHeader state={orderPanel} page={"Orders"} />
        <div className="flex mb-8 bg-gray-500 dark:bg-gray-dark text-gray-dark rounded-lg p-1 border border-gray-200">
          <TabButton
            active={orderPanel}
            onClick={() => setOrderPanel(true)}
            icon={<Box className="w-4 h-4 mr-2" />}
            text="Create a new order"
          />
          <TabButton
            active={!orderPanel}
            onClick={() => setOrderPanel(false)}
            icon={<Box className="w-4 h-4 mr-2" />}
            text="View orders"
          />
        </div>
        {/* Form container with animation */}
        <div className="">
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
          <motion.div
            key={orderPanel ? "add" : "view"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {orderPanel ? (
              <CreateOrder
                organizationData={organizationData}
                orgId={orgId}
                setOrgId={setOrgId}
                unit={unit}
              />
            ) : (
              <ViewOrders
                organizationData={organizationData}
                orgId={orgId}
                setOrgId={setOrgId}
              />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MainOrderPanel;
