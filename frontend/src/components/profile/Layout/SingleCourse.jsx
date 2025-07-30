// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { ClockIcon, UsersIcon } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import { fetchCourseById } from '@/store/courseSlice';
// import { useEffect } from "react";

// const SingleCourse = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { course, error, status } = useSelector((state) => state.courses);

//   useEffect(() => {
//     dispatch(fetchCourseById(id));
//   }, [dispatch, id]);

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (status === 'failed') {
//     return <div>Error: {error}</div>;
//   }
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
//       <Card className="col-span-1 md:col-span-2">
//         <CardHeader>
//           {course.thumbnail}
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
//               {course.title}
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400">
//               {course.description}
//             </p>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 {course.duration} hours
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 {course.enrolledStudents} students
//               </span>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button className="w-full">Enroll Now</Button>
//         </CardFooter>
//       </Card>
//       <Card>
//         <CardHeader>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
//             Course Details
//           </h3>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <h4 className="text-base font-medium text-gray-900 dark:text-gray-50">
//               What you'll learn
//             </h4>
//             <ul className="list-disc space-y-2 pl-4 text-gray-600 dark:text-gray-400">
//               {course.learningOutcomes?.map((item) => (
//                 <li key={item}>{item}</li>
//               ))}
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-base font-medium text-gray-900 dark:text-gray-50">
//               Requirements
//             </h4>
//             <ul className="list-disc space-y-2 pl-4 text-gray-600 dark:text-gray-400">
//               {course.requirements?.map((item) => (
//                 <li key={item}>{item}</li>
//               ))}
//             </ul>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SingleCourse

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { ClockIcon, UsersIcon } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import { fetchCourseById } from '@/store/courseSlice';
// import { useEffect } from "react";

// const SingleCourse = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { course, error, status } = useSelector((state) => state.courses);

//   useEffect(() => {
//     dispatch(fetchCourseById(id));
//   }, [dispatch, id]);

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (status === 'failed') {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
//       <Card className="col-span-1 md:col-span-2">
//         <CardHeader>
//           {course.thumbnail}
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
//               {course.title}
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400">
//               {course.description}
//             </p>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 {course.duration} hours
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 {course.enrolledStudents} students
//               </span>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button className="w-full">Enroll Now</Button>
//         </CardFooter>
//       </Card>
//       <Card>
//         <CardHeader>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
//             Course Details
//           </h3>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <h4 className="text-base font-medium text-gray-900 dark:text-gray-50">
//               What you'll learn
//             </h4>
//             <ul className="list-disc space-y-2 pl-4 text-gray-600 dark:text-gray-400">
//               {course.learningOutcomes?.map((item) => (
//                 <li key={item}>{item}</li>
//               ))}
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-base font-medium text-gray-900 dark:text-gray-50">
//               Requirements
//             </h4>
//             <ul className="list-disc space-y-2 pl-4 text-gray-600 dark:text-gray-400">
//               {course.requirements?.map((item) => (
//                 <li key={item}>{item}</li>
//               ))}
//             </ul>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SingleCourse;

import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '@/store/courseSlice'; // Path to your thunk file

const SingleCourse = (courseId ) => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Course Details</h2>
      <p>Course ID: {data.id}</p>
      <p>Course Name: {data.name}</p>
      {/* Render other details */}
    </div>
  );
};

export default SingleCourse;
