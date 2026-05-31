import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  CircleCheck,
  CircleAlert,
  Calendar,
  MoreVertical,
  Briefcase,
  Layers,
  FileCheck,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  RefreshCw,
  Share2,
  Settings,
  X,
  Sparkles,
  Info,
  DollarSign,
  Activity,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area
} from "recharts";
import { useApp } from "@/context/AppContext";
import { Transaction, Meeting, ClientBalance } from "@/types";

interface ChartTooltipItem {
  value: number;
  name: string;
  color?: string;
  fill?: string;
}

export default function Dashboard() {
  const {
    transactions,
    setTransactions,
    meetings,
    clientBalances,
    setClientBalances,
    darkMode,
    triggerToast
  } = useApp();

  // Local interactive states
  const [transactionSearch, setTransactionSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [meetingFilter, setMeetingFilter] = useState<"All" | "Business" | "Meditation" | "Dinner" | "Meetup">("All");
  const [clientStatusFilter, setClientStatusFilter] = useState<"All" | "Paid" | "Outstanding">("All");

  // Loading states for card refreshes
  const [refreshingCards, setRefreshingCards] = useState<Record<string, boolean>>({});

  // Dropdown open states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Helper to trigger simulated refresh loader
  const handleRefreshCard = (cardId: string) => {
    setRefreshingCards(prev => ({ ...prev, [cardId]: true }));
    setActiveDropdown(null);
    triggerToast(`Refreshing data for ${cardId}...`, "blank");
    setTimeout(() => {
      setRefreshingCards(prev => ({ ...prev, [cardId]: false }));
      triggerToast(`${cardId} is up to date!`, "success");
    }, 1000);
  };

  // Toggle dropdown trigger
  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(prev => (prev === id ? null : id));
  };

  // Close dropdown on outer clicks
  const closeAllDropdowns = () => setActiveDropdown(null);

  // Profit analytical grouped bar chart data (exact years 2016-2022 matching screenshots)
  const profitData = [
    { year: "2016", profit: 28000, income: 18000 },
    { year: "2017", profit: 41000, income: 24000 },
    { year: "2018", profit: 36000, income: 21000 },
    { year: "2019", profit: 48000, income: 30000 },
    { year: "2020", profit: 34000, income: 25000 },
    { year: "2021", profit: 42000, income: 31000 },
    { year: "2022", profit: 56000, income: 42000 }
  ];

  // Website dynamic statistics
  const websiteChartData = [
    { name: "M", traffic: 40 },
    { name: "T", traffic: 85 },
    { name: "W", traffic: 65 },
    { name: "T", traffic: 50 },
    { name: "F", traffic: 110 },
    { name: "S", traffic: 95 },
    { name: "S", traffic: 70 }
  ];

  const websiteStats = [
    { name: "Direct", value: 86471, pct: "15%", change: "down", color: "var(--primary)" },
    { name: "Organic", value: 57484, pct: "85%", change: "up", color: "rgb(6 182 212)" },
    { name: "Referral", value: 2534, pct: "48%", change: "up", color: "rgb(245 158 11)" },
    { name: "Mail", value: 977, pct: "36%", change: "down", color: "rgb(239 68 68)" }
  ];

  // Sparkline data for Total Revenue
  const revenueCurveData = [
    { name: "1", amount: 15 },
    { name: "2", amount: 12 },
    { name: "3", amount: 28 },
    { name: "4", amount: 18 },
    { name: "5", amount: 45 },
    { name: "6", amount: 32 },
    { name: "7", amount: 55 },
    { name: "8", amount: 48 },
  ];

  // New visitors columns sparkline data
  const visitorsData = [
    { day: "M", visitors: 40 },
    { day: "T", visitors: 30 },
    { day: "W", visitors: 65 },
    { day: "T", visitors: 50 },
    { day: "F", visitors: 120 },
    { day: "S", visitors: 85 },
    { day: "S", visitors: 60 }
  ];

  // Donut chart total sales (28% done in 1 Quarter)
  const donutSalesData = [
    { name: "Q1 Sales", value: 28, color: "var(--primary)" },
    { name: "Pending", value: 72, color: "rgb(241 245 249)" }
  ];

  // Radial Bar total sales completion (78%)
  const radialSalesData = [
    { name: "Sales Velocity", value: 78, fill: "rgb(34 197 94)" }
  ];

  // Memoized lists filtering for ultra-responsive search and status
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch =
        tx.source.toLowerCase().includes(transactionSearch.toLowerCase()) ||
        tx.method.toLowerCase().includes(transactionSearch.toLowerCase());
      return matchSearch;
    });
  }, [transactions, transactionSearch]);

  const filteredClients = useMemo(() => {
    return clientBalances.filter(client => {
      const matchSearch =
        client.clientName.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.id.toLowerCase().includes(clientSearch.toLowerCase());

      const matchStatus =
        clientStatusFilter === "All"
          ? true
          : clientStatusFilter === "Paid"
          ? client.balance === "Paid"
          : client.balance !== "Paid";

      return matchSearch && matchStatus;
    });
  }, [clientBalances, clientSearch, clientStatusFilter]);

  const filteredMeetings = useMemo(() => {
    return meetings.filter(meet => {
      if (meetingFilter === "All") return true;
      return meet.tag === meetingFilter;
    });
  }, [meetings, meetingFilter]);

  // Dynamic Theme tooltip rendering
  const renderCustomTooltip = (active?: boolean, payload: ChartTooltipItem[] = [], label?: string | number) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-xl shadow-xl border border-border-divider bg-bg-card text-text-primary text-xs font-semibold leading-relaxed transition-all duration-150"
        >
          <p className="font-bold underline mb-1 uppercase tracking-wider text-[10px] text-text-secondary">
            {label} Details
          </p>
          {payload.map((item, idx) => (
            <p key={idx} className="flex items-center gap-1.5 mt-0.5" style={{ color: item.color || item.fill }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color || item.fill }}></span>
              {item.name}: <span className="font-extrabold ml-1">${item.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 select-none" onClick={closeAllDropdowns}>
      {/* SECTION 1: Top Welcome Banner & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-stretch">
        {/* Congratulations Card */}
        <div className="md:col-span-2 xl:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs transition-all duration-300 group hover:shadow-md">
          {/* Decorative glowing gradient backing mesh */}
          <div className="absolute right-0 top-0 h-48 w-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-all"></div>
          <div className="absolute left-1/4 bottom-0 h-32 w-32 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 z-10 w-full h-full">
            {/* Left Content */}
            <div className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-text-primary">
                  Congratulations <span className="text-primary font-extrabold drop-shadow-sm">John!</span> 🎉
                </h1>
                <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                  You have done <span className="text-primary font-bold text-sm">72%</span> 😎 more sales today.
                  Check your new raising badge and account level inside your developer profile.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => triggerToast("Navigating to Achievements dashboard!", "blank")}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer hover:shadow-purple-500/20 active:scale-98 transition-all"
                >
                  View Profile Badges
                </button>
                <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20 uppercase tracking-widest">
                  Level 4 Architect
                </span>
              </div>
            </div>

            {/* Right Character Vector Placeholder matching mockup */}
            <div className="relative self-center sm:self-end h-32 w-48 flex-shrink-0 flex items-end justify-center overflow-visible select-none">
              {/* Abstract Purple Foliage Backdrop */}
              <div className="absolute left-4 bottom-4 h-16 w-8 bg-purple-400/20 rounded-full blur-xs origin-bottom rotate-[-25deg]"></div>
              <div className="absolute right-6 bottom-6 h-20 w-10 bg-purple-300/30 rounded-full blur-xs origin-bottom rotate-[30deg]"></div>

              {/* 3D Stylized Character via clean layered SVG */}
              <svg className="w-28 h-32 overflow-visible drop-shadow-lg" viewBox="0 0 100 120" fill="none">
                {/* Body/Shoulders */}
                <path d="M20,110 C20,80 80,80 80,110 Z" fill="var(--primary)" />
                <path d="M35,75 L65,75 T65,85 L35,85 Z" fill="rgb(224 210 252)" opacity="0.6" />

                {/* Neck */}
                <rect x="44" y="65" width="12" height="15" rx="6" fill="rgb(251 207 232)" />

                {/* Head */}
                <circle cx="50" cy="45" r="22" fill="rgb(254 215 170)" />

                {/* Ears */}
                <circle cx="26" cy="45" r="4.5" fill="rgb(251 211 141)" />
                <circle cx="74" cy="45" r="4.5" fill="rgb(251 211 141)" />

                {/* Hair - Cute bright blue stylized hair matching mockup */}
                <path d="M26,45 C24,24 76,24 74,45 C70,30 30,30 26,45 Z" fill="rgb(59 130 246)" />
                <path d="M40,25 C48,15 62,18 68,28 C55,20 45,22 40,25 Z" fill="rgb(37 99 235)" />

                {/* Eyes */}
                <circle cx="43" cy="43" r="2.5" fill="rgb(30 41 59)" />
                <circle cx="57" cy="43" r="2.5" fill="rgb(30 41 59)" />

                {/* Blushing Cheeks */}
                <ellipse cx="39" cy="48" rx="3" ry="1.5" fill="rgb(244 63 94)" opacity="0.5" />
                <ellipse cx="61" cy="48" rx="3" ry="1.5" fill="rgb(244 63 94)" opacity="0.5" />

                {/* Smile */}
                <path d="M46,52 Q50,56 54,52" stroke="rgb(30 41 59)" strokeWidth="2" strokeLinecap="round" />

                {/* Coffee Cup / Mug held by character */}
                <g transform="translate(62, 85)">
                  {/* Mug body */}
                  <rect x="0" y="0" width="16" height="22" rx="4" fill="rgb(250 250 250)" stroke="rgb(212 212 216)" strokeWidth="1" />
                  {/* Lid */}
                  <rect x="-1" y="-3" width="18" height="4" rx="1.5" fill="rgb(161 161 170)" />
                  {/* Handle */}
                  <path d="M16,5 Q22,9 16,14" stroke="rgb(250 250 250)" strokeWidth="3" fill="none" />
                  <span className="text-[6px] font-bold text-gray-500 absolute"></span>
                </g>
              </svg>

              {/* Status Dot */}
              <span className="absolute bottom-2 right-4 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Small Metric: Revenue Card */}
        <div className="col-span-1 xl:col-span-2 bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md relative overflow-hidden">
          {refreshingCards["Revenue"] && (
            <div className="absolute inset-0 bg-bg-card/75 backdrop-blur-xs flex items-center justify-center z-10">
              <RefreshCw size={22} className="animate-spin text-primary" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center font-bold">
              <DollarSign size={20} />
            </div>
            <div className="relative">
              <button
                onClick={(e) => toggleDropdown("Revenue", e)}
                className="text-text-secondary hover:text-text-primary p-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>
              {activeDropdown === "Revenue" && (
                <div className="absolute right-0 mt-1 w-32 bg-bg-card border border-border-divider rounded-xl shadow-xl z-20 overflow-hidden text-xs font-semibold py-1">
                  <button
                    onClick={() => handleRefreshCard("Revenue")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-primary flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} /> Refresh
                  </button>
                  <button
                    onClick={() => {
                        triggerToast("Shared live Revenue snapshot!", "success");
                        setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-primary flex items-center gap-1.5"
                  >
                    <Share2 size={12} /> Share
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-1">
            <span className="text-[10px] sm:text-xs text-text-secondary font-bold tracking-wider uppercase">Revenue</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-black font-display text-text-primary">$95k</h3>
              <span className="text-[10px] sm:text-xs font-bold text-green-500 inline-flex items-center">
                +12%
              </span>
            </div>
            <p className="text-[10px] text-text-secondary font-semibold">Revenue Increase</p>
          </div>
        </div>

        {/* Small Metric: Transactions Card */}
        <div className="col-span-1 xl:col-span-2 bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md relative overflow-hidden">
          {refreshingCards["Transactions"] && (
            <div className="absolute inset-0 bg-bg-card/75 backdrop-blur-xs flex items-center justify-center z-10">
              <RefreshCw size={22} className="animate-spin text-primary" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold">
              <Layers size={18} />
            </div>
            <div className="relative">
              <button
                onClick={(e) => toggleDropdown("Transactions", e)}
                className="text-text-secondary hover:text-text-primary p-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>
              {activeDropdown === "Transactions" && (
                <div className="absolute right-0 mt-1 w-32 bg-bg-card border border-border-divider rounded-xl shadow-xl z-20 overflow-hidden text-xs font-semibold py-1">
                  <button
                    onClick={() => handleRefreshCard("Transactions")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-primary flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} /> Refresh
                  </button>
                  <button
                    onClick={() => {
                        triggerToast("Opened internal pipelines summary", "blank");
                        setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-primary flex items-center gap-1.5"
                  >
                    <Info size={12} /> View Details
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-1">
            <span className="text-[10px] sm:text-xs text-text-secondary font-bold tracking-wider uppercase">Transactions</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-black font-display text-text-primary">12.1k</h3>
              <span className="text-[10px] sm:text-xs font-bold text-green-500 inline-flex items-center">
                +38%
              </span>
            </div>
            <p className="text-[10px] text-text-secondary font-semibold">Daily Transactions</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Total Profit analytical bar chart & Total sales donut row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Total Profit Grouped bar chart card */}
        <div className="lg:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden">
          {refreshingCards["Total Profit"] && (
            <div className="absolute inset-0 bg-bg-card/75 backdrop-blur-xs flex items-center justify-center z-10-1">
              <RefreshCw size={24} className="animate-spin text-primary" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div>
              <h3 className="font-display font-bold text-text-primary text-base">Total Profit</h3>
              <p className="text-[11px] sm:text-xs text-text-secondary">Weekly sales insight & profits overview</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block"></span>
                <span className="text-[11px] text-text-secondary font-semibold">Total Profit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block"></span>
                <span className="text-[11px] text-text-secondary font-semibold">Income</span>
              </div>
              {/* Reset/Interact button */}
              <button
                onClick={() => {
                  triggerToast("Recalculating accounting ledger logs!", "blank");
                }}
                className="text-[11px] text-primary font-bold hover:underline cursor-pointer ml-1"
              >
                Recalculate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Real responsive Bar Chart */}
            <div className="md:col-span-8 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="year"
                    fontSize={11}
                    stroke={darkMode ? "var(--text-secondary)" : "var(--text-secondary)"}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={11}
                    stroke={darkMode ? "var(--text-secondary)" : "var(--text-secondary)"}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                    content={({ active, payload, label }) => renderCustomTooltip(active, payload as unknown as ChartTooltipItem[], label)}
                  />
                  {/* Styled bars matching mockup style and color theme */}
                  <Bar dataKey="profit" name="Profit" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={10} />
                  <Bar dataKey="income" name="Income" fill="rgb(34 197 94)" radius={[4, 4, 0, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Balances details split */}
            <div className="md:col-span-4 flex flex-col justify-between py-2 border-t md:border-t-0 md:border-l border-border-divider/70 pl-0 md:pl-6 h-full space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black font-display text-text-primary">$482.85k</span>
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-lg">
                      +14.8%
                    </span>
                  </div>
                  <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-widest block mt-0.5">
                    Last month balance $234.40k
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <TrendingUp size={12} />
                      </span>
                      <span className="text-text-secondary">Total Profit</span>
                    </div>
                    <span className="text-text-primary font-bold font-mono">$48,568.20</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                        <Activity size={12} />
                      </span>
                      <span className="text-text-secondary">Total Income</span>
                    </div>
                    <span className="text-text-primary font-bold font-mono">$38,453.25</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                        <TrendingDown size={12} />
                      </span>
                      <span className="text-text-secondary">Total Expense</span>
                    </div>
                    <span className="text-text-primary font-bold font-mono">$2,453.45</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => triggerToast("Ledger breakdown generated! Sending to printer", "success")}
                className="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-md hover:shadow-purple-500/15 cursor-pointer active:scale-98 transition-all"
              >
                View Detailed Ledger
              </button>
            </div>
          </div>
        </div>

        {/* Total Sales, Donut, and Progress Columns (Spans 4/12) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          {/* Card 1: Total Sales Donut Card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden">
            <div className="space-y-3 z-10">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-text-primary text-sm">Total Sales</h3>
                <p className="text-[10px] text-text-secondary uppercase font-extrabold tracking-widest">
                  Calculated in last 7 days
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black font-display text-text-primary">$25,980</h3>
                <span className="inline-flex items-center text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-lg">
                  <TrendingUp size={10} className="mr-0.5" />
                  15.6%
                </span>
              </div>
            </div>

            {/* Circular Donut via Recharts */}
            <div className="relative h-24 w-24 flex-shrink-0 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutSalesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={38}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="var(--primary)" />
                    <Cell fill={darkMode ? "var(--border-divider)" : "rgb(241 245 249)"} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Centered Overlay HUD */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black text-text-primary leading-none">28%</span>
                <span className="text-[7px] text-text-secondary uppercase font-semibold mt-0.5 scale-90">1 Quarter</span>
              </div>
            </div>
          </div>

          {/* Card 2 & 3: Inline Side-by-Side mini visualizers */}
          <div className="grid grid-cols-2 gap-6 items-stretch">
            {/* Total Revenue sparkline */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md relative overflow-hidden">
              <div>
                <span className="text-lg sm:text-xl font-black font-display text-text-primary">$35.4k</span>
                <p className="text-[10px] text-text-secondary font-extrabold block uppercase tracking-wider mt-0.5">
                  Total Revenue
                </p>
              </div>

              {/* Chart spline curve */}
              <div className="h-10 w-full mt-4 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueCurveData}>
                    <defs>
                      <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <span className="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                              ${payload[0].value}k
                            </span>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGlow)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Total Sales semi-circle progress circle */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md relative overflow-hidden">
              <div>
                <span className="text-lg sm:text-xl font-black font-display text-text-primary">135k</span>
                <p className="text-[10px] text-text-secondary font-extrabold block uppercase tracking-wider mt-0.5">
                  Total Sales
                </p>
              </div>

              {/* Semi-circular meter radial representation */}
              <div className="relative h-12 w-full mt-4 flex items-center justify-center select-none">
                <ResponsiveContainer width={100} height={100} className="absolute -bottom-8">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="75%"
                    outerRadius="105%"
                    data={radialSalesData}
                    startAngle={180}
                    endAngle={0}
                    barSize={6}
                  >
                    <RadialBar
                      background={{ fill: darkMode ? "var(--border-divider)" : "rgb(241 245 249)" }}
                      dataKey="value"
                      cornerRadius={6}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute top-2 text-center">
                  <span className="text-xs font-black text-text-primary">78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Pipelines, Tiny metrics, Website stats block */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-stretch">
        {/* Transactions List */}
        <div className="xl:col-span-4 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col xl:h-[395px] transition-all hover:shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-5 select-none">
            <h3 className="font-display font-bold text-text-primary text-sm">Transactions</h3>
            <button
              onClick={() => triggerToast("Opening transaction settings...", "blank")}
              className="text-text-secondary hover:text-text-primary p-1 rounded-lg cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>
          </div>

          {/* Transactions List Items */}
          <div className="flex-1 flex flex-col justify-between">
            {filteredTransactions.slice(0, 5).map((tx) => {
              const isCredit = tx.amount > 0;
              // Map the sources to corresponding beautiful classes and icons
              let iconBg = "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
              let IconElement = <DollarSign size={16} />;
              
              if (tx.source === "Paypal") {
                iconBg = "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400";
                IconElement = <DollarSign size={16} />;
              } else if (tx.source === "Credit Card") {
                iconBg = "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400";
                IconElement = <Layers size={16} />;
              } else if (tx.source === "Mastercard") {
                iconBg = "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
                IconElement = <Layers size={16} />;
              } else if (tx.source === "Wallet") {
                iconBg = "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
                IconElement = <Briefcase size={16} />;
              } else {
                iconBg = "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400";
                IconElement = <Activity size={16} />;
              }

              return (
                <div
                  key={tx.id}
                  onClick={() => {
                    triggerToast(`Transaction Details: ${tx.source} - ${tx.method} (${tx.amount > 0 ? "+" : ""}$${tx.amount.toLocaleString()})`, "blank");
                  }}
                  className="flex items-center justify-between py-1 hover:bg-gray-50/50 dark:hover:bg-white/3 rounded-xl px-1.5 transition-all cursor-pointer group/line"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs ${iconBg}`}>
                      {IconElement}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary group-hover/line:text-primary transition-colors">
                        {tx.source}
                      </h4>
                      <p className="text-[10px] text-text-secondary mt-0.5">{tx.method}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className={`text-xs font-extrabold ${isCredit ? "text-green-500" : "text-text-primary"}`}>
                      {isCredit ? "+" : ""}${tx.amount.toLocaleString()}
                    </span>
                    <span>
                      {isCredit ? (
                        <TrendingUp size={12} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <TrendingDown size={12} className="text-red-500 flex-shrink-0" />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Stacked Metrics & Visitors (Center xl:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col justify-between gap-6 xl:h-[395px]">
          {/* Card 1: Side by Side Logistics & Reports Cards */}
          <div className="grid grid-cols-2 gap-6 h-[142px]">
            {/* Logistics Widget */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md h-full">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center font-bold">
                  <Briefcase size={16} />
                </div>
                <button
                  onClick={() => triggerToast("Viewing logistics details", "blank")}
                  className="text-text-secondary hover:text-text-primary p-1 rounded-lg cursor-pointer"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
              <div className="mt-2 space-y-0.5">
                <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase">Logistics</span>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <h3 className="text-lg font-black font-display text-text-primary">$44k</h3>
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1 py-0.5 rounded-md">+42%</span>
                </div>
                <p className="text-[9px] text-text-secondary font-semibold">Revenue Increase</p>
              </div>
            </div>

            {/* Reports Widget */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md h-full">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold">
                  <FileCheck size={16} />
                </div>
                <button
                  onClick={() => triggerToast("Viewing reports database", "blank")}
                  className="text-text-secondary hover:text-text-primary p-1 rounded-lg cursor-pointer"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
              <div className="mt-2 space-y-0.5">
                <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase">Reports</span>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <h3 className="text-lg font-black font-display text-text-primary">268</h3>
                  <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1 py-0.5 rounded-md">-28%</span>
                </div>
                <p className="text-[9px] text-text-secondary font-semibold">System Bugs</p>
              </div>
            </div>
          </div>

          {/* New Visitors detailed widget with Columns mini chart */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs transition-all hover:shadow-md flex flex-row items-center justify-between flex-1">
            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase block">New Visitors</span>
                <p className="text-[10px] text-text-secondary font-medium leading-normal max-w-[130px]">48% new visitors this week.</p>
              </div>
              <h3 className="text-2xl font-black font-display text-text-primary flex items-center gap-1.5">
                12,480{" "}
                <span className="inline-flex items-center text-[10px] text-green-500 font-extrabold gap-0.5">
                  <TrendingUp size={11} /> 28
                </span>
              </h3>
            </div>

            {/* Sparkline column graph */}
            <div className="h-28 w-[140px] flex-shrink-0 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Bar dataKey="visitors" fill="var(--primary)" radius={[3, 3, 0, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Website Traffic Statistics (Right xl:col-span-4) */}
        <div className="xl:col-span-4 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col xl:h-[395px] justify-between transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-text-primary text-sm">Website Statistics</h3>
              <button
                onClick={() => triggerToast("Simulated analytic reports exported!", "success")}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between mb-5 gap-3">
              <div>
                <h3 className="text-3xl font-black font-display text-text-primary leading-none">4,590</h3>
                <p className="text-[10px] text-text-secondary uppercase font-extrabold tracking-widest mt-1.5">Total Traffic</p>
              </div>
              <div className="h-14 w-28 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={websiteChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Bar dataKey="traffic" fill="var(--primary)" radius={[2, 2, 0, 0]} barSize={5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sources Lists details */}
          <div className="flex-1 flex flex-col justify-between pt-1">
            {websiteStats.map((src) => {
              const isUp = src.change === "up";
              return (
                <div
                  key={src.name}
                  onClick={() => triggerToast(`Filtered traffic breakdown for source: ${src.name}`, "blank")}
                  className="flex items-center justify-between py-1 hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 rounded-lg px-1 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: src.color }}></span>
                    <span className="text-xs font-semibold text-text-secondary">{src.name}</span>
                  </div>
                  <div className="flex items-center gap-3.5 pl-4 flex-1 justify-end">
                    <span className="text-xs font-extrabold text-text-primary font-mono">{src.value.toLocaleString()}</span>
                    <span
                      className={`text-[11px] font-bold flex items-center justify-end w-12 gap-0.5 ${
                        isUp
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {src.pct}
                      {isUp ? (
                        <TrendingUp size={11} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <TrendingDown size={11} className="text-red-500 flex-shrink-0" />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4: Dual Table Grids - Client Balances & Meeting Schedule */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Client Balances and Invoice Stats table */}
        <div className="xl:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4 border-b border-border-divider/70">
            <div>
              <h3 className="font-display font-bold text-text-primary text-sm flex items-center gap-1.5">
                Client Balances
                <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-lg uppercase tracking-wide">
                  {filteredClients.length} clients
                </span>
              </h3>
              <p className="text-[11px] text-text-secondary font-semibold">Total client transactions, balances, and billing status</p>
            </div>

            {/* Quick Interactive status tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setClientStatusFilter("All")}
                className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer uppercase tracking-widest ${
                  clientStatusFilter === "All"
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-text-secondary hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setClientStatusFilter("Paid")}
                className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer uppercase tracking-widest ${
                  clientStatusFilter === "Paid"
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-text-secondary hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setClientStatusFilter("Outstanding")}
                className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer uppercase tracking-widest ${
                  clientStatusFilter === "Outstanding"
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-text-secondary hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                }`}
              >
                With Bal
              </button>
            </div>
          </div>

          {/* Quick client search box */}
          <div className="relative mb-4">
            <span className="absolute left-3.5 top-3 text-text-secondary">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search clients by ID, email, name..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full bg-bg-app border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder:text-xs"
            />
            {clientSearch && (
              <button
                onClick={() => setClientSearch("")}
                className="absolute right-3.5 top-3 text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[340px]">
            <table className="w-full text-left border-collapse select-text">
              <thead>
                <tr className="border-b border-border-divider/50 text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">
                  <th className="py-3 px-3">#ID</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Client Info</th>
                  <th className="py-3 px-3">Total Billed</th>
                  <th className="py-3 px-3 text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider/30">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs font-bold text-text-secondary">
                      No client balances matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const isPaid = client.balance === "Paid";
                    return (
                      <tr
                        key={client.id}
                        onClick={() => {
                          triggerToast(`Selected Client: ${client.clientName} (Total billed: $${client.total})`, "success");
                        }}
                        className="hover:bg-gray-50/70 dark:hover:bg-white/3 transition-all text-xs text-text-primary font-semibold cursor-pointer group/tr"
                      >
                        <td className="py-3.5 px-3 text-primary font-extrabold font-mono text-[11px] group-hover/tr:underline">
                          {client.id}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center">
                            {client.status === "up" && (
                              <div className="h-6.5 w-6.5 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center" title="Upward Trend">
                                <TrendingUp size={12} />
                              </div>
                            )}
                            {client.status === "down" && (
                              <div className="h-6.5 w-6.5 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center" title="Downward Trend">
                                <TrendingDown size={12} />
                              </div>
                            )}
                            {client.status === "success" && (
                              <div className="h-6.5 w-6.5 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center" title="Settled Successfully">
                                <CircleCheck size={12} />
                              </div>
                            )}
                            {client.status === "pending" && (
                              <div className="h-6.5 w-6.5 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center" title="Pending Assessment">
                                <CircleAlert size={12} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={client.avatar}
                              alt={client.clientName}
                              referrerPolicy="no-referrer"
                              className="h-8.5 w-8.5 rounded-full object-cover border border-border-divider/50 group-hover/tr:scale-105 transition-transform"
                            />
                            <div>
                              <h4 className="font-extrabold text-text-primary leading-tight group-hover/tr:text-primary transition-colors">
                                {client.clientName}
                              </h4>
                              <p className="text-[10px] text-text-secondary font-medium leading-none mt-0.5">
                                {client.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-extrabold font-mono text-text-primary select-all">
                          ${client.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          {isPaid ? (
                            <span className="inline-flex px-2 py-0.5 text-[9px] font-extrabold bg-green-500/15 text-green-500 rounded-md uppercase tracking-wider">
                              Paid
                            </span>
                          ) : (
                            <span
                              className={`font-mono font-extrabold select-all ${
                                (client.balance as number) < 0
                                  ? "text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-lg text-[11px]"
                                  : "text-text-primary text-[12px]"
                              }`}
                            >
                              {(client.balance as number) < 0 ? "-" : ""}${Math.abs(client.balance as number).toLocaleString()}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Meeting Schedule List */}
        <div className="xl:col-span-4 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-text-primary text-sm">Meeting Schedule</h3>
                <p className="text-[11px] text-text-secondary font-semibold">Keep track of your corporate calendar</p>
              </div>

              {/* Three dots option dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown("Meetings", e)}
                  className="text-text-secondary hover:text-text-primary p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  <MoreVertical size={16} />
                </button>
                {activeDropdown === "Meetings" && (
                  <div className="absolute right-0 mt-1 w-36 bg-bg-card border border-border-divider rounded-xl shadow-xl z-20 overflow-hidden text-xs font-semibold py-1">
                    <button
                      onClick={() => {
                        setMeetingFilter("All");
                        setActiveDropdown(null);
                        triggerToast("Showing all scheduled meetings", "blank");
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-primary"
                    >
                      Show All
                    </button>
                    <button
                      onClick={() => {
                        setMeetingFilter("Business");
                        setActiveDropdown(null);
                        triggerToast("Showing Business meetings only", "blank");
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-primary"
                    >
                      Business only
                    </button>
                    <button
                      onClick={() => {
                        setMeetingFilter("Meditation");
                        setActiveDropdown(null);
                        triggerToast("Showing meditation breaks", "blank");
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-primary"
                    >
                      Meditation only
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* In-Card Quick Badges Filter */}
            <div className="flex flex-wrap gap-1.5 mb-5 pb-3 border-b border-border-divider/50">
              {(["All", "Business", "Meditation", "Dinner", "Meetup"] as const).map(tag => (
                <button
                  key={tag}
                  onClick={() => setMeetingFilter(tag)}
                  className={`px-2 py-1 text-[9px] font-extrabold rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
                    meetingFilter === tag
                      ? "bg-primary/20 text-primary border border-primary/35"
                      : "bg-gray-50 text-text-secondary border border-border-divider/30 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredMeetings.length === 0 ? (
                <div className="py-12 text-center text-xs font-bold text-text-secondary">
                  No meetings in this category.
                </div>
              ) : (
                filteredMeetings.map((meet) => (
                  <div
                    key={meet.id}
                    onClick={() => {
                      triggerToast(`Meeting details: ${meet.title} on ${meet.date} at ${meet.time}`, "blank");
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/50 dark:hover:bg-white/3 transition-all cursor-pointer group/meet"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={meet.avatar}
                        alt="Meeting Invitee"
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-full object-cover border border-border-divider/50 group-hover/meet:scale-105 transition-transform"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-text-primary group-hover/meet:text-primary transition-colors leading-tight">
                          {meet.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-1 font-semibold">
                          <Calendar size={10} className="text-primary" />
                          <span>
                            {meet.date} | <span className="font-mono text-[9px]">{meet.time}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex px-2 py-0.5 text-[9px] font-extrabold rounded-lg uppercase tracking-wider ${
                          meet.tag === "Business"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                            : meet.tag === "Meditation"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                            : meet.tag === "Dinner"
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {meet.tag}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-divider/50">
            <button
              onClick={() => triggerToast("Launching corporate calendar...", "success")}
              className="w-full py-2.5 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 text-primary font-bold text-xs rounded-xl cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar size={14} />
              Open Corporate Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

