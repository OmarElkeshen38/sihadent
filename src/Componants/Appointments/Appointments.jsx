import React, { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiPlus,
  FiX,
  FiUser,
  FiActivity,
  FiDollarSign,
  FiEdit3,
  FiPlay,
  FiCheckCircle,
  FiTrash2,
  FiPhone,
  FiFileText,
  FiAlertCircle,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getAppointments,
  getAppointment,
  addAppointment,
  editAppointment,
  editStatusAppointment,
  deleteAppointment,
  getDailyAppointments,
} from "../../redux/AppointmentsSlice/AppointmentsSlice";

import { getServices } from "../../redux/ServicesSlice/ServicesSlice";

import { getPatients } from "../../redux/PatientsSclice/PatientsSclice";

const weekDays = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

/* =====================================================
   Helpers
===================================================== */

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getToday = () => {
  return formatLocalDate(new Date());
};

const getWeekDates = (selectedDate) => {
  const start = new Date(`${selectedDate}T00:00:00`);

  const day = start.getDay();

  start.setDate(start.getDate() - day);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);

    date.setDate(start.getDate() + index);

    return date;
  });
};

/* =====================================================
   Component
===================================================== */

function Appointments() {
  const dispatch = useDispatch();

  /* =========================
     Redux
  ========================= */

  const {
    appointments = [],
    stats = {},
    loading: appointmentsLoading = false,
  } = useSelector((state) => state.appointments || {});

  const { services = [], loading: servicesLoading = false } = useSelector(
    (state) => state.services || {},
  );

  const { patients = [], loading: patientsLoading = false } = useSelector(
    (state) => state.patients || {},
  );

  /* =========================
     State
  ========================= */

  const [selectedDate, setSelectedDate] = useState(getToday());

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [serviceFilter, setServiceFilter] = useState("all");

  const [editingAppointment, setEditingAppointment] = useState(null);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  /* =========================
     Load Services + Patients
  ========================= */

  useEffect(() => {
    dispatch(getServices());

    dispatch(
      getPatients({
        page: 1,
        limit: 1000,
        search: "",
      }),
    );
  }, [dispatch]);

  /* =========================
     Load Appointments
  ========================= */

  useEffect(() => {
    dispatch(
      getAppointments({
        view: "week",
        date: selectedDate,
      }),
    );
  }, [dispatch, selectedDate]);

  /* =========================
     Filter
  ========================= */

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName = appointment.patient?.name || "";

      const patientPhone = appointment.patient?.phone || "";

      const patientCode = appointment.patient?.patientCode || "";

      const serviceName = appointment.service?.name || "";

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        patientName.toLowerCase().includes(searchValue) ||
        patientPhone.toLowerCase().includes(searchValue) ||
        patientCode.toLowerCase().includes(searchValue) ||
        serviceName.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      const matchesService =
        serviceFilter === "all" || appointment.service?._id === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [appointments, search, statusFilter, serviceFilter]);

  /* =========================
     Week
  ========================= */

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const getAppointmentsByDay = (date) => {
    return filteredAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);

      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    });
  };

  const handleOpenAppointment = async (appointment) => {
    try {
      setSelectedAppointment(appointment);

      const result = await dispatch(getAppointment(appointment._id)).unwrap();

      setSelectedAppointment(result?.data || result);
    } catch (error) {
      toast.error(error || "فشل تحميل تفاصيل الموعد");
    }
  };

  const handleStatusChange = async (appointment, status) => {
    try {
      setActionLoading(true);

      await dispatch(
        editStatusAppointment({
          id: appointment._id,
          status: "completed",
        }),
      ).unwrap();

      toast.success("تم تغيير حالة الموعد بنجاح");

      const result = await dispatch(getAppointment(appointment._id)).unwrap();

      setSelectedAppointment(result?.data || result);

      await dispatch(
        getAppointments({
          view: "week",
          date: selectedDate,
        }),
      ).unwrap();
    } catch (error) {
      toast.error(error || "فشل تغيير حالة الموعد");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointment) => {
    setDeleteTarget(appointment);
  };

  /* =========================
     Today
  ========================= */

  const goToday = () => {
    setSelectedDate(getToday());
  };

  return (
    <div
      className="p-6 space-y-6 font-cairo bg-[#f8fafc] min-h-screen"
      dir="rtl"
    >
      {/* =====================================================
          Header
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">جدول المواعيد</h1>

          <p className="text-sm text-gray-400 mt-1">
            إدارة وتنظيم مواعيد العيادة
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="
            flex items-center justify-center gap-2
            bg-blue-600 hover:bg-blue-700
            text-white
            px-5 py-3 rounded-2xl
            text-sm font-black
            shadow-lg shadow-blue-100
            transition active:scale-95
          "
        >
          <FiPlus size={18} />
          إضافة موعد
        </button>
      </div>

      {/* =====================================================
          Stats
      ===================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="إجمالي المواعيد"
          value={stats?.total || 0}
          color="blue"
        />

        <StatCard title="انتظار" value={stats?.pending || 0} color="amber" />

        <StatCard
          title="مكتملة"
          value={stats?.completed || 0}
          color="emerald"
        />

        <StatCard title="ملغية" value={stats?.cancelled || 0} color="red" />

        <StatCard
          title="الأرباح"
          value={`${Number(stats?.totalAppointmentsProfit || 0).toLocaleString(
            "ar-EG",
          )} ج`}
          color="purple"
        />
      </div>

      {/* =====================================================
          Filters
      ===================================================== */}

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Search */}

          <div className="relative">
            <FiSearch
              className="
                absolute right-4 top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم المريض أو الهاتف..."
              className="
                w-full
                bg-gray-50
                border border-gray-100
                rounded-2xl
                py-3 pr-11 pl-4
                text-sm
                outline-none
                focus:bg-white
                focus:border-blue-300
                focus:ring-2
                focus:ring-blue-100
                transition
              "
            />
          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              bg-gray-50
              border border-gray-100
              rounded-2xl
              px-4 py-3
              text-sm
              outline-none
              focus:bg-white
              focus:border-blue-300
            "
          >
            <option value="all">كل الحالات</option>

            <option value="pending">انتظار</option>

            <option value="inProgress">جاري</option>

            <option value="completed">مكتملة</option>

            <option value="cancelled">ملغية</option>
          </select>

          {/* Services */}

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="
              bg-gray-50
              border border-gray-100
              rounded-2xl
              px-4 py-3
              text-sm
              outline-none
              focus:bg-white
              focus:border-blue-300
            "
          >
            <option value="all">كل الخدمات</option>

            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>

          {/* Date */}

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="
              bg-gray-50
              border border-gray-100
              rounded-2xl
              px-4 py-3
              text-sm
              outline-none
              focus:bg-white
              focus:border-blue-300
            "
          />
        </div>
      </div>

      {/* =====================================================
          Calendar
      ===================================================== */}

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}

        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-gray-800">الأسبوع المختار</h3>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("ar-EG")}
            </p>
          </div>

          <button
            onClick={goToday}
            className="
              text-sm font-black
              bg-blue-50
              text-blue-600
              px-4 py-2
              rounded-xl
              hover:bg-blue-100
              transition
            "
          >
            اليوم
          </button>
        </div>

        {/* Body */}

        <div className="p-5 space-y-5">
          {weekDates.map((date, index) => {
            const dayAppointments = getAppointmentsByDay(date);

            const isToday = formatLocalDate(date) === getToday();

            return (
              <div
                key={formatLocalDate(date)}
                className={`
                  flex flex-col lg:flex-row
                  gap-5
                  bg-gray-50
                  border
                  rounded-[1.5rem]
                  p-5
                  transition-all
                  ${
                    isToday
                      ? "border-blue-200 bg-blue-50/20"
                      : "border-gray-100"
                  }
                `}
              >
                {/* Day */}

                <div
                  className={`
                    w-full lg:w-32
                    flex-shrink-0
                    rounded-[1.5rem]
                    text-white
                    p-5
                    flex
                    flex-col
                    justify-center
                    items-center
                    ${
                      isToday
                        ? "bg-gradient-to-b from-blue-600 to-cyan-500"
                        : "bg-gradient-to-b from-slate-700 to-slate-600"
                    }
                  `}
                >
                  <p className="text-sm opacity-80 font-bold">
                    {weekDays[index]}
                  </p>

                  <h2 className="text-3xl font-black my-2">{date.getDate()}</h2>

                  <p className="text-xs opacity-80">
                    {date.toLocaleDateString("ar-EG", {
                      month: "long",
                    })}
                  </p>

                  <div className="mt-5 bg-white/20 rounded-xl px-4 py-2 text-sm font-black">
                    {dayAppointments.length} موعد
                  </div>
                </div>

                {/* Appointments */}

                <div className="flex-1 min-w-0">
                  {appointmentsLoading ? (
                    <div className="min-h-[160px] flex items-center justify-center">
                      <Loading />
                    </div>
                  ) : dayAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                      {dayAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment._id}
                          appointment={appointment}
                          onClick={() => handleOpenAppointment(appointment)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      className="
                        h-full
                        min-h-[160px]
                        rounded-2xl
                        border-2
                        border-dashed
                        border-gray-200
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-gray-400
                      "
                    >
                      <FiCalendar size={32} />

                      <p className="mt-3 font-bold">لا توجد مواعيد</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {deleteTarget && (
          <div
            className="
      fixed inset-0
      z-[1000]
      bg-black/40
      backdrop-blur-sm
      flex items-center justify-center
      p-4
      font-cairo
    "
            dir="rtl"
          >
            <div
              className="
      bg-white
      w-full
      max-w-md
      rounded-[2rem]
      shadow-2xl
      overflow-hidden
    "
            >
              <div className="p-6">
                <div
                  className="
          w-12 h-12
          rounded-2xl
          bg-red-50
          text-red-600
          flex
          items-center
          justify-center
          mb-4
        "
                >
                  <FiTrash2 size={21} />
                </div>

                <h3
                  className="
          text-lg
          font-black
          text-gray-800
        "
                >
                  حذف الموعد
                </h3>

                <p
                  className="
          text-sm
          text-gray-400
          mt-2
          leading-6
        "
                >
                  هل أنت متأكد من حذف موعد{" "}
                  <strong className="text-gray-700">
                    {deleteTarget.patient?.name || "المريض"}
                  </strong>
                  ؟
                </p>
              </div>

              <div
                className="
        p-5
        border-t
        border-gray-100
        flex
        gap-3
      "
              >
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="
            flex-1
            bg-gray-100
            text-gray-600
            py-3
            rounded-xl
            text-xs
            font-black
          "
                >
                  إلغاء
                </button>

                <button
                  onClick={async () => {
                    try {
                      setActionLoading(true);

                      await dispatch(
                        deleteAppointment(deleteTarget._id),
                      ).unwrap();

                      toast.success("تم حذف الموعد بنجاح");

                      setDeleteTarget(null);
                      setSelectedAppointment(null);

                      await dispatch(
                        getAppointments({
                          view: "week",
                          date: selectedDate,
                        }),
                      ).unwrap();
                    } catch (error) {
                      toast.error(error || "فشل حذف الموعد");
                    } finally {
                      setActionLoading(false);
                    }
                  }}
                  disabled={actionLoading}
                  className="
            flex-1
            bg-red-600
            hover:bg-red-700
            text-white
            py-3
            rounded-xl
            text-xs
            font-black
            disabled:opacity-50
          "
                >
                  {actionLoading ? "جاري الحذف..." : "حذف الموعد"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          Details Drawer
      ===================================================== */}

      {selectedAppointment && (
        <AppointmentDrawer
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onEdit={(appointment) => {
            setEditingAppointment(appointment);
          }}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteAppointment}
          loading={actionLoading}
        />
      )}

      {/* =====================================================
          Add Appointment
      ===================================================== */}

      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        patients={patients}
        services={services}
        loading={patientsLoading || servicesLoading}
        defaultDate={selectedDate}
      />
    </div>
  );
}

/* =====================================================
   Add Appointment Modal
===================================================== */

function AddAppointmentModal({
  isOpen,
  onClose,
  patients,
  services,
  loading,
  defaultDate,
}) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    patient: "",
    service: "",
    date: defaultDate,
    startTime: "",
    endTime: "",
    doctorNote: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      patient: "",
      service: "",
      date: defaultDate,
      startTime: "",
      endTime: "",
      doctorNote: "",
    });
  }, [isOpen, defaultDate]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.patient) {
      toast.error("من فضلك اختر المريض");
      return;
    }

    if (!form.service) {
      toast.error("من فضلك اختر الخدمة");
      return;
    }

    if (!form.date) {
      toast.error("من فضلك اختر التاريخ");
      return;
    }

    if (!form.startTime) {
      toast.error("من فضلك اختر وقت البداية");
      return;
    }

    if (!form.endTime) {
      toast.error("من فضلك اختر وقت النهاية");
      return;
    }

    if (form.endTime <= form.startTime) {
      toast.error("وقت النهاية يجب أن يكون بعد وقت البداية");
      return;
    }

    try {
      await dispatch(
        addAppointment({
          patient: form.patient,
          service: form.service,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          doctorNote: form.doctorNote.trim(),
        }),
      ).unwrap();

      toast.success("تم إضافة الموعد بنجاح");

      onClose();

      // إعادة تحميل الأسبوع
      dispatch(
        getAppointments({
          view: "week",
          date: form.date,
        }),
      );
    } catch (error) {
      toast.error(error || "فشل إضافة الموعد");
    }
  };

  return (
    <div
      className="
        fixed inset-0
        z-[999]
        flex items-center justify-center
        p-4
        font-cairo
      "
      dir="rtl"
    >
      {/* Overlay */}

      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-slate-900/40
          backdrop-blur-sm
        "
      />

      {/* Modal */}

      <div
        className="
          relative
          w-full
          max-w-lg
          bg-white
          rounded-[2rem]
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Header */}

        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-800">
              إضافة موعد جديد
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              اختر المريض والخدمة وبيانات الموعد
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-xl
              bg-gray-100
              text-gray-400
              hover:bg-red-50
              hover:text-red-600
              transition
            "
          >
            <FiX className="mx-auto" />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Patient */}

          <FormField label="المريض" icon={<FiUser />}>
            <select
              name="patient"
              value={form.patient}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="">اختر المريض</option>

              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                  {patient.patientCode ? ` - ${patient.patientCode}` : ""}
                </option>
              ))}
            </select>
          </FormField>

          {/* Service */}

          <FormField label="الخدمة" icon={<FiActivity />}>
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="">اختر الخدمة</option>

              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} -{" "}
                  {Number(service.price || 0).toLocaleString("ar-EG")} ج
                </option>
              ))}
            </select>
          </FormField>

          {/* Date */}

          <FormField label="التاريخ" icon={<FiCalendar />}>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="form-input"
            />
          </FormField>

          {/* Time */}

          <div className="grid grid-cols-2 gap-4">
            <FormField label="من" icon={<FiClock />}>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="form-input"
              />
            </FormField>

            <FormField label="إلى" icon={<FiClock />}>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="form-input"
              />
            </FormField>
          </div>

          {/* Doctor Note */}

          <FormField label="ملاحظات الطبيب" icon={<FiEdit3 />}>
            <textarea
              name="doctorNote"
              value={form.doctorNote}
              onChange={handleChange}
              rows={3}
              placeholder="ملاحظات خاصة بالموعد..."
              className="form-input resize-none"
            />
          </FormField>

          {/* Selected service preview */}

          {form.service && (
            <SelectedService
              service={services.find((item) => item._id === form.service)}
            />
          )}

          {/* Buttons */}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="
                flex-[2]
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-3.5
                rounded-xl
                text-sm
                font-black
                transition
                shadow-lg
                shadow-blue-100
                active:scale-95
              "
            >
              إضافة الموعد
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                bg-gray-100
                text-gray-600
                py-3.5
                rounded-xl
                text-sm
                font-bold
                hover:bg-gray-200
                transition
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

/* =====================================================
   Appointment Drawer
===================================================== */

function AppointmentDrawer({
  appointment,
  onClose,
  onEdit,
  onStatusChange,
  onDelete,
  loading,
}) {
  const [openSections, setOpenSections] = useState({
    patient: true,
    appointment: true,
    service: true,
    financial: true,
    medical: true,
    dental: true,
    procedures: true,
    notes: true,
  });

  if (!appointment) return null;

  const procedures = appointment.record?.procedures || [];

  const dentalChart = appointment.record?.dentalChart || [];

  const medicalHistory = appointment.record?.medicalHistory || {};

  const totalProcedures = procedures.reduce(
    (sum, item) => sum + Number(item.totalCost || 0),
    0,
  );

  const totalPaid = procedures.reduce(
    (sum, item) => sum + Number(item.paid || 0),
    0,
  );

  const totalRemaining = totalProcedures - totalPaid;

  const bookingPrice = Number(appointment.bookingPrice || 0);

  const extraPaid = Number(appointment.extraPaid || 0);

  const servicePrice = Number(appointment.service?.price || 0);

  const totalCollected = totalPaid + bookingPrice + extraPaid;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* =================================================
          BACKDROP
      ================================================= */}

      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-slate-950/50
          backdrop-blur-sm
          z-[60]
          animate-in fade-in
          duration-200
        "
      />

      {/* =================================================
          DRAWER
      ================================================= */}

      <aside
        className="
          fixed
          top-0
          right-0
          h-screen
          w-full
          lg:w-[680px]
          xl:w-[760px]
          bg-[#f8fafc]
          z-[70]
          shadow-2xl
          overflow-hidden
          flex
          flex-col
          animate-in
          slide-in-from-right
          duration-300
          font-cairo
        "
        dir="rtl"
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative bg-white border-b border-gray-100 shrink-0">
          {/* Top */}

          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* Avatar */}

                <div
                  className="
                  w-14 h-14
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-600
                  to-cyan-500
                  text-white
                  flex items-center
                  justify-center
                  text-xl
                  font-black
                  shadow-lg
                  shadow-blue-100
                  shrink-0
                "
                >
                  {appointment.patient?.name?.charAt(0) || "م"}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      className="
                      text-lg
                      font-black
                      text-gray-900
                      truncate
                    "
                    >
                      {appointment.patient?.name || "مريض غير محدد"}
                    </h2>

                    <StatusBadge status={appointment.status} />
                  </div>

                  <div
                    className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                    mt-2
                    text-xs
                    text-gray-400
                  "
                  >
                    <span>
                      {appointment.patient?.patientCode || "بدون كود"}
                    </span>

                    {appointment.patient?.phone && (
                      <>
                        <span className="text-gray-200">•</span>

                        <span dir="ltr">{appointment.patient.phone}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="
                  w-10 h-10
                  rounded-xl
                  bg-gray-100
                  text-gray-400
                  hover:bg-red-50
                  hover:text-red-600
                  transition
                  shrink-0
                "
              >
                <FiX className="mx-auto" />
              </button>
            </div>

            {/* Quick appointment info */}

            <div
              className="
              grid
              grid-cols-3
              gap-3
              mt-5
            "
            >
              <QuickInfo
                icon={<FiCalendar />}
                label="التاريخ"
                value={new Date(appointment.date).toLocaleDateString("ar-EG")}
              />

              <QuickInfo
                icon={<FiClock />}
                label="الوقت"
                value={`${appointment.startTime || "--"} - ${
                  appointment.endTime || "--"
                }`}
              />

              <QuickInfo
                icon={<FiActivity />}
                label="الخدمة"
                value={appointment.service?.name || "-"}
              />
            </div>
          </div>

          {/* Status bar */}

          <div className="px-6 pb-5">
            <StatusActions
              appointment={appointment}
              onStatusChange={onStatusChange}
              loading={loading}
            />
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
          flex-1
          overflow-y-auto
          p-5
          space-y-4
        "
        >
          {/* Patient */}

          <DrawerSection
            title="بيانات المريض"
            icon={<FiUser />}
            open={openSections.patient}
            onToggle={() => toggleSection("patient")}
          >
            <div
              className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
            >
              <DetailBox
                label="اسم المريض"
                value={appointment.patient?.name || "غير محدد"}
              />

              <DetailBox
                label="كود المريض"
                value={appointment.patient?.patientCode || "-"}
              />

              <DetailBox
                label="رقم الهاتف"
                value={appointment.patient?.phone || "-"}
                ltr
              />

              <DetailBox
                label="النوع"
                value={
                  appointment.patient?.gender === "male"
                    ? "ذكر"
                    : appointment.patient?.gender === "female"
                      ? "أنثى"
                      : "-"
                }
              />

              <DetailBox
                label="تاريخ الميلاد"
                value={
                  appointment.patient?.dateOfBirth
                    ? new Date(
                        appointment.patient.dateOfBirth,
                      ).toLocaleDateString("ar-EG")
                    : "-"
                }
              />
            </div>
          </DrawerSection>

          {/* Appointment */}

          <DrawerSection
            title="بيانات الموعد"
            icon={<FiCalendar />}
            open={openSections.appointment}
            onToggle={() => toggleSection("appointment")}
          >
            <div
              className="
              grid
              grid-cols-2
              gap-3
            "
            >
              <DetailBox
                label="التاريخ"
                value={new Date(appointment.date).toLocaleDateString("ar-EG")}
              />

              <DetailBox
                label="الحالة"
                value={getStatusLabel(appointment.status)}
              />

              <DetailBox label="من" value={appointment.startTime || "-"} />

              <DetailBox label="إلى" value={appointment.endTime || "-"} />

              <DetailBox
                label="تم الإنشاء بواسطة"
                value={appointment.createdBy?.name || "-"}
              />

              <DetailBox
                label="تاريخ الإنشاء"
                value={
                  appointment.createdAt
                    ? new Date(appointment.createdAt).toLocaleDateString(
                        "ar-EG",
                      )
                    : "-"
                }
              />
            </div>
          </DrawerSection>

          {/* Service */}

          <DrawerSection
            title="الخدمة"
            icon={<FiActivity />}
            open={openSections.service}
            onToggle={() => toggleSection("service")}
          >
            <div
              className="
              bg-gradient-to-l
              from-blue-50
              to-cyan-50
              border
              border-blue-100
              rounded-2xl
              p-4
            "
            >
              <div
                className="
                flex
                items-center
                justify-between
                gap-4
              "
              >
                <div>
                  <p
                    className="
                    text-[10px]
                    font-bold
                    text-blue-400
                  "
                  >
                    الخدمة
                  </p>

                  <h3
                    className="
                    text-base
                    font-black
                    text-blue-900
                    mt-1
                  "
                  >
                    {appointment.service?.name || "غير محددة"}
                  </h3>

                  <span
                    className="
                    inline-flex
                    mt-2
                    px-2.5
                    py-1
                    rounded-lg
                    bg-white
                    text-[10px]
                    font-black
                    text-blue-600
                  "
                  >
                    {appointment.service?.category || "-"}
                  </span>
                </div>

                <div className="text-left">
                  <p
                    className="
                    text-[10px]
                    text-blue-400
                  "
                  >
                    سعر الخدمة
                  </p>

                  <p
                    className="
                    text-xl
                    font-black
                    text-blue-800
                    mt-1
                  "
                  >
                    {servicePrice.toLocaleString("ar-EG")}{" "}
                    <span className="text-xs">ج</span>
                  </p>
                </div>
              </div>
            </div>
          </DrawerSection>

          {/* Financial */}

          <DrawerSection
            title="الحسابات المالية"
            icon={<FiDollarSign />}
            open={openSections.financial}
            onToggle={() => toggleSection("financial")}
          >
            <div
              className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-3
            "
            >
              <MoneyBox label="سعر الخدمة" value={servicePrice} />

              <MoneyBox label="سعر الحجز" value={bookingPrice} />

              <MoneyBox label="الإضافي" value={extraPaid} />

              <MoneyBox label="مدفوع الإجراءات" value={totalPaid} />
            </div>

            <div
              className="
              mt-4
              grid
              grid-cols-2
              gap-3
            "
            >
              <div
                className="
                rounded-2xl
                bg-emerald-50
                border
                border-emerald-100
                p-4
              "
              >
                <p
                  className="
                  text-[10px]
                  text-emerald-500
                  font-bold
                "
                >
                  إجمالي المحصل
                </p>

                <p
                  className="
                  text-xl
                  font-black
                  text-emerald-700
                  mt-1
                "
                >
                  {totalCollected.toLocaleString("ar-EG")} ج
                </p>
              </div>

              <div
                className="
                rounded-2xl
                bg-red-50
                border
                border-red-100
                p-4
              "
              >
                <p
                  className="
                  text-[10px]
                  text-red-500
                  font-bold
                "
                >
                  متبقي الإجراءات
                </p>

                <p
                  className="
                  text-xl
                  font-black
                  text-red-700
                  mt-1
                "
                >
                  {totalRemaining.toLocaleString("ar-EG")} ج
                </p>
              </div>
            </div>
          </DrawerSection>

          {/* Medical History */}

          <DrawerSection
            title="التاريخ المرضي"
            icon={<FiFileText />}
            open={openSections.medical}
            onToggle={() => toggleSection("medical")}
          >
            <div
              className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
            >
              <MedicalFlag
                label="أمراض مزمنة"
                active={medicalHistory.hasChronicDisease}
              />

              <MedicalFlag
                label="يتناول أدوية"
                active={medicalHistory.isTakingMedication}
              />
            </div>

            {medicalHistory.hasChronicDisease &&
              medicalHistory.chronicDiseases?.length > 0 && (
                <div className="mt-4">
                  <p
                    className="
                    text-[10px]
                    font-black
                    text-gray-400
                    mb-2
                  "
                  >
                    الأمراض المزمنة
                  </p>

                  <div
                    className="
                    flex
                    flex-wrap
                    gap-2
                  "
                  >
                    {medicalHistory.chronicDiseases.map((disease, index) => (
                      <span
                        key={index}
                        className="
                            px-3 py-1.5
                            rounded-xl
                            bg-red-50
                            text-red-600
                            text-xs
                            font-bold
                          "
                      >
                        {disease}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {medicalHistory.isTakingMedication &&
              medicalHistory.medications && (
                <div className="mt-4">
                  <p
                    className="
                    text-[10px]
                    font-black
                    text-gray-400
                    mb-2
                  "
                  >
                    الأدوية
                  </p>

                  <div
                    className="
                    bg-gray-50
                    rounded-xl
                    p-3
                    text-sm
                    text-gray-700
                  "
                  >
                    {medicalHistory.medications}
                  </div>
                </div>
              )}
          </DrawerSection>

          {/* Dental Chart */}

          <DrawerSection
            title={`مخطط الأسنان (${dentalChart.length})`}
            icon={<FiActivity />}
            open={openSections.dental}
            onToggle={() => toggleSection("dental")}
          >
            {dentalChart.length > 0 ? (
              <div
                className="
                overflow-x-auto
                rounded-2xl
                border
                border-gray-100
              "
              >
                <table className="w-full text-right min-w-[500px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400">
                        السن
                      </th>

                      <th className="px-4 py-3 text-[10px] font-black text-gray-400">
                        الشكوى
                      </th>

                      <th className="px-4 py-3 text-[10px] font-black text-gray-400">
                        التكلفة
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {dentalChart.map((tooth, index) => (
                      <tr key={tooth._id || index}>
                        <td
                          className="
                            px-4 py-3
                            text-sm
                            font-black
                            text-blue-600
                          "
                        >
                          {tooth.toothNumber}
                        </td>

                        <td
                          className="
                            px-4 py-3
                            text-xs
                            text-gray-700
                          "
                        >
                          {tooth.complain || "-"}
                        </td>

                        <td
                          className="
                            px-4 py-3
                            text-xs
                            font-black
                          "
                        >
                          {Number(tooth.cost || 0).toLocaleString("ar-EG")} ج
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptySection text="لا توجد بيانات في مخطط الأسنان" />
            )}
          </DrawerSection>

          {/* Procedures */}

          <DrawerSection
            title={`الإجراءات العلاجية (${procedures.length})`}
            icon={<FiActivity />}
            open={openSections.procedures}
            onToggle={() => toggleSection("procedures")}
          >
            {procedures.length > 0 ? (
              <div className="space-y-3">
                {procedures.map((procedure, index) => {
                  const cost = Number(procedure.totalCost || 0);

                  const paid = Number(procedure.paid || 0);

                  const remaining = cost - paid;

                  return (
                    <div
                      key={procedure._id || index}
                      className="
                          bg-gray-50
                          border
                          border-gray-100
                          rounded-2xl
                          p-4
                        "
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <p
                            className="
                              text-sm
                              font-black
                              text-gray-800
                            "
                          >
                            {procedure.procedure}
                          </p>

                          <p
                            className="
                              text-[10px]
                              text-gray-400
                              mt-1
                            "
                          >
                            {procedure.date
                              ? new Date(procedure.date).toLocaleDateString(
                                  "ar-EG",
                                )
                              : "-"}
                          </p>
                        </div>

                        <span
                          className="
                            px-2.5
                            py-1
                            rounded-lg
                            bg-white
                            text-[10px]
                            font-black
                            text-gray-500
                          "
                        >
                          إجراء #{index + 1}
                        </span>
                      </div>

                      <div
                        className="
                          grid
                          grid-cols-3
                          gap-2
                          mt-4
                        "
                      >
                        <ProcedureMoney label="التكلفة" value={cost} />

                        <ProcedureMoney label="المدفوع" value={paid} />

                        <ProcedureMoney
                          label="المتبقي"
                          value={remaining}
                          danger={remaining > 0}
                        />
                      </div>

                      {/* Progress */}

                      <div className="mt-4">
                        <div
                          className="
                            flex
                            justify-between
                            text-[9px]
                            text-gray-400
                            mb-1
                          "
                        >
                          <span>نسبة السداد</span>

                          <span>
                            {cost > 0
                              ? Math.min(100, Math.round((paid / cost) * 100))
                              : 0}
                            %
                          </span>
                        </div>

                        <div
                          className="
                            h-1.5
                            bg-gray-200
                            rounded-full
                            overflow-hidden
                          "
                        >
                          <div
                            className="
                                h-full
                                bg-emerald-500
                                rounded-full
                              "
                            style={{
                              width: `${
                                cost > 0
                                  ? Math.min(100, (paid / cost) * 100)
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptySection text="لا توجد إجراءات علاجية لهذا الموعد" />
            )}
          </DrawerSection>

          {/* Notes */}

          <DrawerSection
            title="ملاحظات الطبيب"
            icon={<FiFileText />}
            open={openSections.notes}
            onToggle={() => toggleSection("notes")}
          >
            <div
              className="
              bg-amber-50
              border
              border-amber-100
              rounded-2xl
              p-4
            "
            >
              <p
                className="
                text-sm
                leading-7
                text-gray-700
              "
              >
                {appointment.doctorNote || "لا توجد ملاحظات مسجلة لهذا الموعد."}
              </p>
            </div>
          </DrawerSection>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
          shrink-0
          bg-white
          border-t
          border-gray-100
          p-4
        "
        >
          <div
            className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-2
          "
          >
            <button
              onClick={() => onEdit(appointment)}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-3
                rounded-xl
                text-xs
                font-black
                transition
              "
            >
              <FiEdit3 />
              تعديل
            </button>

            {appointment.status === "pending" && (
              <button
                onClick={() => onStatusChange(appointment, "inProgress")}
                disabled={loading}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-amber-500
                  hover:bg-amber-600
                  text-white
                  py-3
                  rounded-xl
                  text-xs
                  font-black
                  transition
                  disabled:opacity-50
                "
              >
                <FiPlay />
                بدء الجلسة
              </button>
            )}

            {appointment.status === "inProgress" && (
              <button
                onClick={() => onStatusChange(appointment, "completed")}
                disabled={loading}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  py-3
                  rounded-xl
                  text-xs
                  font-black
                  transition
                  disabled:opacity-50
                "
              >
                <FiCheckCircle />
                إنهاء الجلسة
              </button>
            )}

            {appointment.status !== "completed" &&
              appointment.status !== "cancelled" && (
                <button
                  onClick={() => onStatusChange(appointment, "cancelled")}
                  disabled={loading}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-red-50
                    hover:bg-red-100
                    text-red-600
                    py-3
                    rounded-xl
                    text-xs
                    font-black
                    transition
                  "
                >
                  <FiX />
                  إلغاء
                </button>
              )}

            <button
              onClick={() => onDelete(appointment)}
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-gray-100
                hover:bg-red-50
                text-gray-500
                hover:text-red-600
                py-3
                rounded-xl
                text-xs
                font-black
                transition
              "
            >
              <FiTrash2 />
              حذف
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =====================================================
   Appointment Card
===================================================== */

function DrawerSection({ title, icon, open, onToggle, children }) {
  return (
    <section
      className="
      bg-white
      border
      border-gray-100
      rounded-2xl
      overflow-hidden
      shadow-sm
    "
    >
      <button
        onClick={onToggle}
        className="
          w-full
          flex
          items-center
          justify-between
          px-5
          py-4
          hover:bg-gray-50
          transition
        "
      >
        <div
          className="
          flex
          items-center
          gap-3
        "
        >
          <span
            className="
            w-9 h-9
            rounded-xl
            bg-blue-50
            text-blue-600
            flex
            items-center
            justify-center
          "
          >
            {icon}
          </span>

          <span
            className="
            text-sm
            font-black
            text-gray-800
          "
          >
            {title}
          </span>
        </div>

        {open ? (
          <FiChevronUp className="text-gray-400" />
        ) : (
          <FiChevronDown className="text-gray-400" />
        )}
      </button>

      {open && (
        <div
          className="
          px-5
          pb-5
          border-t
          border-gray-50
          pt-4
        "
        >
          {children}
        </div>
      )}
    </section>
  );
}

function QuickInfo({ icon, label, value }) {
  return (
    <div
      className="
      bg-gray-50
      border
      border-gray-100
      rounded-xl
      px-3
      py-3
      min-w-0
    "
    >
      <div
        className="
        flex
        items-center
        gap-2
        text-gray-400
      "
      >
        {icon}

        <span className="text-[9px] font-bold">{label}</span>
      </div>

      <p
        className="
        text-[11px]
        font-black
        text-gray-800
        mt-1
        truncate
      "
      >
        {value}
      </p>
    </div>
  );
}

function DetailBox({ label, value, ltr = false }) {
  return (
    <div
      className="
      bg-gray-50
      rounded-xl
      px-4
      py-3
    "
    >
      <p
        className="
        text-[9px]
        text-gray-400
        font-bold
      "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          font-black
          text-gray-800
          mt-1
        "
        dir={ltr ? "ltr" : "rtl"}
      >
        {value || "-"}
      </p>
    </div>
  );
}

function MoneyBox({ label, value }) {
  return (
    <div
      className="
      bg-gray-50
      border
      border-gray-100
      rounded-xl
      p-3
    "
    >
      <p
        className="
        text-[9px]
        text-gray-400
        font-bold
      "
      >
        {label}
      </p>

      <p
        className="
        text-sm
        font-black
        text-gray-800
        mt-1
      "
      >
        {Number(value || 0).toLocaleString("ar-EG")}{" "}
        <span className="text-[9px]">ج</span>
      </p>
    </div>
  );
}

function ProcedureMoney({ label, value, danger = false }) {
  return (
    <div
      className="
      bg-white
      rounded-xl
      border
      border-gray-100
      p-2
      text-center
    "
    >
      <p
        className="
        text-[9px]
        text-gray-400
      "
      >
        {label}
      </p>

      <p
        className={`
          text-xs
          font-black
          mt-1
          ${danger ? "text-red-600" : "text-gray-800"}
        `}
      >
        {Number(value || 0).toLocaleString("ar-EG")} ج
      </p>
    </div>
  );
}

function MedicalFlag({ label, active }) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        rounded-xl
        px-4
        py-3
        border
        ${
          active
            ? "bg-red-50 border-red-100"
            : "bg-emerald-50 border-emerald-100"
        }
      `}
    >
      <span className="text-xs font-bold text-gray-700">{label}</span>

      <span
        className={`
          text-[10px]
          font-black
          px-2.5
          py-1
          rounded-lg
          ${
            active
              ? "bg-red-100 text-red-600"
              : "bg-emerald-100 text-emerald-600"
          }
        `}
      >
        {active ? "نعم" : "لا"}
      </span>
    </div>
  );
}

function EmptySection({ text }) {
  return (
    <div
      className="
      py-8
      text-center
      text-gray-400
      text-xs
      bg-gray-50
      rounded-xl
    "
    >
      <FiFileText size={25} className="mx-auto mb-2 opacity-50" />

      {text}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "انتظار",
      className: "bg-amber-50 text-amber-600",
    },

    inProgress: {
      label: "جاري",
      className: "bg-blue-50 text-blue-600",
    },

    completed: {
      label: "مكتمل",
      className: "bg-emerald-50 text-emerald-600",
    },

    cancelled: {
      label: "ملغي",
      className: "bg-red-50 text-red-600",
    },
  };

  const item = config[status] || {
    label: status || "غير محدد",
    className: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        px-3
        py-1.5
        rounded-lg
        text-[10px]
        font-black
        ${item.className}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />

      {item.label}
    </span>
  );
}

function StatusActions({ appointment, onStatusChange, loading }) {
  return (
    <div
      className="
      flex
      flex-wrap
      items-center
      gap-2
    "
    >
      {appointment.status === "pending" && (
        <button
          onClick={() => onStatusChange(appointment, "inProgress")}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            bg-amber-50
            text-amber-600
            text-[10px]
            font-black
            hover:bg-amber-100
            transition
          "
        >
          <FiPlay />
          بدء الجلسة
        </button>
      )}

      {appointment.status === "inProgress" && (
        <button
          onClick={() => onStatusChange(appointment, "completed")}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            bg-emerald-50
            text-emerald-600
            text-[10px]
            font-black
            hover:bg-emerald-100
            transition
          "
        >
          <FiCheckCircle />
          إنهاء الجلسة
        </button>
      )}

      {appointment.status !== "completed" &&
        appointment.status !== "cancelled" && (
          <button
            onClick={() => onStatusChange(appointment, "cancelled")}
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              bg-red-50
              text-red-600
              text-[10px]
              font-black
              hover:bg-red-100
              transition
            "
          >
            <FiX />
            إلغاء الموعد
          </button>
        )}
    </div>
  );
}

function AppointmentCard({ appointment, onClick }) {
  const statusConfig = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      label: "انتظار",
    },

    inProgress: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "جاري",
    },

    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      label: "مكتمل",
    },

    cancelled: {
      bg: "bg-red-50",
      text: "text-red-600",
      label: "ملغي",
    },
  };

  const config = statusConfig[appointment.status] || statusConfig.pending;

  return (
    <div
      onClick={onClick}
      className="
        bg-white
        rounded-[1.5rem]
        border border-gray-200
        p-4
        cursor-pointer
        hover:border-blue-300
        hover:shadow-lg
        transition-all
      "
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-[15px] text-gray-800 truncate">
          {appointment.patient?.name || "مريض غير محدد"}
        </h3>

        <span
          className={`
            shrink-0
            px-3 py-1
            rounded-full
            text-xs
            font-black
            ${config.bg}
            ${config.text}
          `}
        >
          {config.label}
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-1 truncate">
        {appointment.service?.name || "خدمة غير محددة"}
      </p>

      <div className="flex items-center justify-between mt-4 gap-3">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-400">الوقت</p>

          <p className="font-black text-sm">
            {appointment.startTime || "--:--"}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-blue-500">السعر</p>

          <p className="font-black text-sm text-blue-700">
            {Number(appointment.service?.price || 0).toLocaleString("ar-EG")} ج
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>{appointment.patient?.patientCode || "بدون كود"}</span>

        <span>{appointment.service?.category || "بدون تصنيف"}</span>
      </div>
    </div>
  );
}

/* =====================================================
   Components
===================================================== */

function StatCard({ title, value, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}
      >
        <FiCalendar />
      </div>

      <p className="text-xs text-gray-400 font-black mt-4">{title}</p>

      <h3 className="text-2xl font-black text-gray-800 mt-2">{value}</h3>
    </div>
  );
}

function FormField({ label, icon, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-gray-500">{label}</label>

      <div className="relative">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}

function SelectedService({ service }) {
  if (!service) return null;

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-500 font-bold">الخدمة المختارة</p>

          <p className="text-sm font-black text-blue-800 mt-1">
            {service.name}
          </p>
        </div>

        <div className="text-left">
          <p className="text-[10px] text-blue-400">السعر</p>

          <p className="font-black text-blue-700">
            {Number(service.price || 0).toLocaleString("ar-EG")} ج
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, icon }) {
  return (
    <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>

      {title}
    </h3>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-xs font-black text-gray-400">{label}</span>

      <span className="text-sm font-bold text-gray-800 text-left">
        {value || "-"}
      </span>
    </div>
  );
}

function MoneyItem({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-2 text-center">
      <p className="text-[9px] text-gray-400">{label}</p>

      <p className="text-xs font-black text-gray-800 mt-1">
        {Number(value || 0).toLocaleString("ar-EG")} ج
      </p>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col items-center gap-3 text-gray-400">
      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

      <span className="text-xs font-bold">جاري التحميل...</span>
    </div>
  );
}

function getStatusLabel(status) {
  const labels = {
    pending: "انتظار",
    inProgress: "جاري",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  return labels[status] || status || "-";
}

export default Appointments;
