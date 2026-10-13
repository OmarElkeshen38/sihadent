import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiClipboard,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiActivity,
  FiHeart,
  FiEdit3,
  FiCreditCard,
} from "react-icons/fi";

import {
  getPatientReport,
  clearPatientReport,
  getPatients,
  getPatient,
  addPatient,
  editPatient,
  deletePatient,
} from "../../redux/PatientsSclice/PatientsSclice";

const PatientDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { patientReport, loading, error } = useSelector(
    (state) => state.patients,
  );

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;

    dispatch(getPatientReport(id));

    return () => {
      dispatch(clearPatientReport());
    };
  }, [dispatch, id]);

  const report = patientReport;
  const patient = report?.patient;

  const appointments = report?.appointments || [];
  const dailyBookings = report?.dailyBookings || [];

  const procedures = useMemo(() => {
    return dailyBookings.flatMap((booking) => booking.record?.procedures || []);
  }, [dailyBookings]);

  const dentalCharts = useMemo(() => {
    return dailyBookings.flatMap(
      (booking) => booking.record?.dentalChart || [],
    );
  }, [dailyBookings]);

  const financials = useMemo(() => {
    const procedureCost = procedures.reduce(
      (sum, item) => sum + Number(item.totalCost || 0),
      0,
    );

    const procedurePaid = procedures.reduce(
      (sum, item) => sum + Number(item.paid || 0),
      0,
    );

    const bookingPrices = dailyBookings.reduce(
      (sum, item) => sum + Number(item.bookingPrice || 0),
      0,
    );

    const extraPaid = dailyBookings.reduce(
      (sum, item) => sum + Number(item.extraPaid || 0),
      0,
    );

    const remaining = procedureCost - procedurePaid;

    return {
      procedureCost,
      procedurePaid,
      bookingPrices,
      extraPaid,
      remaining,
    };
  }, [procedures, dailyBookings]);

  if (loading && !patient) {
    return <LoadingState />;
  }

  if (error && !patient) {
    return (
      <div
        dir="rtl"
        className="min-h-[70vh] flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FiAlertCircle size={26} />
          </div>

          <h2 className="text-lg font-bold text-slate-800">
            حدث خطأ أثناء تحميل بيانات المريض
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            onClick={() => dispatch(getPatientReport(id))}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                title="رجوع"
              >
                <FiArrowLeft size={19} />
              </button>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-black text-white shadow-lg shadow-blue-100">
                {patient.name?.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-black text-slate-800 md:text-2xl">
                    {patient.name}
                  </h1>

                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {patient.patientCode}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <InfoChip icon={<FiPhone />} value={patient.phone} />

                  <InfoChip
                    icon={<FiMapPin />}
                    value={patient.address || "غير محدد"}
                  />

                  <InfoChip
                    icon={<FiUser />}
                    value={
                      patient.gender === "male"
                        ? "ذكر"
                        : patient.gender === "female"
                          ? "أنثى"
                          : "غير محدد"
                    }
                  />

                  <InfoChip
                    icon={<FiCalendar />}
                    value={calculateAge(patient.dateOfBirth)}
                  />
                </div>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">
              <FiEdit3 />
              تعديل بيانات المريض
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            icon={<FiCalendar />}
            label="إجمالي المواعيد"
            value={report.stats?.totalAppointments || 0}
          />

          <StatCard
            icon={<FiCheckCircle />}
            label="مواعيد مكتملة"
            value={report.stats?.completedAppointments || 0}
          />

          <StatCard
            icon={<FiActivity />}
            label="الحجوزات اليومية"
            value={report.stats?.totalDailyBookings || 0}
          />

          <StatCard
            icon={<FiFileText />}
            label="عدد الإجراءات"
            value={procedures.length}
          />
        </div>

        {/* Financial summary */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <MoneyCard
            label="إجمالي الإجراءات"
            value={financials.procedureCost}
            icon={<FiDollarSign />}
          />

          <MoneyCard
            label="إجمالي المدفوع للإجراءات"
            value={financials.procedurePaid}
            icon={<FiCreditCard />}
          />

          <MoneyCard
            label="المتبقي من الإجراءات"
            value={financials.remaining}
            icon={<FiAlertCircle />}
          />
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex overflow-x-auto border-b border-slate-200">
            <Tab
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={<FiClipboard />}
              label="نظرة عامة"
            />

            <Tab
              active={activeTab === "record"}
              onClick={() => setActiveTab("record")}
              icon={<FiHeart />}
              label="السجل المرضي"
            />

            <Tab
              active={activeTab === "procedures"}
              onClick={() => setActiveTab("procedures")}
              icon={<FiFileText />}
              label={`الإجراءات (${procedures.length})`}
            />

            <Tab
              active={activeTab === "appointments"}
              onClick={() => setActiveTab("appointments")}
              icon={<FiCalendar />}
              label={`المواعيد (${appointments.length})`}
            />

            <Tab
              active={activeTab === "dental"}
              onClick={() => setActiveTab("dental")}
              icon={<FiActivity />}
              label={`الأسنان (32)`}
            />
          </div>

          <div className="p-5 md:p-6">
            {activeTab === "overview" && (
              <Overview
                patient={patient}
                report={report}
                procedures={procedures}
                financials={financials}
                dailyBookings={dailyBookings}
              />
            )}

            {activeTab === "record" && (
              <MedicalRecord
                appointments={appointments}
                dailyBookings={dailyBookings}
              />
            )}

            {activeTab === "procedures" && (
              <ProceduresTable procedures={procedures} />
            )}

            {activeTab === "appointments" && (
              <AppointmentsTable appointments={appointments} />
            )}

            {activeTab === "dental" && (
              <DentalChartTable dentalCharts={dentalCharts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   OVERVIEW
========================================================= */

const Overview = ({
  patient,
  report,
  procedures,
  financials,
  dailyBookings,
}) => {
  return (
    <div className="space-y-6">
      <SectionTitle icon={<FiUser />} title="بيانات المريض" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="الاسم" value={patient.name} />

        <DetailItem label="كود المريض" value={patient.patientCode} />

        <DetailItem label="رقم الهاتف" value={patient.phone} />

        <DetailItem label="العنوان" value={patient.address || "غير محدد"} />

        <DetailItem
          label="تاريخ الميلاد"
          value={formatDate(patient.dateOfBirth)}
        />

        <DetailItem
          label="النوع"
          value={
            patient.gender === "male"
              ? "ذكر"
              : patient.gender === "female"
                ? "أنثى"
                : "غير محدد"
          }
        />
      </div>

      <SectionTitle icon={<FiActivity />} title="ملخص الحالة" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">آخر الحجوزات</h3>

            <span className="text-xs font-semibold text-slate-400">
              {dailyBookings.length} حجوزات
            </span>
          </div>

          <div className="space-y-3">
            {dailyBookings.slice(0, 4).map((booking) => (
              <div
                key={booking._id}
                className="flex items-center justify-between rounded-xl bg-white p-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {formatDate(booking.date)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {booking.record?.procedures?.length || 0} إجراءات
                  </p>
                </div>

                <StatusBadge status={booking.status} />
              </div>
            ))}

            {!dailyBookings.length && <EmptyState text="لا توجد حجوزات" />}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">آخر الإجراءات</h3>

            <span className="text-xs font-semibold text-slate-400">
              {procedures.length} إجراءات
            </span>
          </div>

          <div className="space-y-3">
            {procedures.slice(0, 4).map((procedure) => (
              <div
                key={procedure._id}
                className="flex items-center justify-between rounded-xl bg-white p-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {procedure.procedure}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(procedure.date)}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-sm font-black text-slate-800">
                    {formatMoney(procedure.totalCost)}
                  </p>

                  <p className="text-xs text-emerald-600">
                    مدفوع {formatMoney(procedure.paid)}
                  </p>
                </div>
              </div>
            ))}

            {!procedures.length && <EmptyState text="لا توجد إجراءات" />}
          </div>
        </div>
      </div>

      {patient.notes && (
        <>
          <SectionTitle icon={<FiFileText />} title="ملاحظات المريض" />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {patient.notes}
          </div>
        </>
      )}

      {report.invoices?.length > 0 && (
        <SectionTitle icon={<FiCreditCard />} title="الفواتير" />
      )}
    </div>
  );
};

/* =========================================================
   MEDICAL RECORD
========================================================= */

const MedicalRecord = ({ appointments, dailyBookings }) => {
  const records = [...appointments, ...dailyBookings];

  const latestRecord =
    records.length > 0 ? records[0]?.record?.medicalHistory : null;

  const chronicDiseases = latestRecord?.chronicDiseases || [];

  return (
    <div className="space-y-6">
      <SectionTitle icon={<FiHeart />} title="التاريخ المرضي" />

      {!latestRecord ? (
        <EmptyState text="لا توجد بيانات طبية مسجلة" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MedicalCard
            title="الأمراض المزمنة"
            active={latestRecord.hasChronicDisease}
            icon={<FiHeart />}
          >
            {latestRecord.hasChronicDisease ? (
              <div className="flex flex-wrap gap-2">
                {chronicDiseases.map((disease, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                  >
                    {disease}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-emerald-600">لا توجد أمراض مزمنة</p>
            )}
          </MedicalCard>

          <MedicalCard
            title="الأدوية"
            active={latestRecord.isTakingMedication}
            icon={<FiActivity />}
          >
            {latestRecord.isTakingMedication ? (
              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {latestRecord.medications || "لا توجد تفاصيل"}
              </p>
            ) : (
              <p className="text-sm text-emerald-600">لا يتناول أدوية</p>
            )}
          </MedicalCard>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   PROCEDURES
========================================================= */

const ProceduresTable = ({ procedures }) => {
  if (!procedures.length) {
    return <EmptyState text="لا توجد إجراءات مسجلة حتى الآن" />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-right font-bold text-slate-600">
                التاريخ
              </th>

              <th className="p-4 text-right font-bold text-slate-600">
                الإجراء
              </th>

              <th className="p-4 text-right font-bold text-slate-600">
                التكلفة
              </th>

              <th className="p-4 text-right font-bold text-slate-600">
                المدفوع
              </th>

              <th className="p-4 text-right font-bold text-slate-600">
                المتبقي
              </th>

              <th className="p-4 text-right font-bold text-slate-600">
                التحصيل
              </th>
            </tr>
          </thead>

          <tbody>
            {procedures.map((procedure) => {
              const cost = Number(procedure.totalCost || 0);
              const paid = Number(procedure.paid || 0);
              const remaining = cost - paid;

              const percentage =
                cost > 0 ? Math.min((paid / cost) * 100, 100) : 0;

              return (
                <tr
                  key={procedure._id}
                  className="border-t border-slate-100 hover:bg-slate-50/70"
                >
                  <td className="p-4 text-slate-500">
                    {formatDate(procedure.date)}
                  </td>

                  <td className="p-4 font-bold text-slate-800">
                    {procedure.procedure}
                  </td>

                  <td className="p-4 font-semibold text-slate-700">
                    {formatMoney(cost)}
                  </td>

                  <td className="p-4 font-bold text-emerald-600">
                    {formatMoney(paid)}
                  </td>

                  <td className="p-4 font-bold text-red-500">
                    {formatMoney(remaining)}
                  </td>

                  <td className="p-4">
                    <div className="min-w-[130px]">
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="text-slate-400">التحصيل</span>

                        <span className="font-bold text-slate-600">
                          {Math.round(percentage)}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================
   APPOINTMENTS
========================================================= */

const AppointmentsTable = ({ appointments }) => {
  if (!appointments.length) {
    return <EmptyState text="لا توجد مواعيد مسجلة" />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-right">التاريخ</th>
              <th className="p-4 text-right">الوقت</th>
              <th className="p-4 text-right">الخدمة</th>
              <th className="p-4 text-right">الحالة</th>
              <th className="p-4 text-right">سعر الحجز</th>
              <th className="p-4 text-right">ملاحظات</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment._id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="p-4 font-semibold text-slate-700">
                  {formatDate(appointment.date)}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <FiClock className="text-blue-500" />
                    {appointment.startTime || "--"} -{" "}
                    {appointment.endTime || "--"}
                  </div>
                </td>

                <td className="p-4">
                  <div>
                    <p className="font-bold text-slate-800">
                      {appointment.service?.name || "غير محدد"}
                    </p>

                    {appointment.service?.category && (
                      <p className="mt-1 text-xs text-slate-400">
                        {appointment.service.category}
                      </p>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <StatusBadge status={appointment.status} />
                </td>

                <td className="p-4 font-bold text-slate-700">
                  {formatMoney(appointment.bookingPrice)}
                </td>

                <td className="max-w-[220px] truncate p-4 text-slate-500">
                  {appointment.doctorNote || "لا توجد ملاحظات"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================
   DENTAL CHART
========================================================= */

const upperRight = ["UR1", "UR2", "UR3", "UR4", "UR5", "UR6", "UR7", "UR8"];

const upperLeft = ["UL1", "UL2", "UL3", "UL4", "UL5", "UL6", "UL7", "UL8"];

const lowerRight = ["LR1", "LR2", "LR3", "LR4", "LR5", "LR6", "LR7", "LR8"];

const lowerLeft = ["LL1", "LL2", "LL3", "LL4", "LL5", "LL6", "LL7", "LL8"];

const DentalChartTable = ({ dentalCharts = [] }) => {
  const getToothData = (toothNumber) => {
    return dentalCharts.find((item) => item.toothNumber === toothNumber) || {};
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800">Dental Chart</h2>

          <p className="mt-1 text-xs text-slate-400">
            جميع الأسنان — يمكن إضافة الشكوى والتكلفة لكل سن
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
            32 سن
          </span>

          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
            {dentalCharts.length} مسجل
          </span>
        </div>
      </div>

      {/* Upper Teeth */}
      <DentalTable
        title="الفك العلوي"
        subtitle="Upper Teeth"
        left={upperRight}
        right={upperLeft}
        getToothData={getToothData}
      />

      {/* Lower Teeth */}
      <DentalTable
        title="الفك السفلي"
        subtitle="Lower Teeth"
        left={lowerRight}
        right={lowerLeft}
        getToothData={getToothData}
      />
    </div>
  );
};

function DentalTable({
  title,
  subtitle,
  left,
  right,
  getToothData,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div>
          <h3 className="font-black text-slate-800">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600">
          16
        </div>
      </div>

      {/* Scroll on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">

          <thead className="bg-slate-50/70">
            <tr className="border-b border-slate-200">

              <th className="w-20 px-3 py-3 text-center text-xs font-black text-slate-500">
                Tooth
              </th>

              <th className="px-3 py-3 text-right text-xs font-black text-slate-500">
                Complaint
              </th>

              <th className="w-32 px-3 py-3 text-right text-xs font-black text-slate-500">
                Cost
              </th>

              <th className="w-20 border-r border-slate-200 px-3 py-3 text-center text-xs font-black text-slate-500">
                Tooth
              </th>

              <th className="px-3 py-3 text-right text-xs font-black text-slate-500">
                Complaint
              </th>

              <th className="w-32 px-3 py-3 text-right text-xs font-black text-slate-500">
                Cost
              </th>

            </tr>
          </thead>

          <tbody>
            {left.map((tooth, index) => {
              const leftData = getToothData(tooth);
              const rightTooth = right[index];
              const rightData = getToothData(rightTooth);

              return (
                <tr
                  key={tooth}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                >

                  {/* LEFT TOOTH */}
                  <td className="px-3 py-3 text-center">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-xs font-black text-blue-600">
                      {tooth}
                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <div className="min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                      {leftData.complain || (
                        <span className="text-slate-300">
                          لا توجد شكوى
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <div className="min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600">
                      {leftData.cost
                        ? `${Number(leftData.cost).toLocaleString(
                            "ar-EG"
                          )} ج.م`
                        : (
                          <span className="font-normal text-slate-300">
                            —
                          </span>
                        )}
                    </div>
                  </td>

                  {/* RIGHT TOOTH */}
                  <td className="border-r border-slate-200 px-3 py-3 text-center">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-xs font-black text-blue-600">
                      {rightTooth}
                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <div className="min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                      {rightData.complain || (
                        <span className="text-slate-300">
                          لا توجد شكوى
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <div className="min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600">
                      {rightData.cost
                        ? `${Number(rightData.cost).toLocaleString(
                            "ar-EG"
                          )} ج.م`
                        : (
                          <span className="font-normal text-slate-300">
                            —
                          </span>
                        )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

const Tab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm font-bold transition ${
      active
        ? "border-blue-600 bg-blue-50/60 text-blue-600"
        : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
    }`}
  >
    {icon}
    {label}
  </button>
);

const InfoChip = ({ icon, value }) => (
  <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
    <span className="text-blue-500">{icon}</span>
    {value}
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <span className="text-2xl font-black text-slate-800">{value}</span>
    </div>

    <p className="mt-3 text-xs font-semibold text-slate-500">{label}</p>
  </div>
);

const MoneyCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400">{label}</p>

        <p className="mt-1 text-lg font-black text-slate-800">
          {formatMoney(value)}
        </p>
      </div>
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-semibold text-slate-400">{label}</p>

    <p className="mt-1 text-sm font-bold text-slate-700">{value || "-"}</p>
  </div>
);

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      {icon}
    </div>

    <h2 className="font-black text-slate-800">{title}</h2>
  </div>
);

const MedicalCard = ({ title, icon, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>

    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      label: "قيد الانتظار",
      className: "bg-amber-50 text-amber-700",
    },

    inProgress: {
      label: "جاري",
      className: "bg-blue-50 text-blue-700",
    },

    completed: {
      label: "مكتمل",
      className: "bg-emerald-50 text-emerald-700",
    },

    cancelled: {
      label: "ملغي",
      className: "bg-red-50 text-red-700",
    },

    late: {
      label: "متأخر",
      className: "bg-orange-50 text-orange-700",
    },
  };

  const item = config[status] || {
    label: status || "غير محدد",
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1.5 text-xs font-bold ${item.className}`}
    >
      {item.label}
    </span>
  );
};

const EmptyState = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center">
    <FiFileText size={30} className="mx-auto text-slate-300" />

    <p className="mt-3 text-sm font-semibold text-slate-400">{text}</p>
  </div>
);

const LoadingState = () => (
  <div dir="rtl" className="min-h-[70vh] flex items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

      <p className="mt-4 text-sm font-semibold text-slate-500">
        جاري تحميل الملف الطبي...
      </p>
    </div>
  </div>
);

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const calculateAge = (date) => {
  if (!date) return "العمر غير محدد";

  const birth = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return `${age} سنة`;
};

const formatMoney = (value) => {
  return `${Number(value || 0).toLocaleString("ar-EG")} ج.م`;
};

export default PatientDetails;
