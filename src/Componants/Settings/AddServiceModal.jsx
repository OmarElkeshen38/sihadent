import React, { useEffect, useState } from "react";

import {
  HiOutlineXMark,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
  HiOutlineQueueList,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  addService,
  editService,
} from "../../redux/ServicesSlice/ServicesSlice";

export default function AddServiceModal({ isOpen, onClose, service = null }) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.services);

  const isEditMode = Boolean(service);

  const [formData, setFormData] = useState({
    name: "",
    category: "عام",
    price: "",
    description: "",
    isActive: true,
  });

  /* =====================================
     SET FORM DATA
  ====================================== */

  useEffect(() => {
    if (!isOpen) return;

    if (service) {
      setFormData({
        name: service.name || "",
        category: service.category || "عام",
        price: service.price ?? "",
        description: service.description || "",
        isActive: service.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        category: "عام",
        price: "",
        description: "",
        isActive: true,
      });
    }
  }, [service, isOpen]);

  /* =====================================
     INPUT CHANGE
  ====================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================
     SUBMIT
  ====================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("من فضلك أدخل اسم الخدمة");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      toast.error("من فضلك أدخل سعر صحيح");
      return;
    }

    const data = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      description: formData.description.trim(),
      isActive: formData.isActive,
    };

    try {
      if (isEditMode) {
        await dispatch(
          editService({
            id: service._id,
            data,
          }),
        ).unwrap();

        toast.success("تم تعديل الخدمة بنجاح");
      } else {
        await dispatch(addService(data)).unwrap();

        toast.success("تم إضافة الخدمة بنجاح");
      }

      onClose();
    } catch (error) {
      toast.error(
        error || (isEditMode ? "فشل تعديل الخدمة" : "فشل إضافة الخدمة"),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        p-4
        font-cairo
      "
      dir="rtl"
    >
      {/* =====================================
          OVERLAY
      ====================================== */}

      <div
        className="
          fixed
          inset-0
          bg-slate-950/50
          backdrop-blur-sm
          animate-in
          fade-in
          duration-200
        "
        onClick={onClose}
      />

      {/* =====================================
          MODAL
      ====================================== */}

      <div
        className="
          relative
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
          bg-white
          rounded-[2rem]
          shadow-2xl
          border
          border-white
          animate-in
          zoom-in-95
          duration-200
        "
      >
        {/* =====================================
            HEADER
        ====================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-gray-100
            sticky
            top-0
            bg-white/95
            backdrop-blur-md
            z-10
          "
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                w-11
                h-11
                rounded-2xl
                flex
                items-center
                justify-center
                ${
                  isEditMode
                    ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
                }
              `}
            >
              {isEditMode ? (
                <HiOutlinePencilSquare size={21} />
              ) : (
                <HiOutlineTag size={21} />
              )}
            </div>

            <div>
              <h3 className="text-base font-black text-gray-800">
                {isEditMode ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
              </h3>

              <p className="text-[10px] text-gray-400 font-bold mt-1">
                {isEditMode
                  ? "تعديل بيانات الخدمة"
                  : "إضافة خدمة جديدة للعيادة"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-9
              h-9
              rounded-xl
              bg-gray-100
              text-gray-400
              hover:bg-red-50
              hover:text-red-600
              flex
              items-center
              justify-center
              transition
            "
          >
            <HiOutlineXMark size={20} />
          </button>
        </div>

        {/* =====================================
            FORM
        ====================================== */}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* NAME */}

          <Field label="اسم الخدمة" icon={<HiOutlineTag size={18} />}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="مثلاً: تقويم أسنان"
              className="input"
            />
          </Field>

          {/* CATEGORY */}

          <Field label="الفئة" icon={<HiOutlineQueueList size={18} />}>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input cursor-pointer"
            >
              <option value="عام">عام</option>

              <option value="علاجي">علاجي</option>

              <option value="تجميلي">تجميلي</option>

              <option value="وقائي">وقائي</option>

            </select>
          </Field>

          {/* PRICE */}

          <Field
            label="السعر (ج.م)"
            icon={<HiOutlineCurrencyDollar size={18} />}
          >
            <input
              type="number"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              className="input text-left"
              dir="ltr"
            />
          </Field>

          {/* DESCRIPTION */}

          <Field label="وصف الخدمة" icon={<HiOutlineDocumentText size={18} />}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="وصف مختصر للخدمة..."
              rows={3}
              className="
                w-full
                bg-gray-50
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
                pr-11
                text-sm
                outline-none
                resize-none
                focus:bg-white
                focus:border-blue-300
                focus:ring-2
                focus:ring-blue-100
                transition
              "
            />
          </Field>

          {/* ACTIVE */}

          <label
            className="
              flex
              items-center
              justify-between
              gap-4
              p-4
              rounded-2xl
              bg-gray-50
              border
              border-gray-100
              cursor-pointer
              hover:bg-gray-100/70
              transition
            "
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-9
                  h-9
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${
                    formData.isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-200 text-gray-400"
                  }
                `}
              >
                <HiOutlineCheckCircle size={19} />
              </div>

              <div>
                <p
                  className="
                  text-xs
                  font-black
                  text-gray-700
                "
                >
                  حالة الخدمة
                </p>

                <p
                  className="
                  text-[10px]
                  text-gray-400
                  mt-1
                "
                >
                  {formData.isActive
                    ? "الخدمة متاحة للاستخدام"
                    : "الخدمة متوقفة"}
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="
                w-5
                h-5
                accent-blue-600
                cursor-pointer
              "
            />
          </label>

          {/* BUTTONS */}

          <div
            className="
            flex
            gap-3
            pt-2
          "
          >
            <button
              type="submit"
              disabled={loading}
              className="
                flex-[2]
                bg-blue-600
                hover:bg-blue-700
                disabled:opacity-50
                disabled:cursor-not-allowed
                text-white
                py-3.5
                rounded-xl
                text-xs
                font-black
                shadow-lg
                shadow-blue-100
                transition
                active:scale-[0.98]
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      w-4
                      h-4
                      border-2
                      border-white/30
                      border-t-white
                      rounded-full
                      animate-spin
                    "
                  />
                  جاري الحفظ...
                </>
              ) : isEditMode ? (
                "حفظ التعديلات"
              ) : (
                "إضافة الخدمة"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                bg-gray-100
                text-gray-600
                py-3.5
                rounded-xl
                text-xs
                font-black
                hover:bg-gray-200
                transition
                disabled:opacity-50
              "
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================
   FIELD
========================================= */

function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label
        className="
          text-[10px]
          font-black
          text-gray-400
          mr-1
        "
      >
        {label}
      </label>

      <div className="relative group">
        <div
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-300
            group-focus-within:text-blue-500
            transition
            z-10
          "
        >
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}
