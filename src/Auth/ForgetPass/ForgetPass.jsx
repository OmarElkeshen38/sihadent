import React, { useState } from "react";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

function ForgetPass() {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.email) {
            return setError("من فضلك ادخل جميع البيانات");
        }

        setError("");
        setLoading(true);

        // fake request
        setTimeout(() => {
            setLoading(false);

            if (form.email === "admin@dentist.com") {
                alert("تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني ✅");
            } else {
                setError("البريد الإلكتروني غير مسجل لدينا");
            }
        }, 1200);
    };


    return (
        <>
            {/* Header */}
            <div className="text-center mb-10 space-y-2" dir="rtl">
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                    اعادة تعيين كلمة المرور
                </h2>

                <p className="text-sm text-gray-400 font-medium">
                    ادخل بريدك الإلكتروني لارسال رمز إعادة تعيين كلمة المرور
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 text-right"
                dir="rtl"
            >

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase mr-1">
                        البريد الإلكتروني
                    </label>

                    <div className="relative group">
                        <HiOutlineEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@dentist.com"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-11 pl-4 text-sm font-bold text-gray-700 outline-none transition-all
          focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Login */}
                <div className="flex justify-start">
                    <Link
                        to="/login"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
                    >
                        العودة لتسجيل الدخول
                    </Link>
                </div>

                {/* Submit */}
                <button
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]
      disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                            جاري ارسال الرمز...
                        </>
                    ) : (
                        "إرسال الرمز"
                    )}
                </button>

            </form>
        </>
    )
}

export default ForgetPass
