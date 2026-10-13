import React, { useRef } from "react";
import {
  FiChevronRight,
  FiChevronLeft,
  FiCalendar,
} from "react-icons/fi";

export default function CalendarControls({
  currentDate,
  viewType,
  setViewType,
  onPrev,
  onNext,
  onGoToday,
  onDateChange,
}) {
  const dateInputRef = useRef(null);

  const dateString = currentDate.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const openPicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.() || dateInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm font-cairo" dir="rtl">

      {/* Navigation */}
      <div className="flex items-center gap-3">

        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">

          <button
            onClick={onNext}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-white transition"
          >
            <FiChevronRight size={18} />
          </button>

          <button
            onClick={onPrev}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-white transition"
          >
            <FiChevronLeft size={18} />
          </button>

        </div>

        <button
          onClick={onGoToday}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white
          hover:bg-blue-700 transition active:scale-95 shadow-sm"
        >
          اليوم
        </button>
      </div>

      {/* Date Picker */}
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 
        cursor-pointer hover:border-blue-300 focus:ring-2 focus:ring-blue-100 transition outline-none"
      >
        <FiCalendar className="text-blue-500" size={16} />
        <span className="text-sm font-medium text-gray-700">
          {dateString}
        </span>

        <input
          ref={dateInputRef}
          type="date"
          className="absolute opacity-0 pointer-events-none"
          onChange={(e) => e.target.value && onDateChange(e.target.value)}
        />
      </div>

      {/* View Switch */}
      <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200 relative">

        <Tab
          active={viewType === "day"}
          onClick={() => setViewType("day")}
        >
          يوم
        </Tab>

        <Tab
          active={viewType === "week"}
          onClick={() => setViewType("week")}
        >
          أسبوع
        </Tab>

      </div>
    </div>
  );
}

/* Tab */
function Tab({ active, children, ...props }) {
  return (
    <button
      {...props}
      className={`
        relative px-4 py-1.5 text-sm rounded-lg transition
        ${active
          ? "bg-white text-blue-600 shadow-sm"
          : "text-gray-400 hover:text-gray-600"}
      `}
    >
      {children}
    </button>
  );
}