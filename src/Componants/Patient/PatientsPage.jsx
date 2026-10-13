import React, { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiUsers,
  FiUser,
  FiMapPin,
  FiPhone,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiCalendar,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatients,
  getPatientReport,
  clearPatientReport,
  getPatient,
  addPatient,
  editPatient,
  deletePatient,
} from "../../redux/PatientsSclice/PatientsSclice";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PatientsPage() {
  const dispatch = useDispatch();

  const { patients, loading, isFetched, pagination } = useSelector(
    (state) => state.patients,
  );

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);

  const [showEditPatient, setShowEditPatient] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patientToDelete, setPatientToDelete] = useState(null);

  const [patientForm, setPatientForm] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    notes: "",
  });

  const handlePatientChange = (e) => {
    setPatientForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();

    try {
      await dispatch(addPatient(patientForm)).unwrap();

      toast.success("تم إضافة المريض بنجاح");

      setPatientForm({
        name: "",
        phone: "",
        dateOfBirth: "",
        gender: "male",
        address: "",
        notes: "",
      });

      setShowAddPatient(false);
    } catch (error) {
      toast.error(error || "فشل إضافة المريض");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(
      getPatients({
        page,
        limit: 20,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  const filteredPatients = useMemo(() => {
    let data = [...patients];

    if (search.trim()) {
      const value = search.toLowerCase();

      data = data.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(value) ||
          patient.phone?.includes(value) ||
          patient.patientCode?.toLowerCase().includes(value),
      );
    }

    if (genderFilter !== "all") {
      data = data.filter((patient) => patient.gender === genderFilter);
    }

    return data;
  }, [patients, search, genderFilter]);

  const stats = {
    total: patients.length,
    males: patients.filter((p) => p.gender === "male").length,
    females: patients.filter((p) => p.gender === "female").length,
    children: patients.filter((p) => {
      const age =
        new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();

      return age < 18;
    }).length,
  };

  const openWhatsApp = (phone, patientName) => {
    const formattedPhone = phone.replace(/\D/g, "").replace(/^0/, "20");

    const message = encodeURIComponent(`مرحبًا ${patientName} 👋

معك عيادة أسنان دكتور أحمد وهبه.

اذا كان لديك أي استفسار يمكنك الرد على هذه الرسالة.

شكرًا لك 🌹`);

    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        editPatient({
          id: selectedPatient._id,
          data: patientForm,
        }),
      ).unwrap();

      toast.success("تم تعديل بيانات المريض");

      setPatientForm({
        name: "",
        phone: "",
        dateOfBirth: "",
        gender: "male",
        address: "",
        notes: "",
      });

      setSelectedPatient(null);

      setShowEditPatient(false);

      dispatch(
        getPatients({
          page,
          limit: 20,
          search,
        }),
      );
    } catch (err) {
      toast.error(err || "فشل تعديل المريض");
    }
  };

  const handleDeletePatient = async (patient) => {
    try {
      await dispatch(deletePatient(patient._id)).unwrap();

      toast.success("تم حذف المريض");

      dispatch(
        getPatients({
          page,
          limit: 20,
          search,
        }),
      );
    } catch (err) {
      toast.error(err || "فشل حذف المريض");
    }
  };

  const goToPatientDetails = (patientId) => {
    navigate(`${patientId}`);
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] p-6 space-y-6 font-cairo"
      dir="rtl"
    >
      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
        <div>
          <h1 className="text-3xl font-black text-gray-800">المرضى</h1>

          <p className="text-sm text-gray-400 mt-1">
            إدارة جميع المرضى داخل العيادة
          </p>
        </div>

        <button
          onClick={() => setShowAddPatient(true)}
          className="
    flex items-center gap-2
    bg-blue-600
    hover:bg-blue-700
    text-white
    px-6 py-3
    rounded-2xl
    font-black
    shadow-lg shadow-blue-100
    transition-all
  "
        >
          <FiPlus size={18} />
          إضافة مريض
        </button>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={<FiUsers size={22} />}
          title="إجمالي المرضى"
          value={stats.total}
          color="blue"
        />

        <StatCard
          icon={<FiUser size={22} />}
          title="الرجال"
          value={stats.males}
          color="cyan"
        />

        <StatCard
          icon={<FiUser size={22} />}
          title="السيدات"
          value={stats.females}
          color="pink"
        />

        <StatCard
          icon={<FiUsers size={22} />}
          title="الأطفال"
          value={stats.children}
          color="emerald"
        />
      </div>

      {/* Filters */}

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch
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
              placeholder="بحث بالاسم أو الهاتف أو الكود..."
              className="
                w-full
                bg-gray-50
                border
                border-gray-100
                rounded-2xl
                py-3
                pr-11
                pl-4
                outline-none
                focus:ring-4
                focus:ring-blue-500/10
                focus:border-blue-500
              "
            />
          </div>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="
              bg-gray-50
              border
              border-gray-100
              rounded-2xl
              px-4
              outline-none
            "
          >
            <option value="all">كل المرضى</option>
            <option value="male">الرجال</option>
            <option value="female">السيدات</option>
          </select>

          <div
            className="
              bg-blue-50
              rounded-2xl
              flex
              items-center
              justify-center
              font-black
              text-blue-700
            "
          >
            {filteredPatients.length} مريض
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400">
                  المريض
                </th>

                <th className="text-center text-xs font-black text-gray-400">
                  الهاتف
                </th>

                <th className="text-center text-xs font-black text-gray-400">
                  العمر
                </th>

                <th className="text-center text-xs font-black text-gray-400">
                  الجنس
                </th>

                <th className="text-center text-xs font-black text-gray-400">
                  العنوان
                </th>

                <th className="text-center text-xs font-black text-gray-400">
                  الكود
                </th>

                <th className="text-center text-xs font-black text-gray-400">
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="py-16 flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                      <p className="mt-4 text-sm font-bold text-gray-500">
                        جاري تحميل المرضى...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length ? (
                filteredPatients.map((patient) => {
                  const age =
                    new Date().getFullYear() -
                    new Date(patient.dateOfBirth).getFullYear();

                  return (
                    <tr
                      key={patient._id}
                      className="
            hover:bg-blue-50/40
            transition-all
            duration-200
          "
                    >
                      {/* Patient */}

                      <td className="px-6 py-5" >
                        <div onClick={() => goToPatientDetails(patient._id)} className="flex items-center gap-4 cursor-pointer">
                          <div
                            className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-600
                  to-cyan-500
                  text-white
                  flex
                  items-center
                  justify-center
                  font-black
                "
                          >
                            {patient.name?.charAt(0)}
                          </div>

                          <div>
                            <button
                              onClick={() =>
                                dispatch(getPatientReport(patient._id))
                              }
                              className="
                    text-sm
                    font-black
                    text-gray-800
                    hover:text-blue-600
                  "
                            >
                              {patient.name}
                            </button>

                            <p className="text-xs text-gray-400 mt-1">
                              {patient.patientCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}

                      <td className="text-center">
                        <button
                          onClick={() =>
                            openWhatsApp(patient.phone, patient.name)
                          }
                          className="
      inline-flex
      items-center
      gap-2
      bg-green-50
      text-green-600
      hover:bg-green-600
      hover:text-white
      px-3
      py-2
      rounded-xl
      transition-all
      font-semibold
    "
                        >
                          <FaWhatsapp size={18} />
                          {patient.phone}
                        </button>
                      </td>

                      {/* Age */}

                      <td className="text-center">
                        <span
                          className="
                inline-flex
                px-3
                py-1
                rounded-full
                bg-emerald-50
                text-emerald-700
                text-xs
                font-black
              "
                        >
                          {age} سنة
                        </span>
                      </td>

                      {/* Gender */}

                      <td className="text-center">
                        <span
                          className={`
                inline-flex
                px-3
                py-1
                rounded-full
                text-xs
                font-black

                ${
                  patient.gender === "male"
                    ? "bg-sky-50 text-sky-700"
                    : "bg-pink-50 text-pink-700"
                }
              `}
                        >
                          {patient.gender === "male" ? "ذكر" : "أنثى"}
                        </span>
                      </td>

                      {/* Address */}

                      <td>
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                          <FiMapPin size={15} />

                          <span className="truncate max-w-[170px]">
                            {patient.address}
                          </span>
                        </div>
                      </td>

                      {/* Date */}

                      <td className="text-center">
                        <span className="text-sm text-gray-500">
                          {new Date(patient.createdAt).toLocaleDateString(
                            "ar-EG",
                          )}
                        </span>
                      </td>

                      {/* Actions */}

                      <td>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              dispatch(getPatientReport(patient._id))
                            }
                            className="
                flex
                items-center
                justify-center
                  w-9
                  h-9
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  hover:bg-blue-600
                  hover:text-white
                  transition-all
                "
                          >
                            <FiEye size={17} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPatient(patient);

                              setPatientForm({
                                name: patient.name,
                                phone: patient.phone,
                                dateOfBirth: patient.dateOfBirth?.split("T")[0],
                                gender: patient.gender,
                                address: patient.address,
                                notes: patient.notes || "",
                              });

                              setShowEditPatient(true);
                            }}
                            className="
    flex
    items-center
    justify-center
    w-9
    h-9
    rounded-xl
    bg-amber-50
    text-amber-600
    hover:bg-amber-500
    hover:text-white
    transition-all
  "
                            title="تعديل المريض"
                          >
                            <FiEdit2 size={17} />
                          </button>

                          <button
                            onClick={() => handleDeletePatient(patient)}
                            className="
    flex
    items-center
    justify-center
    w-9
    h-9
    rounded-xl
    bg-red-50
    text-red-600
    hover:bg-red-600
    hover:text-white
    transition-all
  "
                            title="حذف المريض"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="py-20 flex flex-col items-center">
                      <FiUsers size={46} className="text-gray-300" />

                      <h3 className="mt-5 text-lg font-black text-gray-700">
                        لا يوجد مرضى
                      </h3>

                      <p className="text-sm text-gray-400 mt-2">
                        لم يتم العثور على أي بيانات
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">
          إجمالي المرضى
          <span className="font-black text-blue-600 mx-2">
            {pagination.total}
          </span>
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="
            w-10
            h-10
            rounded-xl
            border
            disabled:opacity-40
            hover:bg-gray-100
            transition-all
            "
          >
            ❮
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`
                w-10
                h-10
                rounded-xl
                font-black
                transition-all

                ${
                  page === number
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:bg-gray-100"
                }

                `}
              >
                {number}
              </button>
            ),
          )}

          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="
            w-10
            h-10
            rounded-xl
            border
            disabled:opacity-40
            hover:bg-gray-100
            transition-all
            "
          >
            ❯
          </button>
        </div>
      </div>

      {(showAddPatient || showEditPatient) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            {/* Header */}

            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  {showEditPatient ? "تعديل بيانات المريض" : "إضافة مريض جديد"}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {showEditPatient
                    ? "قم بتعديل بيانات المريض"
                    : "أدخل بيانات المريض"}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddPatient(false);
                  setShowEditPatient(false);
                }}
                className="
            w-11
            h-11
            rounded-xl
            bg-gray-100
            hover:bg-red-50
            hover:text-red-600
            transition-all
          "
              >
                ✕
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={showEditPatient ? handleEditPatient : handleAddPatient}
              className="p-8 grid grid-cols-2 gap-5"
            >
              <Input
                label="اسم المريض"
                name="name"
                value={patientForm.name}
                onChange={handlePatientChange}
                icon={<FiUser />}
              />

              <Input
                label="رقم الهاتف"
                name="phone"
                value={patientForm.phone}
                onChange={handlePatientChange}
                icon={<FiPhone />}
              />

              <Input
                label="تاريخ الميلاد"
                name="dateOfBirth"
                type="date"
                value={patientForm.dateOfBirth}
                onChange={handlePatientChange}
                icon={<FiCalendar />}
              />

              <div>
                <label className="text-xs font-black text-gray-500 mb-2 block">
                  الجنس
                </label>

                <select
                  name="gender"
                  value={patientForm.gender}
                  onChange={handlePatientChange}
                  className="
              w-full
              bg-gray-50
              border
              border-gray-100
              rounded-2xl
              px-4
              py-4
              outline-none
            "
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div className="col-span-2">
                <Input
                  label="العنوان"
                  name="address"
                  value={patientForm.address}
                  onChange={handlePatientChange}
                  icon={<FiMapPin />}
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-black text-gray-500 mb-2 block">
                  ملاحظات
                </label>

                <textarea
                  rows={4}
                  name="notes"
                  value={patientForm.notes}
                  onChange={handlePatientChange}
                  className="
              w-full
              bg-gray-50
              border
              border-gray-100
              rounded-2xl
              p-4
              resize-none
              outline-none
            "
                />
              </div>

              <div className="col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPatient(false);
                    setShowEditPatient(false);
                  }}
                  className="
              px-6
              py-3
              rounded-2xl
              bg-gray-100
              font-bold
            "
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="
              px-8
              py-3
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-black
            "
                >
                  {showEditPatient ? "حفظ التعديلات" : "حفظ المريض"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    cyan: "bg-cyan-50 text-cyan-600",
    pink: "bg-pink-50 text-pink-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="text-xs text-gray-400 font-black mt-4">{title}</p>

      <h2 className="text-3xl font-black text-gray-800 mt-2">{value}</h2>
    </div>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-xs font-black text-gray-500 mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          {...props}
          required
          className="
            w-full
            bg-gray-50
            border
            border-gray-100
            rounded-2xl
            pr-12
            pl-4
            py-4
            outline-none
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
            transition-all
          "
        />
      </div>
    </div>
  );
}

export default PatientsPage;
