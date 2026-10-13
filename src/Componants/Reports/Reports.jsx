import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiRefreshCw,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import {
  getReportsDashboard,
  getTopServices,
  getDailyProfit,
  getBookingAnalytics,
} from "../../redux/ReportsSlice/ReportsSlice";

const Reports = () => {
  const dispatch = useDispatch();

  const {
    dashboard,
    topServices,
    dailyProfit,
    bookingAnalytics,

    loading,
    topServicesLoading,
    dailyProfitLoading,
    bookingAnalyticsLoading,

    error,
    topServicesError,
    dailyProfitError,
    bookingAnalyticsError,
  } = useSelector((state) => state.reports);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    dispatch(getReportsDashboard());
    dispatch(getTopServices());
    dispatch(getDailyProfit());
    dispatch(getBookingAnalytics());
  };

  if (loading && !dashboard) {
    return <ReportsLoading />;
  }

  if (error && !dashboard) {
    return <ErrorState error={error} onRetry={loadReports} />;
  }

  const recentAppointments = dashboard?.recentAppointments || [];

  const todayStats = dashboard?.todayStats || {};

  const bookingStats = dailyProfit?.dailyBookings || {};

  const appointmentStats = dailyProfit?.appointments || {};

  const bookingAnalyticsData = bookingAnalytics || {};

  const statusBreakdown = bookingAnalyticsData.statusBreakdown || {};

  const doctorBreakdown = bookingAnalyticsData.doctorBreakdown || [];

  const timeline = bookingAnalyticsData.timeline || [];

  const services = topServices || [];

  const maxRevenue = Math.max(
    ...services.map((item) => Number(item.revenue || 0)),
    1,
  );

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiActivity size={23} />
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-800 md:text-2xl">
                  التقارير
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  تحليل شامل لأداء العيادة والحجوزات والإيرادات
                </p>
              </div>
            </div>

            <button
              onClick={loadReports}
              disabled={
                loading ||
                topServicesLoading ||
                dailyProfitLoading ||
                bookingAnalyticsLoading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCw
                className={
                  loading ||
                  topServicesLoading ||
                  dailyProfitLoading ||
                  bookingAnalyticsLoading
                    ? "animate-spin"
                    : ""
                }
              />
              تحديث التقارير
            </button>
          </div>
        </div>

        {/* =================================================
            MAIN KPI
        ================================================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReportCard
            title="إجمالي الدخل"
            value={formatMoney(dashboard?.totalIncome)}
            icon={<FiDollarSign />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <ReportCard
            title="إيرادات الشهر"
            value={formatMoney(dashboard?.monthlyRevenue)}
            subtitle={
              dashboard?.revenueGrowth === "N/A"
                ? "لا توجد مقارنة"
                : dashboard?.revenueGrowth
            }
            icon={<FiTrendingUp />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <ReportCard
            title="إجمالي المرضى"
            value={dashboard?.totalPatients || 0}
            subtitle={`جدد الشهر الماضي: ${
              dashboard?.newPatientsLastMonth || 0
            }`}
            icon={<FiUsers />}
            iconClass="bg-violet-50 text-violet-600"
          />

          <ReportCard
            title="نسبة إكمال المواعيد"
            value={dashboard?.completionRate || "0%"}
            subtitle={`مكتمل: ${dashboard?.completedAppointments || 0}`}
            icon={<FiCheckCircle />}
            iconClass="bg-cyan-50 text-cyan-600"
          />
        </div>

        {/* =================================================
            TODAY PROFIT
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-black text-slate-800">ملخص اليوم</h2>

                <p className="mt-1 text-xs text-slate-400">
                  الإيرادات موزعة حسب نوع الحجز
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiCalendar />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RevenueBox
                title="الحجوزات اليومية"
                count={bookingStats.count}
                total={bookingStats.total}
                rows={[
                  ["سعر الحجز", bookingStats.totalBookingPrice],
                  ["مدفوع إضافي", bookingStats.totalExtraPaid],
                  ["مدفوع الإجراءات", bookingStats.totalProcedurePaid],
                ]}
              />

              <RevenueBox
                title="المواعيد"
                count={appointmentStats.count}
                total={appointmentStats.total}
                rows={[
                  ["سعر الحجز", appointmentStats.totalBookingPrice],
                  ["مدفوع إضافي", appointmentStats.totalExtraPaid],
                  ["سعر الخدمات", appointmentStats.totalServicePrice],
                  ["مدفوع الإجراءات", appointmentStats.totalProcedurePaid],
                ]}
              />
            </div>
          </div>

          {/* DAILY PROFIT */}

          <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-400">
                  إجمالي الربح اليومي
                </p>

                <p className="mt-2 text-3xl font-black">
                  {formatMoney(dailyProfit?.totalDailyProfit)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <FiTrendingUp size={22} />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <ProfitRow label="الحجوزات اليومية" value={bookingStats.total} />

              <ProfitRow label="المواعيد" value={appointmentStats.total} />

              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">الفترة</span>

                  <span className="text-xs font-bold text-slate-300">
                    {dailyProfit?.period?.from || "--"} →{" "}
                    {dailyProfit?.period?.to || "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            BOOKING ANALYTICS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* STATUS */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="حالات الحجوزات"
              subtitle={`إجمالي ${bookingAnalyticsData.totalBookings || 0} حجز`}
              icon={<FiActivity />}
            />

            <div className="mt-5 space-y-4">
              <AnalyticsRow
                label="مكتمل"
                value={statusBreakdown.completed}
                total={bookingAnalyticsData.totalBookings}
                type="completed"
              />

              <AnalyticsRow
                label="قيد الانتظار"
                value={statusBreakdown.pending}
                total={bookingAnalyticsData.totalBookings}
                type="pending"
              />

              <AnalyticsRow
                label="جاري"
                value={statusBreakdown.inProgress}
                total={bookingAnalyticsData.totalBookings}
                type="progress"
              />

              <AnalyticsRow
                label="ملغي"
                value={statusBreakdown.cancelled}
                total={bookingAnalyticsData.totalBookings}
                type="cancelled"
              />

              <AnalyticsRow
                label="متأخر"
                value={statusBreakdown.late}
                total={bookingAnalyticsData.totalBookings}
                type="late"
              />
            </div>
          </div>

          {/* TYPES */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="نوع الحجوزات"
              subtitle="توزيع الحجوزات"
              icon={<FiCalendar />}
            />

            <div className="mt-6 space-y-5">
              <TypeStat
                label="المواعيد"
                value={bookingAnalyticsData.typeBreakdown?.appointments || 0}
                total={bookingAnalyticsData.totalBookings}
                icon={<FiCalendar />}
              />

              <TypeStat
                label="الحجوزات اليومية"
                value={bookingAnalyticsData.typeBreakdown?.dailyBookings || 0}
                total={bookingAnalyticsData.totalBookings}
                icon={<FiClock />}
              />
            </div>
          </div>

          {/* DOCTORS */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="الحجوزات حسب الطبيب"
              subtitle="توزيع الحجوزات"
              icon={<FiUser />}
            />

            <div className="mt-5 space-y-3">
              {doctorBreakdown.length === 0 ? (
                <EmptyState text="لا توجد بيانات" />
              ) : (
                doctorBreakdown.map((doctor) => (
                  <div
                    key={doctor.name}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FiUser size={16} />
                      </div>

                      <span className="text-sm font-bold text-slate-700">
                        {doctor.name}
                      </span>
                    </div>

                    <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm">
                      {doctor.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            TIMELINE
        ================================================= */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader
            title="الحجوزات خلال الفترة"
            subtitle={`من ${bookingAnalyticsData.period?.from || "--"} إلى ${
              bookingAnalyticsData.period?.to || "--"
            }`}
            icon={<FiTrendingUp />}
          />

          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-max items-end gap-4 pb-3">
              {timeline.length === 0 ? (
                <EmptyState text="لا توجد بيانات زمنية" />
              ) : (
                timeline.map((item) => {
                  const height = Math.max(item.total * 50, 20);

                  return (
                    <div
                      key={item.date}
                      className="flex w-28 flex-col items-center gap-2"
                    >
                      <span className="text-xs font-black text-slate-700">
                        {item.total}
                      </span>

                      <div className="flex h-40 w-full items-end justify-center">
                        <div
                          className="w-12 rounded-t-xl bg-blue-600 transition-all"
                          style={{
                            height: `${height}px`,
                          }}
                        />
                      </div>

                      <span className="text-[11px] font-semibold text-slate-400">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            TOP SERVICES
        ================================================= */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader
            title="أكثر الخدمات استخدامًا"
            subtitle="الإيرادات ونسبة كل خدمة"
            icon={<FiActivity />}
          />

          {topServicesLoading ? (
            <SectionLoader />
          ) : services.length === 0 ? (
            <EmptyState text="لا توجد بيانات للخدمات" />
          ) : (
            <div className="mt-6 space-y-4">
              {services.map((service) => {
                const revenue = Number(service.revenue || 0);

                const percentage = parseFloat(service.percentage || "0");

                const barWidth = Math.min((revenue / maxRevenue) * 100, 100);

                return (
                  <div
                    key={service.serviceId}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-black text-blue-600">
                          {service.count}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-800">
                            {service.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {service.category} • {formatMoney(service.price)}
                          </p>
                        </div>
                      </div>

                      <div className="w-full lg:w-[380px]">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-400">
                            الإيرادات
                          </span>

                          <span className="text-sm font-black text-slate-800">
                            {formatMoney(revenue)}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${barWidth}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 lg:w-24 lg:justify-end">
                        <span className="text-xs font-bold text-slate-400">
                          النسبة
                        </span>

                        <span className="text-lg font-black text-blue-600">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {topServicesError && (
            <p className="mt-4 text-sm font-semibold text-red-500">
              {topServicesError}
            </p>
          )}
        </div>

        {/* =================================================
            RECENT APPOINTMENTS
        ================================================= */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <SectionHeader
              title="أحدث المواعيد"
              subtitle="آخر المواعيد المسجلة"
              icon={<FiClock />}
            />
          </div>

          {recentAppointments.length === 0 ? (
            <EmptyState text="لا توجد مواعيد حديثة" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-right">المريض</th>

                    <th className="p-4 text-right">الخدمة</th>

                    <th className="p-4 text-right">التاريخ</th>

                    <th className="p-4 text-right">الوقت</th>

                    <th className="p-4 text-right">الحالة</th>

                    <th className="p-4 text-right">السعر</th>
                  </tr>
                </thead>

                <tbody>
                  {recentAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-800">
                            {appointment.patient?.name || "مريض غير محدد"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {appointment.patient?.phone}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-700">
                          {appointment.service?.name || "غير محددة"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {appointment.service?.category}
                        </p>
                      </td>

                      <td className="p-4 font-semibold text-slate-600">
                        {formatDate(appointment.date)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiClock className="text-blue-500" />

                          {appointment.startTime || "--"}

                          <span>-</span>

                          {appointment.endTime || "--"}
                        </div>
                      </td>

                      <td className="p-4">
                        <StatusBadge status={appointment.status} />
                      </td>

                      <td className="p-4 font-black text-slate-800">
                        {formatMoney(appointment.service?.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// COMPONENTS
// =====================================================

const ReportCard = ({ title, value, subtitle, icon, iconClass }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400">{title}</p>

        <p className="mt-2 text-2xl font-black text-slate-800">{value}</p>

        {subtitle && (
          <p className="mt-2 text-xs font-semibold text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const RevenueBox = ({ title, count, total, rows }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-black text-slate-800">{title}</h3>

        <p className="mt-1 text-xs text-slate-400">{count || 0} عملية</p>
      </div>

      <span className="text-lg font-black text-blue-600">
        {formatMoney(total)}
      </span>
    </div>

    <div className="mt-5 space-y-3">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{label}</span>

          <span className="text-sm font-bold text-slate-700">
            {formatMoney(value)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ProfitRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
    <span className="text-sm text-slate-400">{label}</span>

    <span className="font-black">{formatMoney(value)}</span>
  </div>
);

const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      {icon}
    </div>

    <div>
      <h2 className="font-black text-slate-800">{title}</h2>

      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  </div>
);

const AnalyticsRow = ({ label, value = 0, total = 0, type }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  const colors = {
    completed: "bg-emerald-500",
    pending: "bg-amber-500",
    progress: "bg-blue-500",
    cancelled: "bg-red-500",
    late: "bg-orange-500",
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{label}</span>

        <span className="text-sm font-black text-slate-700">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${colors[type] || "bg-blue-500"}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

const TypeStat = ({ label, value, total, icon }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            {icon}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-700">{label}</p>

            <p className="mt-1 text-xs text-slate-400">
              {percentage.toFixed(0)}%
            </p>
          </div>
        </div>

        <span className="text-xl font-black text-slate-800">{value}</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statuses = {
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

  const config = statuses[status] || {
    label: status || "غير محدد",
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1.5 text-xs font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const EmptyState = ({ text }) => (
  <div className="py-10 text-center">
    <FiFileText size={28} className="mx-auto text-slate-300" />

    <p className="mt-3 text-sm font-semibold text-slate-400">{text}</p>
  </div>
);

const SectionLoader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
  </div>
);

const ReportsLoading = () => (
  <div dir="rtl" className="min-h-[70vh] flex items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

      <p className="mt-4 text-sm font-semibold text-slate-500">
        جاري تحميل التقارير...
      </p>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div dir="rtl" className="min-h-[70vh] flex items-center justify-center p-6">
    <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <FiAlertCircle size={26} />
      </div>

      <h2 className="mt-4 text-lg font-black text-slate-800">
        فشل تحميل التقارير
      </h2>

      <p className="mt-2 text-sm text-slate-500">{error}</p>

      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        <FiRefreshCw />
        إعادة المحاولة
      </button>
    </div>
  </div>
);

// =====================================================
// HELPERS
// =====================================================

const formatMoney = (value) => {
  return `${Number(value || 0).toLocaleString("ar-EG")} ج.م`;
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export default Reports;
