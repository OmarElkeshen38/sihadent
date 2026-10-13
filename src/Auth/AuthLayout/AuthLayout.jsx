import React, { useState } from "react";
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeSlash,
} from "react-icons/hi2";
import sihaDentLogo from '../../assets/sihaDentLogo.png';
import { Outlet } from "react-router-dom";

function AuthLayout() {

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-cairo">
            <div className="bg-white w-full max-w-[1000px] h-[600px] rounded-[32px] shadow-2xl shadow-blue-100/50 flex overflow-hidden border border-white">

                {/* Left */}
                <div className="hidden md:flex md:w-1/2 relative p-10 flex-col justify-between text-white overflow-hidden">

                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600" />

                    {/* Light Glow Effect */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-300/10 blur-3xl rounded-full" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col">

                        {/* Logo */}
                        <div className="flex justify-center md:justify-start">
                            <img
                                src={sihaDentLogo}
                                alt="SihaDent"
                                className="w-100 object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-black leading-snug tracking-tight">
                                نظام إدارة عيادات الأسنان
                            </h1>

                            <p className="mt-4 text-blue-100 text-sm leading-relaxed max-w-md">
                                تحكم كامل في المواعيد، المرضى، الحسابات، والخدمات في لوحة واحدة
                                مصممة لتسهيل شغل العيادة وزيادة الكفاءة.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="flex flex-col gap-2 text-xs text-blue-100 mt-2">
                            <span>✔ إدارة المرضى بسهولة</span>
                            <span>✔ تنظيم المواعيد بدقة</span>
                            <span>✔ متابعة مالية كاملة</span>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-xs text-blue-200">
                        © 2026 SihaDent — All rights reserved — Developed by Omar Elkeshen
                    </div>

                </div>

                {/* Right */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">

                    <Outlet />

                </div>
            </div>
        </div>
    )
}

export default AuthLayout
