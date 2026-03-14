// Import React hooks for state management
import React, { useState } from "react";
// Import Lucide React icons for UI components
import {
  ShoppingBag,    // Icon for orders stats
  IndianRupee,   // Icon for revenue stats
  TrendingUp,     // Icon for growth indicator
  PlusCircle,     // Icon for create order button
  Search,         // Icon for search input
  Trash2,         // Icon for delete action
  Eye,           // Icon for view action
  Calendar        // Icon for date filters
} from "lucide-react";

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
  const target = 35000;

  // State variables for component functionality
  const [search,setSearch] = useState("");                    // Search query state
  const [showModal,setShowModal] = useState(false);           // Modal visibility state
  const [success,setSuccess] = useState(false);              // Success message state
  const [activityFilter,setActivityFilter] = useState("all"); // Activity filter state
  const [validationError,setValidationError] = useState(false); // Validation error state
  const [viewOrderModal,setViewOrderModal] = useState(false); // View order modal state
  const [selectedOrder,setSelectedOrder] = useState(null);   // Selected order for viewing

  // State for new order form data
  const [newOrder,setNewOrder] = useState({
    store:"",   // Store name field
    items:"",    // Number of items field
    value:""     // Order value field
  });

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

  // Function to create a new order
  const createOrder = () => {
    console.log('createOrder called', newOrder);
    
    // Reset any previous validation errors
    setValidationError(false);
    
    // Validate that all fields are filled
    if (!newOrder.store || !newOrder.items || !newOrder.value) {
      console.log('Validation failed');
      setValidationError("Please fill in all fields");
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

    // Create new order object
    const order = {
      id:"ORD-"+Math.floor(Math.random()*1000),  // Generate unique order ID
      store:newOrder.store,                      // Store name from form
      items:itemsNum,                           // Number of items
      value:valueNum,                            // Order value
      status:"Pending",                          // Default status
      date:new Date().toISOString().split('T')[0] // Current date
    };

    console.log('Creating order:', order);
    // Add new order to beginning of orders array
    setOrders(prevOrders => [order, ...prevOrders]);
    // Close modal after successful creation
    setShowModal(false);
    // Reset form fields
    setNewOrder({store:"",items:"",value:""});
    // Show success message
    setSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(()=>{
      setSuccess(false);
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

  // Main render method
  return (

    // Main container with background and padding
    <div className="bg-slate-100 min-h-screen p-8">

      {/* Success Message - shows when order is created successfully */}
      {success && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ✅ Order Created Successfully
        </div>
      )}

      {/* Validation Error Message - shows when validation fails */}
      {validationError && (
        <div className="fixed top-6 right-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ⚠️ {validationError}
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">

        {/* Title and Description */}
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Orders Dashboard
          </h1>
          <p className="text-slate-500">
            Manage store orders and revenue
          </p>
        </div>

        {/* Create Order Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={()=>setShowModal(true)}
            className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:bg-blue-700"
          >
            <PlusCircle size={18} className="mr-2"/>
            Create Order
          </button>
        </div>

      </div>

      {/* Statistics Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {/* Total Sales Card */}
        <div className="bg-white p-6 rounded-3xl shadow">

          <IndianRupee className="text-blue-600 mb-3"/>

          <p className="text-xs text-slate-400 uppercase">
            Total Sales
          </p>

          <h2 className="text-4xl font-black">
            ₹{totalSales}
          </h2>

          <div className="flex items-center text-blue-600 text-xs mt-2">
            <TrendingUp size={14} className="mr-1"/>
            Sales Growth
          </div>

        </div>

        {/* Orders Count Card */}
        <div className="bg-white p-6 rounded-3xl shadow">

          <ShoppingBag className="text-blue-600 mb-3"/>

          <p className="text-xs text-slate-400 uppercase">
            Orders
          </p>

          <h2 className="text-4xl font-black">
            {orders.length}
          </h2>

        </div>

        {/* Target Progress Card */}
        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="font-bold mb-3">
            Target Progress
          </p>

          <div className="w-full h-3 bg-slate-200 rounded-full">

            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
              style={{width:`${progress}%`}}
            />

          </div>

          <p className="mt-2 text-sm text-slate-500">
            ₹{totalSales} / ₹{target}
          </p>

        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Sales by Store Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="font-bold mb-4">Sales by Store</h3>
          <Bar data={barData}/>
        </div>

        {/* Weekly Revenue Line Chart */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="font-bold mb-4">Weekly Revenue</h3>
          <Line data={lineData}/>
        </div>

      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-3xl shadow">

        {/* Table Header with Filters and Search */}
        <div className="p-6 flex flex-col sm:flex-row justify-between gap-4">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h3 className="font-bold text-lg">
              Order History
            </h3>
            
            {/* Activity Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setActivityFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activityFilter === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActivityFilter("weekly")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activityFilter === "weekly"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Calendar size={12} className="inline mr-1"/>
                Weekly
              </button>
              <button
                onClick={() => setActivityFilter("daily")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activityFilter === "daily"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Calendar size={12} className="inline mr-1"/>
                Daily
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">

            <Search className="absolute left-3 top-3 text-slate-400" size={16}/>

            <input
              placeholder="Search orders..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm"
            />

          </div>

        </div>

        {/* Orders Table - Mobile Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">

            {/* Table Header */}
            <thead className="text-xs text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Store</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {/* Map through filtered orders and render each row */}
              {filteredOrders.map(o=>(
                <tr key={o.id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold">{o.id}</td>
                  <td className="px-6 py-4">{o.store}</td>
                  <td className="px-6 py-4">{o.items}</td>
                  <td className="px-6 py-4 font-bold">₹{o.value}</td>

                  <td className="px-6 py-4">
                    {/* Status Toggle Button */}
                    <button
                      onClick={()=>toggleStatus(o.id)}
                      className={`px-3 py-1 rounded-lg text-xs ${
                        o.status==="Confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {o.status}
                    </button>
                  </td>

                  <td className="px-6 py-4 flex gap-3">
                    {/* View Order Button */}
                    <button 
                      onClick={() => viewOrder(o)}
                      className="text-blue-600"
                    >
                      <Eye size={18}/>
                    </button>

                    {/* Delete Order Button */}
                    <button
                      onClick={()=>deleteOrder(o.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 sm:mx-0">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Order</h2>
              {/* Close Button - prevents navigation issues */}
              <button
                onClick={() => {
                  setShowModal(false);
                  setValidationError(false); // Clear any validation errors
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
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
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                placeholder="Items"
                type="number"
                value={newOrder.items}
                onChange={e=>setNewOrder({...newOrder,items:e.target.value})}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                placeholder="Order Value"
                type="number"
                value={newOrder.value}
                onChange={e=>setNewOrder({...newOrder,value:e.target.value})}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Create Order Button */}
              <button
                onClick={createOrder}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Order
              </button>
            </div>

          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 sm:mx-0">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order Details</h2>
              {/* Close Button */}
              <button
                onClick={() => {
                  setViewOrderModal(false);
                  setSelectedOrder(null); // Clear selected order
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              {/* Order ID */}
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="text-lg font-semibold">{selectedOrder.id}</p>
              </div>

              {/* Store Name */}
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500 mb-1">Store Name</p>
                <p className="text-lg font-semibold">{selectedOrder.store}</p>
              </div>

              {/* Number of Items */}
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500 mb-1">Number of Items</p>
                <p className="text-lg font-semibold">{selectedOrder.items}</p>
              </div>

              {/* Order Value */}
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500 mb-1">Order Value</p>
                <p className="text-lg font-semibold text-blue-600">₹{selectedOrder.value}</p>
              </div>

              {/* Order Status */}
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500 mb-1">Order Status</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    selectedOrder.status === "Confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Order Date */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Order Date</p>
                <p className="text-lg font-semibold">{selectedOrder.date}</p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6">
              <button
                onClick={() => {
                  setViewOrderModal(false);
                  setSelectedOrder(null); // Clear selected order
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
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