import React, { useEffect, useMemo, useState } from "react";
import {
  FiBox,
  FiAlertTriangle,
  FiPlus,
  FiSearch,
  FiLayers,
  FiMinusCircle,
} from "react-icons/fi";

import InventoryTable from "./InventoryTable";
import InventoryLog from "./InventoryLog";
import AddItemModal from "./AddItemModal";
import UseItemModal from "./UseItemModal";
import { INVENTORY_URLS, privateAxiosInstance } from "../../Services/api";

export default function InventoryDashboard() {

  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const getInventoryStats = async () => {
    try {
      setLoading(true);
      const response = await privateAxiosInstance.get(
        INVENTORY_URLS.state

      );

      setStatsData(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getInventory = async () => {

    try {

      setLoadingInventory(true);

      const response =
        await privateAxiosInstance.get(
          `${INVENTORY_URLS.inventory}?page=1&limit=20`
        );

      setInventory(response.data.data);

      console.log(response);


    } catch (error) {

      console.log(error);

    } finally {

      setLoadingInventory(false);

    }
  };

  useEffect(() => {
    getInventoryStats();
    getInventory();
  }, []);

  const stats = [
    { id: 1, label: "إجمالي الأصناف", value: statsData?.totalItems || "0", icon: <FiBox size={20} />, color: "blue" },
    { id: 2, label: "أصناف منخفضة", value: statsData?.lowStockItems || "0", icon: <FiAlertTriangle size={20} />, color: "amber" },
    { id: 3, label: "نفذ المخزون", value: statsData?.outOfStockItems || "0", icon: <FiLayers size={20} />, color: "red" },
  ];

  const categories = useMemo(() => {

    const uniqueCategories = [
      ...new Set(
        inventory.map((item) => item.category)
      ),
    ];

    return uniqueCategories;

  }, [inventory]);

  const filteredInventory = useMemo(() => {

    return inventory.filter((item) => {

      const matchesSearch =
        item.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all"
          ? true
          : item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

  }, [inventory, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            إدارة المخزون
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            متابعة المواد الطبية
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => setIsUseModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm hover:bg-amber-600 transition"
          >
            تسجيل استهلاك
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            إضافة صنف
          </button>

        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        dir="rtl"
      >

        {stats.map((stat) => (

          <div
            key={stat.id}
            className="
            bg-white border border-gray-100
            rounded-3xl p-5
            shadow-sm hover:shadow-md
            transition-all duration-300
          "
          >

            {/* Top */}
            <div className="flex items-start justify-between mb-5">

              <div
                className={`
                w-12 h-12 rounded-2xl
                flex items-center justify-center
                ${getColor(stat.color)}
              `}
              >
                {stat.icon}
              </div>

              <span className="text-[11px] font-black text-gray-400">
                {stat.label}
              </span>

            </div>

            {/* Value */}
            {loading ? (

              <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />

            ) : (

              <p className="text-3xl font-black text-gray-800 tracking-tight">
                {stat.value}
              </p>

            )}

          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">

        {/* Search */}
        <div className="relative flex-1 max-w-sm">

          <FiSearch
            className="
              absolute right-3 top-1/2
              -translate-y-1/2 text-gray-400
            "
          />

          <input
            type="text"
            placeholder="بحث عن صنف..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="
              w-full pr-10 pl-4 py-3
              rounded-2xl
              bg-white border border-gray-200
              text-sm font-medium
              outline-none
              focus:border-blue-400
              focus:ring-4 focus:ring-blue-100
              transition-all
            "
          />
        </div>

        {/* Categories */}
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="
            px-4 py-3 rounded-2xl
            border border-gray-200
            bg-white text-sm font-medium
            outline-none
            focus:border-blue-400
            focus:ring-4 focus:ring-blue-100
          "
        >

          <option value="all">
            كل التصنيفات
          </option>

          {categories.map((category) => (

            <option
              key={category}
              value={category}
            >
              {category}
            </option>

          ))}
        </select>
      </div>

      {/* Tables */}
      <div className="space-y-6">

        {/* Inventory Table */}
        <div
          className="
            bg-white border border-gray-200
            rounded-[2rem] overflow-hidden
            shadow-sm
          "
        >

          <InventoryTable
            inventory={filteredInventory}
            loading={loading}
            setInventory={setInventory}
            setSelectedItem={setSelectedItem}
            setIsAddModalOpen={setIsAddModalOpen}
          />

        </div>

        {/* Logs */}
        <div
          className="
            bg-white border border-gray-200
            rounded-[2rem] overflow-hidden
            shadow-sm
          "
        >

          <InventoryLog />

        </div>

      </div>

      {/* Modal */}
      {isAddModalOpen && (
        <Modal onClose={() => {
          setIsAddModalOpen(false);
          setSelectedItem(null);
        }}>
          <AddItemModal item={selectedItem} onClose={() => {
            setIsAddModalOpen(false);
            setSelectedItem(null);
          }} setInventory={setInventory} />
        </Modal>
      )}

      {isUseModalOpen && (
        <Modal onClose={() => setIsUseModalOpen(false)}>
          <UseItemModal onClose={() => setIsUseModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

/* Modal */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
        {children}
      </div>

    </div>
  );
}

/* Colors */
function getColor(color) {
  const map = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return map[color] || "bg-gray-50 text-gray-600";
}