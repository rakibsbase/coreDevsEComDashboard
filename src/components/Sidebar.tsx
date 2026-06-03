import React, { useState, useEffect } from "react";
import { PageId } from "@/types";
import {
  ShoppingBag,
  FileText,
  User,
  ChevronDown,
  ChevronRight,
  Settings as SettingsIcon,
  Award,
  Star,
  LogOut,
  X,
  Circle,
  Lock,
  Mail,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

export default function Sidebar({
  activePage,
  setActivePage: setPageProp,
}: SidebarProps) {
  const { sidebarOpen, setSidebarOpen, triggerToast, logout } = useApp();

  const setActivePage = (page: PageId) => {
    setPageProp(page);
    setSidebarOpen(false);
  };

  // State trackers for accordion sections
  const [ecommerceOpen, setEcommerceOpen] = useState(true);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);

  // Nested eCommerce sub-accordion lists
  const [productsOpen, setProductsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);

  // Keep parent accordions open if child items are active
  useEffect(() => {
    if (
      [
        "dashboard",
        "products-list",
        "add-product",
        "category-list",
        "orders-list",
        "order-details",
        "customers-list",
        "customer-details",
        "manage-reviews",
        "referrals",
        "settings",
      ].includes(activePage)
    ) {
      setEcommerceOpen(true);
    }
    if (
      ["products-list", "add-product", "category-list"].includes(activePage)
    ) {
      setProductsOpen(true);
    }
    if (["orders-list", "order-details"].includes(activePage)) {
      setOrdersOpen(true);
    }
    if (
      [
        "invoice-list",
        "invoice-preview",
        "invoice-edit",
        "invoice-add",
      ].includes(activePage)
    ) {
      setInvoiceOpen(true);
    }
    if (["user-list", "user-view"].includes(activePage)) {
      setUserOpen(true);
    }
    if (["roles-list", "permissions-list"].includes(activePage)) {
      setRolesOpen(true);
    }
  }, [activePage]);

  // Style generators for single leaf links
  const menuItemClass = (page: PageId) => {
    const isActive = activePage === page;
    if (isActive) {
      return "flex items-center w-auto h-10 px-4 my-1 mx-3 text-xs font-bold rounded-lg text-white bg-[#6D28D9] dark:bg-primary shadow-sm shadow-primary/20 transition-all duration-200 cursor-pointer select-none";
    }
    return "flex items-center w-auto h-10 px-4 my-1 mx-3 text-xs font-bold rounded-lg text-[#2F2B3D] hover:text-[#6D28D9] hover:bg-primary-light dark:text-[#C9C4DE] dark:hover:text-white dark:hover:bg-white/10 transition-all duration-200 cursor-pointer select-none";
  };

  // Style generators for parent accordions
  const accordionHeaderClass = (isOpen: boolean) => {
    return `flex items-center justify-between w-auto h-10 px-4 my-1 mx-3 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none ${
      isOpen
        ? "bg-primary-light text-[#6D28D9] shadow-xs dark:bg-white/10 dark:text-white dark:shadow-none"
        : "text-[#2F2B3D] hover:text-[#6D28D9] hover:bg-primary-light dark:text-[#C9C4DE] dark:hover:text-white dark:hover:bg-white/10"
    }`;
  };

  // Nested secondary subheaders for Products, Orders, etc.
  const subMenuHeaderClass = (isOpen: boolean, isChildActive: boolean) => {
    return `flex items-center justify-between w-auto h-10 px-4 my-1 mx-3 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none ${
      isChildActive
        ? "text-[#6D28D9] dark:text-purple-400 font-bold"
        : "text-[#2F2B3D] hover:text-[#6D28D9] hover:bg-primary-light dark:text-[#C9C4DE] dark:hover:text-white dark:hover:bg-white/10"
    }`;
  };

  const logoutAction = () => {
    triggerToast("Logged out of Core Devs panel.", "success");
    logout();
  };

  return (
    <>
      {/* Mobile back-drop overlay curtain */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-[260px] bg-bg-card dark:bg-bg-app text-text-primary border-r border-border-divider dark:border-white/10 h-screen fixed top-0 left-0 flex flex-col z-50 overflow-y-auto select-none transition-all duration-350 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Dynamic header / Title block */}
        <div className="p-6 pb-2 flex items-center justify-between gap-3 select-none">
          <button
            onClick={() => setActivePage("dashboard")}
            className="font-display text-lg font-extrabold uppercase tracking-[0.08em] text-[#2F2B3D] hover:text-[#6D28D9] dark:text-white dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Go to dashboard"
          >
            CORE DEVS
          </button>
          {/* Close trigger for small layouts */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 bg-bg-card hover:bg-bg-app text-[#4B465C] hover:text-[#2F2B3D] dark:bg-white/10 dark:hover:bg-white/15 dark:text-[#C9C4DE] dark:hover:text-white rounded-xl cursor-pointer transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Categories container */}
        <div className="flex-1 px-1 py-4 space-y-1">
          {/* Elegant header divider line */}
          <div className="flex items-center px-6 my-4 select-none">
            <span className="text-[10px] font-bold text-[#4B465C] dark:text-text-secondary uppercase tracking-widest bg-bg-card dark:bg-bg-app pr-3">
              Apps & Pages
            </span>
            <div className="flex-1 border-t border-border-divider/50"></div>
          </div>

          {/* PARENT ACCORDION: ECOMMERCE */}
          <div className="space-y-0.5">
            <button
              onClick={() => setEcommerceOpen(!ecommerceOpen)}
              className={accordionHeaderClass(ecommerceOpen)}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag
                  size={15}
                  className="text-[#4B465C] dark:text-current dark:opacity-70 shrink-0"
                />
                <span>eCommerce</span>
              </div>
              <span className="text-[#4B465C] dark:text-current dark:opacity-70">
                {ecommerceOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {ecommerceOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5">
                    {/* Dashboard Page link */}
                    <button
                      onClick={() => setActivePage("dashboard")}
                      className={menuItemClass("dashboard")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Dashboard</span>
                    </button>

                    {/* NESTED ACCORDION: Products */}
                    <div>
                      <button
                        onClick={() => setProductsOpen(!productsOpen)}
                        className={subMenuHeaderClass(
                          productsOpen,
                          [
                            "products-list",
                            "add-product",
                            "category-list",
                          ].includes(activePage),
                        )}
                      >
                        <div className="flex items-center">
                          <Circle
                            size={7}
                            strokeWidth={2.5}
                            className="mr-3.5 shrink-0 text-[#6F6B7D] dark:text-current dark:opacity-70"
                          />
                          <span>Products</span>
                        </div>
                        <span className="text-[#4B465C] dark:text-current dark:opacity-70">
                          {productsOpen ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {productsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-5"
                          >
                            <button
                              onClick={() => setActivePage("products-list")}
                              className={menuItemClass("products-list")}
                            >
                              <Circle
                                size={5}
                                strokeWidth={2.5}
                                className="mr-3 shrink-0"
                              />
                              <span>List</span>
                            </button>
                            <button
                              onClick={() => setActivePage("add-product")}
                              className={menuItemClass("add-product")}
                            >
                              <Circle
                                size={5}
                                strokeWidth={2.5}
                                className="mr-3 shrink-0"
                              />
                              <span>Add</span>
                            </button>
                            <button
                              onClick={() => setActivePage("category-list")}
                              className={menuItemClass("category-list")}
                            >
                              <Circle
                                size={5}
                                strokeWidth={2.5}
                                className="mr-3 shrink-0"
                              />
                              <span>Category</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* NESTED ACCORDION: Orders */}
                    <div>
                      <button
                        onClick={() => setOrdersOpen(!ordersOpen)}
                        className={subMenuHeaderClass(
                          ordersOpen,
                          ["orders-list", "order-details"].includes(activePage),
                        )}
                      >
                        <div className="flex items-center">
                          <Circle
                            size={7}
                            strokeWidth={2.5}
                            className="mr-3.5 shrink-0 text-[#6F6B7D] dark:text-current dark:opacity-70"
                          />
                          <span>Orders</span>
                        </div>
                        <span className="text-[#4B465C] dark:text-current dark:opacity-70">
                          {ordersOpen ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {ordersOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-5"
                          >
                            <button
                              onClick={() => setActivePage("orders-list")}
                              className={menuItemClass("orders-list")}
                            >
                              <Circle
                                size={5}
                                strokeWidth={2.5}
                                className="mr-3 shrink-0"
                              />
                              <span>List</span>
                            </button>
                            <button
                              onClick={() => setActivePage("order-details")}
                              className={menuItemClass("order-details")}
                            >
                              <Circle
                                size={5}
                                strokeWidth={2.5}
                                className="mr-3 shrink-0"
                              />
                              <span>Details</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* NESTED ACCORDION: Customers */}
                    <div>
                      <button
                        onClick={() => setCustomersOpen(!customersOpen)}
                        className={subMenuHeaderClass(
                          customersOpen,
                          ["customers-list", "customer-details"].includes(
                            activePage,
                          ),
                        )}
                      >
                        <div className="flex items-center">
                          <Circle
                            size={7}
                            strokeWidth={2.5}
                            className="mr-3.5 shrink-0 text-[#6F6B7D] dark:text-current dark:opacity-70"
                          />
                          <span>Customers</span>
                        </div>
                        <span className="text-[#4B465C] dark:text-current dark:opacity-70">
                          {customersOpen ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {customersOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden pl-5"
                          >
                            <button
                              onClick={() => setActivePage("customers-list")}
                              className={menuItemClass("customers-list")}
                            >
                              <Circle
                                size={5}
                                strokeWidth={2.5}
                                className="mr-3 shrink-0"
                              />
                              <span>List</span>
                            </button>
                            <button
                              onClick={() => setActivePage("customer-details")}
                              className={menuItemClass("customer-details")}
                            >
                              <Circle
                                size={5}
                                strokeWidth={2.5}
                                className="mr-3 shrink-0"
                              />
                              <span>Details</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* eCommerce direct leafs */}
                    <button
                      onClick={() => setActivePage("manage-reviews")}
                      className={menuItemClass("manage-reviews")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Manage Reviews</span>
                    </button>

                    <button
                      onClick={() => setActivePage("referrals")}
                      className={menuItemClass("referrals")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Referrals</span>
                    </button>

                    <button
                      onClick={() => setActivePage("settings")}
                      className={menuItemClass("settings")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Settings</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SINGLE LINK: EMAIL */}
          <div className="space-y-0.5">
            <button
              onClick={() => setActivePage("email")}
              className={`flex items-center w-auto h-10 px-4 my-1 mx-3 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none ${
                activePage === "email"
                  ? "bg-[#6D28D9] dark:bg-primary text-white shadow-sm shadow-primary/20"
                  : "text-[#2F2B3D] hover:text-[#6D28D9] hover:bg-primary-light dark:text-[#C9C4DE] dark:hover:text-white dark:hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail
                  size={15}
                  className={`${
                    activePage === "email"
                      ? "text-white"
                      : "text-[#4B465C] dark:text-current dark:opacity-70"
                  } shrink-0`}
                />
                <span>Email</span>
              </div>
            </button>
          </div>

          {/* SINGLE LINK: CHAT */}
          <div className="space-y-0.5">
            <button
              onClick={() => setActivePage("chat")}
              className={`flex items-center w-auto h-10 px-4 my-1 mx-3 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none ${
                activePage === "chat"
                  ? "bg-[#6D28D9] dark:bg-primary text-white shadow-sm shadow-primary/20"
                  : "text-[#2F2B3D] hover:text-[#6D28D9] hover:bg-primary-light dark:text-[#C9C4DE] dark:hover:text-white dark:hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare
                  size={15}
                  className={`${
                    activePage === "chat"
                      ? "text-white"
                      : "text-[#4B465C] dark:text-current dark:opacity-70"
                  } shrink-0`}
                />
                <span>Chat</span>
              </div>
            </button>
          </div>

          {/* PARENT ACCORDION: INVOICE */}
          <div className="space-y-0.5">
            <button
              onClick={() => setInvoiceOpen(!invoiceOpen)}
              className={accordionHeaderClass(invoiceOpen)}
            >
              <div className="flex items-center gap-3">
                <FileText
                  size={15}
                  className="text-[#4B465C] dark:text-current dark:opacity-70 shrink-0"
                />
                <span>Invoice</span>
              </div>
              <span className="text-[#4B465C] dark:text-current dark:opacity-70">
                {invoiceOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {invoiceOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5">
                    <button
                      onClick={() => setActivePage("invoice-list")}
                      className={menuItemClass("invoice-list")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>List</span>
                    </button>
                    <button
                      onClick={() => setActivePage("invoice-preview")}
                      className={menuItemClass("invoice-preview")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => setActivePage("invoice-edit")}
                      className={menuItemClass("invoice-edit")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setActivePage("invoice-add")}
                      className={menuItemClass("invoice-add")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Add</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PARENT ACCORDION: USER */}
          <div className="space-y-0.5">
            <button
              onClick={() => setUserOpen(!userOpen)}
              className={accordionHeaderClass(userOpen)}
            >
              <div className="flex items-center gap-3">
                <User
                  size={15}
                  className="text-[#4B465C] dark:text-current dark:opacity-70 shrink-0"
                />
                <span>User</span>
              </div>
              <span className="text-[#4B465C] dark:text-current dark:opacity-70">
                {userOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {userOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5">
                    <button
                      onClick={() => setActivePage("user-list")}
                      className={menuItemClass("user-list")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>List</span>
                    </button>
                    <button
                      onClick={() => setActivePage("user-view")}
                      className={menuItemClass("user-view")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>View</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PARENT ACCORDION: ROLES & PERMISSIONS */}
          <div className="space-y-0.5">
            <button
              onClick={() => setRolesOpen(!rolesOpen)}
              className={accordionHeaderClass(rolesOpen)}
            >
              <div className="flex items-center gap-3">
                <Lock
                  size={15}
                  className="text-[#4B465C] dark:text-current dark:opacity-70 shrink-0"
                />
                <span>Roles & Permissions</span>
              </div>
              <span className="text-[#4B465C] dark:text-current dark:opacity-70">
                {rolesOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {rolesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5">
                    <button
                      onClick={() => setActivePage("roles-list")}
                      className={menuItemClass("roles-list")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Roles</span>
                    </button>
                    <button
                      onClick={() => setActivePage("permissions-list")}
                      className={menuItemClass("permissions-list")}
                    >
                      <Circle
                        size={7}
                        strokeWidth={2.5}
                        className="mr-3.5 shrink-0"
                      />
                      <span>Permissions</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info card */}
        <div className="p-4 border-t border-border-divider bg-bg-card/60 dark:border-white/10 dark:bg-white/5 select-none">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="John Doe"
                className="h-8 w-8 rounded-full object-cover border-2 border-primary/40"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-bg-card dark:border-bg-app"></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-xs font-bold text-[#2F2B3D] dark:text-white truncate">
                John Doe
              </h4>
              <p className="text-[10px] text-[#4B465C] dark:text-text-secondary truncate font-mono">
                admin@coredevs.com
              </p>
            </div>
            <button
              onClick={logoutAction}
              className="p-1.5 text-red-500 hover:bg-rose-500/10 hover:text-red-600 rounded-lg transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
