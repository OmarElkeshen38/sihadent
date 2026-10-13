import React from "react";
import {
  FiEye,
  FiPrinter,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

export default function PaymentTable({ searchQuery = "" }) {

  const invoices = [
    { id: "INV-2026-001", patient: "أحمد محمد علي", service: "زراعة أسنان", total: 15000, paid: 15000, status: "Paid", date: "2026-04-10" },
    { id: "INV-2026-002", patient: "سارة محمود", service: "تقويم شفاف", total: 25000, paid: 10000, status: "Partial", date: "2026-04-12" },
    { id: "INV-2026-003", patient: "ياسين إبراهيم", service: "تنظيف جير", total: 800, paid: 0, status: "Unpaid", date: "2026-04-14" },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.patient.includes(searchQuery) ||
      inv.id.includes(searchQuery)
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-right min-w-[850px]">

        {/* Header */}
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr className="text-xs text-gray-400">
            <th className="px-4 py-3">الفاتورة</th>
            <th className="px-4 py-3">المريض</th>
            <th className="px-4 py-3">الخدمة</th>
            <th className="px-4 py-3">الإجمالي</th>
            <th className="px-4 py-3">المدفوع</th>
            <th className="px-4 py-3">الحالة</th>
            <th className="px-4 py-3 text-left">إجراءات</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100">

          {filteredInvoices.map((inv) => (
            <tr
              key={inv.id}
              className="hover:bg-blue-50/20 transition"
            >

              {/* Invoice */}
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-800">
                  {inv.id}
                </p>
                <p className="text-xs text-gray-400">
                  {inv.date}
                </p>
              </td>

              {/* Patient */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <FiUser size={14} />
                  </div>
                  <span className="text-sm text-gray-700">
                    {inv.patient}
                  </span>
                </div>
              </td>

              {/* Service */}
              <td className="px-4 py-3">
                <span className="text-xs text-gray-600">
                  {inv.service}
                </span>
              </td>

              {/* Total */}
              <td className="px-4 py-3 text-sm text-gray-800">
                {inv.total.toLocaleString()} ج.م
              </td>

              {/* Paid */}
              <td className="px-4 py-3 text-sm font-medium text-emerald-600">
                {inv.paid.toLocaleString()} ج.م
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <Status status={inv.status} />
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-left">
                <div className="flex justify-end gap-1">

                  <IconBtn>
                    <FiEye size={16} />
                  </IconBtn>

                  <IconBtn>
                    <FiPrinter size={16} />
                  </IconBtn>

                  <IconBtn danger>
                    <FiTrash2 size={16} />
                  </IconBtn>

                </div>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}

/* Status */
function Status({ status }) {
  const map = {
    Paid: "bg-emerald-50 text-emerald-600",
    Partial: "bg-amber-50 text-amber-600",
    Unpaid: "bg-red-50 text-red-600",
  };

  const label = {
    Paid: "مدفوع",
    Partial: "جزئي",
    Unpaid: "غير مدفوع",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-md ${map[status]}`}>
      {label[status]}
    </span>
  );
}

/* Icon Button */
function IconBtn({ children, danger }) {
  return (
    <button
      className={`
        p-2 rounded-lg transition
        ${danger
          ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
          : "text-gray-400 hover:text-blue-600 hover:bg-gray-50"}
      `}
    >
      {children}
    </button>
  );
}