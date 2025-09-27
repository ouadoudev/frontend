// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { loggedUser } from "@/store/authSlice";
// import {
//   fetchCourseById,
//   fetchLessonsByCourseId,
//   startCourse,
// } from "@/store/courseSlice";
// import { fetchCourseProgress } from "@/store/courseProgressSlice";
// import { createConversation } from "@/store/conversationSlice";
// import ReviewForm from "@/components/ReviewForm";
// import ReviewList from "@/components/ReviewList";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useNavigate, useParams } from "react-router-dom";
// import { Progress } from "@/components/ui/progress";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   BookOpen,
//   CheckCircle,
//   Clock,
//   GraduationCapIcon,
//   Info,
//   Lightbulb,
//   PlayCircle,
//   School2Icon,
//   Star,
//   Users,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// const Course = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { course, lessons, status, error } = useSelector(
//     (state) => state.courses
//   );
//   const user = useSelector(loggedUser);
//   const { progress } = useSelector((state) => state.courseProgress);

//   useEffect(() => {
//     dispatch(fetchCourseById(id));
//     dispatch(fetchLessonsByCourseId(id));
//     dispatch(fetchCourseProgress(id));
//   }, [dispatch, id]);

//   const handlePlayLesson = (lessonId) => {
//     navigate(`/lessons/${lessonId}`);
//   };

//   const handleContactInstructor = () => {
//     dispatch(
//       createConversation({
//         userId: user.id,
//         teacherId: course.teacher._id,
//         groupTitle: course.title,
//       })
//     ).then((action) => {
//       if (action.meta.requestStatus === "fulfilled") {
//         navigate("/messages");
//       }
//     });
//   };

//   const handleStartNow = async () => {
//     if (!progress) {
//       navigate(`/lessons/${lessons[0]._id}`);
//       await dispatch(startCourse(course._id));
//     } else {
//       const incompleteLesson = lessons.find(
//         (lesson) =>
//           !progress.completedLessons.some((cl) => cl.lesson._id === lesson._id)
//       );

//       if (incompleteLesson) {
//         navigate(`/lessons/${incompleteLesson._id}`);
//       } else {
//         navigate(`/certificate`);
//       }
//     }
//   };

//   const handlePlayExercise = (exerciseId) => {
//     navigate(`/exercise/${exerciseId}`);
//   };

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = Math.floor(seconds % 60);

//     return [
//       minutes.toString().padStart(2, "0"),
//       secs.toString().padStart(2, "0"),
//     ].join(":");
//   };

//   const getDirection = (text) => {
//     const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
//     return rtlChars.test(text) ? "rtl" : "ltr";
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="md:col-span-2">
//           {course && (
//             <Card className="mb-6">
//               <CardHeader className="relative p-0">
//                 <img
//                   src={course.thumbnail?.url || "/placeholder.svg"}
//                   alt="Course cover"
//                   className="w-full h-56 object-cover rounded-t-lg"
//                 />
//                 <div
//                   className={`absolute bottom-4 ${
//                     getDirection(course.title) === "rtl" ? "right-4" : "left-4"
//                   }`}
//                 >
//                   <Badge
//                     variant="secondary"
//                     className="m-2 p-1 text-xl"
//                     dir={getDirection(course.title)}
//                   >
//                     {course.title}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-4">
//                 <p
//                   className="text-muted-foreground"
//                   dir={getDirection(course.description)}
//                 >
//                   {course.description}
//                 </p>

//                 <div
//                   className={`flex items-center mt-4 text-sm text-muted-foreground ${
//                     getDirection(course.title) === "rtl"
//                       ? "flex-row-reverse justify-end"
//                       : "space-x-4"
//                   }`}
//                 >
//                   {[
//                     {
//                       icon: School2Icon,
//                       text: course.subject.educationalCycle,
//                     },
//                     {
//                       icon: GraduationCapIcon,
//                       text: course.subject.educationalLevel,
//                     },
//                     { icon: Clock, text: "8 weeks" },
//                     { icon: Users, text: course.enrolls },
//                   ].map((item, index) => (
//                     <span
//                       key={index}
//                       className={`flex items-center ${
//                         getDirection(course.title) === "rtl" ? "ml-4" : ""
//                       }`}
//                     >
//                       <item.icon
//                         className={`${
//                           getDirection(course.title) === "rtl" ? "ml-1" : "mr-1"
//                         } h-4 w-4`}
//                       />
//                       {item.text}
//                     </span>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter className="flex flex-col justify-between p-4 border-t border-gray-200">
//                 <h3 className="text-lg font-semibold mb-2">Course Progress</h3>
//                 {progress ? (
//                   <>
//                     <div
//                       className={`flex ${
//                         getDirection(course.title) === "rtl"
//                           ? "flex-row-reverse"
//                           : "flex-row"
//                       } mb-3`}
//                     >
//                       <Avatar
//                         className={`h-12 w-12 ${
//                           getDirection(course.title) === "rtl" ? "ml-4" : "mr-4"
//                         }`}
//                       >
//                         <AvatarImage src={user.user_image.url} />
//                       </Avatar>
//                       <h4 className="mt-3">{user.username}</h4>
//                     </div>
//                     <Progress value={progress.progress} max={100} />
//                     <p className="text-sm text-gray-600 mt-1">
//                       {progress.completedLessonsCount} of{" "}
//                       {progress.totalLessons} lessons completed (
//                       {progress.progress?.toFixed(2)}%)
//                     </p>
//                   </>
//                 ) : (
//                   <Button onClick={handleStartNow}>Start Studying Now</Button>
//                 )}
//               </CardFooter>
//             </Card>
//           )}

//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Course Curriculum</CardTitle>
//               <CardDescription>
//                 Expand each module to see the lessons
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div>
//                 {status === "loading" ? (
//                   <div>Loading...</div>
//                 ) : status === "failed" ? (
//                   <div>Error: {error}</div>
//                 ) : (
//                   lessons &&
//                   lessons.map((lesson) => {
//                     const isCompleted = progress?.completedLessons.some(
//                       (cl) => cl.lesson._id === lesson._id
//                     );
//                     return (
//                       // eslint-disable-next-line react/jsx-key
//                       <Accordion type="single" collapsible className="w-full">
//                         <AccordionItem
//                           value={`item-${lesson._id}`}
//                           key={lesson._id}
//                         >
//                           <AccordionTrigger>
//                             <div
//                               className={`flex items-center ${
//                                 getDirection(course?.title) === "rtl"
//                                   ? "flex-row-reverse"
//                                   : ""
//                               }`}
//                             >
//                               {isCompleted ? (
//                                 <CheckCircle
//                                   className={`${
//                                     getDirection(course?.title) === "rtl"
//                                       ? "ml-3"
//                                       : "mr-3"
//                                   } text-green-500 flex-shrink-0`}
//                                 />
//                               ) : (
//                                 <PlayCircle
//                                   className={`${
//                                     getDirection(course?.title) === "rtl"
//                                       ? "ml-3"
//                                       : "mr-3"
//                                   } text-blue-500 flex-shrink-0`}
//                                 />
//                               )}
//                               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
//                                 {lesson.title}
//                               </h3>
//                             </div>
//                           </AccordionTrigger>
//                           <AccordionContent>
//                             <p className="text-sm text-gray-600 mb-2">
//                               {formatDuration(lesson.video?.duration)} minutes
//                             </p>
//                             <Button
//                               variant={isCompleted ? "outline" : "default"}
//                               size="sm"
//                               onClick={() => handlePlayLesson(lesson._id)}
//                             >
//                               {isCompleted ? "Revisit" : "Start"}
//                             </Button>
//                             <div className="mt-4">
//                               <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
//                                 Exercises:
//                               </h4>
//                               <ul className="list-disc list-inside text-gray-600">
//                                 {lesson.exercises.map((exercise) => (
//                                   <li
//                                     key={exercise._id}
//                                     className="text-sm cursor-pointer hover:text-blue-500"
//                                     onClick={() =>
//                                       handlePlayExercise(exercise._id)
//                                     }
//                                   >
//                                     {exercise.title}
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </AccordionContent>
//                         </AccordionItem>
//                       </Accordion>
//                     );
//                   })
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Meet Your Instructor</CardTitle>
//             </CardHeader>
//             <CardContent
//               className={`flex ${
//                 getDirection(course?.title) === "rtl"
//                   ? "flex-row-reverse"
//                   : "flex-row"
//               } items-start space-x-4`}
//             >
//               <Avatar className="h-40 w-40">
//                 <AvatarImage
//                   src={course?.teacher?.user_image.url}
//                   alt="Instructor"
//                 />
//                 <AvatarFallback>{course?.teacher?.username}</AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col gap-2">
//                 <h3 className="text-lg font-semibold">
//                   {" "}
//                   {course?.teacher?.username}
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   With {course?.teacher?.experience} years of experience in{" "}
//                   {course?.teacher?.subject}, {course?.teacher?.username} excels
//                   in creating engaging and effective learning experiences.
//                   Passionate about student success, they bring a dynamic
//                   approach to teaching, blending expertise with a commitment to
//                   nurturing students growth.
//                 </p>

//                 <Button variant="secondary" onClick={handleContactInstructor}>
//                   Contact Instructor
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//           {course && (
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle>What Our Students Say</CardTitle>
//                 <CardDescription>
//                   Hear from those who have taken this course
//                 </CardDescription>
//                 <ReviewForm courseId={course._id} />
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <ReviewList courseId={course._id} />
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <div>
//           <Card className="sticky top-4">
//             <CardHeader>
//               <CardTitle className="flex justify-center text-xl">
//                 {getDirection(course?.title) === "rtl"
//                   ? "تفاصيل الدرس"
//                   : "Détails du Cours"}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <h4
//                   className={`font-bold mb-3 flex items-center text-base ${
//                     getDirection(course?.title) === "rtl"
//                       ? "flex-row-reverse"
//                       : ""
//                   }`}
//                 >
//                   <Lightbulb
//                     className={`${
//                       getDirection(course?.title) === "rtl" ? "ml-2" : "mr-2"
//                     } h-8 w-8`}
//                   />
//                   {getDirection(course?.title) === "rtl"
//                     ? "المهارات المطلوبة:"
//                     : "Compétences nécessaires:"}
//                 </h4>
//                 <ul className="space-y-2">
//                   {course?.prerequisites[0] &&
//                     JSON.parse(course?.prerequisites[0]).map(
//                       (prerequisite, index) => (
//                         <li
//                           key={index}
//                           className={`flex items-start ${
//                             getDirection(course.title) === "rtl"
//                               ? "flex-row-reverse"
//                               : ""
//                           }`}
//                         >
//                           <Info
//                             className={`${
//                               getDirection(course.title) === "rtl"
//                                 ? "ml-2"
//                                 : "mr-2"
//                             } h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5`}
//                           />
//                           <span
//                             className="text-start text-sm "
//                             dir={getDirection(prerequisite)}
//                           >
//                             {prerequisite}
//                           </span>
//                         </li>
//                       )
//                     )}
//                 </ul>
//               </div>
//               <div className="space-y-2">
//                 <h4
//                   className={`font-bold mb-3 flex items-center text-base ${
//                     getDirection(course?.title) === "rtl"
//                       ? "flex-row-reverse"
//                       : ""
//                   }`}
//                 >
//                   <BookOpen
//                     className={`${
//                       getDirection(course?.title) === "rtl" ? "ml-2" : "mr-2"
//                     } h-8 w-8`}
//                   />
//                   {getDirection(course?.title) === "rtl"
//                     ? "ماذا ستتعلم :"
//                     : "Ce que vous allez apprendre :"}
//                 </h4>
//                 <ul className="space-y-2">
//                   {course?.objectives && course.objectives.length > 0 ? (
//                     JSON.parse(course?.objectives[0]).map(
//                       (objective, index) => (
//                         <li
//                           key={index}
//                           className={`flex items-start ${
//                             getDirection(course.title) === "rtl"
//                               ? "flex-row-reverse"
//                               : ""
//                           }`}
//                         >
//                           <CheckCircle
//                             className={`${
//                               getDirection(course.title) === "rtl"
//                                 ? "ml-2"
//                                 : "mr-2"
//                             } h-5 w-5 text-green-500 flex-shrink-0 mt-0.5`}
//                           />
//                           <span
//                             className="text-start text-sm"
//                             dir={getDirection(objective)}
//                           >
//                             {objective}
//                           </span>
//                         </li>
//                       )
//                     )
//                   ) : (
//                     <p>
//                       {" "}
//                       {getDirection(course?.title) === "rtl"
//                         ? "لا توجد أهداف متاحة لهذه الدورة."
//                         : "No objectives available for this course."}
//                     </p>
//                   )}
//                 </ul>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-center">
//               <Button onClick={handleStartNow}>
//                 {lessons.every(
//                   (lesson) =>
//                     !progress?.completedLessons.some(
//                       (cl) => cl.lesson._id === lesson._id
//                     )
//                 )
//                   ? getDirection(course?.title) === "rtl"
//                     ? "ابدأ الدراسة الآن"
//                     : "Start Studying Now"
//                   : lessons.every((lesson) =>
//                       progress?.completedLessons.some(
//                         (cl) => cl.lesson._id === lesson._id
//                       )
//                     )
//                   ? getDirection(course?.title) === "rtl"
//                     ? "تم الحصول على الشهادة"
//                     : "Certificate Completed"
//                   : getDirection(course?.title) === "rtl"
//                   ? "تابع التعلم"
//                   : "Continue Learning"}
//               </Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Course;

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loggedUser } from "@/store/authSlice";
import {
  fetchCourseById,
  fetchLessonsByCourseId,
  startCourse,
} from "@/store/courseSlice";
import { fetchCourseProgress } from "@/store/courseProgressSlice";
import { createConversation } from "@/store/conversationSlice";
import { getAllCourseExams } from "@/store/examSlice";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCapIcon,
  Info,
  Lightbulb,
  PlayCircle,
  School2Icon,
  Users,
  Eye,
  GraduationCap,
  Play,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";
import katex from "katex";
import "katex/dist/katex.min.css";

const MathText = ({ text, dir = "ltr", className = "" }) => {
  if (!text) return null;

  const renderWithKaTeX = (content) => {
    // Regex pour trouver les formules LaTeX entre $$ ou $
    const latexRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = latexRegex.exec(content)) !== null) {
      // Texte avant la formule
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      // La formule LaTeX (avec $$ ou $)
      const latexContent = match[1] || match[2];
      const isDisplayMode = match[1] !== undefined; // $$ pour mode display

      try {
        const html = katex.renderToString(latexContent, {
          displayMode: isDisplayMode,
          throwOnError: false,
          output: "html",
        });
        parts.push(
          <span key={match.index} dangerouslySetInnerHTML={{ __html: html }} />
        );
      } catch (error) {
        console.error("Erreur KaTeX:", error);
        parts.push(`$${latexContent}$`);
      }

      lastIndex = match.index + match[0].length;
    }

    // Texte après la dernière formule
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <span dir={dir} className={className}>
      {renderWithKaTeX(text)}
    </span>
  );
};

const Course = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { course, lessons, status, error } = useSelector(
    (state) => state.courses
  );
  const user = useSelector(loggedUser);
  const { progress } = useSelector((state) => state.courseProgress);
  const { exams, status: examStatus } = useSelector((state) => state.exam);

  useEffect(() => {
    dispatch(fetchCourseById(id));
    dispatch(fetchLessonsByCourseId(id));
    dispatch(fetchCourseProgress(id));
    dispatch(getAllCourseExams(id));
  }, [dispatch, id]);

  const handlePlayLesson = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  const handleContactInstructor = () => {
    dispatch(
      createConversation({
        userId: user.id,
        teacherId: course.teacher._id,
        groupTitle: course.title,
      })
    ).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        if (user.role === "admin" || user.role === "teacher") {
          navigate("/dashboard/messages");
        } else {
          navigate("/messages");
        }
      }
    });
  };

  // const handleStartNow = async () => {
  //   if (!progress) {
  //     navigate(`/lessons/${lessons[0]._id}`);
  //     await dispatch(startCourse(course._id));
  //   } else {
  //     const incompleteLesson = lessons.find(
  //       (lesson) =>
  //         !progress.completedLessons.some((cl) => cl.lesson._id === lesson._id)
  //     );
  //     if (incompleteLesson) {
  //       navigate(`/lessons/${incompleteLesson._id}`);
  //     } else {
  //       navigate(`/certificate`);
  //     }
  //   }
  // };

  const handleStartNow = async () => {
    if (!progress) {
      const firstLesson = lessons[0];

      if (firstLesson?.published) {
        navigate(`/lessons/${firstLesson._id}`);
        await dispatch(startCourse(course._id));
      } else {
        toast.error("This lesson is not published yet.");
      }
    } else {
      const incompleteLesson = lessons.find(
        (lesson) =>
          !progress.completedLessons.some((cl) => cl.lesson._id === lesson._id)
      );

      if (incompleteLesson) {
        if (incompleteLesson.published) {
          navigate(`/lessons/${incompleteLesson._id}`);
        } else {
          toast.error("This lesson is not published yet.");
        }
      } else {
        navigate(`/certificate`);
      }
    }
  };

  const handlePlayExercise = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };

  const handleExamNavigation = (exam) => {
    if (!exam.published) return;

    // Check if lessons are completed (from API response)
    if (exam.lessonsCompleted === false) {
      // Show alert about incomplete lessons
      const incompleteList =
        exam.incompleteLessons?.map((lesson) => lesson.title).join(", ") ||
        "Unknown lessons";

      alert(
        getDirection(course?.title) === "rtl"
          ? `يجب إكمال جميع الدروس قبل إجراء الامتحان.\n\nالدروس غير المكتملة:\n${incompleteList}`
          : `Vous devez terminer toutes les leçons avant de passer l'examen.\n\nLeçons incomplètes:\n${incompleteList}`
      );
      return;
    }

    // Check for user submission
    const userSubmission = exam.submissions?.find((sub) => {
      const subUserId = sub.user?._id || sub.user?.id || sub.user;
      const currentUserId = user._id || user.id;
      return subUserId?.toString() === currentUserId?.toString();
    });

    if (!userSubmission) {
      navigate(`/exam/view/${exam._id}`);
    } else {
      navigate(`/exam/${exam._id}`);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      getDirection(course?.title) === "rtl" ? "ar-SA" : "fr-FR",
      {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-1 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          {course && (
            <Card className="mb-4 sm:mb-6">
              <CardHeader className="relative p-0">
                <img
                  src={course.thumbnail?.url || "/placeholder.svg"}
                  alt="Course cover"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-lg"
                />
                <div
                  className={`absolute bottom-3 sm:bottom-4 ${
                    getDirection(course.title) === "rtl"
                      ? "right-3 sm:right-4"
                      : "left-3 sm:left-4"
                  }`}
                >
                  <Badge
                    variant="secondary"
                    className="m-1 sm:m-2 p-1 text-base sm:text-lg md:text-xl"
                    dir={getDirection(course.title)}
                  >
                    {course.title}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-3 sm:pt-4">
                <p
                  className="text-muted-foreground text-sm sm:text-base"
                  dir={getDirection(course.description)}
                >
                  <MathText text={course.description} />
                </p>
                <div
                  className={`flex flex-wrap items-center mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground ${
                    getDirection(course.title) === "rtl"
                      ? "flex-row-reverse justify-end gap-2 sm:gap-4"
                      : "gap-2 sm:gap-4"
                  }`}
                >
                  {[
                    {
                      icon: School2Icon,
                      text: course.subject.educationalCycle,
                    },
                    {
                      icon: GraduationCapIcon,
                      text: course.subject.educationalLevel,
                    },
                    { icon: Users, text: course.enrolls },
                  ].map((item, index) => (
                    <span
                      key={index}
                      className={`flex items-center ${
                        getDirection(course.title) === "rtl"
                          ? "ml-2 sm:ml-4"
                          : ""
                      }`}
                    >
                      <item.icon
                        className={`${
                          getDirection(course.title) === "rtl" ? "ml-1" : "mr-1"
                        } h-3 w-3 sm:h-4 sm:w-4`}
                      />
                      {item.text}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col justify-between p-3 sm:p-4 border-t border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  {getDirection(course.title) === "rtl"
                    ? "تقدم الدورة"
                    : "Progression du cours"}
                </h3>
                {progress ? (
                  <>
                    <div
                      className={`flex items-center mb-2 sm:mb-3 ${
                        getDirection(course.title) === "rtl"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Avatar
                        className={`h-10 w-10 sm:h-12 sm:w-12 ${
                          getDirection(course.title) === "rtl"
                            ? "ml-3 sm:ml-4"
                            : "mr-3 sm:mr-4"
                        }`}
                      >
                        <AvatarImage
                          src={user.user_image?.url || "/placeholder.svg"}
                        />
                      </Avatar>
                      <h4 className="mt-2 sm:mt-3 text-sm sm:text-base">
                        {user.username}
                      </h4>
                    </div>
                    <Progress
                      value={progress.progress}
                      max={100}
                      className="w-full"
                    />
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {progress.completedLessonsCount}{" "}
                      {getDirection(course.title) === "rtl" ? "من" : "sur"}{" "}
                      {progress.totalLessons}{" "}
                      {getDirection(course.title) === "rtl"
                        ? "دروس مكتملة"
                        : "leçons terminées"}{" "}
                      ({progress.progress?.toFixed(2)}%)
                    </p>
                  </>
                ) : (
                  <Button onClick={handleStartNow} className="w-full sm:w-auto">
                    {getDirection(course.title) === "rtl"
                      ? "ابدأ التعلم الآن"
                      : "Commencer à apprendre"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          <Card className="mb-4 sm:mb-6" dir={getDirection(course?.title)}>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                {getDirection(course?.title) === "rtl"
                  ? "منهج الدورة"
                  : "Programme du cours"}
              </CardTitle>
              <CardDescription className="text-sm">
                {getDirection(course?.title) === "rtl"
                  ? "قم بتوسيع كل وحدة لرؤية الدروس"
                  : "Développez chaque module pour voir les leçons"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {status === "loading" ? (
                  <div className="text-sm sm:text-base">Loading...</div>
                ) : status === "failed" ? (
                  <div className="text-sm sm:text-base">Error: {error}</div>
                ) : lessons && lessons.length > 0 ? (
                  lessons.map((lesson) => {
                    const isCompleted = progress?.completedLessons?.some(
                      (cl) => cl.lesson._id === lesson._id
                    );
                    const isPublished = lesson.published;
                    const isRTL = getDirection(course?.title) === "rtl";

                    return (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        key={lesson._id}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <AccordionItem value={`item-${lesson._id}`}>
                          <AccordionTrigger>
                            <div
                              className={`flex items-center text-sm sm:text-base ${
                                isRTL ? "flex-row-reverse" : ""
                              }`}
                            >
                              {isPublished ? (
                                isCompleted ? (
                                  <CheckCircle
                                    className={`h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 ${
                                      isRTL ? "ml-2 sm:ml-3" : "mr-2 sm:mr-3"
                                    }`}
                                  />
                                ) : (
                                  <PlayCircle
                                    className={`h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 ${
                                      isRTL ? "ml-2 sm:ml-3" : "mr-2 sm:mr-3"
                                    }`}
                                  />
                                )
                              ) : (
                                <Lock
                                  className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0 ${
                                    isRTL ? "ml-2 sm:ml-3" : "mr-2 sm:mr-3"
                                  }`}
                                />
                              )}

                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {lesson.title}
                              </h3>

                              {!isPublished && (
                                <Badge
                                  variant="secondary"
                                  className={`bg-gray-100 text-gray-600 text-xs sm:text-sm ${
                                    isRTL ? "mr-2 sm:mr-3" : "ml-2 sm:ml-3"
                                  }`}
                                >
                                  {isRTL ? "غير منشور" : "Non publié"}
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                              {formatDuration(lesson.video?.duration)}{" "}
                              {isRTL ? "دقائق" : "minutes"}
                            </p>

                            {isPublished ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handlePlayLesson(lesson._id)}
                                className="w-full sm:w-auto bg-gradient-to-br from-blue-600 to-purple-600"
                              >
                                {isCompleted
                                  ? isRTL
                                    ? "إعادة"
                                    : "Revoir"
                                  : isRTL
                                  ? "بدء"
                                  : "Commencer"}
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled
                                className="w-full sm:w-auto opacity-50 cursor-not-allowed"
                                onClick={() =>
                                  alert(
                                    isRTL
                                      ? "هذا الدرس غير منشور بعد."
                                      : "Cette leçon n'est pas encore publiée."
                                  )
                                }
                              >
                                <Lock
                                  className={`h-4 w-4 ${
                                    isRTL ? "ml-2" : "mr-2"
                                  }`}
                                />
                                {isRTL ? "مؤجل" : "Verrouillé"}
                              </Button>
                            )}

                            <div className="mt-3 sm:mt-4">
                              <h4 className="text-sm sm:text-md font-semibold text-gray-800 dark:text-gray-200">
                                {isRTL ? "تمارين" : "Exercices"}
                              </h4>
                              <ul
                                className={`${
                                  isRTL
                                    ? "list-inside list-disc-rtl"
                                    : "list-disc list-inside"
                                } text-gray-600`}
                              >
                                {lesson.exercises?.map((exercise) => (
                                  <li
                                    key={exercise._id}
                                    className={`text-xs sm:text-sm ${
                                      isPublished
                                        ? "cursor-pointer hover:text-blue-500"
                                        : "text-gray-400 cursor-not-allowed"
                                    }`}
                                    onClick={() =>
                                      isPublished
                                        ? handlePlayExercise(exercise._id)
                                        : alert(
                                            isRTL
                                              ? "هذا الدرس غير منشور، لا يمكن الوصول إلى التمارين."
                                              : "Cette leçon n'est pas publiée, les exercices ne sont pas accessibles."
                                          )
                                    }
                                  >
                                    {exercise.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-3 sm:py-4 text-sm">
                    {getDirection(course?.title) === "rtl"
                      ? "لا توجد دروس متاحة لهذه الدورة بعد"
                      : "Aucune leçon disponible pour ce cours pour le moment"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Exam Card */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <div
                className={`flex items-center gap-2 ${
                  getDirection(course?.title) === "rtl"
                    ? "flex-row-reverse"
                    : ""
                }`}
              >
                <CardTitle className="text-lg sm:text-xl">
                  {getDirection(course?.title) === "rtl"
                    ? "امتحانات الدورة"
                    : "Examens du Cours"}
                </CardTitle>
              </div>
              <CardDescription
                dir={getDirection(course?.title)}
                className="text-sm"
              >
                {getDirection(course?.title) === "rtl"
                  ? "الامتحانات القادمة والمكتملة لهذه الدورة"
                  : "Examens à venir et terminés pour ce cours"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {examStatus === "loading" ? (
                <div className="text-center py-3 sm:py-4 text-sm sm:text-base">
                  {getDirection(course?.title) === "rtl"
                    ? "جاري تحميل الامتحانات..."
                    : "Chargement des examens..."}
                </div>
              ) : exams && exams.length > 0 ? (
                exams.map((exam, index) => {
                  const userSubmission = exam?.submissions?.find((sub) => {
                    const subUserId = sub.user?._id || sub.user?.id || sub.user;
                    const currentUserId = user._id || user.id;
                    return subUserId?.toString() === currentUserId?.toString();
                  });

                  const isSubmitted = !!userSubmission;
                  const canTakeExam = exam?.lessonsCompleted !== false;

                  return (
                    <div key={exam?._id}>
                      <div
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
                          getDirection(course?.title) === "rtl"
                            ? "text-right"
                            : "text-left"
                        }`}
                        dir={getDirection(course?.title)}
                      >
                        <div className="flex-1 space-y-2">
                          <div
                            className={`flex items-start justify-between gap-2 ${
                              getDirection(course?.title) === "rtl"
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base leading-tight">
                                {exam?.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {course?.title}
                              </p>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                getDirection(course?.title) === "rtl"
                                  ? "flex-row-reverse"
                                  : ""
                              }`}
                            >
                              {!exam?.published && (
                                <Badge
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-600 text-xs sm:text-sm"
                                >
                                  {getDirection(course?.title) === "rtl"
                                    ? "غير متاح"
                                    : "Indisponible"}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {!canTakeExam && exam.incompleteLessons && (
                            <Alert className="mt-2">
                              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              <AlertDescription>
                                <div className="space-y-1">
                                  <p className="font-medium text-xs sm:text-sm">
                                    {getDirection(course?.title) === "rtl"
                                      ? `يتطلب إكمال ${exam.incompleteLessons.length} دروس:`
                                      : `Nécessite ${exam.incompleteLessons.length} leçons à terminer:`}
                                  </p>
                                  <ul className="text-xs space-y-1">
                                    {exam.incompleteLessons.map(
                                      (lesson, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-center gap-1"
                                        >
                                          <Lock className="h-3 w-3" />
                                          {lesson.title}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </AlertDescription>
                            </Alert>
                          )}

                          {isSubmitted && (
                            <div
                              className={`flex items-center gap-1 text-green-600 font-medium ${
                                getDirection(course?.title) === "rtl"
                                  ? "flex-row-reverse justify-end"
                                  : ""
                              }`}
                            >
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="text-xs sm:text-sm">
                                {getDirection(course?.title) === "rtl"
                                  ? `النتيجة: ${userSubmission.totalScore}%`
                                  : `Score: ${userSubmission.totalScore}%`}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          {isSubmitted ? (
                            <Button
                              variant="ghost"
                              onClick={() => handleExamNavigation(exam)}
                              className="w-full sm:w-auto border border-input bg-muted text-muted-foreground flex items-center justify-center px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-muted/80 text-xs sm:text-sm"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span>
                                {getDirection(course?.title) === "rtl"
                                  ? "لقد اجتزت هذا الامتحان بالفعل"
                                  : "Vous avez déjà passé cet examen"}
                              </span>
                            </Button>
                          ) : !canTakeExam ? (
                            <Button
                              variant="secondary"
                              disabled={true}
                              className={`w-full sm:w-auto opacity-50 cursor-not-allowed text-xs sm:text-sm ${
                                getDirection(course?.title) === "rtl"
                                  ? "flex-row-reverse"
                                  : ""
                              }`}
                            >
                              <Lock
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  getDirection(course?.title) === "rtl"
                                    ? "ml-1 sm:ml-2"
                                    : "mr-1 sm:mr-2"
                                }`}
                              />
                              {getDirection(course?.title) === "rtl"
                                ? "مؤجل"
                                : "Verrouillé"}
                            </Button>
                          ) : (
                            <Button
                              variant={
                                exam?.published ? "default" : "secondary"
                              }
                              disabled={!exam?.published}
                              onClick={() => handleExamNavigation(exam)}
                              className={`w-full sm:w-auto text-xs sm:text-sm ${
                                getDirection(course?.title) === "rtl"
                                  ? "flex-row-reverse"
                                  : ""
                              }`}
                            >
                              <Play
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  getDirection(course?.title) === "rtl"
                                    ? "ml-1 sm:ml-2"
                                    : "mr-1 sm:mr-2"
                                }`}
                              />
                              {getDirection(course?.title) === "rtl"
                                ? "إجراء الامتحان"
                                : "Passer l'examen"}
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < exams.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <p
                  className="text-muted-foreground text-center py-3 sm:py-4 text-sm"
                  dir={getDirection(course?.title)}
                >
                  {getDirection(course?.title) === "rtl"
                    ? "لا توجد امتحانات متاحة لهذه الدورة بعد"
                    : "Aucun examen disponible pour ce cours pour le moment"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card
            className="mb-4 sm:mb-6"
            dir={getDirection(course?.title)} // Ensures proper text & layout direction
          >
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                {getDirection(course?.title) === "rtl"
                  ? "مقابلة معلمك"
                  : "Rencontrez votre instructeur"}
              </CardTitle>
            </CardHeader>

            <CardContent
              className={`flex flex-col sm:flex-row ${
                getDirection(course?.title) === "rtl"
                  ? "flex-row-reverse sm:space-x-reverse sm:space-x-4"
                  : "sm:space-x-4"
              } lg:items-start items-center`}
            >
              <Avatar className="h-32 w-32 sm:h-40 sm:w-40 mb-3 sm:mb-0">
                <AvatarImage
                  src={course?.teacher?.user_image?.url || "/placeholder.svg"}
                  alt="Instructor"
                />
                <AvatarFallback>{course?.teacher?.username}</AvatarFallback>
              </Avatar>

              <div
                className={`flex flex-col gap-2 w-full ${
                  getDirection(course?.title) === "rtl" ? "text-right" : ""
                }`}
              >
                <h3 className="text-base sm:text-lg font-semibold">
                  {course?.teacher?.username}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground">
                  {getDirection(course?.title) === "rtl"
                    ? `مع ${course?.teacher?.experience} سنوات من الخبرة في ${course?.teacher?.discipline}، ${course?.teacher?.username} يتفوق في خلق تجارب تعليمية جذابة وفعالة.`
                    : `Avec ${course?.teacher?.experience} ans d'expérience en ${course?.teacher?.discipline}, ${course?.teacher?.username} excelle dans la création d'expériences d'apprentissage engageantes et efficaces.`}
                </p>

                <Button
                  variant="secondary"
                  onClick={handleContactInstructor}
                  className={`w-full sm:w-auto ${
                    getDirection(course?.title) === "rtl" ? "self-end" : ""
                  }`}
                >
                  {getDirection(course?.title) === "rtl"
                    ? "الاتصال بالمدرس"
                    : "Contacter l'instructeur"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {course && (
            <Card
              className="mb-4 sm:mb-6"
              dir={getDirection(course?.title)} // Enables native RTL text direction
            >
              <CardHeader
                className={`${
                  getDirection(course?.title) === "rtl" ? "text-right" : ""
                }`}
              >
                <CardTitle className="text-lg sm:text-xl">
                  {getDirection(course?.title) === "rtl"
                    ? "ما يقوله طلابنا"
                    : "Ce que disent nos étudiants"}
                </CardTitle>

                <CardDescription className="text-sm">
                  {getDirection(course?.title) === "rtl"
                    ? "استمع إلى أولئك الذين أخذوا هذه الدورة"
                    : "Écoutez ceux qui ont suivi ce cours"}
                </CardDescription>

                <ReviewForm courseId={course._id} courseTitle={course?.title} />
              </CardHeader>

              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <ReviewList
                    courseId={course._id}
                    courseTitle={course?.title}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-center text-lg sm:text-xl">
                {getDirection(course?.title) === "rtl"
                  ? "تفاصيل الدرس"
                  : "Détails du Cours"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4
                  className={`font-bold mb-3 flex items-center text-sm sm:text-base ${
                    getDirection(course?.title) === "rtl"
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  <Lightbulb
                    className={`${
                      getDirection(course?.title) === "rtl" ? "ml-2" : "mr-2"
                    } h-6 w-6 sm:h-8 sm:w-8`}
                  />
                  {getDirection(course?.title) === "rtl"
                    ? "المهارات المطلوبة:"
                    : "Compétences nécessaires:"}
                </h4>
                <ul className="space-y-2">
                  {course?.prerequisites?.[0] &&
                    JSON.parse(course?.prerequisites[0]).map(
                      (prerequisite, index) => {
                        const [title, ...rest] = prerequisite.split(":");
                        const description = rest.join(":");

                        return (
                          <li
                            key={index}
                            className={`flex items-start ${
                              getDirection(course.title) === "rtl"
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            <Info
                              className={`${
                                getDirection(course.title) === "rtl"
                                  ? "ml-2"
                                  : "mr-2"
                              } h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5`}
                            />
                            <span
                              className="text-start text-xs sm:text-sm"
                              dir={getDirection(prerequisite)}
                            >
                              <strong>
                                <MathText text={title.trim()} />
                              </strong>
                              {description && (
                                <span>
                                  : <MathText text={description.trim()} />{" "}
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      }
                    )}
                </ul>
              </div>
              <div className="space-y-2">
                <h4
                  className={`font-bold mb-3 flex items-center text-sm sm:text-base ${
                    getDirection(course?.title) === "rtl"
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  <BookOpen
                    className={`${
                      getDirection(course?.title) === "rtl" ? "ml-2" : "mr-2"
                    } h-6 w-6 sm:h-8 sm:w-8`}
                  />
                  {getDirection(course?.title) === "rtl"
                    ? "ماذا ستتعلم :"
                    : "Ce que vous allez apprendre :"}
                </h4>
                <ul className="space-y-2">
                  {course?.objectives && course.objectives.length > 0 ? (
                    JSON.parse(course?.objectives[0]).map(
                      (objective, index) => {
                        const [title, ...rest] = objective.split(":");
                        const description = rest.join(":");

                        return (
                          <li
                            key={index}
                            className={`flex items-start ${
                              getDirection(course.title) === "rtl"
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            <CheckCircle
                              className={`${
                                getDirection(course.title) === "rtl"
                                  ? "ml-2"
                                  : "mr-2"
                              } h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5`}
                            />
                            <span
                              className="text-start text-xs sm:text-sm"
                              dir={getDirection(objective)}
                            >
                              <strong><MathText text= {title.trim()} /> : </strong>
                              {description && (
                                <MathText text={description.trim()} />
                              )}
                            </span>
                          </li>
                        );
                      }
                    )
                  ) : (
                    <p className="text-xs sm:text-sm">
                      {getDirection(course?.title) === "rtl"
                        ? "لا توجد أهداف متاحة لهذه الدورة."
                        : "Aucun objectif disponible pour ce cours."}
                    </p>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={handleStartNow}
                className="w-full  bg-gradient-to-br from-blue-600 to-purple-600"
              >
                {lessons?.every(
                  (lesson) =>
                    !progress?.completedLessons?.some(
                      (cl) => cl.lesson._id === lesson._id
                    )
                )
                  ? getDirection(course?.title) === "rtl"
                    ? "ابدأ الدراسة الآن"
                    : "Commencer maintenant"
                  : lessons?.every((lesson) =>
                      progress?.completedLessons.some(
                        (cl) => cl.lesson._id === lesson._id
                      )
                    )
                  ? getDirection(course?.title) === "rtl"
                    ? "تم الحصول على الشهادة"
                    : "Certificat obtenu"
                  : getDirection(course?.title) === "rtl"
                  ? "تابع التعلم"
                  : "Continuer"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Course;
