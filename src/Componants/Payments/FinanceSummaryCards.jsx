import React from "react";
import {
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";

export default function FinanceSummaryCards() {
  const stats = [
    {
      id: 1,
      label: "إجمالي الدخل",
      amount: "45,200",
      icon: <FiTrendingUp />,
      color: "blue",
      trend: "+12%",
    },
    {
      id: 2,
      label: "تحصيل اليوم",
      amount: "3,850",
      icon: <FiDollarSign />,
      color: "green",
      trend: "8 فواتير",
    },
    {
      id: 3,
      label: "المبالغ المتبقية",
      amount: "12,400",
      icon: <FiAlertCircle />,
      color: "orange",
      trend: "14 مريض",
    },
    {
      id: 4,
      label: "فواتير مكتملة",
      amount: "124",
      icon: <FiCheckCircle />,
      color: "indigo",
      trend: "هذا العام",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-cairo text-right" dir="rtl">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="
            bg-white border border-gray-200 rounded-xl p-4
            hover:shadow-sm transition
          "
        >
          {/* Top */}
          <div className="flex items-center justify-between mb-3">

            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${getColor(stat.color)}
            `}>
              {stat.icon}
            </div>

            <span className="text-xs text-gray-400">
              {stat.trend}
            </span>

          </div>

          {/* Content */}
          <div>
            <p className="text-xs text-gray-400 mb-1">
              {stat.label}
            </p>

            <p className="text-lg font-semibold text-gray-900">
              {stat.amount} <span className="text-xs text-gray-400">ج.م</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Color helper */
function getColor(color) {
  const map = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return map[color] || "bg-gray-50 text-gray-600";
}