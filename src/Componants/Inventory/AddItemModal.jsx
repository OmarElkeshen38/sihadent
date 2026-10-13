import React, { useState } from "react";
import {
  FiPackage,
  FiHash,
  FiAlertCircle,
  FiTag,
  FiCheck,
  FiPlus,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { INVENTORY_URLS, privateAxiosInstance } from "../../Services/api.js";

export default function AddItemModal({
  onClose,
  setInventory,
  item,
}) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "" || item?.name || "",
    category: "" || item?.category || "",
    quantity: "" || item?.quantity || "",
    minQuantity: "" || item?.minQuantity || "",
    unit: "" || item?.unit || "",
  });

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const payload = {
        name: form.name,
        category: form.category,
        quantity: Number(form.quantity),
        minQuantity: Number(form.minQuantity),
        unit: form.unit,
      };

      let response;

      // =========================
      // EDIT
      // =========================

      if (item) {

        console.log(payload);

        response = await privateAxiosInstance.put(
          INVENTORY_URLS.editInventory(item._id),
          payload
        );

        toast.success("تم تعديل الصنف بنجاح ✅", {
          position: "top-center",
        });

        setInventory((prev) =>
          prev.map((inv) =>
            inv._id === item._id
              ? response.data.data
              : inv
          )
        );

      }

      // =========================
      // ADD
      // =========================

      else {

        response = await privateAxiosInstance.post(
          INVENTORY_URLS.addInventory,
          payload
        );

        toast.success("تم إضافة الصنف بنجاح ✅", {
          position: "top-center",
        });

        setInventory((prev) => [
          response.data.data,
          ...prev,
        ]);
      }

      onClose();

    } catch (error) {

      console.log(error);

      console.log(error.response.data);

      toast.error("حدث خطأ ❌", {
        position: "top-center",
      });

    } finally {

      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 font-cairo text-right"
      dir="rtl"
    >

      {/* Header */}
      <div className="flex items-center gap-3">

        <div
          className="
            w-10 h-10 rounded-xl
            bg-blue-50 text-blue-600
            flex items-center justify-center
          "
        >
          <FiPlus size={18} />
        </div>

        <div>

          <h3 className="text-base font-bold text-gray-900">
            {item ? "تعديل الصنف" : "إضافة صنف جديد"}
          </h3>

          <p className="text-xs text-gray-400">
            Inventory Item
          </p>

        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">

        {/* Name */}
        <Field
          label="اسم الصنف"
          icon={<FiPackage size={16} />}
        >

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="مثلاً: بنج، قفازات..."
            className="input"
          />

        </Field>

        {/* Category */}
        <Field
          label="التصنيف"
          icon={<FiTag size={16} />}
        >

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="input"
          >

            <option value="">
              اختر التصنيف
            </option>

            <option value="مواد استهلاكية">
              مواد استهلاكية
            </option>

            <option value="أدوات طبية">
              أدوات طبية
            </option>

            <option value="مطهرات">
              مطهرات
            </option>

            <option value="أدوية">
              أدوية
            </option>

          </select>

        </Field>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">

          {/* Quantity */}
          <Field
            label="الكمية"
            icon={<FiHash size={16} />}
          >

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="0"
              className="input"
            />

          </Field>

          {/* Min */}
          <Field
            label="حد التنبيه"
            icon={<FiAlertCircle size={16} />}
          >

            <input
              type="number"
              name="minQuantity"
              value={form.minQuantity}
              onChange={handleChange}
              required
              placeholder="5"
              className="input"
            />

          </Field>

        </div>

        {/* Unit */}
        <Field
          label="الوحدة"
          icon={<FiPackage size={16} />}
        >

          <input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
            placeholder="علبة / أمبول / عبوة"
            className="input"
          />

        </Field>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">

        <button
          type="button"
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
          disabled={loading}
          type="submit"
          className="
            flex-[2] py-3 rounded-xl text-sm font-medium
            bg-blue-600 text-white
            hover:bg-blue-700 transition
            active:scale-95
            disabled:opacity-60
          "
        >

          <div className="flex items-center justify-center gap-2">

            {loading ? (

              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                جاري الحفظ...
              </>

            ) : (

              <>
                <FiCheck size={16} />
                {item ? "حفظ التعديلات" : "حفظ الصنف"}
              </>

            )}
          </div>

        </button>
      </div>
    </form>
  );
}

/* Reusable Field */
function Field({
  label,
  icon,
  children,
}) {

  return (
    <div className="space-y-1">

      <label className="text-xs text-gray-500">
        {label}
      </label>

      <div className="relative">

        <div
          className="
            absolute right-3 top-1/2
            -translate-y-1/2 text-gray-400
          "
        >
          {icon}
        </div>

        {children}

      </div>
    </div>
  );
}