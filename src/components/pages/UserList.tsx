import React, { useState, useMemo, useRef, useEffect } from "react";
import { PageId, UserRow } from "@/types";
import {
  Search,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Activity,
  Trash2,
  Eye,
  Users,
  UserPlus,
  UserCheck,
  Clock,
  Shield,
  Edit2,
  Monitor,
  User,
  Settings,
  X,
  UploadCloud,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { confirmAction, confirmDelete, confirmSave, toastSuccess } from "@/utils/confirm";
import { EmptyState } from "@/components/common/EmptyState";

interface UserListProps {
  setActivePage: (p: PageId) => void;
}

// ---------------------------------------------------------
// Realistic 50 mock users (matching screenshot layout)
// ---------------------------------------------------------
const mockInitialUsers: UserRow[] = [
  {
    id: "usr-1",
    name: "Galen Slixby",
    username: "gslixby0",
    email: "gslixby0@abc.net.au",
    avatar: "", // Initials GS
    role: "Editor",
    plan: "Enterprise",
    status: "Inactive"
  },
  {
    id: "usr-2",
    name: "Halsey Redmore",
    username: "hredmore1",
    email: "hredmore1@imgur.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    role: "Author",
    plan: "Team",
    status: "Pending"
  },
  {
    id: "usr-3",
    name: "Marjory Sicely",
    username: "msicely2",
    email: "msicely2@who.int",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    role: "Maintainer",
    plan: "Enterprise",
    status: "Active"
  },
  {
    id: "usr-4",
    name: "Cyrill Risby",
    username: "crisby3",
    email: "crisby3@wordpress.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    role: "Maintainer",
    plan: "Team",
    status: "Inactive"
  },
  {
    id: "usr-5",
    name: "Maggy Hurran",
    username: "mhurran4",
    email: "mhurran4@yahoo.co.jp",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    role: "Subscriber",
    plan: "Enterprise",
    status: "Pending"
  },
  {
    id: "usr-6",
    name: "Silvain Halstead",
    username: "shalstead5",
    email: "shalstead5@shinystat.com",
    avatar: "", // Initials SH
    role: "Author",
    plan: "Company",
    status: "Active"
  },
  {
    id: "usr-7",
    name: "Breena Gallemore",
    username: "bgallemore6",
    email: "bgallemore6@boston.com",
    avatar: "", // Initials BG
    role: "Subscriber",
    plan: "Company",
    status: "Pending"
  },
  {
    id: "usr-8",
    name: "Kathryne Liger",
    username: "kliger7",
    email: "kliger7@vinaora.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    role: "Author",
    plan: "Enterprise",
    status: "Pending"
  },
  {
    id: "usr-9",
    name: "Franz Scotfurth",
    username: "fscotfurth8",
    email: "fscotfurth8@dailymotion.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    role: "Subscriber",
    plan: "Team",
    status: "Pending"
  },
  {
    id: "usr-10",
    name: "Jillene Bellany",
    username: "jbellany9",
    email: "jbellany9@kickstarter.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    role: "Maintainer",
    plan: "Company",
    status: "Inactive"
  },
  {
    id: "usr-11",
    name: "Althea Corish",
    username: "acorisha",
    email: "acorisha@nih.gov",
    avatar: "", // initials AC
    role: "Subscriber",
    plan: "Basic",
    status: "Active"
  },
  {
    id: "usr-12",
    name: "Barnaby Gumb",
    username: "bgumbb",
    email: "bgumbb@cdc.gov",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    role: "Author",
    plan: "Team",
    status: "Active"
  },
  {
    id: "usr-13",
    name: "Chadd Everington",
    username: "ceveringtonc",
    email: "ceveringtonc@cbc.ca",
    avatar: "", // CE style
    role: "Editor",
    plan: "Enterprise",
    status: "Inactive"
  },
  {
    id: "usr-14",
    name: "Darcy Gilder",
    username: "dgilderd",
    email: "dgilderd@un.org",
    avatar: "",
    role: "Maintainer",
    plan: "Company",
    status: "Pending"
  },
  {
    id: "usr-15",
    name: "Elton Kenderdine",
    username: "ekenderdinee",
    email: "ekenderdinee@about.me",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    role: "Admin",
    plan: "Enterprise",
    status: "Active"
  },
  {
    id: "usr-16",
    name: "Floris Spoure",
    username: "fspouref",
    email: "fspouref@feedburner.com",
    avatar: "",
    role: "Subscriber",
    plan: "Team",
    status: "Inactive"
  },
  {
    id: "usr-17",
    name: "Gideon Woolatt",
    username: "gwoolattg",
    email: "gwoolattg@histats.com",
    avatar: "",
    role: "Editor",
    plan: "Basic",
    status: "Pending"
  },
  {
    id: "usr-18",
    name: "Hadria MacDermand",
    username: "hmacdermandh",
    email: "hmacdermandh@google.de",
    avatar: "https://images.unsplash.com/photo-1534751516642-a131fed10495?w=100&auto=format&fit=crop&q=80",
    role: "Author",
    plan: "Company",
    status: "Active"
  },
  {
    id: "usr-19",
    name: "Ivor O'Shiels",
    username: "ioshielsi",
    email: "ioshielsi@ft.com",
    avatar: "",
    role: "Maintainer",
    plan: "Team",
    status: "Inactive"
  },
  {
    id: "usr-20",
    name: "Janessa McGlashan",
    username: "jmcglashanj",
    email: "jmcglashanj@github.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    role: "Subscriber",
    plan: "Enterprise",
    status: "Active"
  },
  {
    id: "usr-21",
    name: "Kellen Grealis",
    username: "kgrealisk",
    email: "kgrealisk@usda.gov",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    role: "Author",
    plan: "Company",
    status: "Pending"
  },
  {
    id: "usr-22",
    name: "Lorrie Clapperton",
    username: "lclappertonl",
    email: "lclappertonl@wsj.com",
    avatar: "",
    role: "Editor",
    plan: "Basic",
    status: "Active"
  },
  {
    id: "usr-23",
    name: "Myrl Rowswell",
    username: "mrowswellm",
    email: "mrowswellm@yandex.ru",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
    role: "Admin",
    plan: "Enterprise",
    status: "Inactive"
  },
  {
    id: "usr-24",
    name: "Nelia Bartolozzi",
    username: "nbartolozzin",
    email: "nbartolozzin@networkadvertising.org",
    avatar: "",
    role: "Subscriber",
    plan: "Team",
    status: "Active"
  },
  {
    id: "usr-25",
    name: "Orson Gribble",
    username: "ogribbleo",
    email: "ogribbleo@epa.gov",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    role: "Maintainer",
    plan: "Company",
    status: "Pending"
  },
  {
    id: "usr-26",
    name: "Pennie Skirving",
    username: "pskirvingp",
    email: "pskirvingp@aboutads.info",
    avatar: "",
    role: "Author",
    plan: "Enterprise",
    status: "Inactive"
  },
  {
    id: "usr-27",
    name: "Quincy McGaughey",
    username: "qmcgaugheyq",
    email: "qmcgaugheyq@cpanel.net",
    avatar: "",
    role: "Subscriber",
    plan: "Basic",
    status: "Active"
  },
  {
    id: "usr-28",
    name: "Royce Cleaves",
    username: "rcleavesr",
    email: "rcleavesr@unicef.org",
    avatar: "",
    role: "Editor",
    plan: "Team",
    status: "Pending"
  },
  {
    id: "usr-29",
    name: "Shell Saphin",
    username: "ssaphins",
    email: "ssaphins@ca.gov",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    role: "Maintainer",
    plan: "Company",
    status: "Active"
  },
  {
    id: "usr-30",
    name: "Toby Daintith",
    username: "tdaintitht",
    email: "tdaintitht@intel.com",
    avatar: "",
    role: "Subscriber",
    plan: "Enterprise",
    status: "Inactive"
  },
  {
    id: "usr-31",
    name: "Ulysses Peake",
    username: "upeakeu",
    email: "upeakeu@amazon.com",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&auto=format&fit=crop&q=80",
    role: "Admin",
    plan: "Basic",
    status: "Active"
  },
  {
    id: "usr-32",
    name: "Valene Drance",
    username: "vdrancev",
    email: "vdrancev@oracle.com",
    avatar: "",
    role: "Author",
    plan: "Team",
    status: "Pending"
  },
  {
    id: "usr-33",
    name: "Wally Clurow",
    username: "wcluroww",
    email: "wcluroww@timesonline.co.uk",
    avatar: "",
    role: "Editor",
    plan: "Company",
    status: "Active"
  },
  {
    id: "usr-34",
    name: "Xandra Gillingham",
    username: "xgillinghamx",
    email: "xgillinghamx@microsoft.com",
    avatar: "",
    role: "Maintainer",
    plan: "Enterprise",
    status: "Inactive"
  },
  {
    id: "usr-35",
    name: "Yale Dunstone",
    username: "ydunstoney",
    email: "ydunstoney@blog.com",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&auto=format&fit=crop&q=80",
    role: "Subscriber",
    plan: "Basic",
    status: "Pending"
  },
  {
    id: "usr-36",
    name: "Zadok McPhaden",
    username: "zmcphadenz",
    email: "zmcphadenz@wired.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    role: "Author",
    plan: "Team",
    status: "Active"
  },
  {
    id: "usr-37",
    name: "Annabel Frowde",
    username: "afrowde10",
    email: "afrowde10@ebay.co.uk",
    avatar: "",
    role: "Editor",
    plan: "Company",
    status: "Pending"
  },
  {
    id: "usr-38",
    name: "Bertram Routh",
    username: "brouth11",
    email: "brouth11@craigslist.org",
    avatar: "",
    role: "Maintainer",
    plan: "Enterprise",
    status: "Active"
  },
  {
    id: "usr-39",
    name: "Clarice Clevely",
    username: "cclevely12",
    email: "cclevely12@slideshare.net",
    avatar: "",
    role: "Subscriber",
    plan: "Basic",
    status: "Inactive"
  },
  {
    id: "usr-40",
    name: "Deon MacGaffey",
    username: "dmacgaffey13",
    email: "dmacgaffey13@t-online.de",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    role: "Author",
    plan: "Team",
    status: "Active"
  },
  {
    id: "usr-41",
    name: "Erika MacGeben",
    username: "emacgeben14",
    email: "emacgeben14@wordpress.com",
    avatar: "",
    role: "Editor",
    plan: "Company",
    status: "Pending"
  },
  {
    id: "usr-42",
    name: "Fritz Spall",
    username: "fspall15",
    email: "fspall15@mapquest.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    role: "Maintainer",
    plan: "Enterprise",
    status: "Active"
  },
  {
    id: "usr-43",
    name: "Gunther Gedge",
    username: "ggedge16",
    email: "ggedge16@nasa.gov",
    avatar: "",
    role: "Subscriber",
    plan: "Basic",
    status: "Inactive"
  },
  {
    id: "usr-44",
    name: "Hope Havers",
    username: "hhavers17",
    email: "hhavers17@tumblr.com",
    avatar: "",
    role: "Author",
    plan: "Team",
    status: "Active"
  },
  {
    id: "usr-45",
    name: "Ines Hardson",
    username: "ihardson18",
    email: "ihardson18@over-blog.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    role: "Editor",
    plan: "Company",
    status: "Pending"
  },
  {
    id: "usr-46",
    name: "Justus Blazic",
    username: "jblazic19",
    email: "jblazic19@squarespace.com",
    avatar: "",
    role: "Maintainer",
    plan: "Enterprise",
    status: "Active"
  },
  {
    id: "usr-47",
    name: "Kassia Jex",
    username: "kjex1a",
    email: "kjex1a@shutterfly.com",
    avatar: "",
    role: "Subscriber",
    plan: "Basic",
    status: "Inactive"
  },
  {
    id: "usr-48",
    name: "Leroy Grist",
    username: "lgrist1b",
    email: "lgrist1b@photobucket.com",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    role: "Author",
    plan: "Team",
    status: "Active"
  },
  {
    id: "usr-49",
    name: "Mona Seawright",
    username: "mseawright1c",
    email: "mseawright1c@statcounter.com",
    avatar: "",
    role: "Editor",
    plan: "Company",
    status: "Pending"
  },
  {
    id: "usr-50",
    name: "Neddie Thoms",
    username: "nthoms1d",
    email: "nthoms1d@gravatar.com",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80",
    role: "Maintainer",
    plan: "Enterprise",
    status: "Active"
  }
];

// -------------------------------------------------------------
// Interactive Material UI Style Dropdown with Floating Labels
// -------------------------------------------------------------
interface MaterialSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  id?: string;
}

function MaterialSelect({ label, value, onChange, options, id }: MaterialSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const hasValue = value !== "" && value !== "All";
  const isFloating = isOpen || hasValue;
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div id={id} ref={dropdownRef} className="relative flex-1 min-w-[200px]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 flex items-center justify-between px-3 md:px-4 rounded-xl border bg-bg-card transition-all duration-200 cursor-pointer select-none ${
          isOpen
            ? "border-primary ring-2 ring-primary/10"
            : "border-border-divider hover:border-text-secondary/50"
        }`}
      >
        {/* Floating Label sitting exactly on the border line */}
        <span
          className={`absolute left-3 px-1 bg-bg-card font-semibold pointer-events-none transition-all duration-150 ${
            isFloating
              ? "-top-1.5 translate-y-0 text-[10px] leading-3 text-primary"
              : "top-1/2 -translate-y-1/2 text-xs text-text-secondary"
          }`}
        >
          {label}
        </span>

        {/* Selected value text */}
        <span className="text-xs font-bold text-text-primary mt-0.5">
          {hasValue ? selectedLabel : ""}
        </span>

        {/* Chevron state indicators */}
        <span className="text-text-secondary">
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-bg-card border border-border-divider rounded-xl shadow-xl z-50 py-1"
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                  value === opt.value
                    ? "bg-primary/10 text-primary"
                    : "text-text-primary hover:bg-bg-app"
                }`}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// Principal UserList Component
// -------------------------------------------------------------
export default function UserList({ setActivePage }: UserListProps) {
  const { users, setUsers, setSelectedUser, triggerToast } = useApp();

  // UI state filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Add User popup form model
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"Admin" | "Author" | "Editor" | "Maintainer" | "Subscriber">("Subscriber");
  const [newUserPlan, setNewUserPlan] = useState<"Enterprise" | "Team" | "Company" | "Basic">("Basic");
  const [newUserStatus, setNewUserStatus] = useState<"Active" | "Pending" | "Inactive">("Active");

  // Quick Action menus state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Stats Counters
  const sessionsCount = "21,459";
  const paidCount = "4,567";
  const activeCount = "19,860";
  const pendingCount = "237";

  const stats = [
    {
      title: "Session",
      value: sessionsCount,
      change: "+29%",
      isPositive: true,
      sub: "Total User",
      icon: Users,
      iconBg: "bg-purple-100 dark:bg-purple-950/40 text-primary dark:text-purple-300"
    },
    {
      title: "Paid Users",
      value: paidCount,
      change: "+18%",
      isPositive: true,
      sub: "Last week analytics",
      icon: UserPlus,
      iconBg: "bg-pink-100 dark:bg-pink-950/40 text-pink-500 dark:text-pink-300"
    },
    {
      title: "Active Users",
      value: activeCount,
      change: "-14%",
      isPositive: false,
      sub: "Last week analytics",
      icon: UserCheck,
      iconBg: "bg-green-100 dark:bg-green-950/40 text-green-500 dark:text-green-300"
    },
    {
      title: "Pending Users",
      value: pendingCount,
      change: "+42%",
      isPositive: true,
      sub: "Last week analytics",
      icon: Clock,
      iconBg: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-500 dark:text-yellow-300"
    }
  ];

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, planFilter, statusFilter]);

  // Derived user dataset filtered by query
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesPlan = planFilter === "All" || user.plan === planFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesPlan && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, planFilter, statusFilter]);

  // Paginated partition of user dataset
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

  // Selection toggle callbacks
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const visibleIds = paginatedUsers.map((u) => u.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    } else {
      const visibleIds = paginatedUsers.map((u) => u.id);
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const isAllPaginatedSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => selectedIds.includes(u.id));

  // Role decorator mapping helper (styled according to screenshot colors)
  const getRoleIconAndClass = (role: string) => {
    switch (role) {
      case "Admin":
        return {
          icon: Shield,
          color: "text-rose-500",
          bg: "bg-rose-500/10"
        };
      case "Editor":
        return {
          icon: Edit2,
          color: "text-blue-500",
          bg: "bg-blue-500/10"
        };
      case "Author":
        return {
          icon: Monitor,
          color: "text-amber-500",
          bg: "bg-amber-500/10"
        };
      case "Maintainer":
        return {
          icon: Settings,
          color: "text-green-500",
          bg: "bg-green-500/10"
        };
      case "Subscriber":
      default:
        return {
          icon: User,
          color: "text-purple-500",
          bg: "bg-purple-500/10"
        };
    }
  };

  // Status badge styling helper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400";
      case "Pending":
        return "bg-amber-100 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400";
      case "Inactive":
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
    }
  };

  // Action methods
  const handleDeleteUser = async (id: string) => {
    const user = users.find(u => u.id === id);
    const ok = await confirmDelete(user?.name || "this user");
    if (!ok) return;
    setUsers(users.filter((u) => u.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setActiveMenuId(null);
    toastSuccess("User deleted successfully");
  };

  const handleSuspendUser = async (user: UserRow) => {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    const ok = await confirmAction(
      user.status === "Active" ? "Suspend User?" : "Activate User?",
      `${user.status === "Active" ? "Suspend" : "Activate"} ${user.name}?`
    );
    if (!ok) return;
    setUsers(users.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)));
    setActiveMenuId(null);
    toastSuccess(`${user.name} is now ${nextStatus}`);
  };

  const openUserView = (user: UserRow) => {
    setSelectedUser(user);
    setActivePage("user-view");
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Username", "Email", "Role", "Plan", "Status"];
    const rows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.username || u.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      u.email,
      u.role,
      u.plan,
      u.status
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CoreDevs_Filtered_Users_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Exported ${filteredUsers.length} users list!`, "success");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      triggerToast("Please fill in Name and Email address", "error");
      return;
    }

    const ok = await confirmSave("user");
    if (!ok) return;

    const simpleUsername = newUserName.toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 10);
    const newUserRecord: UserRow = {
      id: `usr-${users.length + 101}`,
      name: newUserName,
      username: simpleUsername,
      email: newUserEmail,
      avatar: "", // Generate initials
      role: newUserRole,
      plan: newUserPlan,
      status: newUserStatus
    };

    setUsers([newUserRecord, ...users]);
    setIsAddOpen(false);
    toastSuccess("New user added successfully!");

    // Reset inputs
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Subscriber");
    setNewUserPlan("Basic");
    setNewUserStatus("Active");
  };

  // Close menus on click outside
  useEffect(() => {
    function closeDynamicDropdowns() {
      setActiveMenuId(null);
    }
    document.addEventListener("click", closeDynamicDropdowns);
    return () => document.removeEventListener("click", closeDynamicDropdowns);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 w-full"
    >
      {/* Dynamic Upper Cards List */}
      <div id="users_stats_cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-bg-card rounded-2xl border border-border-divider p-6 flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div>
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 font-sans">
                  {stat.title}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-display text-text-primary tracking-tight">
                    {stat.value}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      stat.isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary/70 mt-1 font-sans">
                  {stat.sub}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <IconComponent size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Filter and Controls Card */}
      <div id="users_filter_card" className="bg-bg-card rounded-2xl border border-border-divider shadow-xs p-6 space-y-6">
        <div>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-4">
            Filters
          </span>

          {/* Interactive Material UI Dropdowns Row */}
          <div className="flex flex-col lg:flex-row gap-5">
            <MaterialSelect
              id="role_filter_dropdown"
              label="Select Role"
              value={roleFilter}
              onChange={setRoleFilter}
              options={[
                { value: "All", label: "Select Role" },
                { value: "Admin", label: "Admin" },
                { value: "Author", label: "Author" },
                { value: "Editor", label: "Editor" },
                { value: "Maintainer", label: "Maintainer" },
                { value: "Subscriber", label: "Subscriber" }
              ]}
            />

            <MaterialSelect
              id="plan_filter_dropdown"
              label="Select Plan"
              value={planFilter}
              onChange={setPlanFilter}
              options={[
                { value: "All", label: "Select Plan" },
                { value: "Basic", label: "Basic" },
                { value: "Company", label: "Company" },
                { value: "Enterprise", label: "Enterprise" },
                { value: "Team", label: "Team" }
              ]}
            />

            <MaterialSelect
              id="status_filter_dropdown"
              label="Select Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "All", label: "Select Status" },
                { value: "Active", label: "Active" },
                { value: "Pending", label: "Pending" },
                { value: "Inactive", label: "Inactive" }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Data Table Base Box */}
      <div id="users_datatable_container" className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Dynamic Action Row */}
        <div className="p-6 border-b border-border-divider flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 border border-border-divider hover:border-text-secondary rounded-xl text-xs font-bold text-text-primary flex items-center justify-center gap-2 transition-all cursor-pointer bg-bg-card shadow-2xs"
            >
              <UploadCloud size={14} className="text-text-secondary" />
              Export
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary/60" />
              <input
                type="text"
                placeholder="Search User"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border-divider rounded-xl text-xs font-semibold text-text-primary outline-none focus:border-primary bg-bg-card transition-all placeholder:text-text-secondary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-text-secondary/60 hover:text-text-primary transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-primary text-white hover:bg-primary-hover rounded-xl px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-primary/20 transition-all cursor-pointer inline-flex"
            >
              <PlusCircle size={14} />
              Add New User
            </button>
          </div>
        </div>

        {/* Selected Rows Banner Actions */}
        {selectedIds.length > 0 && (
          <div className="px-6 py-2.5 bg-primary/5 border-b border-border-divider flex items-center justify-between text-xs font-semibold text-primary">
            <span>{selectedIds.length} users selected</span>
              <button
                onClick={async () => {
                  const ok = await confirmAction(
                    "Delete Selected Users",
                    `Are you sure you want to permanently delete the ${selectedIds.length} selected user accounts? This action is irreversible.`
                  );
                  if (!ok) return;
                  setUsers(users.filter((u) => !selectedIds.includes(u.id)));
                  setSelectedIds([]);
                  toastSuccess("Selected users deleted");
                }}
              className="px-3 py-1 bg-red-100 dark:bg-rose-950/30 text-red-600 dark:text-rose-400 hover:bg-red-200 hover:dark:bg-rose-950/50 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0"
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* Datatable Frame */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-bg-app/20 select-none">
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary/20"
                  />
                </th>
                <th className="py-4 px-4 font-bold text-text-secondary">USER</th>
                <th className="py-4 px-4 font-bold text-text-secondary">EMAIL</th>
                <th className="py-4 px-4 font-bold text-text-secondary">ROLE</th>
                <th className="py-4 px-4 font-bold text-text-secondary">PLAN</th>
                <th className="py-4 px-4 font-bold text-text-secondary">STATUS</th>
                <th className="py-4 px-6 font-bold text-text-secondary text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider/50">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={Users} title="No users found" description="Try adjusting search, role, plan, or status filters." />
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isSelected = selectedIds.includes(user.id);
                  const roleStyle = getRoleIconAndClass(user.role);
                  const RoleIcon = roleStyle.icon;
                  const cleanUsername = user.username || user.name.toLowerCase().replace(/[^a-z0-9]/g, "");

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-bg-app/40 transition-all font-medium text-xs text-text-primary ${
                        isSelected ? "bg-primary/5 hover:bg-primary/10" : ""
                      }`}
                    >
                      <td className="py-3 px-6">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(user.id, e.target.checked)}
                          className="h-4 w-4 rounded border-border-divider text-primary focus:ring-primary/20"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* Circular Dynamic Avatar initials or Image */}
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-9 w-9 rounded-full object-cover shrink-0 border border-border-divider"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                          )}

                          <div className="flex flex-col">
                            <button
                              onClick={() => openUserView(user)}
                              className="font-bold text-text-primary hover:text-primary transition-colors text-left leading-tight"
                            >
                              {user.name}
                            </button>
                            <span className="text-[10px] text-text-secondary font-semibold">
                              @{cleanUsername}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-text-secondary">
                        {user.email}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-semibold">
                          <span className={`p-1 rounded-lg ${roleStyle.bg} ${roleStyle.color} shrink-0`}>
                            <RoleIcon size={12} />
                          </span>
                          <span className="text-text-primary">{user.role}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-text-primary">
                        {user.plan}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeStyle(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="py-3 px-6 text-right relative">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              handleDeleteUser(user.id);
                            }}
                            className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>

                          <button
                            onClick={() => openUserView(user)}
                            className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                            title="View Profile"
                          >
                            <Eye size={13} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === user.id ? null : user.id);
                              }}
                              className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-app rounded-lg transition-all cursor-pointer"
                            >
                              <MoreVertical size={13} />
                            </button>

                            {/* Popper contextual list menu */}
                            <AnimatePresence>
                              {activeMenuId === user.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.1 }}
                                  className="absolute right-0 mt-1 w-32 bg-bg-card border border-border-divider rounded-xl shadow-xl z-50 py-1 text-left"
                                >
                                  <button
                                    onClick={() => {
                                      openUserView(user);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[11px] font-semibold text-text-primary hover:bg-bg-app transition-colors"
                                  >
                                    Edit Roles
                                  </button>
                                  <button
                                    onClick={() => handleSuspendUser(user)}
                                    className="w-full text-left px-3 py-1.5 text-[11px] font-semibold text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                                  >
                                    {user.status === "Active" ? "Suspend User" : "Activate User"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteUser(user.id);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[11px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-rose-950/20 transition-colors"
                                  >
                                    Delete Record
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Multi-Functional Pagination Panel */}
        <div className="p-4 px-6 border-t border-border-divider/50 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          {/* Rows selector dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
            <span>Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-bg-card border border-border-divider rounded-lg px-2.5 py-1 text-xs font-bold text-text-primary outline-none focus:border-primary appearance-none pr-7 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2 text-text-secondary pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Range string builder */}
            <span className="text-xs font-semibold text-text-secondary">
              {filteredUsers.length === 0
                ? "0-0 of 0"
                : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    filteredUsers.length
                  )} of ${filteredUsers.length}`}
            </span>

            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                className="p-1.5 border border-border-divider hover:bg-bg-app text-text-secondary rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                className="p-1.5 border border-border-divider hover:bg-bg-app text-text-secondary rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center Backdrop Modal: Add New User */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-bg-card border border-border-divider rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-divider pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <UserPlus className="text-primary" size={18} />
                  <h3 className="font-display font-bold text-text-primary text-sm">
                    Add New User
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 hover:bg-bg-app text-text-secondary hover:text-text-primary rounded-xl transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Form panel fields */}
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-bg-app border border-border-divider focus:border-primary rounded-xl px-3 py-2 text-xs font-semibold outline-none text-text-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. johndoe@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-bg-app border border-border-divider focus:border-primary rounded-xl px-3 py-2 text-xs font-semibold outline-none text-text-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                      Role
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRow["role"])}
                      className="w-full bg-bg-app border border-border-divider focus:border-primary rounded-xl px-3 py-2 text-xs font-bold text-text-primary outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Author">Author</option>
                      <option value="Editor">Editor</option>
                      <option value="Maintainer">Maintainer</option>
                      <option value="Subscriber">Subscriber</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                      Plan
                    </label>
                    <select
                      value={newUserPlan}
                      onChange={(e) => setNewUserPlan(e.target.value as UserRow["plan"])}
                      className="w-full bg-bg-app border border-border-divider focus:border-primary rounded-xl px-3 py-2 text-xs font-bold text-text-primary outline-none"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Team">Team</option>
                      <option value="Company">Company</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                    Status
                  </label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as UserRow["status"])}
                    className="w-full bg-bg-app border border-border-divider focus:border-primary rounded-xl px-3 py-2 text-xs font-bold text-text-primary outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Confirm Dialog trigger */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-divider mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 border border-border-divider hover:border-text-secondary rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer bg-bg-card"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

