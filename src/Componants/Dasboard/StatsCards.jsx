import React, { useMemo } from "react";
import { LuUsers, LuCalendarDays, LuStethoscope, LuTrendingUp, } from "react-icons/lu";
import { useSelector } from "react-redux";

export default function StatsCards({
  data,
  loading,
}) {

  const {
        appointments,
        loadingApp,
    } = useSelector((state) => state.dailyAppointments);

    const todayAppointments = useMemo(() => {
            return appointments || [];
        }, [appointments]);

  const stats = [
    {
      id: 1,
      title: "إجمالي المرضى",
      value: data?.totalPatients || 0,
      icon: <LuUsers />,
      trend: `+${data?.newPatientsLastMonth || 0}`,
      sub: "آخر شهر",
      color: "blue",
    },

    {
      id: 2,
      title: "حجوزات اليوم",
      value: `${todayAppointments.length}` || 0,
      icon: <LuCalendarDays />,
      // trend: `${todayAppointments.length}` || "لا يوجد",
      sub: "مكتمل",
      color: "emerald",
    },

    {
      id: 3,
      title: "إجمالي الدخل",
      value: `${data?.totalIncome || 0} ج.م`,
      icon: <LuStethoscope />,
      trend: data?.revenueGrowth || "0%",
      sub: "نمو الإيرادات",
      color: "purple",
    },

    {
      id: 4,
      title: "معدل الإنجاز",
      value: data?.completionRate || "0%",
      icon: <LuTrendingUp />,
      trend:
        data?.lowStockAlerts > 0
          ? `${data?.lowStockAlerts} تنبيه`
          : "ممتاز",

      sub: "المخزون",
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      {stats.map((item) => (

        <div
          key={item.id}
          className="
            group relative bg-white
            rounded-2xl border border-gray-200 p-5
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
            hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            transition-all duration-300
            hover:-translate-y-1
          "
        >

          {/* Glow */}
          <div
            className="
              absolute inset-0 rounded-2xl
              opacity-0 group-hover:opacity-100
              transition pointer-events-none
              bg-gradient-to-br from-blue-50 to-transparent
            "
          />

          <div className="relative flex justify-between items-start mb-4">

            {/* Icon */}
            <div
              className={`
                p-3 rounded-xl
                bg-${item.color}-50
                text-${item.color}-600
                group-hover:scale-110
                transition-transform
              `}
            >
              {item.icon}
            </div>

            {/* Trend */}
            <div className="text-left">

              <p
                className={`
                  text-xs font-bold
                  ${String(item.trend).includes("+")
                    ? "text-emerald-600"
                    : "text-gray-500"
                  }
                `}
              >
                {item.trend}
              </p>

              <p className="text-[10px] text-gray-400">
                {item.sub}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1">

            <p
              className="
                text-xs text-gray-400
                font-medium tracking-wide
              "
            >
              {item.title}
            </p>

            {loading ? (

              <div className="h-8 w-24 rounded-lg bg-gray-100 animate-pulse" />

            ) : (

              <h3
                className="
                  text-3xl font-bold
                  text-gray-900 tracking-tight
                "
              >
                {item.value}
              </h3>

            )}
          </div>
        </div>
      ))}
    </div>
  );
}