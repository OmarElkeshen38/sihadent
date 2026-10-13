import React from "react";

import {
  FiEdit2,
  FiPlus,
  FiMinus,
  FiAlertCircle,
  FiPackage,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { INVENTORY_URLS, privateAxiosInstance } from "../../Services/api.js";

export default function InventoryTable({
  inventory = [],
  loading = false,
  setInventory,
  setSelectedItem,
  setIsAddModalOpen,
}) {

  const handleDelete = async (id) => {

    try {

      await privateAxiosInstance.delete(
        INVENTORY_URLS.deleteInventory(id)
      );

      toast.success("تم حذف الصنف بنجاح ✅", {
        position: "top-center",
      });

      // حذف العنصر من الـ state مباشرة
      setInventory((prev) =>
        prev.filter((item) => item._id !== id)
      );

    } catch (error) {

      console.log(error);

      toast.error("حدث خطأ أثناء الحذف ❌", {
        position: "top-center",
      });
    }
  };


  return (
    <div className="w-full overflow-x-auto">

      {/* Loading */}
      {loading ? (

        <div className="p-10 flex flex-col items-center justify-center">

          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>

          <p className="text-sm text-gray-400 font-medium mt-4">
            جاري تحميل بيانات المخزن...
          </p>

        </div>

      ) : (

        <>
          {/* Table */}
          <table className="w-full text-right min-w-[850px]">

            {/* Header */}
            <thead className="bg-gray-50 border-b border-gray-100">

              <tr className="text-xs text-gray-400">

                <th className="px-5 py-4 font-black">
                  الصنف
                </th>

                <th className="px-5 py-4 font-black">
                  التصنيف
                </th>

                <th className="px-5 py-4 font-black text-center">
                  الكمية
                </th>

                <th className="px-5 py-4 font-black text-center">
                  الحد الأدنى
                </th>

                <th className="px-5 py-4 font-black">
                  الحالة
                </th>

                <th className="px-5 py-4 font-black text-left">
                  الإجراءات
                </th>

              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">

              {inventory.map((item) => {

                const isOut =
                  item.quantity === 0;

                const isLow =
                  item.quantity <= item.minQuantity &&
                  item.quantity > 0;

                return (
                  <tr
                    key={item._id}
                    className="
                      hover:bg-blue-50/20
                      transition-all duration-200
                      group
                    "
                  >

                    {/* Name */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-11 h-11 rounded-xl
                            bg-blue-50 text-blue-600
                            flex items-center justify-center
                          "
                        >
                          <FiPackage size={18} />
                        </div>

                        <div>

                          <p className="text-sm font-bold text-gray-800">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            الوحدة: {item.unit}
                          </p>

                        </div>

                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">

                      <span
                        className="
                          text-xs font-bold
                          text-gray-600
                          bg-gray-100
                          px-3 py-1 rounded-lg
                        "
                      >
                        {item.category}
                      </span>

                    </td>

                    {/* Quantity */}
                    <td className="px-5 py-4 text-center">

                      <span
                        className={`
                          text-sm font-black
                          ${isOut
                            ? "text-red-600"
                            : isLow
                              ? "text-amber-600"
                              : "text-gray-800"
                          }
                        `}
                      >
                        {item.quantity}
                      </span>

                    </td>

                    {/* Min Quantity */}
                    <td className="px-5 py-4 text-center">

                      <span className="text-sm text-gray-500 font-bold">
                        {item.minQuantity}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <Status
                        isOut={isOut}
                        isLow={isLow}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-left">

                      <div
                        className="
                          flex items-center justify-end gap-1
                          opacity-0 group-hover:opacity-100
                          transition-all
                        "
                      >

                        <IconBtn
                          onClick={() => {
                            setSelectedItem(item);
                            setIsAddModalOpen(true);
                          }}
                        >
                          <FiEdit2 size={14} />
                        </IconBtn>

                        <IconBtn
                          onClick={() => handleDelete(item._id)}
                        >
                          <FiTrash2 size={14} />
                        </IconBtn>

                      </div>

                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty */}
          {inventory.length === 0 && (

            <div className="py-20 flex flex-col items-center justify-center">

              <div
                className="
                  w-14 h-14 rounded-2xl
                  bg-gray-100 text-gray-400
                  flex items-center justify-center
                "
              >
                <FiPackage size={24} />
              </div>

              <p className="text-sm font-bold text-gray-500 mt-4">
                لا توجد أصناف بالمخزن
              </p>

            </div>
          )}
        </>
      )}
    </div>
  );
}

/* Status */
function Status({ isOut, isLow }) {

  if (isOut) {
    return (
      <div
        className="
          inline-flex items-center gap-1.5
          bg-red-50 text-red-600
          border border-red-100
          px-3 py-1 rounded-full
          text-[11px] font-black
        "
      >
        <FiAlertCircle size={12} />
        نفذت الكمية
      </div>
    );
  }

  if (isLow) {
    return (
      <div
        className="
          inline-flex items-center gap-1.5
          bg-amber-50 text-amber-600
          border border-amber-100
          px-3 py-1 rounded-full
          text-[11px] font-black
        "
      >
        <FiAlertCircle size={12} />
        كمية منخفضة
      </div>
    );
  }

  return (
    <div
      className="
        inline-flex items-center
        bg-emerald-50 text-emerald-600
        border border-emerald-100
        px-3 py-1 rounded-full
        text-[11px] font-black
      "
    >
      متوفر
    </div>
  );
}

/* Button */
function IconBtn({ children, onClick }) {

  return (
    <button
      className="
        p-2 rounded-xl
        text-gray-400
        hover:text-blue-600
        hover:bg-blue-50
        transition-all
      "
      onClick={onClick}
    >
      {children}
    </button>
  );
}