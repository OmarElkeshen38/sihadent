import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiEdit,
  FiPlusCircle,
  FiTrash2,
} from "react-icons/fi";
import { MdMoneyOff } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteDailyAppointment,
  editDailyAppointment,
} from "../../redux/DailyAppointmentsSlice/DailyAppointmentsSlice";
import { getPatientReport } from "../../redux/PatientsSclice/PatientsSclice";

function DailyAppointmentsTable() {
  const { appointments, loading } = useSelector(
    (state) => state.dailyAppointments,
  );
  const { patientReport } = useSelector((state) => state.patients);

  const dispatch = useDispatch();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewProcedures, setViewProcedures] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);

  const [procedureForm, setProcedureForm] = useState({
    procedure: "",
    totalCost: "",
    paid: "",
  });

  // useEffect(() => {
  //  if (patientReport) {
  //   setPatientProfile(patientReport);
  // }
  // }, [patientReport]);

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف الحجز؟")) {
      dispatch(deleteDailyAppointment(id));
    }
  };

  const handleComplete = (appointment) => {
    dispatch(
      editDailyAppointment({
        id: appointment._id,
        data: {
          status: "completed",
        },
      }),
    );
  };

  const handleAddProcedure = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleSaveProcedure = () => {
    const newProcedure = {
      date: new Date().toISOString(),
      procedure: procedureForm.procedure,
      totalCost: Number(procedureForm.totalCost),
      paid: Number(procedureForm.paid),
      remaining: Number(procedureForm.totalCost) - Number(procedureForm.paid),
    };

    dispatch(
      editDailyAppointment({
        id: selectedAppointment._id,

        data: {
          record: {
            ...selectedAppointment.record,

            procedures: [
              ...(selectedAppointment.record?.procedures || []),
              newProcedure,
            ],
          },
        },
      }),
    );

    setSelectedAppointment(null);

    setProcedureForm({
      procedure: "",
      totalCost: "",
      paid: "",
    });
  };

  const todayAppointments = useMemo(() => {
    return appointments || [];
  }, [appointments]);

  const totalCost =
    viewProcedures?.record?.procedures?.reduce(
      (sum, item) => sum + (item.totalCost || 0),
      0,
    ) || 0;

  const totalPaid =
    viewProcedures?.record?.procedures?.reduce(
      (sum, item) => sum + (item.paid || 0),
      0,
    ) || 0;

  const totalRemaining = totalCost - totalPaid;

  const handleProcedureChange = (procedureIndex, field, value) => {
    const updatedProcedures = [...viewProcedures.record.procedures];

    updatedProcedures[procedureIndex] = {
      ...updatedProcedures[procedureIndex],
      [field]: value,
    };

    updatedProcedures[procedureIndex].remaining =
      Number(updatedProcedures[procedureIndex].totalCost || 0) -
      Number(updatedProcedures[procedureIndex].paid || 0);

    setViewProcedures({
      ...viewProcedures,
      record: {
        ...viewProcedures.record,
        procedures: updatedProcedures,
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-10 text-center">
        <p className="text-sm font-bold text-gray-400">
          جاري تحميل الحجوزات...
        </p>
      </div>
    );
  }

  const collectionPercentage =
    totalCost > 0 ? Math.round((totalPaid / totalCost) * 100) : 0;

  const handleSaveProcedures = () => {
    dispatch(
      editDailyAppointment({
        id: viewProcedures._id,
        data: {
          record: viewProcedures.record,
        },
      }),
    );
  };

  const allProcedures =
    patientProfile?.dailyBookings?.flatMap(
      (booking) => booking.record?.procedures || [],
    ) || [];

  const totalProcedures = allProcedures.length;

  const patientProcedures =
    patientProfile?.dailyBookings?.flatMap(
      (booking) => booking.record?.procedures || [],
    ) || [];

  const patientTotalCost = patientProcedures.reduce(
    (sum, procedure) => sum + Number(procedure.totalCost || 0),
    0,
  );

  const patientTotalPaid = patientProcedures.reduce(
    (sum, procedure) => sum + Number(procedure.paid || 0),
    0,
  );

  const patientTotalRemaining = patientTotalCost - patientTotalPaid;

  const patientTotalProcedures = patientProcedures.length;

  return (
    <>
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-800">حجوزات اليوم</h2>

            <p className="text-xs text-gray-400 mt-1">
              جميع المواعيد المسجلة اليوم
            </p>
          </div>

          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black">
            {todayAppointments.length} موعد
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400">
                  المريض
                </th>

                <th className="px-6 py-4 text-xs font-black text-gray-400">
                  العنوان
                </th>

                <th className="px-6 py-4 text-xs font-black text-gray-400 text-center">
                  الهاتف
                </th>

                <th className="px-6 py-4 text-xs font-black text-gray-400 text-center">
                  الوقت
                </th>

                <th className="px-6 py-4 text-xs font-black text-gray-400 text-center">
                  الحالة
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 text-center">
                  الجلسات
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 text-center">
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {todayAppointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-blue-50/30 transition-all group"
                >
                  <td className="px-6 py-5">
                    <div>
                      <button
                        onClick={async () => {
                          try {
                            const result = await dispatch(
                              getPatientReport(appointment.patient),
                            ).unwrap();

                            setPatientProfile(result.data);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                        className="
    text-sm font-black text-blue-600
    hover:text-blue-800
    hover:underline
  "
                      >
                        {appointment.name}
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-700">
                      {appointment.address}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-black text-gray-700">
                      {appointment.phone}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span
                      className="
        bg-blue-50
        text-blue-600
        px-3 py-1
        rounded-xl
        text-xs font-black
    "
                    >
                      {new Date(appointment.bookingTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </td>

                  <td className="text-center">
                    <span
                      className={`
      px-3 py-1 rounded-full text-[10px] font-black

      ${
        appointment.status === "completed"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-amber-50 text-amber-600"
      }
    `}
                    >
                      {appointment.status === "completed" ? "مكتمل" : "انتظار"}
                    </span>
                  </td>
                  {/* --------------------------------- الجلسات ---------------------------------------- */}
                  <td className="text-center">
                    <button
                      onClick={() => setViewProcedures(appointment)}
                      className="
      bg-purple-50
      text-purple-600
      px-3 py-1
      rounded-xl
      text-xs font-black
      hover:bg-purple-100
    "
                    >
                      {appointment.record?.procedures?.length || 0}
                    </button>
                  </td>

                  {/*  ------------------------------------- الاجراءات ----------------------------------------*/}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAddProcedure(appointment)}
                        className="
        p-2 rounded-xl
        bg-blue-50
        text-blue-600
        hover:bg-blue-100
      "
                        title="إضافة إجراء"
                      >
                        <FiPlusCircle />
                      </button>

                      {appointment.status !== "completed" && (
                        <button
                          onClick={() => handleComplete(appointment)}
                          className="
          p-2 rounded-xl
          bg-emerald-50
          text-emerald-600
          hover:bg-emerald-100
        "
                          title="إنهاء الجلسة"
                        >
                          <FiCheckCircle />
                        </button>
                      )}

                      <button
                        className="
        p-2 rounded-xl
        bg-red-50
        text-red-600
        hover:bg-red-100"
                        title="مجاني"
                      >
                        <MdMoneyOff />
                      </button>

                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="
        p-2 rounded-xl
        bg-red-50
        text-red-600
        hover:bg-red-100
      "
                        title="حذف"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {todayAppointments.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div
                className="
        w-16 h-16 rounded-2xl
        bg-gray-100
        flex items-center justify-center
        text-gray-400
    "
              >
                <FiCalendar size={28} />
              </div>

              <p className="text-sm font-bold text-gray-400">
                لا توجد حجوزات في هذا اليوم
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <h3 className="text-lg font-black mb-6">إضافة جلسة علاجية</h3>

            <div className="space-y-4">
              <input
                placeholder="نوع الإجراء"
                value={procedureForm.procedure}
                onChange={(e) =>
                  setProcedureForm({
                    ...procedureForm,
                    procedure: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="التكلفة"
                value={procedureForm.totalCost}
                onChange={(e) =>
                  setProcedureForm({
                    ...procedureForm,
                    totalCost: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="المدفوع"
                value={procedureForm.paid}
                onChange={(e) =>
                  setProcedureForm({
                    ...procedureForm,
                    paid: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-xl bg-gray-100"
              >
                إلغاء
              </button>

              <button
                onClick={handleSaveProcedure}
                className="
            px-4 py-2
            rounded-xl
            bg-blue-600
            text-white
          "
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {viewProcedures && (
  <div className="fixed inset-0 z-[999] bg-slate-950/60 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-5">
    <div className="w-full max-w-6xl max-h-[92vh] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col">

      {/* ================= HEADER ================= */}
      <div className="shrink-0 px-5 sm:px-7 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              🦷
            </div>

            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                السجل العلاجي
              </h3>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-slate-500 truncate">
                  {viewProcedures.name}
                </span>

                <span className="w-1 h-1 rounded-full bg-slate-300" />

                <span className="text-xs font-bold text-slate-400">
                  {viewProcedures.record?.procedures?.length || 0} إجراء
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setViewProcedures(null)}
            className="
              shrink-0
              w-10 h-10
              rounded-xl
              bg-slate-100
              text-slate-500
              hover:bg-red-50
              hover:text-red-600
              transition-all
              flex items-center justify-center
              text-lg
            "
          >
            ✕
          </button>

        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="shrink-0 px-5 sm:px-7 py-4 bg-slate-50/70 border-b border-slate-100">

        <div className="grid grid-cols-3 gap-2 sm:gap-3">

          {/* Total */}
          <div className="bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                إجمالي التكلفة
              </span>

              <span className="hidden sm:flex w-7 h-7 rounded-lg bg-blue-50 text-blue-600 items-center justify-center">
                💰
              </span>
            </div>

            <div className="mt-1">
              <span className="text-base sm:text-xl font-black text-slate-800">
                {totalCost.toLocaleString("ar-EG")}
              </span>

              <span className="text-[10px] text-slate-400 mr-1">
                ج.م
              </span>
            </div>
          </div>

          {/* Paid */}
          <div className="bg-white border border-emerald-100 rounded-xl px-3 sm:px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                المدفوع
              </span>

              <span className="hidden sm:flex w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 items-center justify-center">
                ✓
              </span>
            </div>

            <div className="mt-1">
              <span className="text-base sm:text-xl font-black text-emerald-600">
                {totalPaid.toLocaleString("ar-EG")}
              </span>

              <span className="text-[10px] text-slate-400 mr-1">
                ج.م
              </span>
            </div>
          </div>

          {/* Remaining */}
          <div
            className={`bg-white border rounded-xl px-3 sm:px-4 py-3 ${
              totalRemaining > 0
                ? "border-red-100"
                : "border-emerald-100"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                المتبقي
              </span>

              <span
                className={`hidden sm:flex w-7 h-7 rounded-lg items-center justify-center ${
                  totalRemaining > 0
                    ? "bg-red-50 text-red-500"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {totalRemaining > 0 ? "!" : "✓"}
              </span>
            </div>

            <div className="mt-1">
              <span
                className={`text-base sm:text-xl font-black ${
                  totalRemaining > 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {totalRemaining.toLocaleString("ar-EG")}
              </span>

              <span className="text-[10px] text-slate-400 mr-1">
                ج.م
              </span>
            </div>
          </div>

        </div>

        {/* Collection */}
        <div className="mt-4 flex items-center gap-3">

          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
            التحصيل
          </span>

          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(collectionPercentage, 100)}%`,
              }}
            />
          </div>

          <span className="text-xs font-black text-emerald-600 min-w-[35px] text-left">
            {collectionPercentage}%
          </span>

        </div>
      </div>

      {/* ================= TABLE AREA ================= */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {viewProcedures.record?.procedures?.length > 0 ? (
          <div className="h-full overflow-auto">

            <table className="w-full min-w-[780px] border-collapse">

              {/* TABLE HEADER */}
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr>

                  <th className="w-14 px-4 py-3 text-center text-[11px] font-black text-slate-400">
                    #
                  </th>

                  <th className="px-4 py-3 text-right text-[11px] font-black text-slate-400">
                    الإجراء العلاجي
                  </th>

                  <th className="w-32 px-3 py-3 text-right text-[11px] font-black text-slate-400">
                    التاريخ
                  </th>

                  <th className="w-36 px-3 py-3 text-right text-[11px] font-black text-slate-400">
                    التكلفة
                  </th>

                  <th className="w-36 px-3 py-3 text-right text-[11px] font-black text-slate-400">
                    المدفوع
                  </th>

                  <th className="w-40 px-3 py-3 text-right text-[11px] font-black text-slate-400">
                    المتبقي
                  </th>

                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-slate-100">

                {viewProcedures.record.procedures.map(
                  (procedure, index) => {

                    const remaining =
                      Number(procedure.totalCost || 0) -
                      Number(procedure.paid || 0);

                    return (
                      <tr
                        key={procedure._id || index}
                        className="group hover:bg-slate-50/70 transition-colors"
                      >

                        {/* NUMBER */}
                        <td className="px-4 py-4 text-center">
                          <span className="
                            inline-flex
                            w-7 h-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                            text-xs
                            font-black
                          ">
                            {index + 1}
                          </span>
                        </td>

                        {/* PROCEDURE */}
                        <td className="px-4 py-3">

                          <input
                            value={procedure.procedure || ""}
                            onChange={(e) =>
                              handleProcedureChange(
                                index,
                                "procedure",
                                e.target.value
                              )
                            }
                            placeholder="اسم الإجراء..."
                            className="
                              w-full
                              min-w-[220px]
                              bg-transparent
                              border border-transparent
                              hover:border-slate-200
                              focus:border-blue-300
                              focus:bg-white
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              font-bold
                              text-slate-700
                              outline-none
                              transition-all
                            "
                          />

                        </td>

                        {/* DATE */}
                        <td className="px-3 py-3">

                          <span className="
                            inline-flex
                            px-2.5
                            py-1.5
                            rounded-lg
                            bg-slate-100
                            text-slate-500
                            text-[11px]
                            font-bold
                            whitespace-nowrap
                          ">
                            {procedure.date
                              ? new Date(
                                  procedure.date
                                ).toLocaleDateString("ar-EG")
                              : "-"}
                          </span>

                        </td>

                        {/* COST */}
                        <td className="px-3 py-3">

                          <div className="relative">

                            <input
                              type="number"
                              min="0"
                              value={procedure.totalCost ?? ""}
                              onChange={(e) =>
                                handleProcedureChange(
                                  index,
                                  "totalCost",
                                  Number(e.target.value)
                                )
                              }
                              className="
                                w-full
                                bg-slate-50
                                border border-slate-200
                                focus:border-blue-400
                                focus:bg-white
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                font-black
                                text-slate-700
                                outline-none
                                transition-all
                              "
                            />

                            <span className="
                              absolute
                              left-2
                              top-1/2
                              -translate-y-1/2
                              text-[9px]
                              text-slate-400
                              font-bold
                            ">
                              ج.م
                            </span>

                          </div>

                        </td>

                        {/* PAID */}
                        <td className="px-3 py-3">

                          <div className="relative">

                            <input
                              type="number"
                              min="0"
                              value={procedure.paid ?? ""}
                              onChange={(e) =>
                                handleProcedureChange(
                                  index,
                                  "paid",
                                  Number(e.target.value)
                                )
                              }
                              className="
                                w-full
                                bg-emerald-50/50
                                border border-emerald-100
                                focus:border-emerald-400
                                focus:bg-white
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                font-black
                                text-emerald-700
                                outline-none
                                transition-all
                              "
                            />

                            <span className="
                              absolute
                              left-2
                              top-1/2
                              -translate-y-1/2
                              text-[9px]
                              text-emerald-500
                              font-bold
                            ">
                              ج.م
                            </span>

                          </div>

                        </td>

                        {/* REMAINING */}
                        <td className="px-3 py-3">

                          <div className="flex items-center gap-2">

                            <span
                              className={`
                                font-black
                                text-sm
                                ${
                                  remaining > 0
                                    ? "text-red-600"
                                    : "text-emerald-600"
                                }
                              `}
                            >
                              {remaining.toLocaleString("ar-EG")}
                              <span className="text-[9px] mr-1 text-slate-400">
                                ج.م
                              </span>
                            </span>

                            <span
                              className={`
                                hidden lg:inline-flex
                                px-2
                                py-1
                                rounded-md
                                text-[9px]
                                font-black
                                ${
                                  remaining > 0
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-emerald-50 text-emerald-600"
                                }
                              `}
                            >
                              {remaining > 0
                                ? "متبقي"
                                : "مكتمل"}
                            </span>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>
            </table>

          </div>
        ) : (

          /* EMPTY */
          <div className="h-full flex items-center justify-center p-8">

            <div className="text-center">

              <div className="
                w-16 h-16
                mx-auto
                mb-4
                rounded-2xl
                bg-slate-100
                flex
                items-center
                justify-center
                text-3xl
              ">
                🦷
              </div>

              <h4 className="text-sm font-black text-slate-700">
                لا توجد إجراءات علاجية
              </h4>

              <p className="text-xs text-slate-400 mt-1">
                لم يتم إضافة أي إجراء لهذا الحجز حتى الآن
              </p>

            </div>

          </div>
        )}

      </div>

      {/* ================= FOOTER ================= */}
      <div className="
        shrink-0
        px-5 sm:px-7
        py-3
        border-t
        border-slate-100
        bg-white
        flex
        items-center
        justify-between
        gap-3
      ">

        {/* Left info */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>
            {viewProcedures.record?.procedures?.length || 0} إجراء علاجي
          </span>
        </div>

        <div className="flex items-center gap-2 mr-auto">

          <button
            onClick={() => setViewProcedures(null)}
            className="
              px-4
              py-2.5
              rounded-xl
              bg-slate-100
              hover:bg-slate-200
              text-slate-600
              text-sm
              font-black
              transition-all
            "
          >
            إغلاق
          </button>

          <button
            onClick={handleSaveProcedures}
            className="
              px-5
              py-2.5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              active:scale-[0.98]
              text-white
              text-sm
              font-black
              shadow-sm
              shadow-blue-200
              transition-all
            "
          >
            حفظ التعديلات
          </button>

        </div>

      </div>

    </div>
  </div>
)}

      {patientProfile && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-7xl h-[92vh] bg-[#f8fafc] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
            {/* ================= HEADER ================= */}
            <div className="bg-gradient-to-l from-blue-600 to-cyan-500 text-white px-8 py-6 shrink-0">
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-black">
                    {patientProfile.patient?.name?.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-black">
                        {patientProfile.patient?.name}
                      </h2>

                      <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-black">
                        {patientProfile.patient?.patientCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/80">
                      <span>{patientProfile.patient?.phone}</span>

                      <span className="opacity-50">•</span>

                      <span>
                        {patientProfile.patient?.address || "لا يوجد عنوان"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={() => setPatientProfile(null)}
                  className="
              w-11 h-11
              rounded-xl
              bg-white/15
              hover:bg-red-500
              transition-all
              flex items-center justify-center
              font-black
              text-lg
            "
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ================= BODY ================= */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* ================= FINANCIAL SUMMARY ================= */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total */}
                <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                  <p className="text-xs font-bold text-white/70">
                    إجمالي تكلفة العلاج
                  </p>

                  <h2 className="text-3xl font-black mt-2">
                    {patientTotalCost.toLocaleString("ar-EG")}
                  </h2>

                  <p className="text-xs mt-1 text-white/70">جنيه</p>
                </div>

                {/* Paid */}
                <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                  <p className="text-xs font-bold text-white/70">
                    إجمالي المدفوع
                  </p>

                  <h2 className="text-3xl font-black mt-2">
                    {patientTotalPaid.toLocaleString("ar-EG")}
                  </h2>

                  <p className="text-xs mt-1 text-white/70">جنيه</p>
                </div>

                {/* Remaining */}
                <div className="rounded-2xl p-5 bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg">
                  <p className="text-xs font-bold text-white/70">
                    المتبقي على المريض
                  </p>

                  <h2 className="text-3xl font-black mt-2">
                    {patientTotalRemaining.toLocaleString("ar-EG")}
                  </h2>

                  <p className="text-xs mt-1 text-white/70">جنيه</p>
                </div>

                {/* Procedures */}
                <div className="rounded-2xl p-5 bg-white border border-gray-200 shadow-sm">
                  <p className="text-xs font-black text-gray-400">
                    الإجراءات العلاجية
                  </p>

                  <h2 className="text-3xl font-black text-blue-600 mt-2">
                    {patientTotalProcedures}
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">جلسة علاجية</p>
                </div>
              </div>

              {/* ================= PATIENT INFO ================= */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-black text-gray-800">
                      بيانات المريض
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      البيانات الأساسية للمريض
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoCard
                    title="الاسم"
                    value={patientProfile.patient?.name}
                  />

                  <InfoCard
                    title="رقم الهاتف"
                    value={patientProfile.patient?.phone}
                  />

                  <InfoCard
                    title="العنوان"
                    value={patientProfile.patient?.address}
                  />

                  <InfoCard
                    title="النوع"
                    value={
                      patientProfile.patient?.gender === "male" ? "ذكر" : "أنثى"
                    }
                  />
                </div>
              </div>

              {/* ================= APPOINTMENTS ================= */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-black text-gray-800">
                      سجل المواعيد
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      جميع مواعيد المريض
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-black">
                    {patientProfile.appointments?.length || 0} موعد
                  </span>
                </div>

                {patientProfile.appointments?.length > 0 ? (
                  <div className="space-y-3">
                    {patientProfile.appointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="
                    border border-gray-100
                    rounded-xl
                    p-4
                    hover:border-blue-200
                    hover:bg-blue-50/20
                    transition-all
                  "
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-black text-gray-800">
                              {appointment.service?.name || "موعد"}
                            </h4>

                            <p className="text-xs text-gray-400 mt-1">
                              {appointment.service?.category || ""}
                            </p>
                          </div>

                          <span
                            className={`
                        px-3 py-1 rounded-lg text-xs font-black

                        ${
                          appointment.status === "completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : appointment.status === "pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                        }
                      `}
                          >
                            {appointment.status === "completed"
                              ? "مكتمل"
                              : appointment.status === "pending"
                                ? "انتظار"
                                : appointment.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <InfoCard
                            title="التاريخ"
                            value={
                              appointment.date
                                ? new Date(appointment.date).toLocaleDateString(
                                    "ar-EG",
                                  )
                                : "-"
                            }
                          />

                          <InfoCard title="من" value={appointment.startTime} />

                          <InfoCard title="إلى" value={appointment.endTime} />

                          <InfoCard
                            title="السعر"
                            value={`${appointment.service?.price || 0} ج`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-sm text-gray-400">
                    لا توجد مواعيد مسجلة
                  </div>
                )}
              </div>

              {/* ================= TREATMENT HISTORY ================= */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-black text-gray-800">
                      السجل العلاجي
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      جميع الإجراءات العلاجية للمريض
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-black">
                    {patientTotalProcedures} جلسة
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  {patientTotalProcedures > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-5 py-4 text-right text-xs font-black text-gray-400">
                            التاريخ
                          </th>

                          <th className="px-5 py-4 text-right text-xs font-black text-gray-400">
                            الإجراء
                          </th>

                          <th className="px-5 py-4 text-center text-xs font-black text-gray-400">
                            التكلفة
                          </th>

                          <th className="px-5 py-4 text-center text-xs font-black text-gray-400">
                            المدفوع
                          </th>

                          <th className="px-5 py-4 text-center text-xs font-black text-gray-400">
                            المتبقي
                          </th>

                          <th className="px-5 py-4 text-center text-xs font-black text-gray-400">
                            الحجز
                          </th>

                          <th className="px-5 py-4 text-center text-xs font-black text-gray-400">
                            الحالة
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {patientProfile.dailyBookings?.flatMap((booking) =>
                          booking.record?.procedures?.map(
                            (procedure, index) => (
                              <tr
                                key={procedure._id || `${booking._id}-${index}`}
                                className="border-b border-gray-50 hover:bg-blue-50/30 transition-all"
                              >
                                {/* Date */}
                                <td className="px-5 py-4">
                                  <p className="font-bold text-gray-700 text-sm">
                                    {procedure.date
                                      ? new Date(
                                          procedure.date,
                                        ).toLocaleDateString("ar-EG")
                                      : new Date(
                                          booking.date,
                                        ).toLocaleDateString("ar-EG")}
                                  </p>

                                  <p className="text-[11px] text-gray-400 mt-1">
                                    {booking.bookingTime
                                      ? new Date(
                                          booking.bookingTime,
                                        ).toLocaleTimeString("ar-EG", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "-"}
                                  </p>
                                </td>

                                {/* Procedure */}
                                <td className="px-5 py-4">
                                  <p className="font-black text-gray-800 text-sm">
                                    {procedure.procedure}
                                  </p>

                                  <p className="text-[11px] text-gray-400 mt-1">
                                    {booking.name}
                                  </p>
                                </td>

                                {/* Cost */}
                                <td className="text-center">
                                  <span className="font-black text-blue-600">
                                    {Number(
                                      procedure.totalCost || 0,
                                    ).toLocaleString("ar-EG")}{" "}
                                    ج
                                  </span>
                                </td>

                                {/* Paid */}
                                <td className="text-center">
                                  <span className="font-black text-emerald-600">
                                    {Number(procedure.paid || 0).toLocaleString(
                                      "ar-EG",
                                    )}{" "}
                                    ج
                                  </span>
                                </td>

                                {/* Remaining */}
                                <td className="text-center">
                                  <span
                                    className={`
                                  font-black
                                  ${
                                    Number(procedure.remaining || 0) > 0
                                      ? "text-red-600"
                                      : "text-emerald-600"
                                  }
                                `}
                                  >
                                    {Number(
                                      procedure.remaining || 0,
                                    ).toLocaleString("ar-EG")}{" "}
                                    ج
                                  </span>
                                </td>

                                {/* Booking Date */}
                                <td className="text-center">
                                  <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">
                                    {booking.date
                                      ? new Date(
                                          booking.date,
                                        ).toLocaleDateString("ar-EG")
                                      : "-"}
                                  </span>
                                </td>

                                {/* Status */}
                                <td className="text-center">
                                  <span
                                    className={`
                                  px-3 py-1 rounded-lg text-xs font-black

                                  ${
                                    booking.status === "completed"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-amber-50 text-amber-600"
                                  }
                                `}
                                  >
                                    {booking.status === "completed"
                                      ? "مكتمل"
                                      : "انتظار"}
                                  </span>
                                </td>
                              </tr>
                            ),
                          ),
                        )}
                      </tbody>

                      {/* Footer */}
                      <tfoot>
                        <tr className="bg-gray-50 border-t">
                          <td colSpan={2} className="px-5 py-5 font-black">
                            الإجمالي
                          </td>

                          <td className="text-center font-black text-blue-700">
                            {patientTotalCost.toLocaleString("ar-EG")} ج
                          </td>

                          <td className="text-center font-black text-emerald-700">
                            {patientTotalPaid.toLocaleString("ar-EG")} ج
                          </td>

                          <td className="text-center font-black text-red-700">
                            {patientTotalRemaining.toLocaleString("ar-EG")} ج
                          </td>

                          <td />
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <div className="py-16 text-center">
                      <div className="text-4xl mb-3">🦷</div>

                      <h4 className="font-black text-gray-700">
                        لا توجد إجراءات علاجية
                      </h4>

                      <p className="text-xs text-gray-400 mt-1">
                        لم يتم تسجيل أي جلسات علاجية لهذا المريض
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5">
      <p className="text-xs font-black text-gray-400 mb-2">{title}</p>

      <h3 className="text-lg font-black text-gray-800 break-words">
        {value || "-"}
      </h3>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-3xl p-5">
      <p className="text-xs font-black text-gray-400 mb-2">{title}</p>

      <h3 className="text-2xl font-black text-blue-600">{value}</h3>
    </div>
  );
}

export default DailyAppointmentsTable;
