import React, { useEffect, useState } from "react";
import {
  HiOutlineUserPlus,
  HiOutlineTrash,
  HiOutlineInformationCircle,
  HiOutlinePencilSquare,
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlineNoSymbol,
  HiOutlinePower,
} from "react-icons/hi2";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AddUserModal from "./AddUserModal";
import {
  getUsers,
  deleteUser,
  toggleUserStatus,
} from "../../redux/UsersSlice/UsersSlice";

export default function UserManagement() {
  const dispatch = useDispatch();

  const {
    users = [],
    stats = {},
    loading = false,
  } = useSelector((state) => state.users || {});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // ==================== GET USERS ====================
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // ==================== ADD ====================
  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // ==================== EDIT ====================
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // ==================== DELETE ====================
  const handleDelete = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await dispatch(deleteUser(userToDelete._id)).unwrap();

      toast.success("تم حذف المستخدم بنجاح");

      setUserToDelete(null);
    } catch (error) {
      toast.error(error || "فشل حذف المستخدم");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await dispatch(
        toggleUserStatus({
          id: user._id,
          isActive: !user.isActive,
        }),
      ).unwrap();

      toast.success(user.isActive ? "تم إيقاف المستخدم" : "تم تفعيل المستخدم");

      await dispatch(getUsers()).unwrap();
    } catch (error) {
      toast.error(error || "فشل تغيير حالة المستخدم");
    }
  };

  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">
      {/* ==================== ADD / EDIT MODAL ==================== */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* ==================== DELETE MODAL ==================== */}
      {userToDelete && (
        <div
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setUserToDelete(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <HiOutlineTrash size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-black text-gray-800">
                    حذف المستخدم
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    هل أنت متأكد من حذف هذا المستخدم؟
                  </p>
                </div>
              </div>
            </div>

            {/* User */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                    {userToDelete.name?.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-black text-gray-800">
                      {userToDelete.name}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {userToDelete.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 text-xs font-black hover:bg-gray-200 transition"
              >
                إلغاء
              </button>

              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الحذف...
                  </span>
                ) : (
                  "حذف المستخدم"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HEADER ==================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">إدارة المستخدمين</h2>

          <p className="text-[11px] text-gray-400 font-bold mt-1">
            إدارة المستخدمين والصلاحيات
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <HiOutlineUserPlus size={18} />
          إضافة مستخدم
        </button>
      </div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<HiOutlineUsers size={20} />}
          label="إجمالي المستخدمين"
          value={stats.total || 0}
          color="blue"
        />

        <StatCard
          icon={<HiOutlineUserCircle size={20} />}
          label="الأطباء"
          value={stats.doctors || 0}
          color="violet"
        />

        <StatCard
          icon={<HiOutlineUsers size={20} />}
          label="الاستقبال"
          value={stats.receptionists || 0}
          color="amber"
        />

        <StatCard
          icon={<HiOutlineUserCircle size={20} />}
          label="المستخدمون النشطون"
          value={stats.active || 0}
          color="emerald"
        />
      </div>

      {/* ==================== TABLE ==================== */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400">
                <th className="px-6 py-4">المستخدم</th>
                <th className="px-6 py-4">الدور</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-left">إجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

                      <span className="text-xs font-bold">
                        جاري تحميل المستخدمين...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <HiOutlineUsers size={35} />

                      <p className="text-sm font-bold mt-3">لا يوجد مستخدمون</p>

                      <p className="text-xs mt-1">
                        قم بإضافة أول مستخدم للنظام
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-blue-50/20 transition">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                          {user.name?.charAt(0)}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {user.name}
                          </p>

                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge isActive={user.isActive} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-left">
                      <div className="flex justify-end items-center gap-2">
                        {/* تفعيل / إيقاف */}
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-lg transition ${
                            user.isActive
                              ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                              : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={
                            user.isActive ? "إيقاف المستخدم" : "تفعيل المستخدم"
                          }
                        >
                          {user.isActive ? (
                            <HiOutlineNoSymbol size={18} />
                          ) : (
                            <HiOutlinePower size={18} />
                          )}
                        </button>

                        {/* حذف */}
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف المستخدم"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== INFO ==================== */}
      <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-700 text-xs">
        <HiOutlineInformationCircle size={18} className="shrink-0" />

        <p className="leading-relaxed">
          مدير النظام فقط يمكنه إدارة المستخدمين والصلاحيات.
        </p>
      </div>
    </div>
  );
}

/* ==================== STAT CARD ==================== */

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-400">{label}</p>

          <p className="text-2xl font-black text-gray-800 mt-2">{value}</p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ==================== ROLE BADGE ==================== */

function RoleBadge({ role }) {
  const map = {
    admin: {
      label: "مدير",
      className: "bg-blue-50 text-blue-600",
    },

    doctor: {
      label: "طبيب",
      className: "bg-violet-50 text-violet-600",
    },

    receptionist: {
      label: "استقبال",
      className: "bg-amber-50 text-amber-600",
    },

    staff: {
      label: "موظف",
      className: "bg-gray-100 text-gray-600",
    },
  };

  const item = map[role] || {
    label: role || "غير محدد",
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-lg text-[11px] font-black ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* ==================== STATUS BADGE ==================== */

function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-black ${
        isActive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-red-500"
        }`}
      />

      {isActive ? "نشط" : "غير نشط"}
    </span>
  );
}
