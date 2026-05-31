import type { OrderItem } from "../types";

export const initialOrders: OrderItem[] = [
  { id: "#5434", date: "Mon May 16 2022, 2:11 AM", customer: "Gabrielle Feyer", email: "gfeyer0@nyu.edu", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80", payment: "Paid", status: "Delivered", method: "Paypal", methodDetails: "...@gmail.com" },
  { id: "#6745", date: "Wed May 03 2023, 7:26 PM", customer: "Jackson Deignan", email: "jdeignan1@dell.com", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80", payment: "Cancelled", status: "Delivered", method: "Mastercard", methodDetails: "...5170" },
  { id: "#6087", date: "Thu Dec 15 2022, 6:51 PM", customer: "Tanya Crum", email: "tcrum2@yandex.ru", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80", payment: "Failed", status: "Ready to Pickup", method: "Visa", methodDetails: "...5234" },
  { id: "#7825", date: "Fri Aug 05 2022, 9:18 PM", customer: "Dallis Dillestone", email: "ddillestone3@archive.org", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80", payment: "Cancelled", status: "Ready to Pickup", method: "ApplePay", methodDetails: "...@gmail.com" },
  { id: "#5604", date: "Sat Jun 18 2022, 3:34 AM", customer: "Conan Kennham", email: "ckennham4@cnn.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", payment: "Cancelled", status: "Delivered", method: "Mastercard", methodDetails: "...6425" }
];
