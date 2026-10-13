import React from "react";
import { FiArrowRight, FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-cairo text-right" dir="rtl">

            <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center space-y-6 animate-in fade-in zoom-in duration-500">

                {/* Icon */}
                <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
                    <FiAlertTriangle size={36} />
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-5xl font-black text-gray-800 tracking-tight">
                        404
                    </h1>
                    <p className="text-sm text-gray-400 font-bold mt-2">
                        الصفحة غير موجودة
                    </p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    الصفحة التي تحاول الوصول إليها غير متوفرة أو ربما تم حذفها أو تغيير الرابط.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4">

                    <a
                        href="/"
                        className="group w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        العودة للصفحة الرئيسية
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </a>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all"
                    >
                        رجوع
                    </button>

                </div>

            </div>
        </div>
    );
}