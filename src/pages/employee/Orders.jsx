// Import React hooks for state management
import React, { useState, useEffect } from "react";
// Import Lucide React icons for UI components
import {
  ShoppingBag,    // Icon for orders stats
  IndianRupee,   // Icon for revenue stats
  TrendingUp,     // Icon for growth indicator
  PlusCircle,     // Icon for create order button
  Search,         // Icon for search input
  Trash2,         // Icon for delete action
  Eye,           // Icon for view action
  Edit,           // Icon for edit action
  Calendar,       // Icon for date filters
  Moon,          // Icon for dark mode toggle
  Sun,            // Icon for light mode toggle
  BarChart,       // Icon for sales by store
  LineChart,      // Icon for weekly/monthly revenue
  PieChart,       // Icon for orders by status
  Store,          // Icon for top stores
  UserCheck       // Icon for sales executive
} from "lucide-react";
// Import theme context for global dark mode
import { useTheme } from "../../context/ThemeContext";

// Import Chart.js components for data visualization
import {
  Chart as ChartJS,    // Main Chart.js library
  CategoryScale,       // Scale for categorical data
  LinearScale,         // Scale for numerical data
  BarElement,          // Bar chart element
  LineElement,         // Line chart element
  PointElement,        // Point element for line charts
  Tooltip,             // Chart tooltips
  Legend              // Chart legends
} from "chart.js";

// Import React Chart.js components
import { Bar, Line } from "react-chartjs-2";

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,       // Register category scale
  LinearScale,         // Register linear scale
  BarElement,          // Register bar element
  LineElement,         // Register line element
  PointElement,        // Register point element
  Tooltip,             // Register tooltip
  Legend              // Register legend
);

// Main Employee Orders Component
const EmployeeOrders = () => {

  // Set target revenue goal
  const target = 350000;

  // Use global theme context
  const { isDarkMode, toggleTheme } = useTheme();

  // State variables for component functionality
  const [search,setSearch] = useState("");                    // Search query state
  const [showModal,setShowModal] = useState(false);           // Modal visibility state
  const [success,setSuccess] = useState(false);              // Success message state
  const [activityFilter,setActivityFilter] = useState("all"); // Activity filter state
  const [activeTab,setActiveTab] = useState("salesByStore"); // Active tab state
  const [lastAction,setLastAction] = useState("");         // Track last action (create/update)
  const [validationError,setValidationError] = useState(false); // Validation error state
  const [selectedOrder,setSelectedOrder] = useState(null);   // Selected order for viewing
  const [viewOrderModal,setViewOrderModal] = useState(false); // View order modal state
  const [editModal,setEditModal] = useState(false);         // Edit modal state
  const [editingOrder,setEditingOrder] = useState(null);      // Order being edited
  const [newOrder,setNewOrder] = useState({
    store:"",      // Store name field
    items:"",       // Number of items field
    value:"",       // Order value field
    salesExecutive:"", // Sales Executive/Employee field
    storeLocation:"", // Store Location field
    orderStatus:"Pending", // Order Status field
    paymentStatus:"Pending", // Payment Status field
    paymentMethod:"", // Payment Method field
    date: new Date().toISOString().split('T')[0], // Order date field - auto-filled with today's date
    deliveryDate:"", // Delivery Date field
    priority:"Medium", // Priority field
    orderSource:"", // Order Source field
    notes:"" // Notes field
  });

  // Auto-navigation effect - always running
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

  // Initial orders data with sample orders
  const [orders,setOrders] = useState([
    { id:"ORD-892", store:"Reliance Fresh", items:12, value:14200, status:"Confirmed", date:"2024-03-13" },
    { id:"ORD-891", store:"Global Mart", items:5, value:6800, status:"Pending", date:"2024-03-13" },
    { id:"ORD-890", store:"Daily Needs", items:23, value:32500, status:"Confirmed", date:"2024-03-12" },
    { id:"ORD-889", store:"Super Market", items:8, value:9200, status:"Confirmed", date:"2024-03-11" },
    { id:"ORD-888", store:"City Store", items:15, value:18900, status:"Pending", date:"2024-03-10" }
  ]);

  // Calculate total sales from all orders
  const totalSales = orders.reduce((a,b)=>a+b.value,0);
  // Calculate progress percentage towards target
  const progress = Math.min((totalSales/target)*100,100);

  // Function to filter orders based on search and activity filter
  const getFilteredOrders = () => {
    const today = new Date();
    // Filter orders by search query (store name or order ID)
    const filteredBySearch = orders.filter(
      o =>
        o.store.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
    );

    // Apply activity filter
    if (activityFilter === "daily") {
      return filteredBySearch.filter(o => o.date === today.toISOString().split('T')[0]);
    } else if (activityFilter === "weekly") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return filteredBySearch.filter(o => new Date(o.date) >= weekAgo);
    }
    return filteredBySearch;
  };

  // Get filtered orders for display
  const filteredOrders = getFilteredOrders();

  // Function to toggle order status between Confirmed and Pending
  const toggleStatus = id => {
    setOrders(
      orders.map(o =>
        o.id===id
          ? {...o,status:o.status==="Confirmed"?"Pending":"Confirmed"}
          :o
      )
    );
  };

  // Function to delete an order by ID
  const deleteOrder = id => {
    setOrders(orders.filter(o=>o.id!==id));
  };

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
      salesExecutive: order.salesExecutive || "",
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
  const updateOrder = () => {
    console.log('updateOrder called', editingOrder);
    
    // Reset any previous validation errors
    setValidationError(false);
    
    // Validate that all required fields are filled (only check fields that are actually in form)
    if (!editingOrder.store || !editingOrder.items || !editingOrder.value || !editingOrder.salesExecutive || !editingOrder.paymentMethod) {
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

    // Update order object with all fields
    const updatedOrder = {
      ...editingOrder,
      store: editingOrder.store,
      items: itemsNum,
      value: valueNum,
      salesExecutive: editingOrder.salesExecutive,
      paymentMethod: editingOrder.paymentMethod,
      date: editingOrder.date || new Date().toISOString().split('T')[0],
      deliveryDate: editingOrder.deliveryDate,
      notes: editingOrder.notes,
      status: "Pending"
    };

    console.log('Updating order:', updatedOrder);
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
    setTimeout(()=>{
      setSuccess(false);
      setLastAction("");
    },3000);
  };
  const createOrder = () => {
    console.log('createOrder called', newOrder);
    
    // Reset any previous validation errors
    setValidationError(false);
    
    // Validate that all required fields are filled (only check fields that are actually in form)
    if (!newOrder.store || !newOrder.items || !newOrder.value || !newOrder.salesExecutive || !newOrder.paymentMethod) {
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

    // Create new order object with all fields
    const order = {
      id:"ORD-"+Math.floor(Math.random()*1000),  // Generate unique order ID
      store:newOrder.store,                      // Store name from form
      items:itemsNum,                           // Number of items
      value:valueNum,                            // Order value
      salesExecutive:newOrder.salesExecutive,        // Sales Executive/Employee
      storeLocation:newOrder.storeLocation,          // Store Location
      orderStatus:newOrder.orderStatus,             // Order Status
      paymentStatus:newOrder.paymentStatus,          // Payment Status
      paymentMethod:newOrder.paymentMethod,          // Payment Method
      date:newOrder.date || new Date().toISOString().split('T')[0], // Use form date or today's date
      deliveryDate:newOrder.deliveryDate,            // Delivery Date
      priority:newOrder.priority,                    // Priority
      orderSource:newOrder.orderSource,              // Order Source
      notes:newOrder.notes,                         // Notes
      status:newOrder.orderStatus || "Pending"      // Status for display
    };

    console.log('Creating order:', order);
    // Add new order to beginning of orders array
    setOrders(prevOrders => [order, ...prevOrders]);
    // Close modal after successful creation
    setShowModal(false);
    // Reset form fields
    setNewOrder({
      store:"",
      items:"",
      value:"",
      salesExecutive:"",
      storeLocation:"",
      orderStatus:"Pending",
      paymentStatus:"Pending",
      paymentMethod:"",
      date: new Date().toISOString().split('T')[0],
      deliveryDate:"",
      priority:"Medium",
      orderSource:"",
      notes:""
    });
    // Set last action to create
    setLastAction("create");
    // Show success message
    setSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(()=>{
      setSuccess(false);
      setLastAction("");
    },3000);
  };

  // Dynamic Sales by Store data - calculates total sales per store
  const getStoreSalesData = () => {
    const storeSales = {}; // Initialize empty object for store sales
    orders.forEach(order => {
      if (storeSales[order.store]) {
        storeSales[order.store] += order.value; // Add to existing store total
      } else {
        storeSales[order.store] = order.value; // Initialize store total
      }
    });
    return storeSales;
  };

  const storeSalesData = getStoreSalesData();
  
  // Bar chart configuration for sales by store
  const barData = {
    labels: Object.keys(storeSalesData), // Store names as labels
    datasets:[
      {
        label:"Sales",                    // Dataset label
        data: Object.values(storeSalesData), // Sales values as data
        backgroundColor:"#3b82f6"         // Blue color for bars
      }
    ]
  };

  // Dynamic Weekly Revenue data - calculates revenue by day of week
  const getWeeklyRevenueData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekData = [0, 0, 0, 0, 0, 0, 0]; // Initialize week data array
    
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const dayOfWeek = orderDate.getDay(); // Get day index (0-6)
      weekData[dayOfWeek] += order.value; // Add order value to corresponding day
    });
    
    return weekData;
  };

  const weeklyRevenueData = getWeeklyRevenueData();
  
  // Line chart configuration for weekly revenue
  const lineData = {
    labels:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], // Day labels
    datasets:[
      {
        label:"Weekly Revenue",    // Dataset label
        data:weeklyRevenueData,    // Revenue data per day
        borderColor:"#6366f1",    // Indigo color for line
        tension:0.4              // Curve tension for smooth line
      }
    ]
  };

  // Orders by Status data
  const getOrdersByStatusData = () => {
    const statusData = {};
    orders.forEach(order => {
      if (statusData[order.status]) {
        statusData[order.status] += 1;
      } else {
        statusData[order.status] = 1;
      }
    });
    return statusData;
  };

  const ordersByStatusData = getOrdersByStatusData();
  
  // Pie chart configuration for orders by status
  const pieData = {
    labels: Object.keys(ordersByStatusData),
    datasets:[
      {
        data: Object.values(ordersByStatusData),
        backgroundColor: [
          "#3b82f6", // Blue for Confirmed
          "#f97316", // Orange for Pending
          "#10b981", // Green for Completed
          "#ef4444", // Red for Cancelled
        ]
      }
    ]
  };

  // Monthly Revenue data
  const getMonthlyRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthData = new Array(12).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const month = orderDate.getMonth();
      monthData[month] += order.value;
    });
    
    return monthData;
  };

  const monthlyRevenueData = getMonthlyRevenueData();
  
  // Area chart configuration for monthly revenue
  const areaData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets:[
      {
        label:"Monthly Revenue",
        data: monthlyRevenueData,
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "#6366f1",
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Top Stores data
  const getTopStoresData = () => {
    const storeSales = getStoreSalesData();
    const sortedStores = Object.entries(storeSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    return {
      labels: sortedStores.map(([store]) => store),
      data: sortedStores.map(([,sales]) => sales)
    };
  };

  const topStoresData = getTopStoresData();
  
  // Horizontal bar chart for top stores
  const topStoresChartData = {
    labels: topStoresData.labels,
    datasets:[
      {
        label:"Top Stores",
        data: topStoresData.data,
        backgroundColor: "#10b981"
      }
    ]
  };

  // Sales Executive Performance data
  const getSalesExecutiveData = () => {
    const executiveData = {};
    orders.forEach(order => {
      if (order.salesExecutive) {
        if (executiveData[order.salesExecutive]) {
          executiveData[order.salesExecutive] += order.value;
        } else {
          executiveData[order.salesExecutive] = order.value;
        }
      }
    });
    return executiveData;
  };

  const salesExecutiveData = getSalesExecutiveData();
  
  // Bar chart for sales executive performance
  const executiveChartData = {
    labels: Object.keys(salesExecutiveData),
    datasets:[
      {
        label:"Sales Executive Performance",
        data: Object.values(salesExecutiveData),
        backgroundColor: "#f59e0b"
      }
    ]
  };

  // Main render method
  return (

    // Main container with background and padding
    <div className={`${isDarkMode ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-800"} min-h-screen p-4 sm:p-8 font-sans transition-colors duration-300`}>
      
      {/* Success Message - shows when order is created or updated successfully */}
      {success && (
        <div className="fixed top-6 right-6 bg-emerald-500/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce flex items-center gap-3 border border-emerald-400/20">
          <div className="bg-white/20 p-1.5 rounded-full"><TrendingUp size={16} /></div>
          <span className="font-medium">{lastAction === "update" ? "Order Updated Successfully" : "Order Created Successfully"}</span>
        </div>
      )}

      {/* Validation Error Message - shows when validation fails */}
      {validationError && (
        <div className="fixed top-6 right-6 bg-rose-500/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce flex items-center gap-3 border border-rose-400/20">
          <span className="text-xl">⚠️</span>
          <span className="font-medium">{validationError}</span>
        </div>
      )}

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
            onClick={()=>{
              setShowModal(true);
              setNewOrder({
                store:"",
                items:"",
                value:"",
                salesExecutive:"",
                storeLocation:"",
                orderStatus:"Pending",
                paymentStatus:"Pending",
                paymentMethod:"",
                date: new Date().toISOString().split('T')[0],
                deliveryDate:"",
                priority:"Medium",
                orderSource:"",
                notes:""
              });
              setValidationError(false);
            }}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 font-semibold tracking-wide w-full sm:w-auto justify-center"
          >
            <PlusCircle size={20} className="mr-2"/>
            Create Order
          </button>
        </div>

      </div>

      {/* Statistics Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

        {/* Revenue Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"} group-hover:scale-110 transition-transform duration-300`}>
            <ShoppingBag size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Revenue
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            ₹{totalSales.toLocaleString()}
          </h2>
        </div>

        {/* Total Orders Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
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

        {/* Today's Orders Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600"} group-hover:scale-110 transition-transform duration-300`}>
            <Calendar size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Today's Orders
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {orders.filter(o => o.date === new Date().toISOString().split('T')[0]).length}
          </h2>
        </div>

        {/* Pending Orders Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"} group-hover:scale-110 transition-transform duration-300`}>
            <ShoppingBag size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Pending Orders
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {orders.filter(o => o.status === "Pending").length}
          </h2>
        </div>

        {/* Completed Orders Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-600"} group-hover:scale-110 transition-transform duration-300`}>
            <ShoppingBag size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Completed Orders
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {orders.filter(o => o.status === "Confirmed").length}
          </h2>
        </div>

        {/* Average Order Value Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"} group-hover:scale-110 transition-transform duration-300`}>
            <IndianRupee size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Average Order Value
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            ₹{orders.length > 0 ? Math.round(totalSales / orders.length).toLocaleString() : 0}
          </h2>
        </div>

        {/* Active Stores Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-pink-500/20 text-pink-400" : "bg-pink-100 text-pink-600"} group-hover:scale-110 transition-transform duration-300`}>
            <ShoppingBag size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Active Stores
          </p>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {[...new Set(orders.map(o => o.store))].length}
          </h2>
        </div>

        {/* Target Progress Card */}
        <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700" : "bg-white border-slate-100"} p-5 rounded-3xl shadow-sm border backdrop-blur-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"} group-hover:scale-110 transition-transform duration-300`}>
            <TrendingUp size={24} className="stroke-[2.5]" />
          </div>
          <p className={`text-xs font-bold tracking-wider uppercase mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Target Progress
          </p>
          <div className="flex flex-col gap-1 w-full">
            <div className={`w-full bg-slate-200 rounded-full h-2.5 ${isDarkMode ? "bg-slate-700" : ""} overflow-hidden`}>
              <div 
                className={`h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 relative transition-all duration-1000 ease-out`} 
                style={{width: `${progress}%`}}
              >
                <div className="absolute top-0 bottom-0 left-0 right-0 w-full animate-pulse bg-white/20" style={{ transform: 'skewX(-20deg)' }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-bold mt-1">
              <span className="text-blue-500">{progress.toFixed(1)}%</span>
              <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>Target: ₹{(target/1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tabbed Charts Section */}
      <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700/50" : "bg-white border-slate-100"} rounded-3xl shadow-sm border backdrop-blur-xl p-6 sm:p-8 mb-10 transition-colors duration-300`}>
        
        {/* Tab Navigation */}
        <div className={`flex flex-wrap gap-2 mb-8 pb-4 border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-100"}`}>
          {[
            { id: "salesByStore", label: "Sales", icon: <BarChart size={16} /> },
            { id: "weeklyRevenue", label: "Weekly", icon: <LineChart size={16} /> },
            { id: "ordersByStatus", label: "Status", icon: <PieChart size={16} /> },
            { id: "monthlyRevenue", label: "Monthly", icon: <LineChart size={16} /> },
            { id: "topStores", label: "Top Stores", icon: <Store size={16} /> },
            { id: "salesExecutive", label: "Executive", icon: <UserCheck size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-105"
                  : isDarkMode
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px] max-h-[350px] w-full animate-[fadeIn_0.5s_ease-out]">
          {activeTab === "salesByStore" && (
            <div className="h-full flex flex-col">
              <h3 className={`font-extrabold mb-4 text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Sales by Store</h3>
              <div className="flex-1 min-h-[250px]">
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
          
          {activeTab === "weeklyRevenue" && (
            <div className="h-full flex flex-col">
              <h3 className={`font-extrabold mb-4 text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Weekly Revenue</h3>
              <div className="flex-1 min-h-[250px]">
                <Line data={lineData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
          
          {activeTab === "ordersByStatus" && (
            <div className="h-full flex flex-col">
              <h3 className={`font-extrabold mb-4 text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Orders by Status</h3>
              <div className="flex-1 min-h-[250px] max-w-sm mx-auto w-full">
                <Bar data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
          
          {activeTab === "monthlyRevenue" && (
            <div className="h-full flex flex-col">
              <h3 className={`font-extrabold mb-4 text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Monthly Revenue</h3>
              <div className="flex-1 min-h-[250px]">
                <Line data={areaData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
          
          {activeTab === "topStores" && (
            <div className="h-full flex flex-col">
              <h3 className={`font-extrabold mb-4 text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Top Stores</h3>
              <div className="flex-1 min-h-[250px]">
                <Bar data={topStoresChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
          
          {activeTab === "salesExecutive" && (
            <div className="h-full flex flex-col">
              <h3 className={`font-extrabold mb-4 text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>Sales Executive Performance</h3>
              <div className="flex-1 min-h-[250px]">
                <Bar data={executiveChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Orders Table Section */}
      <div className={`${isDarkMode ? "bg-[#1e293b]/80 border-slate-700/50" : "bg-white border-slate-100"} rounded-3xl shadow-sm border backdrop-blur-xl overflow-hidden transition-colors duration-300`}>
        {/* Table Header with Filters and Search */}
        <div className={`p-6 sm:p-8 flex flex-col lg:flex-row justify-between gap-6 border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-100"}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <h3 className={`font-black tracking-tight text-xl ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Order History
            </h3>
            {/* Activity Filter Buttons */}
            <div className={`flex gap-2 p-1.5 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-slate-100"}`}>
              <button
                onClick={() => setActivityFilter("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  activityFilter === "all"
                    ? "bg-white shadow-sm text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                    : isDarkMode 
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActivityFilter("weekly")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                  activityFilter === "weekly"
                    ? "bg-white shadow-sm text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                    : isDarkMode 
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Calendar size={14} />
                Weekly
              </button>
              <button
                onClick={() => setActivityFilter("daily")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                  activityFilter === "daily"
                    ? "bg-white shadow-sm text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                    : isDarkMode 
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Calendar size={14} />
                Daily
              </button>
            </div>
          </div>
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} size={18}/>
            <input
              placeholder="Search orders..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                isDarkMode 
                  ? "bg-slate-800/50 text-white placeholder-slate-500 border border-slate-700" 
                  : "bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:shadow-sm"
              }`}
            />
          </div>
        </div>
        {/* Orders Table - Mobile Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            {/* Table Header */}
            <thead className={`text-xs uppercase tracking-widest font-bold ${isDarkMode ? "text-slate-400 bg-slate-800/50" : "text-slate-500 bg-slate-50"}`}>
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Store</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Sales Executive</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {/* Map through filtered orders and render each row */}
              {filteredOrders.map((o, index)=>(
                <tr key={o.id} className={`border-b last:border-0 transition-colors duration-200 ${isDarkMode ? "border-slate-700/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50/80"}`} style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}>
                  <td className={`px-6 py-4 font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{o.id}</td>
                  <td className={`px-6 py-4 font-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                        {o.store.charAt(0)}
                      </div>
                      {o.store}
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{o.items}</td>
                  <td className={`px-6 py-4 font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>₹{o.value.toLocaleString()}</td>
                  <td className={`px-6 py-4 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{o.salesExecutive || "N/A"}</td>
                  <td className="px-6 py-4 text-center">
                    {/* Status Toggle Button */}
                    <button
                      onClick={()=>toggleStatus(o.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-300 hover:scale-105 ${
                        o.status==="Confirmed"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm"
                          : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-sm"
                      }`}
                    >
                      {o.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      {/* Edit Order Button */}
                      <button 
                        onClick={() => editOrder(o)}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isDarkMode ? "bg-slate-800 text-amber-400 hover:bg-amber-400/20" : "bg-slate-100 text-amber-600 hover:bg-amber-100"}`}
                        title="Edit Order"
                      >
                        <Edit size={16}/>
                      </button>
                      {/* View Order Button */}
                      <button 
                        onClick={() => viewOrder(o)}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isDarkMode ? "bg-slate-800 text-blue-400 hover:bg-blue-400/20" : "bg-slate-100 text-blue-600 hover:bg-blue-100"}`}
                        title="View Order"
                      >
                        <Eye size={16}/>
                      </button>
                      {/* Delete Order Button */}
                      <button
                        onClick={()=>deleteOrder(o.id)}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isDarkMode ? "bg-slate-800 text-rose-400 hover:bg-rose-400/20" : "bg-slate-100 text-rose-600 hover:bg-rose-100"}`}
                        title="Delete Order"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0 animate-[fadeIn_0.2s_ease-out]">
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
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                }`}
              >
                ×
              </button>
            </div>
            {/* Modal Form */}
            <div className="space-y-4">
              <input
                placeholder="Store Name"
                value={newOrder.store}
                onChange={e=>setNewOrder({...newOrder,store:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <input
                placeholder="Items"
                type="number"
                value={newOrder.items}
                onChange={e=>setNewOrder({...newOrder,items:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <input
                placeholder="Order Value"
                type="number"
                value={newOrder.value}
                onChange={e=>setNewOrder({...newOrder,value:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <input
                placeholder="Sales Executive / Employee"
                value={newOrder.salesExecutive}
                onChange={e=>setNewOrder({...newOrder,salesExecutive:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <select
                value={newOrder.paymentMethod}
                onChange={e=>setNewOrder({...newOrder,paymentMethod:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800"
                }`}
              >
                <option value="">Select Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cheque">Cheque</option>
              </select>
              <input
                placeholder="Order Date"
                type="date"
                value={newOrder.date}
                onChange={e=>setNewOrder({...newOrder,date:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <input
                placeholder="Delivery Date"
                type="date"
                value={newOrder.deliveryDate}
                onChange={e=>setNewOrder({...newOrder,deliveryDate:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <textarea
                placeholder="Notes"
                value={newOrder.notes}
                onChange={e=>setNewOrder({...newOrder,notes:e.target.value})}
                rows={3}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
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
      )}

      {/* Edit Order Modal */}
      {editModal && editingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0 animate-[fadeIn_0.2s_ease-out]">
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
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                }`}
              >
                ×
              </button>
            </div>
            {/* Edit Form */}
            <div className="space-y-4">
              <input
                placeholder="Store Name"
                value={editingOrder.store}
                onChange={e=>setEditingOrder({...editingOrder,store:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <input
                placeholder="Items"
                type="number"
                value={editingOrder.items}
                onChange={e=>setEditingOrder({...editingOrder,items:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <input
                placeholder="Order Value"
                type="number"
                value={editingOrder.value}
                onChange={e=>setEditingOrder({...editingOrder,value:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <input
                placeholder="Sales Executive / Employee"
                value={editingOrder.salesExecutive}
                onChange={e=>setEditingOrder({...editingOrder,salesExecutive:e.target.value})}
                className={`w-full border-2 p-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                }`}
              />
              <select
                value={editingOrder.paymentMethod}
                onChange={e=>setEditingOrder({...editingOrder,paymentMethod:e.target.value})}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-slate-800"
                }`}
              >
                <option value="">Select Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cheque">Cheque</option>
              </select>
              <input
                placeholder="Order Date"
                type="date"
                value={editingOrder.date}
                onChange={e=>setEditingOrder({...editingOrder,date:e.target.value})}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-slate-800 placeholder-gray-400"
                }`}
              />
              <input
                placeholder="Delivery Date"
                type="date"
                value={editingOrder.deliveryDate}
                onChange={e=>setEditingOrder({...editingOrder,deliveryDate:e.target.value})}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-slate-800 placeholder-gray-400"
                }`}
              />
              <textarea
                placeholder="Notes"
                value={editingOrder.notes}
                onChange={e=>setEditingOrder({...editingOrder,notes:e.target.value})}
                rows={3}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-slate-800 placeholder-gray-400"
                }`}
              />
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
      )}

      {/* View Order Modal */}
      {viewOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0 animate-[fadeIn_0.2s_ease-out]">
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
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
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
                {/* Sales Executive */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Sales Exec</p>
                  <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{selectedOrder.salesExecutive || "N/A"}</p>
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