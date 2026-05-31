import type { ClientBalance, Meeting, Transaction } from "../types";

export const initialTransactions: Transaction[] = [
  { id: "tx-1", source: "Paypal", method: "Received Money", amount: 24820, type: "credit", subtitle: "Received Money", status: "success" },
  { id: "tx-2", source: "Credit Card", method: "Digital Ocean", amount: -1250, type: "debit", subtitle: "Digital Ocean Billing", status: "success" },
  { id: "tx-3", source: "Mastercard", method: "Netflix subscription", amount: -99, type: "debit", subtitle: "Netflix", status: "success" },
  { id: "tx-4", source: "Wallet", method: "Mac'D payment", amount: -82, type: "debit", subtitle: "Mac'D", status: "success" },
  { id: "tx-5", source: "Transfer", method: "Refund refund", amount: 8934, type: "credit", subtitle: "Refund", status: "success" }
];

export const initialMeetings: Meeting[] = [
  { id: "meet-1", title: "Call with Woods", date: "21 Jul", time: "08:20-10:30", tag: "Business", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80" },
  { id: "meet-2", title: "Call with Hilda", date: "24 Jul", time: "11:30-12:00", tag: "Meditation", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80" },
  { id: "meet-3", title: "Conference call", date: "28 Jul", time: "05:00-6:45", tag: "Dinner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80" },
  { id: "meet-4", title: "Meeting with Mark", date: "03 Aug", time: "07:00-8:30", tag: "Meetup", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop&q=80" }
];

export const initialClientBalances: ClientBalance[] = [
  { id: "#4987", clientName: "Jordan Stevenson", email: "don85@johnson.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80", total: 3428, balance: 724, status: "up" },
  { id: "#4988", clientName: "Stephanie Burns", email: "brenda49@taylor.info", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80", total: 5219, balance: "Paid", status: "down" },
  { id: "#4989", clientName: "Tony Herrera", email: "smithtiffani@powers.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80", total: 3719, balance: "Paid", status: "success" },
  { id: "#4990", clientName: "Kevin Patton", email: "mejlageorge@lee-perez.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop&q=80", total: 4749, balance: "Paid", status: "pending" }
];
