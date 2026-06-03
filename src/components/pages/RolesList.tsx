import React, { useState, useMemo, useRef, useEffect } from "react";
import { PageId, RoleItem, PermissionKey, RolePermission, UserRow } from "@/types";
import {
  Search, Copy, PlusCircle, X, Trash2, Eye, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, MoreVertical, Shield, Edit2, Settings, User, Monitor,
  Download, Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { confirmDelete, toastSuccess, toastError } from "@/utils/confirm";

interface Props { setActivePage: (p: PageId) => void; }

const ALL_PERM_KEYS: PermissionKey[] = [
  "User Management","Content Management","Disputes Management","Database Management",
  "Financial Management","Reporting","API Control","Repository Management","Payroll"
];

const emptyPerms = (): RolePermission[] => ALL_PERM_KEYS.map(k => ({ key: k, read: false, write: false, create: false }));

// Color map for role name badges
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  Administrator: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-300" },
  Editor:        { bg: "bg-blue-100 dark:bg-blue-900/30",   text: "text-blue-600 dark:text-blue-300" },
  Users:         { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-300" },
  Support:       { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-300" },
  "Restricted User": { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-300" },
};
const fallbackColor = { bg: "bg-gray-100 dark:bg-zinc-800", text: "text-gray-600 dark:text-gray-300" };

// Initials helper
function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// Status badge
function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    Active:   "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Pending:  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Inactive: "bg-gray-200/60 text-gray-500 dark:bg-zinc-700/50 dark:text-zinc-400 border-gray-300/40",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${s[status] || s.Inactive}`}>
      {status}
    </span>
  );
}

export default function RolesList({ setActivePage }: Props) {
  const { roles, setRoles, users, triggerToast } = useApp();

  // ── Modal state ──
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [roleName, setRoleName] = useState("");
  const [rolePerms, setRolePerms] = useState<RolePermission[]>(emptyPerms());
  const [selectAll, setSelectAll] = useState(false);

  // ── Table state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [roleFilterOpen, setRoleFilterOpen] = useState(false);
  const roleFilterRef = useRef<HTMLDivElement>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (roleFilterRef.current && !roleFilterRef.current.contains(e.target as Node)) setRoleFilterOpen(false);
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, roleFilter]);

  // ── Users list with role column ──
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

  // ── Modal helpers ──
  const openAddModal = () => {
    setEditingRole(null);
    setRoleName("");
    setRolePerms(emptyPerms());
    setSelectAll(false);
    setModalOpen(true);
  };

  const openEditModal = (role: RoleItem) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRolePerms(role.permissions.map(p => ({ ...p })));
    setSelectAll(role.permissions.every(p => p.read && p.write && p.create));
    setModalOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setRolePerms(rolePerms.map(p => ({ ...p, read: checked, write: checked, create: checked })));
  };

  const togglePerm = (idx: number, field: "read" | "write" | "create") => {
    const updated = rolePerms.map((p, i) => i === idx ? { ...p, [field]: !p[field] } : p);
    setRolePerms(updated);
    setSelectAll(updated.every(p => p.read && p.write && p.create));
  };

  const handleSaveRole = () => {
    if (!roleName.trim()) { toastError("Please enter a role name."); return; }

    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, name: roleName, permissions: rolePerms } : r));
      toastSuccess(`Role "${roleName}" updated successfully.`);
    } else {
      const newRole: RoleItem = {
        id: `role-${Date.now()}`, name: roleName, userCount: 0,
        userAvatars: [], permissions: rolePerms,
        createdAt: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
      };
      setRoles([...roles, newRole]);
      toastSuccess(`Role "${roleName}" created successfully.`);
    }
    setModalOpen(false);
  };

  const handleDeleteRole = async (role: RoleItem) => {
    const ok = await confirmDelete("role");
    if (!ok) return;
    setRoles(roles.filter(r => r.id !== role.id));
    toastSuccess(`Role "${role.name}" deleted.`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin": return { icon: Shield, color: "text-rose-500", bg: "bg-rose-500/10" };
      case "Editor": return { icon: Edit2, color: "text-blue-500", bg: "bg-blue-500/10" };
      case "Author": return { icon: Monitor, color: "text-amber-500", bg: "bg-amber-500/10" };
      case "Maintainer": return { icon: Settings, color: "text-green-500", bg: "bg-green-500/10" };
      default: return { icon: User, color: "text-purple-500", bg: "bg-purple-500/10" };
    }
  };

  const uniqueRoles = Array.from(new Set(users.map(u => u.role)));

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-display text-text-primary tracking-tight">Roles List</h2>
        <p className="text-xs text-text-secondary font-semibold mt-1">
          A role provides access to predefined menus and features so that depending on assigned role an administrator can have access to what they need
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(role => {
          const c = ROLE_COLORS[role.name] || fallbackColor;
          const maxAvatars = 3;
          const extras = role.userCount > maxAvatars ? role.userCount - maxAvatars : 0;
          return (
            <motion.div key={role.id} whileHover={{ y: -2 }}
              className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-text-secondary">Total {role.userCount} users</span>
                <div className="flex -space-x-2">
                  {role.userAvatars.slice(0, maxAvatars).map((av, i) => (
                    <img key={i} src={av} alt="" className="h-7 w-7 rounded-full border-2 border-bg-card object-cover" />
                  ))}
                  {extras > 0 && (
                    <span className="h-7 w-7 rounded-full bg-primary-light text-primary text-[10px] font-bold flex items-center justify-center border-2 border-bg-card">
                      +{extras}
                    </span>
                  )}
                </div>
              </div>
              <h4 className="text-sm font-black text-text-primary">{role.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <button onClick={() => openEditModal(role)}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer">
                  Edit Role
                </button>
                <button onClick={() => handleDeleteRole(role)}
                  className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer">
                  <Copy size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* Add Role Card */}
        <motion.div whileHover={{ y: -2 }}
          className="bg-bg-card border-2 border-dashed border-border-divider rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-primary/50 transition-all min-h-[140px]"
          onClick={openAddModal}
        >
          <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
            <PlusCircle size={20} />
          </div>
          <span className="text-xs font-black text-text-primary">Add Role</span>
          <span className="text-[10px] text-text-secondary font-semibold">Add new role,{"\n"}if it doesn&apos;t exist.</span>
        </motion.div>
      </div>

      {/* Users Table Section */}
      <div className="bg-bg-card border border-border-divider rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-black font-display text-text-primary">Total users with their roles</h3>
          <p className="text-xs text-text-secondary font-semibold mt-1">
            Find all of your company&apos;s administrator accounts and their associate roles.
          </p>
        </div>

        {/* Filters */}
        <div className="px-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-border-divider rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer">
            <Download size={13} /> Export
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input type="text" placeholder="Search User" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 h-10 border border-border-divider rounded-xl text-xs font-semibold text-text-primary bg-bg-card outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all w-[180px]" />
            </div>

            {/* Role filter dropdown */}
            <div ref={roleFilterRef} className="relative min-w-[140px]">
              <button onClick={() => setRoleFilterOpen(!roleFilterOpen)}
                className={`w-full h-10 flex items-center justify-between px-3 rounded-xl border bg-bg-card text-xs font-semibold transition-all cursor-pointer select-none ${roleFilterOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-text-secondary/50"}`}>
                <span className={`absolute left-3 px-1 bg-bg-card font-semibold pointer-events-none transition-all duration-150 ${roleFilterOpen || roleFilter !== "All" ? "-top-1.5 text-[10px] text-primary" : "top-1/2 -translate-y-1/2 text-xs text-text-secondary"}`}>
                  Select Role
                </span>
                <span className="text-text-primary mt-0.5">{roleFilter !== "All" ? roleFilter : ""}</span>
                <ChevronDown size={14} className="text-text-secondary" />
              </button>
              <AnimatePresence>
                {roleFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    className="absolute right-0 mt-1 w-full bg-bg-card border border-border-divider rounded-xl shadow-xl z-50 py-1">
                    {["All", ...uniqueRoles].map(r => (
                      <button key={r} onClick={() => { setRoleFilter(r); setRoleFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${roleFilter === r ? "bg-primary/10 text-primary" : "text-text-primary hover:bg-bg-app"}`}>
                        {r === "All" ? "Select Role" : r}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-y border-border-divider/60">
              <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                <th className="px-6 py-3 w-8"><input type="checkbox" className="rounded border-border-divider h-3.5 w-3.5 accent-primary cursor-pointer" /></th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => {
                const ri = getRoleIcon(user.role);
                const RoleIcon = ri.icon;
                return (
                  <tr key={user.id} className="border-b border-border-divider/40 hover:bg-bg-app/50 transition-colors">
                    <td className="px-6 py-3"><input type="checkbox" className="rounded border-border-divider h-3.5 w-3.5 accent-primary cursor-pointer" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <span className="h-8 w-8 rounded-full bg-primary-light text-primary text-[10px] font-bold flex items-center justify-center">
                            {getInitials(user.name)}
                          </span>
                        )}
                        <div>
                          <p className="text-xs font-bold text-text-primary">{user.name}</p>
                          <p className="text-[10px] text-text-secondary font-medium">{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary font-medium">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`p-1 rounded ${ri.bg}`}><RoleIcon size={12} className={ri.color} /></span>
                        <span className="text-xs font-semibold text-text-secondary">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-text-secondary">{user.plan}</td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"><Trash2 size={14} /></button>
                        <button className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-all cursor-pointer"><Eye size={14} /></button>
                        <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer"><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            <span>{(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length}</span>
            <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}
              className="p-1 rounded-lg hover:bg-bg-app disabled:opacity-30 cursor-pointer transition-all"><ChevronLeft size={16} /></button>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 rounded-lg hover:bg-bg-app disabled:opacity-30 cursor-pointer transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* ── Add/Edit Role Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-card rounded-2xl border border-border-divider shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="p-6 pb-0 flex items-center justify-between">
                <div className="text-center w-full">
                  <h3 className="text-lg font-black font-display text-text-primary">{editingRole ? "Edit Role" : "Add Role"}</h3>
                  <p className="text-xs text-text-secondary font-semibold mt-0.5">Set Role Permissions</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer text-text-secondary hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {/* Role Name */}
                <div className="relative">
                  <input type="text" placeholder=" " value={roleName} onChange={e => setRoleName(e.target.value)}
                    className="peer w-full border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-xs font-semibold text-text-primary bg-bg-card outline-none transition-all placeholder-transparent h-[45px]" />
                  <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[11px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none">
                    Role Name
                  </span>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-3">Role Permissions</h4>
                  <div className="flex items-center justify-between py-2 border-b border-border-divider/50">
                    <span className="text-xs font-bold text-text-primary">Administrator Access</span>
                    <label className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold cursor-pointer select-none">
                      <input type="checkbox" checked={selectAll} onChange={e => handleSelectAll(e.target.checked)}
                        className="rounded border-border-divider h-3.5 w-3.5 accent-primary cursor-pointer" />
                      Select All
                    </label>
                  </div>

                  {rolePerms.map((perm, idx) => (
                    <div key={perm.key} className="flex items-center justify-between py-2.5 border-b border-border-divider/30">
                      <span className="text-xs font-medium text-text-secondary">{perm.key}</span>
                      <div className="flex items-center gap-4">
                        {(["read", "write", "create"] as const).map(field => (
                          <label key={field} className="flex items-center gap-1 text-[11px] text-text-secondary font-medium cursor-pointer select-none capitalize">
                            <input type="checkbox" checked={perm[field]} onChange={() => togglePerm(idx, field)}
                              className="rounded border-border-divider h-3.5 w-3.5 accent-primary cursor-pointer" />
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={handleSaveRole}
                    className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm transition-all cursor-pointer">
                    Submit
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
