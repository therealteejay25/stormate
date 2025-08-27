import { Bell } from "lucide-react";
import PageHeader from "../components/page-header";
import TotalStats from "./components/totalStats";
import ProductsCard from "./components/productCard";
import RevenueChart from "./components/revenueChart";
import React from "react";

const Page = () => {
  let time = "";
  const today = new Date();
  const currentHour = today.getHours();

  const currentTime = () => {
    if (currentHour < 12) {
      time = "Morning";
    } else if (currentHour < 18) {
      time = "Afternoon";
    } else {
      time = "Evening";
    }
  };

  currentTime();

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader text={`Good ${time}, Tayo !`} />
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
      </div>

      {/* Top Stats */}
      <TotalStats />

      {/* Products + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductsCard />
        <RevenueChart />
      </div>
    </div>
  );
};

export default Page;
