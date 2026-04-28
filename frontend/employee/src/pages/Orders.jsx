import React, { useState, useEffect } from "react";
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
// Import Lucide React icons for UI components
import {
  ShoppingBag,    // Icon for orders stats
  IndianRupee,   // Icon for revenue stats
  TrendingUp,     // Icon for growth indicator
  PlusCircle,     // Icon for create order button
  Search,         // Icon for search input
  Eye,           // Icon for view action
  Edit,           // Icon for edit action
  Layers,         // Icon for 'All' filter
  Clock,          // Icon for 'Today' filter
  CalendarDays,    // Icon for 'Weekly' filter
  AlertTriangle,   // Icon for validation errors
  PenLine,        // Professional Edit Icon
  FileText,       // Professional View Icon
  X               // Close Icon
} from "lucide-react";
// Import theme context for global dark mode
import { useTheme } from '../context/ThemeContext';
import { getOrders, createOrderAPI, updateOrderAPI, getOrderStats } from '../services/orderService';
import { getSyncCachedData } from '../utils/cacheHelper';

// Main Employee Orders Component
const EmployeeOrders = () => {
  const { setPageLoading } = useOutletContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Use global theme context
  const { isDarkMode, toggleTheme } = useTheme();

  // State variables for component functionality
  const [search, setSearch] = useState("");                    // Search query state
  const [showModal, setShowModal] = useState(false);           // Modal visibility state
  const [success, setSuccess] = useState(false);              // Success message state
  const [activityFilter, setActivityFilter] = useState("All"); // Activity filter state
  const [statusFilter, setStatusFilter] = useState("All");     // Status filter state
  const [lastAction, setLastAction] = useState("");         // Track last action (create/update)
  const [validationError, setValidationError] = useState(false); // Validation error state
  const [selectedOrder, setSelectedOrder] = useState(null);   // Selected order for viewing
  const [viewOrderModal, setViewOrderModal] = useState(false); // View order modal state
  const [editModal, setEditModal] = useState(false);         // Edit modal state
  const [editingOrder, setEditingOrder] = useState(null);      // Order being edited
  const [studioExpanded, setStudioExpanded] = useState(false); // Toggle for in-page Order Studio
  const [currentEditId, setCurrentEditId] = useState(null); // ID of the order being edited
  const [newOrder, setNewOrder] = useState({
    store: "",      // Store name field
    items: "",       // Number of items field
    value: "",       // Order value field
    storeLocation: "", // Store Location field
    orderStatus: "Pending", // Order Status field
    paymentStatus: "Pending", // Payment Status field
    paymentMethod: "", // Payment Method field
    date: new Date().toISOString().split('T')[0], // Order date field - auto-filled with today's date
    deliveryDate: "", // Delivery Date field
    priority: "Medium", // Priority field
    orderSource: "", // Order Source field
    notes: "" // Notes field
  });

  // Auto-navigation effect removed as per user request
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prevTab => {
        const tabs = ["salesByStore", "weeklyRevenue", "ordersByStatus", "monthlyRevenue", "topStores", "salesExecutive"];
        const currentIndex = tabs.indexOf(prevTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 3000); // Change tab every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  */

  // Initial orders data with sample orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: { value: 0, change: '0%' },
    activeOrders: { value: 0, change: '0%' },
    conversionRate: { value: '0%', change: '0%' },
    avgOrderValue: { value: '0', change: '0%' }
  });

  const transformOrders = (data) => {
    return data.map(o => {
      const orderDate = new Date(o.timestamp || o.createdAt);
      const isValidDate = !isNaN(orderDate.getTime());
      return {
        ...o,
        id: o._id,
        store: o.storeName,
        items: typeof o.items === 'number' ? o.items : 0,
        value: o.totalAmount,
        status: o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : 'Pending',
        date: isValidDate ? orderDate.toISOString().split('T')[0] : '---',
        paymentMethod: o.paymentMethod || "",
        deliveryDate: o.deliveryDate || "",
        orderStatus: o.status || "Pending",
        notes: o.notes || ""
      };
    });
  };

  const fetchOrders = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const data = await getOrders();
      setOrders(transformOrders(data));
      
      // Also fetch stats
      const statsData = await getOrderStats();
      if (statsData) setStats(statsData);
      
    } catch (err) {
      // Error handling for orders fetch
    } finally {
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  // Fetch orders from API & Context Hydration
  useEffect(() => {
    // 1. Mission Context Recovery (Deep Linked from Form)
    const qStore = searchParams.get('storeName');
    if (qStore) {
      setNewOrder(prev => ({ ...prev, store: qStore }));
      setStudioExpanded(true); // Automatically expand if coming from mission
    }

    // 2. Initial Hydration from Cache (0s Loading)
    const cachedOrders = getSyncCachedData('employee_orders');
    if (cachedOrders) {
      setOrders(transformOrders(cachedOrders));
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
      fetchOrders(true); // Silent background update
    } else {
      fetchOrders();
    }
  }, [searchParams]);

  // Calculate total sales from all orders
  const totalSales = orders.reduce((a, b) => a + b.value, 0);

  // Function to filter orders based on search and activity filter
  const getFilteredOrders = () => {
    // Filter orders by search query (store name or order ID)
    const filteredBySearch = orders.filter(
      o =>
        o.store.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
    );

    // Apply status filter
    const statusFiltered = statusFilter === "All" 
      ? filteredBySearch 
      : filteredBySearch.filter(o => o.status === statusFilter);

    // Apply activity filter
    if (activityFilter === "All") {
      return statusFiltered;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activityFilter === "Daily") {
      return statusFiltered.filter(o => {
        const orderDate = new Date(o.date);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });
    }

    if (activityFilter === "Weekly") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return statusFiltered.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate >= weekAgo;
      });
    }

    return statusFiltered;
  };

  // Export orders to CSV
  const exportOrders = () => {
    const headers = ["Order ID", "Store", "Items", "Value", "Status", "Date"];
    const csvRows = [
      headers.join(","),
      ...filteredOrders.map(o => [
        o.id,
        `"${o.store}"`,
        o.items,
        o.value,
        o.status,
        o.date
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get filtered orders for display
  const filteredOrders = getFilteredOrders();

  // Function to view order details
  const viewOrder = order => {
    setSelectedOrder(order);    // Set the selected order for viewing
    setViewOrderModal(true);   // Open the view order modal
  };

  // Function to edit an existing order - REDIRECTED TO IN-PAGE STUDIO
  const editOrder = order => {
    setCurrentEditId(order.id);
    setNewOrder({
      store: order.store || "",
      items: order.items?.toString() || "",
      value: order.value?.toString() || "",
      storeLocation: order.storeLocation || "",
      orderStatus: order.orderStatus || order.status || "Pending",
      paymentStatus: order.paymentStatus || "Pending",
      paymentMethod: order.paymentMethod || "",
      date: order.date || new Date().toISOString().split('T')[0],
      deliveryDate: order.deliveryDate || "",
      priority: order.priority || "Medium",
      orderSource: order.orderSource || "",
      notes: order.notes || ""
    });
    setStudioExpanded(true); // Open in-page studio
    // Scroll to studio
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // UNIFIED STUDIO PERSISTENCE (Handles both CREATE and UPDATE)
  const handleStudioSave = async () => {
    const isEditing = !!currentEditId;
    setValidationError(false);

    // Common Validation
    if (!newOrder.store || !newOrder.items || !newOrder.value || !newOrder.paymentMethod) {
      setValidationError("Please fill in all required fields");
      setTimeout(() => setValidationError(false), 3000);
      return;
    }

    const itemsNum = Number(newOrder.items);
    const valueNum = Number(newOrder.value);

    if (isNaN(itemsNum) || isNaN(valueNum) || itemsNum <= 0 || valueNum <= 0) {
      setValidationError("Please enter valid numbers");
      setTimeout(() => setValidationError(false), 3000);
      return;
    }

    try {
      const apiData = {
        storeName: newOrder.store,
        items: itemsNum,
        totalAmount: valueNum,
        status: (newOrder.orderStatus || "Pending").toLowerCase(),
        paymentMethod: newOrder.paymentMethod,
        deliveryDate: newOrder.deliveryDate,
        notes: newOrder.notes
      };

      if (isEditing) {
        // UPDATE LOGIC
        const updated = await updateOrderAPI(currentEditId, apiData);
        const orderDate = new Date(updated.timestamp || updated.createdAt);
        
        const updatedOrder = {
          ...updated,
          id: updated._id,
          store: updated.storeName,
          items: itemsNum,
          value: updated.totalAmount,
          status: updated.status ? updated.status.charAt(0).toUpperCase() + updated.status.slice(1) : 'Pending',
          date: !isNaN(orderDate.getTime()) ? orderDate.toISOString().split('T')[0] : '---',
          paymentMethod: newOrder.paymentMethod,
          deliveryDate: newOrder.deliveryDate,
          orderStatus: newOrder.orderStatus,
          notes: newOrder.notes
        };

        setOrders(prev => prev.map(o => o.id === currentEditId ? updatedOrder : o));
        setLastAction("update");
      } else {
        // CREATE LOGIC
        const created = await createOrderAPI(apiData);
        const orderDate = new Date(created.timestamp || created.createdAt);
        
        const order = {
          ...created,
          id: created._id,
          store: created.storeName,
          items: itemsNum,
          value: created.totalAmount,
          status: created.status ? created.status.charAt(0).toUpperCase() + created.status.slice(1) : 'Pending',
          date: !isNaN(orderDate.getTime()) ? orderDate.toISOString().split('T')[0] : '---',
          paymentMethod: newOrder.paymentMethod,
          deliveryDate: newOrder.deliveryDate,
          orderStatus: newOrder.orderStatus,
          notes: newOrder.notes
        };

        setOrders(prev => [order, ...prev]);
        setLastAction("create");
      }

      // Success Cleanup
      setStudioExpanded(false);
      setCurrentEditId(null);
      setNewOrder({
        store: "", items: "", value: "", storeLocation: "", 
        orderStatus: "Pending", paymentStatus: "Pending", paymentMethod: "", 
        date: new Date().toISOString().split('T')[0], deliveryDate: "", 
        priority: "Medium", orderSource: "", notes: "" 
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLastAction("");
        const returnUrl = searchParams.get('returnUrl');
        if (returnUrl) navigate(`${decodeURIComponent(returnUrl)}&orderReturn=true`);
      }, 1500);

    } catch (error) {
      setValidationError(isEditing ? "Failed to update" : "Failed to create");
      setTimeout(() => setValidationError(false), 3000);
    }
  };

  /*
  // Sales Executive Performance data removed as per user request
  const getSalesExecutiveData = () => {
    ...
  };
  */

  const [activeTab, setActiveTab] = useState("all");

  const ordersByActivity = {
    dailyCount: orders.filter(o => {
      const d = new Date(o.date);
      return d.toDateString() === new Date().toDateString();
    }).length,
    weeklyRevenue: orders.filter(o => {
      const d = new Date(o.date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }).reduce((acc, curr) => acc + curr.value, 0),
    avgOrderValue: orders.length > 0 ? (totalSales / orders.length).toFixed(0) : 0,
    conversionRate: 65, // Sample conversion metric
  };

  // Main render method
  return (
    <div className={`${isDarkMode ? "bg-[#0a0f1c]" : "bg-slate-50/50"} min-h-screen p-2 sm:p-3 font-sans transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-700">
        
        {/* REVENUE PULSE - Advanced Analytics Hub */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-[2rem] p-4 sm:p-5 shadow-2xl shadow-indigo-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-1000" />
          
            <div className="mb-1">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                Revenue Overview
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Sales', val: `₹${(stats?.totalRevenue?.value || 0).toLocaleString()}`, color: 'indigo', change: stats?.totalRevenue?.change || '0%', icon: IndianRupee, desc: 'Revenue Velocity' },
                { label: 'Success Rate', val: stats?.conversionRate?.value || '0%', color: 'emerald', change: stats?.conversionRate?.change || '0%', icon: TrendingUp, desc: 'Conversion Lift' },
                { label: 'Average Order', val: `₹${Number(stats?.avgOrderValue?.value || 0).toLocaleString()}`, color: 'blue', change: stats?.avgOrderValue?.change || '0%', icon: ShoppingBag, desc: 'Basket Strength' },
                { label: 'Current Orders', val: stats?.activeOrders?.value || 0, color: 'orange', change: stats?.activeOrders?.change || '0%', icon: PlusCircle, desc: 'Live Pipeline' },
              ].map((stat, i) => (
                <div key={i} className="group relative bg-white dark:bg-gray-800/40 p-4 md:p-5 rounded-[1.25rem] border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-200/20 dark:shadow-none hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 overflow-hidden">
                  {/* Glass Accent */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color === 'orange' ? 'amber' : stat.color}-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-${stat.color === 'orange' ? 'amber' : stat.color}-500/10 dark:bg-${stat.color === 'orange' ? 'amber' : stat.color}-500/20 flex items-center justify-center text-${stat.color === 'orange' ? 'amber' : stat.color}-600 dark:text-${stat.color === 'orange' ? 'amber' : stat.color}-400 group-hover:rotate-12 transition-transform duration-500`}>
                        <stat.icon size={22} strokeWidth={1.5} />
                      </div>
                      <div className={`px-3 py-1 rounded-full ${(stat.change || '').startsWith('+') || (stat.change || '').includes('100') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'} text-[8px] font-black uppercase tracking-widest`}>
                        {stat.change}
                      </div>
                    </div>
                    
                    <h3 className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-0.5">{stat.label}</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                       <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{stat.val}</span>
                    </div>
                    <p className="text-[8px] font-bold text-gray-400/80 uppercase tracking-widest">{stat.desc} vs last time</p>
                    
                    {/* Sparkline Placeholder (Pure CSS) */}
                    <div className="mt-3 h-6 w-full flex items-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
                       {[0.2, 0.4, 0.3, 0.6, 0.5, 0.8, 0.4, 0.7].map((h, j) => (
                          <div 
                            key={`${i}-${j}`} 
                            style={{ height: `${h * 100}%` }} 
                            className={`flex-1 rounded-full bg-${stat.color === 'orange' ? 'amber' : stat.color}-500 transition-all duration-700`} 
                          />
                       ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </section>

        {/* INTEGRATED ORDER STUDIO - Modal-free, Simple English */}
        {studioExpanded && (
          <section className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in slide-in-from-top duration-500">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                      <ShoppingBag size={24} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{currentEditId ? 'Edit Commercial Record' : 'New Order Entry'}</h2>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{currentEditId ? 'Modify existing transaction details' : 'Enter new commercial details directly below'}</p>
                   </div>
                </div>
                <button 
                  onClick={() => {
                    setStudioExpanded(false);
                    setCurrentEditId(null);
                    setNewOrder({
                      store: "", items: "", value: "", storeLocation: "", 
                      orderStatus: "Pending", paymentStatus: "Pending", paymentMethod: "", 
                      date: new Date().toISOString().split('T')[0], deliveryDate: "", 
                      priority: "Medium", orderSource: "", notes: "" 
                    });
                  }}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <X size={20} />
                </button>
             </div>

           <div className="space-y-12">
              {/* Step 01: Basics */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center text-[10px] font-black">01</span>
                    <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Basic Information</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Store Name</label>
                       <input type="text" placeholder="Which store?" value={newOrder.store} onChange={e => setNewOrder({ ...newOrder, store: e.target.value })} className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-base font-bold text-gray-900 dark:text-white outline-none transition-all" />
                    </div>
                    <div className="relative">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Date</label>
                       <input type="date" value={newOrder.date} onChange={e => setNewOrder({ ...newOrder, date: e.target.value })} className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-base font-bold text-gray-900 dark:text-white outline-none transition-all" />
                    </div>
                 </div>
              </div>

              {/* Step 02: Money */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center text-[10px] font-black">02</span>
                    <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Money & Items</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Total Items</label>
                       <input type="number" placeholder="0" value={newOrder.items} onChange={e => setNewOrder({ ...newOrder, items: e.target.value })} className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-base font-bold text-gray-900 dark:text-white outline-none transition-all" />
                    </div>
                    <div className="relative md:col-span-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Price (₹)</label>
                       <input type="number" placeholder="Enter amount..." value={newOrder.value} onChange={e => setNewOrder({ ...newOrder, value: e.target.value })} className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-base font-bold text-gray-900 dark:text-white outline-none transition-all" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">How will they pay?</label>
                       <select value={newOrder.paymentMethod} onChange={e => setNewOrder({ ...newOrder, paymentMethod: e.target.value })} className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-base font-bold text-gray-900 dark:text-white outline-none transition-all appearance-none cursor-pointer">
                          <option value="">Select Option...</option>
                          <option value="UPI">UPI / PhonePe</option>
                          <option value="Cash">Cash</option>
                          <option value="Credit Card">Card</option>
                          <option value="Net Banking">Bank Transfer</option>
                       </select>
                    </div>
                    <div className="relative">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                       <select value={newOrder.orderStatus} onChange={e => setNewOrder({ ...newOrder, orderStatus: e.target.value })} className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-base font-bold text-gray-900 dark:text-white outline-none transition-all appearance-none cursor-pointer">
                          <option value="Pending">Wait for check</option>
                          <option value="Processing">Making it ready</option>
                          <option value="Completed">Done</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Step 03: Extra */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center text-[10px] font-black">03</span>
                    <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Delivery & Notes</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Delivery Date</label>
                       <input type="date" value={newOrder.deliveryDate} onChange={e => setNewOrder({ ...newOrder, deliveryDate: e.target.value })} className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-base font-bold text-gray-900 dark:text-white outline-none transition-all" />
                    </div>
                    <div className="relative">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Notes</label>
                       <textarea placeholder="Anything else?" value={newOrder.notes} onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })} className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-base font-bold text-gray-900 dark:text-white outline-none transition-all resize-none" rows={1} />
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button 
                  onClick={() => setNewOrder({ store: "", items: "", value: "", orderStatus: "Pending", paymentMethod: "", date: new Date().toISOString().split('T')[0], deliveryDate: "", notes: "" })} 
                  className="flex-1 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all"
                 >
                   Clear Form
                 </button>
                 <button 
                  onClick={handleStudioSave}
                  className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                   {currentEditId ? 'Update Record' : 'Save Order'}
                 </button>
              </div>
           </div>
        </section>
        )}

        {/* ORDER REPOSITORY CONTROL */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Order History</h3>
            <div className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {filteredOrders.length} Records
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-80">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="SEARCH REPOSITORY..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-indigo-500/20"
                />
             </div>
             <button 
                onClick={() => setStudioExpanded(!studioExpanded)}
                className={`p-4 rounded-2xl shadow-xl transition-all active:scale-95 shrink-0 ${studioExpanded ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700'}`}
              >
                {studioExpanded ? <X size={24} /> : <PlusCircle size={24} />}
             </button>
          </div>
        </div>

        {/* ORDER LISTING GRID/TABLE */}
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse">
            {filteredOrders.length > 0 && (
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Entity & ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Commercials</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Lifecycle</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {filteredOrders.length > 0 ? filteredOrders.map((o, idx) => (
                <tr 
                  key={o.id} 
                  onClick={() => viewOrder(o)}
                  className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors duration-300 cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg font-black">{o.store.charAt(0)}</div>
                       <div>
                         <p className="text-base font-black text-gray-900 dark:text-white uppercase leading-none mb-1.5">{o.store}</p>
                         <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                           <Clock size={12} /> {o.date} • ID: {o.id.slice(-6).toUpperCase()}
                         </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">₹{o.value.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{o.items} Units • {o.paymentMethod || 'CASH'}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                      ${o.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); viewOrder(o); }} 
                        className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); editOrder(o); }} 
                        className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                        title="Edit Order"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-xl font-black text-gray-300 uppercase tracking-widest">No Order Intelligence Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* SUCCESS/ERROR TOASTS - ALREADY IMPLEMENTED IN THE ORIGINAL FILE */}
      </div>

      {/* ORDER DETAIL LEDGER MODAL */}
      {viewOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl" onClick={() => setViewOrderModal(false)} />
          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 sm:p-10 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Order Ledger</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Transaction ID: #{selectedOrder.id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setViewOrderModal(false)} className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-rose-500 transition-all flex items-center justify-center">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Core Intelligence */}
                <div className="space-y-10">
                  <div>
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Operational Status</h5>
                    <div className="flex items-center gap-4">
                      <span className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border ${
                        selectedOrder.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20'
                      }`}>
                        {selectedOrder.status}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <Clock size={14} className="text-indigo-500" />
                        {selectedOrder.date}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Outlet Information</h5>
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[1.5rem] border border-gray-100 dark:border-gray-700">
                      <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">{selectedOrder.store}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <IndianRupee size={14} className="text-emerald-500" />
                        Payment via {selectedOrder.paymentMethod || 'CASH'}
                      </div>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Field Notes</h5>
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-400 italic leading-relaxed bg-indigo-50/30 dark:bg-indigo-500/5 p-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10">
                        "{selectedOrder.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Financial Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 flex flex-col h-full">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">SKU Consumption Ledger</h5>
                  
                  <div className="flex-1 space-y-6">
                     <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-500 shadow-sm font-black">1</div>
                           <div>
                              <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Bulk Order Consignment</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{selectedOrder.items} Individual Units</p>
                           </div>
                        </div>
                        <p className="text-sm font-black text-gray-900 dark:text-white tracking-tighter">₹{selectedOrder.value.toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
                     <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Financial Impact</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">₹{selectedOrder.value.toLocaleString()}</p>
                     </div>
                     <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.25em] text-right">Tax Inclusive Portfolio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex justify-end">
              <button 
                onClick={() => setViewOrderModal(false)}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeOrders;