import { ChatContact, ChatConversation } from "../types";

export const initialChatContacts: ChatContact[] = [
  {
    id: "c1",
    name: "Felecia Rower",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?u=felecia",
    status: "online"
  },
  {
    id: "c2",
    name: "Adalberto Granzin",
    role: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/150?u=adalberto",
    status: "offline"
  },
  {
    id: "c3",
    name: "Zenia Jacobs",
    role: "Backend Developer",
    avatar: "https://i.pravatar.cc/150?u=zenia",
    status: "away"
  },
  {
    id: "c4",
    name: "Miguel Guelff",
    role: "Project Manager",
    avatar: "https://i.pravatar.cc/150?u=miguel",
    status: "busy"
  },
  {
    id: "c5",
    name: "Lauran Starner",
    role: "Marketing Manager",
    avatar: "https://i.pravatar.cc/150?u=lauran",
    status: "online"
  },
  {
    id: "c6",
    name: "Ramonita Veras",
    role: "Sales Executive",
    avatar: "https://i.pravatar.cc/150?u=ramonita",
    status: "online"
  },
  {
    id: "c7",
    name: "Verla Morgano",
    role: "Customer Support",
    avatar: "https://i.pravatar.cc/150?u=verla",
    status: "offline"
  },
  {
    id: "c8",
    name: "Cecilia Shockey",
    role: "HR Manager",
    avatar: "https://i.pravatar.cc/150?u=cecilia",
    status: "busy"
  }
];

export const initialChatConversations: ChatConversation[] = [
  {
    contactId: "c1",
    unreadCount: 1,
    lastMessageDate: "Jun 2",
    messages: [
      {
        id: "m1",
        senderId: "me",
        text: "How can we help? We're here for you!",
        time: "1:45 PM"
      },
      {
        id: "m2",
        senderId: "c1",
        text: "Hey John, I am looking for the best admin template. Could you please help me to find it out?",
        time: "1:45 PM"
      },
      {
        id: "m3",
        senderId: "c1",
        text: "It should be MUI v5 compatible.",
        time: "1:45 PM"
      },
      {
        id: "m4",
        senderId: "me",
        text: "Absolutely!",
        time: "1:46 PM"
      },
      {
        id: "m5",
        senderId: "me",
        text: "This admin template is built with MUI!",
        time: "1:46 PM"
      },
      {
        id: "m6",
        senderId: "c1",
        text: "Looks clean and fresh UI. 😍",
        time: "1:46 PM"
      },
      {
        id: "m7",
        senderId: "c1",
        text: "It's perfect for my next project.",
        time: "1:46 PM"
      },
      {
        id: "m8",
        senderId: "c1",
        text: "How can I purchase it?",
        time: "1:46 PM"
      },
      {
        id: "m9",
        senderId: "me",
        text: "Thanks, From our official site 😇",
        time: "1:46 PM"
      },
      {
        id: "m10",
        senderId: "c1",
        text: "I will purchase it for sure. 👍",
        time: "12:26 PM"
      }
    ]
  },
  {
    contactId: "c2",
    unreadCount: 0,
    lastMessageDate: "Jun 1",
    messages: [
      {
        id: "m11",
        senderId: "c2",
        text: "If it takes long you can mail me at...",
        time: "3:00 PM"
      }
    ]
  },
  {
    contactId: "c3",
    unreadCount: 0,
    lastMessageDate: "Dec 13",
    messages: [
      {
        id: "m12",
        senderId: "c3",
        text: "Thank you, looking forward to it.",
        time: "10:15 AM"
      }
    ]
  },
  {
    contactId: "c4",
    unreadCount: 0,
    lastMessageDate: "Dec 11",
    messages: [
      {
        id: "m13",
        senderId: "c4",
        text: "Thank you, looking forward to it.",
        time: "9:00 AM"
      }
    ]
  },
  {
    contactId: "c5",
    unreadCount: 0,
    lastMessageDate: "Dec 13",
    messages: [
      {
        id: "m14",
        senderId: "c5",
        text: "That sounds interesting. I'll have...",
        time: "4:30 PM"
      }
    ]
  },
  {
    contactId: "c6",
    unreadCount: 1,
    lastMessageDate: "Dec 13",
    messages: [
      {
        id: "m15",
        senderId: "c6",
        text: "Sounds good. Let's do it.",
        time: "2:00 PM"
      }
    ]
  },
  {
    contactId: "c7",
    unreadCount: 0,
    lastMessageDate: "Dec 13",
    messages: [
      {
        id: "m16",
        senderId: "c7",
        text: "Great work. Keep it up.",
        time: "11:00 AM"
      }
    ]
  },
  {
    contactId: "c8",
    unreadCount: 1,
    lastMessageDate: "Dec 13",
    messages: [
      {
        id: "m17",
        senderId: "c8",
        text: "Your Welcome! 😋",
        time: "5:00 PM"
      }
    ]
  }
];
