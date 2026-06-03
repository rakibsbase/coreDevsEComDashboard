import React, { useState, useMemo } from "react";
import { PageId, EmailFolder, EmailLabel, EmailMessage } from "@/types";
import {
  Search, Star, Trash2, Edit3, MoreVertical, Paperclip, ChevronLeft,
  ChevronRight, Inbox, Send, FileText, AlertOctagon, Trash, Plus, Check, Search as SearchIcon,
  Mail, Folder, Tag, RefreshCw, Minus, X, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Send as SendIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

interface Props { setActivePage: (p: PageId) => void; }

// Helper for Initials
const getInitials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const ComposeMailModal = ({ onClose, onSend }: { onClose: () => void, onSend: () => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Message' })
    ],
    content: '',
  });

  return (
    <div className="absolute bottom-4 right-4 w-full max-w-[500px] bg-bg-card rounded-t-xl rounded-b-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-border-divider overflow-hidden z-50 flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-app border-b border-border-divider">
        <span className="text-[13.5px] font-bold text-text-primary">Compose Mail</span>
        <div className="flex items-center gap-2">
          <button className="text-text-secondary hover:text-text-primary cursor-pointer"><Minus size={16} /></button>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary cursor-pointer"><X size={16} /></button>
        </div>
      </div>
      {/* Form */}
      <div className="flex flex-col flex-1">
        <div className="border-b border-border-divider flex items-center px-4 py-2.5">
          <span className="text-[13px] text-text-secondary w-8">To:</span>
          <input type="text" className="flex-1 outline-none text-[13px] text-text-primary bg-transparent font-medium" />
          <span className="text-[12px] font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors">Cc | Bcc</span>
        </div>
        <div className="border-b border-border-divider flex items-center px-4 py-2.5">
          <span className="text-[13px] text-text-secondary w-16">Subject:</span>
          <input type="text" className="flex-1 outline-none text-[13px] text-text-primary bg-transparent font-medium" />
        </div>
        {/* Formatting Toolbar */}
        <div className="border-b border-border-divider flex items-center px-4 py-2 gap-5 bg-bg-card">
          <div className="flex items-center gap-3.5 text-text-secondary">
            <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`cursor-pointer hover:text-text-primary transition-colors ${editor?.isActive('bold') ? 'text-primary' : ''}`}><Bold size={15} /></button>
            <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`cursor-pointer hover:text-text-primary transition-colors ${editor?.isActive('underline') ? 'text-primary' : ''}`}><Underline size={15} /></button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`cursor-pointer hover:text-text-primary transition-colors ${editor?.isActive('italic') ? 'text-primary' : ''}`}><Italic size={15} /></button>
            <button onClick={() => editor?.chain().focus().toggleStrike().run()} className={`cursor-pointer hover:text-text-primary transition-colors ${editor?.isActive('strike') ? 'text-primary' : ''}`}><Strikethrough size={15} /></button>
          </div>
          <div className="flex items-center gap-3.5 text-text-secondary border-l border-border-divider pl-4">
            <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={`cursor-pointer hover:text-text-primary transition-colors ${editor?.isActive({ textAlign: 'left' }) ? 'text-primary' : ''}`}><AlignLeft size={15} /></button>
            <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={`cursor-pointer hover:text-text-primary transition-colors ${editor?.isActive({ textAlign: 'center' }) ? 'text-primary' : ''}`}><AlignCenter size={15} /></button>
            <button onClick={() => editor?.chain().focus().setTextAlign('right').run()} className={`cursor-pointer hover:text-text-primary transition-colors ${editor?.isActive({ textAlign: 'right' }) ? 'text-primary' : ''}`}><AlignRight size={15} /></button>
            <button onClick={() => editor?.chain().focus().setTextAlign('justify').run()} className={`cursor-pointer hover:text-text-primary transition-colors ${editor?.isActive({ textAlign: 'justify' }) ? 'text-primary' : ''}`}><AlignJustify size={15} /></button>
          </div>
        </div>
        {/* Textarea */}
        <div className="px-4 py-4 flex-1 bg-bg-card">
          <EditorContent editor={editor} className="w-full h-[180px] text-[13.5px] text-text-primary bg-transparent font-medium leading-relaxed prose dark:prose-invert max-w-none overflow-y-auto [&_.tiptap]:outline-none [&_.tiptap]:h-full [&_.tiptap]:min-h-[180px] [&_.tiptap.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap.is-editor-empty:first-child::before]:text-text-secondary [&_.tiptap.is-editor-empty:first-child::before]:float-left [&_.tiptap.is-editor-empty:first-child::before]:pointer-events-none" />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-bg-card border-t border-border-divider">
          <div className="flex items-center gap-4">
            <button onClick={() => { onSend(); }} className="bg-primary hover:bg-primary/90 text-white font-bold text-[13px] py-2 px-5 rounded-lg flex items-center gap-2 transition-all shadow-md cursor-pointer">
              Send <SendIcon size={14} />
            </button>
            <button className="text-text-secondary hover:text-text-primary cursor-pointer"><Paperclip size={18} /></button>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-text-secondary hover:text-text-primary cursor-pointer"><MoreVertical size={16} /></button>
            <button onClick={onClose} className="text-text-secondary hover:text-rose-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EmailApp({ setActivePage }: Props) {
  const { emails, setEmails, triggerToast } = useApp();

  const [activeFolder, setActiveFolder] = useState<EmailFolder>("inbox");
  const [activeLabel, setActiveLabel] = useState<EmailLabel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [openedEmail, setOpenedEmail] = useState<EmailMessage | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<{ id: string, prevFolder: EmailFolder }[] | null>(null);

  // Derive filtered emails
  const filteredEmails = useMemo(() => {
    return emails.filter(e => {
      // Basic Search
      const matchSearch = e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.from.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Folder logic
      let matchFolder = false;
      if (activeFolder === "starred") matchFolder = e.isStarred && e.folder !== "trash";
      else matchFolder = e.folder === activeFolder;

      // Label logic
      const matchLabel = activeLabel ? e.labels.includes(activeLabel) : true;

      return matchSearch && matchFolder && matchLabel;
    });
  }, [emails, searchQuery, activeFolder, activeLabel]);

  // Sidebar mapping
  const folders: { id: EmailFolder; label: string; icon: any; count?: number; badgeBg?: string; badgeText?: string }[] = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: emails.filter(e => e.folder === "inbox" && !e.isRead).length, badgeBg: "bg-primary/10", badgeText: "text-primary" },
    { id: "sent", label: "Sent", icon: Send },
    { id: "draft", label: "Draft", icon: FileText, count: emails.filter(e => e.folder === "draft").length, badgeBg: "bg-amber-100", badgeText: "text-amber-600" },
    { id: "starred", label: "Starred", icon: Star, count: emails.filter(e => e.isStarred && e.folder !== "trash").length },
    { id: "spam", label: "Spam", icon: AlertOctagon, count: emails.filter(e => e.folder === "spam" && !e.isRead).length, badgeBg: "bg-rose-100", badgeText: "text-rose-600" },
    { id: "trash", label: "Trash", icon: Trash },
  ];

  const labelsList: { id: EmailLabel; label: string; color: string }[] = [
    { id: "private", label: "Private", color: "bg-rose-500" },
    { id: "company", label: "Company", color: "bg-primary" },
    { id: "important", label: "Important", color: "bg-amber-400" },
    { id: "personal", label: "Personal", color: "bg-emerald-500" },
  ];

  const toggleSelect = (id: string) => {
    setSelectedEmails(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedEmails.length === filteredEmails.length && filteredEmails.length > 0) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmails.map(e => e.id));
    }
  };

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEmails(emails.map(x => x.id === id ? { ...x, isStarred: !x.isStarred } : x));
  };

  const markRead = (id: string, read: boolean) => {
    setEmails(emails.map(x => x.id === id ? { ...x, isRead: read } : x));
  };

  const deleteSelected = () => {
    if (!selectedEmails.length) return;
    const toDelete = emails.filter(x => selectedEmails.includes(x.id));
    setLastDeleted(toDelete.map(x => ({ id: x.id, prevFolder: x.folder })));

    setEmails(emails.map(x => selectedEmails.includes(x.id) ? { ...x, folder: "trash" } : x));
    setSelectedEmails([]);
    
    // Auto-clear undo
    setTimeout(() => setLastDeleted(null), 5000);
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    setEmails(emails.map(x => {
      const found = lastDeleted.find(d => d.id === x.id);
      return found ? { ...x, folder: found.prevFolder } : x;
    }));
    setLastDeleted(null);
    triggerToast("Action undone");
  };

  const cycleTagForSelected = () => {
    if (!selectedEmails.length) return;
    const currentLabels = labelsList.map(l => l.id);
    setEmails(emails.map(x => {
      if (selectedEmails.includes(x.id)) {
        let nextLabel: EmailLabel = "company";
        if (x.labels.length > 0) {
          const idx = currentLabels.indexOf(x.labels[0]);
          nextLabel = currentLabels[(idx + 1) % currentLabels.length];
        }
        return { ...x, labels: [nextLabel] };
      }
      return x;
    }));
  };

  const toggleReadSelected = () => {
    if (!selectedEmails.length) return;
    const areAllRead = emails.filter(x => selectedEmails.includes(x.id)).every(x => x.isRead);
    setEmails(emails.map(x => selectedEmails.includes(x.id) ? { ...x, isRead: !areAllRead } : x));
  };

  const handleRefresh = () => {
    setSelectedEmails([]);
    triggerToast("Refreshed");
  };

  const openEmail = (email: EmailMessage) => {
    if (!email.isRead) markRead(email.id, true);
    setOpenedEmail(email);
  };

  const renderSidebar = () => (
    <div className="w-full md:w-[260px] shrink-0 border-r border-border-divider bg-bg-card p-6 h-full flex flex-col rounded-l-2xl">
      <button onClick={() => setIsComposing(true)} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-xl shadow-[0_4px_10px_rgba(124,58,237,0.3)] transition-all text-[13px] mb-6 cursor-pointer">
        Compose
      </button>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2">
        <div className="space-y-0.5">
          {folders.map(f => {
            const Icon = f.icon;
            const active = activeFolder === f.id && !activeLabel;
            return (
              <button key={f.id} onClick={() => { setActiveFolder(f.id); setActiveLabel(null); setOpenedEmail(null); }}
                className={`w-full flex items-center justify-between px-2 py-2 text-[13px] transition-all cursor-pointer group relative ${
                  active ? "text-primary font-bold" : "text-text-secondary font-medium hover:text-text-primary"
                }`}>
                {active && <div className="absolute -left-6 top-1 bottom-1 w-[3px] bg-primary rounded-r-md"></div>}
                <div className="flex items-center gap-4">
                  <Icon size={16} className={active ? "text-primary" : "text-text-secondary opacity-70 group-hover:opacity-100"} />
                  {f.label}
                </div>
                {!!f.count && f.count > 0 && (
                  <span className={`px-2 py-[2px] text-[10px] font-bold rounded-full ${f.badgeBg || "bg-bg-app"} ${f.badgeText || "text-text-secondary"}`}>
                    {f.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-2 block mb-3">Labels</span>
          {labelsList.map(l => {
            const active = activeLabel === l.id;
            return (
              <button key={l.id} onClick={() => { setActiveLabel(l.id); setOpenedEmail(null); }}
                className={`w-full flex items-center px-2 py-2 text-[13px] transition-all cursor-pointer group relative ${
                  active ? "text-primary font-bold" : "text-text-secondary font-medium hover:text-text-primary"
                }`}>
                {active && <div className="absolute -left-6 top-1 bottom-1 w-[3px] bg-primary rounded-r-md"></div>}
                <div className="flex items-center gap-4">
                  <span className={`h-2 w-2 rounded-full ${l.color}`}></span>
                  {l.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-140px)] flex bg-bg-card border border-border-divider rounded-2xl shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block">{renderSidebar()}</div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-bg-card relative">
        {openedEmail ? (
          /* SINGLE EMAIL VIEW */
          <div className="flex flex-col h-full bg-bg-card animate-fadeIn">
            {/* Toolbar */}
            <div className="h-16 border-b border-border-divider flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setOpenedEmail(null)} className="p-2 -ml-2 rounded-lg hover:bg-bg-app text-text-secondary hover:text-text-primary transition-all cursor-pointer">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => { markRead(openedEmail.id, false); setOpenedEmail(null); }} className="p-2 rounded-lg hover:bg-bg-app text-text-secondary hover:text-text-primary cursor-pointer" title="Mark unread">
                    <Check size={16} />
                  </button>
                  <button onClick={() => { toggleSelect(openedEmail.id); deleteSelected(); setOpenedEmail(null); }} className="p-2 rounded-lg hover:bg-bg-app text-text-secondary hover:text-text-primary cursor-pointer" title="Trash">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary font-medium">1 of 50</span>
                <button className="p-1.5 rounded hover:bg-bg-app text-text-secondary hover:text-text-primary cursor-pointer"><ChevronLeft size={16}/></button>
                <button className="p-1.5 rounded hover:bg-bg-app text-text-secondary hover:text-text-primary cursor-pointer"><ChevronRight size={16}/></button>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display text-text-primary">{openedEmail.subject}</h2>
                <div className="flex gap-2">
                  {openedEmail.labels.map(l => {
                    const lc = labelsList.find(x => x.id === l)?.color || "bg-gray-500";
                    return (
                      <span key={l} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bg-app border border-border-divider text-[10px] font-bold text-text-secondary uppercase">
                        <span className={`h-2 w-2 rounded-full ${lc}`}></span> {l}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                {openedEmail.from.avatar ? (
                  <img src={openedEmail.from.avatar} className="h-10 w-10 rounded-full object-cover bg-bg-app" alt="" />
                ) : (
                  <span className="h-10 w-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                    {getInitials(openedEmail.from.name)}
                  </span>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-text-primary">{openedEmail.from.name}</p>
                      <p className="text-xs text-text-secondary font-medium">&lt;{openedEmail.from.email}&gt;</p>
                    </div>
                    <p className="text-xs text-text-secondary font-semibold">{openedEmail.date}</p>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1">
                    To: {openedEmail.to.map(t => t.name).join(", ")}
                  </p>
                </div>
                <button onClick={(e) => toggleStar(e, openedEmail.id)} className="p-2 text-text-secondary hover:text-amber-400 transition-colors cursor-pointer">
                  <Star size={18} className={openedEmail.isStarred ? "fill-amber-400 text-amber-400" : ""} />
                </button>
              </div>

              {/* Body */}
              <div className="prose dark:prose-invert max-w-none text-sm text-text-primary" dangerouslySetInnerHTML={{ __html: openedEmail.body }}></div>

              {/* Attachments */}
              {openedEmail.attachments && openedEmail.attachments.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border-divider">
                  <p className="text-xs font-bold text-text-secondary mb-3">{openedEmail.attachments.length} Attachments</p>
                  <div className="flex gap-4 flex-wrap">
                    {openedEmail.attachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-border-divider rounded-xl bg-bg-app hover:bg-bg-card transition-colors cursor-pointer min-w-[160px]">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-primary truncate max-w-[120px]">{att.name}</p>
                          <p className="text-[10px] text-text-secondary font-medium">{att.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* EMAIL LIST VIEW */
          <div className="flex flex-col h-full animate-fadeIn bg-bg-card">
            {/* Top Search Bar */}
            <div className="h-[60px] border-b border-border-divider flex items-center px-4 shrink-0 bg-bg-card">
              <SearchIcon size={18} className="text-text-secondary mr-3" />
              <input type="text" placeholder="Search mail" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-[13px] outline-none bg-transparent placeholder:text-text-secondary text-text-primary font-medium" />
            </div>

            {/* Action Bar */}
            <div className="h-[54px] border-b border-border-divider flex items-center justify-between px-4 sm:px-6 shrink-0 bg-bg-card">
              <div className="flex items-center gap-4">
                <div 
                  className={`flex items-center justify-center w-4 h-4 rounded-md border cursor-pointer ${selectedEmails.length > 0 ? "bg-primary border-primary" : "border-border-divider"}`}
                  onClick={toggleSelectAll}
                >
                  {selectedEmails.length === filteredEmails.length && filteredEmails.length > 0 ? (
                    <Check size={12} strokeWidth={3} className="text-white" />
                  ) : selectedEmails.length > 0 ? (
                    <div className="w-2 h-[2px] bg-white rounded-full"></div>
                  ) : null}
                </div>
                {selectedEmails.length > 0 && (
                  <div className="flex items-center gap-2 ml-1">
                    <button onClick={deleteSelected} className="p-2 rounded-full hover:bg-bg-app text-text-secondary transition-all cursor-pointer" title="Delete">
                      <Trash2 size={15} />
                    </button>
                    <button onClick={toggleReadSelected} className="p-2 rounded-full hover:bg-bg-app text-text-secondary cursor-pointer" title="Mark Read/Unread">
                      <Mail size={15} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-bg-app text-text-secondary cursor-pointer" title="Move to Folder">
                      <Folder size={15} />
                    </button>
                    <button onClick={cycleTagForSelected} className="p-2 rounded-full hover:bg-bg-app text-text-secondary cursor-pointer" title="Change Tag">
                      <Tag size={15} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-bg-app text-text-secondary cursor-pointer" title="Mark Spam">
                      <AlertOctagon size={15} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <button onClick={handleRefresh} className="p-2 rounded-full hover:bg-bg-app cursor-pointer" title="Refresh">
                  <RefreshCw size={15} />
                </button>
                <button className="p-2 rounded-full hover:bg-bg-app cursor-pointer">
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-bg-card">
              {filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                  <Inbox size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold">No conversations in {activeFolder}.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredEmails.map((email, idx) => (
                    <div key={email.id} onClick={() => openEmail(email)}
                      className={`flex items-center gap-4 py-3 px-4 sm:px-6 cursor-pointer transition-all border-b border-border-divider last:border-b-0 group relative hover:z-10 ${
                        selectedEmails.includes(email.id) ? "bg-primary/5" : "bg-bg-card hover:bg-bg-app"
                      }`}
                    >
                      <div className="flex items-center gap-4 shrink-0" onClick={e => e.stopPropagation()}>
                        <div 
                          className={`flex items-center justify-center w-4 h-4 rounded-md border cursor-pointer transition-colors ${selectedEmails.includes(email.id) ? "bg-primary border-primary" : "border-border-divider bg-bg-card"}`}
                          onClick={() => toggleSelect(email.id)}
                        >
                          {selectedEmails.includes(email.id) && <Check size={12} strokeWidth={3} className="text-white" />}
                        </div>
                        <button onClick={(e) => toggleStar(e, email.id)} className="cursor-pointer outline-none">
                          <Star size={16} className={email.isStarred ? "fill-amber-400 text-amber-400" : "text-text-secondary opacity-60 hover:opacity-100"} />
                        </button>
                        {email.from.avatar ? (
                          <img src={email.from.avatar} className="h-7 w-7 rounded-full object-cover bg-bg-app" alt="" />
                        ) : (
                          <span className="h-7 w-7 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {getInitials(email.from.name)}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className={`text-[13px] truncate w-[140px] md:w-[180px] shrink-0 ${!email.isRead ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`}>
                          {email.from.name}
                        </span>
                        <div className="flex-1 truncate">
                          <span className={`text-[13px] truncate ${!email.isRead ? "font-bold text-text-primary" : "font-medium text-text-secondary"}`}>
                            {email.subject}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {email.attachments && <Paperclip size={14} className="text-text-secondary mr-2" />}
                        <div className="flex items-center gap-1.5 justify-end w-[80px]">
                          {email.labels.map(l => {
                            const lc = labelsList.find(x => x.id === l)?.color || "bg-gray-500";
                            return <span key={l} className={`h-1.5 w-1.5 rounded-full ${lc}`} title={l}></span>
                          })}
                          <span className={`text-[11px] tracking-wide ${!email.isRead ? "font-bold text-primary" : "font-medium text-text-secondary"}`}>
                            {email.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Undo Snackbar */}
        {lastDeleted && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[13px] px-5 py-3 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] flex items-center gap-6 z-50 animate-fadeIn pointer-events-auto">
            <span className="font-semibold tracking-wide">Conversation moved to Trash.</span>
            <button onClick={undoDelete} className="text-amber-400 font-bold hover:text-amber-300 uppercase tracking-widest text-[11px]">Undo</button>
          </div>
        )}

        {/* Compose Modal */}
        {isComposing && (
          <ComposeMailModal 
            onClose={() => setIsComposing(false)} 
            onSend={() => { setIsComposing(false); triggerToast('Message sent'); }} 
          />
        )}
      </div>
    </div>
  );
}
