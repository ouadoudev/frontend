// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Mail,
//   BookOpen,
//   Users,
//   GraduationCap,
//   GrabIcon,
//   School2,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { Sparkles } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { loggedUser } from "@/store/authSlice";
// import { fetchCourses } from "@/store/courseSlice";
// import { fetchSubjectById } from "@/store/subjectSlice";
// import { fetchReviews } from "@/store/reviewSlice";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { fetchUserById } from "@/store/userSlice";
// import NotificationDropdown from "@/components/NotificationDropdown";
// import { fetchUserNotifications } from "@/store/notificationSlice";

// const TeacherProfile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const authUser = useSelector(loggedUser);
//   const { notifications, isLoading, error: notificationError } = useSelector((state) => state.notifications);
//   const teacher = useSelector((state) => state.user.user); 
//   const [subjectsData, setSubjectsData] = useState({});
//   const [reviewsData, setReviewsData] = useState({});
//   const [teacherCourses, setTeacherCourses] = useState([]);

//   const {
//     courses = [],
//     status = "idle",
//     error = null,
//   } = useSelector((state) => state.courses);

//   const { status: reviewsStatus, error: reviewsError } = useSelector(
//     (state) => state.reviews || { reviews: [], status: "idle", error: null }
//   );

//   // Fetch full teacher info on mount
//   useEffect(() => {
//     if (authUser?.id) {
//       dispatch(fetchUserById(authUser.id));
//     }
//   }, [dispatch, authUser?.id]);

//    useEffect(() => {
//     if (authUser?.id) {
//       dispatch(fetchUserNotifications(authUser.id));
//     }
//   }, [authUser?.id, dispatch]);

//   const refreshNotifications = () => {
//     dispatch(fetchUserNotifications(authUser.id));
//   };

//   // Fetch all courses
//   useEffect(() => {
//     dispatch(fetchCourses());
//   }, [dispatch]);

//   // Filter courses taught by this teacher
//   useEffect(() => {
//     if (courses.length > 0 && teacher?.username) {
//       const filteredCourses = courses.filter(
//         (course) => course.teacher?.username === teacher.username
//       );
//       setTeacherCourses(filteredCourses);
//     }
//   }, [courses, teacher?.username]);

//   // Fetch subjects + reviews for each course
//   useEffect(() => {
//     if (teacherCourses.length > 0) {
//       const fetchSubjects = async () => {
//         const subjectPromises = teacherCourses
//           .filter((course) => typeof course.subject === "string")
//           .map(async (course) => {
//             const result = await dispatch(fetchSubjectById(course.subject));
//             return { subjectId: course.subject, data: result.payload };
//           });

//         const resolved = await Promise.all(subjectPromises);
//         const map = {};
//         resolved.forEach(({ subjectId, data }) => {
//           if (data) map[subjectId] = data;
//         });
//         setSubjectsData(map);
//       };

//       const fetchCourseReviews = async () => {
//         const reviewPromises = teacherCourses.map(async (course) => {
//           const result = await dispatch(fetchReviews({ courseId: course._id }));
//           return { courseId: course._id, reviews: result.payload };
//         });

//         const reviews = await Promise.all(reviewPromises);
//         const map = {};
//         reviews.forEach(({ courseId, reviews }) => {
//           map[courseId] = reviews;
//         });
//         setReviewsData(map);
//       };

//       fetchSubjects();
//       fetchCourseReviews();
//     }
//   }, [teacherCourses, dispatch]);


//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case "teacher":
//         return "bg-blue-100 text-blue-800";
//       case "admin":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//     const getDirection = (text) => {
//     const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
//     return rtlChars.test(text) ? "rtl" : "ltr";
//   };

// const totalStudents = teacher?.students?.length || 0;

//   const totalCourses = teacherCourses?.length || 0;

//   const allReviews = Object.values(reviewsData).flat();
//   const averageRating =
//     allReviews.length > 0
//       ? (
//           allReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
//           allReviews.length
//         ).toFixed(1)
//       : "0.0";

//   const students = teacher?.students || [];

//   if (!teacher) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-center h-64">
//               <div className="text-center space-y-2">
//                 <p className="text-muted-foreground">Teacher not found</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-6">
//       <Card>
//         <div className="flex justify-end m-2">
//         <NotificationDropdown
//           notifications={notifications}
//           isLoading={isLoading}
//           notificationError={notificationError}
//           userId={authUser?.id}
//           onRefresh={refreshNotifications}
//         />
//       </div>
//         <CardContent className="p-6">
//           <div className="flex flex-col md:flex-row gap-14">
//             <div className="flex-shrink-0 lg:ml-4 mx-auto">
//               <Avatar className="w-32 h-32">
//                 <AvatarImage
//                   src={
//                     teacher.user_image?.url ||
//                     "/placeholder.svg?height=120&width=120" ||
//                     "/placeholder.svg"
//                   }
//                   alt={teacher.username || "Unknown Teacher"}
//                 />
//                 <AvatarFallback className="text-2xl">
//                   {(teacher.username || "Unknown Teacher")
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </AvatarFallback>
//               </Avatar>
//             </div>
//             <div className="flex-1 space-y-4">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                 <h1 className="text-xl text-center font-bold lg:text-3xl">
//                   {teacher.username || "Unknown Teacher"}
//                 </h1>
//                 <div className="flex gap-2">
//                   <Badge className={getRoleBadgeColor(teacher.role)}>
//                     {teacher.role?.charAt(0).toUpperCase() +
//                       teacher.role?.slice(1)}
//                   </Badge>
//                   {teacher.isOnline && (
//                     <Badge className="bg-green-100 text-green-800">
//                       <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
//                       Online
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-2">
//                   <GraduationCap className="w-4 h-4" />
//                   {teacher.discipline || "No discipline specified"}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <School2 className="w-4 h-4" />
//                   {teacher.educationalCycles[0] || "No discipline specified"}
//                 </div>
//               </div>
//               <p className="text-muted-foreground leading-relaxed pb-5 m-4 w-[620px]"
//               dir={getDirection(teacher.bio )}>
//                 {teacher.bio || "No bio available"}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <BookOpen className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-center">{totalCourses}</p>
//                 <p className="text-sm text-muted-foreground">Active Courses</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <Users className="w-6 h-6 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-center">
//                   {totalStudents}
//                 </p>
//                 <p className="text-sm text-muted-foreground">Total Students</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-yellow-100 rounded-lg">
//                 <GraduationCap className="w-6 h-6 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-center">
//                   {averageRating}
//                 </p>
//                 <p className="text-sm text-muted-foreground">Average Rating</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BookOpen className="w-5 h-5" />
//               Current Courses
//             </CardTitle>
//             <CardDescription>Active courses this semester</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-80 px-4">
//               <div className="space-y-3">
//                 {status === "loading" && (
//                   <p className="text-muted-foreground text-center py-4">
//                     Loading courses...
//                   </p>
//                 )}
//                 {status === "failed" && (
//                   <p className="text-red-600 text-center py-4">
//                     {error || "Failed to load courses"}
//                   </p>
//                 )}
//                 {status === "succeeded" &&
//                 teacherCourses &&
//                 teacherCourses.length > 0
//                   ? teacherCourses.map((course, index) => {
//                       const subjectData = subjectsData[course.subject];
//                       const courseReviews = reviewsData[course._id] || [];
//                       const courseReviewCount = courseReviews.length;
//                       return (
//                         <div
//                           key={course._id || index}
//                           className="flex items-center justify-between p-3 border rounded-lg"
//                         >
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-1">
//                               <p className="font-medium">
//                                 {course.title || "Untitled Course"}
//                               </p>
//                             </div>
//                             <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                               {subjectsData[course.subject] && (
//                                 <span className="flex items-center gap-1">
//                                   <GraduationCap className="w-3 h-3" />
//                                   {subjectsData[course.subject].title}
//                                 </span>
//                               )}
//                               <span className="flex items-center gap-1">
//                                 <Users className="w-3 h-3" />
//                                 {courseReviewCount} reviews
//                               </span>
//                             </div>
//                           </div>
//                           <div className="text-right ml-4">
//                             <p className="font-medium text-lg text-center">
//                               {course.enrolls || 0}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               students
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })
//                   : status === "succeeded" && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                         className="text-center mt-2"
//                       >
//                         <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                         <h3 className="text-2xl font-semibold mb-2">
//                           No courses found
//                         </h3>
//                         <p className="text-muted-foreground">
//                           No courses are available at the moment.
//                         </p>
//                       </motion.div>
//                     )}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>

//    <Card className="w-full">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="w-5 h-5" />
//             Students List
//           </CardTitle>
//           <CardDescription>
//             {students.length} enrolled {students.length === 1 ? "student" : "students"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ScrollArea className="h-96 px-4">
//             {students.length > 0 ? (
//               students.map((student) => (
//                 <div
//                   key={student._id}
//                   className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
//                 >
//                   <Avatar className="h-12 w-12">
//                     <AvatarImage
//                       src={student.user_image?.url || "/placeholder.svg"}
//                       alt={student.username}
//                     />
//                     <AvatarFallback>
//                       {student.username?.split(" ").map((n) => n[0]).join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 space-y-1">
//                     <div className="flex items-center justify-between">
//                       <h4 className="font-semibold text-sm">{student.username}</h4>
//                       <Badge variant="default" className="text-xs">Active</Badge>
//                     </div>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <span>{student.educationalCycle}</span>
//                       <span>{student.educationalLevel}</span>
//                       <span>{student.stream}</span>
//                     </div>
//                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                       <Mail className="w-3 h-3" />
//                       {student.email}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center text-muted-foreground">
//                 No students enrolled yet.
//               </div>
//             )}
//           </ScrollArea>
//         </CardContent>
//       </Card>
//       </div>

//       {/* Testimonials Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="w-5 h-5" />
//             Student Testimonials
//           </CardTitle>
//           <CardDescription>
//             What students say about this teacher
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {reviewsStatus === "loading" && (
//               <p className="text-muted-foreground text-center py-4">
//                 Loading reviews...
//               </p>
//             )}
//             {reviewsStatus === "failed" && (
//               <p className="text-red-600 text-center py-4">
//                 {reviewsError || "Failed to load reviews"}
//               </p>
//             )}
//             {reviewsStatus === "succeeded" && allReviews.length > 0 ? (
//               allReviews.slice(0, 6).map((testimonial, index) => {
//                 const course = teacherCourses.find(
//                   (c) => c._id === testimonial.courseId
//                 );
//                 return (
//                   <div
//                     key={testimonial._id || index}
//                     className="p-4 border rounded-lg bg-gray-50"
//                   >
//                     <div className="flex items-start gap-3">
//                       <Avatar className="w-10 h-10">
//                         <AvatarImage
//                           src={
//                             testimonial.user?.user_image?.url ||
//                             "/placeholder.svg?height=40&width=40" ||
//                             "/placeholder.svg"
//                           }
//                           alt={testimonial.user?.username || "Student"}
//                         />
//                         <AvatarFallback>
//                           {(testimonial.user?.username || "S")
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2">
//                           <p className="font-medium text-sm">
//                             {testimonial.user?.username || "Anonymous Student"}
//                           </p>
//                           <div className="flex items-center gap-1">
//                             {[...Array(5)].map((_, i) => (
//                               <svg
//                                 key={i}
//                                 className={`w-4 h-4 ${
//                                   i < (testimonial.rating || 0)
//                                     ? "text-yellow-400 fill-current"
//                                     : "text-gray-300"
//                                 }`}
//                                 viewBox="0 0 20 20"
//                               >
//                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                               </svg>
//                             ))}
//                           </div>
//                           <span className="text-xs text-muted-foreground">
//                             {testimonial.createdAt
//                               ? new Date(
//                                   testimonial.createdAt
//                                 ).toLocaleDateString("en-US", {
//                                   day: "2-digit",
//                                   month: "short",
//                                   year: "numeric",
//                                 })
//                               : ""}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-700 leading-relaxed">
//                           "{testimonial.comment || "Great teacher!"}"
//                         </p>
//                         {course && (
//                           <p className="text-xs text-muted-foreground mt-2">
//                             Course: {course.title}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="text-center mt-2"
//               >
//                 <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                 <h3 className="text-2xl font-semibold mb-2">
//                   No reviews found
//                 </h3>
//                 <p className="text-muted-foreground">
//                   No reviews have been published yet.
//                 </p>
//               </motion.div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default TeacherProfile;

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  BookOpen,
  Users,
  GraduationCap,
  School2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loggedUser } from "@/store/authSlice";
import { fetchCourses } from "@/store/courseSlice";
import { fetchSubjectById } from "@/store/subjectSlice";
import { fetchReviews } from "@/store/reviewSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchUserById } from "@/store/userSlice";
import NotificationDropdown from "@/components/NotificationDropdown";
import { fetchUserNotifications } from "@/store/notificationSlice";

const TeacherProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector(loggedUser);
  const {
    notifications,
    isLoading,
    error: notificationError,
  } = useSelector((state) => state.notifications);
  const teacher = useSelector((state) => state.user.user);
  const [subjectsData, setSubjectsData] = useState({});
  const [reviewsData, setReviewsData] = useState({});
  const [teacherCourses, setTeacherCourses] = useState([]);

  const {
    courses = [],
    status = "idle",
    error = null,
  } = useSelector((state) => state.courses);

  const { status: reviewsStatus, error: reviewsError } = useSelector(
    (state) => state.reviews || { reviews: [], status: "idle", error: null }
  );

  // Fetch full teacher info on mount
  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchUserById(authUser.id));
    }
  }, [dispatch, authUser?.id]);

  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchUserNotifications(authUser.id));
    }
  }, [authUser?.id, dispatch]);

  const refreshNotifications = () => {
    dispatch(fetchUserNotifications(authUser.id));
  };

  // Fetch all courses
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Filter courses taught by this teacher
  useEffect(() => {
    if (courses.length > 0 && teacher?.username) {
      const filteredCourses = courses.filter(
        (course) => course.teacher?.username === teacher.username
      );
      setTeacherCourses(filteredCourses);
    }
  }, [courses, teacher?.username]);

  // Fetch subjects + reviews for each course
  useEffect(() => {
    if (teacherCourses.length > 0) {
      const fetchSubjects = async () => {
        const subjectPromises = teacherCourses
          .filter((course) => typeof course.subject === "string")
          .map(async (course) => {
            const result = await dispatch(fetchSubjectById(course.subject));
            return { subjectId: course.subject, data: result.payload };
          });

        const resolved = await Promise.all(subjectPromises);
        const map = {};
        resolved.forEach(({ subjectId, data }) => {
          if (data) map[subjectId] = data;
        });
        setSubjectsData(map);
      };

      const fetchCourseReviews = async () => {
        const reviewPromises = teacherCourses.map(async (course) => {
          const result = await dispatch(fetchReviews({ courseId: course._id }));
          return { courseId: course._id, reviews: result.payload };
        });

        const reviews = await Promise.all(reviewPromises);
        const map = {};
        reviews.forEach(({ courseId, reviews }) => {
          map[courseId] = reviews;
        });
        setReviewsData(map);
      };

      fetchSubjects();
      fetchCourseReviews();
    }
  }, [teacherCourses, dispatch]);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "teacher":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const totalStudents = teacher?.students?.length || 0;

  const totalCourses = teacherCourses?.length || 0;

  const allReviews = Object.values(reviewsData).flat();
  const averageRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          allReviews.length
        ).toFixed(1)
      : "0.0";

  const students = teacher?.students || [];

  if (!teacher) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Teacher not found</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
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
        <CardContent className="p-4 ">
          <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-center md:items-start">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage
                  src={
                    teacher.user_image?.url ||
                    "/placeholder.svg?height=120&width=120" ||
                    "/placeholder.svg"
                  }
                  alt={teacher.username || "Unknown Teacher"}
                />
                <AvatarFallback className="text-xl sm:text-2xl">
                  {(teacher.username || "Unknown Teacher")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center md:justify-start">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {teacher.username || "Unknown Teacher"}
                </h1>
                <div className="flex gap-2 justify-center md:justify-start">
                  <Badge className={getRoleBadgeColor(teacher.role)}>
                    {teacher.role?.charAt(0).toUpperCase() +
                      teacher.role?.slice(1)}
                  </Badge>
                  {teacher.isOnline && (
                    <Badge className="bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <GraduationCap className="w-4 h-4" />
                  {teacher.discipline || "No discipline specified"}
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <School2 className="w-4 h-4" />
                  {teacher.educationalCycles[0] || "No discipline specified"}
                </div>
              </div>
              <p
                className="text-muted-foreground leading-relaxed max-w-[620px] mx-auto md:mx-0"
                dir={getDirection(teacher.bio)}
              >
                {teacher.bio || "No bio available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 lg:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold">
                    {totalCourses}
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Active Courses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold">
                    {totalStudents}
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Total Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold">
                    {averageRating}
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Average Rating
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center galg:p-2 text-lg sm:text-xl">
              Current Courses
            </CardTitle>
            <CardDescription>Active courses this semester</CardDescription>
          </CardHeader>
          <CardContent className="p-4 ">
            <ScrollArea className="h-80 px-1">
              <div className="space-y-3">
                {status === "loading" && (
                  <p className="text-muted-foreground text-center py-4">
                    Loading courses...
                  </p>
                )}
                {status === "failed" && (
                  <p className="text-red-600 text-center py-4">
                    {error || "Failed to load courses"}
                  </p>
                )}
                {status === "succeeded" &&
                teacherCourses &&
                teacherCourses.length > 0
                  ? teacherCourses.map((course, index) => {
                      const subjectData = subjectsData[course.subject];
                      const courseReviews = reviewsData[course._id] || [];
                      const courseReviewCount = courseReviews.length;
                      return (
                        <div
                          key={course._id || index}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm md:text-base truncate">
                                {course.title || "Untitled Course"}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              {subjectData && (
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  {subjectData.title}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {courseReviewCount} reviews
                              </span>
                            </div>
                          </div>
                          <div className="hidden sm:block text-left sm:text-right shrink-0">
                            <p className="font-semibold text-base md:text-lg">
                              {course.enrolls || 0}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              students
                            </p>
                          </div>
                        </div>
                      );
                    })
                  : status === "succeeded" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mt-2"
                      >
                        <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">
                          No courses found
                        </h3>
                        <p className="text-muted-foreground">
                          No courses are available at the moment.
                        </p>
                      </motion.div>
                    )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Students List
            </CardTitle>
            <CardDescription>
              {students.length} enrolled{" "}
              {students.length === 1 ? "student" : "students"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 px-4">
              {students.length > 0 ? (
                students.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={student.user_image?.url || "/placeholder.svg"}
                        alt={student.username}
                      />
                      <AvatarFallback>
                        {student.username
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">
                          {student.username}
                        </h4>
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{student.educationalCycle}</span>
                        <span>{student.educationalLevel}</span>
                        <span>{student.stream}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {student.email}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No students enrolled yet.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Student Testimonials
          </CardTitle>
          <CardDescription>
            What students say about this teacher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewsStatus === "loading" && (
              <p className="text-muted-foreground text-center py-4">
                Loading reviews...
              </p>
            )}
            {reviewsStatus === "failed" && (
              <p className="text-red-600 text-center py-4">
                {reviewsError || "Failed to load reviews"}
              </p>
            )}
            {reviewsStatus === "succeeded" && allReviews.length > 0 ? (
              allReviews.slice(0, 6).map((testimonial, index) => {
                const course = teacherCourses.find(
                  (c) => c._id === testimonial.courseId
                );
                return (
                  <div
                    key={testimonial._id || index}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            testimonial.user?.user_image?.url ||
                            "/placeholder.svg?height=40&width=40" ||
                            "/placeholder.svg"
                          }
                          alt={testimonial.user?.username || "Student"}
                        />
                        <AvatarFallback>
                          {(testimonial.user?.username || "S")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-sm">
                            {testimonial.user?.username || "Anonymous Student"}
                          </p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (testimonial.rating || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {testimonial.createdAt
                              ? new Date(
                                  testimonial.createdAt
                                ).toLocaleDateString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          "{testimonial.comment || "Great teacher!"}"
                        </p>
                        {course && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Course: {course.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mt-2"
              >
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  No reviews found
                </h3>
                <p className="text-muted-foreground">
                  No reviews have been published yet.
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfile;