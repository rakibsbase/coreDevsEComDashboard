import type { RoleItem, PermissionItem, PermissionKey } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ALL_PERMISSIONS: PermissionKey[] = [
  "User Management",
  "Content Management",
  "Disputes Management",
  "Database Management",
  "Financial Management",
  "Reporting",
  "API Control",
  "Repository Management",
  "Payroll",
];

function makePerms(read: PermissionKey[], write: PermissionKey[], create: PermissionKey[]) {
  return ALL_PERMISSIONS.map((key) => ({
    key,
    read: read.includes(key),
    write: write.includes(key),
    create: create.includes(key),
  }));
}

// ─── Roles ────────────────────────────────────────────────────────────────────
export const initialRoles: RoleItem[] = [
  {
    id: "role-1",
    name: "Administrator",
    userCount: 4,
    userAvatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80",
    ],
    permissions: makePerms(
      ALL_PERMISSIONS,
      ALL_PERMISSIONS,
      ALL_PERMISSIONS
    ),
    createdAt: "12 Jan 2021",
  },
  {
    id: "role-2",
    name: "Editor",
    userCount: 7,
    userAvatars: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534751516642-a131fed10495?w=60&auto=format&fit=crop&q=80",
    ],
    permissions: makePerms(
      ["User Management", "Content Management", "Reporting"],
      ["Content Management"],
      ["Content Management"]
    ),
    createdAt: "08 Mar 2021",
  },
  {
    id: "role-3",
    name: "Users",
    userCount: 5,
    userAvatars: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=60&auto=format&fit=crop&q=80",
    ],
    permissions: makePerms(
      ["User Management", "Content Management"],
      [],
      []
    ),
    createdAt: "22 Apr 2021",
  },
  {
    id: "role-4",
    name: "Support",
    userCount: 6,
    userAvatars: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=60&auto=format&fit=crop&q=80",
    ],
    permissions: makePerms(
      ["User Management", "Disputes Management", "Reporting"],
      ["Disputes Management"],
      []
    ),
    createdAt: "15 May 2021",
  },
  {
    id: "role-5",
    name: "Restricted User",
    userCount: 10,
    userAvatars: [
      "https://images.unsplash.com/photo-1548142813-c348350df52b?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=60&auto=format&fit=crop&q=80",
    ],
    permissions: makePerms(
      ["Reporting"],
      [],
      []
    ),
    createdAt: "03 Jun 2021",
  },
];

// ─── Permissions ──────────────────────────────────────────────────────────────
export const initialPermissions: PermissionItem[] = [
  {
    id: "perm-1",
    name: "Management",
    assignedTo: ["Administrator"],
    createdAt: "14 Apr 2021, 8:43 PM",
  },
  {
    id: "perm-2",
    name: "Manage Billing & Roles",
    assignedTo: ["Administrator"],
    createdAt: "16 Sep 2021, 5:20 PM",
  },
  {
    id: "perm-3",
    name: "Add & Remove Users",
    assignedTo: ["Administrator", "Editor"],
    createdAt: "14 Oct 2021, 10:20 AM",
  },
  {
    id: "perm-4",
    name: "Project Planning",
    assignedTo: ["Administrator", "Users", "Support"],
    createdAt: "14 Oct 2021, 10:20 AM",
  },
  {
    id: "perm-5",
    name: "Manage Email Sequences",
    assignedTo: ["Administrator", "Users", "Support"],
    createdAt: "23 Aug 2021, 2:00 PM",
  },
  {
    id: "perm-6",
    name: "Client Communication",
    assignedTo: ["Administrator", "Editor"],
    createdAt: "15 Apr 2021, 11:30 AM",
  },
  {
    id: "perm-7",
    name: "Only View",
    assignedTo: ["Administrator", "Restricted User"],
    createdAt: "04 Dec 2021, 8:15 PM",
  },
  {
    id: "perm-8",
    name: "Financial Management",
    assignedTo: ["Administrator", "Editor"],
    createdAt: "25 Feb 2021, 10:30 AM",
  },
  {
    id: "perm-9",
    name: "Manage Others' Tasks",
    assignedTo: ["Administrator", "Support"],
    createdAt: "04 Nov 2021, 11:45 AM",
  },
];
