import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiX,
} from "react-icons/fi";

import FinanceSummaryCards from "./FinanceSummaryCards";
import PaymentTable from "./PaymentTable";
import AddInvoiceForm from "./AddInvoiceForm";

export default function PaymentDashboard() {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            الفواتير والمدفوعات
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            نظرة عامة على الحسابات
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            <FiDownload size={16} />
            تصدير
          </button>

          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition active:scale-95 shadow-sm"
          >
            <FiPlus size={16} />
            فاتورة جديدة
          </button>

        </div>
      </div>

      {/* Cards */}
      <FinanceSummaryCards />

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100">

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

            <input
              type="text"
              placeholder="ابحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pr-10 pl-4 py-2.5 rounded-xl
                bg-gray-50 border border-gray-200
                text-sm text-gray-700

                focus:bg-white
                focus:border-blue-400
                focus:ring-2 focus:ring-blue-100

                transition
              "
            />
          </div>

          {/* Filter */}
          <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition">
            <FiFilter size={16} />
          </button>

        </div>

        {/* Table */}
        <PaymentTable searchQuery={searchQuery} />

      </div>

      {/* Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsInvoiceModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-6">

            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="absolute left-4 top-4 p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            >
              <FiX size={16} />
            </button>

            <AddInvoiceForm onClose={() => setIsInvoiceModalOpen(false)} />
          </div>

        </div>
      )}
    </div>
  );
}