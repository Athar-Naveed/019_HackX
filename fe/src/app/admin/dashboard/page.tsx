"use client";

import { useEffect } from "react";
import adminStore from "@/store/adminStore";
import Metrics from "@/components/dashboard/metrics";
import Products from "@/components/dashboard/products";
import AiSuggest from "@/components/dashboard/aiSuggest";

const UADashboard = () => {
  const { user } = adminStore();

  useEffect(() => {
    document.title = user?.fullName + " | Hisaab Kitaab Admin Panel";
  });
  return (
    <>
      <div className="grid grid-cols-4 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <Metrics />
          {/* <MonthlySalesChart /> */}
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>
*/}
        {/* <div className="col-span-12 xl:col-span-5">
          <AiSuggest />
        </div> */}

        <div className="col-span-12 xl:col-span-7">
          <Products />
        </div>
      </div>
    </>
  );
};

export default UADashboard;
