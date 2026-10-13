import React, { useState } from "react";
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineKey,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import { validateOTP, validatePassword } from "../../Services/validation";

function ResetPass() {

    const [form, setForm] = useState({
        otp: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.otp || !form.password || !form.confirmPassword) {
            return setError("من فضلك ادخل جميع البيانات");
        }

        if (!validateOTP(form.otp)) {
            return setError("رمز التحقق يجب أن يكون 6 أرقام");
        }

        if (!validatePassword(form.password)) {
            return setError("كلمة المرور يجب أن تحتوي على حروف وأرقام (6-20 حرف)");
        }

        if (form.password !== form.confirmPassword) {
            return setError("كلمتا المرور غير متطابقتين");
        }

        setError("");
        setLoading(true);

        // fake request
        setTimeout(() => {
            setLoading(false);
            alert("تم تغيير كلمة المرور بنجاح ✅");
        }, 1200);
    };



    return (
        <>
            {/* Header */}
            <div className="text-center mb-10 space-y-2" dir="rtl">
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                    إعادة تعيين كلمة المرور
                </h2>

                <p className="text-sm text-gray-400 font-medium">
                    ادخل رمز التحقق وكلمة المرور الجديدة
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 text-right"
                dir="rtl"
            >
                {/* OTP */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase mr-1">
                        رمز التحقق (OTP)
                    </label>

                    <div className="relative group">
                        <HiOutlineKey className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />

                        <input
                            type="text"
                            name="otp"
                            maxLength={6}
                            value={form.otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setForm({ ...form, otp: value });
                            }}
                            placeholder="ادخل الرمز المرسل"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-11 pl-4 text-sm font-bold text-gray-700 outline-none transition-all
              focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase mr-1">
                        كلمة المرور الجديدة
                    </label>

                    <div className="relative group">
                        <HiOutlineLockClosed className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            {...register("password", {
                                required: "كلمة المرور مطلوبة",
                                minLength: {
                                    value: 6,
                                    message: "لا تقل عن 6 حروف",
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                                    message: "يجب أن تحتوي على حروف وأرقام",
                                },
                            })}
                            placeholder="••••••••"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-11 pl-12 text-sm font-bold text-gray-700 outline-none transition-all
          focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                        />

                        
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase mr-1">
                        تأكيد كلمة المرور
                    </label>

                    <div className="relative group">
                        <HiOutlineLockClosed className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />

                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-11 pl-12 text-sm font-bold text-gray-700 outline-none transition-all
              focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showConfirm ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Back */}
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
                            جاري التحديث...
                        </>
                    ) : (
                        "تحديث كلمة المرور"
                    )}
                </button>
            </form>
        </>
    )
}

export default ResetPass
