import React from "react";
import { useLocation } from "react-router-dom";
import { LuSearch, LuBell } from "react-icons/lu";
import { HiMenuAlt3 } from "react-icons/hi";
import { useSelector } from "react-redux";
import { FiChevronDown } from "react-icons/fi";

export default function Navbar({ onMenuClick }) {
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const role =
    user?.role === "doctor" ? "طبيب"
      : user?.role === "receptionist"
        ? "موظف استقبال"
        : "مدير النظام";

        const userName =
    user?.name || "مستخدم النظام";

  const initials = userName
    ?.split(" ")
    ?.slice(0, 2)
    ?.map((name) => name.charAt(0))
    ?.join(" ");

  const pageNames = {
    "/": "لوحة التحكم",
    "/Dasboard": "لوحة التحكم",
    "/PatientsPage": "إدارة المرضى",
    "/Appointments": "جدول المواعيد",
    "/Treatments": "الخدمات والعلاجات",
    "/PaymentDashboard": "المالية والفواتير",
    "/InventoryDashboard": "إدارة المخزون",
    "/Report": "التقارير والإحصائيات",
    "/Settings": "إعدادات النظام",
  };

  const currentPage = pageNames[location.pathname] || "لوحة التحكم";

  return (
    <nav className="px-6 py-4 flex justify-between items-center font-cairo
      bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-30">

      {/* Left */}
      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-gray-100 text-gray-600 lg:hidden
          hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
        >
          <HiMenuAlt3 size={22} />
        </button>

        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {currentPage}
          </h2>
          <p className="text-xs text-gray-400 mt-1 hidden sm:block">
            مرحبًا بك👋
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100/70 border border-gray-200 rounded-xl px-3 py-2 gap-2
          focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">

          <LuSearch className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ابحث عن مريض، موعد..."
            className="bg-transparent outline-none text-sm w-52 text-right text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Notifications */}
        {/* <button className="relative p-2 rounded-xl bg-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95">
          <LuBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

        {/* User */}
        <div
          className="
        flex items-center gap-3
        bg-white border border-gray-100
        rounded-2xl px-3 py-2
        shadow-sm hover:shadow-md
        transition-all duration-300
         group
      "
        >

          {/* Avatar */}
          <div
            className="
          relative w-11 h-11 rounded-2xl
          bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400
          flex items-center justify-center
          text-white text-sm font-black
          shadow-lg shadow-blue-100
          overflow-hidden
        "
          >

            {/* Glow */}
            <div
              className="
            absolute inset-0
            bg-white/10
            opacity-0 group-hover:opacity-100
            transition-all
          "
            />

            <span className="relative z-10 tracking-wide">
              {initials}
            </span>
          </div>

          {/* User Info */}
          <div
            className="
          hidden sm:flex
          flex-col text-right
          leading-tight
        "
          >

            <span
              className="
            text-sm font-black text-gray-800
            group-hover:text-blue-600
            transition-colors
          "
            >
              {userName}
            </span>

            <span
              className="
            text-[11px] font-medium
            text-gray-400 mt-1
          "
            >
              {role}
            </span>
          </div>

          {/* Arrow */}
          <div
            className="
          hidden sm:flex
          text-gray-300
          group-hover:text-blue-500
          transition-all
          group-hover:translate-y-[1px]
        "
          >
            {/* <FiChevronDown size={16} /> */}
          </div>
        </div>

      </div>
    </nav>
  );
}