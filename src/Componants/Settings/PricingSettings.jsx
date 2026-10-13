import React, { useEffect, useMemo, useState } from "react";

import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getServices,
  deleteService,
} from "../../redux/ServicesSlice/ServicesSlice";

import AddServiceModal from "./AddServiceModal";

export default function PricingSettings() {
  const dispatch = useDispatch();

  const { services, stats, loading } = useSelector((state) => state.services);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ===============================
     GET SERVICES
  =============================== */

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  /* ===============================
     FILTER
  =============================== */

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        service.name?.toLowerCase().includes(searchValue) ||
        service.description?.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "all" || service.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && service.isActive) ||
        (statusFilter === "inactive" && !service.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, categoryFilter, statusFilter]);

  /* ===============================
     OPEN ADD
  =============================== */

  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  /* ===============================
     OPEN EDIT
  =============================== */

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  /* ===============================
     DELETE
  =============================== */

  const handleDelete = async (service) => {
    setServiceToDelete(service);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await dispatch(deleteService(serviceToDelete._id)).unwrap();

      toast.success("تم حذف الخدمة بنجاح");

      setServiceToDelete(null);
    } catch (error) {
      toast.error(error || "فشل حذف الخدمة");
    }
  };

  /* ===============================
     CLOSE MODAL
  =============================== */

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">
      {/* =====================================
          MODAL
      ====================================== */}

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
              w-11
              h-11
              rounded-2xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
            "
            >
              <HiOutlineCurrencyDollar size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-800">
                أسعار الخدمات
              </h2>

              <p className="text-[11px] text-gray-400 font-bold mt-1">
                إدارة خدمات وأسعار العيادة
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-2xl
            text-xs
            font-black
            shadow-lg
            shadow-blue-100
            transition
            active:scale-95
          "
        >
          <HiOutlinePlus size={18} />
          إضافة خدمة
        </button>
      </div>

      {/* =====================================
          STATS
      ====================================== */}

      <div
        className="
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-3
      "
      >
        <ServiceStat
          label="إجمالي الخدمات"
          value={stats?.total || 0}
          icon={<HiOutlineCurrencyDollar />}
          className="bg-blue-50 text-blue-600"
        />

        <ServiceStat
          label="خدمات تجميلية"
          value={stats?.byCategory?.["تجميلي"] || 0}
          icon="✨"
          className="bg-purple-50 text-purple-600"
        />

        <ServiceStat
          label="خدمات علاجية"
          value={stats?.byCategory?.["علاجي"] || 0}
          icon="🦷"
          className="bg-emerald-50 text-emerald-600"
        />

        <ServiceStat
          label="خدمات عامة"
          value={stats?.byCategory?.["عام"] || 0}
          icon="📋"
          className="bg-slate-100 text-slate-600"
        />
      </div>

      {/* =====================================
          FILTERS
      ====================================== */}

      <div
        className="
        bg-white
        border
        border-gray-100
        rounded-[1.75rem]
        p-4
      "
      >
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-3
        "
        >
          {/* Search */}

          <div className="relative">
            <HiOutlineMagnifyingGlass
              size={18}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن خدمة..."
              className="
                w-full
                pr-11
                pl-4
                py-3
                rounded-xl
                bg-gray-50
                border
                border-gray-100
                text-sm
                outline-none
                focus:bg-white
                focus:border-blue-300
                focus:ring-2
                focus:ring-blue-50
                transition
              "
            />
          </div>

          {/* Category */}

          <div className="relative">
            <HiOutlineFunnel
              size={17}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="
                w-full
                appearance-none
                pr-10
                pl-4
                py-3
                rounded-xl
                bg-gray-50
                border
                border-gray-100
                text-sm
                outline-none
                cursor-pointer
              "
            >
              <option value="all">كل التصنيفات</option>

              <option value="عام">عام</option>

              <option value="علاجي">علاجي</option>

              <option value="وقائي">وقائي</option>

              <option value="تجميلي">تجميلي</option>
            </select>
          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              w-full
              px-4
              py-3
              rounded-xl
              bg-gray-50
              border
              border-gray-100
              text-sm
              outline-none
              cursor-pointer
            "
          >
            <option value="all">كل الحالات</option>

            <option value="active">الخدمات النشطة</option>

            <option value="inactive">الخدمات المتوقفة</option>
          </select>
        </div>
      </div>

      {/* =====================================
          TABLE
      ====================================== */}

      <div
        className="
        bg-white
        rounded-[1.75rem]
        border
        border-gray-100
        overflow-hidden
      "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-right">
            {/* Header */}

            <thead
              className="
              bg-gray-50
              border-b
              border-gray-100
            "
            >
              <tr
                className="
                text-[10px]
                font-black
                text-gray-400
              "
              >
                <th className="px-6 py-4">الخدمة</th>

                <th className="px-6 py-4">التصنيف</th>

                <th className="px-6 py-4">السعر</th>

                <th className="px-6 py-4">الحالة</th>

                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>

            {/* Body */}

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div
                        className="
          w-8
          h-8
          border-4
          border-blue-100
          border-t-blue-600
          rounded-full
          animate-spin
        "
                      />

                      <span className="text-xs font-bold">
                        جاري تحميل الخدمات...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr
                    key={service._id}
                    className="
                      hover:bg-blue-50/20
                      transition
                    "
                  >
                    {/* Service */}

                    <td className="px-6 py-4">
                      <div>
                        <p
                          className="
                          text-sm
                          font-black
                          text-gray-800
                        "
                        >
                          {service.name}
                        </p>

                        {service.description && (
                          <p
                            className="
                            text-[11px]
                            text-gray-400
                            mt-1
                            max-w-[350px]
                            truncate
                          "
                          >
                            {service.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Category */}

                    <td className="px-6 py-4">
                      <CategoryBadge category={service.category} />
                    </td>

                    {/* Price */}

                    <td className="px-6 py-4">
                      <span
                        className="
                        inline-flex
                        items-center
                        gap-1
                        text-sm
                        font-black
                        text-blue-600
                      "
                      >
                        {Number(service.price || 0).toLocaleString("ar-EG")}

                        <span
                          className="
                          text-[10px]
                          text-gray-400
                        "
                        >
                          ج.م
                        </span>
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <StatusBadge isActive={service.isActive} />
                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">
                      <div
                        className="
                        flex
                        justify-end
                        gap-2
                      "
                      >
                        <button
                          onClick={() => handleEdit(service)}
                          title="تعديل"
                          className="
                            w-9
                            h-9
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            text-gray-400
                            hover:text-blue-600
                            hover:bg-blue-50
                            transition
                          "
                        >
                          <HiOutlinePencilSquare size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(service)}
                          title="حذف"
                          className="
                            w-9
                            h-9
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            text-gray-400
                            hover:text-red-600
                            hover:bg-red-50
                            transition
                          "
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div
                      className="
                      flex
                      flex-col
                      items-center
                    "
                    >
                      <div
                        className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                        text-gray-400
                        mb-3
                      "
                      >
                        <HiOutlineMagnifyingGlass size={24} />
                      </div>

                      <p
                        className="
                        text-sm
                        font-black
                        text-gray-600
                      "
                      >
                        لا توجد خدمات
                      </p>

                      <p
                        className="
                        text-xs
                        text-gray-400
                        mt-1
                      "
                      >
                        لم نجد خدمات مطابقة للبحث
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* =====================================
    DELETE MODAL
====================================== */}

{serviceToDelete && (
  <div
    className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/50
      backdrop-blur-sm
      p-4
    "
    onClick={() => setServiceToDelete(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        w-full
        max-w-md
        bg-white
        rounded-[2rem]
        shadow-2xl
        overflow-hidden
        animate-in
        fade-in
        zoom-in-95
        duration-200
      "
    >

      {/* Header */}

      <div className="px-6 pt-6">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-red-50
                text-red-600
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <HiOutlineTrash size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-800">
                حذف الخدمة
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                تأكيد حذف الخدمة من النظام
              </p>
            </div>

          </div>

          <button
            onClick={() => setServiceToDelete(null)}
            className="
              w-9
              h-9
              rounded-xl
              bg-gray-100
              text-gray-400
              hover:bg-red-50
              hover:text-red-600
              transition
              flex
              items-center
              justify-center
              font-bold
            "
          >
            ✕
          </button>

        </div>

      </div>

      {/* Content */}

      <div className="px-6 py-6">

        <div
          className="
            rounded-2xl
            bg-red-50/70
            border
            border-red-100
            p-4
          "
        >
          <p className="text-sm text-gray-600 leading-7">
            هل أنت متأكد من حذف الخدمة التالية؟
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">

            <div className="min-w-0">

              <p className="
                text-sm
                font-black
                text-gray-800
                truncate
              ">
                {serviceToDelete.name}
              </p>

              <p className="
                text-xs
                text-gray-400
                mt-1
              ">
                {serviceToDelete.category}
              </p>

            </div>

            <span className="
              shrink-0
              px-3
              py-1.5
              rounded-lg
              bg-white
              border
              border-red-100
              text-red-600
              text-xs
              font-black
            ">
              {Number(
                serviceToDelete.price || 0
              ).toLocaleString("ar-EG")}{" "}
              ج.م
            </span>

          </div>

        </div>

        <p className="
          text-[11px]
          text-gray-400
          mt-4
          leading-6
        ">
          لا يمكن التراجع عن عملية الحذف بعد تأكيدها.
        </p>

      </div>

      {/* Footer */}

      <div
        className="
          px-6
          py-4
          bg-gray-50/70
          border-t
          border-gray-100
          flex
          items-center
          justify-end
          gap-2
        "
      >

        <button
          onClick={() => setServiceToDelete(null)}
          className="
            px-5
            py-2.5
            rounded-xl
            bg-white
            border
            border-gray-200
            text-gray-600
            text-xs
            font-black
            hover:bg-gray-100
            transition
          "
        >
          إلغاء
        </button>

        <button
          onClick={confirmDeleteService}
          disabled={loading}
          className="
            px-5
            py-2.5
            rounded-xl
            bg-red-600
            hover:bg-red-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-white
            text-xs
            font-black
            shadow-sm
            shadow-red-100
            transition
            flex
            items-center
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

              جاري الحذف...
            </>
          ) : (
            <>
              <HiOutlineTrash size={16} />
              حذف الخدمة
            </>
          )}
        </button>

      </div>

    </div>
  </div>
)}
        </div>

        {/* Footer */}

        {!loading && filteredServices.length > 0 && (
          <div
            className="
              px-6
              py-3
              bg-gray-50/60
              border-t
              border-gray-100
              text-xs
              font-bold
              text-gray-400
            "
          >
            عرض {filteredServices.length} من {services.length} خدمة
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================
   SERVICE STAT
========================================= */

function ServiceStat({ label, value, icon, className }) {
  return (
    <div
      className="
      bg-white
      border
      border-gray-100
      rounded-2xl
      p-4
    "
    >
      <div
        className="
        flex
        items-center
        justify-between
      "
      >
        <div
          className={`
            w-9
            h-9
            rounded-xl
            flex
            items-center
            justify-center
            ${className}
          `}
        >
          {icon}
        </div>

        <span
          className="
          text-xl
          font-black
          text-gray-800
        "
        >
          {value}
        </span>
      </div>

      <p
        className="
        text-[10px]
        font-black
        text-gray-400
        mt-3
      "
      >
        {label}
      </p>
      
    </div>
  );
}

/* =========================================
   CATEGORY BADGE
========================================= */

function CategoryBadge({ category }) {
  const map = {
    عام: "bg-slate-100 text-slate-600",
    علاجي: "bg-blue-50 text-blue-600",
    وقائي: "bg-emerald-50 text-emerald-600",
    تجميلي: "bg-purple-50 text-purple-600",
  };

  return (
    <span
      className={`
        inline-flex
        px-2.5
        py-1
        rounded-lg
        text-[10px]
        font-black
        ${map[category] || map["عام"]}
      `}
    >
      {category || "عام"}
    </span>
  );
}

/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({ isActive }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        px-2.5
        py-1
        rounded-lg
        text-[10px]
        font-black
        ${
          isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        }
      `}
    >
      {isActive ? (
        <HiOutlineCheckCircle size={13} />
      ) : (
        <HiOutlineXCircle size={13} />
      )}

      {isActive ? "نشطة" : "متوقفة"}
    </span>
  );
}
