import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/ui/RichTextEditor"),
  { ssr: false, loading: () => <div className="border border-border-divider rounded-xl h-[206px] bg-bg-card animate-pulse" /> }
);
import { PageId, ProductItem } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  ChevronLeft,
  UploadCloud,
  Layers,
  Truck,
  Globe,
  Settings,
  PlusCircle,
  X,
  Plus,
  ChevronDown,
  Info,
  Calendar,
  DollarSign,
  Tag,
  Link2,
  Trash2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { confirmSave, toastError, toastSuccess } from "@/utils/confirm";

interface AddProductProps {
  setActivePage: (p: PageId) => void;
}

interface VariantOption {
  id: string;
  type: string;
  value: string;
}

type InventoryTab = "pricing" | "restock" | "shipping";
type ShippingType = "standard" | "express" | "local";
type ProductStatus = ProductItem["status"];

export default function AddProduct({ setActivePage }: AddProductProps) {
  const { products, setProducts, selectedProduct, setSelectedProduct, triggerToast } = useApp();
  const isEditing = Boolean(selectedProduct);

  // Basic States
  const [productName, setProductName] = useState("");
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatNameInput, setNewCatNameInput] = useState("");
  const [sku, setSku] = useState(() => Math.floor(10000 + Math.random() * 90000).toString());
  const [barcode, setBarcode] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [chargeTax, setChargeTax] = useState(true);
  const [inStock, setInStock] = useState(true);

  // Organize & Tag Parameters
  const [vendor, setVendor] = useState("Core Devs Global");
  const [category, setCategory] = useState("Electronics");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    "Electronics",
    "Accessories",
    "Shoes",
    "Home Decor",
    "Office"
  ]);
  const [collection, setCollection] = useState("New Arrivals");
  const [status, setStatus] = useState<ProductStatus>("Publish");
  const [tags, setTags] = useState("");

  // Dropdown UI Open States (floating-label outline selectors)
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Refs for closing select dropdowns
  const vendorRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Media File/URL Option States
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Inventory Tab Selector
  const [activeInventoryTab, setActiveInventoryTab] = useState<InventoryTab>("pricing");
  const [addQtyAmount, setAddQtyAmount] = useState("");
  const [currentQty, setCurrentQty] = useState(54);
  const [transitQty, setTransitQty] = useState(390);

  // Advanced Sub-Settings parameters
  const [taxProfile, setTaxProfile] = useState("VAT 15% (Standard)");
  const [isTaxProfileOpen, setIsTaxProfileOpen] = useState(false);
  const taxProfileRef = useRef<HTMLDivElement>(null);

  const [reorderPoint, setReorderPoint] = useState("10");
  const [supplierRef, setSupplierRef] = useState("SUP-CD-892");
  const [trackInventory, setTrackInventory] = useState(true);

  const [shippingType, setShippingType] = useState<ShippingType>("standard");
  const [shippingWeight, setShippingWeight] = useState("1.5");
  const [shippingLength, setShippingLength] = useState("32");
  const [shippingWidth, setShippingWidth] = useState("24");
  const [shippingHeight, setShippingHeight] = useState("10");

  const resetProductForm = () => {
    setProductName("");
    setSku(Math.floor(10000 + Math.random() * 90000).toString());
    setBarcode("");
    setDescription("");
    setBasePrice("");
    setDiscountedPrice("");
    setChargeTax(true);
    setInStock(true);
    setVendor("Core Devs Global");
    setCategory("Electronics");
    setCollection("New Arrivals");
    setStatus("Publish");
    setTags("");
    setImageUrl("");
    setSelectedFile(null);
    setCurrentQty(54);
  };

  useEffect(() => {
    if (!selectedProduct) {
      resetProductForm();
      return;
    }

    setProductName(selectedProduct.name);
    setSku(selectedProduct.sku);
    setDescription(selectedProduct.subtitle);
    setBasePrice(String(selectedProduct.price));
    setDiscountedPrice("");
    setInStock(selectedProduct.inStock);
    setCategory(selectedProduct.category);
    setStatus(selectedProduct.status);
    setImageUrl(selectedProduct.image);
    setSelectedFile(null);
    setCurrentQty(selectedProduct.qty);
  }, [selectedProduct]);

  useEffect(() => {
    function clickOutsideTax(e: MouseEvent) {
      if (taxProfileRef.current && !taxProfileRef.current.contains(e.target as Node)) {
        setIsTaxProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutsideTax);
    return () => document.removeEventListener("mousedown", clickOutsideTax);
  }, []);

  // Variants state
  const [variants, setVariants] = useState<VariantOption[]>([
    { id: "v-1", type: "Size", value: "Standard Pro" }
  ]);
  const [isVariantTypeOpen, setIsVariantTypeOpen] = useState<string | null>(null);

  // Drag & drop highlight state
  const [dragOver, setDragOver] = useState(false);

  // Close organize dropdowns on click outside
  useEffect(() => {
    function clickOutsideDropdowns(e: MouseEvent) {
      if (vendorRef.current && !vendorRef.current.contains(e.target as Node)) setIsVendorOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setIsCategoryOpen(false);
      if (collectionRef.current && !collectionRef.current.contains(e.target as Node)) setIsCollectionOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setIsStatusOpen(false);
    }
    document.addEventListener("mousedown", clickOutsideDropdowns);
    return () => document.removeEventListener("mousedown", clickOutsideDropdowns);
  }, []);

  // Save/Add New Product handler
  const handleSaveProduct = async (targetStatus?: "Publish" | "Scheduled" | "Inactive") => {
    if (!productName.trim()) {
      triggerToast("Please provide a product name before publishing.", "error");
      return;
    }

    const priceNum = parseFloat(basePrice) || 0;
    if (priceNum <= 0) {
      triggerToast("Please provide a valid base price.", "error");
      return;
    }

    const ok = await confirmSave("product");
    if (!ok) return;

    // Determine category icon code name
    let catIcon = "Smartphone";
    if (category === "Accessories") catIcon = "Watch";
    if (category === "Shoes") catIcon = "Footprints";
    if (category === "Office") catIcon = "Briefcase";
    if (category === "Home Decor") catIcon = "Home";

    const finalStatus = targetStatus || status;

    const newProduct: ProductItem = {
      id: selectedProduct?.id || `p-${Date.now()}`,
      name: productName,
      subtitle: description.trim() || `Sleek, high-quality ${category.toLowerCase()} design parameter model.`,
      category: category,
      categoryIcon: catIcon,
      inStock: inStock,
      sku: sku || Math.floor(10000 + Math.random() * 90000).toString(),
      price: priceNum,
      qty: currentQty,
      status: finalStatus,
      image: imageUrl || selectedFile || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80"
    };

    if (selectedProduct) {
      setProducts(products.map((product) => (product.id === selectedProduct.id ? newProduct : product)));
      toastSuccess(`"${productName}" updated successfully`);
    } else {
      setProducts([newProduct, ...products]);
      toastSuccess(`"${productName}" added successfully`);
    }
    setSelectedProduct(null);
    resetProductForm();
    setActivePage("products-list");
  };

  // Image upload simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedFile(event.target.result as string);
          setImageUrl(""); // Clear URL when file uploaded
          triggerToast("Product file image loaded successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedFile(event.target.result as string);
          setImageUrl("");
          triggerToast("Product dropped image loaded successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // URL Image verification
  const handleConfirmUrl = () => {
    if (!tempUrl.toLowerCase().startsWith("http")) {
      triggerToast("Please provide a valid asset URL address starting with http/https.", "error");
      return;
    }
    setImageUrl(tempUrl);
    setSelectedFile(null); // Clear manual file upload if URL is selected
    setShowUrlInput(false);
    triggerToast("External media graphics verification complete!", "success");
  };

  // Restock logic simulation
  const handleRestockQty = () => {
    const amt = parseInt(addQtyAmount);
    if (!amt || amt <= 0) {
      triggerToast("Please enter a valid amount to append.", "error");
      return;
    }
    setCurrentQty(prev => prev + amt);
    setAddQtyAmount("");
    triggerToast(`Inventory stock expanded successfully. In-stock count: ${currentQty + amt}`, "success");
  };

  // Variants management
  const addVariantRow = () => {
    const newId = `v-${Date.now()}`;
    setVariants([...variants, { id: newId, type: "Size", value: "" }]);
  };

  const removeVariantRow = (id: string) => {
    if (variants.length === 1) {
      triggerToast("Products require at least one single option variant value.", "blank");
      return;
    }
    setVariants(variants.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, field: "type" | "value", value: string) => {
    setVariants(variants.map(v => (v.id === id ? { ...v, [field]: value } : v)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* SECTION 1: Top Sticky Header Action Controls (screenshot 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-divider/50 pb-5">
        <div>
          <button
            onClick={() => setActivePage("products-list")}
            className="group flex items-center text-xs font-black text-text-secondary hover:text-primary transition-all mb-1 select-none"
          >
            <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Back to Product List
          </button>
          <h2 className="text-2xl font-black font-display text-text-primary tracking-tight">
            {isEditing ? "Edit Product" : "Add a new product"}
          </h2>
          <p className="text-xs text-text-secondary font-semibold">Orders placed across your store</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActivePage("products-list")}
            className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary bg-bg-card hover:bg-gray-100 dark:hover:bg-zinc-800 border border-border-divider rounded-xl transition-all select-none cursor-pointer"
          >
            Discard
          </button>
          <button
            onClick={() => handleSaveProduct("Inactive")}
            className="px-4 py-2 text-xs font-bold text-primary bg-primary-light hover:bg-primary/20 border border-primary/20 rounded-xl transition-all select-none cursor-pointer"
          >
            Save Draft
          </button>
          <button
            id="publish-product-btn"
            onClick={() => handleSaveProduct("Publish")}
            className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm hover:shadow-primary/30 transition-all select-none cursor-pointer"
          >
            Publish Product
          </button>
        </div>
      </div>

      {/* SECTION 2: Responsive Two-Column Responsive Layout Grid (screenshot 5 & 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main specifications cards (size 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card A: Product Information */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-display font-black text-text-primary text-[14px]">Product Information</h3>
            
            <div className="space-y-5">
              {/* Product Name Input */}
              <div className="relative">
                <input
                  id="input-product-name"
                  type="text"
                  placeholder=" "
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                />
                <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[11px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none">
                  Product Name
                </span>
              </div>

              {/* SKU & Barcode side-by-side row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative">
                  <input
                    id="input-sku"
                    type="text"
                    placeholder=" "
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                  />
                  <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[11px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none">
                    SKU
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="input-barcode"
                    type="text"
                    placeholder=" "
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                  />
                  <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[11px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none">
                    Barcode
                  </span>
                </div>
              </div>

              {/* Rich Text Editor — powered by Tiptap */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block select-none">
                  Description (Optional)
                </label>
                <RichTextEditor
                  value={description}
                  onChange={(html) => setDescription(html)}
                  placeholder="Keep your product account secure with detailed specs and documentation description."
                  maxLength={2000}
                />
              </div>
            </div>
          </div>

          {/* Card B: Media (Drag & Drop) */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-text-primary text-[14px]">Product Image</h3>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs font-black text-primary hover:underline transition-all flex items-center gap-1 cursor-pointer"
              >
                <Link2 size={13} />
                Add media from URL
              </button>
            </div>

            {/* URL Input Form */}
            {showUrlInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-primary-light/50 p-4 rounded-xl border border-primary/10 flex flex-col sm:flex-row items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Paste HTTP URL link..."
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-lg px-3 py-1.5 text-xs font-semibold text-text-primary outline-none"
                />
                <button
                  type="button"
                  onClick={handleConfirmUrl}
                  className="bg-primary text-white text-xs font-bold rounded-lg px-4 py-1.5 hover:bg-primary-hover shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Verify URL
                </button>
              </motion.div>
            )}

            {/* File Upload Selector & Preview (screenshot 5) */}
            {(imageUrl || selectedFile) ? (
              <div className="relative group rounded-2xl border border-border-divider overflow-hidden h-64 bg-gray-55/15 dark:bg-zinc-800/10 flex items-center justify-center">
                <img
                  src={imageUrl || selectedFile || ""}
                  alt="Product preview"
                  className="max-h-full max-w-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setSelectedFile(null);
                      setTempUrl("");
                      triggerToast("Product graphics deleted", "blank");
                    }}
                    className="p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 transition-all ${
                  dragOver ? "border-primary bg-primary-light/30" : "border-gray-200 dark:border-zinc-700 bg-gray-50/20 hover:bg-gray-50/60 dark:hover:bg-zinc-805/30"
                }`}
              >
                <div className="h-12 w-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center shrink-0">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-text-primary leading-none">Drag and Drop Your Image Here.</p>
                  <span className="text-xs text-text-secondary font-bold block mt-1">or</span>
                </div>
                <label className="px-4 py-1.5 border border-primary text-primary hover:bg-primary-light text-xs font-black rounded-xl transition-all cursor-pointer inline-block">
                  Browse Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Card C: Product Variants (screenshot 6) */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-display font-black text-text-primary text-[14px]">Product Variants</h3>
            
            <div className="space-y-4">
              {variants.map((v, index) => (
                <div key={v.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  
                  {/* Variant Selector (screenshot 6) */}
                  <div className="md:col-span-4 relative select-none">
                    <button
                      type="button"
                      onClick={() => setIsVariantTypeOpen(isVariantTypeOpen === v.id ? null : v.id)}
                      className={`w-full text-left bg-bg-card border rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[42px] ${
                        isVariantTypeOpen === v.id ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
                      }`}
                    >
                      <span>{v.type}</span>
                      <ChevronDown size={14} className="text-text-secondary" />
                    </button>
                    <span className="absolute left-3 -top-2 px-1 text-[10px] font-bold text-text-secondary bg-bg-card transition-all">
                      Select Variant
                    </span>

                    {isVariantTypeOpen === v.id && (
                      <div className="absolute left-0 right-0 mt-1 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 font-semibold text-xs text-text-primary">
                        {["Size", "Color", "Weight", "Smell", "Storage"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              updateVariant(v.id, "type", opt);
                              setIsVariantTypeOpen(null);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                              v.type === opt ? "text-primary font-bold bg-primary-light" : ""
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Variant Value Field (screenshot 6) */}
                  <div className="md:col-span-7 relative">
                    <input
                      type="text"
                      placeholder="e.g. 128GB, Pro Edition"
                      value={v.value}
                      onChange={(e) => updateVariant(v.id, "value", e.target.value)}
                      className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[42px]"
                    />
                    <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                      Variant Value
                    </span>
                  </div>

                  {/* Delete row button */}
                  <div className="md:col-span-1 pb-1 flex justify-center md:justify-end">
                    <button
                      type="button"
                      onClick={() => removeVariantRow(v.id)}
                      className="p-2 text-text-secondary hover:text-red-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                      title="Delete Variant Slot"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addVariantRow}
              type="button"
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer select-none mt-2"
            >
              <Plus size={14} />
              Add Another Option
            </button>
          </div>

          {/* Card D: Product Sub-Settings (Tabbed Layout) */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-display font-black text-text-primary text-[14px]">Product Sub-Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              
              {/* Left tabs menu panel */}
              <div className="md:col-span-4 space-y-1.5 border-b md:border-b-0 md:border-r border-border-divider/75 pb-4 md:pb-0 md:pr-4">
                {([
                  { id: "pricing", label: "Pricing", icon: DollarSign },
                  { id: "restock", label: "Restock", icon: Layers },
                  { id: "shipping", label: "Shipping", icon: Truck }
                ] satisfies Array<{ id: InventoryTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }>).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveInventoryTab(tab.id)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 select-none ${
                        activeInventoryTab === tab.id
                          ? "bg-primary text-white shadow-sm"
                          : "text-text-secondary hover:bg-gray-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Right dynamic content panel */}
              <div className="md:col-span-8 space-y-4 text-xs font-semibold text-text-secondary">
                {activeInventoryTab === "pricing" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 py-1">
                    <h4 className="font-display font-bold text-text-primary text-sm flex items-center gap-2">
                      <DollarSign size={16} className="text-primary" />
                      <span>Pricing Settings</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Base Price */}
                      <div className="relative">
                        <input
                          id="tab-base-price"
                          type="text"
                          placeholder=" "
                          value={basePrice}
                          onChange={(e) => setBasePrice(e.target.value)}
                          className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                        />
                        <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                          Base Price
                        </span>
                        <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-text-secondary font-mono">$</span>
                      </div>

                      {/* Discounted Price */}
                      <div className="relative">
                        <input
                          id="tab-discounted-price"
                          type="text"
                          placeholder=" "
                          value={discountedPrice}
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                          className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                        />
                        <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                          Discounted Price
                        </span>
                        <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-text-secondary font-mono">$</span>
                      </div>
                    </div>

                    {/* Material-style floating label dropdown for Tax Profile */}
                    <div ref={taxProfileRef} className="relative select-none z-30">
                      <button
                        type="button"
                        onClick={() => setIsTaxProfileOpen(!isTaxProfileOpen)}
                        className={`w-full text-left bg-bg-card border rounded-xl px-4 py-3 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[45px] ${
                          isTaxProfileOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
                        }`}
                      >
                        <span>{taxProfile}</span>
                        <ChevronDown size={14} className="text-text-secondary" />
                      </button>
                      <span className="absolute left-3 -top-2 px-1 text-[10px] font-bold text-text-secondary bg-bg-card">
                        Tax Profile Category
                      </span>
                      <AnimatePresence>
                        {isTaxProfileOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 right-0 mt-1 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 overflow-hidden font-semibold text-xs text-text-primary"
                          >
                            {["VAT 15% (Standard)", "Luxury Tax 20%", "No Tax (Services Only)", "Reduced VAT 5%"].map(item => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setTaxProfile(item);
                                  setIsTaxProfileOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                                  taxProfile === item ? "text-primary font-bold bg-primary-light" : ""
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Tax charge checkbox */}
                    <div className="flex items-center gap-2.5 pt-1.5 select-none text-xs font-semibold">
                      <input
                        id="tab-charge-tax"
                        type="checkbox"
                        checked={chargeTax}
                        onChange={(e) => setChargeTax(e.target.checked)}
                        className="rounded text-primary focus:ring-primary border-border-divider h-4 w-4 bg-bg-card cursor-pointer"
                      />
                      <label htmlFor="tab-charge-tax" className="text-text-secondary cursor-pointer hover:text-text-primary select-none">
                        Charge tax on this product
                      </label>
                    </div>

                    {/* Dynamic state calculation helper */}
                    {chargeTax && (
                      <div className="bg-primary-light/5 border border-primary/15 rounded-xl p-3 text-xs text-text-secondary leading-relaxed space-y-1">
                        <div className="flex justify-between">
                          <span>Calculated VAT ({taxProfile.includes("20%") ? "20%" : taxProfile.includes("5%") ? "5%" : taxProfile.includes("No Tax") ? "0%" : "15%"}):</span>
                          <span className="font-bold text-text-primary font-mono">
                            ${((parseFloat(basePrice) || 0) * (taxProfile.includes("20%") ? 0.20 : taxProfile.includes("5%") ? 0.05 : taxProfile.includes("No Tax") ? 0 : 0.15)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-border-divider/50 pt-1 mt-1 font-bold text-text-primary">
                          <span>Total Retail Price (Tax Inc.):</span>
                          <span className="font-mono text-primary">
                            ${((parseFloat(basePrice) || 0) * (1 + (taxProfile.includes("20%") ? 0.20 : taxProfile.includes("5%") ? 0.05 : taxProfile.includes("No Tax") ? 0 : 0.15))).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeInventoryTab === "restock" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 py-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-text-primary text-sm flex items-center gap-2">
                        <Layers size={16} className="text-primary" />
                        <span>Inventory Restock Options</span>
                      </h4>
                      {/* Dynamic Product Status Badges */}
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-[10px] font-black tracking-wide rounded-md uppercase leading-normal ${
                          !trackInventory 
                            ? "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500" 
                            : currentQty <= (parseInt(reorderPoint) || 0)
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-green-500/10 text-green-500 border border-green-500/20"
                        }`}
                      >
                        {!trackInventory ? "Not Tracked" : currentQty <= (parseInt(reorderPoint) || 0) ? "Low Stock" : "In Stock"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Quantity in Stock */}
                      <div className="relative">
                        <input
                          id="tab-current-qty"
                          type="number"
                          placeholder=" "
                          value={currentQty === 0 ? "" : currentQty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setCurrentQty(isNaN(val) ? 0 : val);
                          }}
                          className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                        />
                        <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                          Quantity in Stock
                        </span>
                      </div>

                      {/* Reorder Point */}
                      <div className="relative">
                        <input
                          id="tab-reorder-point"
                          type="number"
                          placeholder=" "
                          value={reorderPoint}
                          onChange={(e) => setReorderPoint(e.target.value)}
                          className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                        />
                        <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                          Reorder Point
                        </span>
                      </div>
                    </div>

                    {/* Supplier Reference */}
                    <div className="relative">
                      <input
                        id="tab-supplier-ref"
                        type="text"
                        placeholder=" "
                        value={supplierRef}
                        onChange={(e) => setSupplierRef(e.target.value)}
                        className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                      />
                      <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                        Supplier Reference
                      </span>
                    </div>

                    {/* Custom Toggle switch component for Track Inventory */}
                    <div className="border-t border-border-divider/70 pt-4 flex items-center justify-between select-none">
                      <span className="text-xs font-bold text-text-primary">Track Inventory Levels</span>
                      <button
                        type="button"
                        onClick={() => setTrackInventory(!trackInventory)}
                        className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          trackInventory ? "bg-primary" : "bg-gray-200 dark:bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-bg-card shadow-sm ring-0 transition duration-200 ease-in-out ${
                            trackInventory ? "translate-x-4.5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeInventoryTab === "shipping" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 py-1">
                    <h4 className="font-display font-bold text-text-primary text-sm flex items-center gap-2">
                      <Truck size={16} className="text-primary" />
                      <span>Logistics & Shipping Profiles</span>
                    </h4>

                    {/* Radio/Card click selectors with solid borders and active checkmarks */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {([
                        { id: "standard", title: "Standard Delivery", desc: "Arrives in 3-5 days" },
                        { id: "express", title: "Express Air", desc: "Priority cargo delivery" },
                        { id: "local", title: "Local Pickup", desc: "Store counter dispatch" }
                      ] satisfies Array<{ id: ShippingType; title: string; desc: string }>).map((item) => {
                        const isSel = shippingType === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setShippingType(item.id)}
                            className={`p-3 text-left bg-bg-card border-2 rounded-xl transition-all cursor-pointer flex flex-col justify-between ${
                              isSel ? "border-primary shadow-sm" : "border-border-divider hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={`text-[11px] font-black uppercase ${isSel ? "text-primary" : "text-text-secondary"}`}>
                                {item.title}
                              </span>
                              {isSel && (
                                <span className="h-4 w-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-text-secondary mt-1 font-medium">{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block -mb-2 pt-1">
                      Package Dimensions & Weight
                    </p>

                    {/* Input fields for physical dimensions grouped with gap-4 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {/* Weight */}
                      <div className="relative">
                        <input
                          id="ship-weight"
                          type="text"
                          placeholder=" "
                          value={shippingWeight}
                          onChange={(e) => setShippingWeight(e.target.value)}
                          className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                        />
                        <span className="absolute left-2.5 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-3 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                          Weight (kg)
                        </span>
                      </div>

                      {/* Length */}
                      <div className="relative">
                        <input
                          id="ship-length"
                          type="text"
                          placeholder=" "
                          value={shippingLength}
                          onChange={(e) => setShippingLength(e.target.value)}
                          className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                        />
                        <span className="absolute left-2.5 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-3 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                          Length (cm)
                        </span>
                      </div>

                      {/* Width */}
                      <div className="relative">
                        <input
                          id="ship-width"
                          type="text"
                          placeholder=" "
                          value={shippingWidth}
                          onChange={(e) => setShippingWidth(e.target.value)}
                          className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                        />
                        <span className="absolute left-2.5 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-3 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                          Width (cm)
                        </span>
                      </div>

                      {/* Height */}
                      <div className="relative">
                        <input
                          id="ship-height"
                          type="text"
                          placeholder=" "
                          value={shippingHeight}
                          onChange={(e) => setShippingHeight(e.target.value)}
                          className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                        />
                        <span className="absolute left-2.5 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-3 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                          Height (cm)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Secondary parameters, pricing, organization (size 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card E: Pricing card with floating inputs */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-display font-black text-text-primary text-[14px]">Pricing</h3>
            
            <div className="space-y-4">
              {/* Base Price input */}
              <div className="relative">
                <input
                  id="input-base-price"
                  type="text"
                  placeholder=" "
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[42px]"
                />
                <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                  Base Price
                </span>
                <span className="absolute right-3.5 top-3 text-[10px] font-bold text-text-secondary font-mono">$</span>
              </div>

              {/* Discounted Price */}
              <div className="relative">
                <input
                  id="input-discounted-price"
                  type="text"
                  placeholder=" "
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[42px]"
                />
                <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                  Discounted Price
                </span>
                <span className="absolute right-3.5 top-3 text-[10px] font-bold text-text-secondary font-mono">$</span>
              </div>

              <div className="flex items-center gap-2.5 pt-1.5 select-none text-xs font-semibold">
                <input
                  id="charge-tax-check"
                  type="checkbox"
                  checked={chargeTax}
                  onChange={(e) => setChargeTax(e.target.checked)}
                  className="rounded text-primary focus:ring-primary border-border-divider h-4 w-4 bg-bg-card cursor-pointer"
                />
                <label htmlFor="charge-tax-check" className="text-text-secondary cursor-pointer hover:text-text-primary">
                  Charge tax on this product
                </label>
              </div>

              <div className="border-t border-border-divider/85 pt-4 flex items-center justify-between select-none">
                <span className="text-xs font-bold text-text-primary">In stock</span>
                <button
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    inStock ? "bg-primary" : "bg-gray-200 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-bg-card shadow-sm ring-0 transition duration-200 ease-in-out ${
                      inStock ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Card F: Organize parameters with custom dropdown elements (screenshot 6) */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-display font-black text-text-primary text-[14px]">Organize</h3>
            
            <div className="space-y-4 pt-1.5">
              
              {/* Select Vendor */}
              <div ref={vendorRef} className="relative select-none z-30">
                <button
                  type="button"
                  onClick={() => {
                    setIsVendorOpen(!isVendorOpen);
                    setIsCategoryOpen(false);
                    setIsCollectionOpen(false);
                    setIsStatusOpen(false);
                  }}
                  className={`w-full text-left bg-bg-card border rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[42px] ${
                    isVendorOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
                  }`}
                >
                  <span>{vendor}</span>
                  <ChevronDown size={14} className="text-text-secondary" />
                </button>
                <span className="absolute left-3 -top-2 px-1 text-[10px] font-bold text-text-secondary bg-bg-card">
                  Select Vendor
                </span>
                <AnimatePresence>
                  {isVendorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 overflow-hidden font-semibold text-xs text-text-primary"
                    >
                      {["Core Devs Global", "Electronics Inc.", "Nike Store", "Apple Store"].map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setVendor(item);
                            setIsVendorOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                            vendor === item ? "text-primary font-bold bg-primary-light" : ""
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Select Category */}
              <div ref={categoryRef} className="relative select-none z-20">
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryOpen(!isCategoryOpen);
                        setIsVendorOpen(false);
                        setIsCollectionOpen(false);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full text-left bg-bg-card border rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[42px] ${
                        isCategoryOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
                      }`}
                    >
                      <span>{category}</span>
                      <ChevronDown size={14} className="text-text-secondary" />
                    </button>
                    <span className="absolute left-3 -top-2 px-1 text-[10px] font-bold text-text-secondary bg-bg-card">
                      Select Category
                    </span>
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-0 right-0 mt-1 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 overflow-hidden font-semibold text-xs text-text-primary"
                        >
                          {categoryOptions.map(item => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setCategory(item);
                                setIsCategoryOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                                category === item ? "text-primary font-bold bg-primary-light" : ""
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCatNameInput("");
                      setIsAddCatModalOpen(true);
                    }}
                    className="h-[42px] w-[42px] shrink-0 bg-primary-light text-primary border border-primary/10 rounded-xl flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer"
                    title="Add Category Slot"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Select Collection */}
              <div ref={collectionRef} className="relative select-none z-10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCollectionOpen(!isCollectionOpen);
                    setIsVendorOpen(false);
                    setIsCategoryOpen(false);
                    setIsStatusOpen(false);
                  }}
                  className={`w-full text-left bg-bg-card border rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[42px] ${
                    isCollectionOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
                  }`}
                >
                  <span>{collection}</span>
                  <ChevronDown size={14} className="text-text-secondary" />
                </button>
                <span className="absolute left-3 -top-2 px-1 text-[10px] font-bold text-text-secondary bg-bg-card">
                  Select Collection
                </span>
                <AnimatePresence>
                  {isCollectionOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 overflow-hidden font-semibold text-xs text-text-primary"
                    >
                      {["New Arrivals", "Summer Collection", "Winter Special", "Popular Items"].map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setCollection(item);
                            setIsCollectionOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                            collection === item ? "text-primary font-bold bg-primary-light" : ""
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Select Status */}
              <div ref={statusRef} className="relative select-none z-10">
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusOpen(!isStatusOpen);
                    setIsVendorOpen(false);
                    setIsCategoryOpen(false);
                    setIsCollectionOpen(false);
                  }}
                  className={`w-full text-left bg-bg-card border rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all flex items-center justify-between h-[42px] ${
                    isStatusOpen ? "border-primary ring-1 ring-primary" : "border-border-divider hover:border-gray-400"
                  }`}
                >
                  <span>{status === "Publish" ? "Publish" : status}</span>
                  <ChevronDown size={14} className="text-text-secondary" />
                </button>
                <span className="absolute left-3 -top-2 px-1 text-[10px] font-bold text-text-secondary bg-bg-card">
                  Select Status
                </span>
                <AnimatePresence>
                  {isStatusOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1 bg-bg-card border border-border-divider rounded-xl shadow-lg z-50 py-1 overflow-hidden font-semibold text-xs text-text-primary"
                    >
                      {([
                        { val: "Publish", label: "Publish" },
                        { val: "Scheduled", label: "Scheduled" },
                        { val: "Inactive", label: "Inactive" }
                      ] satisfies Array<{ val: ProductStatus; label: string }>).map(item => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => {
                            setStatus(item.val);
                            setIsStatusOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-primary-light transition-all ${
                            status === item.val ? "text-primary font-bold bg-primary-light" : ""
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tags Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="peer w-full bg-bg-card border border-border-divider focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none transition-all placeholder-transparent h-[45px]"
                />
                <span className="absolute left-3 -top-2 px-1 pb-0.5 text-[10px] font-bold text-text-secondary bg-bg-card select-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
                  Enter Tags
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Custom Add Category Dialog Popup (replaces ugly blocker prompt) */}
      <AnimatePresence>
        {isAddCatModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-bg-card border border-border-divider rounded-2xl w-full max-w-sm p-6 shadow-2xl relative"
            >
              <h3 className="text-sm font-bold text-text-primary mb-1 select-none">Create New Category</h3>
              <p className="text-[11px] text-text-secondary mb-4 select-none">Add a custom category option for your product.</p>
              
              <input
                type="text"
                placeholder="Category Name"
                value={newCatNameInput}
                onChange={(e) => setNewCatNameInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-transparent border border-border-divider focus:border-primary rounded-xl text-xs font-semibold text-text-primary outline-none transition-all placeholder:text-text-secondary h-[40px] mb-4"
                autoFocus
              />

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary bg-bg-card hover:bg-gray-100 border border-border-divider/70 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                onClick={() => {
                  const trimmed = newCatNameInput.trim();
                  if (trimmed) {
                    if (!categoryOptions.includes(trimmed)) {
                      setCategoryOptions(prev => [...prev, trimmed]);
                    }
                    setCategory(trimmed);
                    triggerToast(`Added custom category "${trimmed}"`, "success");
                    setIsAddCatModalOpen(false);
                  } else {
                    toastError("Please enter a category name");
                  }
                }}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

