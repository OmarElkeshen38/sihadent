import React, { useEffect, useState } from "react";
import {
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { addUser, editUser, getUsers } from "../../redux/UsersSlice/UsersSlice";

export default function AddUserModal({ isOpen, onClose, user = null }) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.users || {});

  const isEditMode = Boolean(user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "receptionist",
    password: "",
    isActive: true,
  });

  // ==================== SET FORM ====================

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "receptionist",
        password: "",
        isActive: user.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "receptionist",
        password: "",
        isActive: true,
      });
    }
  }, [user, isOpen]);

  // ==================== CHANGE ====================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==================== SUBMIT ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      toast.error("من فضلك أدخل اسم المستخدم");
      return;
    }

    if (!email) {
      toast.error("من فضلك أدخل البريد الإلكتروني");
      return;
    }

    if (!formData.role) {
      toast.error("من فضلك اختر نوع الحساب");
      return;
    }

    // Password مطلوب فقط عند الإضافة
    if (!isEditMode && !formData.password.trim()) {
      toast.error("من فضلك أدخل كلمة المرور");
      return;
    }

    if (!isEditMode && formData.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    const data = {
      name,
      email,
      role: formData.role,
      isActive: formData.isActive,
    };

    // Password لا نرسله في التعديل لو فاضي
    if (formData.password.trim()) {
      data.password = formData.password;
    }

    try {
      if (isEditMode) {
        await dispatch(
          editUser({
            id: user._id,
            data,
          }),
        ).unwrap();

        // تحديث الـ stats والبيانات من السيرفر
        await dispatch(getUsers()).unwrap();

        toast.success("تم تعديل المستخدم بنجاح");
      } else {
        await dispatch(addUser(data)).unwrap();

        // تحديث الـ stats والبيانات من السيرفر
        await dispatch(getUsers()).unwrap();

        toast.success("تم إنشاء المستخدم بنجاح");
      }

      onClose();
    } catch (error) {
      toast.error(
        error || (isEditMode ? "فشل تعديل المستخدم" : "فشل إنشاء المستخدم"),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 font-cairo"
      dir="rtl"
    >
      {/* ==================== OVERLAY ==================== */}

      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[4px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* ==================== MODAL ==================== */}

      <div className="relative bg-white w-full max-w-[420px] rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-100 animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* ==================== CLOSE ==================== */}

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute left-6 top-6 text-gray-300 hover:text-red-500 transition disabled:opacity-40"
        >
          <HiOutlineXMark size={22} />
        </button>

        <div className="p-8 space-y-6">
          {/* ==================== HEADER ==================== */}

          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                isEditMode
                  ? "bg-amber-50 text-amber-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {isEditMode ? (
                <HiOutlinePencilSquare size={20} />
              ) : (
                <HiOutlineUser size={20} />
              )}
            </div>

            <div>
              <h3 className="text-base font-black text-gray-800">
                {isEditMode ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
              </h3>

              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                {isEditMode ? "Edit System User" : "Create System User"}
              </p>
            </div>
          </div>

          {/* ==================== FORM ==================== */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}

            <Field label="الاسم الكامل" icon={<HiOutlineUser size={18} />}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="د. أحمد علي"
                className="input"
                disabled={loading}
              />
            </Field>

            {/* Email */}

            <Field
              label="البريد الإلكتروني"
              icon={<HiOutlineEnvelope size={18} />}
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@email.com"
                className="input text-left"
                dir="ltr"
                disabled={loading}
              />
            </Field>

            {/* Role */}

            <Field label="نوع الحساب" icon={<HiOutlineShieldCheck size={18} />}>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                disabled={loading}
              >
                <option value="receptionist">استقبال</option>

                <option value="doctor">طبيب</option>
              </select>
            </Field>

            {/* Password */}

            <Field
              label={
                isEditMode ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور"
              }
              icon={<HiOutlineLockClosed size={18} />}
            >
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isEditMode ? "اتركها فارغة بدون تغيير" : "••••••••"
                }
                className="input text-left"
                dir="ltr"
                disabled={loading}
              />
            </Field>

            {/* Active */}

            <label className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 cursor-pointer">
              <div>
                <p className="text-xs font-black text-gray-700">حالة الحساب</p>

                <p className="text-[10px] text-gray-400 mt-1">
                  السماح للمستخدم بتسجيل الدخول
                </p>
              </div>

              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 accent-blue-600"
              />
            </label>

            {/* ==================== BUTTONS ==================== */}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] text-white py-3.5 rounded-xl text-xs font-black transition shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isEditMode
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-100"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الحفظ...
                  </span>
                ) : isEditMode ? (
                  "حفظ التعديلات"
                ) : (
                  "إنشاء الحساب"
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-500 py-3.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ==================== FIELD ==================== */

function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-gray-400 mr-1">
        {label}
      </label>

      <div className="relative group">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition pointer-events-none">
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}
