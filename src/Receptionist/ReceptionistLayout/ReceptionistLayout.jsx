import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    HiOutlineCalendarDays,
    HiOutlineUsers,
    HiOutlineCurrencyDollar,
    HiOutlineHome,
    HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice/authSlice";

export default function ReceptionistLayout() {

    const navItems = [
        { to: "/reception/dashboard", label: "الرئيسية", icon: <HiOutlineHome /> },
        { to: "/reception/daily", label: "الحجوزات اليومية", icon: <HiOutlineCalendarDays /> },
        { to: "/reception/appointments", label: "المواعيد", icon: <HiOutlineCalendarDays /> },
        { to: "/reception/patients", label: "المرضى", icon: <HiOutlineUsers /> },
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());

        navigate("/login");
    };

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

    return (
        <div className="flex h-screen bg-gray-50 font-cairo" dir="rtl">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-l border-gray-100 flex flex-col">

                {/* Logo */}
                <div className="p-6 border-b border-gray-100 text-center">
                    <h2 className="text-xl font-black text-blue-600">SihaDent</h2>
                    <p className="text-[10px] text-gray-400 mt-1">Reception Panel</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                ${isActive
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-gray-500 hover:bg-gray-100"}`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => handleLogout()}
                        className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-bold hover:bg-red-50 py-3 rounded-xl transition"
                    >
                        <HiOutlineArrowRightOnRectangle />
                        تسجيل الخروج
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">

                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
                    <h1 className="text-sm font-black text-gray-700">
                        لوحة الاستقبال
                    </h1>

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

                                <span className="relative z-10 tracking-wide capitalize">
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
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </div>

            </main>

        </div>
    );
}