import React from "react";
import { FiX, FiUser, FiClock, FiActivity } from "react-icons/fi";

export default function AddAppointmentModal({ isOpen, onClose, onAdd }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newApp = {
      id: Date.now(),
      patientName: formData.get("patientName"),
      treatmentType: formData.get("treatmentType"),
      hour: parseInt(formData.get("hour")),
      dayIndex: new Date().getDay(),
      status: "pending",
    };

    onAdd(newApp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-cairo" dir="rtl">

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md">

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              حجز موعد جديد
            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">

            {/* Patient */}
            <Input
              icon={<FiUser />}
              label="اسم المريض"
              name="patientName"
              placeholder="أدخل الاسم..."
              required
            />

            {/* Treatment */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium">
                نوع المعالجة
              </label>

              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiActivity size={16} />
                </span>

                <select
                  name="treatmentType"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700
                  focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                >
                  <option>كشف عام</option>
                  <option>حشو عصب</option>
                  <option>تقويم</option>
                  <option>تبييض</option>
                </select>
              </div>
            </div>

            {/* Time */}
            <Input
              icon={<FiClock />}
              label="الساعة"
              name="hour"
              type="number"
              placeholder="مثلاً 10"
              min="9"
              max="22"
              required
            />

            {/* Actions */}
            <div className="flex gap-3 pt-2">

              <button
                type="submit"
                className="
                  flex-1 py-3 bg-blue-600 text-white rounded-xl
                  text-sm font-semibold
                  hover:bg-blue-700 transition active:scale-95
                  shadow-md shadow-blue-200
                "
              >
                تأكيد الحجز
              </button>

              <button
                type="button"
                onClick={onClose}
                className="
                  px-5 py-3 rounded-xl text-sm font-medium
                  bg-gray-100 text-gray-600
                  hover:bg-gray-200 transition
                "
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

/* Reusable Input */
function Input({ icon, label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 font-medium">
        {label}
      </label>

      <div className="relative">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>

        <input
          {...props}
          className="
            w-full pr-10 pl-4 py-3 rounded-xl
            bg-gray-50 border border-gray-200
            text-sm text-gray-700

            focus:bg-white
            focus:border-blue-400
            focus:ring-2 focus:ring-blue-100

            transition
          "
        />
      </div>
    </div>
  );
}