import React from "react";
import {
  FiMinusCircle,
  FiPackage,
  FiHash,
  FiArrowDown,
} from "react-icons/fi";

export default function UseItemModal({ onClose }) {
  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">

      {/* Header */}
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <FiArrowDown size={18} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900">
            تسجيل استهلاك
          </h3>
          <p className="text-xs text-gray-400">
            سحب من المخزون
          </p>
        </div>

      </div>

      {/* Form */}
      <div className="space-y-4">

        {/* Item */}
        <Field label="الصنف" icon={<FiPackage size={16} />}>
          <select className="input focus:border-amber-400 focus:ring-amber-100">
            <option>اختر الصنف...</option>
            <option>بنج أسباني (45)</option>
            <option>قفازات (4)</option>
          </select>
        </Field>

        {/* Quantity */}
        <Field label="الكمية" icon={<FiHash size={16} />}>
          <input
            type="number"
            placeholder="0"
            className="input focus:border-amber-400 focus:ring-amber-100"
          />
        </Field>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">ملاحظات</label>
          <textarea
            rows="3"
            placeholder="ملاحظات إضافية..."
            className="input resize-none focus:border-amber-400 focus:ring-amber-100"
          />
        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">

        <button
          onClick={onClose}
          className="
            flex-1 py-3 rounded-xl text-sm
            bg-gray-100 text-gray-500
            hover:bg-gray-200 transition
          "
        >
          إلغاء
        </button>

        <button
          className="
            flex-[2] py-3 rounded-xl text-sm font-medium
            bg-amber-600 text-white
            hover:bg-amber-700 transition
            active:scale-95
          "
        >
          <div className="flex items-center justify-center gap-2">
            <FiMinusCircle size={16} />
            تأكيد السحب
          </div>
        </button>

      </div>

    </div>
  );
}

/* Field */
function Field({ label, icon, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">{label}</label>

      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}