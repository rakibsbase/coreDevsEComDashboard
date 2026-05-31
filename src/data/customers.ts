import type { Customer, CustomerNotificationPrefs } from "../types";

const defaultNotifications: CustomerNotificationPrefs = {
  newForYou: { email: true, browser: false, app: false },
  accountActivity: { email: false, browser: true, app: true },
  newBrowserUsedToSignIn: { email: true, browser: true, app: true },
  newDeviceLinked: { email: false, browser: true, app: false }
};

export const initialCustomers: Customer[] = [
  {
    id: "#879861",
    name: "Stanfield Baser",
    email: "sbaser0@boston.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    status: "Active",
    contact: "+1 (234) 464-0600",
    country: "Australia",
    countryCode: "AU",
    orderCount: 157,
    totalSpent: 6420,
    joinedDate: "Aug 17, 2020, 5:48 (ET)",
    accountBalance: 7480,
    loyaltyPoints: 3000,
    loyaltyTier: "Platinum member",
    wishlistCount: 15,
    couponsCount: 21,
    username: "sbaser0",
    orderHistory: [
      { id: "#5434", date: "Mon May 16 2022", status: "Delivered", spent: 73.98 },
      { id: "#6745", date: "Wed May 03 2023", status: "Delivered", spent: 100.39 },
      { id: "#6087", date: "Thu Dec 15 2022", status: "Ready to Pickup", spent: 809.26 }
    ],
    recentDevices: [
      { browser: "Chrome on Windows", device: "Dell XPS", location: "Melbourne, AU", recentActivities: "May 26, 2026 10:24 AM" },
      { browser: "Safari on iPhone", device: "iPhone 15", location: "Sydney, AU", recentActivities: "May 25, 2026 08:11 PM" }
    ],
    addresses: [
      { id: "adr-1", type: "Home", isDefault: true, recipient: "Stanfield Baser", street: "23 Shatinon Mekalan", cityStateZip: "Melbourne, VIC 3000", country: "Australia" }
    ],
    paymentMethods: [
      { id: "pm-1", type: "Mastercard", isDefault: true, last4: "4487", expiry: "08/2028", name: "Stanfield Baser", issuer: "VICBANK", billingCountry: "Australia", origin: "United States", status: "Passed", phone: "+1 (234) 464-0600", email: "sbaser0@boston.com" }
    ],
    notifications: defaultNotifications
  },
  {
    id: "#178408",
    name: "Violet Mendoza",
    email: "violet@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    status: "Suspended",
    contact: "+1 (234) 555-0182",
    country: "United States",
    countryCode: "US",
    orderCount: 43,
    totalSpent: 1840,
    joinedDate: "Jan 12, 2022, 8:30 (ET)",
    accountBalance: 120,
    loyaltyPoints: 820,
    loyaltyTier: "Gold member",
    wishlistCount: 8,
    couponsCount: 5,
    username: "vmendoza",
    orderHistory: [
      { id: "#6124", date: "Sat Jul 02 2022", status: "Delivered", spent: 450 },
      { id: "#5519", date: "Tue Oct 12 2021", status: "Delivered", spent: 220.5 }
    ],
    recentDevices: [
      { browser: "Firefox on macOS", device: "MacBook Air", location: "Austin, US", recentActivities: "May 23, 2026 01:32 PM" }
    ],
    addresses: [
      { id: "adr-2", type: "Office", isDefault: true, recipient: "Violet Mendoza", street: "110 Market Street", cityStateZip: "Austin, TX 73301", country: "United States" }
    ],
    paymentMethods: [
      { id: "pm-2", type: "Visa", isDefault: true, last4: "1029", expiry: "02/2029", name: "Violet Mendoza", issuer: "Capital Union", billingCountry: "United States", origin: "United States", status: "Passed", phone: "+1 (234) 555-0182", email: "violet@example.com" }
    ],
    notifications: defaultNotifications
  }
];
