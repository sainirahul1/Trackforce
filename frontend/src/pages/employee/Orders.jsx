// Import React hooks for state management
import React, { useState, useEffect } from "react";
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
  FileText        // Professional View Icon
} from "lucide-react";
// Import theme context for global dark mode
import { useTheme } from "../../context/ThemeContext";
import { getOrders, createOrderAPI, updateOrderAPI } from "../../services/orderService";

// Main Employee Orders Component
const EmployeeOrders = () => {
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

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        // Map backend orders to frontend format
        setOrders(data.map(o => {
          const orderDate = new Date(o.timestamp || o.createdAt);
          const isValidDate = !isNaN(orderDate.getTime());
          return {
            ...o,
            id: o._id,
            store: o.storeName,
            items: Array.isArray(o.items) ? o.items.reduce((acc, item) => acc + item.quantity, 0) : (o.items || 0),
            value: o.totalAmount,
            status: o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : 'Pending',
            date: isValidDate ? orderDate.toISOString().split('T')[0] : '---',
            paymentMethod: o.paymentMethod || "",
            deliveryDate: o.deliveryDate || "",
            orderStatus: o.status || "Pending",
            notes: o.notes || ""
          };
        }));
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

  // Function to edit an existing order
  const editOrder = order => {
    setEditingOrder(order);    // Set order being edited
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
    setEditModal(true);   // Open edit modal
  };

  // Function to update an existing order
  const updateOrder = async () => {
    console.log('updateOrder called', editingOrder);

    // Reset any previous validation errors
    setValidationError(false);

    // Validate that all required fields are filled (only check fields that are actually in form)
    if (!editingOrder.store || !editingOrder.items || !editingOrder.value || !editingOrder.paymentMethod) {
      console.log('Validation failed');
      setValidationError("Please fill in all required fields");
      setTimeout(() => setValidationError(false), 3000);
      return;
    }

    // Validate that items and value are valid positive numbers
    const itemsNum = Number(editingOrder.items);
    const valueNum = Number(editingOrder.value);

    if (isNaN(itemsNum) || isNaN(valueNum) || itemsNum <= 0 || valueNum <= 0) {
      console.log('Invalid numbers');
      setValidationError("Please enter valid numbers for items and value");
      setTimeout(() => setValidationError(false), 3000);
      return;
    }

    try {
      // Data payload for backend update
      const apiUpdateData = {
        storeName: editingOrder.store,
        items: itemsNum,
        totalAmount: valueNum,
        paymentMethod: editingOrder.paymentMethod,
        deliveryDate: editingOrder.deliveryDate,
        notes: editingOrder.notes,
        status: (editingOrder.orderStatus || editingOrder.status || "pending").toLowerCase()
      };

      const updated = await updateOrderAPI(editingOrder.id, apiUpdateData);
      console.log('API responded with updated order:', updated);

      const orderDate = new Date(updated.timestamp || updated.createdAt);

      // Update order object with all fields
      const updatedOrder = {
        ...editingOrder,
        store: updated.storeName,
        items: itemsNum,
        value: updated.totalAmount,
        salesExecutive: editingOrder.salesExecutive,
        paymentMethod: editingOrder.paymentMethod,
        date: !isNaN(orderDate.getTime()) ? orderDate.toISOString().split('T')[0] : '---',
        deliveryDate: editingOrder.deliveryDate,
        notes: editingOrder.notes,
        status: updated.status ? updated.status.charAt(0).toUpperCase() + updated.status.slice(1) : "Pending"
      };

      console.log('Updating order local state:', updatedOrder);
      // Update order in orders array
      setOrders(prevOrders =>
        prevOrders.map(o => o.id === editingOrder.id ? updatedOrder : o)
      );
      // Close modal after successful update
      setEditModal(false);
      setEditingOrder(null);
      // Set last action to update
      setLastAction("update");
      // Show success message
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setLastAction("");
      }, 3000);

    } catch (error) {
      console.error("Failed to update order:", error);
      setValidationError("Failed to update order on server");
      setTimeout(() => setValidationError(false), 3000);
    }
  };
  const createOrder = async () => {
    console.log('createOrder called', newOrder);

    // Reset any previous validation errors
    setValidationError(false);

    // Validate that all required fields are filled (only check fields that are actually in form)
    if (!newOrder.store || !newOrder.items || !newOrder.value || !newOrder.paymentMethod) {
      console.log('Validation failed');
      setValidationError("Please fill in all required fields");
      setTimeout(() => setValidationError(false), 3000);
      return;
    }

    // Validate that items and value are valid positive numbers
    const itemsNum = Number(newOrder.items);
    const valueNum = Number(newOrder.value);

    if (isNaN(itemsNum) || isNaN(valueNum) || itemsNum <= 0 || valueNum <= 0) {
      console.log('Invalid numbers');
      setValidationError("Please enter valid numbers for items and value");
      setTimeout(() => setValidationError(false), 3000);
      return;
    }

    try {
      // Create new order object for API
      const apiOrderData = {
        storeName: newOrder.store,
        items: itemsNum,
        totalAmount: valueNum,
        status: (newOrder.orderStatus || "Pending").toLowerCase(),
        paymentMethod: newOrder.paymentMethod,
        deliveryDate: newOrder.deliveryDate,
        notes: newOrder.notes
      };

      const createdOrder = await createOrderAPI(apiOrderData);
      console.log('API responded with created order:', createdOrder);

      const orderDate = new Date(createdOrder.timestamp || createdOrder.createdAt);
      
      const order = {
        ...createdOrder,
        id: createdOrder._id,
        store: createdOrder.storeName,
        items: itemsNum,
        value: createdOrder.totalAmount,
        salesExecutive: newOrder.salesExecutive,
        storeLocation: newOrder.storeLocation,
        orderStatus: newOrder.orderStatus,
        paymentStatus: newOrder.paymentStatus,
        paymentMethod: newOrder.paymentMethod,
        date: !isNaN(orderDate.getTime()) ? orderDate.toISOString().split('T')[0] : '---',
        deliveryDate: newOrder.deliveryDate,
        priority: newOrder.priority,
        orderSource: newOrder.orderSource,
        notes: newOrder.notes,
        status: createdOrder.status ? createdOrder.status.charAt(0).toUpperCase() + createdOrder.status.slice(1) : "Pending"
      };

      // Add new order to beginning of orders array
      setOrders(prevOrders => [order, ...prevOrders]);
      // Close modal after successful creation
      setShowModal(false);
    // Reset form fields
    setNewOrder({
      store: "",
      items: "",
      value: "",
      salesExecutive: "",
      storeLocation: "",
      orderStatus: "Pending",
      paymentStatus: "Pending",
      paymentMethod: "",
      date: new Date().toISOString().split('T')[0],
      deliveryDate: "",
      priority: "Medium",
      orderSource: "",
      notes: ""
    });
    // Set last action to create
    setLastAction("create");
    // Show success message
    setSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
      setLastAction("");
    }, 3000);

    } catch (error) {
      console.error("Failed to create order:", error);
      setValidationError("Failed to create order on server");
      setTimeout(() => setValidationError(false), 3000);
    }
  };



  /*
  // Sales Executive Performance data removed as per user request
  const getSalesExecutiveData = () => {
    ...
  };
  */

  // Main render method
  return (

    // Main container with background and padding
    <div className={`${isDarkMode ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-800"} min-h-screen p-4 sm:p-8 font-sans transition-colors duration-300`}>
      <div className="animate-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">

        {/* Title and Description */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight mb-2">
            Orders Dashboard
          </h1>
          <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} font-medium`}>
            Manage store orders and monitor your revenue streams
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Create Order Button */}
          <button
            onClick={() => {
              setShowModal(true);
              setNewOrder({
                store: "",
                items: "",
                value: "",
                salesExecutive: "",
                storeLocation: "",
                orderStatus: "Pending",
                paymentStatus: "Pending",
                paymentMethod: "",
                date: new Date().toISOString().split('T')[0],
                deliveryDate: "",
                priority: "Medium",
                orderSource: "",
                notes: ""
              });
              setValidationError(false);
            }}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 font-semibold tracking-wide w-full sm:w-auto justify-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Create Order
          </button>
        </div>

      </div>

      {/* Statistics Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

        {/* Revenue Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"} group-hover:scale-110 transition-transform duration-300`}>
            <IndianRupee size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Total Revenue
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            ₹{totalSales.toLocaleString()}
          </h2>
        </div>

        {/* Total Orders Card */}
        <div
          onClick={() => setStatusFilter("All")}
          className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} ${statusFilter === "All" ? "ring-2 ring-indigo-500 shadow-md" : ""} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"} group-hover:scale-110 transition-transform duration-300`}>
            <ShoppingBag size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Total Orders
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {orders.length}
          </h2>
        </div>

        {/* Pending Orders Card */}
        <div
          onClick={() => setStatusFilter("Pending")}
          className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} ${statusFilter === "Pending" ? "ring-2 ring-orange-400 shadow-md" : ""} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"} group-hover:scale-110 transition-transform duration-300`}>
            <ShoppingBag size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Total Pending
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {orders.filter(o => o.status === "Pending").length}
          </h2>
        </div>

        {/* Completed Orders Card */}
        <div
          onClick={() => setStatusFilter("Completed")}
          className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} ${statusFilter === "Completed" ? "ring-2 ring-teal-400 shadow-md" : ""} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-600"} group-hover:scale-110 transition-transform duration-300`}>
            <ShoppingBag size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Total Completed
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {orders.filter(o => o.status === "Completed").length}
          </h2>
        </div>

      </div>



      {/* Orders Table Section */}
      <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700/50" : "bg-white border-slate-100"} rounded-3xl shadow-sm border backdrop-blur-xl overflow-hidden transition-colors duration-300`}>
        {/* Table Header with Filters and Search */}
        <div className={`p-4 sm:p-6 border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-100"}`}>
          <div className="flex flex-col gap-6">
            <h3 className={`font-black tracking-tight text-lg ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Order History
            </h3>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Activity Filter Buttons */}
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Filters:</span>
                <div className={`flex items-center gap-2 p-1 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-slate-100"}`}>
                  {[
                    { id: "All", icon: <Layers size={14} /> },
                    { id: "Weekly", icon: <CalendarDays size={14} /> },
                    { id: "Daily", icon: <Clock size={14} /> }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setActivityFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 flex items-center gap-2 ${activityFilter === filter.id
                          ? "bg-white shadow-sm text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                          : isDarkMode
                            ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        }`}
                    >
                      {filter.icon}
                      <span>{filter.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1 sm:flex-initial">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-slate-500" : "text-slate-400"} pointer-events-none flex items-center`}><Search size={16} /></span>
                  <input
                    placeholder="Search Orders"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={`w-full pl-4 pr-10 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode
                        ? "bg-slate-800/50 text-white placeholder-slate-500 border border-slate-700"
                        : "bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:shadow-sm"
                      }`}
                  />
                </div>
                {/* Export Button */}
                <button
                  onClick={exportOrders}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 border ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
                    }`}
                >
                  Export ▼
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Orders Table - Mobile Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs text-left mb-2">
            {/* Table Header */}
            <thead className={`text-[10px] uppercase tracking-widest font-bold ${isDarkMode ? "text-slate-400 bg-slate-800/50" : "text-slate-500 bg-slate-50"}`}>
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {/* Map through filtered orders and render each row */}
              {filteredOrders.map((o, index) => (
                <tr key={o.id} className={`border-b last:border-0 transition-colors duration-200 ${isDarkMode ? "border-slate-700/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50/80"}`} style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}>
                  <td className={`px-4 py-3 font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{o.id}</td>
                  <td className={`px-4 py-3 font-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                        {o.store.charAt(0)}
                      </div>
                      {o.store}
                    </div>
                  </td>
                  <td className={`px-4 py-3 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{o.items}</td>
                  <td className={`px-4 py-3 font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>₹{o.value.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    {/* Status Label */}
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${o.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : o.status === "Processing"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                      }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      {/* Edit Order Button */}
                      <button
                        onClick={() => editOrder(o)}
                        className={`px-3 py-1.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-1.5 text-[11px] font-bold w-16 ${isDarkMode ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:shadow-amber-500/10" : "bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100 hover:text-amber-700"}`}
                        title="Edit Order"
                      >
                        <PenLine size={13} className="stroke-[2.5]" />
                        Edit
                      </button>
                      {/* View Order Button */}
                      <button
                        onClick={() => viewOrder(o)}
                        className={`px-3 py-1.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-1.5 text-[11px] font-bold w-16 ${isDarkMode ? "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:shadow-blue-500/10" : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-700"}`}
                        title="View Order"
                      >
                        <FileText size={13} className="stroke-[2.5]" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Success Message - shows when order is created or updated successfully */}
      {success && (
        <div className="fixed top-6 right-6 bg-emerald-500/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl z-[300] animate-bounce flex items-center gap-3 border border-emerald-400/20">
          <div className="bg-white/20 p-1.5 rounded-full"><TrendingUp size={16} /></div>
          <span className="font-medium">{lastAction === "update" ? "Order Updated Successfully" : "Order Created Successfully"}</span>
        </div>
      )}

      {/* Validation Error Message - shows when validation fails */}
      {validationError && (
        <div className="fixed top-6 right-6 bg-rose-500/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl z-[300] animate-bounce flex items-center gap-3 border border-rose-400/20">
          <span className="text-xl flex items-center"><AlertTriangle size={20} /></span>
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 sm:p-0 animate-[fadeIn_0.2s_ease-out]">
          <div className={`${isDarkMode ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-100"} rounded-3xl border shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out] relative`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center mb-6 pb-4 border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-100"}`}>
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Create Order</h2>
              {/* Close Button - prevents navigation issues */}
              <button
                onClick={() => {
                  setShowModal(false);
                  setValidationError(false); // Clear any validation errors
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  }`}
              >
                ×
              </button>
            </div>
            {/* Modal Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <input
                  placeholder="Store Name"
                  value={newOrder.store}
                  onChange={e => setNewOrder({ ...newOrder, store: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <input
                  placeholder="Items"
                  type="number"
                  value={newOrder.items}
                  onChange={e => setNewOrder({ ...newOrder, items: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <input
                  placeholder="Order Value"
                  type="number"
                  value={newOrder.value}
                  onChange={e => setNewOrder({ ...newOrder, value: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <select
                  value={newOrder.paymentMethod}
                  onChange={e => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800"
                    }`}
                >
                  <option value="">Payment Method</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">Order Date</label>
                <input
                  placeholder="Order Date"
                  type="date"
                  value={newOrder.date}
                  onChange={e => setNewOrder({ ...newOrder, date: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800"
                    }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">Delivery Date</label>
                <input
                  placeholder="Delivery Date"
                  type="date"
                  value={newOrder.deliveryDate}
                  onChange={e => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800"
                    }`}
                />
              </div>
              <div className="col-span-2">
                <textarea
                  placeholder="Notes"
                  value={newOrder.notes}
                  onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })}
                  rows={2}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
              <div className="col-span-2">
                {/* Create Order Button */}
                <button
                  onClick={createOrder}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 font-bold tracking-wide mt-2"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editModal && editingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 sm:p-0 animate-[fadeIn_0.2s_ease-out]">
          <div className={`${isDarkMode ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-100"} rounded-3xl border shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out] relative`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center mb-6 pb-4 border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-100"}`}>
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Edit Order</h2>
              {/* Close Button */}
              <button
                onClick={() => {
                  setEditModal(false);
                  setEditingOrder(null); // Clear editing order
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  }`}
              >
                ×
              </button>
            </div>
            {/* Edit Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <input
                  placeholder="Store Name"
                  value={editingOrder.store}
                  onChange={e => setEditingOrder({ ...editingOrder, store: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <input
                  placeholder="Items"
                  type="number"
                  value={editingOrder.items}
                  onChange={e => setEditingOrder({ ...editingOrder, items: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <input
                  placeholder="Order Value"
                  type="number"
                  value={editingOrder.value}
                  onChange={e => setEditingOrder({ ...editingOrder, value: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <select
                  value={editingOrder.paymentMethod}
                  onChange={e => setEditingOrder({ ...editingOrder, paymentMethod: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800"
                    }`}
                >
                  <option value="">Payment Method</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">Order Date</label>
                <input
                  placeholder="Order Date"
                  type="date"
                  value={editingOrder.date}
                  onChange={e => setEditingOrder({ ...editingOrder, date: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800"
                    }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">Delivery Date</label>
                <input
                  placeholder="Delivery Date"
                  type="date"
                  value={editingOrder.deliveryDate}
                  onChange={e => setEditingOrder({ ...editingOrder, deliveryDate: e.target.value })}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800"
                    }`}
                />
              </div>
              <div className="col-span-2">
                <textarea
                  placeholder="Notes"
                  value={editingOrder.notes}
                  onChange={e => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                  rows={2}
                  className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDarkMode
                      ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
              <div className="col-span-2">
                {/* Update Order Button */}
                <button
                  onClick={updateOrder}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 font-bold tracking-wide mt-2"
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 sm:p-0 animate-[fadeIn_0.2s_ease-out]">
          <div className={`${isDarkMode ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-100"} rounded-3xl border shadow-2xl p-6 sm:p-8 w-full max-w-sm mx-auto animate-[slideUp_0.3s_ease-out]`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center mb-6 pb-4 border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-100"}`}>
              <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Order Details</h2>
              {/* Close Button */}
              <button
                onClick={() => {
                  setViewOrderModal(false);
                  setSelectedOrder(null); // Clear selected order
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  }`}
              >
                ×
              </button>
            </div>
            {/* Order Details */}
            <div className="space-y-4 text-sm">
              {/* Order ID */}
              <div className={`bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border ${isDarkMode ? "border-slate-700/50" : "border-slate-100"}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Order ID</p>
                <p className={`text-lg font-black tracking-tight ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{selectedOrder.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Store Name */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Store</p>
                  <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{selectedOrder.store}</p>
                </div>
                {/* Order Value */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Value</p>
                  <p className={`text-sm font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>₹{selectedOrder.value.toLocaleString()}</p>
                </div>
                {/* Number of Items */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Items</p>
                  <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{selectedOrder.items}</p>
                </div>
                {/* Order Date */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Order Date</p>
                  <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{selectedOrder.date}</p>
                </div>
                {/* Payment Method */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Payment</p>
                  <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{selectedOrder.paymentMethod || "N/A"}</p>
                </div>
                {/* Delivery Date */}
                <div className="col-span-2">
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Delivery Date</p>
                  <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{selectedOrder.deliveryDate || "N/A"}</p>
                </div>
              </div>

              {/* Notes */}
              <div className={`mt-2 p-4 rounded-xl ${isDarkMode ? "bg-slate-800/30" : "bg-slate-50"} border ${isDarkMode ? "border-slate-700/30" : "border-slate-100"}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Notes</p>
                <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"} italic`}>{selectedOrder.notes || "No notes provided"}</p>
              </div>
            </div>
            {/* Close Button */}
            <div className="mt-8">
              <button
                onClick={() => {
                  setViewOrderModal(false);
                  setSelectedOrder(null); // Clear selected order
                }}
                className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-3.5 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300 font-bold tracking-wide"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeOrders;