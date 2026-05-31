import React, { useState, useRef, useEffect } from "react";
import { PageId } from "@/types";
import {
  Smartphone,
  Footprints,
  Home,
  Sparkles,
  Book,
  Gamepad,
  Baby,
  Calculator,
  Laptop,
  Flame,
  Search,
  PlusCircle,
  Download,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  HelpCircle,
  Check,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { confirmDelete, confirmSave, toastError, toastSuccess } from "@/utils/confirm";
import { EmptyState } from "@/components/common/EmptyState";

interface CategoryListProps {
  setActivePage: (p: PageId) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  totalProducts: number;
  totalEarning: number;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  parent?: string;
  comment?: string;
  status?: string;
}

export default function CategoryList({ setActivePage }: CategoryListProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: "c1", name: "Smart Phone", desc: "Choose from wide range of smartphones online at best prices.", totalProducts: 12548, totalEarning: 98784.00, icon: Smartphone, color: "text-primary bg-primary/10", parent: "None", comment: "Popular categories", status: "Active" },
    { id: "c2", name: "Clothing, Shoes, and jewellery", desc: "Fashion for a wide selection of clothing, shoes, jewellery and watches.", totalProducts: 4689, totalEarning: 45627.00, icon: Footprints, color: "text-cyan-500 bg-cyan-500/10", parent: "None", comment: "", status: "Active" },
    { id: "c3", name: "Home and Kitchen", desc: "Browse through the wide range of Home and kitchen products.", totalProducts: 11297, totalEarning: 51097.00, icon: Home, color: "text-amber-500 bg-amber-500/10", parent: "None", comment: "Seasonal list", status: "Active" },
    { id: "c4", name: "Beauty and Personal Care", desc: "Explore beauty and personal care products, shop makeup and etc.", totalProducts: 9474, totalEarning: 74829.00, icon: Sparkles, color: "text-red-500 bg-red-500/10", parent: "None", comment: "", status: "Active" },
    { id: "c5", name: "Books", desc: "Over 25 million titles across categories such as business and etc.", totalProducts: 10257, totalEarning: 63618.00, icon: Book, color: "text-blue-500 bg-blue-50", parent: "None", comment: "Educational", status: "Active" },
    { id: "c6", name: "Games", desc: "Every month, get exclusive in-game loot, free games, a free subscription.", totalProducts: 14501, totalEarning: 65920.00, icon: Gamepad, color: "text-green-500 bg-green-50", parent: "None", comment: "", status: "Active" },
    { id: "c7", name: "Baby Products", desc: "Buy baby products across different categories from top brands.", totalProducts: 8624, totalEarning: 38838.00, icon: Baby, color: "text-indigo-500 bg-indigo-50", parent: "None", comment: "", status: "Active" },
    { id: "c8", name: "Growsari", desc: "Shop grocery items through at best prices in India.", totalProducts: 7389, totalEarning: 72652.00, icon: Calculator, color: "text-emerald-500 bg-emerald-500/10", parent: "None", comment: "", status: "Active" },
    { id: "c9", name: "Computer Accessories", desc: "Enhance your computing experience with our range of computer accessories.", totalProducts: 9876, totalEarning: 65421.00, icon: Laptop, color: "text-teal-500 bg-teal-50", parent: "None", comment: "Work essentials", status: "Active" },
    { id: "c10", name: "Fitness Tracker", desc: "Monitor your health and fitness goals with our range of advanced fitness trackers.", totalProducts: 1987, totalEarning: 32067.00, icon: Flame, color: "text-cyan-500 bg-cyan-50", parent: "None", comment: "", status: "Active" }
  ]);

  const [search, setSearch] = useState("");

  // Drawer Form States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [descInput, setDescInput] = useState("");
  const [parentCategory, setParentCategory] = useState("None");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("Active");
  const [imageFileName, setImageFileName] = useState("No file chosen");

  // Dropdown open states
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Close custom selectors click outside
  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (parentRef.current && !parentRef.current.contains(e.target as Node)) {
        setIsParentDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleOpenCreateDrawer = () => {
    setEditCategoryId(null);
    setTitle("");
    setDescInput("");
    setParentCategory("None");
    setComment("");
    setStatus("Active");
    setImageFileName("No file chosen");
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (cat: CategoryItem) => {
    setEditCategoryId(cat.id);
    setTitle(cat.name);
    setDescInput(cat.desc);
    setParentCategory(cat.parent || "None");
    setComment(cat.comment || "");
    setStatus(cat.status || "Active");
    setImageFileName("No file chosen");
    setIsDrawerOpen(true);
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFileName(e.target.files[0].name);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toastError("Please provide a category title.");
      return;
    }
    const ok = await confirmSave("category");
    if (!ok) return;

    if (editCategoryId) {
      // Editing
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editCategoryId
            ? {
                ...cat,
                name: title,
                desc: descInput || "No description provided.",
                parent: parentCategory,
                comment: comment,
                status: status
              }
            : cat
        )
      );
    } else {
      // Creating
      const icons = [Smartphone, Sparkles, Home, Laptop, Flame, Book, Gamepad];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      
      const newCat: CategoryItem = {
        id: "c" + Date.now().toString(),
        name: title,
        desc: descInput || "No description provided.",
        totalProducts: 0,
        totalEarning: 0.0,
        icon: randomIcon,
        color: "text-primary bg-primary/10",
        parent: parentCategory,
        comment: comment,
        status: status
      };

      setCategories([newCat, ...categories]);
    }

    setIsDrawerOpen(false);
    toastSuccess(editCategoryId ? "Category updated successfully" : "Category created successfully");
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    const ok = await confirmDelete(cat.name);
    if (!ok) return;
    setCategories(prev => prev.filter(p => p.id !== cat.id));
    toastSuccess("Category deleted successfully");
  };

  const filtered = categories.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-display text-text-primary">Category List</h2>
            <p className="text-xs text-text-secondary">Manage all product listing categories across the catalog</p>
          </div>
        </div>

        <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
          {/* Action Row */}
          <div className="p-6 border-b border-border-divider flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-transparent border border-border-divider rounded-xl text-xs font-semibold text-text-primary outline-none focus:border-primary transition-all placeholder:text-text-secondary/70 h-[40px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toastSuccess("Categories exported successfully.")}
                className="flex items-center justify-center gap-2 border border-border-divider rounded-xl px-4 py-2 text-xs font-bold text-text-secondary bg-transparent hover:bg-gray-150/40 dark:hover:bg-zinc-800/10 transition-all cursor-pointer h-[40px]"
              >
                <Download size={14} className="text-text-secondary rotate-180" />
                Export
              </button>
              <button
                onClick={handleOpenCreateDrawer}
                className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover rounded-xl px-4 py-2 text-xs font-bold shadow-md hover:shadow-primary/30 transition-all cursor-pointer h-[40px]"
              >
                <span className="text-[15px] leading-none font-bold">+</span>
                Add Category
              </button>
            </div>
          </div>

          {/* Data table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-gray-55/10">
                  <th className="py-3.5 px-6 w-10">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300 cursor-pointer h-4 w-4" />
                  </th>
                  <th className="py-3.5 px-4 text-[10px] tracking-wide text-text-secondary">Categories</th>
                  <th className="py-3.5 px-4 text-right text-[10px] tracking-wide text-text-secondary">Total Products</th>
                  <th className="py-3.5 px-4 text-right text-[10px] tracking-wide text-text-secondary">Total Earning</th>
                  <th className="py-3.5 px-6 text-right w-24 text-[10px] tracking-wide text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState icon={Search} title="No categories found" description="Try a different search or add a new category." />
                    </td>
                  </tr>
                ) : filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all text-xs text-text-primary font-medium">
                    <td className="py-4.5 px-6">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300 cursor-pointer h-4 w-4" />
                    </td>
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-4 max-w-sm sm:max-w-md">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color} border border-border-divider/10`}>
                          <cat.icon size={18} />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-text-primary leading-tight hover:text-primary transition-colors cursor-pointer text-sm tracking-tight">{cat.name}</h4>
                          <p className="text-[10px] text-text-secondary mt-0.5 truncate leading-relaxed max-w-[200px] xs:max-w-[280px] sm:max-w-md">{cat.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-4 text-right font-bold text-text-primary text-[13px]">
                      {cat.totalProducts.toLocaleString()}
                    </td>
                    <td className="py-4.5 px-4 text-right font-bold text-text-primary text-[13px]">
                      ${cat.totalEarning.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditDrawer(cat)}
                          className="p-1.5 hover:bg-primary-light rounded-lg transition-all cursor-pointer text-text-secondary hover:text-primary"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all cursor-pointer text-text-secondary hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <div className="p-4 px-6 border-t border-border-divider/70 flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium">Rows per page: <span className="font-bold text-text-primary">10 <ChevronDown size={12} className="inline ml-0.5" /></span> &nbsp;&nbsp;&nbsp; 1-10 of 12</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 border border-border-divider/80 rounded-lg text-text-secondary cursor-not-allowed hover:bg-bg-app transition-all"><ChevronLeft size={14} /></button>
              <button className="p-1.5 border border-border-divider/80 rounded-lg text-text-secondary bg-gray-50/50 dark:bg-zinc-800 hover:bg-bg-app transition-all"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Drawer Backdrop for Adding / Editing Category (MATCHES YOUR ATTACHED SCREENSHOT) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-xs z-50 flex justify-end"
            >
              {/* Drawer Container */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[400px] sm:max-w-[420px] bg-bg-card h-full min-h-screen shadow-2xl flex flex-col border-l border-border-divider text-text-primary z-55"
              >
                {/* Header */}
                <div className="p-6 border-b border-border-divider/60 flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-primary tracking-tight select-none">
                    {editCategoryId ? "Edit Category" : "Add Category"}
                  </h3>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-app rounded-lg transition-all cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Form Fields Body */}
                <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-6 space-y-5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />

                  {/* Title Box */}
                  <div className="space-y-1.5">
                    <label className="hidden text-xs font-bold text-text-secondary">Title</label>
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-border-divider focus:border-primary/90 focus:ring-1 focus:ring-primary rounded-lg text-xs font-medium text-text-primary outline-none transition-all placeholder:text-text-secondary"
                    />
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1.5">
                    <label className="hidden text-xs font-bold text-text-secondary">Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      value={descInput}
                      onChange={(e) => setDescInput(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-border-divider focus:border-primary/90 focus:ring-1 focus:ring-primary rounded-lg text-xs font-medium text-text-primary outline-none transition-all placeholder:text-text-secondary"
                    />
                  </div>

                  {/* File Upload Choose Button */}
                  <div className="space-y-1.5">
                    <label className="hidden text-xs font-bold text-text-secondary">Image Selection</label>
                    <div className="flex items-center">
                      <div className="flex-1 px-4 py-3 bg-transparent border border-r-0 border-border-divider/95 rounded-l-lg text-xs font-medium text-text-secondary bg-bg-card truncate select-none h-[42px] flex items-center">
                        {imageFileName}
                      </div>
                      <button
                        type="button"
                        onClick={handleChooseImage}
                        className="px-5 border border-primary text-primary hover:bg-primary-light text-xs font-bold rounded-r-lg transition-all cursor-pointer h-[42px] bg-transparent flex items-center justify-center shrink-0"
                      >
                        Choose
                      </button>
                    </div>
                  </div>

                  {/* Parent Category Dropdown Selector */}
                  <div ref={parentRef} className="space-y-1.5 relative select-none">
                    <label className="hidden text-xs font-bold text-text-secondary">Parent Category</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsParentDropdownOpen(!isParentDropdownOpen);
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full text-left bg-transparent border border-border-divider focus:border-primary rounded-lg px-4 py-3 text-xs font-medium text-text-primary outline-none transition-all flex items-center justify-between h-[42px]"
                    >
                      <span className={parentCategory === "None" ? "text-text-secondary" : "text-text-primary"}>
                        {parentCategory}
                      </span>
                      <ChevronDown size={14} className="text-text-secondary" />
                    </button>
                    <span className="absolute left-3 -top-2 px-1 text-[9px] font-bold text-text-secondary bg-bg-card">
                      Parent Category
                    </span>

                    <AnimatePresence>
                      {isParentDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-0 right-0 mt-1 bg-bg-card border border-border-divider rounded-lg shadow-xl z-55 max-h-52 overflow-y-auto py-1 font-semibold text-xs text-text-primary"
                        >
                          {["None", "Smart Phone", "Clothing, Shoes, & jewellery", "Home and Kitchen", "Beauty & Personal Care", "Books", "Games"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setParentCategory(option);
                                setIsParentDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                                parentCategory === option ? "text-primary bg-primary-light/50 font-bold" : ""
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Comment Textarea Box */}
                  <div className="space-y-1.5">
                    <label className="hidden text-xs font-bold text-text-secondary">Comment</label>
                    <textarea
                      placeholder="Comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 bg-transparent border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs font-medium text-text-primary outline-none transition-all placeholder:text-text-secondary resize-none"
                    />
                  </div>

                  {/* Category Status Dropdown Selector */}
                  <div ref={statusRef} className="space-y-1.5 relative select-none">
                    <label className="hidden text-xs font-bold text-text-secondary">Category Status</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsStatusDropdownOpen(!isStatusDropdownOpen);
                        setIsParentDropdownOpen(false);
                      }}
                      className="w-full text-left bg-transparent border border-border-divider focus:border-primary rounded-lg px-4 py-3 text-xs font-medium text-text-primary outline-none transition-all flex items-center justify-between h-[42px]"
                    >
                      <span className="text-text-primary">{status}</span>
                      <ChevronDown size={14} className="text-text-secondary" />
                    </button>
                    <span className="absolute left-3 -top-2 px-1 text-[9px] font-bold text-text-secondary bg-bg-card">
                      Category Status
                    </span>

                    <AnimatePresence>
                      {isStatusDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-0 right-0 mt-1 bg-bg-card border border-border-divider rounded-lg shadow-xl z-55 py-1 font-semibold text-xs text-text-primary"
                        >
                          {["Active", "Inactive", "Scheduled"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setStatus(option);
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                                status === option ? "text-primary bg-primary-light/50 font-bold" : ""
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action Buttons at bottom */}
                  <div className="flex items-center gap-3 pt-6">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all shadow-md hover:shadow-primary/20 cursor-pointer min-w-[80px]"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="px-5 py-2.5 border border-red-500 hover:bg-rose-50 text-red-500 text-xs font-bold rounded-lg transition-all cursor-pointer bg-transparent"
                    >
                      Discard
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

