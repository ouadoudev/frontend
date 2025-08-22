// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Mail,
//   Phone,
//   Users,
//   ArrowDownIcon,
//   ArrowUpIcon,
//   BookA,
//   DollarSignIcon,
//   GraduationCap,
//   PackageIcon,
//   UsersIcon,
//   Banknote,
//   Loader2,
//   EllipsisVertical,
// } from "lucide-react";
// import { Sparkles } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loggedUser } from "@/store/authSlice";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import NotificationDropdown from "@/components/NotificationDropdown";
// import { fetchUserNotifications } from "@/store/notificationSlice";
// import { fetchAnalytics } from "@/store/adminanalyticsSlice";
// import {
//   fetchPlatformMetrics,
//   fetchPendingMonthlyRevenues,
// } from "@/store/revenueSlice";
// import { format } from "date-fns";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useNavigate } from "react-router-dom";

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Overview = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const authUser = useSelector(loggedUser);
//   const {
//     notifications,
//     isLoading,
//     error: notificationError,
//   } = useSelector((state) => state.notifications);
//   const [timeframe, setTimeframe] = useState("this_month");

//   const {
//     totalUsers,
//     onlineUsers,
//     totalStudents,
//     studentsStats,
//     totalTeachers,
//     teachersStats,
//     topTeachers,
//     topSubjects,
//     newEnrollments,
//     growth,
//     status,
//     error,
//   } = useSelector((state) => state.analytics);

//   const {
//     platformMetrics,
//     pendingMonthlyRevenues,
//     status: revenueStatus,
//     error: revenueError,
//   } = useSelector((state) => state.revenue);

//   useEffect(() => {
//     dispatch(
//       fetchAnalytics({
//         timeframe,
//       })
//     );

//     // Fetch revenue data
//     dispatch(fetchPlatformMetrics({ timeframe: "all" }));
//     dispatch(fetchPendingMonthlyRevenues());
//   }, [dispatch, timeframe]);

//   useEffect(() => {
//     if (authUser?.id) {
//       dispatch(fetchUserNotifications(authUser.id));
//     }
//   }, [authUser?.id, dispatch]);

//   const refreshNotifications = () => {
//     dispatch(fetchUserNotifications(authUser.id));
//   };

//   const manageStudents = () =>{
//     navigate("/students")
//   }

//   const manageTeachers = ()=>{
//     navigate("/teachers")
//   }

//   // Calculate pending payouts total
//   const pendingPayoutsTotal =
//     pendingMonthlyRevenues?.reduce(
//       (sum, revenue) => sum + revenue.totalAmount,
//       0
//     ) || 0;

//   // Student Distribution Chart
//   const studentBarColors = [
//     "rgba(0, 163, 224, 0.7)",
//     "rgba(76, 175, 80, 0.7)",
//     "rgba(255, 99, 132, 0.7)",
//     "rgba(255, 159, 64, 0.7)",
//     "rgba(255, 205, 86, 0.7)",
//   ];

//   const studentChartData = {
//     labels:
//       studentsStats?.map(
//         (stat) => `${stat._id.educationalCycle} - ${stat._id.educationalLevel}`
//       ) || [],
//     datasets: [
//       {
//         label: "Nombre d'élèves",
//         data: studentsStats?.map((stat) => stat.count) || [],
//         backgroundColor: studentBarColors,
//         borderRadius: 8,
//         barThickness: 30,
//       },
//     ],
//     total: studentsStats?.reduce((sum, stat) => sum + stat.count, 0) || 0,
//   };

//   const studentChartOptions = {
//     responsive: true,
//     plugins: {
//       title: {
//         display: true,
//         text: `Répartition des élèves (${studentChartData.total} élèves)`,
//         font: { size: 16, weight: "bold" },
//       },
//       legend: { display: false },
//     },
//     scales: {
//       y: { beginAtZero: true },
//       x: { ticks: { maxRotation: 30, minRotation: 0 } },
//     },
//   };

//   // Teacher Distribution Chart
//   const teacherBarColors = [
//     "#4C6EF5",
//     "#FF9F43",
//     "#FFCD56",
//     "#FF6384",
//     "#36A2EB",
//   ];

//   const teacherChartData = {
//     labels: teachersStats?.map((stat) => stat._id) || [],
//     datasets: [
//       {
//         label: "Nombre d'enseignants",
//         data: teachersStats?.map((stat) => stat.count) || [],
//         backgroundColor: teacherBarColors,
//         borderRadius: 8,
//         barThickness: 30,
//       },
//     ],
//     total: teachersStats?.reduce((sum, stat) => sum + stat.count, 0) || 0,
//   };

//   const teacherChartOptions = {
//     responsive: true,
//     plugins: {
//       title: {
//         display: true,
//         text: `Répartition par discipline (${teacherChartData.total} enseignants)`,
//         font: { size: 16, weight: "bold" },
//       },
//       legend: { display: false },
//     },
//     scales: {
//       y: { beginAtZero: true },
//       x: { ticks: { maxRotation: 30, minRotation: 0 } },
//     },
//   };

//   if (!authUser) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-center h-64">
//               <Loader2 className="h-12 w-12 animate-spin" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (status === "failed" || revenueStatus === "failed") {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <Card>
//           <CardContent className="p-6 text-center text-red-500">
//             Error: {error || revenueError}
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-6">
//       {/* Admin Profile Header */}
//       <Card>
//         <div className="flex justify-end m-2">
//           <NotificationDropdown
//             notifications={notifications}
//             isLoading={isLoading}
//             notificationError={notificationError}
//             userId={authUser?.id}
//             onRefresh={refreshNotifications}
//           />
//         </div>
//         <CardContent className="p-6">
//           <div className="flex flex-col md:flex-row gap-8 items-center">
//             <div className="flex-shrink-0">
//               <Avatar className="w-24 h-24">
//                 <AvatarImage
//                   src={authUser.user_image?.url || "/placeholder.svg"}
//                   alt={authUser.username}
//                 />
//                 <AvatarFallback className="text-2xl">
//                   {authUser.username
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </AvatarFallback>
//               </Avatar>
//             </div>
//             <div className="flex-1 space-y-2">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                 <h1 className="text-2xl font-bold">{authUser.username}</h1>
//                 <Badge className="bg-purple-100 text-purple-800">
//                   {authUser.role}
//                 </Badge>
//                 {authUser.isOnline && (
//                   <Badge className="bg-green-100 text-green-800">
//                     <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
//                     Online
//                   </Badge>
//                 )}
//               </div>
//               <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-2">
//                   <Mail className="w-4 h-4" />
//                   {authUser.email}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone className="w-4 h-4" />
//                   {authUser.phone || "No phone number"}
//                 </div>
//               </div>
//               <p className="text-muted-foreground leading-relaxed pb-5 m-4">
//                 {authUser.bio || "No bio available"}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       {(status === "loading" || revenueStatus === "loading") && (
//         <div className="flex items-center justify-center h-screen">
//           <Loader2 className="h-12 w-12 animate-spin" />
//         </div>
//       )}

//       {/* Summary Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-blue-100 rounded-xl shadow-inner">
//                 <UsersIcon className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-3xl font-semibold tabular-nums text-foreground">
//                   {totalUsers.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-muted-foreground">Total Users</p>
//                 <div className="flex items-center gap-1 text-xs mt-1">
//                   {growth.totalUsersGrowth > 0 ? (
//                     <ArrowUpIcon className="w-3 h-3 text-green-500" />
//                   ) : (
//                     <ArrowDownIcon className="w-3 h-3 text-red-500" />
//                   )}
//                   <span>{growth.totalUsersGrowth.toFixed(2)}%</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
//           <CardHeader className="flex flex-row items-center justify-between pb-3">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-green-100 rounded-xl shadow-inner">
//                 <GraduationCap className="w-6 h-6 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-3xl font-semibold tabular-nums text-foreground">
//                   {totalStudents.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-muted-foreground">Total Students</p>
//                 <div className="flex items-center gap-1 text-xs mt-1">
//                   {growth.totalStudentsGrowth > 0 ? (
//                     <ArrowUpIcon className="w-3 h-3 text-green-500" />
//                   ) : (
//                     <ArrowDownIcon className="w-3 h-3 text-red-500" />
//                   )}
//                   <span>{growth.totalStudentsGrowth.toFixed(2)}%</span>
//                 </div>
//               </div>
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 hover:bg-muted"
//                   aria-label="Students menu"
//                 >
//                   <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-36">
//                 <DropdownMenuItem asChild>
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start gap-2 text-xs"
//                   onClick={manageStudents}
//                   >
//                     <GraduationCap className="w-4 h-4" />
//                     Manage Students
//                   </Button>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </CardHeader>
//         </Card>

//         <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
//           <CardHeader className="flex flex-row items-center justify-between pb-3">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-yellow-100 rounded-xl shadow-inner">
//                 <Users className="w-6 h-6 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-3xl font-semibold tabular-nums text-foreground">
//                   {totalTeachers.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-muted-foreground">Active Teachers</p>
//                 <div className="flex items-center gap-1 text-xs mt-1">
//                   {growth.totalTeachersGrowth > 0 ? (
//                     <ArrowUpIcon className="w-3 h-3 text-green-500" />
//                   ) : (
//                     <ArrowDownIcon className="w-3 h-3 text-red-500" />
//                   )}
//                   <span>{growth.totalTeachersGrowth.toFixed(2)}%</span>
//                 </div>
//               </div>
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 hover:bg-muted"
//                   aria-label="Teachers menu"
//                 >
//                   <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-36">
//                 <DropdownMenuItem asChild>
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start gap-2 text-xs"
//                      onClick={manageTeachers}
//                   >
//                     <Users className="w-4 h-4" />
//                     Manage Teachers
//                   </Button>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </CardHeader>
//         </Card>

//            <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-purple-100 rounded-xl shadow-inner">
//                 <UsersIcon className="w-6 h-6 text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-3xl font-semibold tabular-nums text-foreground">
//                   {onlineUsers.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-muted-foreground">Online Users</p>
//                 <div className="flex items-center gap-1 text-xs mt-1">
//                   {onlineUsers > 1 ? (
//                     <ArrowUpIcon className="w-3 h-3 text-green-500" />
//                   ) : (
//                     <ArrowDownIcon className="w-3 h-3 text-red-500" />
//                   )}
//                   <span>
//                     {((onlineUsers / totalUsers) * 100).toFixed(2)}% of total
//                     users
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-indigo-100 rounded-lg">
//                 <DollarSignIcon className="w-6 h-6 text-indigo-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold">
//                   {revenueStatus === "loading" ? (
//                     <Loader2 className="h-6 w-6 animate-spin mx-auto" />
//                   ) : (
//                     `${(platformMetrics?.totalAmount || 0).toFixed(2)} MAD`
//                   )}
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Platform Earnings
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-red-100 rounded-lg">
//                 <Banknote className="w-6 h-6 text-red-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold">
//                   {revenueStatus === "loading" ? (
//                     <Loader2 className="h-6 w-6 animate-spin mx-auto" />
//                   ) : (
//                     `${pendingPayoutsTotal.toFixed(2)} MAD`
//                   )}
//                 </p>
//                 <p className="text-sm text-muted-foreground">Pending Payouts</p>
//                 <div className="text-xs mt-1">
//                   {pendingMonthlyRevenues.length} teachers awaiting payment
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <GraduationCap className="w-5 h-5" />
//               Student Distribution
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-72">
//               {studentsStats?.length > 0 ? (
//                 <Bar data={studentChartData} options={studentChartOptions} />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
//                   <p className="text-muted-foreground">
//                     No student data available
//                   </p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Teacher Distribution Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="w-5 h-5" />
//               Teacher Distribution
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-72">
//               {teachersStats?.length > 0 ? (
//                 <Bar data={teacherChartData} options={teacherChartOptions} />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
//                   <p className="text-muted-foreground">
//                     No teacher data available
//                   </p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Top Teachers */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <PackageIcon className="w-5 h-5" />
//               Top Teachers
//             </CardTitle>
//             <CardDescription>Most active teachers</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-80">
//               <div className="space-y-4">
//                 {topTeachers?.length > 0 ? (
//                   topTeachers.map((teacher, index) => (
//                     <div
//                       key={teacher._id || index}
//                       className="flex items-center gap-4 p-3 border rounded-lg"
//                     >
//                       <Avatar className="w-12 h-12">
//                         <AvatarImage
//                           src={teacher.teacherInfo[0]?.user_image?.url}
//                           alt={teacher.teacherInfo[0]?.username}
//                         />
//                         <AvatarFallback>
//                           {teacher.teacherInfo[0]?.username
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1">
//                         <p className="font-medium">
//                           {teacher.teacherInfo[0]?.username}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           {teacher.teacherInfo[0]?.discipline}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium">{teacher.totalCourses}</p>
//                         <p className="text-sm text-muted-foreground">courses</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-64">
//                     <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
//                     <p className="text-muted-foreground">
//                       No top teachers data
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>

//         {/* Top Subjects */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BookA className="w-5 h-5" />
//               Top Subjects
//             </CardTitle>
//             <CardDescription>Most popular subjects</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-80">
//               <div className="space-y-3">
//                 {topSubjects?.length > 0 ? (
//                   topSubjects
//                     .sort((a, b) => b.enrolls - a.enrolls)
//                     .slice(0, 8)
//                     .map((subject, index) => (
//                       <div
//                         key={subject._id || index}
//                         className="flex items-center justify-between p-3 border rounded-lg"
//                       >
//                         <p className="font-medium">{subject.title}</p>
//                         <Badge variant="secondary">
//                           {subject.enrolls} enrolls
//                         </Badge>
//                       </div>
//                     ))
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-64">
//                     <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
//                     <p className="text-muted-foreground">
//                       No subject data available
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>

//         {/* New Enrollments */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <GraduationCap className="w-5 h-5" />
//               New Enrollments
//             </CardTitle>
//             <CardDescription>Recent student enrollments</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Student</TableHead>
//                   <TableHead>Plan</TableHead>
//                   <TableHead>Start Date</TableHead>
//                   <TableHead>End Date</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {newEnrollments?.length > 0 ? (
//                   newEnrollments.map((enrollment) => (
//                     <TableRow key={enrollment._id}>
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           <Avatar className="w-8 h-8">
//                             <AvatarImage
//                               src={enrollment.user?.user_image?.url}
//                               alt={enrollment.user?.username}
//                             />
//                             <AvatarFallback>
//                               {enrollment.user?.username
//                                 .split(" ")
//                                 .map((n) => n[0])
//                                 .join("")}
//                             </AvatarFallback>
//                           </Avatar>
//                           <span>{enrollment.user?.username}</span>
//                         </div>
//                       </TableCell>
//                       <TableCell>{enrollment?.plan}</TableCell>
//                       <TableCell>
//                         {format(new Date(enrollment.startDate), "dd/MM/yyyy")}
//                       </TableCell>
//                       <TableCell>
//                         {format(new Date(enrollment.endDate), "dd/MM/yyyy")}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={4} className="text-center h-32">
//                       <div className="flex flex-col items-center justify-center">
//                         <Sparkles className="w-10 h-10 text-muted-foreground mb-2" />
//                         <p className="text-muted-foreground">
//                           No new enrollments
//                         </p>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//           <CardFooter className="justify-center">
//             {newEnrollments?.length > 0 && (
//               <Badge variant="outline" className="mt-2">
//                 {newEnrollments.length} new enrollment(s)
//               </Badge>
//             )}
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Overview;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Users,
  ArrowDownIcon,
  ArrowUpIcon,
  BookA,
  DollarSignIcon,
  GraduationCap,
  PackageIcon,
  UsersIcon,
  Banknote,
  Loader2,
  EllipsisVertical,
} from "lucide-react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedUser } from "@/store/authSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationDropdown from "@/components/NotificationDropdown";
import { fetchUserNotifications } from "@/store/notificationSlice";
import { fetchAnalytics } from "@/store/adminanalyticsSlice";
import {
  fetchPlatformMetrics,
  fetchPendingMonthlyRevenues,
} from "@/store/revenueSlice";
import { format } from "date-fns";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

// Enregistrer les composants ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Overview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector(loggedUser);
  const {
    notifications,
    isLoading,
    error: notificationError,
  } = useSelector((state) => state.notifications);
  const [timeframe, setTimeframe] = useState("this_month");

  const {
    totalUsers,
    onlineUsers,
    totalStudents,
    studentsStats,
    totalTeachers,
    teachersStats,
    topTeachers,
    topSubjects,
    newEnrollments,
    growth,
    status,
    error,
  } = useSelector((state) => state.analytics);

  const {
    platformMetrics,
    pendingMonthlyRevenues,
    status: revenueStatus,
    error: revenueError,
  } = useSelector((state) => state.revenue);

  useEffect(() => {
    dispatch(
      fetchAnalytics({
        timeframe,
      })
    );

    // Récupérer les données de revenus
    dispatch(fetchPlatformMetrics({ timeframe: "all" }));
    dispatch(fetchPendingMonthlyRevenues());
  }, [dispatch, timeframe]);

  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchUserNotifications(authUser.id));
    }
  }, [authUser?.id, dispatch]);

  const refreshNotifications = () => {
    dispatch(fetchUserNotifications(authUser.id));
  };

  const manageStudents = () => {
    navigate("/students");
  };

  const manageTeachers = () => {
    navigate("/teachers");
  };

  // Calculer le total des paiements en attente
  const pendingPayoutsTotal =
    pendingMonthlyRevenues?.reduce(
      (sum, revenue) => sum + revenue.totalAmount,
      0
    ) || 0;

  // Graphique de répartition des élèves
  const studentBarColors = [
    "rgba(0, 163, 224, 0.7)",
    "rgba(76, 175, 80, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(255, 205, 86, 0.7)",
  ];

  const studentChartData = {
    labels:
      studentsStats?.map(
        (stat) => `${stat._id.educationalCycle} - ${stat._id.educationalLevel}`
      ) || [],
    datasets: [
      {
        label: "Nombre d'élèves",
        data: studentsStats?.map((stat) => stat.count) || [],
        backgroundColor: studentBarColors,
        borderRadius: 8,
        barThickness: 30,
      },
    ],
    total: studentsStats?.reduce((sum, stat) => sum + stat.count, 0) || 0,
  };

  const studentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Répartition des élèves (${studentChartData.total} élèves)`,
        font: { size: 14, weight: "bold" },
      },
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
    },
  };

  // Graphique de répartition des enseignants
  const teacherBarColors = [
    "#4C6EF5",
    "#FF9F43",
    "#FFCD56",
    "#FF6384",
    "#36A2EB",
  ];

  const teacherChartData = {
    labels: teachersStats?.map((stat) => stat._id) || [],
    datasets: [
      {
        label: "Nombre d'enseignants",
        data: teachersStats?.map((stat) => stat.count) || [],
        backgroundColor: teacherBarColors,
        borderRadius: 8,
        barThickness: 30,
      },
    ],
    total: teachersStats?.reduce((sum, stat) => sum + stat.count, 0) || 0,
  };

  const teacherChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Répartition par discipline (${teacherChartData.total} enseignants)`,
        font: { size: 16, weight: "bold" },
      },
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
    },
  };

  if (!authUser) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "failed" || revenueStatus === "failed") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center text-red-500">
            Erreur : {error || revenueError}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* En-tête du profil administrateur */}
      <Card>
        <div className="flex justify-end m-2">
          <NotificationDropdown
            notifications={notifications}
            isLoading={isLoading}
            notificationError={notificationError}
            userId={authUser?.id}
            onRefresh={refreshNotifications}
          />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={authUser.user_image?.url || "/placeholder.svg"}
                  alt={authUser.username}
                />
                <AvatarFallback className="text-2xl">
                  {authUser.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-row flex-wrap justify-center sm:justify-start items-center gap-3">
                <h1 className="text-2xl font-bold">{authUser.username}</h1>
                <Badge className="bg-purple-100 text-purple-800 whitespace-nowrap">
                  {authUser.role}
                </Badge>
                {authUser.isOnline && (
                  <Badge className="bg-green-100 text-green-800 flex items-center whitespace-nowrap">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    En ligne
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 text-sm text-muted-foreground items-center sm:items-start justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {authUser.email}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed pb-5 mx-4 sm:mx-0">
                {authUser.bio || "Aucune biographie disponible"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {(status === "loading" || revenueStatus === "loading") && (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )}

      {/* Métriques récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl shadow-inner">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold tabular-nums text-foreground">
                  {totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total utilisateurs
                </p>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {growth.totalUsersGrowth > 0 ? (
                    <ArrowUpIcon className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 text-red-500" />
                  )}
                  <span>{growth.totalUsersGrowth.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl shadow-inner">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold tabular-nums text-foreground">
                  {totalStudents.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total élèves</p>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {growth.totalStudentsGrowth > 0 ? (
                    <ArrowUpIcon className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 text-red-500" />
                  )}
                  <span>{growth.totalStudentsGrowth.toFixed(2)}%</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted"
                  aria-label="Menu élèves"
                >
                  <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs"
                    onClick={manageStudents}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Gérer les élèves
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
        </Card>

        <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl shadow-inner">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold tabular-nums text-foreground">
                  {totalTeachers.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Enseignants actifs
                </p>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {growth.totalTeachersGrowth > 0 ? (
                    <ArrowUpIcon className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 text-red-500" />
                  )}
                  <span>{growth.totalTeachersGrowth.toFixed(2)}%</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted"
                  aria-label="Menu enseignants"
                >
                  <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs"
                    onClick={manageTeachers}
                  >
                    <Users className="w-4 h-4" />
                    Gérer les enseignants
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
        </Card>

        <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl shadow-inner">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold tabular-nums text-foreground">
                  {onlineUsers.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Utilisateurs en ligne
                </p>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {onlineUsers > 1 ? (
                    <ArrowUpIcon className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 text-red-500" />
                  )}
                  <span>
                    {((onlineUsers / totalUsers) * 100).toFixed(2)}% des
                    utilisateurs
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <DollarSignIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {revenueStatus === "loading" ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    `${(platformMetrics?.totalAmount || 0).toFixed(2)} MAD`
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Revenus de la plateforme
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Banknote className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {revenueStatus === "loading" ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    `${pendingPayoutsTotal.toFixed(2)} MAD`
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Paiements en attente
                </p>
                <div className="text-xs mt-1">
                  {pendingMonthlyRevenues.length} enseignants en attente de
                  paiement
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Répartition des élèves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {studentsStats?.length > 0 ? (
                <Bar data={studentChartData} options={studentChartOptions} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Aucune donnée d'élève disponible
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Graphique de répartition des enseignants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Répartition des enseignants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {teachersStats?.length > 0 ? (
                <Bar data={teacherChartData} options={teacherChartOptions} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Aucune donnée d'enseignant disponible
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meilleurs enseignants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon className="w-5 h-5" />
              Meilleurs enseignants
            </CardTitle>
            <CardDescription>Enseignants les plus actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {topTeachers?.length > 0 ? (
                  topTeachers.map((teacher, index) => (
                    <div
                      key={teacher._id || index}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={teacher.teacherInfo[0]?.user_image?.url}
                          alt={teacher.teacherInfo[0]?.username}
                        />
                        <AvatarFallback>
                          {teacher.teacherInfo[0]?.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {teacher.teacherInfo[0]?.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {teacher.teacherInfo[0]?.discipline}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{teacher.totalCourses}</p>
                        <p className="text-sm text-muted-foreground">cours</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucune donnée sur les enseignants
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Matières populaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookA className="w-5 h-5" />
              Matières populaires
            </CardTitle>
            <CardDescription>Matières les plus suivies</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {topSubjects && topSubjects.length > 0 ? (
                  topSubjects.some((subject) => subject.enrolls > 0) ? (
                    topSubjects
                      .filter((subject) => subject.enrolls > 0)
                      .sort((a, b) => b.enrolls - a.enrolls)
                      .slice(0, 8)
                      .map((subject, index) => (
                        <div
                          key={subject._id || index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <p className="font-medium">{subject.title}</p>
                          <Badge variant="secondary">
                            {subject.enrolls} inscriptions
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                      <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Aucune matière n’a encore d’inscriptions.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucune donnée de matière disponible.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Nouvelles inscriptions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Nouvelles inscriptions
            </CardTitle>
            <CardDescription>Inscriptions récentes d'élèves</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead>Formule</TableHead>
                  <TableHead>Date de début</TableHead>
                  <TableHead>Date de fin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newEnrollments?.length > 0 ? (
                  newEnrollments.map((enrollment) => (
                    <TableRow key={enrollment._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={enrollment.user?.user_image?.url}
                              alt={enrollment.user?.username}
                            />
                            <AvatarFallback>
                              {enrollment.user?.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{enrollment.user?.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment?.plan}</TableCell>
                      <TableCell>
                        {format(new Date(enrollment.startDate), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(enrollment.endDate), "dd/MM/yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32">
                      <div className="flex flex-col items-center justify-center">
                        <Sparkles className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          Aucune nouvelle inscription
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-center">
            {newEnrollments?.length > 0 && (
              <Badge variant="outline" className="mt-2">
                {newEnrollments.length} nouvelle(s) inscription(s)
              </Badge>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
