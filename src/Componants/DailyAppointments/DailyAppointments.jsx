import React, { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiClock,
  FiUser,
  FiPhone,
  FiCalendar,
  FiSearch,
  FiChevronLeft,
  FiDollarSign,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  addDailyAppointment,
  getDailyAppointments,
} from "../../redux/DailyAppointmentsSlice/DailyAppointmentsSlice";
import DailyAppointmentsTable from "./DailyAppointmentsTable";
import { getPatients } from "../../redux/PatientsSclice/PatientsSclice";

function DailyAppointments() {
  const dispatch = useDispatch();

  const { appointments, loading } = useSelector(
    (state) => state.dailyAppointments,
  );

  const {
    patients,
    isFetched,
    loading: patientsLoading,
    error,
  } = useSelector((state) => state.patients);

  const [searchTerm, setSearchTerm] = useState("");
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (!isFetched) {
      dispatch(getPatients());
    }
  }, [dispatch, isFetched]);

  // ====================== STATES ======================

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bookingTime: "",
    bookingPrice: "",
    address: "",
    age: "",
  });

  // ====================== TODAY DATE ======================

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = selectedDate;

  // ====================== GET DATA ======================

  useEffect(() => {
    dispatch(getDailyAppointments(selectedDate));
  }, [dispatch, selectedDate]);

  // ====================== FILTER TODAY ======================

  const todayAppointments = useMemo(() => {
    return appointments || [];
  }, [appointments]);

  // ====================== HANDLE CHANGE ======================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (name === "name") {
      if (!value.trim()) {
        setPatientSuggestions([]);
        return;
      }

      const matches = patients.filter((patient) =>
        patient.name.toLowerCase().includes(value.toLowerCase()),
      );

      setPatientSuggestions(matches);
    }
  };

  // ====================== calculat eAge ======================

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // ====================== handle Patient Select ======================

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);

    setForm({
      ...form,
      name: patient.name,
      phone: patient.phone,
      address: patient.address,
      age: calculateAge(patient.dateOfBirth),
    });

    setPatientSuggestions([]);
  };

  // ====================== HANDLE SUBMIT ======================

  const handleSubmit = (e) => {
    e.preventDefault();

    const appointmentData = {
      name: form.name,
      phone: form.phone,
      age: Number(form.age),
      address: form.address,
      bookingPrice: Number(form.bookingPrice),
      bookingTime: new Date(`${today}T${form.bookingTime}`).toISOString(),
      date: today,

      record: {
        medicalHistory: {
          hasChronicDisease: false,
          chronicDiseases: [],
          isTakingMedication: false,
          medications: "",
        },

        dentalChart: [],

        procedures: [],
      },
    };

    dispatch(addDailyAppointment(appointmentData));

    setForm({
      name: "",
      phone: "",
      bookingTime: "",
      address: "",
      age: "",
    });

    setShowForm(false);
  };

  return (
    <div
      className="p-6 space-y-6 font-cairo bg-[#f8fafc] min-h-screen text-right"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">
            الحجوزات اليومية
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            إدارة وعرض حجوزات اليوم داخل العيادة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="
          flex items-center gap-2
          bg-white border border-gray-200
          px-5 py-3 rounded-2xl
          text-sm font-bold text-gray-700
          hover:border-blue-200 hover:bg-blue-50/40
          transition-all
        "
            >
              <FiCalendar size={18} />

              {selectedDate === today ? "حجوزات اليوم" : selectedDate}
            </button>

            {showDatePicker && (
              <div
                className="
              absolute top-full mt-2 right-0
              bg-white border border-gray-100
              shadow-xl rounded-2xl p-4 z-50
            "
              >
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setShowDatePicker(false);
                  }}
                  className="
      w-56
      bg-[#f8fafc]
      border border-gray-200
      rounded-2xl
      px-4 py-3
      text-sm font-bold text-gray-700
      outline-none
      focus:ring-4 focus:ring-blue-500/10
      focus:border-blue-500
      transition-all
    "
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="
              flex items-center gap-2
              bg-blue-600 hover:bg-blue-700
              text-white
              px-5 py-3 rounded-2xl
              text-sm font-black
              shadow-lg shadow-blue-100
              transition-all active:scale-95
            "
          >
            <FiPlus size={18} />
            إضافة حجز جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-black text-gray-400 mb-2">
            إجمالي حجوزات اليوم
          </p>

          <h3 className="text-3xl font-black text-blue-600">
            {todayAppointments.length}
          </h3>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-black text-gray-400 mb-2">
            المواعيد المكتملة
          </p>

          <h3 className="text-3xl font-black text-emerald-600">
            {todayAppointments.filter((a) => a.status === "completed").length}
          </h3>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-black text-gray-400 mb-2">بالانتظار</p>

          <h3 className="text-3xl font-black text-amber-500">
            {todayAppointments.filter((a) => a.status === "pending").length}
          </h3>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-800">
                إضافة حجز جديد
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                أدخل بيانات المريض والحجز
              </p>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="
                w-10 h-10 rounded-xl
                bg-gray-100 text-gray-400
                hover:bg-red-50 hover:text-red-500
                transition-all
              "
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="space-y-2 relative">
              <label className="text-xs font-black text-gray-400 mr-1">
                اسم المريض
              </label>

              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <FiUser />
                </div>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ابحث باسم المريض"
                  className="
        w-full bg-gray-50 border border-gray-100
        rounded-2xl py-4 pr-11 pl-4
        text-sm font-bold text-gray-700
        outline-none transition-all
        focus:border-blue-500
        focus:bg-white
        focus:ring-4 focus:ring-blue-500/5
      "
                />

                {patientSuggestions.length > 0 && (
                  <div
                    className="
          absolute top-full mt-2 left-0 right-0
          bg-white
          border border-gray-100
          rounded-2xl
          shadow-xl
          overflow-hidden
          z-50
        "
                  >
                    {patientSuggestions.map((patient) => (
                      <button
                        key={patient._id}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className="
              w-full text-right
              px-4 py-3
              hover:bg-blue-50
              border-b border-gray-50
            "
                      >
                        <p className="font-black text-gray-800">
                          {patient.name}
                        </p>

                        <p className="text-xs text-gray-400">{patient.phone}</p>

                        <p className="text-[10px] text-blue-500 font-black mt-1">
                          {patient.patientCode}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Input
              label="رقم الهاتف"
              icon={<FiPhone />}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="01xxxxxxxxx"
            />

            <Input
              label="العمر"
              icon={<FiUser />}
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="23"
            />

            <Input
              label="العنوان"
              icon={<FiSearch />}
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="عنوان المريض"
            />

            <Input
              label="سعر الحجز"
              icon={<FiDollarSign />}
              name="bookingPrice"
              type="number"
              value={form.bookingPrice}
              onChange={handleChange}
              placeholder="100"
            />

            <Input
              label="وقت الحجز"
              icon={<FiClock />}
              type="time"
              name="bookingTime"
              value={form.bookingTime}
              onChange={handleChange}
            />

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="
                                      bg-blue-600 hover:bg-blue-700
                                      text-white
                                      px-8 py-3 rounded-2xl
                                      text-sm font-black
                                    "
              >
                حفظ الحجز
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <DailyAppointmentsTable />
    </div>
  );
}

/* Reusable Input */
function Input({ label, icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 mr-1">{label}</label>

      <div className="relative group">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>

        <input
          {...props}
          required
          className="
            w-full bg-gray-50 border border-gray-100
            rounded-2xl py-4 pr-11 pl-4
            text-sm font-bold text-gray-700
            outline-none transition-all
            focus:border-blue-500
            focus:bg-white
            focus:ring-4 focus:ring-blue-500/5
          "
        />
      </div>
    </div>
  );
}

export default DailyAppointments;
