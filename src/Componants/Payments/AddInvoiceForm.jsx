import React from "react";
import {
  FiPlus,
  FiUser,
  FiActivity,
  FiDollarSign,
  FiCreditCard,
  FiCheck,
} from "react-icons/fi";

export default function AddInvoiceForm({ onClose }) {
  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <FiPlus size={18} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900">
            إنشاء فاتورة
          </h3>
          <p className="text-xs text-gray-400">
            إضافة معاملة مالية جديدة
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">

        {/* Patient */}
        <Field label="المريض" icon={<FiUser size={16} />}>
          <select className="input">
            <option>اختر المريض...</option>
            <option>أحمد محمد</option>
            <option>سارة محمود</option>
          </select>
        </Field>

        {/* Service */}
        <Field label="الخدمة" icon={<FiActivity size={16} />}>
          <select className="input">
            <option>اختر الخدمة...</option>
            <option>زراعة أسنان - 15000</option>
          </select>
        </Field>

        {/* Amount + Method */}
        <div className="grid grid-cols-2 gap-3">

          <Field label="المبلغ" icon={<FiDollarSign size={16} />}>
            <input
              type="number"
              placeholder="0.00"
              className="input"
            />
          </Field>

          <Field label="طريقة الدفع" icon={<FiCreditCard size={16} />}>
            <select className="input">
              <option>نقداً</option>
              <option>فيزا</option>
            </select>
          </Field>

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
            bg-blue-600 text-white
            hover:bg-blue-700 transition
            active:scale-95
          "
        >
          <div className="flex items-center justify-center gap-2">
            <FiCheck size={16} />
            حفظ الفاتورة
          </div>
        </button>

      </div>

    </div>
  );
}

/* Reusable Field */
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