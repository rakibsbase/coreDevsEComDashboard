import { useState, useMemo, useRef, useEffect } from "react";
import { PageId, ProductItem } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  Smartphone,
  Watch,
  Briefcase,
  Footprints,
  Home,
  Search,
  Download,
  PlusCircle,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Package,
  Sparkles,
  ShoppingBag,
  Percent,
  TrendingUp,
  TrendingDown,
  Gift,
  DollarSign,
  Laptop,
  Store,
  ChevronDown,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { confirmAction, confirmDelete, toastSuccess } from "@/utils/confirm";

interface ProductsListProps {
  setActivePage: (p: PageId) => void;
}

export default function ProductsList({ setActivePage }: ProductsListProps) {
  const { products, setProducts, setSelectedProduct, triggerToast } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // Selection state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Dropdown open states
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);

  // Refs for closing on click outside
  const statusRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const stockRef = useRef<HTMLDivElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Stats matching screenshot 1
  const stats = [
    {
      label: "In-Store Sales",
      value: "$5,345",
      orders: "5k orders",
      pct: "5.7%",
      isPositive: true,
      icon: Store,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/20"
    },
    {
      label: "Website Sales",
      value: "$74,347",
      orders: "21k orders",
      pct: "12.4%",
      isPositive: true,
      icon: Laptop,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-205/50 dark:border-blue-500/20"
    },
    {
      label: "Discount",
      value: "$14,235",
      orders: "6k orders",
      pct: null,
      isPositive: null,
      icon: Gift,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-205/50 dark:border-amber-500/20"
    },
    {
      label: "Affiliate",
      value: "$8,345",
      orders: "150 orders",
      pct: "3.5%",
      isPositive: false,
      icon: DollarSign,
      color: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-205/50 dark:border-rose-500/20"
    }
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (stockRef.current && !stockRef.current.contains(event.target as Node)) {
        setIsStockOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle stock switch locally and updates context
  const handleToggleStock = async (id: string, currentVal: boolean) => {
    const ok = await confirmAction("Update Stock?", "Change availability?");
    if (!ok) return;
    setProducts(
      products.map(p => {
        if (p.id === id) {
          const newVal = !currentVal;
          toastSuccess(`"${p.name}" stock updated to ${newVal ? "In Stock" : "Out of Stock"}`);
          return { ...p, inStock: newVal };
        }
        return p;
      })
    );
  };

  // Delete product locally and updates context
  const handleDeleteProduct = async (id: string, name: string) => {
    const ok = await confirmDelete(name);
    if (!ok) return;
    setProducts(products.filter(p => p.id !== id));
    setSelectedProductIds(prev => prev.filter(item => item !== id));
    toastSuccess(`${name} deleted successfully`);
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    const ok = await confirmAction("Delete Selected?", `Delete ${selectedProductIds.length} products?`);
    if (!ok) return;
    setProducts(products.filter(p => !selectedProductIds.includes(p.id)));
    setSelectedProductIds([]);
    toastSuccess("Selected products deleted successfully");
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchCategory = categoryFilter === "All" || p.category === categoryFilter;

      let matchStock = true;
      if (stockFilter === "In Stock") matchStock = p.inStock;
      if (stockFilter === "Out of Stock") matchStock = !p.inStock;

      return matchSearch && matchStatus && matchCategory && matchStock;
    });
  }, [products, search, statusFilter, categoryFilter, stockFilter]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage) || 1;

  // Master selection handler
  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const currentPageIds = paginatedProducts.map(p => p.id);
      setSelectedProductIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    } else {
      const currentPageIds = paginatedProducts.map(p => p.id);
      setSelectedProductIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  // Row selection handler
  const handleSelectRow = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedProductIds(prev => [...prev, id]);
    } else {
      setSelectedProductIds(prev => prev.filter(item => item !== id));
    }
  };

  const isCurrentPageAllSelected = useMemo(() => {
    if (paginatedProducts.length === 0) return false;
    return paginatedProducts.every(p => selectedProductIds.includes(p.id));
  }, [paginatedProducts, selectedProductIds]);

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case "Electronics":
        return {
          icon: <Smartphone size={14} />,
          badge: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/10"
        };
      case "Accessories":
        return {
          icon: <Watch size={14} />,
          badge: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/10"
        };
      case "Shoes":
        return {
          icon: <Footprints size={14} />,
          badge: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-100 dark:border-green-500/10"
        };
      case "Office":
        return {
          icon: <Briefcase size={14} />,
          badge: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/10"
        };
      default:
        return {
          icon: <Home size={14} />,
          badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/10"
        };
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ["ID", "Name", "Category", "SKU", "Price", "QTY", "Status", "InStock"];
      const rows = filteredProducts.map(p => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.category,
        p.sku,
        p.price,
        p.qty,
        p.status,
        p.inStock ? "YES" : "NO"
      ]);
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Products_Inventory_Export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast(`Exported ${filteredProducts.length} items to CSV Successfully!`, "success");
    } catch {
      triggerToast("Failed to compile CSV data", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: Top Stat Cards (4-column layout match screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, i) => {
          const IconComponent = st.icon;
          return (
            <motion.div
              key={i}
              id={`stat-card-${i}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs text-text-secondary font-bold text-[13px] tracking-tight">
                  {st.label}
                </span>
                <h3 className="text-2xl font-black font-display text-text-primary mt-1 tracking-tight">
                  {st.value}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[11px] text-text-secondary font-semibold">{st.orders}</span>
                  {st.pct !== null && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 leading-none ${
                        st.isPositive
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {st.isPositive ? "▲" : "▼"} {st.pct}
                    </span>
                  )}
                </div>
              </div>

              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${st.color}`}>
                <IconComponent size={20} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SECTION 2: Filters Row (Clean separate container matching screenshot 1, 2, 3, 4) */}
      <motion.div
        id="products-inventory-filters-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs space-y-5"
      >
        <span className="text-xs font-black text-text-secondary uppercase tracking-wider block select-none">
          Filters
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Floating Selector (screenshot 2) */}
          <div ref={statusRef} className="relative z-30">
            <button
              id="filter-trigger-status"
              type="button"
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsCategoryOpen(false);
                setIsStockOpen(false);
              }}
              className={`w-full text-left bg-bg-card border rounded-xl px-4 py-3 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[45px] ${
                isStatusOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
              }`}
            >
              <span className={statusFilter === "All" ? "text-text-secondary" : "text-text-primary font-bold"}>
                {statusFilter === "All" ? "Select Status" : statusFilter}
              </span>
              <ChevronDown
                size={14}
                className={`text-text-secondary transition-transform duration-200 ${
                  isStatusOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <span
              className={`absolute left-3 -top-2 px-1 text-[11px] font-bold select-none transition-all ${
                isStatusOpen ? "text-primary" : "text-text-secondary"
              } bg-bg-card`}
            >
              Status
            </span>
            <AnimatePresence>
              {isStatusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-1.5 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 overflow-hidden font-semibold text-xs text-text-primary"
                >
                  <button
                    onClick={() => {
                      setStatusFilter("All");
                      setIsStatusOpen(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-primary-light hover:text-primary transition-all text-purple-400/90"
                  >
                    Select Status
                  </button>
                  {["Scheduled", "Publish", "Inactive"].map(item => (
                    <button
                      key={item}
                      onClick={() => {
                        setStatusFilter(item);
                        setIsStatusOpen(false);
                        setCurrentPage(1);
                        triggerToast(`Status filter set to "${item}"`, "blank");
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                        statusFilter === item ? "bg-primary-light text-primary font-bold" : "text-text-primary"
                      }`}
                    >
                      {item === "Publish" ? "Publish" : item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category Floating Selector (screenshot 3) */}
          <div ref={categoryRef} className="relative z-30">
            <button
              id="filter-trigger-category"
              type="button"
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsStatusOpen(false);
                setIsStockOpen(false);
              }}
              className={`w-full text-left bg-bg-card border rounded-xl px-4 py-3 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[45px] ${
                isCategoryOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
              }`}
            >
              <span className={categoryFilter === "All" ? "text-text-secondary" : "text-text-primary font-bold"}>
                {categoryFilter === "All" ? "Select Category" : categoryFilter}
              </span>
              <ChevronDown
                size={14}
                className={`text-text-secondary transition-transform duration-200 ${
                  isCategoryOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <span
              className={`absolute left-3 -top-2 px-1 text-[11px] font-bold select-none transition-all ${
                isCategoryOpen ? "text-primary" : "text-text-secondary"
              } bg-bg-card`}
            >
              Category
            </span>
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-1.5 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 overflow-hidden font-semibold text-xs text-text-primary"
                >
                  <button
                    onClick={() => {
                      setCategoryFilter("All");
                      setIsCategoryOpen(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-primary-light hover:text-primary transition-all text-purple-400/90"
                  >
                    Select Category
                  </button>
                  {["Accessories", "Home Decor", "Electronics", "Shoes", "Office", "Games"].map(item => (
                    <button
                      key={item}
                      onClick={() => {
                        setCategoryFilter(item);
                        setIsCategoryOpen(false);
                        setCurrentPage(1);
                        triggerToast(`Category filter set to "${item}"`, "blank");
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                        categoryFilter === item ? "bg-primary-light text-primary font-bold" : "text-text-primary"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stock Floating Selector (screenshot 4) */}
          <div ref={stockRef} className="relative z-30">
            <button
              id="filter-trigger-stock"
              type="button"
              onClick={() => {
                setIsStockOpen(!isStockOpen);
                setIsStatusOpen(false);
                setIsCategoryOpen(false);
              }}
              className={`w-full text-left bg-bg-card border rounded-xl px-4 py-3 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[45px] ${
                isStockOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
              }`}
            >
              <span className={stockFilter === "All" ? "text-text-secondary" : "text-text-primary font-bold"}>
                {stockFilter === "All" ? "Select Stock" : stockFilter}
              </span>
              <ChevronDown
                size={14}
                className={`text-text-secondary transition-transform duration-200 ${
                  isStockOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <span
              className={`absolute left-3 -top-2 px-1 text-[11px] font-bold select-none transition-all ${
                isStockOpen ? "text-primary" : "text-text-secondary"
              } bg-bg-card`}
            >
              Stock
            </span>
            <AnimatePresence>
              {isStockOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-1.5 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 overflow-hidden font-semibold text-xs text-text-primary"
                >
                  <button
                    onClick={() => {
                      setStockFilter("All");
                      setIsStockOpen(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-primary-light hover:text-primary transition-all text-purple-400/90"
                  >
                    Select Stock
                  </button>
                  {["In Stock", "Out of Stock"].map(item => (
                    <button
                      key={item}
                      onClick={() => {
                        setStockFilter(item);
                        setIsStockOpen(false);
                        setCurrentPage(1);
                        triggerToast(`Stock filter set to "${item}"`, "blank");
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                        stockFilter === item ? "bg-primary-light text-primary font-bold" : "text-text-primary"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* SECTION 3: Action Row & Data Table List (screenshot 1) */}
      <motion.div
        id="products-table-card-container"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden"
      >
        {/* Action controls row (Search, Export, Add Product) */}
        <div className="p-6 border-b border-border-divider flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-2.5 text-text-secondary">
              <Search size={14} />
            </span>
            <input
              id="product-search-input"
              type="text"
              placeholder="Search Product"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-text-primary outline-none transition-all placeholder:text-text-secondary"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 border border-border-divider rounded-xl px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary bg-bg-card hover:bg-gray-55/35 dark:hover:bg-zinc-805/40 transition-all cursor-pointer"
            >
              <Download size={15} />
              Export
            </button>
            {selectedProductIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 size={15} />
                Delete {selectedProductIds.length}
              </button>
            )}
            <button
              id="add-product-page-trigger"
              onClick={() => {
                setSelectedProduct(null);
                setActivePage("add-product");
              }}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <span className="text-sm font-semibold">+</span>
              Add Product
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[950px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider text-[11px] font-bold text-text-secondary uppercase tracking-wider bg-gray-50/15">
                <th className="py-3.5 px-6 w-10">
                  <input
                    type="checkbox"
                    checked={isCurrentPageAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-primary focus:ring-primary border-border-divider h-4 w-4 bg-bg-card cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-bold text-[11px] tracking-wide text-text-secondary">Product</th>
                <th className="py-3.5 px-4 font-bold text-[11px] tracking-wide text-text-secondary">Category</th>
                <th className="py-3.5 px-4 font-bold text-[11px] tracking-wide text-text-secondary text-center">Stock</th>
                <th className="py-3.5 px-4 font-bold text-[11px] tracking-wide text-text-secondary">SKU</th>
                <th className="py-3.5 px-4 font-bold text-[11px] tracking-wide text-text-secondary">Price</th>
                <th className="py-3.5 px-4 font-bold text-[11px] tracking-wide text-text-secondary">QTY</th>
                <th className="py-3.5 px-4 font-bold text-[11px] tracking-wide text-text-secondary">Status</th>
                <th className="py-3.5 px-6 font-bold text-[11px] tracking-wide text-text-secondary text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider/50">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const catDetails = renderCategoryIcon(p.category);
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 text-xs font-semibold transition-colors duration-150 ${
                        isChecked ? "bg-primary-light/10" : ""
                      }`}
                    >
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(p.id, e.target.checked)}
                          className="rounded text-primary focus:ring-primary border-border-divider h-4 w-4 bg-bg-card cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5 max-w-xs sm:max-w-md">
                          <img
                            src={p.image || "https://images.unsplash.com/photo-1543512214-318c7553f230?w=100&auto=format&fit=crop&q=80"}
                            alt={p.name}
                            onError={(e) => {
                              // Fallback image
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80";
                            }}
                            className="h-10 w-10 rounded-xl object-cover border border-border-divider/80 shadow-xs flex-shrink-0 bg-white"
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-text-primary leading-tight text-sm tracking-tight">{p.name}</h4>
                            <p className="text-[11px] text-text-secondary font-medium mt-0.5 truncate max-w-[200px] sm:max-w-[300px]">
                              {p.subtitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-md flex items-center justify-center ${catDetails.badge}`}>
                            {catDetails.icon}
                          </div>
                          <span className="font-bold text-text-primary text-[11px]">{p.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center select-none">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(p.id, p.inStock)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              p.inStock ? "bg-primary" : "bg-gray-200 dark:bg-zinc-700"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-bg-card shadow-sm ring-0 transition duration-200 ease-in-out ${
                                p.inStock ? "translate-x-4 animate-pulse-glow" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-text-secondary tracking-tight font-mono text-[11px]">{p.sku}</td>
                      <td className="py-4 px-4 font-black text-text-primary font-mono text-xs">${p.price.toFixed(2)}</td>
                      <td className="py-4 px-4 font-bold text-text-secondary font-mono text-xs">{p.qty}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-black tracking-wide rounded-md uppercase leading-normal ${
                            p.status === "Publish"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : p.status === "Inactive"
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}
                        >
                          {p.status === "Publish" ? "Publish" : p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setActivePage("add-product");
                            }}
                            className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-all cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Package size={36} className="text-text-secondary animate-bounce" />
                      <div>
                        <p className="text-sm font-black text-text-primary">No products fall under these filters</p>
                        <p className="text-xs text-text-secondary font-medium mt-1">Try relaxing your search terms or filter selection parameters.</p>
                      </div>
                      <button
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("All");
                          setCategoryFilter("All");
                          setStockFilter("All");
                        }}
                        className="text-xs font-black text-primary hover:underline bg-primary-light/50 px-3.5 py-1.5 rounded-lg transition-all"
                      >
                        Reset inventory filter configurations
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls (matches screenshot 1 pagination) */}
        <div className="p-4 px-6 border-t border-border-divider/75 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-bold font-sans">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-bg-card border border-border-divider rounded-lg text-xs font-bold text-text-primary px-2.5 py-1 outline-none focus:border-primary transition-all cursor-pointer select-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-xs font-bold text-text-secondary">
              {Math.min(filteredProducts.length, (currentPage - 1) * rowsPerPage + 1)}-
              {Math.min(filteredProducts.length, currentPage * rowsPerPage)} of {filteredProducts.length}
            </span>
            <div className="flex items-center gap-2 select-none">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 border border-border-divider rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 border border-border-divider rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

