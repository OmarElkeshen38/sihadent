import React, { useMemo } from "react";
import { FiClock, FiUser, FiInfo, FiX } from "react-icons/fi";

/* Card */
const AppointmentCard = ({ appointment, onDelete }) => {
  return (
    <div className="
      absolute inset-2 bg-white border border-gray-200
      p-3 rounded-xl shadow-sm
      hover:shadow-md hover:-translate-y-[2px]
      transition group
      border-r-2 border-blue-500
    ">

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(appointment.id);
        }}
        className="absolute left-2 top-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
      >
        <FiX size={14} />
      </button>

      {/* Top */}
      <div className="flex justify-between items-center mb-2">

        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <FiUser size={14} />
        </div>

        <span className={`
          text-[10px] px-2 py-0.5 rounded-md font-medium
          ${appointment.status === "confirmed"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-amber-50 text-amber-600"}
        `}>
          {appointment.status === "confirmed" ? "مؤكد" : "انتظار"}
        </span>

      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-gray-800 truncate">
        {appointment.patientName}
      </p>

      {/* Type */}
      <div className="flex items-center gap-1 mt-1 text-gray-400">
        <FiInfo size={12} />
        <span className="text-xs truncate">
          {appointment.treatmentType}
        </span>
      </div>
    </div>
  );
};

export default function WeeklyCalendarGrid({
  appointmentsData = [],
  onDelete,
}) {
  const days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
  const hours = Array.from({ length: 13 }, (_, i) => i + 9);

  /* 🔥 Performance Fix */
  const appointmentsMap = useMemo(() => {
    const map = {};
    appointmentsData.forEach((app) => {
      map[`${app.dayIndex}-${app.hour}`] = app;
    });
    return map;
  }, [appointmentsData]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-cairo flex flex-col">

      {/* Header */}
      <div className="grid grid-cols-8 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">

        <div className="p-4 border-l border-gray-100 flex items-center justify-center">
          <FiClock className="text-gray-400" size={18} />
        </div>

        {days.map((day) => (
          <div key={day} className="p-3 text-center border-l border-gray-100">
            <p className="text-xs text-gray-400">{day}</p>
            <p className="text-sm font-semibold text-gray-800">14</p>
          </div>
        ))}

      </div>

      {/* Body */}
      <div className="max-h-[600px] overflow-y-auto">

        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b border-gray-100 min-h-[100px]"
          >

            {/* Hour */}
            <div className="p-3 border-l border-gray-100 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                {hour > 12 ? `${hour - 12}:00` : `${hour}:00`}
              </p>
              <span className="text-[10px] text-gray-400">
                {hour >= 12 ? "PM" : "AM"}
              </span>
            </div>

            {/* Slots */}
            {days.map((_, dayIndex) => {
              const appointment = appointmentsMap[`${dayIndex}-${hour}`];

              return (
                <div
                  key={`${dayIndex}-${hour}`}
                  className="relative border-l border-gray-100 hover:bg-blue-50/20 transition"
                >
                  {appointment && (
                    <AppointmentCard
                      appointment={appointment}
                      onDelete={onDelete}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}

      </div>
    </div>
  );
}