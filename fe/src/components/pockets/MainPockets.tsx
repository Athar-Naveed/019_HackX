"use client"
import {motion} from "framer-motion"
import { useEffect, useState } from "react";
import MainHeader from "../ui/header/MainHeader";
import adminStore from "@/store/adminStore";
import { getOrgHandler } from "@/handlers/orgHandler";
import { ChevronLeft } from "lucide-react";
import { IPocket } from "@/types";


const MainPocketPanel = () => {
    const [pocketPanel,setPocketPanel] = useState<boolean>(true);
    const {unit,setUnit} = adminStore();
      const [editing, setEditing] = useState(false);
      const [tempUnit, setTempUnit] = useState(unit);
      const [pocketData, setPocketData] = useState<IPocket[]>([]);
        const [pocketId,setPocketId] = useState<string>("");
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
              setPocketData(response.data);
              if (response.data.length > 0) {
                setPocketId(response.data[0]._id);
              }
            } catch (error) {
              console.error("Error fetching organization ID:", error);
            }
          };
      
          fetchOrganizationId();
        },[])
    return (
        <>
        <div>
            <MainHeader state={pocketPanel} page={"Pockets"} />
            
                  {/* Form container with animation */}
      <div className="">
      {!editing ? (
        <h1
          className="text-slate-500 flex"
        >
          By default, the price unit is set to &nbsp;<span onClick={() => setEditing(true)} className="cursor-pointer hover:underline font-semibold">{unit}</span>. <ChevronLeft />Change it 
          by clicking here.
        </h1>
      ) : (
        <input
          type="text"
          value={tempUnit}
          onChange={(e) => setTempUnit(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="bpocket bpocket-zinc-300 dark:bpocket-zinc-700 rounded-sm px-2 py-1 bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100"
        />
      )}
        <motion.div
          key={pocketPanel ? "add" : "view"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          
        </motion.div>
      </div>
        </div>
        </>
    )
}

export default MainPocketPanel;