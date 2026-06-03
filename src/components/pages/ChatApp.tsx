"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { PageId, ChatContact, ChatConversation, ChatMessage } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Check,
  CheckCheck,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  setActivePage?: (p: PageId) => void;
}

export default function ChatApp({ setActivePage }: Props) {
  const { chatContacts, chatConversations, setChatConversations } = useApp();

  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active chat conversation
  const activeConversation = useMemo(() => {
    return chatConversations.find((c) => c.contactId === activeContactId);
  }, [chatConversations, activeContactId]);

  const activeContact = useMemo(() => {
    return chatContacts.find((c) => c.id === activeContactId);
  }, [chatContacts, activeContactId]);

  // Derived list of contacts for search
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return chatContacts;
    return chatContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatContacts, searchQuery]);

  // Scroll to bottom when message is sent or conversation is opened
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation?.messages]);

  // Handle select contact (clear unread count)
  const handleSelectContact = (contactId: string) => {
    setActiveContactId(contactId);
    setChatConversations(
      chatConversations.map((c) => {
        if (c.contactId === contactId) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      })
    );
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeContactId) return;

    const newMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: "me",
      text: messageInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };

    let updatedConversations = [...chatConversations];
    const existingIndex = updatedConversations.findIndex(
      (c) => c.contactId === activeContactId
    );

    if (existingIndex >= 0) {
      updatedConversations[existingIndex] = {
        ...updatedConversations[existingIndex],
        messages: [...updatedConversations[existingIndex].messages, newMessage],
        lastMessageDate: "Today",
      };
    } else {
      updatedConversations.push({
        contactId: activeContactId,
        messages: [newMessage],
        unreadCount: 0,
        lastMessageDate: "Today",
      });
    }

    setChatConversations(updatedConversations);
    setMessageInput("");
  };

  const getStatusColor = (status: ChatContact["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-amber-500";
      case "busy":
        return "bg-red-500";
      case "offline":
      default:
        return "bg-gray-400";
    }
  };

  const renderSidebar = () => (
    <div className="w-full md:w-[320px] shrink-0 border-r border-border-divider bg-bg-card h-full flex flex-col rounded-l-2xl">
      {/* Search Header */}
      <div className="h-[70px] border-b border-border-divider px-5 flex items-center gap-3 shrink-0">
        <div className="relative shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            className="w-10 h-10 rounded-full object-cover"
            alt="Me"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-bg-card rounded-full"></div>
        </div>

        <div className="relative flex-1 group">
          <div
            className="flex items-center bg-bg-app rounded-full px-4 py-2 cursor-pointer border border-border-divider hover:border-primary/50 transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={16} className="text-text-secondary mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search Contacts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-text-primary placeholder:text-text-secondary cursor-pointer pointer-events-none"
              readOnly
            />
          </div>

          {/* Contacts Dropdown */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-divider rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
              >
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-bg-app rounded-lg px-3 py-2 text-sm outline-none border border-border-divider focus:border-primary text-text-primary"
                    autoFocus
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto pb-2">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => {
                        handleSelectContact(contact.id);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-app cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <span className="text-[13px] font-bold text-text-primary truncate">
                        {contact.name}
                      </span>
                    </div>
                  ))}
                  {filteredContacts.length === 0 && (
                    <div className="px-4 py-3 text-sm text-text-secondary text-center font-medium">
                      No contacts found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {chatConversations.map((conv) => {
          const contact = chatContacts.find((c) => c.id === conv.contactId);
          if (!contact) return null;

          const lastMessage =
            conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1]
              : null;
          const isActive = activeContactId === conv.contactId;

          return (
            <div
              key={conv.contactId}
              onClick={() => handleSelectContact(conv.contactId)}
              className={`flex items-start gap-4 p-4 cursor-pointer transition-all border-b border-border-divider last:border-b-0 ${
                isActive ? "bg-[#8b5cf6] text-white" : "hover:bg-bg-app text-text-primary"
              }`}
            >
              <div className="relative shrink-0 mt-1">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full object-cover bg-bg-app"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 border-2 ${
                    isActive ? "border-[#8b5cf6]" : "border-bg-card"
                  } rounded-full ${getStatusColor(contact.status)}`}
                ></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`text-[14px] font-bold truncate pr-2 ${
                      isActive ? "text-white" : "text-[#2F2B3D] dark:text-white"
                    }`}
                  >
                    {contact.name}
                  </h4>
                  <span
                    className={`text-[11px] font-semibold shrink-0 ${
                      isActive ? "text-white/80" : "text-text-secondary"
                    }`}
                  >
                    {conv.lastMessageDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p
                    className={`text-[13px] truncate pr-3 ${
                      isActive ? "text-white/90" : "text-text-secondary"
                    }`}
                  >
                    {lastMessage ? lastMessage.text : "No messages yet."}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="shrink-0 flex items-center justify-center w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-140px)] flex bg-bg-card border border-border-divider rounded-2xl shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block">{renderSidebar()}</div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F7FA] dark:bg-[#161421] relative">
        {!activeContact ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-10 h-10 border-[3px] border-primary rounded-full absolute -top-2 -left-3 animate-ping opacity-20"></div>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
            </div>
            <p className="text-[#4B465C] dark:text-text-secondary text-[15px] font-semibold">
              Select a contact to start a conversation.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full animate-fadeIn bg-[#F8F7FA] dark:bg-[#161421]">
            {/* Header */}
            <div className="h-[70px] bg-bg-card border-b border-border-divider px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="w-10 h-10 rounded-full object-cover bg-bg-app"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-bg-card rounded-full ${getStatusColor(
                      activeContact.status
                    )}`}
                  ></div>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-text-primary">
                    {activeContact.name}
                  </h3>
                  <p className="text-[12px] text-text-secondary font-medium">
                    {activeContact.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 text-text-secondary">
                <button className="p-2 hover:bg-bg-app hover:text-text-primary rounded-full transition-colors cursor-pointer">
                  <Phone size={18} />
                </button>
                <button className="p-2 hover:bg-bg-app hover:text-text-primary rounded-full transition-colors cursor-pointer">
                  <Video size={18} />
                </button>
                <button className="p-2 hover:bg-bg-app hover:text-text-primary rounded-full transition-colors cursor-pointer">
                  <Search size={18} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-2 hover:bg-bg-app hover:text-text-primary rounded-full transition-colors cursor-pointer"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {/* More Menu Dropdown */}
                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-bg-card rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-border-divider py-2 z-50 origin-top-right"
                      >
                        <button className="w-full text-left px-4 py-2 text-[13.5px] text-text-primary hover:bg-bg-app font-medium cursor-pointer">
                          View Contact
                        </button>
                        <button className="w-full text-left px-4 py-2 text-[13.5px] text-text-primary hover:bg-bg-app font-medium cursor-pointer">
                          Mute Notifications
                        </button>
                        <button className="w-full text-left px-4 py-2 text-[13.5px] text-text-primary hover:bg-bg-app font-medium cursor-pointer">
                          Block Contact
                        </button>
                        <button className="w-full text-left px-4 py-2 text-[13.5px] text-text-primary hover:bg-bg-app font-medium cursor-pointer">
                          Clear Chat
                        </button>
                        <button className="w-full text-left px-4 py-2 text-[13.5px] text-text-primary hover:bg-bg-app font-medium cursor-pointer text-rose-500">
                          Block
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-6"
              onClick={() => setShowMoreMenu(false)}
            >
              {activeConversation?.messages.map((msg, index) => {
                const isMe = msg.senderId === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-3 max-w-[75%] ${
                      isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {!isMe && (
                      <img
                        src={activeContact.avatar}
                        className="w-8 h-8 rounded-full shrink-0"
                        alt=""
                      />
                    )}
                    {isMe && (
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        className="w-8 h-8 rounded-full shrink-0"
                        alt=""
                      />
                    )}

                    <div className="flex flex-col gap-1 w-full">
                      <div
                        className={`px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                          isMe
                            ? "bg-[#8b5cf6] text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm"
                            : "bg-white dark:bg-[#2F3349] text-text-primary border border-border-divider/50 rounded-t-2xl rounded-br-2xl rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div
                        className={`flex items-center gap-1.5 text-[11px] font-medium text-text-secondary mt-1 ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        {isMe && (
                          <span className="text-green-500">
                            {msg.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                          </span>
                        )}
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Footer / Input */}
            <div className="h-[80px] bg-bg-card border-t border-border-divider px-6 flex items-center gap-3 shrink-0">
              <div className="flex-1 bg-bg-app dark:bg-white/5 border border-border-divider rounded-full flex items-center px-4 py-2 transition-colors focus-within:border-primary/50 shadow-sm">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-[14.5px] text-text-primary placeholder:text-text-secondary h-10"
                />
                <div className="flex items-center gap-3 text-text-secondary shrink-0 pl-3">
                  <button className="hover:text-primary transition-colors cursor-pointer">
                    <Bot size={18} />
                  </button>
                  <button className="hover:text-primary transition-colors cursor-pointer">
                    <Smile size={18} />
                  </button>
                  <button className="hover:text-primary transition-colors cursor-pointer">
                    <Mic size={18} />
                  </button>
                  <button className="hover:text-primary transition-colors cursor-pointer">
                    <Paperclip size={18} />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                className="w-[100px] h-12 flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-full font-bold text-[14px] transition-colors shadow-md shadow-primary/20 shrink-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={!messageInput.trim()}
              >
                Send <Send size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
