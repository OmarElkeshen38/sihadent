import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidbar from "../Sidbar/Sidbar";
import Navbar from "../Navbar/Navbar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]" dir="rtl">

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 right-0 z-50 w-72 
        bg-white/90 backdrop-blur-xl 
        border-l border-gray-200
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        transition-all duration-300 ease-in-out

        ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}

        lg:relative lg:translate-x-0 lg:opacity-100 
        lg:flex lg:flex-col lg:shadow-none
      `}
      >
        <div className="h-full overflow-y-auto custom-scrollbar p-2">
          <Sidbar closeSidebar={() => setIsOpen(false)} />
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">

        {/* Navbar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <Navbar onMenuClick={() => setIsOpen(true)} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="max-w-[1400px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}