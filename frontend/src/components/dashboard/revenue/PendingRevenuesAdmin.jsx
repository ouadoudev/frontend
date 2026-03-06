// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchMonthlyRevenues,
//   fetchAllRevenues,
//   clearRevenueError,
//   fetchPendingMonthlyRevenues,
//   payMonthlyRevenue,
//   fetchPlatformMetrics,
//   fetchPlatformFees,
// } from "@/store/revenueSlice";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider,
// } from "@/components/ui/tooltip";

// import {
//   Calendar,
//   Download,
//   Search,
//   User,
//   DollarSign,
//   FileText,
//   RefreshCw,
//   ChevronLeft,
//   ChevronRight,
//   Loader2,
//   AlertCircle,
//   CheckCircle2,
//   TrendingUp,
//   PieChart,
//   Activity,
//   Info,
// } from "lucide-react";
// import { format } from "date-fns";
// import { fr } from "date-fns/locale";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip as ChartTooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";
// import { Pie, Bar, Line } from "react-chartjs-2";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   ChartTooltip,
//   Legend,
//   ArcElement
// );

// const AdminRevenuePanel = () => {
//   const dispatch = useDispatch();
//   const {
//     monthlyRevenues,
//     pendingMonthlyRevenues,
//     allRevenues,
//     platformMetrics,
//     platformFees,
//     loading,
//     error,
//   } = useSelector((state) => state.revenue);

//   const [filters, setFilters] = useState({
//     year: "",
//     month: "",
//     status: "",
//     search: "",
//     timeFilter: "all",
//   });
//   const [platformFilters, setPlatformFilters] = useState({
//     timeframe: "monthly",
//     year: "",
//     month: "",
//     page: 1,
//     limit: 10,
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [payingId, setPayingId] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     dispatch(fetchMonthlyRevenues());
//     dispatch(fetchPendingMonthlyRevenues());
//     dispatch(fetchAllRevenues());
//     dispatch(fetchPlatformMetrics({ timeframe: "monthly" }));
//     return () => {
//       dispatch(clearRevenueError());
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(
//       fetchPlatformFees({
//         ...platformFilters,
//         page: platformFilters.page,
//         limit: platformFilters.limit,
//       })
//     );
//   }, [platformFilters, dispatch]);

//   const handleFilterChange = (name, value) => {
//     setFilters((prev) => ({ ...prev, [name]: value }));
//     setCurrentPage(1);
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       year: "",
//       month: "",
//       status: "",
//       search: "",
//       timeFilter: "all",
//     });
//     setCurrentPage(1);
//   };

//   const handlePay = async (id) => {
//     try {
//       setPayingId(id);
//       await dispatch(payMonthlyRevenue(id)).unwrap();
//       setSuccessMessage({
//         title: "Payment Successful",
//         message:
//           "The revenue has been marked as paid and the teacher has been notified.",
//       });
//       setTimeout(() => setSuccessMessage(null), 5000);
//       dispatch(fetchPendingMonthlyRevenues());
//       dispatch(fetchMonthlyRevenues());
//     } catch (err) {
//       console.error("Payment failed:", err);
//     } finally {
//       setPayingId(null);
//     }
//   };

//   // Filter revenues based on all criteria
//   const filteredRevenues = monthlyRevenues.filter((revenue) => {
//     if (filters.year && revenue.year !== parseInt(filters.year)) return false;
//     if (filters.month && revenue.month !== parseInt(filters.month))
//       return false;
//     if (filters.status && revenue.paid !== (filters.status === "paid"))
//       return false;

//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       const matchesTeacher = revenue.teacher?.username
//         ?.toLowerCase()
//         .includes(searchLower);
//       const matchesEmail = revenue.teacher?.email
//         ?.toLowerCase()
//         .includes(searchLower);
//       if (!matchesTeacher && !matchesEmail) return false;
//     }

//     if (filters.timeFilter !== "all" && !revenue.paid) {
//       const revenueDate = new Date(revenue.year, revenue.month - 1);

//       switch (filters.timeFilter) {
//         case "30days":
//           const thirtyDaysAgo = new Date();
//           thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//           return revenueDate > thirtyDaysAgo;
//         case "90days":
//           const ninetyDaysAgo = new Date();
//           ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
//           return revenueDate > ninetyDaysAgo;
//         case "6months":
//           const sixMonthsAgo = new Date();
//           sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
//           return revenueDate > sixMonthsAgo;
//         default:
//           return true;
//       }
//     }

//     return true;
//   });

//   // Calculate metrics for analytics
//   const calculateMetrics = () => {
//     const pendingRevenues = monthlyRevenues.filter((rev) => !rev.paid);
//     const paidRevenues = monthlyRevenues.filter((rev) => rev.paid);

//     // Basic totals
//     const totalAmount = monthlyRevenues.reduce(
//       (sum, item) => sum + item.totalAmount,
//       0
//     );
//     const totalPendingAmount = pendingRevenues.reduce(
//       (sum, item) => sum + item.totalAmount,
//       0
//     );
//     const totalPaidAmount = paidRevenues.reduce(
//       (sum, item) => sum + item.totalAmount,
//       0
//     );

//     const totalMonths = monthlyRevenues.length;
//     const totalPendingMonths = pendingRevenues.length;
//     const totalPaidMonths = paidRevenues.length;

//     const teacherIds = new Set(
//       monthlyRevenues.map((item) => item.teacher?._id)
//     );
//     const totalTeachers = teacherIds.size;

//     // Subject distribution
//     const subjectDistribution = {};
//     const pendingSubjectDistribution = {};
//     const paidSubjectDistribution = {};

//     // Time analysis
//     let oldestPending = pendingRevenues.length > 0 ? pendingRevenues[0] : null;
//     let newestPaid = paidRevenues.length > 0 ? paidRevenues[0] : null;

//     monthlyRevenues.forEach((item) => {
//       // Subject distribution
//       const detailedRevenues = allRevenues.filter(
//         (rev) => rev.monthlyRevenue?.toString() === item._id.toString()
//       );

//       detailedRevenues.forEach((rev) => {
//         const subjectName = rev.subject?.title || "Unknown";
//         subjectDistribution[subjectName] =
//           (subjectDistribution[subjectName] || 0) + rev.amount;

//         if (item.paid) {
//           paidSubjectDistribution[subjectName] =
//             (paidSubjectDistribution[subjectName] || 0) + rev.amount;
//         } else {
//           pendingSubjectDistribution[subjectName] =
//             (pendingSubjectDistribution[subjectName] || 0) + rev.amount;
//         }
//       });

//       // Time analysis
//       if (!item.paid) {
//         const itemDate = new Date(item.year, item.month - 1);
//         if (
//           !oldestPending ||
//           itemDate < new Date(oldestPending.year, oldestPending.month - 1)
//         ) {
//           oldestPending = item;
//         }
//       } else {
//         const itemDate = new Date(item.year, item.month - 1);
//         if (
//           !newestPaid ||
//           itemDate > new Date(newestPaid.year, newestPaid.month - 1)
//         ) {
//           newestPaid = item;
//         }
//       }
//     });

//     return {
//       totalAmount,
//       totalPendingAmount,
//       totalPaidAmount,
//       totalMonths,
//       totalPendingMonths,
//       totalPaidMonths,
//       totalTeachers,
//       subjectDistribution,
//       pendingSubjectDistribution,
//       paidSubjectDistribution,
//       oldestPending,
//       newestPaid,
//     };
//   };

//   const metrics = calculateMetrics();

//   // Prepare chart data
//   const subjectChartData = {
//     labels: Object.keys(metrics.subjectDistribution),
//     datasets: [
//       {
//         label: "Total",
//         data: Object.values(metrics.subjectDistribution),
//         backgroundColor: "#3b82f6",
//       },
//     ],
//   };

//   // Monthly trend data
//   const monthlyTrendData = monthlyRevenues.reduce((acc, item) => {
//     const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
//     if (!acc[key]) {
//       acc[key] = { total: 0, paid: 0, pending: 0 };
//     }
//     acc[key].total += item.totalAmount;
//     if (item.paid) {
//       acc[key].paid += item.totalAmount;
//     } else {
//       acc[key].pending += item.totalAmount;
//     }
//     return acc;
//   }, {});

//   const monthlyTrendChartData = {
//     labels: Object.keys(monthlyTrendData).map((key) => {
//       const [year, month] = key.split("-");
//       return format(new Date(year, month - 1), "MMM yyyy", { locale: fr });
//     }),
//     datasets: [
//       {
//         label: "Total Revenue (MAD)",
//         data: Object.values(monthlyTrendData).map((item) => item.total),
//         borderColor: "#3b82f6",
//         backgroundColor: "rgba(59, 130, 246, 0.2)",
//         tension: 0.3,
//         fill: true,
//       },
//       {
//         label: "Paid Revenue (MAD)",
//         data: Object.values(monthlyTrendData).map((item) => item.paid),
//         borderColor: "#10b981",
//         backgroundColor: "rgba(16, 185, 129, 0.2)",
//         tension: 0.3,
//         fill: true,
//       },
//       {
//         label: "Pending Revenue (MAD)",
//         data: Object.values(monthlyTrendData).map((item) => item.pending),
//         borderColor: "#f59e0b",
//         backgroundColor: "rgba(245, 158, 11, 0.2)",
//         tension: 0.3,
//         fill: true,
//       },
//     ],
//   };

//   // Teacher performance data
//   const teacherPerformance = monthlyRevenues.reduce((acc, item) => {
//     const teacherId = item.teacher?._id;
//     if (!teacherId) return acc;

//     if (!acc[teacherId]) {
//       acc[teacherId] = {
//         teacher: item.teacher,
//         months: 0,
//         paidMonths: 0,
//         pendingMonths: 0,
//         totalAmount: 0,
//         paidAmount: 0,
//         pendingAmount: 0,
//       };
//     }

//     acc[teacherId].months += 1;
//     acc[teacherId].totalAmount += item.totalAmount;

//     if (item.paid) {
//       acc[teacherId].paidMonths += 1;
//       acc[teacherId].paidAmount += item.totalAmount;
//     } else {
//       acc[teacherId].pendingMonths += 1;
//       acc[teacherId].pendingAmount += item.totalAmount;
//     }

//     return acc;
//   }, {});

//   // Platform metrics chart data
//   const platformMetricsData = {
//     labels: ["Platform Earnings", "Teacher Payouts"],
//     datasets: [
//       {
//         data: [
//           platformMetrics?.totalAmount || 0,
//           metrics.totalPaidAmount + metrics.totalPendingAmount,
//         ],
//         backgroundColor: ["#8b5cf6", "#3b82f6"],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const platformGrowthData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//     datasets: [
//       {
//         label: "Platform Earnings",
//         data: [1200, 1900, 1500, 2000, 2200, 2500, 2800],
//         borderColor: "#8b5cf6",
//         backgroundColor: "rgba(139, 92, 246, 0.1)",
//         tension: 0.3,
//         fill: true,
//       },
//     ],
//   };

//   const totalPages = Math.ceil(filteredRevenues.length / itemsPerPage);
//   const paginatedRevenues = filteredRevenues.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

//   const monthNames = [
//     { value: "1", label: "January" },
//     { value: "2", label: "February" },
//     { value: "3", label: "March" },
//     { value: "4", label: "April" },
//     { value: "5", label: "May" },
//     { value: "6", label: "June" },
//     { value: "7", label: "July" },
//     { value: "8", label: "August" },
//     { value: "9", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" },
//   ];

//   const exportToCSV = () => {
//     let csvContent = "Teacher,Email,Period,Amount,Status,Paid At\n";

//     filteredRevenues.forEach((revenue) => {
//       const row = [
//         revenue.teacher?.username || "",
//         revenue.teacher?.email || "",
//         `${revenue.month}/${revenue.year}`,
//         revenue.totalAmount,
//         revenue.paid ? "Paid" : "Pending",
//         revenue.paidAt
//           ? format(new Date(revenue.paidAt), "yyyy-MM-dd HH:mm")
//           : "",
//       ].join(",");

//       csvContent += row + "\n";
//     });

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `revenue_history_${format(new Date(), "yyyyMMdd")}.csv`
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             return `${context.dataset.label}: ${context.raw.toFixed(2)} MAD`;
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: function (value) {
//             return `${value} MAD`;
//           },
//         },
//       },
//     },
//   };

//   return (
//     <TooltipProvider>
//       <div className="container mx-auto px-4 py-8 space-y-6">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//               Revenue Administration
//             </h1>
//             <p className="text-muted-foreground mt-1">
//               Manage teacher payouts and revenue tracking Monitor platform
//               earnings and financial metrics
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 dispatch(fetchMonthlyRevenues());
//                 dispatch(fetchPendingMonthlyRevenues());
//                 dispatch(
//                   fetchPlatformMetrics({
//                     timeframe: platformFilters.timeframe,
//                   })
//                 );
//               }}
//               disabled={loading}
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </Button>

//             <Button
//               onClick={exportToCSV}
//               disabled={filteredRevenues.length === 0}
//               variant="secondary"
//             >
//               <Download className="h-4 w-4 mr-2" />
//               Export CSV
//             </Button>
//           </div>
//         </div>
//         {/* Status Messages */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex items-center text-red-600">
//               <AlertCircle className="h-5 w-5 mr-2" />
//               <div>
//                 <h3 className="font-medium">Error</h3>
//                 <p className="text-sm">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}
//         {successMessage && (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <div className="flex items-center text-green-600">
//               <CheckCircle2 className="h-5 w-5 mr-2" />
//               <div>
//                 <h3 className="font-medium">{successMessage.title}</h3>
//                 <p className="text-sm">{successMessage.message}</p>
//               </div>
//             </div>
//           </div>
//         )}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Summary Cards */}
//           <Card className="lg:col-span-4">
//             <CardHeader className="pb-3">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="flex items-center gap-2">
//                   <Activity className="h-5 w-5" />
//                   Revenue Overview
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Info className="h-4 w-4 text-muted-foreground" />
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Summary of all revenue activities</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </CardTitle>
//                 <Select
//                   value={platformFilters.timeframe}
//                   onValueChange={(value) => {
//                     setPlatformFilters((prev) => ({
//                       ...prev,
//                       timeframe: value,
//                     }));
//                     dispatch(fetchPlatformMetrics({ timeframe: value }));
//                   }}
//                   disabled={loading}
//                 >
//                   <SelectTrigger className="max-w-56">
//                     <SelectValue placeholder="Select timeframe" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="monthly">This Month</SelectItem>
//                     <SelectItem value="annual">This Year</SelectItem>
//                     <SelectItem value="all">All Time</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">
//                       Total Platform Earnings
//                     </CardTitle>
//                     <DollarSign className="h-4 w-4 text-purple-600" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-purple-800">
//                       {loading ? (
//                         <Skeleton className="h-8 w-24" />
//                       ) : (
//                         `${(platformMetrics?.totalAmount || 0).toFixed(2)} MAD`
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">
//                       Total Revenue
//                     </CardTitle>
//                     <DollarSign className="h-4 w-4 text-blue-600" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-blue-800">
//                       {loading ? (
//                         <Skeleton className="h-8 w-24" />
//                       ) : (
//                         `${metrics.totalAmount.toFixed(2)} MAD`
//                       )}
//                     </div>
//                     <div className="flex justify-between text-xs text-blue-600 mt-2">
//                       <span>
//                         Paid: {metrics.totalPaidAmount.toFixed(2)} MAD
//                       </span>
//                       <span>
//                         Pending: {metrics.totalPendingAmount.toFixed(2)} MAD
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">
//                       Revenue Periods
//                     </CardTitle>
//                     <Calendar className="h-4 w-4 text-purple-600" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-purple-800">
//                       {loading ? (
//                         <Skeleton className="h-8 w-24" />
//                       ) : (
//                         metrics.totalMonths
//                       )}
//                     </div>
//                     <div className="flex justify-between text-xs text-purple-600 mt-2">
//                       <span>Paid: {metrics.totalPaidMonths}</span>
//                       <span>Pending: {metrics.totalPendingMonths}</span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-gradient-to-br from-green-50 to-green-100">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">
//                       Teachers
//                     </CardTitle>
//                     <User className="h-4 w-4 text-green-600" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-green-800">
//                       {loading ? (
//                         <Skeleton className="h-8 w-24" />
//                       ) : (
//                         metrics.totalTeachers
//                       )}
//                     </div>
//                     <p className="text-xs text-green-600 mt-2">
//                       Participating in revenue sharing
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Charts */}
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <PieChart className="h-5 w-5" />
//                 Revenue by Subject
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="h-80">
//               {loading ? (
//                 <div className="flex items-center justify-center h-full">
//                   <Loader2 className="h-8 w-8 animate-spin" />
//                 </div>
//               ) : (
//                 <Bar data={subjectChartData} options={chartOptions} />
//               )}
//             </CardContent>
//           </Card>

//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <TrendingUp className="h-5 w-5" />
//                 Monthly Revenue Trend
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="h-80">
//               {loading ? (
//                 <div className="flex items-center justify-center h-full">
//                   <Loader2 className="h-8 w-8 animate-spin" />
//                 </div>
//               ) : (
//                 <Line data={monthlyTrendChartData} options={chartOptions} />
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               Platform Fee Transactions
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="space-y-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Skeleton key={i} className="h-12 w-full" />
//                 ))}
//               </div>
//             ) : platformFees.data?.length === 0 ? (
//               <div className="text-center py-12 space-y-2">
//                 <FileText className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="text-lg font-medium text-gray-900">
//                   No fee records found
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Platform fees will appear here when subscriptions are
//                   processed
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader className="bg-gray-50">
//                       <TableRow>
//                         <TableHead>Subject</TableHead>
//                         <TableHead>Period</TableHead>
//                         <TableHead className="text-right">Amount</TableHead>
//                         <TableHead>Recorded At</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {platformFees.data?.map((fee) => (
//                         <TableRow key={fee._id} className="hover:bg-gray-50">
//                           <TableCell>{fee.subject?.title || "N/A"}</TableCell>
//                           <TableCell>
//                             {fee.month}/{fee.year}
//                           </TableCell>
//                           <TableCell className="text-right font-medium text-purple-800">
//                             {fee.amount.toFixed(2)} MAD
//                           </TableCell>
//                           <TableCell>
//                             {format(
//                               new Date(fee.createdAt),
//                               "yyyy-MM-dd HH:mm"
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex items-center justify-between mt-4">
//                   <div className="text-sm text-muted-foreground">
//                     Showing{" "}
//                     {(platformFilters.page - 1) * platformFilters.limit + 1} to{" "}
//                     {Math.min(
//                       platformFilters.page * platformFilters.limit,
//                       platformFees.total
//                     )}{" "}
//                     of {platformFees.total} entries
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() =>
//                         setPlatformFilters((prev) => ({
//                           ...prev,
//                           page: Math.max(prev.page - 1, 1),
//                         }))
//                       }
//                       disabled={platformFilters.page === 1}
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() =>
//                         setPlatformFilters((prev) => ({
//                           ...prev,
//                           page: Math.min(
//                             prev.page + 1,
//                             platformFees.totalPages
//                           ),
//                         }))
//                       }
//                       disabled={
//                         platformFilters.page === platformFees.totalPages
//                       }
//                     >
//                       <ChevronRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle>Revenue Records</CardTitle>
//               <Button variant="ghost" onClick={handleResetFilters}>
//                 Reset Filters
//               </Button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Year
//                 </label>
//                 <Select
//                   value={filters.year}
//                   onValueChange={(value) => handleFilterChange("year", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Years" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="a">All Years</SelectItem>
//                     {yearOptions.map((year) => (
//                       <SelectItem key={year} value={year.toString()}>
//                         {year}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Month
//                 </label>
//                 <Select
//                   value={filters.month}
//                   onValueChange={(value) => handleFilterChange("month", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Months" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="a">All Months</SelectItem>
//                     {monthNames.map((month) => (
//                       <SelectItem key={month.value} value={month.value}>
//                         {month.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Status
//                 </label>
//                 <Select
//                   value={filters.status}
//                   onValueChange={(value) => handleFilterChange("status", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Statuses" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="a">All Statuses</SelectItem>
//                     <SelectItem value="paid">Paid</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Time Period
//                 </label>
//                 <Select
//                   value={filters.timeFilter}
//                   onValueChange={(value) =>
//                     handleFilterChange("timeFilter", value)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Time" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Time</SelectItem>
//                     <SelectItem value="30days">Last 30 days</SelectItem>
//                     <SelectItem value="90days">Last 90 days</SelectItem>
//                     <SelectItem value="6months">Last 6 months</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Search
//                 </label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     placeholder="Search by teacher or email..."
//                     className="pl-10"
//                     value={filters.search}
//                     onChange={(e) =>
//                       handleFilterChange("search", e.target.value)
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="space-y-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Skeleton key={i} className="h-12 w-full" />
//                 ))}
//               </div>
//             ) : filteredRevenues.length === 0 ? (
//               <div className="text-center py-12 space-y-2">
//                 <FileText className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="text-lg font-medium text-gray-900">
//                   No revenue records found
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Try adjusting your filters or search criteria
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader className="bg-gray-50">
//                       <TableRow>
//                         <TableHead>Teacher</TableHead>
//                         <TableHead>Email</TableHead>
//                         <TableHead>Period</TableHead>
//                         <TableHead className="text-right">Amount</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Paid At</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {paginatedRevenues.map((revenue) => (
//                         <TableRow
//                           key={revenue._id}
//                           className="hover:bg-gray-50"
//                         >
//                           <TableCell>
//                             <div className="flex items-center">
//                               <User className="h-4 w-4 mr-2 text-primary" />
//                               {revenue.teacher?.username || "N/A"}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             {revenue.teacher?.email || "N/A"}
//                           </TableCell>
//                           <TableCell>
//                             {revenue.month}/{revenue.year}
//                           </TableCell>
//                           <TableCell className="text-right font-medium">
//                             {revenue.totalAmount.toFixed(2)} MAD
//                           </TableCell>
//                           <TableCell>
//                             <Badge
//                               variant={revenue.paid ? "default" : "secondary"}
//                               className={
//                                 revenue.paid
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-yellow-100 text-yellow-800"
//                               }
//                             >
//                               {revenue.paid ? "Paid" : "Pending"}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             {revenue.paidAt
//                               ? format(
//                                   new Date(revenue.paidAt),
//                                   "yyyy-MM-dd HH:mm"
//                                 )
//                               : "-"}
//                           </TableCell>
//                           <TableCell className="text-right">
//                             {!revenue.paid && (
//                               <Button
//                                 onClick={() => handlePay(revenue._id)}
//                                 disabled={payingId === revenue._id}
//                                 size="sm"
//                                 className="bg-green-600 hover:bg-green-700"
//                               >
//                                 {payingId === revenue._id ? (
//                                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                                 ) : null}
//                                 Mark as Paid
//                               </Button>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex items-center justify-between mt-4">
//                   <div className="text-sm text-muted-foreground">
//                     Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                     {Math.min(
//                       currentPage * itemsPerPage,
//                       filteredRevenues.length
//                     )}{" "}
//                     of {filteredRevenues.length} entries
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPage === 1}
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                       }
//                       disabled={currentPage === totalPages}
//                     >
//                       <ChevronRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Teacher Performance */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Teacher Performance
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader className="bg-gray-50">
//                   <TableRow>
//                     <TableHead>Teacher</TableHead>
//                     <TableHead>Total Months</TableHead>
//                     <TableHead>Paid Months</TableHead>
//                     <TableHead>Pending Months</TableHead>
//                     <TableHead className="text-right">Total Amount</TableHead>
//                     <TableHead className="text-right">Paid Amount</TableHead>
//                     <TableHead className="text-right">Pending Amount</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {Object.values(teacherPerformance).map((teacherData) => (
//                     <TableRow key={teacherData.teacher._id}>
//                       <TableCell className="font-medium">
//                         {teacherData.teacher.username}
//                       </TableCell>
//                       <TableCell>{teacherData.months}</TableCell>
//                       <TableCell>{teacherData.paidMonths}</TableCell>
//                       <TableCell>{teacherData.pendingMonths}</TableCell>
//                       <TableCell className="text-right">
//                         {teacherData.totalAmount.toFixed(2)} MAD
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {teacherData.paidAmount.toFixed(2)} MAD
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {teacherData.pendingAmount.toFixed(2)} MAD
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5" />
//               Platform Growth
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-80">
//             {loading ? (
//               <div className="flex items-center justify-center h-full">
//                 <Loader2 className="h-8 w-8 animate-spin" />
//               </div>
//             ) : (
//               <Line
//                 data={platformGrowthData}
//                 options={{
//                   ...chartOptions,
//                   plugins: {
//                     legend: {
//                       display: false,
//                     },
//                   },
//                 }}
//               />
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </TooltipProvider>
//   );
// };

// export default AdminRevenuePanel;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonthlyRevenues,
  fetchAllRevenues,
  clearRevenueError,
  fetchPendingMonthlyRevenues,
  payMonthlyRevenue,
  fetchPlatformMetrics,
  fetchPlatformFees,
} from "@/store/revenueSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  Calendar,
  Download,
  Search,
  User,
  DollarSign,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  PieChart,
  Activity,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const AdminRevenuePanel = () => {
  const dispatch = useDispatch();
  const {
    monthlyRevenues,
    pendingMonthlyRevenues,
    allRevenues,
    platformMetrics,
    platformFees,
    loading,
    error,
  } = useSelector((state) => state.revenue);

  const [filters, setFilters] = useState({
    year: "",
    month: "",
    status: "",
    search: "",
    timeFilter: "all",
  });
  const [platformFilters, setPlatformFilters] = useState({
    timeframe: "monthly",
    year: "",
    month: "",
    page: 1,
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [payingId, setPayingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchMonthlyRevenues());
    dispatch(fetchPendingMonthlyRevenues());
    dispatch(fetchAllRevenues());
    dispatch(fetchPlatformMetrics({ timeframe: "monthly" }));
    return () => {
      dispatch(clearRevenueError());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchPlatformFees({
        ...platformFilters,
        page: platformFilters.page,
        limit: platformFilters.limit,
      })
    );
  }, [platformFilters, dispatch]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      year: "",
      month: "",
      status: "",
      search: "",
      timeFilter: "all",
    });
    setCurrentPage(1);
  };

  const handlePay = async (id) => {
    try {
      setPayingId(id);
      await dispatch(payMonthlyRevenue(id)).unwrap();
      setSuccessMessage({
        title: "Paiement réussi",
        message:
          "Le revenu a été marqué comme payé et l'enseignant a été notifié.",
      });
      setTimeout(() => setSuccessMessage(null), 5000);
      dispatch(fetchPendingMonthlyRevenues());
      dispatch(fetchMonthlyRevenues());
    } catch (err) {
      console.error("Échec du paiement:", err);
    } finally {
      setPayingId(null);
    }
  };

  // Filter revenues based on all criteria
  const filteredRevenues = monthlyRevenues.filter((revenue) => {
    if (filters.year && revenue.year !== parseInt(filters.year)) return false;
    if (filters.month && revenue.month !== parseInt(filters.month))
      return false;
    if (filters.status && revenue.paid !== (filters.status === "paid"))
      return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTeacher = revenue.teacher?.username
        ?.toLowerCase()
        .includes(searchLower);
      const matchesEmail = revenue.teacher?.email
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesTeacher && !matchesEmail) return false;
    }

    if (filters.timeFilter !== "all" && !revenue.paid) {
      const revenueDate = new Date(revenue.year, revenue.month - 1);

      switch (filters.timeFilter) {
        case "30days":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return revenueDate > thirtyDaysAgo;
        case "90days":
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          return revenueDate > ninetyDaysAgo;
        case "6months":
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return revenueDate > sixMonthsAgo;
        default:
          return true;
      }
    }

    return true;
  });

  // Calculate metrics for analytics
  const calculateMetrics = () => {
    const pendingRevenues = monthlyRevenues.filter((rev) => !rev.paid);
    const paidRevenues = monthlyRevenues.filter((rev) => rev.paid);

    // Basic totals
    const totalAmount = monthlyRevenues.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    const totalPendingAmount = pendingRevenues.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    const totalPaidAmount = paidRevenues.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    const totalMonths = monthlyRevenues.length;
    const totalPendingMonths = pendingRevenues.length;
    const totalPaidMonths = paidRevenues.length;

    const teacherIds = new Set(
      monthlyRevenues.map((item) => item.teacher?._id)
    );
    const totalTeachers = teacherIds.size;

    // Subject distribution
    const subjectDistribution = {};
    const pendingSubjectDistribution = {};
    const paidSubjectDistribution = {};

    // Time analysis
    let oldestPending = pendingRevenues.length > 0 ? pendingRevenues[0] : null;
    let newestPaid = paidRevenues.length > 0 ? paidRevenues[0] : null;

    monthlyRevenues.forEach((item) => {
      // Subject distribution
      const detailedRevenues = allRevenues.filter(
        (rev) => rev.monthlyRevenue?.toString() === item._id.toString()
      );

      detailedRevenues.forEach((rev) => {
        const subjectName = rev.subject?.title || "Inconnu";
        subjectDistribution[subjectName] =
          (subjectDistribution[subjectName] || 0) + rev.amount;

        if (item.paid) {
          paidSubjectDistribution[subjectName] =
            (paidSubjectDistribution[subjectName] || 0) + rev.amount;
        } else {
          pendingSubjectDistribution[subjectName] =
            (pendingSubjectDistribution[subjectName] || 0) + rev.amount;
        }
      });

      // Time analysis
      if (!item.paid) {
        const itemDate = new Date(item.year, item.month - 1);
        if (
          !oldestPending ||
          itemDate < new Date(oldestPending.year, oldestPending.month - 1)
        ) {
          oldestPending = item;
        }
      } else {
        const itemDate = new Date(item.year, item.month - 1);
        if (
          !newestPaid ||
          itemDate > new Date(newestPaid.year, newestPaid.month - 1)
        ) {
          newestPaid = item;
        }
      }
    });

    return {
      totalAmount,
      totalPendingAmount,
      totalPaidAmount,
      totalMonths,
      totalPendingMonths,
      totalPaidMonths,
      totalTeachers,
      subjectDistribution,
      pendingSubjectDistribution,
      paidSubjectDistribution,
      oldestPending,
      newestPaid,
    };
  };

  const metrics = calculateMetrics();

  // Prepare chart data
  const subjectChartData = {
    labels: Object.keys(metrics.subjectDistribution),
    datasets: [
      {
        label: "Total",
        data: Object.values(metrics.subjectDistribution),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  // Monthly trend data
  const monthlyTrendData = monthlyRevenues.reduce((acc, item) => {
    const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
    if (!acc[key]) {
      acc[key] = { total: 0, paid: 0, pending: 0 };
    }
    acc[key].total += item.totalAmount;
    if (item.paid) {
      acc[key].paid += item.totalAmount;
    } else {
      acc[key].pending += item.totalAmount;
    }
    return acc;
  }, {});

  const monthlyTrendChartData = {
    labels: Object.keys(monthlyTrendData).map((key) => {
      const [year, month] = key.split("-");
      return format(new Date(year, month - 1), "MMM yyyy", { locale: fr });
    }),
    datasets: [
      {
        label: "Revenu Total (MAD)",
        data: Object.values(monthlyTrendData).map((item) => item.total),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Revenu Payé (MAD)",
        data: Object.values(monthlyTrendData).map((item) => item.paid),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Revenu En Attente (MAD)",
        data: Object.values(monthlyTrendData).map((item) => item.pending),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Teacher performance data
  const teacherPerformance = monthlyRevenues.reduce((acc, item) => {
    const teacherId = item.teacher?._id;
    if (!teacherId) return acc;

    if (!acc[teacherId]) {
      acc[teacherId] = {
        teacher: item.teacher,
        months: 0,
        paidMonths: 0,
        pendingMonths: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
      };
    }

    acc[teacherId].months += 1;
    acc[teacherId].totalAmount += item.totalAmount;

    if (item.paid) {
      acc[teacherId].paidMonths += 1;
      acc[teacherId].paidAmount += item.totalAmount;
    } else {
      acc[teacherId].pendingMonths += 1;
      acc[teacherId].pendingAmount += item.totalAmount;
    }

    return acc;
  }, {});

  // Platform metrics chart data
  const platformMetricsData = {
    labels: ["Revenus de la plateforme", "Paiements aux enseignants"],
    datasets: [
      {
        data: [
          platformMetrics?.totalAmount || 0,
          metrics.totalPaidAmount + metrics.totalPendingAmount,
        ],
        backgroundColor: ["#8b5cf6", "#3b82f6"],
        borderWidth: 0,
      },
    ],
  };

  const platformGrowthData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"],
    datasets: [
      {
        label: "Revenus de la plateforme",
        data: [1200, 1900, 1500, 2000, 2200, 2500, 2800],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const totalPages = Math.ceil(filteredRevenues.length / itemsPerPage);
  const paginatedRevenues = filteredRevenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const monthNames = [
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  const exportToCSV = () => {
    let csvContent = "Enseignant,Email,Période,Montant,Statut,Payé le\n";

    filteredRevenues.forEach((revenue) => {
      const row = [
        revenue.teacher?.username || "",
        revenue.teacher?.email || "",
        `${revenue.month}/${revenue.year}`,
        revenue.totalAmount,
        revenue.paid ? "Payé" : "En attente",
        revenue.paidAt
          ? format(new Date(revenue.paidAt), "yyyy-MM-dd HH:mm")
          : "",
      ].join(",");

      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `historique_revenus_${format(new Date(), "yyyyMMdd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toFixed(2)} MAD`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value} MAD`;
          },
          precision: 0,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="lg:text-3xl font-bold text-xl text-gray-800 flex items-center gap-2">
              Administration des revenus
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                dispatch(fetchMonthlyRevenues());
                dispatch(fetchPendingMonthlyRevenues());
                dispatch(
                  fetchPlatformMetrics({
                    timeframe: platformFilters.timeframe,
                  })
                );
              }}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>

            <Button
              onClick={exportToCSV}
              disabled={filteredRevenues.length === 0}
              variant="secondary"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>
        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <h3 className="font-medium">Erreur</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <div>
                <h3 className="font-medium">{successMessage.title}</h3>
                <p className="text-sm">{successMessage.message}</p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Summary Cards */}
          <Card className="lg:col-span-4">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                {/* Titre + Info Tooltip */}
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  <Activity className="h-5 w-5" />
                  Aperçu des revenus
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Résumé de toutes les activités de revenus</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>

                {/* Selecteur de période */}
                <Select
                  value={platformFilters.timeframe}
                  onValueChange={(value) => {
                    setPlatformFilters((prev) => ({
                      ...prev,
                      timeframe: value,
                    }));
                    dispatch(fetchPlatformMetrics({ timeframe: value }));
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full sm:w-56">
                    <SelectValue placeholder="Sélectionner la période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Ce mois</SelectItem>
                    <SelectItem value="annual">Cette année</SelectItem>
                    <SelectItem value="all">Toutes périodes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenus totaux de la plateforme
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-800">
                      {loading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        `${(platformMetrics?.totalAmount || 0).toFixed(2)} MAD`
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenu total
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-800">
                      {loading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        `${metrics.totalAmount.toFixed(2)} MAD`
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-blue-600 mt-2">
                      <span>
                        Payé: {metrics.totalPaidAmount.toFixed(2)} MAD
                      </span>
                      <span>
                        En attente: {metrics.totalPendingAmount.toFixed(2)} MAD
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Périodes de revenus
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-800">
                      {loading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        metrics.totalMonths
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-purple-600 mt-2">
                      <span>Payé: {metrics.totalPaidMonths}</span>
                      <span>En attente: {metrics.totalPendingMonths}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Enseignants
                    </CardTitle>
                    <User className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-800">
                      {loading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        metrics.totalTeachers
                      )}
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      Participant au partage des revenus
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                <PieChart className="h-5 w-5" />
                Revenus par matière
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Bar data={subjectChartData} options={chartOptions} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                <TrendingUp className="h-5 w-5" />
                Tendance mensuelle des revenus
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Line data={monthlyTrendChartData} options={chartOptions} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Transactions des frais de plateforme
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : platformFees.data?.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Aucun enregistrement de frais trouvé
                  </h3>
                  <p className="text-sm text-gray-500">
                    Les frais de plateforme apparaîtront ici lorsque les
                    abonnements seront traités
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Matière</TableHead>
                          <TableHead>Période</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                          <TableHead>Enregistré le</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {platformFees.data?.map((fee) => (
                          <TableRow key={fee._id} className="hover:bg-gray-50">
                            <TableCell>{fee.subject?.title || "N/A"}</TableCell>
                            <TableCell>
                              {fee.month}/{fee.year}
                            </TableCell>
                            <TableCell className="text-right font-medium text-purple-800">
                              {fee.amount.toFixed(2)} MAD
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(fee.createdAt),
                                "yyyy-MM-dd HH:mm"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Affichage de{" "}
                      {(platformFilters.page - 1) * platformFilters.limit + 1} à{" "}
                      {Math.min(
                        platformFilters.page * platformFilters.limit,
                        platformFees.total
                      )}{" "}
                      sur {platformFees.total} entrées
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPlatformFilters((prev) => ({
                            ...prev,
                            page: Math.max(prev.page - 1, 1),
                          }))
                        }
                        disabled={platformFilters.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPlatformFilters((prev) => ({
                            ...prev,
                            page: Math.min(
                              prev.page + 1,
                              platformFees.totalPages
                            ),
                          }))
                        }
                        disabled={
                          platformFilters.page === platformFees.totalPages
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Enregistrements de revenus
                </CardTitle>

                <Button
                  variant="ghost"
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Réinitialiser les filtres
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année
                  </label>
                  <Select
                    value={filters.year}
                    onValueChange={(value) => handleFilterChange("year", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les années" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Toutes les années</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mois
                  </label>
                  <Select
                    value={filters.month}
                    onValueChange={(value) =>
                      handleFilterChange("month", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les mois" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Tous les mois</SelectItem>
                      {monthNames.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Tous les statuts</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Période
                  </label>
                  <Select
                    value={filters.timeFilter}
                    onValueChange={(value) =>
                      handleFilterChange("timeFilter", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes périodes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes périodes</SelectItem>
                      <SelectItem value="30days">30 derniers jours</SelectItem>
                      <SelectItem value="90days">90 derniers jours</SelectItem>
                      <SelectItem value="6months">6 derniers mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rechercher
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par enseignant ou email..."
                      className="pl-10"
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredRevenues.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Aucun enregistrement de revenu trouvé
                  </h3>
                  <p className="text-sm text-gray-500">
                    Essayez d'ajuster vos filtres ou critères de recherche
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Enseignant</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Période</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Payé le</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRevenues.map((revenue) => (
                          <TableRow
                            key={revenue._id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-primary" />
                                {revenue.teacher?.username || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {revenue.teacher?.email || "N/A"}
                            </TableCell>
                            <TableCell>
                              {revenue.month}/{revenue.year}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {revenue.totalAmount.toFixed(2)} MAD
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={revenue.paid ? "default" : "secondary"}
                                className={
                                  revenue.paid
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {revenue.paid ? "Payé" : "En attente"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {revenue.paidAt
                                ? format(
                                    new Date(revenue.paidAt),
                                    "yyyy-MM-dd HH:mm"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {!revenue.paid && (
                                <Button
                                  onClick={() => handlePay(revenue._id)}
                                  disabled={payingId === revenue._id}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {payingId === revenue._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Marquer comme payé
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredRevenues.length
                      )}{" "}
                      sur {filteredRevenues.length} entrées
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Teacher Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                <User className="h-5 w-5" />
                Performance des enseignants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Enseignant</TableHead>
                      <TableHead>Mois totaux</TableHead>
                      <TableHead>Mois payés</TableHead>
                      <TableHead>Mois en attente</TableHead>
                      <TableHead className="text-right">
                        Montant total
                      </TableHead>
                      <TableHead className="text-right">Montant payé</TableHead>
                      <TableHead className="text-right">
                        Montant en attente
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(teacherPerformance).map((teacherData) => (
                      <TableRow key={teacherData.teacher._id}>
                        <TableCell className="font-medium">
                          {teacherData.teacher.username}
                        </TableCell>
                        <TableCell>{teacherData.months}</TableCell>
                        <TableCell>{teacherData.paidMonths}</TableCell>
                        <TableCell>{teacherData.pendingMonths}</TableCell>
                        <TableCell className="text-right">
                          {teacherData.totalAmount.toFixed(2)} MAD
                        </TableCell>
                        <TableCell className="text-right">
                          {teacherData.paidAmount.toFixed(2)} MAD
                        </TableCell>
                        <TableCell className="text-right">
                          {teacherData.pendingAmount.toFixed(2)} MAD
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Croissance de la plateforme
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Line
                data={platformGrowthData}
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card> */}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminRevenuePanel;
