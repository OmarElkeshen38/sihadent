import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaTableCellsLarge,
  FaUserGroup,
  FaCalendarDays,
  FaStethoscope,
  FaWallet,
  FaBoxOpen,
  FaChartPie,
  FaGear,
  FaRightFromBracket,
} from "react-icons/fa6";
import logo from '../../assets/logo.png';
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice/authSlice";

export default function Sidbar() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout  = () => {
    dispatch(logout());

    navigate("/login");
  };

  const menuItems = [
    { path: "dashboard", name: "لوحة التحكم", icon: <FaTableCellsLarge /> },
    { path: "daily-appointments", name: "الحجوزات اليومية", icon: <FaUserGroup /> },
    { path: "appointments", name: "المواعيد", icon: <FaCalendarDays /> },
    { path: "patients", name: "إدارة المرضى", icon: <FaUserGroup /> },
    { path: "payments", name: "الفواتير", icon: <FaWallet /> },
    { path: "inventory", name: "المخزون", icon: <FaBoxOpen /> },
    { path: "reports", name: "التقارير", icon: <FaChartPie /> },
    { path: "settings", name: "الإعدادات", icon: <FaGear /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-xl border-gray-200 overflow-hidden">

      {/* Logo */}
      <div className="px-5 py- flex items-center border-b border-gray-100">
        <div className="w-full h-20 rounded-3xl bg-gradient-to-br  shadow-s flex items-center justify-center">
          <img
            src={logo}
            alt="logo"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => (
              <div
                className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                ${isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}
              `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-600 rounded-l-full"></span>
                )}

                {/* Icon */}
                <span
                  className={`text-lg transition-all ${isActive ? "scale-110" : ""
                    }`}
                >
                  {item.icon}
                </span>

                {/* Text */}
                <span className="truncate">{item.name}</span>
              </div>
            )}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-gray-100"></div>


      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-gray-100">
        <div className="gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">

          {/* Logout */}
          <button
            className="w-full flex items-center gap-3 px-4 py- rounded-xl text-red-500 hover:bg-red-50 transition-all"
            onClick={handleLogout}
          >
            <FaRightFromBracket />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
}