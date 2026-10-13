import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import { AUTH_URLS, publicAxiosInstance } from "../../Services/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice/authSlice";

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      navigate("/dashboard");
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await publicAxiosInstance.post(AUTH_URLS.Login, data);

      const token = res.data.data.access_token;
      const user = res.data.data.user;

      dispatch(
        loginSuccess({
          token,
          user,
        })
      );

      toast.success("تم تسجيل الدخول بنجاح ✅");

      const roleRedirects = {
        doctor: "/doctor",
        receptionist: "/reception",
      };

      navigate(roleRedirects[user.role]);


      localStorage.setItem("token", res.data.data.access_token);
      localStorage.setItem("user", JSON.stringify(user));

    } catch (err) {
      console.error(err);
      toast.error("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-10 space-y-2" dir="rtl">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">
          تسجيل الدخول
        </h2>

        <p className="text-sm text-gray-400 font-medium">
          ادخل بياناتك للوصول إلى لوحة التحكم
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
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
              {...register("email", {
                required: "البريد الإلكتروني مطلوب",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "البريد الإلكتروني غير صحيح",
                },
              })}
              placeholder="admin@dentist.com"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-11 pl-4 text-sm font-bold text-gray-700 outline-none transition-all
          focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
            />
          </div>

          {errors.email && (
            <p className="error text-xs font-bold text-red-600">
              {errors.email.message}
            </p>
          )}

        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase mr-1">
            كلمة المرور
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
              })}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-11 pl-12 text-sm font-bold text-gray-700 outline-none transition-all
          focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
            </button>
          </div>

          {errors.password && (
            <p className="error text-xs font-bold text-red-600">
              {errors.password.message}
            </p>
          )}

        </div>

        {/* Forgot */}
        <div className="flex justify-start">
          <Link
            to="/forget-password"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]
      disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? "جاري الدخول..." : "دخول للنظام"}
        </button>

      </form>

    </>
  );
}

/* Reusable Input */
function Input({ label, icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 mr-1">{label}</label>

      <div className="relative group">
        <div className="icon">{icon}</div>

        <input {...props} className="input pr-11 pl-4" />
      </div>
    </div>
  );
}