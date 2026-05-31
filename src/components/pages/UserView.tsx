import React, { useEffect, useState } from "react";
import { PageId, UserRow } from "@/types";
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Link as LinkIcon,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Briefcase,
  Layers,
  ChevronLeft,
  Lock,
  Smartphone,
  Globe,
  Check,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowUpRight,
  UserCheck,
  Mail,
  HelpCircle,
  Building,
  MapPin,
  Calendar,
  Settings,
  XCircle,
  ToggleLeft,
  PlusCircle,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { confirmAction, confirmSave, toastSuccess } from "@/utils/confirm";

interface UserViewProps {
  setActivePage: (p: PageId) => void;
}

type UserDetailsStatus = UserRow["status"] | "Suspended";

export default function UserView({ setActivePage }: UserViewProps) {
  const { selectedUser, setSelectedUser, users, setUsers, triggerToast } = useApp();
  const [activeTab, setActiveTab] = useState("Account");

  // User details state (for edit interaction)
  const [userDetails, setUserDetails] = useState<{
    name: string;
    username: string;
    email: string;
    role: UserRow["role"];
    status: UserDetailsStatus;
    contact: string;
    languages: string;
    country: string;
    taxId: string;
  }>({
    name: selectedUser?.name || "",
    username: selectedUser?.username || "",
    email: selectedUser?.email || "",
    role: selectedUser?.role || "Subscriber",
    status: selectedUser?.status || "Pending",
    contact: "+1 (234) 456-7890",
    languages: "English",
    country: "United Kingdom",
    taxId: "TX-4987"
  });

  useEffect(() => {
    if (!selectedUser) return;
    setUserDetails((current) => ({
      ...current,
      name: selectedUser.name,
      username: selectedUser.username || selectedUser.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      email: selectedUser.email,
      role: selectedUser.role,
      status: selectedUser.status
    }));
  }, [selectedUser]);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enable2FA, setEnable2FA] = useState(true);

  // Notifications Checkbox matrix
  const [notifMatrix, setNotifMatrix] = useState({
    newForYou: { email: true, browser: true, app: true },
    accountActivity: { email: true, browser: false, app: true },
    newBrowser: { email: true, browser: true, app: false },
    newDevice: { email: false, browser: true, app: true }
  });

  // Connections state
  const [connectedAccs, setConnectedAccs] = useState([
    { id: "google", name: "Google", desc: "Calendar and Gmail integration", icon: "https://cdn-icons-png.flaticon.com/512/300/300221.png", connected: true },
    { id: "slack", name: "Slack", desc: "Dev-Ops communication server", icon: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png", connected: false },
    { id: "github", name: "GitHub", desc: "Version control repositories", icon: "https://cdn-icons-png.flaticon.com/512/25/25231.png", connected: true },
    { id: "mailchimp", name: "Mailchimp", desc: "Email marketing automation", icon: "https://cdn-icons-png.flaticon.com/512/12111/12111451.png", connected: false },
    { id: "asana", name: "Asana", desc: "Project task coordinator", icon: "https://cdn-icons-png.flaticon.com/512/5968/5968945.png", connected: false }
  ]);

  // Social account handle list
  const [socialAccs, setSocialAccs] = useState([
    { id: "facebook", name: "Facebook", handle: "https://facebook.com/johndoe.core", linked: true, bg: "text-blue-600 bg-blue-50 dark:bg-blue-950/20" },
    { id: "twitter", name: "Twitter", handle: "https://twitter.com/johndoe_core", linked: true, bg: "text-sky-500 bg-sky-50 dark:bg-sky-950/20" },
    { id: "linkedin", name: "LinkedIn", handle: "", linked: false, bg: "text-blue-700 bg-blue-50 dark:bg-blue-950/20" },
    { id: "dribbble", name: "Dribbble", handle: "", linked: false, bg: "text-pink-500 bg-pink-50 dark:bg-pink-950/20" },
    { id: "behance", name: "Behance", handle: "", linked: false, bg: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20" }
  ]);

  // Billing Address Form state
  const [billingAddress, setBillingAddress] = useState({
    companyName: "Core Devs Ltd",
    billingEmail: "admin@coredevs.com",
    taxId: "TX-99438-X",
    vatNumber: "VAT-8849-01",
    mobile: "+1 (234) 456-7890",
    country: "United Kingdom",
    state: "London",
    zipCode: "EC1A 1BB",
    city: "London",
    address: "45 Roker Terrace"
  });

  const timelineEvents = [
    { title: "Invoice #7429 was approved & paid", desc: "Jordan Stevenson confirmed receipt of custom billing specs", time: "12 mins ago" },
    { title: "Client profile information updated", desc: "John Doe updated primary administrative mailing route", time: "2 hours ago" },
    { title: "Core Devs deployment pipelines succeeded", desc: "Vite production continuous integration validated", time: "Yesterday, 4:32 PM" }
  ];

  const recentProjects = [
    { name: "Core Devs SaaS Webapp", status: "Active", lang: "React, Next.js", budget: "$12,500" },
    { name: "Logistics tracking system", status: "Completed", lang: "Kotlin, Compose", budget: "$4,200" },
    { name: "Store e-commerce microservices", status: "In Progress", lang: "Node, Express", budget: "$8,900" }
  ];

  const recentDevicesList = [
    { browser: "Chrome on Windows", device: "Dell XPS 15", location: "United States", activity: "10, Jan 2026 20:07", active: true },
    { browser: "Chrome on Android", device: "Google Pixel 3a", location: "Ghana", activity: "11, Jan 2026 10:16", active: false },
    { browser: "Chrome on MacOS", device: "Apple iMac", location: "Mayotte", activity: "11, Jan 2026 12:10", active: false },
    { browser: "Chrome on iPhone", device: "Apple iPhone XR", location: "Mauritania", activity: "12, Jan 2026 8:29", active: false }
  ];

  const billingHistory = [
    { id: "INV-2026-004", date: "May 15, 2026", amount: "$99.00", status: "Paid" },
    { id: "INV-2026-003", date: "Apr 15, 2026", amount: "$99.00", status: "Paid" },
    { id: "INV-2026-002", date: "Mar 15, 2026", amount: "$99.00", status: "Paid" },
    { id: "INV-2026-001", date: "Feb 15, 2026", amount: "$150.00", status: "Paid" }
  ];

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      triggerToast("Please enter both password fields.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast("Passwords do not match.", "error");
      return;
    }
    triggerToast("Administrative Password successfully updated!", "success");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveBillingAddress = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Billing address credentials compiled!", "success");
  };

  const handleToggleConnection = (id: string) => {
    setConnectedAccs(connectedAccs.map(acc => {
      if (acc.id === id) {
        const nextState = !acc.connected;
        triggerToast(`${acc.name} accounts integration ${nextState ? "synchronized" : "revoked"}.`, nextState ? "success" : "blank");
        return { ...acc, connected: nextState };
      }
      return acc;
    }));
  };

  const handleLinkSocial = (id: string, value: string) => {
    setSocialAccs(socialAccs.map(soc => {
      if (soc.id === id) {
        return { ...soc, handle: value, linked: !!value };
      }
      return soc;
    }));
    triggerToast(`Social credentials for ${id} recorded!`, "success");
  };

  const handleDisconnectSocial = (id: string) => {
    setSocialAccs(socialAccs.map(soc => {
      if (soc.id === id) {
        return { ...soc, handle: "", linked: false };
      }
      return soc;
    }));
    triggerToast(`Social routing credentials deleted.`, "blank");
  };

  const toggleNotifMatrix = (rowKey: keyof typeof notifMatrix, colKey: "email" | "browser" | "app") => {
    setNotifMatrix(prev => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        [colKey]: !prev[rowKey][colKey]
      }
    }));
    triggerToast("System alert preferences updated.", "success");
  };

  const handleSuspendUser = async () => {
    const nextStatus = userDetails.status === "Active" ? "Suspended" : "Active";
    const ok = await confirmAction(
      userDetails.status === "Active" ? "Suspend User?" : "Activate User?",
      `${userDetails.status === "Active" ? "Suspend" : "Activate"} ${userDetails.name}?`
    );
    if (!ok) return;
    setUserDetails({ ...userDetails, status: nextStatus });
    if (selectedUser) {
      const appStatus = nextStatus === "Suspended" ? "Inactive" : "Active";
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, status: appStatus } : user)));
      setSelectedUser({ ...selectedUser, status: appStatus });
    }
    toastSuccess(`User is now ${nextStatus}`);
  };

  const handleSaveUserProfile = async () => {
    const ok = await confirmSave("user profile");
    if (!ok) return;
    toastSuccess("User profile saved successfully");
  };

  if (!selectedUser) {
    return (
      <div className="bg-bg-card border border-border-divider rounded-2xl p-10 text-center">
        <User className="mx-auto mb-4 h-12 w-12 text-text-secondary" />
        <h2 className="text-lg font-bold text-text-primary">No user selected</h2>
        <p className="mt-1 text-sm text-text-secondary">Choose a user from the list to view profile details.</p>
        <button
          onClick={() => setActivePage("user-list")}
          className="mt-5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover"
        >
          Back to User List
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Account":
        return (
          <div className="space-y-6">
            {/* Activity Timeline logs */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-semibold text-text-primary text-sm flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                User Activity Logs
              </h3>

              <div className="relative border-l border-border-divider pl-6 ml-3 space-y-5 pt-2">
                {timelineEvents.map((ev, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[30px] top-1 bg-primary h-3.5 w-3.5 rounded-full border-2 border-bg-card flex items-center justify-center">
                      <span className="h-1.5 w-1.5 bg-bg-card rounded-full"></span>
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <h4 className="text-xs font-bold text-text-primary leading-snug">{ev.title}</h4>
                        <p className="text-[11px] text-text-secondary mt-0.5">{ev.desc}</p>
                      </div>
                      <span className="text-[10px] text-text-secondary font-semibold font-mono bg-bg-app px-2 py-0.5 rounded-md self-start sm:self-center">
                        {ev.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User projects list */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-semibold text-text-primary text-sm flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                Active Project Pipelines
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      <th className="py-2.5">Project Name</th>
                      <th className="py-2.5">Progress Stack</th>
                      <th className="py-2.5">Budget</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-divider/50 text-xs font-medium text-text-primary">
                    {recentProjects.map((proj, i) => (
                      <tr key={i} className="hover:bg-bg-app/40 transition-colors">
                        <td className="py-3.5 font-bold text-text-primary">{proj.name}</td>
                        <td className="py-3.5 text-text-secondary font-semibold">{proj.lang}</td>
                        <td className="py-3.5 font-bold">{proj.budget}</td>
                        <td className="py-3.5 text-right">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            proj.status === "Completed"
                              ? "bg-green-100/50 dark:bg-green-950/20 text-green-600 dark:text-green-400"
                              : proj.status === "Active"
                              ? "bg-primary-light text-primary"
                              : "bg-amber-100/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                          }`}>
                            {proj.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Security":
        return (
          <div className="space-y-6">
            {/* Change Password Panel */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-light text-primary rounded-xl">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-text-primary text-sm">Change Security Password</h3>
                  <p className="text-[11px] text-text-secondary">Keep your continuous deploy pipeline credentials safe.</p>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>

                <div className="p-4 bg-bg-app/60 border border-border-divider/60 rounded-xl space-y-2">
                  <h5 className="text-[11px] font-bold text-text-primary uppercase tracking-wide">Password Requirements:</h5>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px] font-medium text-text-secondary">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                      Minimum 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                      At least 1 uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                      At least one symbol (@, #, $)
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Two-step verification */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Smartphone size={18} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-display font-semibold text-text-primary text-sm">Two-step verification</h3>
                  <p className="text-[11px] text-text-secondary max-w-xl">
                    Keep your account secure with an added layer of security. We disburse SMS alerts whenever sensitive admin changes are executed.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    {enable2FA ? "Active SMS" : "Deactivated"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEnable2FA(!enable2FA);
                      triggerToast(`Two-step 2FA verification verified: ${!enable2FA ? "Active" : "Disabled"}.`, "blank");
                    }}
                    className={`w-11 h-6 rounded-full p-1 transition-all flex items-center ${
                      enable2FA ? "bg-primary justify-end" : "bg-bg-app border border-border-divider justify-start"
                    } cursor-pointer`}
                  >
                    <span className="w-4 h-4 bg-bg-card rounded-full shadow-sm"></span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-border-divider/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="font-medium text-text-primary">
                  SMS Primary Number: <span className="font-mono text-primary font-bold">+1 (968) 819-2547</span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast("Modifying Two-step credentials pending authority limit.", "error")}
                  className="text-primary hover:underline font-bold text-[11px] cursor-pointer"
                >
                  Edit Number
                </button>
              </div>
            </div>

            {/* Recent Logins Log Table */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-semibold text-text-primary text-sm">Recent Devices</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      <th className="py-2.5">Browser</th>
                      <th className="py-2.5">Device</th>
                      <th className="py-2.5">Location</th>
                      <th className="py-2.5 text-right">Recent Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-divider/50 text-xs font-medium text-text-primary">
                    {recentDevicesList.map((lg, i) => (
                      <tr key={i} className="hover:bg-bg-app/30 transition-colors">
                        <td className="py-3.5 flex items-center gap-2 font-bold">
                          <span className={`w-2 h-2 rounded-full ${lg.active ? "bg-green-500 animate-pulse" : "bg-text-secondary/30"}`}></span>
                          {lg.browser}
                        </td>
                        <td className="py-3.5 font-semibold text-text-secondary">{lg.device}</td>
                        <td className="py-3.5 text-text-secondary">{lg.location}</td>
                        <td className="py-3.5 text-right font-mono text-[11px] text-text-secondary">{lg.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Billing & Plans":
        return (
          <div className="space-y-6">
            {/* Active Subscription Overview */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-divider/50">
                <div>
                  <h3 className="font-display font-bold text-text-primary text-sm flex items-center gap-2">
                    <Layers size={16} className="text-primary" />
                    Current Plan Summary
                  </h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Active subscription detail specs.</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-primary">$99 USD / mo</span>
                  <p className="text-[10px] text-text-secondary">Renewal: Dec 09, 2026</p>
                </div>
              </div>

              {/* Attention banner */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-[12px] font-bold text-amber-800 dark:text-amber-300">We need your attention!</h5>
                  <p className="text-[11px] text-amber-700/90 dark:text-amber-400">
                    Your current Enterprise node quota requires an automatic renewal update by Dec 09. Prevent deployment latency.
                  </p>
                </div>
              </div>

              {/* Progress limit */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  <span>Usage Cycle Period</span>
                  <span>26 of 30 Days (4 days remaining)</span>
                </div>
                <div className="w-full bg-bg-app h-3 rounded-full overflow-hidden border border-border-divider">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: "86.6%" }}></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => triggerToast("Direct upgrade sequence initialized.", "success")}
                  className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
                >
                  Upgrade Plan
                </button>
                <button
                  onClick={() => triggerToast("Plan cancellation routing is safe with support.", "blank")}
                  className="border border-red-200 dark:border-red-950 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Payment Methods Card */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary text-sm flex items-center gap-2">
                    <CreditCard size={18} className="text-primary" />
                    Payment Methods
                  </h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Authorized card registries bound to billing.</p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast("Add Card sequence details pending input.", "success")}
                  className="inline-flex items-center gap-1.5 bg-primary text-white hover:bg-primary-hover px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/15 cursor-pointer"
                >
                  <Plus size={14} />
                  Add Card
                </button>
              </div>

              {/* Hardcoded Credit Card List matching specs */}
              <div className="space-y-3 pt-2">
                {[
                  { holder: "Tom McBride", type: "MasterCard", digits: "**** **** **** 9865", exp: "12/26", primary: true, expired: false, logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
                  { holder: "Mildred Wagner", type: "Visa", digits: "**** **** **** 5678", exp: "02/27", primary: false, expired: false, logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" },
                  { holder: "Lester Jennings", type: "Amex", digits: "**** ****** *0002", exp: "08/24", primary: false, expired: true, logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" }
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${
                      card.primary
                        ? "border-primary/40 bg-primary-light"
                        : "border-border-divider bg-bg-app/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-9 bg-bg-card p-1 rounded-lg border border-border-divider flex items-center justify-center shrink-0">
                        <img src={card.logo} alt={card.type} className="max-h-6 object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-text-primary">{card.holder}</h4>
                          {card.primary && (
                            <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-md">Primary</span>
                          )}
                          {card.expired && (
                            <span className="px-2 py-0.5 text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 rounded-md">Expired</span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-text-secondary mt-0.5">{card.digits} • Exp {card.exp}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 self-end sm:self-center">
                      <button
                        onClick={() => triggerToast(`Edit card specs for ${card.holder}`, "success")}
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => triggerToast(`Revoked card credentials.`, "blank")}
                        className="text-[11px] font-bold text-text-secondary hover:text-red-500 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Address Card */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-5">
              <div className="pb-2 border-b border-border-divider/50">
                <h3 className="font-display font-semibold text-text-primary text-sm flex items-center gap-2">
                  <Building size={16} className="text-primary" />
                  Billing Address Specs
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">Provide legal details for invoice declarations.</p>
              </div>

              <form onSubmit={handleSaveBillingAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Company Name</label>
                    <input
                      type="text"
                      value={billingAddress.companyName}
                      onChange={(e) => setBillingAddress({ ...billingAddress, companyName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Billing Email</label>
                    <input
                      type="email"
                      value={billingAddress.billingEmail}
                      onChange={(e) => setBillingAddress({ ...billingAddress, billingEmail: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Tax ID</label>
                    <input
                      type="text"
                      value={billingAddress.taxId}
                      onChange={(e) => setBillingAddress({ ...billingAddress, taxId: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">VAT Number</label>
                    <input
                      type="text"
                      value={billingAddress.vatNumber}
                      onChange={(e) => setBillingAddress({ ...billingAddress, vatNumber: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Mobile Number</label>
                    <input
                      type="text"
                      value={billingAddress.mobile}
                      onChange={(e) => setBillingAddress({ ...billingAddress, mobile: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Country</label>
                    <input
                      type="text"
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">State / Province</label>
                    <input
                      type="text"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Zip Code</label>
                    <input
                      type="text"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Billing Street Address</label>
                    <input
                      type="text"
                      value={billingAddress.address}
                      onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-divider bg-bg-app/50 text-text-primary focus:border-primary outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>

                <div className="flex justify-start gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerToast("Billing reset.", "blank")}
                    className="border border-border-divider text-text-primary hover:bg-bg-app px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="space-y-6">
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-start gap-3 pb-2 border-b border-border-divider/50">
                <div className="p-2.5 bg-primary-light text-primary rounded-xl">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-text-primary text-sm">System Notification Subscriptions</h3>
                  <p className="text-[11px] text-text-secondary">Determine which delivery channels capture core event dispatches.</p>
                </div>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full border-collapse text-left text-xs font-medium">
                  <thead>
                    <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-bg-app/40 rounded-t-xl">
                      <th className="py-3 px-4">Type Alert Channel</th>
                      <th className="py-3 px-4 text-center">Email</th>
                      <th className="py-3 px-4 text-center">Browser</th>
                      <th className="py-3 px-4 text-center">App</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-divider/50 text-text-primary">
                    <tr className="hover:bg-bg-app/10">
                      <td className="py-3.5 px-4 font-semibold">New for you</td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newForYou.email}
                          onChange={() => toggleNotifMatrix("newForYou", "email")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newForYou.browser}
                          onChange={() => toggleNotifMatrix("newForYou", "browser")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newForYou.app}
                          onChange={() => toggleNotifMatrix("newForYou", "app")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-app/10">
                      <td className="py-3.5 px-4 font-semibold">Account activity</td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.accountActivity.email}
                          onChange={() => toggleNotifMatrix("accountActivity", "email")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.accountActivity.browser}
                          onChange={() => toggleNotifMatrix("accountActivity", "browser")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.accountActivity.app}
                          onChange={() => toggleNotifMatrix("accountActivity", "app")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-app/10">
                      <td className="py-3.5 px-4 font-semibold">A new browser used to sign in</td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newBrowser.email}
                          onChange={() => toggleNotifMatrix("newBrowser", "email")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newBrowser.browser}
                          onChange={() => toggleNotifMatrix("newBrowser", "browser")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newBrowser.app}
                          onChange={() => toggleNotifMatrix("newBrowser", "app")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-app/10">
                      <td className="py-3.5 px-4 font-semibold">A new device is linked</td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newDevice.email}
                          onChange={() => toggleNotifMatrix("newDevice", "email")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newDevice.browser}
                          onChange={() => toggleNotifMatrix("newDevice", "browser")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifMatrix.newDevice.app}
                          onChange={() => toggleNotifMatrix("newDevice", "app")}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => triggerToast("System notification dispatches synchronized.", "success")}
                  className="bg-primary text-white hover:bg-primary-hover px-4.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );

      case "Connections":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Connected Accounts card */}
              <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-display font-semibold text-text-primary text-sm">Connected Accounts</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Toggle live pipeline sync bindings.</p>
                </div>

                <div className="space-y-4.5 pt-2">
                  {connectedAccs.map((acc) => (
                    <div key={acc.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={acc.icon} alt={acc.name} className="w-8 h-8 rounded-lg object-contain bg-bg-card p-0.5 border border-border-divider" />
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">{acc.name}</h4>
                          <p className="text-[10px] text-text-secondary tracking-tight">{acc.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleConnection(acc.id)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center shrink-0 ${
                          acc.connected ? "bg-primary justify-end" : "bg-bg-app border border-border-divider justify-start"
                        } cursor-pointer`}
                      >
                        <span className="w-4 h-4 bg-bg-card rounded-full shadow-2xs"></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Accounts card */}
              <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-display font-semibold text-text-primary text-sm">Social Accounts</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Connect handles for representative profile references.</p>
                </div>

                <div className="space-y-4 pt-2">
                  {socialAccs.map((soc) => (
                    <div key={soc.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 flex-1 max-w-[70%]">
                        <span className={`p-2 rounded-lg text-xs font-bold ${soc.bg} shrink-0`}>
                          {soc.name.substring(0, 2)}
                        </span>
                        {soc.linked ? (
                          <span className="text-xs text-text-primary font-bold truncate">{soc.handle}</span>
                        ) : (
                          <input
                            type="text"
                            placeholder={`Link ${soc.name} URL`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleLinkSocial(soc.id, (e.target as HTMLInputElement).value);
                              }
                            }}
                            className="w-full text-xs font-semibold px-2 py-1 outline-none text-text-primary border-b border-border-divider bg-transparent focus:border-primary"
                          />
                        )}
                      </div>

                      <div className="shrink-0">
                        {soc.linked ? (
                          <button
                            onClick={() => handleDisconnectSocial(soc.id)}
                            className="p-1.5 border border-red-200 hover:bg-red-50 hover:text-red-500 rounded-lg text-text-secondary transition-colors cursor-pointer"
                            title="Disconnect"
                          >
                            <Trash2 size={13} />
                          </button>
                        ) : (
                          <button
                            onClick={() => triggerToast(`Provide an address link and press Enter.`, "blank")}
                            className="p-1.5 border border-border-divider hover:bg-bg-app rounded-lg text-text-secondary text-[10px] font-bold cursor-pointer"
                          >
                            Route
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => setActivePage("user-list")}
            className="flex items-center text-xs font-bold text-text-secondary hover:text-primary transition-all mb-1 cursor-pointer font-sans"
          >
            <ChevronLeft size={14} className="mr-1" />
            Back to User List
          </button>
          <h2 className="text-xl font-bold font-display text-text-primary">User Profile Details</h2>
          <p className="text-xs text-text-secondary">Explore Representative configuration logs</p>
        </div>

        <button
          onClick={handleSaveUserProfile}
          className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-primary/10 transition-all cursor-pointer"
        >
          <Edit size={14} />
          Edit Profile
        </button>
      </div>

      {/* Grid view structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Profile details block & Plan block */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* USER CARD DETAILS */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs text-center space-y-5">
            <div className="relative inline-block mx-auto">
              <img
                src={selectedUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.name}`}
                alt={selectedUser.name}
                className="h-24 w-24 rounded-2xl object-cover border-4 border-primary/25 mx-auto"
              />
              <span className={`absolute bottom-1 right-1 h-3.5 w-3.5 border-2 border-bg-card rounded-full ${userDetails.status === "Active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
            </div>

            <div>
              <h3 className="font-display font-bold text-text-primary text-lg leading-tight">{userDetails.name}</h3>
              <p className="text-xs text-text-secondary mt-1 tracking-wide font-semibold">{userDetails.role}</p>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 border-t border-b border-border-divider/50 py-3.5 text-center">
              <div>
                <span className="text-base font-extrabold text-primary font-display">1,230</span>
                <p className="text-[10px] text-text-secondary font-bold uppercase mt-1">Total Sales</p>
              </div>
              <div className="h-6 w-[1px] bg-border-divider"></div>
              <div>
                <span className="text-base font-extrabold text-primary font-display">34</span>
                <p className="text-[10px] text-text-secondary font-bold uppercase mt-1">Projects Done</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-semibold text-left pt-1">
              <h4 className="font-bold text-text-primary uppercase text-[10px] tracking-widest mb-2 border-b border-border-divider pb-2.5">Details</h4>
              
              <p className="flex justify-between pb-1">
                <span className="text-text-secondary">Username:</span>
                <span className="text-text-primary font-bold font-mono text-[11px]">@{userDetails.username}</span>
              </p>
              <p className="flex justify-between pb-1">
                <span className="text-text-secondary">Email:</span>
                <span className="text-text-primary font-bold">{userDetails.email}</span>
              </p>
              <p className="flex justify-between pb-1">
                <span className="text-text-secondary">Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${userDetails.status === "Active" ? "bg-green-100/50 text-green-600" : "bg-red-100/50 text-red-600"}`}>{userDetails.status}</span>
              </p>
              <p className="flex justify-between pb-1">
                <span className="text-text-secondary">Role:</span>
                <span className="text-text-primary font-bold">{userDetails.role}</span>
              </p>
              <p className="flex justify-between pb-1">
                <span className="text-text-secondary">Tax ID:</span>
                <span className="text-text-primary font-bold font-mono">{userDetails.taxId}</span>
              </p>
              <p className="flex justify-between pb-1">
                <span className="text-text-secondary">Contact:</span>
                <span className="text-text-primary font-bold font-mono">{userDetails.contact}</span>
              </p>
              <p className="flex justify-between pb-1">
                <span className="text-text-secondary">Languages:</span>
                <span className="text-text-primary font-bold">{userDetails.languages}</span>
              </p>
              <p className="flex justify-between pb-1">
                <span className="text-text-secondary">Country:</span>
                <span className="text-text-primary font-bold inline-flex items-center gap-1">
                  🌐 {userDetails.country}
                </span>
              </p>
            </div>

            {/* Suspend or Activate CTA user state buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  handleSaveUserProfile();
                }}
                className="bg-primary hover:bg-primary-hover text-white py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleSuspendUser}
                className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  userDetails.status === "Active"
                    ? "border-red-200 text-red-500 hover:bg-red-50/50"
                    : "border-green-200 text-green-500 hover:bg-green-50/50"
                }`}
              >
                {userDetails.status === "Active" ? "Suspend" : "Activate"}
              </button>
            </div>
          </div>

          {/* LEFT SIDEBAR PLAN CARD - Appear on all tabs matching Materio design context */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center bg-primary-light px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Active Plan</span>
              <span className="text-xs font-extrabold text-primary font-mono">$99/mo</span>
            </div>
            <div>
              <h4 className="font-display font-black text-text-primary text-sm leading-tight">Standard Plan Stack</h4>
              <p className="text-[10px] text-text-secondary mt-0.5">Enterprise service access active</p>
            </div>

            <ul className="space-y-1 text-[11px] font-semibold text-text-primary pt-1">
              <li className="flex items-center gap-1.5">
                <span className="h-1 text-primary w-1 rounded-full shrink-0"></span>
                <span>10 Cloud Users</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 text-primary w-1 rounded-full shrink-0"></span>
                <span>Up to 10 GB Local VM Storage</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 text-primary w-1 rounded-full shrink-0"></span>
                <span>Prioritized Base Support</span>
              </li>
            </ul>

            <div className="space-y-1.5 pt-2 border-t border-border-divider/50">
              <div className="flex justify-between text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">
                <span>Cycle</span>
                <span>4 Days Remaining</span>
              </div>
              <div className="w-full bg-bg-app h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "86.6%" }}></div>
              </div>
            </div>

            <button
              onClick={() => triggerToast("Direct upgrade triggered.", "success")}
              className="w-full py-2 bg-text-primary hover:bg-text-primary/90 text-bg-card text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Upgrade Plan
            </button>
          </div>

        </div>

        {/* Right Column details list with tabs: 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* horizontal sub-tabs */}
          <div className="flex bg-bg-card rounded-2xl border border-border-divider p-1.5 shadow-xs overflow-x-auto gap-1">
            {[
              { name: "Account", icon: User },
              { name: "Security", icon: Shield },
              { name: "Billing & Plans", icon: CreditCard },
              { name: "Notifications", icon: Bell },
              { name: "Connections", icon: LinkIcon }
            ].map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "text-text-secondary hover:bg-bg-app/80"
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Dynamic Tab Segment Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

