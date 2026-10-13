import React from "react";
import { FiPlus, FiActivity } from "react-icons/fi";

export default function AppointmentHeader({
  onAddClick,
  totalAppointments = 0,
}) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6 font-cairo text-right"
      dir="rtl"
    >
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">جدول المواعيد</h2>
        <p className="text-xs text-gray-400 mt-1">إدارة مواعيد العيادة</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Stats */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiActivity size={16} />
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">عدد المواعيد</p>
            <p className="text-sm font-semibold text-gray-800">
              {totalAppointments}
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onAddClick}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-blue-600 text-white text-sm font-semibold
            hover:bg-blue-700 transition active:scale-95
            shadow-md shadow-blue-200
          "
        >
          <FiPlus size={18} />
          حجز موعد
        </button>
      </div>
    </div>
  );
}
