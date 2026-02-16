"use client";

import { useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function AdminDashboard() {
  // 🔹 Dummy Data
  const totalOrders = 120;
  const delivered = 80;
  const pending = 25;
  const cancelled = 15;

  const dailyOrders = [12, 18, 9, 14, 20, 11, 16];

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Orders",
        data: dailyOrders,
        backgroundColor: "#f59e0b",
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ["Delivered", "Pending", "Cancelled"],
    datasets: [
      {
        data: [delivered, pending, cancelled],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const [todoList, setTodoList] = useState([
    { id: 1, task: "Check new honey stock", status: "Pending" },
    { id: 2, task: "Verify pending payments", status: "Done" },
  ]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    setTodoList([
      ...todoList,
      { id: Date.now(), task: newTask, status: "Pending" },
    ]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTodoList(
      todoList.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Done" ? "Pending" : "Done" }
          : t
      )
    );
  };

  const deleteTask = (id: number) => {
    setTodoList(todoList.filter((t) => t.id !== id));
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        🍯 Honey Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={totalOrders} color="bg-amber-500" />
        <StatCard title="Delivered" value={delivered} color="bg-green-500" />
        <StatCard title="Pending" value={pending} color="bg-yellow-500" />
        <StatCard title="Cancelled" value={cancelled} color="bg-red-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow col-span-2 h-80">
          <Bar data={barData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex justify-center items-center">
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`${color} text-white p-6 rounded-xl shadow`}>
      <h4 className="text-sm">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}