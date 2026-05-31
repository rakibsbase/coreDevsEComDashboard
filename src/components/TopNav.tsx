import { useState, useRef, useEffect } from "react";
import { PageId } from "@/types";
import {
  Search,
  Sun,
  Moon,
  Bell,
  Mail,
  User,
  Settings,
  DollarSign,
  HelpCircle,
  LogOut,
  X,
  MessageSquare,
  FileCheck,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import CoreDevsLogo from "@/components/CoreDevsLogo";

interface TopNavProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function TopNav({ activePage, setActivePage }: TopNavProps) {
  const { darkMode, setDarkMode, setSidebarOpen, triggerToast, logout } = useApp();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [profileDropUp, setProfileDropUp] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      setProfileDropUp(window.innerHeight - rect.bottom < 280);
    }

    setShowProfileDropdown((open) => !open);
    setShowNotificationsDropdown(false);
  };

  const notifications = [
    {
      id: "notif-1",
      title: "Congratulations Flora 🎉",
      desc: "Won the monthly bestseller gold badge",
      time: "1h ago",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      unread: true,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: "notif-2",
      title: "Cecilia Becker",
      desc: "Accepted your connection request",
      time: "12h ago",
      initials: "CB",
      unread: true,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "notif-3",
      title: "Bernard Woods",
      desc: "You have a new message from Bernard",
      time: "May 18, 8:26 AM",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
      unread: false,
      color: "bg-green-100 text-green-600"
    },
    {
      id: "notif-4",
      title: "Monthly report generated",
      desc: "July month financial report is ready",
      time: "Apr 24, 10:30 AM",
      icon: "file",
      unread: false,
      color: "bg-cyan-100 text-cyan-600"
    }
  ];

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <nav className="h-16 backdrop-blur-md bg-bg-card/95 border-b border-border-divider px-4 sm:px-6 fixed top-0 right-0 left-0 lg:left-[260px] flex items-center justify-between z-40 overflow-visible transition-all">
      {/* Left side: Search bar & mobile menu toggle */}
      <div className="flex items-center gap-2 flex-1 sm:flex-initial max-w-[200px] xs:max-w-xs sm:max-w-md">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-text-secondary hover:bg-bg-app rounded-xl transition-all cursor-pointer shrink-0"
          title="Open Menu"
        >
          <Menu size={18} />
        </button>

        {/* Mobile branding icon only on tiny devices */}
        <div className="lg:hidden flex items-center pr-1 select-none shrink-0 m-0">
          <CoreDevsLogo iconSize="w-7 h-7" withText={false} />
          <span className="hidden xs:inline sm:hidden font-display font-extrabold text-[13px] text-text-primary ml-1 pr-1 truncate">CoreDevs</span>
        </div>

        <div className="flex-1 flex items-center relative min-w-0 max-w-[140px] xs:max-w-[200px] sm:max-w-sm md:w-96">
          <Search className={`absolute left-3 w-4 h-4 transition-colors shrink-0 ${searchFocused ? "text-primary" : "text-text-secondary/60"}`} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-9 pr-12 sm:pr-12 md:pr-12 py-2 rounded-xl border text-xs font-semibold transition-all outline-none truncate ${searchFocused
                ? "border-primary ring-2 ring-primary/10 bg-bg-card text-text-primary shadow-sm"
                : "border-border-divider bg-bg-app/70 hover:bg-bg-app text-text-secondary placeholder:text-text-secondary"
              }`}
          />
          <div className="hidden md:flex absolute right-3 top-2 items-center gap-1 text-[9px] bg-bg-card border border-border-divider text-text-secondary px-1.5 py-0.5 rounded-lg shadow-2xs font-mono font-semibold pointer-events-none">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-3 sm:gap-3.5 shrink-0 select-none overflow-visible">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-text-secondary hover:bg-bg-app/80 hover:text-text-primary rounded-xl transition-all quick-action cursor-pointer flex items-center justify-center shrink-0"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative flex items-center" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotificationsDropdown(!showNotificationsDropdown);
              setShowProfileDropdown(false);
            }}
            className="p-2 text-text-secondary hover:bg-bg-app/80 hover:text-text-primary rounded-xl transition-all quick-action relative cursor-pointer flex items-center justify-center shrink-0"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-bg-card leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotificationsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full right-0 mt-2 w-[380px] max-w-[calc(100vw-24px)] bg-bg-card border border-border-divider rounded-xl shadow-xl z-[9999] overflow-hidden"
              >
                <div className="p-4 px-5 border-b border-border-divider flex items-center justify-between bg-bg-app/50">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-text-primary text-sm">Notifications</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 dark:bg-purple-950/40 text-primary dark:text-purple-300 rounded-full">
                      2 New
                    </span>
                  </div>
                  <button className="p-1 text-text-secondary hover:text-text-primary rounded-lg">
                    <Mail size={16} />
                  </button>
                </div>

                <div className="max-h-[360px] overflow-y-auto divide-y divide-border-divider/50 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-bg-app/40 transition-all flex gap-3 relative cursor-pointer ${n.unread ? "bg-primary/5" : ""}`}
                    >
                      {n.unread && (
                        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary"></span>
                      )}

                      <div className="flex-shrink-0">
                        {n.avatar ? (
                          <img
                            src={n.avatar}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : n.initials ? (
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-display font-medium text-xs ${n.color}`}>
                            {n.initials}
                          </div>
                        ) : (
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center ${n.color}`}>
                            <FileCheck size={16} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h4 className="text-xs font-semibold text-text-primary truncate">{n.title}</h4>
                        <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">{n.desc}</p>
                        <span className="text-[10px] text-text-secondary/70 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-bg-app/30">
                  <button
                    onClick={() => {
                      setShowNotificationsDropdown(false);
                      setActivePage("manage-reviews");
                    }}
                    className="w-full text-center py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                  >
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-border-divider shrink-0"></div>

        {/* Profile Dropdown Container */}
        <div className="relative flex items-center" ref={profileRef}>
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-bg-app/80 transition-all cursor-pointer shrink-0"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="John Doe"
                className="h-8 w-8 rounded-full object-cover border border-primary/20"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-bg-card rounded-full"></span>
            </div>
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: profileDropUp ? -15 : 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: profileDropUp ? -15 : 15, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`absolute ${profileDropUp ? "bottom-full mb-2" : "top-full mt-2"} right-0 w-56 bg-bg-card border border-border-divider rounded-xl shadow-xl z-[9999] overflow-hidden`}
              >
                {/* User Card */}
                <div className="p-4 border-b border-border-divider flex items-center gap-3 bg-bg-app/20">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="John Doe"
                    className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <h3 className="font-display font-bold text-text-primary text-sm leading-tight">John Doe</h3>
                    <p className="text-[11px] text-text-secondary mt-0.5">admin@coredevs.com</p>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActivePage("user-view");
                    }}
                    className="flex items-center w-full px-4 py-2 text-xs font-semibold text-text-primary hover:bg-bg-app hover:text-primary rounded-xl transition-all cursor-pointer"
                  >
                    <User size={15} className="mr-3 text-text-secondary" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActivePage("settings");
                    }}
                    className="flex items-center w-full px-4 py-2 text-xs font-semibold text-text-primary hover:bg-bg-app hover:text-primary rounded-xl transition-all cursor-pointer"
                  >
                    <Settings size={15} className="mr-3 text-text-secondary" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActivePage("referrals");
                    }}
                    className="flex items-center w-full px-4 py-2 text-xs font-semibold text-text-primary hover:bg-bg-app hover:text-primary rounded-xl transition-all cursor-pointer"
                  >
                    <DollarSign size={15} className="mr-3 text-text-secondary" />
                    <span>Pricing & Referrals</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActivePage("settings");
                    }}
                    className="flex items-center w-full px-4 py-2 text-xs font-semibold text-text-primary hover:bg-bg-app hover:text-primary rounded-xl transition-all cursor-pointer"
                  >
                    <HelpCircle size={15} className="mr-3 text-text-secondary" />
                    <span>FAQ & Support</span>
                  </button>
                </div>

                <div className="p-3 border-t border-border-divider bg-bg-app/40">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      triggerToast("John Doe logged out successfully.", "success");
                      logout();
                    }}
                    className="w-full flex items-center justify-center py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all cursor-pointer"
                  >
                    <LogOut size={14} className="mr-2" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
