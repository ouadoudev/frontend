// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Play,
//   CheckCircle,
//   AlertCircle,
//   Timer,
//   BookOpen,
//   BarChart3,
//   Clock,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getQuizByLesson,
//   submitQuizAnswers,
//   getQuizAnswers,
//   clearQuizState,
//   retakeQuiz,
// } from "@/store/quizSlice";
// import { loggedUser } from "@/store/authSlice";
// import QuizResult from "./QuizResult";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../ui/card";

// const QuizComponent = ({ lessonId, onClose, isInDialog = false }) => {
//   const dispatch = useDispatch();
//   const currentQuiz = useSelector((state) => state.quiz.currentQuiz);
//   const submission = useSelector((state) => state.quiz.submission);
//   const loading = useSelector((state) => state.quiz.loading);
//   const error = useSelector((state) => state.quiz.error);
//   const user = useSelector((state) => loggedUser(state));

//   const [answers, setAnswers] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [answerError, setAnswerError] = useState(null);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [quizStartTime, setQuizStartTime] = useState(null);

//   // Fetch quiz data when component mounts
//   useEffect(() => {
//     if (lessonId) {
//       dispatch(clearQuizState());
//       dispatch(getQuizByLesson(lessonId));
//     }
//   }, [dispatch, lessonId]);

//   // Fetch user's previous submission if it exists
//   useEffect(() => {
//     if (user?.id && currentQuiz?._id) {
//       dispatch(getQuizAnswers({ quizId: currentQuiz._id, userId: user.id }));
//     }
//   }, [user?.id, currentQuiz?._id, dispatch]);

//   // Start timer when quiz begins
//   useEffect(() => {
//     if (quizStarted && currentQuiz && !submission) {
//       const startTime = new Date();
//       setQuizStartTime(startTime);
//       setTimeRemaining(currentQuiz.timeLimit);

//       const countdown = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 1) {
//             clearInterval(countdown);
//             handleSubmit();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(countdown);
//     }
//   }, [quizStarted, currentQuiz, submission]);

//   const handleSubmit = async () => {
//     try {
//       if (!user || !user.id) {
//         throw new Error("User not authenticated");
//       }
//       if (!currentQuiz?._id) {
//         throw new Error("No quiz available to submit answers");
//       }
//       if (answers.length !== currentQuiz.questions.length) {
//         throw new Error("Please answer all questions before submitting");
//       }

//       const answersData = {
//         userId: user.id,
//         answers: answers.map((ans) => ans.answer),
//         startTime: quizStartTime
//           ? quizStartTime.toISOString()
//           : new Date().toISOString(),
//       };

//       await dispatch(
//         submitQuizAnswers({ quizId: currentQuiz._id, answersData })
//       ).unwrap();
//     } catch (err) {
//       console.error("Error submitting quiz answers:", err);
//     }
//   };

//   const handleAnswerChange = (questionId, answer) => {
//     const newAnswers = [...answers];
//     const existingAnswerIndex = newAnswers.findIndex(
//       (ans) => ans.questionId === questionId
//     );
//     if (existingAnswerIndex !== -1) {
//       newAnswers[existingAnswerIndex].answer = answer;
//     } else {
//       newAnswers.push({ questionId, answer });
//     }
//     setAnswers(newAnswers);
//     setAnswerError(null);
//   };

//   const moveToNextQuestion = () => {
//     const currentQuestion = currentQuiz.questions[currentQuestionIndex];
//     const selectedAnswer = answers.find(
//       (ans) => ans.questionId === currentQuestion._id
//     );
//     if (!selectedAnswer?.answer) {
//       setAnswerError("Please select an answer before proceeding.");
//       return;
//     }
//     setAnswerError(null);
//     setCurrentQuestionIndex((prev) => prev + 1);
//   };

//   const moveToPreviousQuestion = () => {
//     setCurrentQuestionIndex((prev) => prev - 1);
//     setAnswerError(null);
//   };

//   const handleRetakeQuiz = async () => {
//     try {
//       await dispatch(
//         retakeQuiz({ quizId: currentQuiz._id, userId: user.id })
//       ).unwrap();
//       setAnswers([]);
//       setCurrentQuestionIndex(0);
//       setQuizStarted(false);
//       setTimeRemaining(0);
//       setQuizStartTime(null);
//     } catch (err) {
//       console.error("Error retaking quiz:", err);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const progressPercentage = currentQuiz?.questions?.length
//     ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
//     : 0;

//   const handleCloseDialog = () => {
//     if (onClose) {
//       onClose();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[300px]">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="text-sm font-medium text-gray-600">
//             Chargement du quiz...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Alert variant="destructive" className="mx-auto">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription className="text-sm">
//           {error?.message ||
//             error?.error ||
//             "Une erreur est survenue lors du chargement du quiz. Veuillez réessayer."}
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   if (!currentQuiz) {
//     return (
//       <Alert className="mx-auto">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription className="text-sm">
//           Aucun quiz disponible pour cette leçon.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   if (submission) {
//     return (
//       <QuizResult
//         result={submission}
//         onRetake={submission.isPassed ? null : handleRetakeQuiz}
//         alreadyPassed={submission.isPassed}
//         onClose={handleCloseDialog}
//         isInDialog={isInDialog}
//       />
//     );
//   }

//   if (!quizStarted) {
//     return (
//       <div className="space-y-6">
//         <div className="text-center space-y-4">
//           <Card className="bg-white/70 border-blue-200">
//             <CardHeader>
//               <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                 <BookOpen className="w-6 h-6 text-blue-600" />
//               </div>
//               <CardTitle className="lg:text-xl text-lg font-bold text-gray-900 mb-2">
//                 {" "}
//                 {currentQuiz?.title}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center p-4 sm:p-6">
//               <div className="text-sm sm:text-lg leading-relaxed">
//                 {currentQuiz?.description}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:py-8">
//           <Card className="bg-white/70 border-purple-200">
//             <CardContent className="flex flex-col items-center p-4 sm:p-6">
//               <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3" />
//               <div className="text-2xl sm:text-3xl font-bold text-purple-700">
//                 {currentQuiz?.questions?.length}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                 Questions totales
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/70 border-blue-200">
//             <CardContent className="flex flex-col items-center p-4 sm:p-6">
//               <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3" />
//               <div className="text-2xl sm:text-3xl font-bold text-green-700">
//                 {currentQuiz?.passingScore}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                 Pour réussir
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/70 border-orange-200">
//             <CardContent className="flex flex-col items-center p-4 sm:p-6">
//               <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-3" />
//               <div className="text-2xl sm:text-3xl font-bold text-orange-700">
//                 {currentQuiz?.timeLimit
//                   ? formatTime(currentQuiz?.timeLimit)
//                   : "N/A"}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                 Minutes
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="flex gap-3">
//           <Button
//             onClick={() => setQuizStarted(true)}
//             className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
//           >
//             <Play className="w-4 h-4 mr-2" />
//             Démarrer le quiz
//           </Button>
//           {isInDialog && (
//             <Button variant="outline" onClick={handleCloseDialog}>
//               Annuler
//             </Button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = currentQuiz.questions[currentQuestionIndex];
//   const selectedAnswer = answers.find(
//     (ans) => ans.questionId === currentQuestion._id
//   );

//   return (
//     <div className="space-y-4">
//       {/* Header with progress and timer */}
//       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//         <div className="flex items-center space-x-3">
//           <Badge variant="outline" className="text-xs">
//             {currentQuestionIndex + 1}/{currentQuiz.questions.length}
//           </Badge>
//           <div className="text-xs text-gray-500">
//             {Math.round(progressPercentage)}%
//           </div>
//         </div>
//         <div className="flex items-center space-x-2 text-sm font-semibold">
//           <Timer
//             className={cn(
//               "w-4 h-4",
//               timeRemaining < 60 ? "text-red-500" : "text-blue-500"
//             )}
//           />
//           <span
//             className={cn(
//               timeRemaining < 60 ? "text-red-500" : "text-blue-500"
//             )}
//           >
//             {formatTime(timeRemaining)}
//           </span>
//         </div>
//       </div>
//       <Progress value={progressPercentage} className="h-2" />

//       {/* Question */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold leading-relaxed">
//           {currentQuestion.questionText}
//         </h3>

//         <div className="space-y-2">
//           {currentQuestion.options.map((option, index) => {
//             const isSelected = selectedAnswer?.answer === option;
//             return (
//               <label
//                 key={option}
//                 className={cn(
//                   "flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
//                   isSelected
//                     ? "border-blue-500 bg-blue-50 shadow-sm"
//                     : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                 )}
//               >
//                 <input
//                   type="radio"
//                   name={currentQuestion._id}
//                   value={option}
//                   onChange={() =>
//                     handleAnswerChange(currentQuestion._id, option)
//                   }
//                   checked={isSelected}
//                   className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="flex-1 text-gray-900 text-sm">
//                   <span className="inline-block w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs font-bold text-center leading-5 mr-2">
//                     {String.fromCharCode(65 + index)}
//                   </span>
//                   {option}
//                 </span>
//                 {isSelected && (
//                   <CheckCircle className="w-4 h-4 text-blue-500" />
//                 )}
//               </label>
//             );
//           })}
//         </div>

//         {answerError && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription className="text-sm">
//               {answerError}
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Navigation buttons */}
//         <div className="flex justify-between pt-4">
//           <Button
//             onClick={moveToPreviousQuestion}
//             disabled={currentQuestionIndex === 0}
//             variant="outline"
//             size="sm"
//             className="flex items-center space-x-2 bg-transparent"
//           >
//             <ChevronLeft className="w-4 h-4" />
//             <span>Précédent</span>
//           </Button>

//           {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
//             <Button
//               onClick={moveToNextQuestion}
//               size="sm"
//               className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
//             >
//               <span>Suivant</span>
//               <ChevronRight className="w-4 h-4" />
//             </Button>
//           ) : (
//             <Button
//               onClick={handleSubmit}
//               size="sm"
//               className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
//             >
//               <CheckCircle className="w-4 h-4" />
//               <span>Soumettre</span>
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizComponent;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  AlertCircle,
  Timer,
  BookOpen,
  BarChart3,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuizByLesson,
  submitQuizAnswers,
  getQuizAnswers,
  clearQuizState,
  retakeQuiz,
} from "@/store/quizSlice";
import { loggedUser } from "@/store/authSlice";
import QuizResult from "./QuizResult";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

const QuizComponent = ({ lessonId, lessonTitle, onClose, isInDialog = false }) => {
  const dispatch = useDispatch();
  const currentQuiz = useSelector((state) => state.quiz.currentQuiz);
  const submission = useSelector((state) => state.quiz.submission);
  const loading = useSelector((state) => state.quiz.loading);
  const error = useSelector((state) => state.quiz.error);
  const user = useSelector((state) => loggedUser(state));

  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answerError, setAnswerError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);

  // Fetch quiz data when component mounts
  useEffect(() => {
    if (lessonId) {
      dispatch(clearQuizState());
      dispatch(getQuizByLesson(lessonId));
    }
  }, [dispatch, lessonId]);

  // Fetch user's previous submission if it exists
  useEffect(() => {
    if (user?.id && currentQuiz?._id) {
      dispatch(getQuizAnswers({ quizId: currentQuiz._id, userId: user.id }));
    }
  }, [user?.id, currentQuiz?._id, dispatch]);

  // Start timer when quiz begins
  useEffect(() => {
    if (quizStarted && currentQuiz && !submission) {
      const startTime = new Date();
      setQuizStartTime(startTime);
      setTimeRemaining(currentQuiz.timeLimit);

      const countdown = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [quizStarted, currentQuiz, submission]);

  const handleSubmit = async () => {
    try {
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }
      if (!currentQuiz?._id) {
        throw new Error("No quiz available to submit answers");
      }
      if (answers.length !== currentQuiz.questions.length) {
        throw new Error("Please answer all questions before submitting");
      }

      const answersData = {
        userId: user.id,
        answers: answers.map((ans) => ans.answer),
        startTime: quizStartTime
          ? quizStartTime.toISOString()
          : new Date().toISOString(),
      };

      await dispatch(
        submitQuizAnswers({ quizId: currentQuiz._id, answersData })
      ).unwrap();
    } catch (err) {
      console.error("Error submitting quiz answers:", err);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(
      (ans) => ans.questionId === questionId
    );
    if (existingAnswerIndex !== -1) {
      newAnswers[existingAnswerIndex].answer = answer;
    } else {
      newAnswers.push({ questionId, answer });
    }
    setAnswers(newAnswers);
    setAnswerError(null);
  };

  const moveToNextQuestion = () => {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const selectedAnswer = answers.find(
      (ans) => ans.questionId === currentQuestion._id
    );
    if (!selectedAnswer?.answer) {
      setAnswerError("Please select an answer before proceeding.");
      return;
    }
    setAnswerError(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const moveToPreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
    setAnswerError(null);
  };

  const handleRetakeQuiz = async () => {
    try {
      await dispatch(
        retakeQuiz({ quizId: currentQuiz._id, userId: user.id })
      ).unwrap();
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setQuizStarted(false);
      setTimeRemaining(0);
      setQuizStartTime(null);
    } catch (err) {
      console.error("Error retaking quiz:", err);
    }
  };

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const isRTL = getDirection(lessonTitle) === "rtl";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = currentQuiz?.questions?.length
    ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
    : 0;

  const handleCloseDialog = () => {
    if (onClose) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">
            {isRTL ? "جاري تحميل الاختبار..." : "Chargement du quiz..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {isRTL
            ? error?.message || error?.error || "حدث خطأ أثناء تحميل الاختبار. الرجاء المحاولة مرة أخرى."
            : error?.message || error?.error || "Une erreur est survenue lors du chargement du quiz. Veuillez réessayer."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!currentQuiz) {
    return (
      <Alert className="mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {isRTL ? "لا يوجد اختبار متاح لهذا الدرس." : "Aucun quiz disponible pour cette leçon."}
        </AlertDescription>
      </Alert>
    );
  }

  if (submission) {
    return (
      <QuizResult
        result={submission}
        onRetake={submission.isPassed ? null : handleRetakeQuiz}
        alreadyPassed={submission.isPassed}
        onClose={handleCloseDialog}
        isInDialog={isInDialog}
        lessonTitle={lessonTitle}
      />
    );
  }

  if (!quizStarted) {
    return (
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center space-y-4">
          <Card className="bg-white/70 border-blue-200">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className={cn("lg:text-xl text-lg font-bold text-gray-900 mb-2", isRTL ? "text-right" : "text-left")}>
                {currentQuiz?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className={cn("flex flex-col items-center p-4 sm:p-6", isRTL ? "text-right" : "text-left")}>
              <div className="text-sm sm:text-lg leading-relaxed">
                {currentQuiz?.description}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:py-8">
          <Card className="bg-white/70 border-purple-200">
            <CardContent className="flex flex-col items-center p-4 sm:p-6">
              <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-purple-700">
                {currentQuiz?.questions?.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                {isRTL ? "إجمالي الأسئلة" : "Questions totales"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 border-blue-200">
            <CardContent className="flex flex-col items-center p-4 sm:p-6">
              <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-green-700">
                {currentQuiz?.passingScore}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                {isRTL ? "للنجاح" : "Pour réussir"}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 border-orange-200">
            <CardContent className="flex flex-col items-center p-4 sm:p-6">
              <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-orange-700">
                {currentQuiz?.timeLimit
                  ? formatTime(currentQuiz?.timeLimit)
                  : "N/A"}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                {isRTL ? "دقائق" : "Minutes"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={cn("flex gap-3", isRTL ? "flex-row-reverse" : "flex-row")}>
          <Button
            onClick={() => setQuizStarted(true)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRTL ? "بدء الاختبار" : "Démarrer le quiz"}
          </Button>
          {isInDialog && (
            <Button variant="outline" onClick={handleCloseDialog}>
              {isRTL ? "إلغاء" : "Annuler"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const selectedAnswer = answers.find(
    (ans) => ans.questionId === currentQuestion._id
  );
  const isQuestionRTL = getDirection(currentQuestion.questionText) === "rtl";

  return (
    <div className="space-y-4" dir={isRTL || isQuestionRTL ? "rtl" : "ltr"}>
      {/* Header with progress and timer */}
      <div className={cn("flex items-center justify-between p-4 bg-gray-50 rounded-lg", isRTL || isQuestionRTL ? "flex-row-reverse" : "flex-row")}>
        <div className={cn("flex items-center space-x-3", isRTL || isQuestionRTL ? "space-x-reverse" : "")}>
          <Badge variant="outline" className="text-xs">
            {currentQuestionIndex + 1}/{currentQuiz.questions.length}
          </Badge>
          <div className="text-xs text-gray-500">
            {Math.round(progressPercentage)}%
          </div>
        </div>
        <div className={cn("flex items-center space-x-2 text-sm font-semibold", isRTL || isQuestionRTL ? "space-x-reverse" : "")}>
          <Timer
            className={cn(
              "w-4 h-4",
              timeRemaining < 60 ? "text-red-500" : "text-blue-500"
            )}
          />
          <span
            className={cn(
              timeRemaining < 60 ? "text-red-500" : "text-blue-500"
            )}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      <Progress value={progressPercentage} className="h-2" />

      {/* Question */}
      <div className="space-y-4">
        <h3 className={cn("text-lg font-semibold leading-relaxed", isRTL || isQuestionRTL ? "text-right" : "text-left")}>
          {currentQuestion.questionText}
        </h3>

        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer?.answer === option;
            const isOptionRTL = getDirection(option) === "rtl";
            return (
              <label
                key={option}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                  isRTL || isQuestionRTL || isOptionRTL ? "flex-row-reverse space-x-reverse text-right" : "flex-row text-left"
                )}
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  value={option}
                  onChange={() =>
                    handleAnswerChange(currentQuestion._id, option)
                  }
                  checked={isSelected}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex-1 text-gray-900 text-sm">
                  <span className="inline-block w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs font-bold text-center leading-5 mx-4">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </label>
            );
          })}
        </div>

        {answerError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {isRTL || isQuestionRTL ? "يرجى اختيار إجابة قبل المتابعة." : answerError}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation buttons */}
        <div className={cn("flex justify-between pt-4", isRTL || isQuestionRTL ? "flex-row-reverse" : "flex-row")}>
          <Button
            onClick={moveToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            size="sm"
            className={cn("flex items-center space-x-2 bg-transparent", isRTL || isQuestionRTL ? "space-x-reverse" : "")}
          >
            <ChevronLeft className={cn("w-4 h-4", isRTL || isQuestionRTL ? "transform rotate-180" : "")} />
            <span>{isRTL || isQuestionRTL ? "السابق" : "Précédent"}</span>
          </Button>

          {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
            <Button
              onClick={moveToNextQuestion}
              size="sm"
              className={cn("flex items-center space-x-2 bg-blue-600 hover:bg-blue-700", isRTL || isQuestionRTL ? "space-x-reverse" : "")}
            >
              <span>{isRTL || isQuestionRTL ? "التالي" : "Suivant"}</span>
              <ChevronRight className={cn("w-4 h-4", isRTL || isQuestionRTL ? "transform rotate-180" : "")} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="sm"
              className={cn("flex items-center space-x-2 bg-green-600 hover:bg-green-700", isRTL || isQuestionRTL ? "space-x-reverse" : "")}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isRTL || isQuestionRTL ? "إرسال" : "Soumettre"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;