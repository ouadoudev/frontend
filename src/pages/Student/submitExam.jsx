// import { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getExamById, submitExam } from "@/store/examSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
//   FileText, Send, AlertCircle, CheckCircle, Timer, ArrowLeft, ArrowRight, Flag, Eye, EyeOff
// } from "lucide-react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const renderQuestion = (question, userAnswers, handleAnswerChange, isReviewMode = false) => {
//   // Helper to disable inputs based on review mode
//   const applyDisabledProps = (component) => {
//     if (!component || !isReviewMode) return component;

//     // Recursively apply disabled prop to components
//     const disableComponent = (element) => {
//       if (!element || !React.isValidElement(element)) return element;

//       const disabledProps = {
//         ...(element.type === Input && { disabled: true }),
//         ...(element.type === Textarea && { disabled: true }),
//         ...(element.type === Select && { disabled: true }),
//         ...(element.type === RadioGroup && { disabled: true }),
//         ...(element.type === DragDropContext && {
//           onDragEnd: () => {} // Disable drag and drop
//         })
//       };

//       return React.cloneElement(element, {
//         ...disabledProps,
//         children: React.Children.map(element.props.children, (child) =>
//           disableComponent(child)
//         )
//       });
//     };

//     return disableComponent(component);
//   };

//   switch (question.type) {
//     case "multiple-choice":
//       return applyDisabledProps(
//         <RadioGroup
//           value={userAnswers[question._id] || ""}
//           onValueChange={(value) => handleAnswerChange(question._id, value)}
//           className="space-y-2"
//         >
//           {question.options.map((option, index) => (
//             <div
//               key={index}
//               className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
//             >
//               <RadioGroupItem
//                 value={option}
//                 id={`${question._id}-${index}`}
//               />
//               <Label
//                 htmlFor={`${question._id}-${index}`}
//                 className="flex-grow cursor-pointer"
//               >
//                 {option}
//               </Label>
//             </div>
//           ))}
//         </RadioGroup>
//       );

//     case "short-answer":
//     case "fill-in-the-blank":
//       return applyDisabledProps(
//         <Textarea
//           value={userAnswers[question._id] || ""}
//           onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//           placeholder="Enter your answer here"
//           className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//         />
//       );

//     case "matching":
//       return applyDisabledProps(
//         <div className="space-y-4">
//           {question.matching.pairs.map((pair, index) => (
//             <div key={index} className="flex items-center space-x-4">
//               <Label className="w-1/3 text-right font-medium">
//                 {pair.term}
//               </Label>
//               <Select
//                 value={userAnswers[question._id]?.[index]?.definition || ""}
//                 onValueChange={(value) =>
//                   handleAnswerChange(question._id, [
//                     ...(userAnswers[question._id] || []),
//                     { term: pair.term, definition: value },
//                   ])
//                 }
//               >
//                 <SelectTrigger className="w-2/3">
//                   <SelectValue placeholder="Select match" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {question.matching.pairs.map((p) => (
//                     <SelectItem key={p.definition} value={p.definition}>
//                       {p.definition}
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
//               >
//                 {(
//                   userAnswers[question._id] || question.dragAndDrop.items
//                 ).map((item, index) => (
//                   <Draggable key={item} draggableId={item} index={index}>
//                     {(provided) => (
//                       <li
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="p-3 bg-white border rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow duration-200"
//                       >
//                         {item}
//                       </li>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </ul>
//             )}
//           </Droppable>
//         </DragDropContext>
//       );

//     case "table-completion":
//       const { columns, rows, cellCorrections } = question.tableCompletion;

//       // Initialize empty answers if not present
//       if (!userAnswers[question._id]) {
//         const emptyAnswers = rows.map(() => Array(columns.length).fill(""));
//         handleAnswerChange(question._id, emptyAnswers);
//       }

//       return applyDisabledProps(
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 p-2 text-left">
//                   Element
//                 </th>
//                 {columns.map((header, index) => (
//                   <th
//                     key={index}
//                     className="border border-gray-300 p-2 text-left"
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
//                   <td className="border border-gray-300 p-2 font-medium">
//                     {rowLabel}
//                   </td>
//                   {columns.map((_, colIndex) => {
//                     const cellCorrection = cellCorrections.find(
//                       (c) =>
//                         c.rowIndex === rowIndex && c.columnIndex === colIndex
//                     );
//                     return (
//                       <td
//                         key={colIndex}
//                         className="border border-gray-300 p-2"
//                       >
//                         <Input
//                           value={
//                             userAnswers[question._id]?.[rowIndex]?.[colIndex] || ""
//                           }
//                           onChange={(e) => {
//                             const newAnswers = [
//                               ...(userAnswers[question._id] || []),
//                             ];
//                             if (!newAnswers[rowIndex]) {
//                               newAnswers[rowIndex] = Array(columns.length).fill("");
//                             }
//                             newAnswers[rowIndex][colIndex] = e.target.value;
//                             handleAnswerChange(question._id, newAnswers);
//                           }}
//                           className="w-full border-none bg-transparent focus:ring-2 focus:ring-blue-500"
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

// const QuestionRenderer = ({ question, questionIndex, answer, onAnswerChange, isReviewMode = false }) => {
//   // Difficulty helpers
//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 1: return "bg-green-100 text-green-800 border-green-200";
//       case 2: return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case 3: return "bg-red-100 text-red-800 border-red-200";
//       default: return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getDifficultyLabel = (difficulty) => {
//     switch (difficulty) {
//       case 1: return "Easy";
//       case 2: return "Medium";
//       case 3: return "Hard";
//       default: return "Not specified";
//     }
//   };

//   // Question type helpers
//   const getQuestionTypeLabel = (type) => {
//     const types = {
//       "multiple-choice": "Multiple Choice",
//       "short-answer": "Short Answer",
//       "fill-in-the-blank": "Fill in the Blank",
//       "matching": "Matching",
//       "drag-and-drop": "Drag and Drop",
//       "table-completion": "Table Completion",
//     };
//     return types[type] || type;
//   };

//   // Adapt answer and handleAnswerChange for renderQuestion
//   const userAnswers = {
//     [question._id]: answer ? (question.type === "matching" || question.type === "drag-and-drop" || question.type === "table-completion" ? JSON.parse(answer[0] || "[]") : answer[0]) : undefined,
//   };

//   const handleAnswerChange = (questionId, newAnswer) => {
//     onAnswerChange(questionIndex, [question.type === "matching" || question.type === "drag-and-drop" || question.type === "table-completion" ? JSON.stringify(newAnswer) : newAnswer]);
//   };

//   return (
//     <Card className="mb-6">
//       <CardHeader className="pb-4">
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
//             <CardDescription className="mt-2">{question.questionText}</CardDescription>
//           </div>
//           <div className="flex gap-2 ml-4">
//             <Badge variant="outline" className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
//               {getDifficultyLabel(question.difficulty)}
//             </Badge>
//             <Badge variant="secondary" className="text-xs">
//               {getQuestionTypeLabel(question.type)}
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {renderQuestion(question, userAnswers, handleAnswerChange, isReviewMode)}
//       </CardContent>
//     </Card>
//   );
// };

// // Rest of the SubmitExam component remains unchanged
// const SubmitExam = () => {
//   const { examId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { currentExam, loading, error } = useSelector((state) => state.exam);

//   const [answers, setAnswers] = useState({});
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSubmitDialog, setShowSubmitDialog] = useState(false);
//   const [isReviewMode, setIsReviewMode] = useState(false);
//   const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

//   useEffect(() => {
//     if (examId) {
//       dispatch(getExamById(examId));
//     }
//   }, [dispatch, examId]);

//   useEffect(() => {
//     if (currentExam?.exercises?.[0]?.exercise?.timeLimit) {
//       const totalTime = currentExam.exercises.reduce((sum, ex) => sum + (ex.exercise?.timeLimit || 0), 0);
//       setTimeRemaining(totalTime * 60);
//     }
//   }, [currentExam]);

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

//   const handleAutoSubmit = useCallback(async () => {
//     toast.warning("Time's up! Auto-submitting exam.");
//     await handleSubmitExam();
//   }, []);

//   const handleAnswerChange = (questionIndex, answer) => {
//     const currentExercise = getAllQuestions()[questionIndex]?.exerciseId;
//     if (!currentExercise) return;

//     setAnswers((prev) => ({
//       ...prev,
//       [currentExercise]: {
//         ...prev[currentExercise],
//         [questionIndex]: answer,
//       },
//     }));
//   };

//   const handleSubmitExam = async () => {
//     setIsSubmitting(true);
//     try {
//       const userAnswers = currentExam.exercises.map((exerciseData) => ({
//         exerciseId: exerciseData.exercise._id,
//         answers: answers[exerciseData.exercise._id] || {},
//       }));

//       await dispatch(submitExam({ examId, userAnswers })).unwrap();
//       toast.success("Exam submitted successfully!");
//       navigate(`/exam/${examId}/results`);
//     } catch (err) {
//       toast.error(`Error submitting exam: ${err.message || err}`);
//     } finally {
//       setIsSubmitting(false);
//       setShowSubmitDialog(false);
//     }
//   };

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;

//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//     }
//     return `${minutes}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getProgress = () => {
//     if (!currentExam?.exercises) return 0;
//     const totalQuestions = currentExam.exercises.reduce((sum, ex) => sum + (ex.exercise?.questions?.length || 0), 0);
//     const answeredQuestions = Object.values(answers).reduce(
//       (sum, exerciseAnswers) => sum + Object.keys(exerciseAnswers).length,
//       0,
//     );
//     return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
//   };

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

//   const getAllQuestions = () => {
//     if (!currentExam?.exercises) return [];
//     const questions = [];
//     currentExam.exercises.forEach((exerciseData) => {
//       if (exerciseData.exercise?.questions) {
//         exerciseData.exercise.questions.forEach((question, idx) => {
//           questions.push({
//             ...question,
//             exerciseId: exerciseData.exercise._id,
//             originalIndex: idx,
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
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p>Loading exam...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !currentExam) {
//     return (
//       <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>Failed to load exam. Please try again.</AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Header */}
//       <Card className="mb-6">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-2xl flex items-center gap-2">
//                 <FileText className="h-6 w-6" />
//                 {currentExam.title}
//               </CardTitle>
//               <CardDescription className="mt-2">
//                 {allQuestions.length} questions • {currentExam.exercises?.length || 0} exercises
//               </CardDescription>
//             </div>
//             <div className="text-right">
//               <div className="flex items-center gap-2 mb-2">
//                 <Timer className="h-4 w-4" />
//                 <span className={`font-mono text-lg ${timeRemaining < 300 ? "text-red-600" : ""}`}>
//                   {formatTime(timeRemaining)}
//                 </span>
//               </div>
//               <Progress value={getProgress()} className="w-32" />
//             </div>
//           </div>
//         </CardHeader>
//       </Card>

//       {/* Navigation */}
//       <Card className="mb-6">
//         <CardContent className="p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
//                 disabled={currentQuestionIndex === 0}
//               >
//                 <ArrowLeft className="h-4 w-4 mr-1" />
//                 Previous
//               </Button>
//               <span className="text-sm text-muted-foreground">
//                 Question {currentQuestionIndex + 1} of {allQuestions.length}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentQuestionIndex(Math.min(allQuestions.length - 1, currentQuestionIndex + 1))}
//                 disabled={currentQuestionIndex === allQuestions.length - 1}
//               >
//                 Next
//                 <ArrowRight className="h-4 w-4 ml-1" />
//               </Button>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => toggleQuestionFlag(currentQuestionIndex)}
//                 className={flaggedQuestions.has(currentQuestionIndex) ? "bg-yellow-100" : ""}
//               >
//                 <Flag className="h-4 w-4 mr-1" />
//                 {flaggedQuestions.has(currentQuestionIndex) ? "Flagged" : "Flag"}
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setIsReviewMode(!isReviewMode)}>
//                 {isReviewMode ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
//                 {isReviewMode ? "Edit" : "Review"}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Question Grid Navigation */}
//       <Card className="mb-6">
//         <CardContent className="p-4">
//           <div className="grid grid-cols-10 gap-2">
//             {allQuestions.map((_, idx) => {
//               const hasAnswer = currentQuestion?.exerciseId && answers[currentQuestion.exerciseId]?.[idx];
//               return (
//                 <Button
//                   key={idx}
//                   variant={currentQuestionIndex === idx ? "default" : "outline"}
//                   size="sm"
//                   className={`h-8 w-8 p-0 relative ${hasAnswer ? "bg-green-100 border-green-300" : ""} ${
//                     flaggedQuestions.has(idx) ? "ring-2 ring-yellow-400" : ""
//                   }`}
//                   onClick={() => setCurrentQuestionIndex(idx)}
//                 >
//                   {idx + 1}
//                   {hasAnswer && <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />}
//                   {flaggedQuestions.has(idx) && <Flag className="absolute -top-1 -left-1 h-3 w-3 text-yellow-600" />}
//                 </Button>
//               );
//             })}
//           </div>
//           <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
//               <span>Answered</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 border border-gray-300 rounded"></div>
//               <span>Unanswered</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Flag className="h-3 w-3 text-yellow-600" />
//               <span>Flagged</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Current Question */}
//       {currentQuestion && (
//         <QuestionRenderer
//           question={currentQuestion}
//           questionIndex={currentQuestionIndex}
//           answer={answers[currentQuestion.exerciseId]?.[currentQuestionIndex]}
//           onAnswerChange={handleAnswerChange}
//           isReviewMode={isReviewMode}
//         />
//       )}

//       {/* Submit Section */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 {Object.values(answers).reduce((sum, ex) => sum + Object.keys(ex).length, 0)} of {allQuestions.length}{" "}
//                 questions answered
//               </p>
//               {flaggedQuestions.size > 0 && (
//                 <p className="text-sm text-yellow-600 mt-1">
//                   {flaggedQuestions.size} question{flaggedQuestions.size > 1 ? "s" : ""} flagged
//                   {flaggedQuestions.size > 1 ? "" : ""} for review
//                 </p>
//               )}
//             </div>
//             <Button
//               onClick={() => setShowSubmitDialog(true)}
//               disabled={isSubmitting || Object.keys(answers).length === 0}
//               size="lg"
//             >
//               <Send className="h-4 w-4 mr-2" />
//               Submit Exam
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Submit Confirmation Dialog */}
//       <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to submit your exam? You've answered{" "}
//               {Object.values(answers).reduce((sum, ex) => sum + Object.keys(ex).length, 0)} of {allQuestions.length}{" "}
//               questions.
//               {flaggedQuestions.size > 0 && (
//                 <span className="block mt-2 text-yellow-600">
//                   Note: {flaggedQuestions.size} question{flaggedQuestions.size > 1 ? "s" : ""} flagged
//                   {flaggedQuestions.size > 1 ? "" : ""} for review.
//                 </span>
//               )}
//               <span className="block mt-2 font-medium">This action cannot be undone.</span>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Continue Exam</AlertDialogCancel>
//             <AlertDialogAction onClick={handleSubmitExam} disabled={isSubmitting}>
//               {isSubmitting ? "Submitting..." : "Submit Now"}
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
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const renderQuestion = (
  question,
  userAnswers,
  handleAnswerChange,
  isReviewMode = false
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

  switch (question.type) {
    case "multiple-choice":
      return applyDisabledProps(
        <RadioGroup
          value={userAnswers[question._id] || ""}
          onValueChange={(value) => handleAnswerChange(question._id, value)}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <RadioGroupItem value={option} id={`${question._id}-${index}`} />
              <Label
                htmlFor={`${question._id}-${index}`}
                className="flex-grow cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "short-answer":
    case "fill-in-the-blank":
      return applyDisabledProps(
        <Textarea
          value={userAnswers[question._id] || ""}
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          placeholder="Enter your answer here"
          className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      );

    case "matching":
      return applyDisabledProps(
        <div className="space-y-4">
          {question.matching.pairs.map((pair, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Label className="w-1/3 text-right font-medium">
                {pair.term}
              </Label>
              <Select
                value={userAnswers[question._id]?.[index]?.definition || ""}
                onValueChange={(value) =>
                  handleAnswerChange(question._id, [
                    ...(userAnswers[question._id] || []),
                    { term: pair.term, definition: value },
                  ])
                }
              >
                <SelectTrigger className="w-2/3">
                  <SelectValue placeholder="Select match" />
                </SelectTrigger>
                <SelectContent>
                  {question.matching.pairs.map((p) => (
                    <SelectItem key={p.definition} value={p.definition}>
                      {p.definition}
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
      const { columns, rows, cells, cellCorrections } =
        question.tableCompletion;

      if (!userAnswers[question._id]) {
        const emptyAnswers = rows.map(() => Array(columns.length).fill(""));
        handleAnswerChange(question._id, emptyAnswers);
      }

      return applyDisabledProps(
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">
                  Element
                </th>
                {columns.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 p-2 text-left"
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
                  <td className="border border-gray-300 p-2 font-medium">
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
                      <td key={colIndex} className="border border-gray-300 p-2">
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
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Not specified";
    }
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      "multiple-choice": "Multiple Choice",
      "short-answer": "Short Answer",
      "fill-in-the-blank": "Fill in the Blank",
      matching: "Matching",
      "drag-and-drop": "Drag and Drop",
      "table-completion": "Table Completion",
    };
    return types[type] || type;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              Question {questionIndex + 1}
            </CardTitle>
            <CardDescription className="mt-2">
              {question.questionText}
            </CardDescription>
          </div>
          <div className="flex gap-2 ml-4">
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
          isReviewMode
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

  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [startTime] = useState(new Date().toISOString());

  useEffect(() => {
    if (examId) {
      dispatch(getExamById(examId));
    }
  }, [dispatch, examId]);

  useEffect(() => {
    if (currentExam?.exercises?.[0]?.exercise?.timeLimit) {
      const totalTime = currentExam.exercises.reduce(
        (sum, ex) => sum + (ex.exercise?.timeLimit || 0),
        0
      );
      setTimeRemaining(totalTime);
    }
  }, [currentExam]);

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

  const handleAutoSubmit = useCallback(async () => {
    toast.warning("Time's up! Auto-submitting exam.");
    await handleSubmitExam();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const formatAnswersForSubmission = () => {
    const formattedAnswers = {};
    
    currentExam.exercises.forEach((exerciseData) => {
      const exerciseId = exerciseData.exercise._id;
      formattedAnswers[exerciseId] = exerciseData.exercise.questions.map((question) => {
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
      });
    });
    
    return formattedAnswers;
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        userAnswers: formatAnswersForSubmission(),
        userId: user.id,
        startTime,
      };

      await dispatch(submitExam({ examId, ...submissionData })).unwrap();
      toast.success("Exam submitted successfully!");
       navigate(`/exam/${examId}`);
    } catch (err) {
      toast.error(`Error submitting exam: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

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

  const getProgress = () => {
    if (!currentExam?.exercises) return 0;
    const totalQuestions = currentExam.exercises.reduce(
      (sum, ex) => sum + (ex.exercise?.questions?.length || 0),
      0
    );
    const answeredQuestions = Object.keys(userAnswers).length;
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  };

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

  const getAllQuestions = () => {
    if (!currentExam?.exercises) return [];
    const questions = [];
    currentExam.exercises.forEach((exerciseData) => {
      if (exerciseData.exercise?.questions) {
        exerciseData.exercise.questions.forEach((question) => {
          questions.push({
            ...question,
            exerciseId: exerciseData.exercise._id,
          });
        });
      }
    });
    return questions;
  };

  const allQuestions = getAllQuestions();
  const currentQuestion = allQuestions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error || !currentExam) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load exam. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6" />
                {currentExam.title}
              </CardTitle>
              <CardDescription className="mt-2">
                {allQuestions.length} questions •{" "}
                {currentExam.exercises?.length || 0} exercises
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-4 w-4" />
                <span
                  className={`font-mono text-lg ${
                    timeRemaining < 300 ? "text-red-600" : ""
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Progress value={getProgress()} className="w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                }
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {allQuestions.length}
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
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
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
                <Flag className="h-4 w-4 mr-1" />
                {flaggedQuestions.has(currentQuestionIndex)
                  ? "Flagged"
                  : "Flag"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReviewMode(!isReviewMode)}
              >
                {isReviewMode ? (
                  <EyeOff className="h-4 w-4 mr-1" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                {isReviewMode ? "Edit" : "Review"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Grid Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-10 gap-2">
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
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-gray-300 rounded"></div>
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-1">
              <Flag className="h-3 w-3 text-yellow-600" />
              <span>Flagged</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentQuestion && (
        <QuestionRenderer
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          onAnswerChange={handleAnswerChange}
          isReviewMode={isReviewMode}
        />
      )}

      {/* Submit Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {Object.keys(userAnswers).length} of {allQuestions.length} questions answered
              </p>
              {flaggedQuestions.size > 0 && (
                <p className="text-sm text-yellow-600 mt-1">
                  {flaggedQuestions.size} question
                  {flaggedQuestions.size > 1 ? "s" : ""} flagged
                  {flaggedQuestions.size > 1 ? "" : ""} for review
                </p>
              )}
            </div>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              disabled={isSubmitting || Object.keys(userAnswers).length === 0}
              size="lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Exam
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your exam? You've answered{" "}
              {Object.keys(userAnswers).length} of {allQuestions.length} questions.
              {flaggedQuestions.size > 0 && (
                <span className="block mt-2 text-yellow-600">
                  Note: {flaggedQuestions.size} question
                  {flaggedQuestions.size > 1 ? "s" : ""} flagged
                  {flaggedQuestions.size > 1 ? "" : ""} for review.
                </span>
              )}
              <span className="block mt-2 font-medium">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitExam}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Now"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubmitExam;