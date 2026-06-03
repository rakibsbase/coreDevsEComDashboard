import React, { useState, useMemo } from "react";
import { PageId, PermissionItem } from "@/types";
import {
  Search, PlusCircle, X, ChevronLeft, ChevronRight, Edit2, MoreVertical,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { confirmDelete, toastSuccess, toastError } from "@/utils/confirm";

interface Props { setActivePage: (p: PageId) => void; }

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  Administrator: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-300" },
  Editor:   { bg: "bg-blue-100 dark:bg-blue-900/30",   text: "text-blue-600 dark:text-blue-300" },
  Manager:  { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-300" },
  Users:    { bg: "bg-green-100 dark:bg-green-900/30",  text: "text-green-600 dark:text-green-300" },
  Support:  { bg: "bg-teal-100 dark:bg-teal-900/30",   text: "text-teal-600 dark:text-teal-300" },
  "Restricted User": { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-300" },
  "Restricted-User": { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-300" },
};
const fallbackColor = { bg: "bg-gray-100 dark:bg-zinc-800", text: "text-gray-600 dark:text-gray-300" };

export default function PermissionsList({ setActivePage }: Props) {
  const { permissions, setPermissions, roles, triggerToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerm, setEditingPerm] = useState<PermissionItem | null>(null);
  const [permName, setPermName] = useState("");
  const [permAssignedTo, setPermAssignedTo] = useState<string[]>([]);
  const [assignDropOpen, setAssignDropOpen] = useState(false);

  const filtered = useMemo(() => {
    return permissions.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [permissions, searchQuery]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;

  const openAddModal = () => {
    setEditingPerm(null); setPermName(""); setPermAssignedTo([]); setModalOpen(true);
  };

  const openEditModal = (p: PermissionItem) => {
    setEditingPerm(p); setPermName(p.name); setPermAssignedTo([...p.assignedTo]); setModalOpen(true);
  };

  const handleSave = () => {
    if (!permName.trim()) { toastError("Please enter a permission name."); return; }
    if (editingPerm) {
      setPermissions(permissions.map(p => p.id === editingPerm.id ? { ...p, name: permName, assignedTo: permAssignedTo } : p));
      toastSuccess(`Permission "${permName}" updated.`);
    } else {
      const newPerm: PermissionItem = {
        id: `perm-${Date.now()}`, name: permName, assignedTo: permAssignedTo,
        createdAt: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) + ", " +
          new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
      };
      setPermissions([...permissions, newPerm]);
      toastSuccess(`Permission "${permName}" created.`);
    }
    setModalOpen(false);
  };

  const handleDelete = async (p: PermissionItem) => {
    const ok = await confirmDelete("permission");
    if (!ok) return;
    setPermissions(permissions.filter(x => x.id !== p.id));
    toastSuccess(`Permission "${p.name}" deleted.`);
  };

  const toggleAssign = (roleName: string) => {
    setPermAssignedTo(prev => prev.includes(roleName) ? prev.filter(r => r !== roleName) : [...prev, roleName]);
  };

  const allRoleNames = roles.map(r => r.name);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-black font-display text-text-primary tracking-tight">Permissions List</h2>
        <p className="text-xs text-text-secondary font-semibold mt-1">
          Each permission maps to specific capabilities. Assign permissions to roles to control feature access.
        </p>
      </div>

      <div className="bg-bg-card border border-border-divider rounded-2xl shadow-xs overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input type="text" placeholder="Search Permissions" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-3 py-2 h-10 border border-border-divider rounded-xl text-xs font-semibold text-text-primary bg-bg-card outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all w-[200px]" />
          </div>
          <button onClick={openAddModal}
            className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm transition-all cursor-pointer flex items-center gap-1.5">
            <PlusCircle size={14} /> Add Permission
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-y border-border-divider/60">
              <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(perm => (
                <tr key={perm.id} className="border-b border-border-divider/40 hover:bg-bg-app/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-semibold text-text-primary italic">{perm.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {perm.assignedTo.map(role => {
                        const c = ROLE_COLORS[role] || fallbackColor;
                        return (
                          <span key={role} className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-md ${c.bg} ${c.text}`}>
                            {role}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-text-secondary font-medium">{perm.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEditModal(perm)}
                        className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-all cursor-pointer">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(perm)}
                        className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-border-divider/50">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-semibold">
            Rows per page:
            <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-bg-card border border-border-divider rounded-lg px-2 py-1 text-xs font-semibold text-text-primary outline-none cursor-pointer">
              {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary font-semibold">
            <span>{(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length}</span>
            <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}
              className="p-1 rounded-lg hover:bg-bg-app disabled:opacity-30 cursor-pointer transition-all"><ChevronLeft size={16} /></button>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 rounded-lg hover:bg-bg-app disabled:opacity-30 cursor-pointer transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Add/Edit Permission Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-card rounded-2xl border border-border-divider shadow-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}>
              <div className="p-6 pb-0 flex items-center justify-between">
                <h3 className="text-lg font-black font-display text-text-primary">{editingPerm ? "Edit Permission" : "Add Permission"}</h3>
                <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer text-text-secondary">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="relative">
                  <input type="text" placeholder=" " value={permName} onChange={e => setPermName(e.target.value)}
                    className="peer w-full border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-xs font-semibold text-text-primary bg-bg-card outline-none transition-all placeholder-transparent h-[45px]" />
                  <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[11px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none">
                    Permission Name
                  </span>
                </div>

                {/* Assign to roles */}
                <div>
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block mb-2">Assign To Roles</span>
                  <div className="flex flex-wrap gap-2">
                    {allRoleNames.map(role => {
                      const isSelected = permAssignedTo.includes(role);
                      const c = ROLE_COLORS[role] || fallbackColor;
                      return (
                        <button key={role} type="button" onClick={() => toggleAssign(role)}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer select-none ${isSelected ? `${c.bg} ${c.text} border-current` : "border-border-divider text-text-secondary hover:border-text-secondary/50"}`}>
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button onClick={handleSave}
                    className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm transition-all cursor-pointer">
                    {editingPerm ? "Update" : "Create"}
                  </button>
                  <button onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 border border-border-divider text-xs font-bold text-text-secondary rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
