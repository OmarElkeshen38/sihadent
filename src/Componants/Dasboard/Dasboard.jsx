import React from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiHeart,
  FiActivity,
  FiSmile,
} from "react-icons/fi";
import doctorImage from "../../assets/photo_2026-09-23_11-59-10.jpg";

export default function Dasboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 min-h-[430px] shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-blue-500/10 blur-2xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full min-h-[430px] flex-col lg:flex-row items-center justify-between gap-10 px-8 py-10 lg:px-14">
          {/* Doctor Image */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:w-[42%]">
            {/* Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />

            {/* Image container */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2.5rem] border border-white/10" />

              <div className="relative w-64 h-72 sm:w-72 sm:h-80 overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
                <img
                  src={doctorImage}
                  alt="Doctor"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/95 px-4 py-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <FiActivity size={20} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">الحالة</p>

                  <p className="text-sm font-black text-slate-800">متصل الآن</p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="order-2 lg:order-1 max-w-2xl text-right lg:w-[58%]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-200 backdrop-blur-md">
              <FiHeart size={15} />

              <span>SihaDent - Dental - Clinic</span>
            </div>

            <p className="mb-3 text-lg font-medium text-cyan-300">
              أهلاً وسهلاً دكتور أحمد 👋
            </p>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              أهلاً بك
              <span className="block bg-gradient-to-l from-cyan-300 via-blue-200 to-white bg-clip-text text-transparent">
                في عيادتك
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              كل شيء تحتاجه لإدارة مرضاك ومواعيدك وعلاجاتك
              <span className="text-white font-semibold"> في مكان واحد.</span>
            </p>

            {/* Quick Info */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                  <FiCalendar size={17} />
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-slate-400">اليوم</p>

                  <p className="text-sm font-bold text-white">جاهز لبدء يومك</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                  <FiSmile size={17} />
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-slate-400">عيادتك</p>

                  <p className="text-sm font-bold text-white">
                    ابتسامتهم تبدأ هنا
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
