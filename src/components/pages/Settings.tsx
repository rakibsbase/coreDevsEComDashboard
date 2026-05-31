import { useState } from "react";
import {
  User,
  Lock,
  CreditCard,
  Eye,
  EyeOff,
  QrCode,
  Smartphone,
  Shield,
  Trash2,
  Edit2,
  Plus,
  Check,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Info,
  X,
  Upload,
  RotateCcw,
  PlusCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { confirmAction, confirmDelete, confirmSave, toastSuccess } from "@/utils/confirm";

// Constant default presets for Easy Resetting operations
const DEFAULT_ACCOUNT = {
  firstName: "John",
  lastName: "Doe",
  email: "admin@coredevs.com",
  organization: "Core Devs Global Ltd",
  phone: "+1 (609) 972-2211",
  address: "45 Roker Terrace, Latheronwheel",
  state: "London",
  zipCode: "E1 6AN",
  country: "United Kingdom",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
};

interface PaymentCard {
  id: string;
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  type: "Mastercard" | "Visa" | "American Express" | "Generic";
  isPrimary: boolean;
}

const INITIAL_CARDS: PaymentCard[] = [
  {
    id: "card-1",
    number: "5423456789124242",
    name: "JOHN DOE",
    expiry: "12/28",
    cvv: "321",
    type: "Mastercard",
    isPrimary: true
  },
  {
    id: "card-2",
    number: "4000123456781111",
    name: "JOHN DOE",
    expiry: "08/29",
    cvv: "567",
    type: "Visa",
    isPrimary: false
  }
];

export default function Settings() {
  const { darkMode, triggerToast } = useApp();

  // Active Tab: "account" | "security" | "billing"
  const [activeTab, setActiveTab] = useState<"account" | "security" | "billing">("account");

  // Account Form variables
  const [firstName, setFirstName] = useState(DEFAULT_ACCOUNT.firstName);
  const [lastName, setLastName] = useState(DEFAULT_ACCOUNT.lastName);
  const [email, setEmail] = useState(DEFAULT_ACCOUNT.email);
  const [organization, setOrganization] = useState(DEFAULT_ACCOUNT.organization);
  const [phone, setPhone] = useState(DEFAULT_ACCOUNT.phone);
  const [address, setAddress] = useState(DEFAULT_ACCOUNT.address);
  const [state, setState] = useState(DEFAULT_ACCOUNT.state);
  const [zipCode, setZipCode] = useState(DEFAULT_ACCOUNT.zipCode);
  const [country, setCountry] = useState(DEFAULT_ACCOUNT.country);
  const [avatar, setAvatar] = useState(DEFAULT_ACCOUNT.avatar);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  // Gated account deactivation elements
  const [confirmDeactivation, setConfirmDeactivation] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [isDeactivatingSync, setIsDeactivatingSync] = useState(false);

  // Security elements
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA elements
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");

  // Billing elements
  const [activePlan, setActivePlan] = useState<"Basic" | "Team" | "Enterprise" | "Enterprise Pro" | "Ultimate Unlimited">("Enterprise");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [quotaRequests, setQuotaRequests] = useState(8500); // Out of 10000
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>(INITIAL_CARDS);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPlanUpgrade, setSelectedPlanUpgrade] = useState<typeof activePlan>("Enterprise");

  // Add Card elements
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardName, setNewCardName] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvv, setNewCardCvv] = useState("");
  const [editCardId, setEditCardId] = useState<string | null>(null);

  // Simulated avatar image file picker trigger
  const handleSimulateAvatarUpload = () => {
    // Generate a random high quality developer/professional style avatar to simulate uploading
    const randomAvatars = [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    ];
    const picked = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    setAvatar(picked);
    triggerToast("Profile photo synchronized successfully", "success");
  };

  // Reset Account Fields
  const handleResetAccount = () => {
    setFirstName(DEFAULT_ACCOUNT.firstName);
    setLastName(DEFAULT_ACCOUNT.lastName);
    setEmail(DEFAULT_ACCOUNT.email);
    setOrganization(DEFAULT_ACCOUNT.organization);
    setPhone(DEFAULT_ACCOUNT.phone);
    setAddress(DEFAULT_ACCOUNT.address);
    setState(DEFAULT_ACCOUNT.state);
    setZipCode(DEFAULT_ACCOUNT.zipCode);
    setCountry(DEFAULT_ACCOUNT.country);
    setAvatar(DEFAULT_ACCOUNT.avatar);
    triggerToast("Account settings reverted to saved defaults", "blank");
  };

  // Save Account Changes
  const handleSaveAccount = async () => {
    if (!firstName || !lastName || !email) {
      triggerToast("Please fill in first name, last name and email address", "error");
      return;
    }
    const ok = await confirmSave("profile");
    if (!ok) return;
    toastSuccess("Your Core Devs account settings have been updated");
  };

  // Deactivate account final process
  const triggerDeactivateAccountSimulation = async () => {
    const ok = await confirmAction("Deactivate Account?", "This is irreversible.");
    if (!ok) return;
    setIsDeactivatingSync(true);
    setTimeout(() => {
      setIsDeactivatingSync(false);
      setDeactivateModalOpen(false);
      setConfirmDeactivation(false);
      triggerToast("Simulated Success: Connection terminated. Account scheduled for deactivation.", "success");
    }, 1800);
  };

  // Password Rules validators
  const passLength = newPassword.length >= 8;
  const passUpper = /[A-Z]/.test(newPassword);
  const passLower = /[a-z]/.test(newPassword);
  const passDigit = /[0-9]/.test(newPassword);
  const passSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passAllChecked = passLength && passUpper && passLower && passDigit && passSpecial;

  // Change Password Reset
  const handleResetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    triggerToast("Password form cleared", "blank");
  };

  // Saves updated password
  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerToast("Please fill in all directory password fields", "error");
      return;
    }
    if (!passAllChecked) {
      triggerToast("New password does not satisfy all network security standards", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast("New passwords do not match. Please verify correct typing.", "error");
      return;
    }
    
    // Simulate updating API
    const ok = await confirmSave("password");
    if (!ok) return;
    toastSuccess("Password updated. All security keys re-allocated.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // OTP Code Verification for 2FA
  const handleVerifyOtp = () => {
    if (otpCode.length < 6) {
      setOtpError("Must be a 6 digit authenticator standard code");
      return;
    }
    setOtpError("");
    setIsTwoFactorEnabled(true);
    setTwoFactorModalOpen(false);
    setOtpCode("");
    triggerToast("Multi-factor system activated using device authentication", "success");
  };

  // Disables Multi-Factor
  const handleDisable2FA = async () => {
    const ok = await confirmAction("Disable 2FA?", "This reduces account security.");
    if (!ok) return;
    setIsTwoFactorEnabled(false);
    toastSuccess("Two-Factor system deactivated.");
  };

  // Add Card - format number group helper
  const handleCardNumberChange = (val: string) => {
    // strip non digits
    const cleanNumbers = val.replace(/\D/g, "");
    if (cleanNumbers.length <= 16) {
      setNewCardNumber(cleanNumbers);
    }
  };

  // Format expiry MM/YY helper
  const handleCardExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (clean.length <= 4) {
      if (clean.length > 2) {
        setNewCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
      } else {
        setNewCardExpiry(clean);
      }
    }
  };

  // Card Brand Detector
  const detectCardBrand = (num: string): "Visa" | "Mastercard" | "American Express" | "Generic" => {
    if (num.startsWith("4")) return "Visa";
    if (num.startsWith("5")) return "Mastercard";
    if (num.startsWith("3")) return "American Express";
    return "Generic";
  };

  // Save changes/Add security card
  const handleSavePaymentCard = async () => {
    if (newCardNumber.length < 15) {
      triggerToast("Please enter a valid credit card credentials layout", "error");
      return;
    }
    if (newCardExpiry.length < 5) {
      triggerToast("Expiry date format MM/YY is mandatory", "error");
      return;
    }
    if (newCardCvv.length < 3) {
      triggerToast("Please check CVV sequence lengths", "error");
      return;
    }
    if (!newCardName) {
      triggerToast("Cardholder full legal name is required", "error");
      return;
    }
    const ok = await confirmSave("payment card");
    if (!ok) return;

    const detectedType = detectCardBrand(newCardNumber);

    if (editCardId) {
      // Modify
      setPaymentCards(prev => prev.map(card => {
        if (card.id === editCardId) {
          return {
            ...card,
            number: newCardNumber,
            name: newCardName.toUpperCase(),
            expiry: newCardExpiry,
            cvv: newCardCvv,
            type: detectedType
          };
        }
        return card;
      }));
      toastSuccess("Payment method modified locally");
    } else {
      // Create new
      const newCardObj: PaymentCard = {
        id: `card-${Date.now()}`,
        number: newCardNumber,
        name: newCardName.toUpperCase(),
        expiry: newCardExpiry,
        cvv: newCardCvv,
        type: detectedType,
        isPrimary: paymentCards.length === 0
      };
      setPaymentCards(prev => [...prev, newCardObj]);
      toastSuccess("Added payment card structure");
    }

    setAddCardModalOpen(false);
    // clear fields
    setNewCardNumber("");
    setNewCardName("");
    setNewCardExpiry("");
    setNewCardCvv("");
    setEditCardId(null);
  };

  // Trigger editing existing card
  const startEditCard = (card: PaymentCard) => {
    setEditCardId(card.id);
    setNewCardNumber(card.number);
    setNewCardName(card.name);
    setNewCardExpiry(card.expiry);
    setNewCardCvv(card.cvv);
    setAddCardModalOpen(true);
  };

  // Toggle card primary
  const handleSetCardPrimary = async (cardId: string) => {
    const ok = await confirmAction("Set Primary Card?", "Use this card as the primary payment method?");
    if (!ok) return;
    setPaymentCards(prev => prev.map(c => ({
      ...c,
      isPrimary: c.id === cardId
    })));
    toastSuccess("Primary payment method updated");
  };

  // Delete card from state
  const handleDeleteCard = async (cardId: string) => {
    const cardToDelete = paymentCards.find(c => c.id === cardId);
    if (cardToDelete?.isPrimary && paymentCards.length > 1) {
      triggerToast("Please assign a different Primary card first before deleting this", "error");
      return;
    }
    const ok = await confirmDelete("payment card");
    if (!ok) return;
    setPaymentCards(prev => prev.filter(c => c.id !== cardId));
    toastSuccess("Payment card deleted");
  };

  // Standardize plan limits based on active plans
  const planCosts = {
    "Basic": 19,
    "Team": 49,
    "Enterprise": 99,
    "Enterprise Pro": 149,
    "Ultimate Unlimited": 299
  };

  const planQuotas = {
    "Basic": 1000,
    "Team": 5000,
    "Enterprise": 10000,
    "Enterprise Pro": 25000,
    "Ultimate Unlimited": 100000
  };

  // Upgrade Plan handler
  const handleUpgradeTier = async () => {
    const ok = await confirmAction("Change Plan?", "Switch to new plan?");
    if (!ok) return;
    setActivePlan(selectedPlanUpgrade);
    setQuotaRequests(Math.min(quotaRequests, planQuotas[selectedPlanUpgrade] - 200));
    setUpgradeModalOpen(false);
    toastSuccess(`Account changed to the ${selectedPlanUpgrade} tier!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Banner / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-display text-text-primary tracking-tight">
            Account & System Settings
          </h2>
          <p className="text-xs text-text-secondary font-sans mt-1">
            Build system defaults, optimize profile matrices, and organize billing standards for <span className="font-semibold text-primary">Core Devs</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* ==================== LEFT TABS BAR (lg:col-span-1) ==================== */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {/* Mobile View: Horizontal scrolling tabs | Desktop View: Vertical stacked sidebar buttons */}
          <div className="flex lg:flex-col bg-bg-card border border-border-divider rounded-2xl p-1.5 shadow-xs overflow-x-auto gap-1 select-none">
            {/* Account Settings button */}
            <button
              onClick={() => setActiveTab("account")}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer w-full text-left ${
                activeTab === "account"
                  ? "text-primary bg-primary-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              {activeTab === "account" && (
                <motion.div
                  layoutId="active_tab_bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <User size={15} className={activeTab === "account" ? "text-primary" : "text-text-secondary"} />
              <span>Account</span>
            </button>

            {/* Security Settings button */}
            <button
              onClick={() => setActiveTab("security")}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer w-full text-left ${
                activeTab === "security"
                  ? "text-primary bg-primary-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              {activeTab === "security" && (
                <motion.div
                  layoutId="active_tab_bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Lock size={15} className={activeTab === "security" ? "text-primary" : "text-text-secondary"} />
              <span>Security</span>
            </button>

            {/* Billing & Plans Settings button */}
            <button
              onClick={() => setActiveTab("billing")}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer w-full text-left ${
                activeTab === "billing"
                  ? "text-primary bg-primary-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              {activeTab === "billing" && (
                <motion.div
                  layoutId="active_tab_bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <CreditCard size={15} className={activeTab === "billing" ? "text-primary" : "text-text-secondary"} />
              <span>Billing & Plans</span>
            </button>
          </div>

          <div className="hidden lg:block bg-bg-card border border-border-divider/75 p-5 rounded-2xl shadow-xs">
            <h4 className="text-xs font-bold font-display text-text-primary flex items-center gap-2">
              <Shield size={13} className="text-primary" />
              Protection Matrix
            </h4>
            <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
              Updating your personal profile, addresses, or keys registers instantly onto SHA-256 cloud-locked standard ledger systems active inside Core Devs servers.
            </p>
          </div>
        </div>

        {/* ==================== RIGHT VIEW SHEETS (lg:col-span-3) ==================== */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {/* ======================================================================= */}
            {/* ========================== TAB: ACCOUNT SETTINGS ====================== */}
            {/* ======================================================================= */}
            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                {/* Visual Avatar Manager Row */}
                <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
                  <div
                    className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 w-24 h-24 border border-border-divider cursor-pointer shrink-0"
                    onMouseEnter={() => setIsHoveringAvatar(true)}
                    onMouseLeave={() => setIsHoveringAvatar(false)}
                    onClick={handleSimulateAvatarUpload}
                  >
                    <img
                      src={avatar}
                      alt="Current User Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{ transform: isHoveringAvatar ? "scale(1.08)" : "scale(1)" }}
                    />
                    <AnimatePresence>
                      {isHoveringAvatar && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white"
                        >
                          <Upload size={18} className="animate-bounce" />
                          <span className="text-[10px] font-black uppercase tracking-wider mt-1">Upload</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-3">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <button
                        onClick={handleSimulateAvatarUpload}
                        className="flex items-center gap-1.5 bg-primary text-white hover:bg-primary-hover rounded-xl px-4 py-2 text-xs font-extrabold shadow-sm hover:shadow-primary/20 transition-all cursor-pointer"
                      >
                        <Upload size={13} />
                        Upload New Photo
                      </button>
                      <button
                        onClick={() => {
                          setAvatar(DEFAULT_ACCOUNT.avatar);
                          triggerToast("Profile photo reset", "blank");
                        }}
                        className="flex items-center gap-1.5 bg-bg-app border border-border-divider text-text-secondary hover:text-text-primary rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                      >
                        <RotateCcw size={13} />
                        Reset
                      </button>
                    </div>
                    <p className="text-[10px] text-text-secondary leading-normal select-none">
                      Allowed formats: <span className="font-bold underline">JPG, GIF, or PNG</span>. Maximum capacity of 800KB. Click the avatar or upload to simulate live uploading.
                    </p>
                  </div>
                </div>

                {/* Account Settings Forms Card */}
                <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-bold font-display text-text-primary text-sm">Personal Credentials</h3>
                    <p className="text-[11px] text-text-secondary mt-0.5">Please specify valid legal parameters details below.</p>
                  </div>

                  {/* Dual columns grid with responsive stacks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* First Name input */}
                    <div id="first_name_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                        placeholder="John"
                      />
                    </div>

                    {/* Last Name input */}
                    <div id="last_name_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                        placeholder="Doe"
                      />
                    </div>

                    {/* Email Input */}
                    <div id="email_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary flex items-center gap-1.5">
                        <Mail size={9} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                        placeholder="admin@coredevs.com"
                      />
                    </div>

                    {/* Organization Input */}
                    <div id="organization_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary flex items-center gap-1.5">
                        <Building size={9} />
                        Organization
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                        placeholder="Core Devs"
                      />
                    </div>

                    {/* Phone Number Input */}
                    <div id="phone_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary flex items-center gap-1.5">
                        <Phone size={9} />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                        placeholder="+1 (609) 972-2211"
                      />
                    </div>

                    {/* Address Line Input */}
                    <div id="address_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary flex items-center gap-1.5">
                        <MapPin size={9} />
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                        placeholder="45 Roker Terrace"
                      />
                    </div>

                    {/* State input */}
                    <div id="state_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                        placeholder="London"
                      />
                    </div>

                    {/* Zip Code input */}
                    <div id="zip_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                        placeholder="E1 6AN"
                      />
                    </div>

                    {/* Country Selector Dropdown */}
                    <div id="country_box" className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all sm:col-span-2">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary flex items-center gap-1.5">
                        <Globe size={9} />
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-extrabold text-text-primary cursor-pointer"
                      >
                        <option value="United Kingdom">United Kingdom (🇬🇧)</option>
                        <option value="United States">United States (🇺🇸)</option>
                        <option value="Canada">Canada (🇨🇦)</option>
                        <option value="Australia">Australia (🇦🇺)</option>
                        <option value="France">France (🇫🇷)</option>
                        <option value="Germany">Germany (🇩🇪)</option>
                        <option value="Brazil">Brazil (🇧🇷)</option>
                        <option value="Japan">Japan (🇯🇵)</option>
                      </select>
                    </div>
                  </div>

                  {/* Save and Revert Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSaveAccount}
                      className="flex items-center gap-2 bg-primary text-white hover:bg-primary-hover rounded-xl px-5 py-2.5 text-xs font-extrabold shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleResetAccount}
                      className="px-5 py-2.5 border border-border-divider rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary bg-bg-app/50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Gated Account Deactivation Card */}
                <div className="bg-bg-card border border-rose-100 dark:border-rose-900/35 rounded-2xl p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="font-bold font-display text-red-500 text-sm flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Deactivate Account
                    </h3>
                    <p className="text-[11px] text-text-secondary mt-1">
                      Once terminated, the database entries can only be re-enabled under supervisor keys approval.
                    </p>
                  </div>

                  {/* interactive Custom confirmation checkmark */}
                  <div className="flex items-start gap-3 bg-red-50/45 dark:bg-rose-950/15 p-4 rounded-xl border border-rose-100/50 dark:border-rose-950/30">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        id="confirm_deactivate_box"
                        checked={confirmDeactivation}
                        onChange={(e) => setConfirmDeactivation(e.target.checked)}
                        className="h-4 w-4 rounded-sm text-primary border-slate-300 dark:border-border-divider focus:ring-primary cursor-pointer accent-primary"
                      />
                    </div>
                    <label
                      htmlFor="confirm_deactivate_box"
                      className="text-xs text-text-secondary select-none leading-relaxed cursor-pointer font-medium"
                    >
                      I confirm my wish to deactivate this administrative profile and suspend system access triggers.
                    </label>
                  </div>

                  <div>
                    <button
                      disabled={!confirmDeactivation}
                      onClick={() => setDeactivateModalOpen(true)}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:shadow-lg hover:shadow-red-500/20 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================================================= */}
            {/* ========================== TAB: SECURITY SETTINGS ===================== */}
            {/* ======================================================================= */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                {/* Change Password Form Card */}
                <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-bold font-display text-text-primary text-sm flex items-center gap-2">
                      <Shield size={16} className="text-primary" />
                      Manage Passwords
                    </h3>
                    <p className="text-[11px] text-text-secondary mt-0.5">Maintain strong combinations to secure access vectors.</p>
                  </div>

                  <div className="space-y-5">
                    {/* Current Password Field */}
                    <div className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                        Current Password
                      </label>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 pr-10 text-xs font-bold text-text-primary"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {/* Grid for New & Confirm inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* New Password input */}
                      <div className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                        <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                          New Password
                        </label>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-transparent border-0 outline-none p-0 pr-10 text-xs font-bold text-text-primary"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>

                      {/* Confirm New Password input */}
                      <div className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                        <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                          Confirm New Password
                        </label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-transparent border-0 outline-none p-0 pr-10 text-xs font-bold text-text-primary"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Interactive Real-Time Password Requirements Checklist block */}
                    {newPassword.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-bg-app/30 border border-border-divider rounded-xl p-4 space-y-2 text-xs select-none"
                      >
                        <div className="font-bold text-text-primary text-[11px] uppercase tracking-wider">
                          Password Validation Checklist
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-semibold">
                          <div className="flex items-center gap-2">
                            <span className={`p-0.5 rounded-full ${passLength ? "bg-green-500/15 text-green-500" : "bg-neutral-100 text-neutral-400"}`}>
                              <Check size={9} strokeWidth={3} />
                            </span>
                            <span className={passLength ? "text-text-primary" : "text-text-secondary"}>At least 8 characters</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`p-0.5 rounded-full ${passUpper ? "bg-green-500/15 text-green-500" : "bg-neutral-100 text-neutral-400"}`}>
                              <Check size={9} strokeWidth={3} />
                            </span>
                            <span className={passUpper ? "text-text-primary" : "text-text-secondary"}>One uppercase letter (A-Z)</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`p-0.5 rounded-full ${passLower ? "bg-green-500/15 text-green-500" : "bg-neutral-100 text-neutral-400"}`}>
                              <Check size={9} strokeWidth={3} />
                            </span>
                            <span className={passLower ? "text-text-primary" : "text-text-secondary"}>One lowercase letter (a-z)</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`p-0.5 rounded-full ${passDigit ? "bg-green-500/15 text-green-500" : "bg-neutral-100 text-neutral-400"}`}>
                              <Check size={9} strokeWidth={3} />
                            </span>
                            <span className={passDigit ? "text-text-primary" : "text-text-secondary"}>One numeric digit (0-9)</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`p-0.5 rounded-full ${passSpecial ? "bg-green-500/15 text-green-500" : "bg-neutral-100 text-neutral-400"}`}>
                              <Check size={9} strokeWidth={3} />
                            </span>
                            <span className={passSpecial ? "text-text-primary" : "text-text-secondary"}>One special character (e.g. @, #, $, %)</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Actions bar */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleSavePassword}
                      className="flex items-center gap-2 bg-primary text-white hover:bg-primary-hover rounded-xl px-5 py-2.5 text-xs font-extrabold shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={handleResetPasswordForm}
                      className="px-5 py-2.5 border border-border-divider rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary bg-bg-app/50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication Card */}
                <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold font-display text-text-primary text-sm flex items-center gap-2">
                        <Smartphone size={16} className="text-primary" />
                        Two-Factor Authentication (2FA)
                      </h3>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        Enhance directory configurations safety scores by generating dynamic validation challenge tokens.
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider select-none ${
                      isTwoFactorEnabled
                        ? "bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400"
                        : "bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                    }`}>
                      {isTwoFactorEnabled ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="border border-border-divider/75 bg-bg-app/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-5 justify-between">
                    <div className="space-y-1 flex-1 text-center sm:text-left">
                      <h4 className="text-xs font-bold text-text-primary">
                        Authenticator App challenge protocol
                      </h4>
                      <p className="text-[10px] text-text-secondary leading-relaxed max-w-md">
                        Challenge codes are pushed directly to linked authenticator tools like Google/Microsoft Authenticator to reinforce accounts.
                      </p>
                    </div>

                    {isTwoFactorEnabled ? (
                      <button
                        onClick={handleDisable2FA}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all shrink-0"
                      >
                        Deactivate 2FA
                      </button>
                    ) : (
                      <button
                        onClick={() => setTwoFactorModalOpen(true)}
                        className="bg-primary text-white hover:bg-primary-hover rounded-xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all shrink-0 shadow-sm"
                      >
                        Configure 2FA
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================================================= */}
            {/* ========================== TAB: BILLING & PLANS ======================= */}
            {/* ======================================================================= */}
            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                {/* Active Plan overview card */}
                <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold font-display text-text-primary text-sm">Active Plan Matrix</h3>
                      <p className="text-[11px] text-text-secondary mt-0.5">Control billing cycles and current quotas limits.</p>
                    </div>

                    <div className="flex items-center gap-2 select-none self-start sm:self-center">
                      <span className="text-xs text-text-secondary font-semibold">Monthly Billing</span>
                      <button
                        onClick={() => {
                          setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly");
                          triggerToast(`Switched billing cycles model`, "blank");
                        }}
                        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                          billingCycle === "yearly" ? "bg-primary" : "bg-slate-200 dark:bg-zinc-700"
                        }`}
                      >
                        <motion.span
                          layout
                          className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-xs"
                          animate={{ x: billingCycle === "yearly" ? 16 : 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                      </button>
                      <span className="text-xs text-text-secondary font-semibold">Yearly (Save 20%)</span>
                    </div>
                  </div>

                  {/* Complex progress charts monitor layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Left detailed card listing stats */}
                    <div className="md:col-span-2 border border-border-divider/75 bg-bg-app/10 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-black text-primary tracking-wider">Active Tier</span>
                          <h4 className="text-sm font-black text-text-primary mt-1">
                            {activePlan} Standard package
                          </h4>
                        </div>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-wider rounded-full select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Active
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-text-primary">
                          <span>API Requests Quota</span>
                          <span>{quotaRequests.toLocaleString()} of {planQuotas[activePlan].toLocaleString()} / mo</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(quotaRequests / planQuotas[activePlan]) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-primary h-full rounded-full"
                          />
                        </div>
                        <p className="text-[10px] text-text-secondary pt-0.5 leading-normal">
                          Active billing period terminates on June 15, 2026. Quotas resets directly.
                        </p>
                      </div>
                    </div>

                    {/* Right pricing indicator card */}
                    <div className="border border-border-divider bg-bg-app/25 dark:bg-zinc-800/20 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-extrabold text-text-secondary">Est. Billing standard</span>
                        <div className="flex items-baseline gap-1 mt-1.5">
                          <span className="text-2xl font-black text-text-primary">
                            ${billingCycle === "monthly" ? planCosts[activePlan] : Math.round(planCosts[activePlan] * 0.8)}
                          </span>
                          <span className="text-xs text-text-secondary font-semibold">/ month</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPlanUpgrade(activePlan);
                          setUpgradeModalOpen(true);
                        }}
                        className="w-full text-center bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-primary/30 rounded-xl py-2.5 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={13} />
                        Upgrade Plan
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold font-display text-text-primary text-sm flex items-center gap-2">
                        <CreditCard size={16} className="text-primary" />
                        Saved Payment Profiles
                      </h3>
                      <p className="text-[11px] text-text-secondary mt-0.5">Edit billing details and checkout cards.</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditCardId(null);
                        setNewCardNumber("");
                        setNewCardName("");
                        setNewCardExpiry("");
                        setNewCardCvv("");
                        setAddCardModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-transparent rounded-xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all self-start sm:self-center"
                    >
                      <Plus size={14} />
                      Add Payment Card
                    </button>
                  </div>

                  {/* Credit Cards list row */}
                  <div className="space-y-4">
                    {paymentCards.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-border-divider rounded-2xl space-y-2 select-none">
                        <CreditCard size={32} className="mx-auto text-text-secondary/50" />
                        <h4 className="text-xs font-bold text-text-primary">No payment options active</h4>
                        <p className="text-[10px] text-text-secondary">Please add a card to enable upgrades.</p>
                      </div>
                    ) : (
                      paymentCards.map(card => {
                        return (
                          <div
                            key={card.id}
                            className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-205 ${
                              card.isPrimary
                                ? "border-primary bg-primary-light/5"
                                : "border-border-divider bg-bg-app/10"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Custom SVG logo based on Brand */}
                              <div className="w-12 h-8 rounded-lg border border-border-divider shrink-0 flex items-center justify-center bg-white p-1.5">
                                {card.type === "Visa" ? (
                                  <span className="text-blue-600 font-extrabold font-display italic text-xs tracking-wider">VISA</span>
                                ) : card.type === "Mastercard" ? (
                                  <div className="flex -space-x-2">
                                    <span className="h-4 w-4 rounded-full bg-red-500 opacity-80"></span>
                                    <span className="h-4 w-4 rounded-full bg-amber-500 opacity-80"></span>
                                  </div>
                                ) : card.type === "American Express" ? (
                                  <span className="text-emerald-600 font-bold text-[8px] tracking-tighter">AMEX</span>
                                ) : (
                                  <CreditCard size={16} className="text-text-secondary" />
                                )}
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-extrabold text-text-primary">
                                    {card.type} •••• {card.number.slice(-4)}
                                  </h4>
                                  {card.isPrimary && (
                                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-primary/10 text-primary select-none">
                                      Primary
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-text-secondary font-semibold">
                                  Expires {card.expiry} | Registeredholder: {card.name}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3.5 self-end sm:self-auto">
                              {!card.isPrimary && (
                                <button
                                  onClick={() => handleSetCardPrimary(card.id)}
                                  className="text-[10px] font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer underline"
                                >
                                  Make Primary
                                </button>
                              )}
                              <button
                                onClick={() => startEditCard(card)}
                                className="p-1 px-2 border border-border-divider rounded-lg hover:border-primary text-text-secondary hover:text-primary cursor-pointer transition-all bg-bg-card"
                                title="Edit Card Parameters"
                              >
                                <Edit2 size={11} />
                              </button>
                              <button
                                onClick={() => handleDeleteCard(card.id)}
                                className="p-1 px-2 border border-rose-100 dark:border-rose-950 rounded-lg hover:bg-rose-500/10 text-text-secondary hover:text-rose-500 cursor-pointer transition-all bg-bg-card"
                                title="Remove Payment Method"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* ==================== INTERACTIVE OVERLAY MODALS ENGINE ================= */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {/* MODAL 1: TWO-FACTOR QR SCANNER MODAL */}
        {twoFactorModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              className="bg-bg-card border border-border-divider w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border-divider flex items-center justify-between bg-bg-app/40 select-none">
                <span className="text-xs font-black font-display text-text-primary tracking-wider uppercase">
                  Verify 2FA Challenge
                </span>
                <button
                  onClick={() => setTwoFactorModalOpen(false)}
                  className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-app rounded-lg cursor-pointer transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* qr content code body */}
              <div className="p-6 space-y-5">
                <div className="space-y-1 text-center select-none">
                  <h4 className="text-xs font-bold text-text-primary">Scan QR Challenge Code</h4>
                  <p className="text-[10px] text-text-secondary max-w-xs mx-auto leading-relaxed">
                    Open your standard authenticator tool on your phone and target the layout below.
                  </p>
                </div>

                {/* High end CSS Matrix simulated QR code */}
                <div className="relative mx-auto w-32 h-32 border-2 border-primary/20 rounded-2xl p-3 flex items-center justify-center bg-white shadow-xs select-none">
                  {/* Outer design QR blocks grids */}
                  <div className="grid grid-cols-6 gap-0.5 w-full h-full opacity-80">
                    {[...Array(36)].map((_, i) => {
                      // Simulate a professional qr blocks matrix
                      const isCorner = i < 2 || i === 4 || i === 5 || i === 6 || i === 11 || i === 24 || i === 30 || i >= 34;
                      const isCenter = i > 12 && i < 22 && i !== 14;
                      return (
                        <div
                          key={i}
                          className={`rounded-[1.5px] ${
                            isCorner || isCenter || Math.sin(i) > 0.05
                              ? "bg-slate-900"
                              : "bg-slate-100"
                          }`}
                        />
                      );
                    })}
                  </div>
                  {/* Floating Core Devs small logo mark in the center */}
                  <div className="absolute inset-0 m-auto w-7 h-7 bg-primary text-white text-[8px] font-black rounded-lg flex items-center justify-center tracking-tighter shadow-md border border-white">
                    CDVS
                  </div>
                </div>

                <p className="text-[10px] text-text-secondary text-center leading-normal max-w-xs mx-auto select-none">
                  Alternatively, write down recovery secret key: <span className="font-mono font-bold text-text-primary select-all">CDVS-2FA-SEC-SHA256</span>
                </p>

                {/* OTP Code entry form */}
                <div id="otp_code_group" className="space-y-1.5">
                  <label htmlFor="otp_input_field" className="text-[9px] uppercase tracking-wider font-extrabold text-text-secondary block">
                    Enter Authenticator OTP
                  </label>
                  <input
                    id="otp_input_field"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOtpCode(val);
                    }}
                    placeholder="123456"
                    className="w-full text-center bg-bg-app border border-border-divider focus:border-primary rounded-xl px-4 py-3 text-xs font-bold tracking-[8px] outline-none text-text-primary"
                  />
                  {otpError && (
                    <span className="text-[9px] text-red-500 font-extrabold flex items-center gap-1">
                      <AlertTriangle size={9} />
                      {otpError}
                    </span>
                  )}
                </div>

                {/* Buttons block */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleVerifyOtp}
                    className="flex-1 bg-primary text-white hover:bg-primary-hover rounded-xl py-2.5 text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                  >
                    Verify Challenge
                  </button>
                  <button
                    onClick={() => {
                      setTwoFactorModalOpen(false);
                      setOtpCode("");
                      setOtpError("");
                    }}
                    className="flex-1 border border-border-divider rounded-xl py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer bg-bg-app/40 hover:bg-bg-app transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 2: UPGRADE PLAN SELECTOR DIALOG */}
        {upgradeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              className="bg-bg-card border border-border-divider w-full max-w-xl rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border-divider flex items-center justify-between bg-bg-app/40 select-none">
                <span className="text-xs font-black font-display text-text-primary tracking-wider uppercase">
                  Select Billing Plan Tier
                </span>
                <button
                  onClick={() => setUpgradeModalOpen(false)}
                  className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-app rounded-lg cursor-pointer transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* pricing cards content */}
              <div className="p-6 space-y-6">
                <div className="text-center select-none space-y-1">
                  <h4 className="text-sm font-black text-text-primary">Available Enterprise Tiers</h4>
                  <p className="text-[10px] text-text-secondary max-w-md mx-auto leading-normal">
                    Select a core allocation capacity matching your required operational throughput.
                  </p>
                </div>

                {/* Sub grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Iter Plan Cards tier loops */}
                  {(["Basic", "Team", "Enterprise", "Enterprise Pro", "Ultimate Unlimited"] as const).map(tier => {
                    const isSelected = selectedPlanUpgrade === tier;
                    const isActive = activePlan === tier;
                    const tierCost = billingCycle === "monthly" ? planCosts[tier] : Math.round(planCosts[tier] * 0.8);
                    const isYearly = billingCycle === "yearly";

                    return (
                      <button
                        key={tier}
                        onClick={() => setSelectedPlanUpgrade(tier)}
                        className={`text-left p-4 border rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 select-none relative ${
                          isSelected
                            ? "border-primary bg-primary-light/10 ring-1 ring-primary/40 shadow-xs"
                            : "border-border-divider bg-bg-app/10 hover:border-text-secondary/30"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[7px] font-black bg-primary/20 text-primary uppercase select-none">
                            Active
                          </span>
                        )}

                        <div>
                          <h4 className="text-xs font-black text-text-primary flex items-center gap-1">
                            {tier}
                          </h4>
                          <span className="text-[10px] text-text-secondary font-medium block mt-0.5">
                            {planQuotas[tier].toLocaleString()} requests / month
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-lg font-black text-text-primary">${tierCost}</span>
                          <span className="text-[10px] text-text-secondary font-semibold">/ mo</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-bg-app/35 border border-border-divider/75 p-3.5 rounded-xl flex items-center gap-2.5 text-[10px] leading-relaxed text-text-secondary select-none">
                  <Info size={13} className="text-primary shrink-0" />
                  <span>
                    Upgrading to a new core allocation triggers immediately. Unspent balances inside the billing cycle are dynamically prorated as credits.
                  </span>
                </div>

                <div className="flex items-center gap-3 justify-end pt-1">
                  <button
                    onClick={() => setUpgradeModalOpen(false)}
                    className="px-4 py-2 border border-border-divider rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer transition-all bg-bg-app/40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgradeTier}
                    className="bg-primary text-white hover:bg-primary-hover rounded-xl px-5 py-2 text-xs font-extrabold cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                  >
                    Confirm upgrade
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 3: ACCOUNT DEACTIVATION CHALLENGE CONFIRMATION */}
        {deactivateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              className="bg-bg-card border border-rose-100 dark:border-rose-950 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-rose-100 dark:border-rose-950/40 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/10 select-none">
                <span className="text-xs font-black font-display text-red-500 tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  Terminate Connection
                </span>
                <button
                  type="button"
                  onClick={() => setDeactivateModalOpen(false)}
                  className="p-1 text-text-secondary hover:text-red-500 rounded-lg cursor-pointer transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-6 space-y-5 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-rose-950/30 flex items-center justify-center text-red-500 animate-pulse">
                  <AlertTriangle size={24} />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-black text-text-primary">Suspending administrator keys?</h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    This step deactivates this administrative seat and terminates active credentials.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setDeactivateModalOpen(false)}
                    className="flex-1 border border-border-divider rounded-xl py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary bg-bg-app/40 hover:bg-bg-app transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={triggerDeactivateAccountSimulation}
                    disabled={isDeactivatingSync}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-xs font-extrabold shadow-md hover:shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isDeactivatingSync ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 4: PAYMENT CARDS ADD & UPDATE FORM WITH LIVE FLUID GRAPHIC PREVIEW */}
        {addCardModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              className="bg-bg-card border border-border-divider w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border-divider flex items-center justify-between bg-bg-app/40 select-none">
                <span className="text-xs font-black font-display text-text-primary tracking-wider uppercase">
                  {editCardId ? "Edit Card Parameters" : "Add Payment Profile"}
                </span>
                <button
                  type="button"
                  onClick={() => setAddCardModalOpen(false)}
                  className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-app rounded-lg cursor-pointer transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* card body wrapper code */}
              <div className="p-6 space-y-6">
                {/* ========================================================= */}
                {/* ============= LIVE FLUID CREDIT CARD GRAPHIC GIMMICK === */}
                {/* ========================================================= */}
                <div className="select-none">
                  {/* Dynamic background gradients depends on prefix typed */}
                  <div className={`w-full aspect-[1.586/1] rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden transition-all duration-350 ${
                    newCardNumber.startsWith("4")
                      ? "bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-900"
                      : newCardNumber.startsWith("5")
                      ? "bg-gradient-to-br from-neutral-800 via-neutral-900 to-purple-950"
                      : newCardNumber.startsWith("3")
                      ? "bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950"
                      : "bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-850"
                  }`}>
                    {/* HOLOGRAPH DESIGN ELEMENTS */}
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-15 pointer-events-none">
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                        <circle cx="90" cy="50" r="40" />
                        <line x1="50" y1="0" x2="100" y2="100" stroke="white" strokeWidth="2" />
                        <line x1="100" y1="0" x2="50" y2="100" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="flex items-start justify-between">
                      {/* Chip visual ornament */}
                      <div className="space-y-1.5 pointer-events-none">
                        <div className="w-9 h-7 rounded-sm bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-300 opacity-85 shadow-xs relative overflow-hidden">
                          <span className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-neutral-200/50"></span>
                          <span className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-neutral-200/50"></span>
                          <span className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200/50"></span>
                        </div>
                        {/* Wireless contactless element indicator icon */}
                        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>

                      {/* Network Emblem display tag */}
                      <div className="text-right text-xs uppercase font-extrabold tracking-widest pointer-events-none italic">
                        {detectCardBrand(newCardNumber) === "Visa" ? (
                          <span className="text-white italic text-base font-black">VISA</span>
                        ) : detectCardBrand(newCardNumber) === "Mastercard" ? (
                          <div className="flex -space-x-2">
                            <span className="h-6 w-6 rounded-full bg-red-500 opacity-90 block"></span>
                            <span className="h-6 w-6 rounded-full bg-amber-500 opacity-90 block"></span>
                          </div>
                        ) : detectCardBrand(newCardNumber) === "American Express" ? (
                          <span className="bg-white/20 px-1.5 py-0.5 rounded-xs text-[9px] font-black tracking-tighter">AMEX</span>
                        ) : (
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs font-mono font-bold tracking-widest text-white/90">CORE DEVS</span>
                        )}
                      </div>
                    </div>

                    {/* Masked group digits live viewer */}
                    <div className="font-mono text-base sm:text-lg tracking-[3px] font-black text-center text-white select-all">
                      {(() => {
                        const chunks: string[] = [];
                        let remain = newCardNumber.padEnd(16, "•");
                        for (let i = 0; i < 16; i += 4) {
                          chunks.push(remain.slice(i, i + 4));
                        }
                        return chunks.join(" ");
                      })()}
                    </div>

                    <div className="flex items-end justify-between text-xs pointer-events-none">
                      {/* Live Cardholder Name */}
                      <div className="space-y-0.5">
                        <span className="text-[7px] text-white/40 uppercase tracking-widest font-extrabold font-mono block">Holder Full Name</span>
                        <h4 className="font-mono tracking-widest truncate max-w-[170px] uppercase font-bold">
                          {newCardName || "Cardholder Name"}
                        </h4>
                      </div>

                      {/* Live Card Expiry */}
                      <div className="space-y-0.5 shrink-0 text-right">
                        <span className="text-[7px] text-white/40 uppercase tracking-widest font-extrabold font-mono block">Expires</span>
                        <h4 className="font-mono font-bold tracking-widest">
                          {newCardExpiry || "MM/YY"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4 pt-1">
                  {/* Cardholder Name field */}
                  <div className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                    <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                      className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary"
                      placeholder="JOHN DOE"
                    />
                  </div>

                  {/* Card Number Field */}
                  <div className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                    <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                      Credit Card Number
                    </label>
                    <input
                      type="text"
                      value={newCardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary font-mono tracking-widest"
                      placeholder="5423 4567 8912 4242"
                    />
                  </div>

                  {/* Dual Grid Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Field */}
                    <div className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={newCardExpiry}
                        onChange={(e) => handleCardExpiryChange(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary font-mono"
                        placeholder="MM/YY"
                      />
                    </div>

                    {/* CVV field */}
                    <div className="relative border border-border-divider rounded-xl px-3 pt-5 pb-1.5 bg-bg-app/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                      <label className="absolute left-3 top-1.5 text-[9px] uppercase tracking-wider font-extrabold text-text-secondary">
                        Security CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={newCardCvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setNewCardCvv(val);
                        }}
                        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-bold text-text-primary font-mono"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm Cancel actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setAddCardModalOpen(false);
                      setNewCardNumber("");
                      setNewCardName("");
                      setNewCardExpiry("");
                      setNewCardCvv("");
                      setEditCardId(null);
                    }}
                    className="flex-1 border border-border-divider rounded-xl py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer bg-bg-app/40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePaymentCard}
                    className="flex-1 bg-primary text-white hover:bg-primary-hover rounded-xl py-2.5 text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                  >
                    Save card method
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

