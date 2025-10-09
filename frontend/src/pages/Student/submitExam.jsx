// import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getExamById, submitExam } from "@/store/examSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { toast } from "react-toastify";
// import {
//   FileText,
//   Send,
//   AlertCircle,
//   CheckCircle,
//   Timer,
//   ArrowLeft,
//   ArrowRight,
//   Flag,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // RTL Detection Function
// const getDirection = (text) => {
//   if (!text) return "ltr";
//   const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
//   return rtlChars.test(text) ? "rtl" : "ltr";
// };

// // Translations
// const translations = {
//   ar: {
//     enterAnswer: "أدخل إجابتك هنا",
//     selectMatch: "اختر التطابق",
//     error: "خطأ",
//     question: "السؤال %d",
//     previous: "السابق",
//     next: "التالي",
//     flag: "علم",
//     flagged: "معلّم",
//     review: "مراجعة",
//     edit: "تحرير",
//     answered: "تمت الإجابة",
//     unanswered: "لم تتم الإجابة",
//     confirmSubmission: "تأكيد الإرسال",
//     submitNow: "إرسال الآن",
//     continueExam: "متابعة الامتحان",
//     note: "ملاحظة",
//     questionsFlagged: "سؤال(أسئلة) معلّمة للمراجعة",
//     thisActionCannotBeUndone: "لا يمكن التراجع عن هذا الإجراء.",
//     loadingExam: "جارٍ تحميل الامتحان...",
//     failedToLoad: "فشل تحميل الامتحان. الرجاء المحاولة مرة أخرى.",
//     examTitle: "امتحان",
//     questionsCount: "%d أسئلة • %d تمارين",
//     timeRemaining: "الوقت المتبقي",
//     answeredQuestions: "%d من %d أسئلة تمت الإجابة",
//     flaggedQuestions: "%d سؤال معلّم للمراجعة",
//     submitExam: "إرسال الامتحان",
//   },
//   fr: {
//     enterAnswer: "Entrez votre réponse ici",
//     selectMatch: "Sélectionner une correspondance",
//     error: "Erreur",
//     question: "Question %d",
//     previous: "Précédent",
//     next: "Suivant",
//     flag: "Drapeau",
//     flagged: "Marqué",
//     review: "Revoir",
//     edit: "Modifier",
//     answered: "Répondu",
//     unanswered: "Non répondu",
//     confirmSubmission: "Confirmer la soumission",
//     submitNow: "Soumettre maintenant",
//     continueExam: "Continuer l'examen",
//     note: "Remarque",
//     questionsFlagged: "question(s) marquée(s) pour révision",
//     thisActionCannotBeUndone: "Cette action ne peut pas être annulée.",
//     loadingExam: "Chargement de l'examen...",
//     failedToLoad: "Échec du chargement de l'examen. Veuillez réessayer.",
//     examTitle: "Examen",
//     questionsCount: "%d questions • %d exercices",
//     timeRemaining: "Temps restant",
//     answeredQuestions: "%d sur %d questions répondues",
//     flaggedQuestions: "%d question(s) marquée(s) pour révision",
//     submitExam: "Soumettre l'examen",
//   },
// };

// const renderQuestion = (
//   question,
//   userAnswers,
//   handleAnswerChange,
//   isReviewMode = false,
//   t,
//   isRTL
// ) => {
//   const applyDisabledProps = (component) => {
//     if (!component || !isReviewMode) return component;

//     const disableComponent = (element) => {
//       if (!element || !React.isValidElement(element)) return element;

//       const disabledProps = {
//         ...(element.type === Input && { disabled: true }),
//         ...(element.type === Textarea && { disabled: true }),
//         ...(element.type === Select && { disabled: true }),
//         ...(element.type === RadioGroup && { disabled: true }),
//         ...(element.type === DragDropContext && {
//           onDragEnd: () => {},
//         }),
//       };

//       return React.cloneElement(element, {
//         ...disabledProps,
//         children: React.Children.map(element.props.children, (child) =>
//           disableComponent(child)
//         ),
//       });
//     };

//     return disableComponent(component);
//   };

//   const questionDir = getDirection(question.questionText);
//   const flexDir = questionDir === "rtl" ? "flex-row-reverse" : "flex-row";

//   switch (question.type) {
//     case "multiple-choice":
//       return applyDisabledProps(
//         <RadioGroup
//           value={userAnswers[question._id] || ""}
//           onValueChange={(value) => handleAnswerChange(question._id, value)}
//           className="space-y-2"
//           dir={questionDir}
//         >
//           {question.options.map((option, index) => (
//             <div
//               key={index}
//               className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${flexDir}`}
//             >
//               <RadioGroupItem value={option} id={`${question._id}-${index}`} />
//               <Label
//                 htmlFor={`${question._id}-${index}`}
//                 className="flex-grow cursor-pointer"
//                 dir={getDirection(option)}
//               >
//                 {option}
//               </Label>
//             </div>
//           ))}
//         </RadioGroup>
//       );

//     case "short-answer":
//       return applyDisabledProps(
//         <Textarea
//           value={userAnswers[question._id] || ""}
//           onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//           placeholder={t.enterAnswer}
//           className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//           dir={questionDir}
//         />
//       );

//     case "fill-in-the-blank":
//       return applyDisabledProps(
//         <div className="space-y-2">
//           {(question.correctAnswers || []).map((_, index) => (
//             <Input
//               key={index}
//               value={
//                 userAnswers[question._id]?.[index] !== undefined
//                   ? userAnswers[question._id][index]
//                   : ""
//               }
//               onChange={(e) => {
//                 const updatedAnswers = userAnswers[question._id]
//                   ? [...userAnswers[question._id]]
//                   : [];
//                 updatedAnswers[index] = e.target.value;
//                 handleAnswerChange(question._id, updatedAnswers);
//               }}
//               placeholder={`${t.enterAnswer} ${index + 1}`}
//               className="w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
//               dir={questionDir}
//             />
//           ))}
//         </div>
//       );

//     case "matching":
//       const leftItems = question.matching.leftItems || [];
//       const rightItems = question.matching.rightItems || [];

//       return applyDisabledProps(
//         <div className="space-y-4" dir={questionDir}>
//           {leftItems.map((term, index) => (
//             <div
//               key={index}
//               className={`flex items-center space-x-4 ${flexDir}`}
//             >
//               <Label
//                 className="w-1/3 font-medium"
//                 dir={getDirection(term)}
//               >
//                 {term}
//               </Label>
//               <Select
//                 value={userAnswers[question._id]?.[index]?.definition || ""}
//                 onValueChange={(value) => {
//                   const currentAnswers = userAnswers[question._id] || [];
//                   const newAnswers = [...currentAnswers];
//                   newAnswers[index] = { term, definition: value };
//                   handleAnswerChange(question._id, newAnswers);
//                 }}
//               >
//                 <SelectTrigger className="w-2/3" dir={questionDir}>
//                   <SelectValue placeholder={t.selectMatch} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {rightItems.map((definition) => (
//                     <SelectItem key={definition} value={definition}>
//                       {definition}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           ))}
//         </div>
//       );

//     case "drag-and-drop":
//       return applyDisabledProps(
//         <DragDropContext
//           onDragEnd={(result) => {
//             if (!result.destination) return;
//             const items = Array.from(
//               userAnswers[question._id] || question.dragAndDrop.items
//             );
//             const [reorderedItem] = items.splice(result.source.index, 1);
//             items.splice(result.destination.index, 0, reorderedItem);
//             handleAnswerChange(question._id, items);
//           }}
//         >
//           <Droppable droppableId={question._id}>
//             {(provided) => (
//               <ul
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//                 className="space-y-2"
//                 dir={questionDir}
//               >
//                 {(userAnswers[question._id] || question.dragAndDrop.items).map(
//                   (item, index) => (
//                     <Draggable key={item} draggableId={item} index={index}>
//                       {(provided) => (
//                         <li
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           className="p-3 bg-white border rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow duration-200"
//                           dir={getDirection(item)}
//                         >
//                           {item}
//                         </li>
//                       )}
//                     </Draggable>
//                   )
//                 )}
//                 {provided.placeholder}
//               </ul>
//             )}
//           </Droppable>
//         </DragDropContext>
//       );

//     case "table-completion":
//       const { columns, rows, cells } = question.tableCompletion;

//       if (!userAnswers[question._id]) {
//         const emptyAnswers = rows.map(() => Array(columns.length).fill(""));
//         handleAnswerChange(question._id, emptyAnswers);
//       }

//       return applyDisabledProps(
//         <div className="overflow-x-auto" dir={questionDir}>
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th
//                   className={`border border-gray-300 p-2 ${
//                     questionDir === "rtl" ? "text-right" : "text-left"
//                   }`}
//                 >
//                   {t.element}
//                 </th>
//                 {columns.map((header, index) => (
//                   <th
//                     key={index}
//                     className={`border border-gray-300 p-2 ${
//                       questionDir === "rtl" ? "text-right" : "text-left"
//                     }`}
//                     dir={getDirection(header)}
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((rowLabel, rowIndex) => (
//                 <tr
//                   key={rowIndex}
//                   className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                 >
//                   <td
//                     className={`border border-gray-300 p-2 font-medium ${
//                       questionDir === "rtl" ? "text-right" : "text-left"
//                     }`}
//                     dir={getDirection(rowLabel)}
//                   >
//                     {rowLabel}
//                   </td>
//                   {columns.map((_, colIndex) => {
//                     const cell = cells.find(
//                       (c) =>
//                         c.rowIndex === rowIndex && c.columnIndex === colIndex
//                     );
//                     const cellText = cell?.text || "";
//                     const isCellTextNonEmpty = cellText.trim() !== "";
//                     const inputValue = isCellTextNonEmpty
//                       ? cellText
//                       : userAnswers[question._id]?.[rowIndex]?.[colIndex] || "";

//                     return (
//                       <td
//                         key={colIndex}
//                         className="border border-gray-300 p-2"
//                       >
//                         <Input
//                           value={inputValue}
//                           onChange={(e) => {
//                             if (!isCellTextNonEmpty) {
//                               const newAnswers = [
//                                 ...(userAnswers[question._id] || []),
//                               ];
//                               if (!newAnswers[rowIndex]) {
//                                 newAnswers[rowIndex] = Array(
//                                   columns.length
//                                 ).fill("");
//                               }
//                               newAnswers[rowIndex][colIndex] = e.target.value;
//                               handleAnswerChange(question._id, newAnswers);
//                             }
//                           }}
//                           disabled={isCellTextNonEmpty || isReviewMode}
//                           className="w-full border-none bg-transparent focus:ring-2 focus:ring-blue-500"
//                           dir={questionDir}
//                         />
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     default:
//       return null;
//   }
// };

// const QuestionRenderer = ({
//   question,
//   questionIndex,
//   userAnswers,
//   onAnswerChange,
//   isReviewMode = false,
//   t,
//   isRTL,
//   flexDir,
// }) => {
//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 1:
//         return "bg-green-100 text-green-800 border-green-200";
//       case 2:
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case 3:
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getDifficultyLabel = (difficulty) => {
//     switch (difficulty) {
//       case 1:
//         return isRTL ? "سهل" : "Easy";
//       case 2:
//         return isRTL ? "متوسط" : "Medium";
//       case 3:
//         return isRTL ? "صعب" : "Hard";
//       default:
//         return isRTL ? "غير محدد" : "Not specified";
//     }
//   };

//   const getQuestionTypeLabel = (type) => {
//     const types = {
//       "multiple-choice": isRTL ? "اختيار متعدد" : "Multiple Choice",
//       "short-answer": isRTL ? "إجابة قصيرة" : "Short Answer",
//       "fill-in-the-blank": isRTL ? "املأ الفراغ" : "Fill in the Blank",
//       matching: isRTL ? "توصيل" : "Matching",
//       "drag-and-drop": isRTL ? "سحب وإفلات" : "Drag and Drop",
//       "table-completion": isRTL ? "إكمال الجدول" : "Table Completion",
//     };
//     return types[type] || type;
//   };

//   return (
//     <Card className="mb-6">
//       <CardHeader className="pb-4">
//         <div className={`flex items-start justify-between ${flexDir}`}>
//           <div className="flex-1">
//             <CardTitle className="text-lg" dir={getDirection(question.questionText)}>
//               {t.question.replace("%d", questionIndex + 1).replace("%d", "?")}
//             </CardTitle>
//             <CardDescription className="mt-2" dir={getDirection(question.questionText)}>
//               {question.questionText}
//             </CardDescription>
//           </div>
//           <div className={`flex gap-2 ${flexDir}`}>
//             <Badge
//               variant="outline"
//               className={`text-xs ${getDifficultyColor(question.difficulty)}`}
//             >
//               {getDifficultyLabel(question.difficulty)}
//             </Badge>
//             <Badge variant="secondary" className="text-xs">
//               {getQuestionTypeLabel(question.type)}
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {renderQuestion(
//           question,
//           userAnswers,
//           onAnswerChange,
//           isReviewMode,
//           t,
//           isRTL
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// const SubmitExam = () => {
//   const { examId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { currentExam, loading, error } = useSelector((state) => state.exam);
//   const user = useSelector((state) => state.auth.user);

//   // RTL Logic
//   const isRTL = currentExam ? getDirection(currentExam.title) === "rtl" : false;
//   const t = isRTL ? translations.ar : translations.fr;
//   const flexDir = isRTL ? "flex-row-reverse" : "flex-row";
//   const spaceDir = isRTL ? "space-x-reverse" : "space-x";

//   const [userAnswers, setUserAnswers] = useState({});
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSubmitDialog, setShowSubmitDialog] = useState(false);
//   const [isReviewMode, setIsReviewMode] = useState(false);
//   const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
//   const [startTime] = useState(new Date().toISOString());

//   // Fetch exam data
//   useEffect(() => {
//     if (examId) {
//       dispatch(getExamById(examId));
//     }
//   }, [dispatch, examId]);

//   // Initialize timer
//   useEffect(() => {
//     if (currentExam?.exercises?.[0]?.exercise?.timeLimit) {
//       const totalTime = currentExam.exercises.reduce(
//         (sum, ex) => sum + (ex.exercise?.timeLimit || 0),
//         0
//       );
//       setTimeRemaining(totalTime);
//     }
//   }, [currentExam]);

//   // Timer countdown
//   useEffect(() => {
//     if (timeRemaining > 0 && !isReviewMode) {
//       const timer = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 1) {
//             handleAutoSubmit();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [timeRemaining, isReviewMode]);

//   // Auto-submit when time runs out
//   const handleAutoSubmit = useCallback(async () => {
//     toast.warning(
//       isRTL
//         ? "انتهى الوقت! جارٍ إرسال الامتحان تلقائيًا."
//         : "Time's up! Auto-submitting exam."
//     );
//     await handleSubmitExam();
//   }, [isRTL]);

//   // Handle answer changes
//   const handleAnswerChange = (questionId, answer) => {
//     setUserAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: answer,
//     }));
//   };

//   // Format answers for submission
//   const formatAnswersForSubmission = () => {
//     const formattedAnswers = {};

//     currentExam.exercises.forEach((exerciseData) => {
//       const exerciseId = exerciseData.exercise._id;
//       formattedAnswers[exerciseId] = exerciseData.exercise.questions.map(
//         (question) => {
//           const answer = userAnswers[question._id];

//           if (question.type === "table-completion") {
//             const tableAnswers = [];
//             question.tableCompletion.rows.forEach((_, rowIndex) => {
//               question.tableCompletion.columns.forEach((_, colIndex) => {
//                 const cellAnswer = answer?.[rowIndex]?.[colIndex] || "";
//                 tableAnswers.push({
//                   rowIndex,
//                   columnIndex: colIndex,
//                   text: cellAnswer,
//                 });
//               });
//             });
//             return tableAnswers;
//           }

//           return answer;
//         }
//       );
//     });

//     return formattedAnswers;
//   };

//   // Submit exam
//   const handleSubmitExam = async () => {
//     setIsSubmitting(true);
//     try {
//       const submissionData = {
//         userAnswers: formatAnswersForSubmission(),
//         userId: user.id,
//         startTime,
//       };

//       await dispatch(submitExam({ examId, ...submissionData })).unwrap();
//       toast.success(
//         isRTL ? "تم إرسال الامتحان بنجاح!" : "Exam submitted successfully!"
//       );
//       navigate(`/exam/${examId}`);
//     } catch (err) {
//       toast.error(
//         isRTL
//           ? `خطأ في إرسال الامتحان: ${err.message || err}`
//           : `Error submitting exam: ${err.message || err}`
//       );
//     } finally {
//       setIsSubmitting(false);
//       setShowSubmitDialog(false);
//     }
//   };

//   // Format time for display
//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;

//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
//         .toString()
//         .padStart(2, "0")}`;
//     }
//     return `${minutes}:${secs.toString().padStart(2, "0")}`;
//   };

//   // Calculate progress
//   const getProgress = () => {
//     if (!currentExam?.exercises) return 0;
//     const totalQuestions = currentExam.exercises.reduce(
//       (sum, ex) => sum + (ex.exercise?.questions?.length || 0),
//       0
//     );
//     const answeredQuestions = Object.keys(userAnswers).length;
//     return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
//   };

//   // Toggle flag for a question
//   const toggleQuestionFlag = (questionIndex) => {
//     setFlaggedQuestions((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(questionIndex)) {
//         newSet.delete(questionIndex);
//       } else {
//         newSet.add(questionIndex);
//       }
//       return newSet;
//     });
//   };

//   // Get all questions
//   const getAllQuestions = () => {
//     if (!currentExam?.exercises) return [];
//     const questions = [];
//     currentExam.exercises.forEach((exerciseData) => {
//       if (exerciseData.exercise?.questions) {
//         exerciseData.exercise.questions.forEach((question) => {
//           questions.push({
//             ...question,
//             exerciseId: exerciseData.exercise._id,
//           });
//         });
//       }
//     });
//     return questions;
//   };

//   const allQuestions = getAllQuestions();
//   const currentQuestion = allQuestions[currentQuestionIndex];

//   if (loading) {
//     return (
//       <div
//         className="flex items-center justify-center min-h-screen"
//         dir={isRTL ? "rtl" : "ltr"}
//       >
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p>{t.loadingExam}</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !currentExam) {
//     return (
//       <Alert
//         variant="destructive"
//         className="max-w-2xl mx-auto mt-8"
//         dir={isRTL ? "rtl" : "ltr"}
//       >
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>{t.failedToLoad}</AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
//       {/* Exam Header with Title and Timer */}
//       <Card className="mb-6">
//         <CardHeader>
//           <div className={`flex items-center justify-between ${flexDir}`}>
//             {isRTL ? (
//               <>
//                 <div className={`text-${isRTL ? "right" : "left"}`}>
//                   <div className={`flex items-center gap-2 mb-2 ${flexDir}`}>
//                     <Timer className="h-4 w-4" />
//                     <span
//                       className={`font-mono text-lg ${
//                         timeRemaining < 300 ? "text-red-600" : ""
//                       }`}
//                       dir="ltr"
//                     >
//                       {t.timeRemaining}: {formatTime(timeRemaining)}
//                     </span>
//                   </div>
//                   <Progress value={getProgress()} className="w-32" />
//                 </div>
//                 <div>
//                   <CardTitle
//                     className="text-2xl flex items-center gap-2"
//                     dir={getDirection(currentExam.title)}
//                   >
//                     <FileText className="h-6 w-6" />
//                     {currentExam.title}
//                   </CardTitle>
//                   <CardDescription className="mt-2">
//                     {t.questionsCount
//                       .replace("%d", allQuestions.length)
//                       .replace("%d", currentExam.exercises?.length || 0)}
//                   </CardDescription>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div>
//                   <CardTitle
//                     className="text-2xl flex items-center gap-2"
//                     dir={getDirection(currentExam.title)}
//                   >
//                     <FileText className="h-6 w-6" />
//                     {currentExam.title}
//                   </CardTitle>
//                   <CardDescription className="mt-2">
//                     {t.questionsCount
//                       .replace("%d", allQuestions.length)
//                       .replace("%d", currentExam.exercises?.length || 0)}
//                   </CardDescription>
//                 </div>
//                 <div className={`text-${isRTL ? "left" : "right"}`}>
//                   <div className={`flex items-center gap-2 mb-2 ${flexDir}`}>
//                     <Timer className="h-4 w-4" />
//                     <span
//                       className={`font-mono text-lg ${
//                         timeRemaining < 300 ? "text-red-600" : ""
//                       }`}
//                       dir="ltr"
//                     >
//                       {t.timeRemaining}: {formatTime(timeRemaining)}
//                     </span>
//                   </div>
//                   <Progress value={getProgress()} className="w-32" />
//                 </div>
//               </>
//             )}
//           </div>
//         </CardHeader>
//       </Card>

//       {/* Navigation Controls */}
//       <Card className="mb-6">
//         <CardContent className="p-4">
//           <div className={`flex items-center justify-between ${flexDir}`}>
//             <div className={`flex items-center gap-4 ${spaceDir}`}>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
//                 }
//                 disabled={currentQuestionIndex === 0}
//               >
//                 {isRTL ? (
//                   <>
//                     {t.next}
//                     <ArrowRight className="h-4 w-4 ml-1" />
//                   </>
//                 ) : (
//                   <>
//                     <ArrowLeft className="h-4 w-4 mr-1" />
//                     {t.previous}
//                   </>
//                 )}
//               </Button>
//               <span className="text-sm text-muted-foreground">
//                 {t.question
//                   .replace("%d", currentQuestionIndex + 1)
//                   .replace("%d", allQuestions.length)}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   setCurrentQuestionIndex(
//                     Math.min(allQuestions.length - 1, currentQuestionIndex + 1)
//                   )
//                 }
//                 disabled={currentQuestionIndex === allQuestions.length - 1}
//               >
//                 {isRTL ? (
//                   <>
//                     <ArrowLeft className="h-4 w-4 mr-1" />
//                     {t.previous}
//                   </>
//                 ) : (
//                   <>
//                     {t.next}
//                     <ArrowRight className="h-4 w-4 ml-1" />
//                   </>
//                 )}
//               </Button>
//             </div>
//             <div className={`flex items-center gap-2 ${spaceDir}`}>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => toggleQuestionFlag(currentQuestionIndex)}
//                 className={
//                   flaggedQuestions.has(currentQuestionIndex)
//                     ? "bg-yellow-100"
//                     : ""
//                 }
//               >
//                 <Flag className="h-4 w-4" />
//                 <span className={isRTL ? "mr-1" : "ml-1"}>
//                   {flaggedQuestions.has(currentQuestionIndex)
//                     ? t.flagged
//                     : t.flag}
//                 </span>
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setIsReviewMode(!isReviewMode)}
//               >
//                 {isReviewMode ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//                 <span className={isRTL ? "mr-1" : "ml-1"}>
//                   {isReviewMode ? t.edit : t.review}
//                 </span>
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Question Grid Navigation */}
//       <Card className="mb-6">
//         <CardContent className="p-4">
//           <div className="grid grid-cols-10 gap-2" dir="ltr">
//             {allQuestions.map((q, idx) => {
//               const hasAnswer = userAnswers[q._id] !== undefined;
//               return (
//                 <Button
//                   key={idx}
//                   variant={currentQuestionIndex === idx ? "default" : "outline"}
//                   size="sm"
//                   className={`h-8 w-8 p-0 relative ${
//                     hasAnswer ? "bg-green-100 border-green-300" : ""
//                   } ${
//                     flaggedQuestions.has(idx) ? "ring-2 ring-yellow-400" : ""
//                   }`}
//                   onClick={() => setCurrentQuestionIndex(idx)}
//                 >
//                   {idx + 1}
//                   {hasAnswer && (
//                     <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
//                   )}
//                   {flaggedQuestions.has(idx) && (
//                     <Flag className="absolute -top-1 -left-1 h-3 w-3 text-yellow-600" />
//                   )}
//                 </Button>
//               );
//             })}
//           </div>
//           <div
//             className={`flex items-center gap-4 mt-3 text-xs text-muted-foreground ${flexDir}`}
//           >
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
//               <span>{t.answered}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 border border-gray-300 rounded"></div>
//               <span>{t.unanswered}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Flag className="h-3 w-3 text-yellow-600" />
//               <span>{t.flagged}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Current Question */}
//       {currentQuestion && (
//         <QuestionRenderer
//           question={currentQuestion}
//           questionIndex={currentQuestionIndex}
//           userAnswers={userAnswers}
//           onAnswerChange={handleAnswerChange}
//           isReviewMode={isReviewMode}
//           t={t}
//           isRTL={isRTL}
//           flexDir={flexDir}
//         />
//       )}

//       {/* Submit Section */}
//       <Card>
//         <CardContent className="p-6">
//           <div className={`flex items-center justify-between ${flexDir}`}>
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 {t.answeredQuestions
//                   .replace("%d", Object.keys(userAnswers).length)
//                   .replace("%d", allQuestions.length)}
//               </p>
//               {flaggedQuestions.size > 0 && (
//                 <p className="text-sm text-yellow-600 mt-1">
//                   {t.questionsFlagged.replace("%d", flaggedQuestions.size)}
//                 </p>
//               )}
//             </div>
//             <Button
//               onClick={() => setShowSubmitDialog(true)}
//               disabled={isSubmitting || Object.keys(userAnswers).length === 0}
//               size="lg"
//             >
//               <Send className="h-4 w-4" />
//               <span className={isRTL ? "mr-2" : "ml-2"}>{t.submitExam}</span>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Submit Confirmation Dialog */}
//       <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
//         <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{t.confirmSubmission}</AlertDialogTitle>
//             <AlertDialogDescription>
//               {isRTL
//                 ? "هل أنت متأكد أنك تريد إرسال امتحانك؟"
//                 : "Are you sure you want to submit your exam?"}{" "}
//               {isRTL ? "لقد أجبت على" : "You've answered"}{" "}
//               {Object.keys(userAnswers).length}{" "}
//               {isRTL ? "من" : "of"} {allQuestions.length}{" "}
//               {isRTL ? "أسئلة." : "questions."}
//               {flaggedQuestions.size > 0 && (
//                 <span className="block mt-2 text-yellow-600">
//                   {t.note}:{" "}
//                   {t.questionsFlagged.replace("%d", flaggedQuestions.size)}
//                 </span>
//               )}
//               <span className="block mt-2 font-medium">
//                 {t.thisActionCannotBeUndone}
//               </span>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className={flexDir}>
//             <AlertDialogCancel>{t.continueExam}</AlertDialogCancel>
//             <AlertDialogAction onClick={handleSubmitExam} disabled={isSubmitting}>
//               {isSubmitting
//                 ? isRTL
//                   ? "جارٍ الإرسال..."
//                   : "Submitting..."
//                 : t.submitNow}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default SubmitExam;
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExamById, submitExam } from "@/store/examSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import {
  FileText,
  Send,
  AlertCircle,
  CheckCircle,
  Timer,
  ArrowLeft,
  ArrowRight,
  Flag,
  Eye,
  EyeOff,
  Download,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// RTL Detection Function
const getDirection = (text) => {
  if (!text) return "ltr";
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlChars.test(text) ? "rtl" : "ltr";
};

// MathText component for rendering text
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

// Exercise Header Component
const ExerciseHeader = ({ exercise, isRTL, flexDir }) => {
  if (!exercise) return null;

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl" dir={getDirection(exercise?.title)}>
          <MathText text={exercise?.title} />
        </CardTitle>
        <div className={`flex flex-col md:flex-row md:items-start gap-4 ${flexDir}`}>
          {/* Left: Description */}
          <div className="flex-1">
            <CardDescription
              className="text-gray-700 mt-2 text-base leading-relaxed"
              dir={getDirection(exercise?.description)}
            >
              <MathText text={exercise?.description} />
            </CardDescription>
          </div>
          
          {/* Right: Attachment */}
          {exercise?.attachment?.file && (
            <div className="flex-shrink-0 w-full md:w-2/5">
              {exercise.attachment.file.mimetype.startsWith("image/") && (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={exercise.attachment.file.url}
                    alt={exercise.attachment.file.originalname}
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </div>
              )}

              {exercise.attachment.file.mimetype.startsWith("audio/") && (
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <audio controls className="w-full">
                    <source
                      src={exercise.attachment.file.url}
                      type={exercise.attachment.file.mimetype}
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {(exercise.attachment.file.mimetype === "application/pdf" ||
                exercise.attachment.file.mimetype.startsWith("application/")) && (
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <a
                    href={exercise.attachment.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download {exercise.attachment.file.originalname}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

// Translations
const translations = {
  ar: {
    enterAnswer: "أدخل إجابتك هنا",
    selectMatch: "اختر التطابق",
    error: "خطأ",
    question: "السؤال %d",
    previous: "السابق",
    next: "التالي",
    flag: "علم",
    flagged: "معلّم",
    review: "مراجعة",
    edit: "تحرير",
    answered: "تمت الإجابة",
    unanswered: "لم تتم الإجابة",
    confirmSubmission: "تأكيد الإرسال",
    submitNow: "إرسال الآن",
    continueExam: "متابعة الامتحان",
    note: "ملاحظة",
    questionsFlagged: "سؤال(أسئلة) معلّمة للمراجعة",
    thisActionCannotBeUndone: "لا يمكن التراجع عن هذا الإجراء.",
    loadingExam: "جارٍ تحميل الامتحان...",
    failedToLoad: "فشل تحميل الامتحان. الرجاء المحاولة مرة أخرى.",
    examTitle: "امتحان",
    questionsCount: "%d أسئلة • %d تمارين",
    timeRemaining: "الوقت المتبقي",
    answeredQuestions: "%d من %d أسئلة تمت الإجابة",
    flaggedQuestions: "%d سؤال معلّم للمراجعة",
    submitExam: "إرسال الامتحان",
    element: "عنصر",
  },
  fr: {
    enterAnswer: "Entrez votre réponse ici",
    selectMatch: "Sélectionner une correspondance",
    error: "Erreur",
    question: "Question %d",
    previous: "Précédent",
    next: "Suivant",
    flag: "Drapeau",
    flagged: "Marqué",
    review: "Revoir",
    edit: "Modifier",
    answered: "Répondu",
    unanswered: "Non répondu",
    confirmSubmission: "Confirmer la soumission",
    submitNow: "Soumettre maintenant",
    continueExam: "Continuer l'examen",
    note: "Remarque",
    questionsFlagged: "question(s) marquée(s) pour révision",
    thisActionCannotBeUndone: "Cette action ne peut pas être annulée.",
    loadingExam: "Chargement de l'examen...",
    failedToLoad: "Échec du chargement de l'examen. Veuillez réessayer.",
    examTitle: "Examen",
    questionsCount: "%d questions • %d exercices",
    timeRemaining: "Temps restant",
    answeredQuestions: "%d sur %d questions répondues",
    flaggedQuestions: "%d question(s) marquée(s) pour révision",
    submitExam: "Soumettre l'examen",
    element: "Élément",
  },
};

const renderQuestion = (
  question,
  userAnswers,
  handleAnswerChange,
  isReviewMode = false,
  t,
  isRTL
) => {
  const applyDisabledProps = (component) => {
    if (!component || !isReviewMode) return component;

    const disableComponent = (element) => {
      if (!element || !React.isValidElement(element)) return element;

      const disabledProps = {
        ...(element.type === Input && { disabled: true }),
        ...(element.type === Textarea && { disabled: true }),
        ...(element.type === Select && { disabled: true }),
        ...(element.type === RadioGroup && { disabled: true }),
        ...(element.type === DragDropContext && {
          onDragEnd: () => {},
        }),
      };

      return React.cloneElement(element, {
        ...disabledProps,
        children: React.Children.map(element.props.children, (child) =>
          disableComponent(child)
        ),
      });
    };

    return disableComponent(component);
  };

  const questionDir = getDirection(question.questionText);
  const flexDir = questionDir === "rtl" ? "flex-row-reverse" : "flex-row";

  switch (question.type) {
    case "multiple-choice":
      return applyDisabledProps(
        <RadioGroup
          value={userAnswers[question._id] || ""}
          onValueChange={(value) => handleAnswerChange(question._id, value)}
          className="space-y-2"
          dir={questionDir}
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${flexDir}`}
            >
              <RadioGroupItem value={option} id={`${question._id}-${index}`} />
              <Label
                htmlFor={`${question._id}-${index}`}
                className="flex-grow cursor-pointer"
                dir={getDirection(option)}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "short-answer":
      return applyDisabledProps(
        <Textarea
          value={userAnswers[question._id] || ""}
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          placeholder={t.enterAnswer}
          className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          dir={questionDir}
        />
      );

    case "fill-in-the-blank":
      return applyDisabledProps(
        <div className="space-y-2">
          {(question.correctAnswers || []).map((_, index) => (
            <Input
              key={index}
              value={
                userAnswers[question._id]?.[index] !== undefined
                  ? userAnswers[question._id][index]
                  : ""
              }
              onChange={(e) => {
                const updatedAnswers = userAnswers[question._id]
                  ? [...userAnswers[question._id]]
                  : [];
                updatedAnswers[index] = e.target.value;
                handleAnswerChange(question._id, updatedAnswers);
              }}
              placeholder={`${t.enterAnswer} ${index + 1}`}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
              dir={questionDir}
            />
          ))}
        </div>
      );

    case "matching":
      const leftItems = question.matching.leftItems || [];
      const rightItems = question.matching.rightItems || [];

      return applyDisabledProps(
        <div className="space-y-4" dir={questionDir}>
          {leftItems.map((term, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 ${flexDir}`}
            >
              <Label
                className="w-1/3 font-medium"
                dir={getDirection(term)}
              >
                {term}
              </Label>
              <Select
                value={userAnswers[question._id]?.[index]?.definition || ""}
                onValueChange={(value) => {
                  const currentAnswers = userAnswers[question._id] || [];
                  const newAnswers = [...currentAnswers];
                  newAnswers[index] = { term, definition: value };
                  handleAnswerChange(question._id, newAnswers);
                }}
              >
                <SelectTrigger className="w-2/3" dir={questionDir}>
                  <SelectValue placeholder={t.selectMatch} />
                </SelectTrigger>
                <SelectContent>
                  {rightItems.map((definition) => (
                    <SelectItem key={definition} value={definition}>
                      {definition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      );

    case "drag-and-drop":
      return applyDisabledProps(
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            const items = Array.from(
              userAnswers[question._id] || question.dragAndDrop.items
            );
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            handleAnswerChange(question._id, items);
          }}
        >
          <Droppable droppableId={question._id}>
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
                dir={questionDir}
              >
                {(userAnswers[question._id] || question.dragAndDrop.items).map(
                  (item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 bg-white border rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow duration-200"
                          dir={getDirection(item)}
                        >
                          {item}
                        </li>
                      )}
                    </Draggable>
                  )
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      );

    case "table-completion":
      const { columns, rows, cells } = question.tableCompletion;

      if (!userAnswers[question._id]) {
        const emptyAnswers = rows.map(() => Array(columns.length).fill(""));
        handleAnswerChange(question._id, emptyAnswers);
      }

      return applyDisabledProps(
        <div className="overflow-x-auto" dir={questionDir}>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className={`border border-gray-300 p-2 ${
                    questionDir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t.element}
                </th>
                {columns.map((header, index) => (
                  <th
                    key={index}
                    className={`border border-gray-300 p-2 ${
                      questionDir === "rtl" ? "text-right" : "text-left"
                    }`}
                    dir={getDirection(header)}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((rowLabel, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td
                    className={`border border-gray-300 p-2 font-medium ${
                      questionDir === "rtl" ? "text-right" : "text-left"
                    }`}
                    dir={getDirection(rowLabel)}
                  >
                    {rowLabel}
                  </td>
                  {columns.map((_, colIndex) => {
                    const cell = cells.find(
                      (c) =>
                        c.rowIndex === rowIndex && c.columnIndex === colIndex
                    );
                    const cellText = cell?.text || "";
                    const isCellTextNonEmpty = cellText.trim() !== "";
                    const inputValue = isCellTextNonEmpty
                      ? cellText
                      : userAnswers[question._id]?.[rowIndex]?.[colIndex] || "";

                    return (
                      <td
                        key={colIndex}
                        className="border border-gray-300 p-2"
                      >
                        <Input
                          value={inputValue}
                          onChange={(e) => {
                            if (!isCellTextNonEmpty) {
                              const newAnswers = [
                                ...(userAnswers[question._id] || []),
                              ];
                              if (!newAnswers[rowIndex]) {
                                newAnswers[rowIndex] = Array(
                                  columns.length
                                ).fill("");
                              }
                              newAnswers[rowIndex][colIndex] = e.target.value;
                              handleAnswerChange(question._id, newAnswers);
                            }
                          }}
                          disabled={isCellTextNonEmpty || isReviewMode}
                          className="w-full border-none bg-transparent focus:ring-2 focus:ring-blue-500"
                          dir={questionDir}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};

const QuestionRenderer = ({
  question,
  questionIndex,
  userAnswers,
  onAnswerChange,
  isReviewMode = false,
  t,
  isRTL,
  flexDir,
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-800 border-green-200";
      case 2:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 3:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1:
        return isRTL ? "سهل" : "Easy";
      case 2:
        return isRTL ? "متوسط" : "Medium";
      case 3:
        return isRTL ? "صعب" : "Hard";
      default:
        return isRTL ? "غير محدد" : "Not specified";
    }
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      "multiple-choice": isRTL ? "اختيار متعدد" : "Multiple Choice",
      "short-answer": isRTL ? "إجابة قصيرة" : "Short Answer",
      "fill-in-the-blank": isRTL ? "املأ الفراغ" : "Fill in the Blank",
      matching: isRTL ? "توصيل" : "Matching",
      "drag-and-drop": isRTL ? "سحب وإفلات" : "Drag and Drop",
      "table-completion": isRTL ? "إكمال الجدول" : "Table Completion",
    };
    return types[type] || type;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className={`flex items-start justify-between ${flexDir}`}>
          <div className="flex-1">
            <CardTitle className="text-lg" dir={getDirection(question.questionText)}>
              {t.question.replace("%d", questionIndex + 1)}
            </CardTitle>
            <CardDescription className="mt-2" dir={getDirection(question.questionText)}>
              {question.questionText}
            </CardDescription>
          </div>
          <div className={`flex gap-2 ${flexDir}`}>
            <Badge
              variant="outline"
              className={`text-xs ${getDifficultyColor(question.difficulty)}`}
            >
              {getDifficultyLabel(question.difficulty)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {getQuestionTypeLabel(question.type)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderQuestion(
          question,
          userAnswers,
          onAnswerChange,
          isReviewMode,
          t,
          isRTL
        )}
      </CardContent>
    </Card>
  );
};

const SubmitExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentExam, loading, error } = useSelector((state) => state.exam);
  const user = useSelector((state) => state.auth.user);

  // RTL Logic
  const isRTL = currentExam ? getDirection(currentExam.title) === "rtl" : false;
  const t = isRTL ? translations.ar : translations.fr;
  const flexDir = isRTL ? "flex-row-reverse" : "flex-row";
  const spaceDir = isRTL ? "space-x-reverse" : "space-x";

  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [startTime] = useState(new Date().toISOString());
  const [currentExercise, setCurrentExercise] = useState(null);

  // Fetch exam data
  useEffect(() => {
    if (examId) {
      dispatch(getExamById(examId));
    }
  }, [dispatch, examId]);

  // Initialize timer
  useEffect(() => {
    if (currentExam?.exercises?.[0]?.exercise?.timeLimit) {
      const totalTime = currentExam.exercises.reduce(
        (sum, ex) => sum + (ex.exercise?.timeLimit || 0),
        0
      );
      setTimeRemaining(totalTime);
    }
  }, [currentExam]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isReviewMode) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isReviewMode]);

  // Get all questions with exercise context
  const getAllQuestions = () => {
    if (!currentExam?.exercises) return [];
    const questions = [];
    currentExam.exercises.forEach((exerciseData) => {
      if (exerciseData.exercise?.questions) {
        exerciseData.exercise.questions.forEach((question) => {
          questions.push({
            ...question,
            exerciseId: exerciseData.exercise._id,
            exercise: exerciseData.exercise, // Include full exercise object
          });
        });
      }
    });
    return questions;
  };

  const allQuestions = getAllQuestions();

  // Update current exercise when question changes
  useEffect(() => {
    if (allQuestions.length > 0 && currentQuestionIndex >= 0) {
      const currentQuestion = allQuestions[currentQuestionIndex];
      if (currentQuestion?.exercise) {
        setCurrentExercise(currentQuestion.exercise);
      }
    }
  }, [currentQuestionIndex, allQuestions]);

  const currentQuestion = allQuestions[currentQuestionIndex];

  // Auto-submit when time runs out
  const handleAutoSubmit = useCallback(async () => {
    toast.warning(
      isRTL
        ? "انتهى الوقت! جارٍ إرسال الامتحان تلقائيًا."
        : "Time's up! Auto-submitting exam."
    );
    await handleSubmitExam();
  }, [isRTL]);

  // Handle answer changes
  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  // Format answers for submission
  const formatAnswersForSubmission = () => {
    const formattedAnswers = {};

    currentExam.exercises.forEach((exerciseData) => {
      const exerciseId = exerciseData.exercise._id;
      formattedAnswers[exerciseId] = exerciseData.exercise.questions.map(
        (question) => {
          const answer = userAnswers[question._id];

          if (question.type === "table-completion") {
            const tableAnswers = [];
            question.tableCompletion.rows.forEach((_, rowIndex) => {
              question.tableCompletion.columns.forEach((_, colIndex) => {
                const cellAnswer = answer?.[rowIndex]?.[colIndex] || "";
                tableAnswers.push({
                  rowIndex,
                  columnIndex: colIndex,
                  text: cellAnswer,
                });
              });
            });
            return tableAnswers;
          }

          return answer;
        }
      );
    });

    return formattedAnswers;
  };

  // Submit exam
  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        userAnswers: formatAnswersForSubmission(),
        userId: user.id,
        startTime,
      };

      await dispatch(submitExam({ examId, ...submissionData })).unwrap();
      toast.success(
        isRTL ? "تم إرسال الامتحان بنجاح!" : "Exam submitted successfully!"
      );
      navigate(`/exam/${examId}`);
    } catch (err) {
      toast.error(
        isRTL
          ? `خطأ في إرسال الامتحان: ${err.message || err}`
          : `Error submitting exam: ${err.message || err}`
      );
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress
  const getProgress = () => {
    if (!currentExam?.exercises) return 0;
    const totalQuestions = currentExam.exercises.reduce(
      (sum, ex) => sum + (ex.exercise?.questions?.length || 0),
      0
    );
    const answeredQuestions = Object.keys(userAnswers).length;
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  };

  // Toggle flag for a question
  const toggleQuestionFlag = (questionIndex) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t.loadingExam}</p>
        </div>
      </div>
    );
  }

  if (error || !currentExam) {
    return (
      <Alert
        variant="destructive"
        className="max-w-2xl mx-auto mt-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t.failedToLoad}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Exam Header with Title and Timer */}
      <Card className="mb-6">
        <CardHeader>
          <div className={`flex items-center justify-between ${flexDir}`}>
            {isRTL ? (
              <>
                <div className={`text-${isRTL ? "right" : "left"}`}>
                  <div className={`flex items-center gap-2 mb-2 ${flexDir}`}>
                    <Timer className="h-4 w-4" />
                    <span
                      className={`font-mono text-lg ${
                        timeRemaining < 300 ? "text-red-600" : ""
                      }`}
                      dir="ltr"
                    >
                      {t.timeRemaining}: {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <Progress value={getProgress()} className="w-32" />
                </div>
                <div>
                  <CardTitle
                    className="text-2xl flex items-center gap-2"
                    dir={getDirection(currentExam.title)}
                  >
                    <FileText className="h-6 w-6" />
                    {currentExam.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {t.questionsCount
                      .replace("%d", allQuestions.length)
                      .replace("%d", currentExam.exercises?.length || 0)}
                  </CardDescription>
                </div>
              </>
            ) : (
              <>
                <div>
                  <CardTitle
                    className="text-2xl flex items-center gap-2"
                    dir={getDirection(currentExam.title)}
                  >
                    <FileText className="h-6 w-6" />
                    {currentExam.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {t.questionsCount
                      .replace("%d", allQuestions.length)
                      .replace("%d", currentExam.exercises?.length || 0)}
                  </CardDescription>
                </div>
                <div className={`text-${isRTL ? "left" : "right"}`}>
                  <div className={`flex items-center gap-2 mb-2 ${flexDir}`}>
                    <Timer className="h-4 w-4" />
                    <span
                      className={`font-mono text-lg ${
                        timeRemaining < 300 ? "text-red-600" : ""
                      }`}
                      dir="ltr"
                    >
                      {t.timeRemaining}: {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <Progress value={getProgress()} className="w-32" />
                </div>
              </>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className={`flex items-center justify-between ${flexDir}`}>
            <div className={`flex items-center gap-4 ${spaceDir}`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                }
                disabled={currentQuestionIndex === 0}
              >
                {isRTL ? (
                  <>
                    {t.next}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t.previous}
                  </>
                )}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t.question
                  .replace("%d", currentQuestionIndex + 1)
                  .replace("%d", allQuestions.length)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentQuestionIndex(
                    Math.min(allQuestions.length - 1, currentQuestionIndex + 1)
                  )
                }
                disabled={currentQuestionIndex === allQuestions.length - 1}
              >
                {isRTL ? (
                  <>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t.previous}
                  </>
                ) : (
                  <>
                    {t.next}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
            <div className={`flex items-center gap-2 ${spaceDir}`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleQuestionFlag(currentQuestionIndex)}
                className={
                  flaggedQuestions.has(currentQuestionIndex)
                    ? "bg-yellow-100"
                    : ""
                }
              >
                <Flag className="h-4 w-4" />
                <span className={isRTL ? "mr-1" : "ml-1"}>
                  {flaggedQuestions.has(currentQuestionIndex)
                    ? t.flagged
                    : t.flag}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReviewMode(!isReviewMode)}
              >
                {isReviewMode ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className={isRTL ? "mr-1" : "ml-1"}>
                  {isReviewMode ? t.edit : t.review}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Grid Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-10 gap-2" dir="ltr">
            {allQuestions.map((q, idx) => {
              const hasAnswer = userAnswers[q._id] !== undefined;
              return (
                <Button
                  key={idx}
                  variant={currentQuestionIndex === idx ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 p-0 relative ${
                    hasAnswer ? "bg-green-100 border-green-300" : ""
                  } ${
                    flaggedQuestions.has(idx) ? "ring-2 ring-yellow-400" : ""
                  }`}
                  onClick={() => setCurrentQuestionIndex(idx)}
                >
                  {idx + 1}
                  {hasAnswer && (
                    <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
                  )}
                  {flaggedQuestions.has(idx) && (
                    <Flag className="absolute -top-1 -left-1 h-3 w-3 text-yellow-600" />
                  )}
                </Button>
              );
            })}
          </div>
          <div
            className={`flex items-center gap-4 mt-3 text-xs text-muted-foreground ${flexDir}`}
          >
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>{t.answered}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-gray-300 rounded"></div>
              <span>{t.unanswered}</span>
            </div>
            <div className="flex items-center gap-1">
              <Flag className="h-3 w-3 text-yellow-600" />
              <span>{t.flagged}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise Header */}
      {currentExercise && (
        <ExerciseHeader
          exercise={currentExercise}
          isRTL={isRTL}
          flexDir={flexDir}
        />
      )}

      {/* Current Question */}
      {currentQuestion && (
        <QuestionRenderer
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          onAnswerChange={handleAnswerChange}
          isReviewMode={isReviewMode}
          t={t}
          isRTL={isRTL}
          flexDir={flexDir}
        />
      )}

      {/* Submit Section */}
      <Card>
        <CardContent className="p-6">
          <div className={`flex items-center justify-between ${flexDir}`}>
            <div>
              <p className="text-sm text-muted-foreground">
                {t.answeredQuestions
                  .replace("%d", Object.keys(userAnswers).length)
                  .replace("%d", allQuestions.length)}
              </p>
              {flaggedQuestions.size > 0 && (
                <p className="text-sm text-yellow-600 mt-1">
                  {t.questionsFlagged.replace("%d", flaggedQuestions.size)}
                </p>
              )}
            </div>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              disabled={isSubmitting || Object.keys(userAnswers).length === 0}
              size="lg"
            >
              <Send className="h-4 w-4" />
              <span className={isRTL ? "mr-2" : "ml-2"}>{t.submitExam}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmSubmission}</AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL
                ? "هل أنت متأكد أنك تريد إرسال امتحانك؟"
                : "Are you sure you want to submit your exam?"}{" "}
              {isRTL ? "لقد أجبت على" : "You've answered"}{" "}
              {Object.keys(userAnswers).length}{" "}
              {isRTL ? "من" : "of"} {allQuestions.length}{" "}
              {isRTL ? "أسئلة." : "questions."}
              {flaggedQuestions.size > 0 && (
                <span className="block mt-2 text-yellow-600">
                  {t.note}:{" "}
                  {t.questionsFlagged.replace("%d", flaggedQuestions.size)}
                </span>
              )}
              <span className="block mt-2 font-medium">
                {t.thisActionCannotBeUndone}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={flexDir}>
            <AlertDialogCancel>{t.continueExam}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitExam} disabled={isSubmitting}>
              {isSubmitting
                ? isRTL
                  ? "جارٍ الإرسال..."
                  : "Submitting..."
                : t.submitNow}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubmitExam;
