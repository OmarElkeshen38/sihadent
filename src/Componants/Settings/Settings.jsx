import React, { useState } from "react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
} from "react-icons/hi2";

import PricingSettings from "./PricingSettings";
import UserManagement from "./UserManagement";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("pricing");

  const tabs = [
    {
      id: "pricing",
      label: "أسعار الخدمات",
      icon: <HiOutlineCurrencyDollar size={18} />,
    },
    {
      id: "users",
      label: "إدارة المستخدمين",
      icon: <HiOutlineUsers size={18} />,
    },
  ];

  return (
    <div className="space-y-6 font-cairo text-right p-6 animate-in fade-in duration-500" dir="rtl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          إعدادات النظام
        </h1>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
          System Configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100/60 p-1.5 rounded-[1.5rem] border border-gray-100/50 w-fit">

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-blue-600 shadow-md shadow-blue-100/50"
                    : "text-gray-400 hover:text-gray-600"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 min-h-[500px]">

        <div className="max-w-5xl mx-auto">

          {activeTab === "pricing" && <PricingSettings />}
          {activeTab === "users" && <UserManagement />}

        </div>

      </div>

    </div>
  );
}