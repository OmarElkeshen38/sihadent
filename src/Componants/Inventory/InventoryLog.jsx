import React from "react";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiClock,
  FiUser,
  FiPackage,
} from "react-icons/fi";

export default function InventoryLog() {
  const logs = [
    { id: 1, user: "م/ سارة علي", action: "withdrawal", item: "بنج أسباني", amount: "5 أمبول", time: "منذ 10 دقائق" },
    { id: 2, user: "د/ أحمد محمد", action: "addition", item: "قفازات لاتكس", amount: "10 علب", time: "منذ ساعتين" },
    { id: 3, user: "م/ سارة علي", action: "withdrawal", item: "حشو مؤقت", amount: "1 عبوة", time: "اليوم 11:00 ص" },
  ];

  return (
    <div className="p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2">
        <FiClock className="text-blue-600" size={16} />
        <h4 className="text-sm font-semibold text-gray-800">
          سجل العمليات
        </h4>
      </div>

      {/* List */}
      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="
              flex items-center justify-between
              p-3 rounded-xl border border-gray-200
              hover:bg-gray-50 transition
            "
          >

            {/* Left */}
            <div className="flex items-center gap-3">

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center
                ${log.action === "addition"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"}`}
              >
                {log.action === "addition"
                  ? <FiArrowUpRight size={16} />
                  : <FiArrowDownLeft size={16} />}
              </div>

              {/* Info */}
              <div className="space-y-1">

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    {log.item}
                  </span>

                  <Status type={log.action} />
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiUser size={12} /> {log.user}
                  </span>

                  <span className="flex items-center gap-1">
                    <FiPackage size={12} /> {log.amount}
                  </span>
                </div>

              </div>
            </div>

            {/* Time */}
            <span className="text-xs text-gray-400">
              {log.time}
            </span>

          </div>
        ))}
      </div>

      {/* Footer */}
      <button className="text-sm text-blue-600 hover:text-blue-700 transition">
        عرض الكل
      </button>

    </div>
  );
}

/* Status */
function Status({ type }) {
  return (
    <span
      className={`
        px-2 py-0.5 text-xs rounded-md
        ${type === "addition"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-amber-50 text-amber-600"}
      `}
    >
      {type === "addition" ? "إضافة" : "سحب"}
    </span>
  );
}