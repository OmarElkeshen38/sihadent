import React from "react";

import {
  HiOutlineClock,
  HiOutlineUser,
} from "react-icons/hi2";

import {
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function UpcomingAppointments({
  appointments = [],
  loading,
}) {

  const statusConfig = {
    pending: {
      label: "في الانتظار",
      class: "text-orange-600 bg-orange-50",
      icon: <FiAlertCircle size={12} />,
    },

    confirmed: {
      label: "مؤكد",
      class: "text-blue-600 bg-blue-50",
      icon: <HiOutlineClock size={12} />,
    },

    completed: {
      label: "مكتمل",
      class: "text-emerald-600 bg-emerald-50",
      icon: <FiCheckCircle size={12} />,
    },
  };

  return (
    <div
      className="
        bg-white rounded-2xl
        border border-gray-200
        shadow-sm overflow-hidden
      "
    >

      {/* Header */}
      <div
        className="
          p-5 border-b border-gray-100
          flex justify-between items-center
        "
      >

        <div>

          <h3 className="font-semibold text-gray-800">
            آخر المواعيد
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            {appointments.length} موعد
          </p>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        {loading ? (

          <div className="p-10 text-center">

            <div
              className="
                w-10 h-10 border-4
                border-blue-100 border-t-blue-600
                rounded-full animate-spin mx-auto
              "
            />

            <p className="text-sm text-gray-400 mt-4">
              جاري تحميل البيانات...
            </p>

          </div>

        ) : appointments.length === 0 ? (

          <div className="p-14 text-center">

            <p className="text-sm text-gray-400">
              لا توجد مواعيد حديثة
            </p>

          </div>

        ) : (

          <table className="w-full text-right">

            <thead>

              <tr className="bg-gray-50">

                <th className="px-6 py-3 text-xs text-gray-400">
                  المريض
                </th>

                <th className="px-6 py-3 text-xs text-gray-400">
                  الوقت
                </th>

                <th className="px-6 py-3 text-xs text-gray-400">
                  الحالة
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {appointments.map((apt, index) => {

                const config =
                  statusConfig[apt.status] ||
                  statusConfig.pending;

                return (
                  <tr
                    key={index}
                    className="
                      hover:bg-blue-50/40
                      transition-all
                    "
                  >

                    {/* Patient */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-9 h-9 rounded-xl
                            bg-blue-50 text-blue-600
                            flex items-center justify-center
                          "
                        >
                          <HiOutlineUser size={18} />
                        </div>

                        <span
                          className="
                            text-sm font-semibold
                            text-gray-800
                          "
                        >
                          {apt.patient.name || "غير معروف"}
                        </span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="px-6 py-4">

                      <div
                        className="
                          flex items-center gap-2
                          text-gray-500 text-xs
                        "
                      >
                        <HiOutlineClock className="text-blue-400" />

                        {apt.startTime || "--:--"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`
                          inline-flex items-center gap-1
                          px-3 py-1 rounded-full
                          text-[11px] font-semibold
                          ${config.class}
                        `}
                      >

                        {config.icon}

                        {config.label}

                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}