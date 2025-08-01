// import { useState, useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { createExercise } from "@/store/exerciseSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2, Plus, Trash2 } from "lucide-react";
// import { useParams } from "react-router-dom";

// const ExerciseGenerator = () => {
//   const dispatch = useDispatch();
//   const { lessonId } = useParams();
//   const [exercise, setExercise] = useState({
//     title: "",
//     description: "",
//     questions: [],
//     difficulty: 1,
//     totalPoints: 0,
//     maxAttempts: 1,
//     timeLimit: 600,
//     lesson: lessonId,
//   });
//   console.log("lesson", lessonId);

//   const [currentStep, setCurrentStep] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleExerciseChange = (e) => {
//     const { name, value } = e.target;
//     setExercise((prev) => ({ ...prev, [name]: value }));
//   };

//   const addQuestion = (type) => {
//     const newQuestion = {
//       id: Date.now().toString(),
//       type,
//       questionText: "",
//       options: type === "multiple-choice" ? [""] : undefined,
//       answer:
//         type === "short-answer" || type === "fill-in-the-blank"
//           ? ""
//           : undefined,
//       pairs: type === "matching" ? [{ term: "", definition: "" }] : undefined,
//       table:
//         type === "table-completion"
//           ? { headers: ["", ""], rows: [["", ""]] }
//           : undefined,
//       items: type === "drag-and-drop" ? [""] : undefined,
//     };
//     setExercise((prev) => ({
//       ...prev,
//       questions: [...prev.questions, newQuestion],
//     }));
//   };

//   const updateQuestion = (id, updates) => {
//     setExercise((prev) => ({
//       ...prev,
//       questions: prev.questions.map((q) =>
//         q.id === id ? { ...q, ...updates } : q
//       ),
//     }));
//   };

//   const removeQuestion = (id) => {
//     setExercise((prev) => ({
//       ...prev,
//       questions: prev.questions.filter((q) => q.id !== id),
//     }));
//   };

//   const onDragEnd = useCallback(
//     (result) => {
//       if (!result.destination) return;

//       const newQuestions = Array.from(exercise.questions);
//       const [reorderedItem] = newQuestions.splice(result.source.index, 1);
//       newQuestions.splice(result.destination.index, 0, reorderedItem);

//       setExercise((prev) => ({ ...prev, questions: newQuestions }));
//     },
//     [exercise.questions]
//   );
//   const getDirection = (text) => {
//     const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
//     return rtlChars.test(text) ? "rtl" : "ltr";
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await dispatch(
//         createExercise({ ...exercise, lessonId })
//       );
//       console.log(response);
//       setIsLoading(false);
//       alert("Exercise saved successfully!");
//     } catch (error) {
//       console.error(error);
//       setIsLoading(false);
//     }
//   };

//   const steps = [
//     { title: "Basic Info", description: "Set exercise details" },
//     { title: "Questions", description: "Add and edit questions" },
//     { title: "Review", description: "Preview and submit" },
//   ];

//   const renderCorrectAnswerInput = (question) => {
//     switch (question.type) {
//       case "multiple-choice":
//         return (
//           <div className="space-y-2">
//             {question.options?.map((option, index) => (
//               <div key={index} className="flex items-center space-x-2">
//                 <Input
//                 dir={getDirection(exercise.title)}
//                   value={option}
//                   onChange={(e) => {
//                     const newOptions = [...(question.options || [])];
//                     newOptions[index] = e.target.value;
//                     updateQuestion(question.id, { options: newOptions });
//                   }}
//                   placeholder={`Option ${index + 1}`}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     const newOptions = question.options?.filter(
//                       (_, i) => i !== index
//                     );
//                     updateQuestion(question.id, { options: newOptions });
//                   }}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//                 <Input
//                 dir={getDirection(exercise.title)}
//                   type="checkbox"
//                   checked={question.correctAnswers?.includes(index.toString())}
//                   onChange={(e) => {
//                     const newCorrectAnswers = [
//                       ...(question.correctAnswers || []),
//                     ];
//                     if (e.target.checked) {
//                       newCorrectAnswers.push(index.toString());
//                     } else {
//                       newCorrectAnswers.splice(
//                         newCorrectAnswers.indexOf(index.toString()),
//                         1
//                       );
//                     }
//                     updateQuestion(question.id, {
//                       correctAnswers: newCorrectAnswers,
//                     });
//                   }}
//                 />
//               </div>
//             ))}
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 const newOptions = [...(question.options || []), ""];
//                 updateQuestion(question.id, { options: newOptions });
//               }}
//             >
//               <Plus className="h-4 w-4 mr-2" /> Add Option
//             </Button>
//           </div>
//         );
//       case "short-answer":
//         return (
//           <Input
//           dir={getDirection(exercise.title)}
//             value={question.correctAnswers?.[0]}
//             onChange={(e) =>
//               updateQuestion(question.id, { correctAnswers: [e.target.value] })
//             }
//             placeholder="Enter correct answer"
//           />
//         );
//       case "fill-in-the-blank":
//         return (
//           <div className="space-y-2">
//             {(question.correctAnswers || []).map((answer, index) => (
//               <Input
//               dir={getDirection(exercise.title)}
//                 key={index}
//                 value={answer}
//                 onChange={(e) => {
//                   const newAnswers = [...(question.correctAnswers || [])];
//                   newAnswers[index] = e.target.value;
//                   updateQuestion(question.id, { correctAnswers: newAnswers });
//                 }}
//                 placeholder={`Blank ${index + 1} correct answer`}
//               />
//             ))}
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 const newAnswers = [...(question.correctAnswers || []), ""];
//                 updateQuestion(question.id, { correctAnswers: newAnswers });
//               }}
//             >
//               Add Blank
//             </Button>
//           </div>
//         );
//       case "matching":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <p>Left Items:</p>
//               {question.matching?.leftItems?.map((item, index) => (
//                 <Input
//                 dir={getDirection(exercise.title)}
//                   key={index}
//                   value={item}
//                   onChange={(e) => {
//                     const newLeftItems = [
//                       ...(question.matching.leftItems || []),
//                     ];
//                     newLeftItems[index] = e.target.value;
//                     updateQuestion(question.id, {
//                       matching: {
//                         ...question.matching,
//                         leftItems: newLeftItems,
//                       },
//                     });
//                   }}
//                   placeholder="Left Item"
//                 />
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   const newLeftItems = [
//                     ...(question.matching?.leftItems || []),
//                     "",
//                   ];
//                   updateQuestion(question.id, {
//                     matching: { ...question.matching, leftItems: newLeftItems },
//                   });
//                 }}
//               >
//                 <Plus className="h-4 w-4 mr-2" /> Add Left Item
//               </Button>
//             </div>
//             <div className="flex items-center space-x-2">
//               <p>Right Items:</p>
//               {question.matching?.rightItems?.map((item, index) => (
//                 <Input
//                 dir={getDirection(exercise.title)}
//                   key={index}
//                   value={item}
//                   onChange={(e) => {
//                     const newRightItems = [
//                       ...(question.matching?.rightItems || []),
//                     ];
//                     newRightItems[index] = e.target.value;
//                     updateQuestion(question.id, {
//                       matching: {
//                         ...question.matching,
//                         rightItems: newRightItems,
//                       },
//                     });
//                   }}
//                   placeholder="Right Item"
//                 />
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   const newRightItems = [
//                     ...(question.matching.rightItems || []),
//                     "",
//                   ];
//                   updateQuestion(question.id, {
//                     matching: {
//                       ...question.matching,
//                       rightItems: newRightItems,
//                     },
//                   });
//                 }}
//               >
//                 <Plus className="h-4 w-4 mr-2" /> Add Right Item
//               </Button>
//             </div>
//             <div className="flex items-center space-x-2">
//               <p>Correct Pairs:</p>
//               {question.matching?.pairs?.map((pair, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <Input
//                   dir={getDirection(exercise.title)}
//                     value={pair.term}
//                     onChange={(e) => {
//                       const newPairs = [...(question.matching?.pairs || [])];
//                       newPairs[index].term = e.target.value;
//                       updateQuestion(question.id, {
//                         matching: { ...question.matching, pairs: newPairs },
//                       });
//                     }}
//                     placeholder="Term"
//                   />
//                   <Input
//                   dir={getDirection(exercise.title)}
//                     value={pair.definition}
//                     onChange={(e) => {
//                       const newPairs = [...(question.matching.pairs || [])];
//                       newPairs[index].definition = e.target.value;
//                       updateQuestion(question.id, {
//                         matching: { ...question.matching, pairs: newPairs },
//                       });
//                     }}
//                     placeholder="Definition"
//                   />
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   const newPairs = [
//                     ...(question.matching.pairs || []),
//                     { term: "", definition: "" },
//                   ];
//                   updateQuestion(question.id, {
//                     matching: { ...question.matching, pairs: newPairs },
//                   });
//                 }}
//               >
//                 <Plus className="h-4 w-4 mr-2" /> Add Pair
//               </Button>
//             </div>
//           </div>
//         );
//       case "drag-and-drop":
//         return (
//           <div className="space-y-2">
//             {question.dragAndDrop?.items?.map((item, index) => (
//               <div key={index} className="flex items-center space-x-2">
//                 <Input
//                 dir={getDirection(exercise.title)}
//                   value={item}
//                   onChange={(e) => {
//                     const newItems = [...(question.dragAndDrop?.items || [])];
//                     newItems[index] = e.target.value;
//                     updateQuestion(question.id, {
//                       dragAndDrop: { ...question.dragAndDrop, items: newItems },
//                     });
//                   }}
//                   placeholder="Item"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     const newItems = question.dragAndDrop.items.filter(
//                       (_, i) => i !== index
//                     );
//                     updateQuestion(question.id, {
//                       dragAndDrop: { ...question.dragAndDrop, items: newItems },
//                     });
//                   }}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 const newItems = [...(question.dragAndDrop?.items || []), ""];
//                 updateQuestion(question.id, {
//                   dragAndDrop: { ...question.dragAndDrop, items: newItems },
//                 });
//               }}
//             >
//               <Plus className="h-4 w-4 mr-2" /> Add Item
//             </Button>
//             <div className="mt-4">
//               <p>Correct Order:</p>
//               {question.dragAndDrop?.correctOrder?.map((order, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <span>{index + 1}.</span>
//                   <Input
//                   dir={getDirection(exercise.title)}
//                     value={order}
//                     onChange={(e) => {
//                       const newCorrectOrder = [
//                         ...(question.dragAndDrop.correctOrder || []),
//                       ];
//                       newCorrectOrder[index] = e.target.value;
//                       updateQuestion(question.id, {
//                         dragAndDrop: {
//                           ...question.dragAndDrop,
//                           correctOrder: newCorrectOrder,
//                         },
//                       });
//                     }}
//                     placeholder="Enter correct order"
//                   />
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   const newCorrectOrder = [
//                     ...(question.dragAndDrop.correctOrder || []),
//                     "",
//                   ];
//                   updateQuestion(question.id, {
//                     dragAndDrop: {
//                       ...question.dragAndDrop,
//                       correctOrder: newCorrectOrder,
//                     },
//                   });
//                 }}
//               >
//                 <Plus className="h-4 w-4 mr-2" /> Add Correct Order
//               </Button>
//             </div>
//           </div>
//         );
//       case "table-completion":
//         return (
//           <div className="space-y-2">
//             <div className="flex space-x-2">
//               <Input
//               dir={getDirection(exercise.title)}
//                 type="number"
//                 value={question.tableCompletion?.rows?.length || 0}
//                 onChange={(e) => {
//                   const numRows = parseInt(e.target.value, 10);
//                   const newRows = numRows > 0 ? Array(numRows).fill("") : [];
//                   const newCells = Array.from(
//                     { length: numRows },
//                     (_, rowIndex) =>
//                       Array(question.tableCompletion?.columns?.length || 0)
//                         .fill("")
//                         .map((_, colIndex) => ({
//                           rowIndex: rowIndex,
//                           columnIndex: colIndex,
//                           text: "",
//                         }))
//                   ).flat();
//                   const newCorrections = [];
//                   updateQuestion(question.id, {
//                     tableCompletion: {
//                       ...question.tableCompletion,
//                       rows: newRows,
//                       cells: newCells,
//                       cellCorrections: newCorrections,
//                     },
//                   });
//                 }}
//                 placeholder="Number of Rows"
//               />
//               <Input
//               dir={getDirection(exercise.title)}
//                 type="number"
//                 value={question.tableCompletion?.columns?.length || 0}
//                 onChange={(e) => {
//                   const numCols = parseInt(e.target.value, 10);
//                   const newColumns = numCols > 0 ? Array(numCols).fill("") : [];
//                   const newCells = question.tableCompletion?.rows
//                     ?.map((_, rowIndex) =>
//                       Array(numCols)
//                         .fill("")
//                         .map((_, colIndex) => ({
//                           rowIndex: rowIndex,
//                           columnIndex: colIndex,
//                           text: "",
//                         }))
//                     )
//                     .flat();
//                   const newCorrections = [];
//                   updateQuestion(question.id, {
//                     tableCompletion: {
//                       ...question.tableCompletion,
//                       columns: newColumns,
//                       cells: newCells,
//                       cellCorrections: newCorrections,
//                     },
//                   });
//                 }}
//                 placeholder="Number of Columns"
//               />
//             </div>

//             {question.tableCompletion?.rows?.length > 0 &&
//               question.tableCompletion?.columns?.length > 0 && (
//                 <div className="space-y-4">
//                   <div className="flex space-x-2">
//                     <div className="font-bold">Row Labels</div>
//                     {question.tableCompletion.columns.map(
//                       (columnHeader, colIndex) => (
//                         <Input
//                         dir={getDirection(exercise.title)}
//                           key={`col-header-${colIndex}`}
//                           value={columnHeader}
//                           onChange={(e) => {
//                             const newColumns = [
//                               ...question.tableCompletion.columns,
//                             ];
//                             newColumns[colIndex] = e.target.value;
//                             updateQuestion(question.id, {
//                               tableCompletion: {
//                                 ...question.tableCompletion,
//                                 columns: newColumns,
//                               },
//                             });
//                           }}
//                           placeholder={`Column ${colIndex + 1}`}
//                         />
//                       )
//                     )}
//                   </div>

//                   {question.tableCompletion.rows.map((rowHeader, rowIndex) => (
//                     <div key={`row-${rowIndex}`} className="flex space-x-2">
//                       <Input
//                       dir={getDirection(exercise.title)}
//                         value={rowHeader}
//                         onChange={(e) => {
//                           const newRows = [...question.tableCompletion.rows];
//                           newRows[rowIndex] = e.target.value;
//                           updateQuestion(question.id, {
//                             tableCompletion: {
//                               ...question.tableCompletion,
//                               rows: newRows,
//                             },
//                           });
//                         }}
//                         placeholder={`Row ${rowIndex + 1}`}
//                       />
//                       {question.tableCompletion.cells
//                         .filter((cell) => cell.rowIndex === rowIndex)
//                         .map((cell, colIndex) => (
//                           <div
//                             key={`cell-${rowIndex}-${colIndex}`}
//                             className="flex space-x-1"
//                           >
//                             <Input
//                             dir={getDirection(exercise.title)}
//                               value={cell.text}
//                               onChange={(e) => {
//                                 const newCells =
//                                   question.tableCompletion.cells.map((c) => {
//                                     if (
//                                       c.rowIndex === rowIndex &&
//                                       c.columnIndex === colIndex
//                                     ) {
//                                       return { ...c, text: e.target.value };
//                                     }
//                                     return c;
//                                   });
//                                 updateQuestion(question.id, {
//                                   tableCompletion: {
//                                     ...question.tableCompletion,
//                                     cells: newCells,
//                                   },
//                                 });
//                               }}
//                               placeholder={`Score R${rowIndex + 1}C${
//                                 colIndex + 1
//                               }`}
//                             />
//                             <Input
//                             dir={getDirection(exercise.title)}
//                               value={
//                                 question.tableCompletion.cellCorrections.find(
//                                   (correction) =>
//                                     correction.rowIndex === rowIndex &&
//                                     correction.columnIndex === colIndex
//                                 )?.correctionText || ""
//                               }
//                               onChange={(e) => {
//                                 const newCorrections = [
//                                   ...question.tableCompletion.cellCorrections,
//                                 ];
//                                 const correctionIndex =
//                                   newCorrections.findIndex(
//                                     (correction) =>
//                                       correction.rowIndex === rowIndex &&
//                                       correction.columnIndex === colIndex
//                                   );
//                                 if (correctionIndex >= 0) {
//                                   newCorrections[
//                                     correctionIndex
//                                   ].correctionText = e.target.value;
//                                 } else {
//                                   newCorrections.push({
//                                     rowIndex,
//                                     columnIndex: colIndex,
//                                     correctionText: e.target.value,
//                                   });
//                                 }
//                                 updateQuestion(question.id, {
//                                   tableCompletion: {
//                                     ...question.tableCompletion,
//                                     cellCorrections: newCorrections,
//                                   },
//                                 });
//                               }}
//                               placeholder={`Correction R${rowIndex + 1}C${
//                                 colIndex + 1
//                               }`}
//                             />
//                           </div>
//                         ))}
//                     </div>
//                   ))}
//                 </div>
//               )}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 max-w-4xl">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">
//             Exercise Generator
//           </CardTitle>
//           <CardDescription>
//             Create a new exercise in just a few steps
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {steps.map((step, index) => (
//                 <div key={index} className="flex flex-col items-center">
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       index <= currentStep
//                         ? "bg-primary text-primary-foreground"
//                         : "bg-gray-200 text-gray-500"
//                     }`}
//                   >
//                     {index + 1}
//                   </div>
//                   <div className="text-sm mt-1">{step.title}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="w-full bg-gray-200 h-2 rounded-full">
//               <div
//                 className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
//                 style={{
//                   width: `${((currentStep + 1) / steps.length) * 100}%`,
//                 }}
//               ></div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <AnimatePresence mode="wait">
//               {currentStep === 0 && (
//                 <motion.div
//                   key="step1"
//                   initial={{ opacity: 0, x: 50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -50 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="title">Title</Label>
//                       <Input
//                       dir={getDirection(exercise.title)}
//                         id="title"
//                         name="title"
//                         value={exercise.title}
//                         onChange={handleExerciseChange}
//                         placeholder="Enter exercise title"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="description">Description</Label>
//                       <Textarea
//                       dir={getDirection(exercise.title)}
//                         id="description"
//                         name="description"
//                         value={exercise.description}
//                         onChange={handleExerciseChange}
//                         placeholder="Describe the exercise"
//                         required
//                       />
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <Label htmlFor="totalPoints">Total Points</Label>
//                         <Input
//                           id="totalPoints"
//                           name="totalPoints"
//                           type="number"
//                           value={exercise.totalPoints}
//                           onChange={handleExerciseChange}
//                           placeholder="Total points"
//                           min={1}
//                           max={5}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="maxAttempts">Max Attempts</Label>
//                         <Input
//                           id="maxAttempts"
//                           name="maxAttempts"
//                           type="number"
//                           value={exercise.maxAttempts}
//                           onChange={handleExerciseChange}
//                           placeholder="Maximum attempts"
//                           min={1}
//                           max={10}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
//                         <Input
//                         dir={getDirection(exercise.title)}
//                           id="timeLimit"
//                           name="timeLimit"
//                           type="number"
//                           value={exercise.timeLimit}
//                           onChange={handleExerciseChange}
//                           placeholder="Time limit in seconds"
//                           min={30}
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {currentStep === 1 && (
//                 <motion.div
//                   key="step2"
//                   initial={{ opacity: 0, x: 50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -50 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold">Questions</h3>
//                       <Select onValueChange={(value) => addQuestion(value)}>
//                         <SelectTrigger className="w-[200px]">
//                           <SelectValue placeholder="Add question" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="multiple-choice">
//                             Multiple Choice
//                           </SelectItem>
//                           <SelectItem value="short-answer">
//                             Short Answer
//                           </SelectItem>
//                           <SelectItem value="fill-in-the-blank">
//                             Fill in the Blank
//                           </SelectItem>
//                           <SelectItem value="matching">Matching</SelectItem>
//                           <SelectItem value="table-completion">
//                             Table Completion
//                           </SelectItem>
//                           <SelectItem value="drag-and-drop">
//                             Drag and Drop
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <DragDropContext onDragEnd={onDragEnd}>
//                       <Droppable droppableId="questions">
//                         {(provided) => (
//                           <div
//                             {...provided.droppableProps}
//                             ref={provided.innerRef}
//                           >
//                             {exercise.questions.map((question, index) => (
//                               <Draggable
//                                 key={question.id}
//                                 draggableId={question.id}
//                                 index={index}
//                               >
//                                 {(provided) => (
//                                   <div
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                     {...provided.dragHandleProps}
//                                     className="mb-4"
//                                   >
//                                     <Card>
//                                       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                                         <CardTitle className="text-sm font-medium">
//                                           Question {index + 1}: {question.type}
//                                         </CardTitle>
//                                         <Button
//                                           type="button"
//                                           variant="ghost"
//                                           size="sm"
//                                           onClick={() =>
//                                             removeQuestion(question.id)
//                                           }
//                                         >
//                                           <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <Textarea
//                                           value={question.questionText}
//                                           onChange={(e) =>
//                                             updateQuestion(question.id, {
//                                               questionText: e.target.value,
//                                             })
//                                           }
//                                           placeholder="Enter question content"
//                                           className="mb-2"
//                                         />
//                                         <div>
//                                           <Label>Difficulty</Label>
//                                           <Select
//                                             value={question.difficulty}
//                                             onValueChange={(value) =>
//                                               updateQuestion(question.id, {
//                                                 difficulty: value,
//                                               })
//                                             }
//                                           >
//                                             <SelectTrigger>
//                                               <SelectValue placeholder="Select difficulty" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                               <SelectItem value="1">
//                                                 Easy
//                                               </SelectItem>
//                                               <SelectItem value="2">
//                                                 Medium
//                                               </SelectItem>
//                                               <SelectItem value="3">
//                                                 Hard
//                                               </SelectItem>
//                                             </SelectContent>
//                                           </Select>
//                                         </div>
//                                         {question.type === "multiple-choice"}
//                                         {question.type === "short-answer"}
//                                         {question.type === "fill-in-the-blank"}
//                                         {question.type === "matching"}
//                                         {question.type === "table-completion"}
//                                         {question.type === "drag-and-drop"}
//                                         <div>
//                                           <Label>Correct Answer:</Label>
//                                           {renderCorrectAnswerInput(question)}
//                                         </div>
//                                       </CardContent>
//                                     </Card>
//                                   </div>
//                                 )}
//                               </Draggable>
//                             ))}
//                             {provided.placeholder}
//                           </div>
//                         )}
//                       </Droppable>
//                     </DragDropContext>
//                   </div>
//                 </motion.div>
//               )}

//               {currentStep === 2 && (
//                 <motion.div
//                   key="step3"
//                   initial={{ opacity: 0, x: 50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -50 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">Review</h3>
//                     <div className="space-y-2">
//                       <div>
//                         <Label>Exercise Title</Label>
//                         <p>{exercise.title}</p>
//                       </div>
//                       <div>
//                         <Label>Exercise Description</Label>
//                         <p>{exercise.description}</p>
//                       </div>
//                       <div>
//                         <Label>Total Points</Label>
//                         <p>{exercise.totalPoints}</p>
//                       </div>
//                       <div>
//                         <Label>Max Attempts</Label>
//                         <p>{exercise.maxAttempts}</p>
//                       </div>
//                       <div>
//                         <Label>Time Limit (seconds)</Label>
//                         <p>{exercise.timeLimit}</p>
//                       </div>
//                       <div>
//                         <Label>Lesson ID</Label>
//                         <p>{exercise.lesson}</p>
//                       </div>
//                       <div>
//                         <Label>Questions</Label>
//                         <ul>
//                           {exercise.questions.map((question, index) => (
//                             <li key={index}>{question.type}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//             <div className="flex justify-between mt-4">
//               {currentStep > 0 && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="lg"
//                   onClick={() => setCurrentStep(currentStep - 1)}
//                 >
//                   Back
//                 </Button>
//               )}
//               {currentStep < steps.length - 1 && (
//                 <Button
//                   type="button"
//                   variant="primary"
//                   size="lg"
//                   onClick={() => setCurrentStep(currentStep + 1)}
//                 >
//                   Next
//                 </Button>
//               )}
//               {currentStep === steps.length - 1 && (
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   type="submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <Loader2 className="h-4 w-4 mr-2" />
//                   ) : (
//                     <Plus className="h-4 w-4 mr-2" />
//                   )}
//                   Save Exercise
//                 </Button>
//               )}
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ExerciseGenerator;

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createExercise } from "@/store/exerciseSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Settings,
  HelpCircle,
  Eye,
  Clock,
  Target,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Save,
  GripVertical,
  X,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Set exercise details",
    icon: Settings,
  },
  {
    id: 2,
    title: "Questions",
    description: "Add and edit questions",
    icon: HelpCircle,
  },
  {
    id: 3,
    title: "Review & Create",
    description: "Preview and submit",
    icon: Eye,
  },
];

const ExerciseGenerator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lessonId } = useParams();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [exercise, setExercise] = useState({
    title: "",
    description: "",
    questions: [],
    difficulty: 1,
    totalPoints: 0,
    maxAttempts: 1,
    timeLimit: 600,
    lesson: lessonId,
  });

  const validateStep = useCallback(
    (step) => {
      const errors = {};
      if (step === 1) {
        if (!exercise.title.trim()) {
          errors.title = "Title is required";
        }
        if (!exercise.description.trim()) {
          errors.description = "Description is required";
        }
        if (exercise.totalPoints <= 0 || exercise.totalPoints > 5) {
          errors.totalPoints = "Total points must be between 1 and 5";
        }
        if (exercise.maxAttempts <= 0 || exercise.maxAttempts > 10) {
          errors.maxAttempts = "Max attempts must be between 1 and 10";
        }
        if (exercise.timeLimit <= 0) {
          errors.timeLimit = "Time limit must be greater than 0";
        }
      }
      if (step === 2) {
        if (exercise.questions.length === 0) {
          errors.questions = "At least one question is required";
        } else {
          exercise.questions.forEach((question, index) => {
            if (!question.questionText?.trim()) {
              errors[`question_${index}`] = "Question text is required";
            }
          });
        }
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [exercise]
  );

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  }, [currentStep, validateStep]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleStepClick = useCallback(
    (stepId) => {
      if (stepId <= currentStep || completedSteps.has(stepId - 1)) {
        setCurrentStep(stepId);
      }
    },
    [currentStep, completedSteps]
  );

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setExercise((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: `new_${Date.now().toString()}`,
      type,
      questionText: "",
      difficulty: 1,
      options: type === "multiple-choice" ? [""] : undefined,
      correctAnswers:
        type === "multiple-choice"
          ? []
          : type === "short-answer" || type === "fill-in-the-blank"
          ? [""]
          : undefined,
      matching:
        type === "matching"
          ? {
              leftItems: [""],
              rightItems: [""],
              pairs: [{ term: "", definition: "" }],
            }
          : undefined,
      tableCompletion:
        type === "table-completion"
          ? { rows: [""], columns: [""], cells: [], cellCorrections: [] }
          : undefined,
      dragAndDrop:
        type === "drag-and-drop"
          ? { items: [""], correctOrder: [""] }
          : undefined,
    };
    setExercise((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (id, updates) => {
    setExercise((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    }));
  };

  const removeQuestion = (id) => {
    setExercise((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const newQuestions = Array.from(exercise.questions);
      const [reorderedItem] = newQuestions.splice(result.source.index, 1);
      newQuestions.splice(result.destination.index, 0, reorderedItem);
      setExercise((prev) => ({ ...prev, questions: newQuestions }));
    },
    [exercise.questions]
  );

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(createExercise({ ...exercise, lessonId }));
      setFormErrors({ success: "Exercise created successfully!" });
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Create error:", error);
      setFormErrors({
        submit: error.message || "Failed to create exercise. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const renderCorrectAnswerInput = (question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            {/* Options List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Answer Options *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [...(question.options || []), ""];
                    updateQuestion(question.id, { options: newOptions });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="min-w-[2rem] justify-center"
                    >
                      {String.fromCharCode(65 + index)}
                    </Badge>
                    <Input
                      dir={getDirection(exercise.title)}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(question.options || [])];
                        newOptions[index] = e.target.value;
                        updateQuestion(question.id, { options: newOptions });

                        // Clear correct answer if edited option was the correct one
                        if (question.correctAnswer === option) {
                          updateQuestion(question.id, { correctAnswer: "" });
                        }
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {question.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = question.options?.filter(
                            (_, i) => i !== index
                          );
                          updateQuestion(question.id, { options: newOptions });

                          // Clear correct answer if deleted option was the correct one
                          if (question.correctAnswer === option) {
                            updateQuestion(question.id, { correctAnswer: "" });
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer Selection */}
            <div className="space-y-2">
              <Label>Correct Answer *</Label>
              <Select
                value={question.correctAnswer}
                onValueChange={(value) =>
                  updateQuestion(question.id, { correctAnswer: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {question.options
                    ?.filter((opt) => opt.trim() !== "") // Only show non-empty options
                    .map((option, index) => (
                      <SelectItem key={index} value={option}>
                        <span className="mr-2 font-mono">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "short-answer":
        return (
          <Input
            dir={getDirection(exercise.title)}
            value={question.correctAnswers?.[0] || ""}
            onChange={(e) =>
              updateQuestion(question.id, { correctAnswers: [e.target.value] })
            }
            placeholder="Enter correct answer"
          />
        );
      case "fill-in-the-blank":
        return (
          <div className="space-y-2">
            {(question.correctAnswers || []).map((answer, index) => (
              <Input
                dir={getDirection(exercise.title)}
                key={index}
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...(question.correctAnswers || [])];
                  newAnswers[index] = e.target.value;
                  updateQuestion(question.id, { correctAnswers: newAnswers });
                }}
                placeholder={`Blank ${index + 1} correct answer`}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newAnswers = [...(question.correctAnswers || []), ""];
                updateQuestion(question.id, { correctAnswers: newAnswers });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Blank
            </Button>
          </div>
        );
      case "matching":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <p>Left Items:</p>
              {question.matching?.leftItems?.map((item, index) => (
                <Input
                  dir={getDirection(exercise.title)}
                  key={index}
                  value={item}
                  onChange={(e) => {
                    const newLeftItems = [
                      ...(question.matching?.leftItems || []),
                    ];
                    newLeftItems[index] = e.target.value;
                    updateQuestion(question.id, {
                      matching: {
                        ...question.matching,
                        leftItems: newLeftItems,
                      },
                    });
                  }}
                  placeholder="Left Item"
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newLeftItems = [
                    ...(question.matching?.leftItems || []),
                    "",
                  ];
                  updateQuestion(question.id, {
                    matching: { ...question.matching, leftItems: newLeftItems },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Left Item
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <p>Right Items:</p>
              {question.matching?.rightItems?.map((item, index) => (
                <Input
                  dir={getDirection(exercise.title)}
                  key={index}
                  value={item}
                  onChange={(e) => {
                    const newRightItems = [
                      ...(question.matching?.rightItems || []),
                    ];
                    newRightItems[index] = e.target.value;
                    updateQuestion(question.id, {
                      matching: {
                        ...question.matching,
                        rightItems: newRightItems,
                      },
                    });
                  }}
                  placeholder="Right Item"
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newRightItems = [
                    ...(question.matching?.rightItems || []),
                    "",
                  ];
                  updateQuestion(question.id, {
                    matching: {
                      ...question.matching,
                      rightItems: newRightItems,
                    },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Right Item
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <p>Correct Pairs:</p>
              {question.matching?.pairs?.map((pair, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    dir={getDirection(exercise.title)}
                    value={pair.term}
                    onChange={(e) => {
                      const newPairs = [...(question.matching?.pairs || [])];
                      newPairs[index].term = e.target.value;
                      updateQuestion(question.id, {
                        matching: { ...question.matching, pairs: newPairs },
                      });
                    }}
                    placeholder="Term"
                  />
                  <Input
                    dir={getDirection(exercise.title)}
                    value={pair.definition}
                    onChange={(e) => {
                      const newPairs = [...(question.matching?.pairs || [])];
                      newPairs[index].definition = e.target.value;
                      updateQuestion(question.id, {
                        matching: { ...question.matching, pairs: newPairs },
                      });
                    }}
                    placeholder="Definition"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPairs = [
                    ...(question.matching?.pairs || []),
                    { term: "", definition: "" },
                  ];
                  updateQuestion(question.id, {
                    matching: { ...question.matching, pairs: newPairs },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Pair
              </Button>
            </div>
          </div>
        );
      case "drag-and-drop":
        return (
          <div className="space-y-2">
            {/* Drag Items Section */}
            {question.dragAndDrop?.items?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  dir={getDirection(exercise.title)}
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(question.dragAndDrop?.items || [])];
                    newItems[index] = e.target.value;
                    updateQuestion(question.id, {
                      dragAndDrop: {
                        ...question.dragAndDrop,
                        items: newItems,
                      },
                    });
                  }}
                  placeholder="Item"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newItems = question.dragAndDrop?.items?.filter(
                      (_, i) => i !== index
                    );
                    updateQuestion(question.id, {
                      dragAndDrop: {
                        ...question.dragAndDrop,
                        items: newItems,
                        correctOrder: newItems,
                      },
                    });
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newItems = [...(question.dragAndDrop?.items || []), ""];
                updateQuestion(question.id, {
                  dragAndDrop: {
                    ...question.dragAndDrop,
                    items: newItems,
                    correctOrder: newItems,
                  },
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>

            {/* Correct Order Section */}
            <div className="mt-4">
              <p>Correct Order:</p>
              {question.dragAndDrop?.correctOrder?.map((order, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>{index + 1}.</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={order}
                    onChange={(e) => {
                      const newCorrectOrder = [
                        ...question.dragAndDrop.correctOrder,
                      ];
                      newCorrectOrder[index] = e.target.value;
                      updateQuestion(question.id, {
                        dragAndDrop: {
                          ...question.dragAndDrop,
                          correctOrder: newCorrectOrder,
                        },
                      });
                    }}
                  >
                    <option value="">Select item</option>
                    {question.dragAndDrop?.items?.map((item, i) => {
                      const isSelectedElsewhere =
                        question.dragAndDrop.correctOrder.includes(item) &&
                        question.dragAndDrop.correctOrder[index] !== item;
                      return (
                        <option
                          key={i}
                          value={item}
                          disabled={isSelectedElsewhere}
                        >
                          {item || `Item ${i + 1}`}
                        </option>
                      );
                    })}
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newCorrectOrder =
                        question.dragAndDrop.correctOrder.filter(
                          (_, i) => i !== index
                        );
                      updateQuestion(question.id, {
                        dragAndDrop: {
                          ...question.dragAndDrop,
                          correctOrder: newCorrectOrder,
                        },
                      });
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentCorrectOrder =
                    question.dragAndDrop?.correctOrder || [];
                  updateQuestion(question.id, {
                    dragAndDrop: {
                      ...question.dragAndDrop,
                      correctOrder: [...currentCorrectOrder, ""],
                    },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Correct Order
              </Button>
            </div>
          </div>
        );

      case "table-completion":
        return (
          <div className="space-y-4">
            {/* Table Configuration */}
            <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label>Rows</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={question.tableCompletion?.rows?.length || 1}
                  onChange={(e) => {
                    const numRows = Math.max(
                      1,
                      Math.min(parseInt(e.target.value) || 1, 10)
                    );
                    const newRows = Array(numRows).fill("");
                    const currentCols =
                      question.tableCompletion?.columns?.length || 1;
                    const newCells = Array.from(
                      { length: numRows },
                      (_, rowIndex) =>
                        Array(currentCols)
                          .fill("")
                          .map((_, colIndex) => ({
                            rowIndex,
                            columnIndex: colIndex,
                            text: "",
                          }))
                    ).flat();

                    updateQuestion(question.id, {
                      tableCompletion: {
                        ...question.tableCompletion,
                        rows: newRows,
                        cells: newCells,
                        cellCorrections: [],
                      },
                    });
                  }}
                  className="mt-1 w-20"
                />
              </div>
              <div className="flex-1">
                <Label>Columns</Label>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  value={question.tableCompletion?.columns?.length || 1}
                  onChange={(e) => {
                    const numCols = Math.max(
                      1,
                      Math.min(parseInt(e.target.value) || 1, 6)
                    );
                    const newColumns = Array(numCols).fill("");
                    const currentRows =
                      question.tableCompletion?.rows?.length || 1;
                    const newCells = Array.from(
                      { length: currentRows },
                      (_, rowIndex) =>
                        Array(numCols)
                          .fill("")
                          .map((_, colIndex) => ({
                            rowIndex,
                            columnIndex: colIndex,
                            text: "",
                          }))
                    ).flat();

                    updateQuestion(question.id, {
                      tableCompletion: {
                        ...question.tableCompletion,
                        columns: newColumns,
                        cells: newCells,
                        cellCorrections: [],
                      },
                    });
                  }}
                  className="mt-1 w-20"
                />
              </div>
            </div>

            {/* Table Display */}
            {question.tableCompletion?.rows?.length > 0 &&
              question.tableCompletion?.columns?.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    {/* Header Row */}
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 w-32"></th>
                        {question.tableCompletion.columns.map(
                          (col, colIndex) => (
                            <th key={`col-${colIndex}`} className="border p-2">
                              <Input
                                value={col}
                                onChange={(e) => {
                                  const newColumns = [
                                    ...question.tableCompletion.columns,
                                  ];
                                  newColumns[colIndex] = e.target.value;
                                  updateQuestion(question.id, {
                                    tableCompletion: {
                                      ...question.tableCompletion,
                                      columns: newColumns,
                                    },
                                  });
                                }}
                                className="w-full border-none bg-transparent focus:ring-1 focus:ring-blue-500"
                                placeholder={`Col ${colIndex + 1}`}
                              />
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {question.tableCompletion.rows.map((row, rowIndex) => (
                        <tr
                          key={`row-${rowIndex}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="border p-2 bg-gray-50">
                            <Input
                              value={row}
                              onChange={(e) => {
                                const newRows = [
                                  ...question.tableCompletion.rows,
                                ];
                                newRows[rowIndex] = e.target.value;
                                updateQuestion(question.id, {
                                  tableCompletion: {
                                    ...question.tableCompletion,
                                    rows: newRows,
                                  },
                                });
                              }}
                              className="w-full border-none bg-transparent focus:ring-1 focus:ring-blue-500"
                              placeholder={`Row ${rowIndex + 1}`}
                            />
                          </td>

                          {question.tableCompletion.columns.map(
                            (_, colIndex) => {
                              const cell = question.tableCompletion.cells?.find(
                                (c) =>
                                  c.rowIndex === rowIndex &&
                                  c.columnIndex === colIndex
                              );
                              const correction =
                                question.tableCompletion.cellCorrections?.find(
                                  (c) =>
                                    c.rowIndex === rowIndex &&
                                    c.columnIndex === colIndex
                                );

                              return (
                                <td
                                  key={`cell-${rowIndex}-${colIndex}`}
                                  className="border p-2"
                                >
                                  <div className="space-y-1">
                                    <Input
                                      value={cell?.text || ""}
                                      onChange={(e) => {
                                        const newCells =
                                          question.tableCompletion.cells.map(
                                            (c) =>
                                              c.rowIndex === rowIndex &&
                                              c.columnIndex === colIndex
                                                ? { ...c, text: e.target.value }
                                                : c
                                          );
                                        updateQuestion(question.id, {
                                          tableCompletion: {
                                            ...question.tableCompletion,
                                            cells: newCells,
                                          },
                                        });
                                      }}
                                      className="w-full border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                      placeholder="Answer"
                                    />
                                    <Input
                                      value={correction?.correctionText || ""}
                                      onChange={(e) => {
                                        const existingCorrection =
                                          question.tableCompletion.cellCorrections?.find(
                                            (c) =>
                                              c.rowIndex === rowIndex &&
                                              c.columnIndex === colIndex
                                          );

                                        const newCorrections =
                                          existingCorrection
                                            ? question.tableCompletion.cellCorrections.map(
                                                (c) =>
                                                  c === existingCorrection
                                                    ? {
                                                        ...c,
                                                        correctionText:
                                                          e.target.value,
                                                      }
                                                    : c
                                              )
                                            : [
                                                ...question.tableCompletion
                                                  .cellCorrections,
                                                {
                                                  rowIndex,
                                                  columnIndex: colIndex,
                                                  correctionText:
                                                    e.target.value,
                                                },
                                              ];

                                        updateQuestion(question.id, {
                                          tableCompletion: {
                                            ...question.tableCompletion,
                                            cellCorrections: newCorrections,
                                          },
                                        });
                                      }}
                                      className="w-full text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                                      placeholder="Correction"
                                    />
                                  </div>
                                </td>
                              );
                            }
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Basic Exercise Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Exercise Title *</Label>
                  <Input
                    dir={getDirection(exercise.title)}
                    id="title"
                    name="title"
                    value={exercise.title}
                    onChange={handleExerciseChange}
                    className={formErrors.title ? "border-red-500" : ""}
                    placeholder="Enter exercise title"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm">{formErrors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="timeLimit"
                    className="flex items-center space-x-1"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Time Limit (seconds) *</span>
                  </Label>
                  <Input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    value={exercise.timeLimit}
                    onChange={handleExerciseChange}
                    className={formErrors.timeLimit ? "border-red-500" : ""}
                    min="30"
                    placeholder="600"
                  />
                  {formErrors.timeLimit && (
                    <p className="text-red-500 text-sm">
                      {formErrors.timeLimit}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="totalPoints"
                    className="flex items-center space-x-1"
                  >
                    <Target className="h-4 w-4" />
                    <span>Total Points *</span>
                  </Label>
                  <Input
                    id="totalPoints"
                    name="totalPoints"
                    type="number"
                    value={exercise.totalPoints}
                    onChange={handleExerciseChange}
                    className={formErrors.totalPoints ? "border-red-500" : ""}
                    min="1"
                    max="5"
                    placeholder="5"
                  />
                  {formErrors.totalPoints && (
                    <p className="text-red-500 text-sm">
                      {formErrors.totalPoints}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Max Attempts *</Label>
                  <Input
                    id="maxAttempts"
                    name="maxAttempts"
                    type="number"
                    value={exercise.maxAttempts}
                    onChange={handleExerciseChange}
                    className={formErrors.maxAttempts ? "border-red-500" : ""}
                    min="1"
                    max="10"
                    placeholder="3"
                  />
                  {formErrors.maxAttempts && (
                    <p className="text-red-500 text-sm">
                      {formErrors.maxAttempts}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  dir={getDirection(exercise.title)}
                  id="description"
                  name="description"
                  value={exercise.description}
                  onChange={handleExerciseChange}
                  rows={3}
                  className={formErrors.description ? "border-red-500" : ""}
                  placeholder="Enter exercise description"
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Questions ({exercise.questions.length})</span>
                </CardTitle>
                <Select onValueChange={(value) => addQuestion(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Add question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                    <SelectItem value="fill-in-the-blank">
                      Fill in the Blank
                    </SelectItem>
                    <SelectItem value="matching">Matching</SelectItem>
                    <SelectItem value="table-completion">
                      Table Completion
                    </SelectItem>
                    <SelectItem value="drag-and-drop">Drag and Drop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {formErrors.questions && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{formErrors.questions}</AlertDescription>
                </Alert>
              )}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {exercise.questions.map((question, index) => (
                        <Draggable
                          key={question.id}
                          draggableId={`question_${question.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${
                                snapshot.isDragging ? "shadow-lg" : ""
                              } border-l-4 border-l-blue-500`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-move text-gray-400 hover:text-gray-600"
                                    >
                                      <GripVertical className="h-5 w-5" />
                                    </div>
                                    <Badge variant="outline">
                                      Question {index + 1}
                                    </Badge>
                                    <Badge variant="secondary">
                                      {question.type}
                                    </Badge>
                                  </div>
                                  {exercise.questions.length > 1 && (
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        removeQuestion(question.id)
                                      }
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Question Text *</Label>
                                  <Textarea
                                    value={question.questionText || ""}
                                    onChange={(e) =>
                                      updateQuestion(question.id, {
                                        questionText: e.target.value,
                                      })
                                    }
                                    className={
                                      formErrors[`question_${index}`]
                                        ? "border-red-500"
                                        : ""
                                    }
                                    placeholder="Enter your question"
                                    rows={2}
                                  />
                                  {formErrors[`question_${index}`] && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors[`question_${index}`]}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label>Difficulty</Label>
                                  <Select
                                    value={
                                      question.difficulty?.toString() || "1"
                                    }
                                    onValueChange={(value) =>
                                      updateQuestion(question.id, {
                                        difficulty: Number.parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">Easy</SelectItem>
                                      <SelectItem value="2">Medium</SelectItem>
                                      <SelectItem value="3">Hard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <Label>Correct Answer:</Label>
                                  {renderCorrectAnswerInput(question)}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Review Exercise</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{exercise.title}</h3>
                <p className="text-gray-600">{exercise.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{exercise.timeLimit} seconds</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{exercise.totalPoints} points</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>{exercise.questions.length} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant="secondary">Lesson: {lessonId}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Questions Preview</h4>
                {exercise.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Badge variant="secondary">{question.type}</Badge>
                    </div>
                    <p className="font-medium">{question.questionText}</p>
                    {question.type === "multiple-choice" && (
                      <div className="space-y-1">
                        {question.options?.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-sm p-2 rounded ${
                              question.correctAnswers?.includes(
                                optIndex.toString()
                              )
                                ? "bg-green-100 text-green-800 font-medium"
                                : "bg-gray-50"
                            }`}
                          >
                            <span className="mr-2 font-mono">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            {option}
                            {question.correctAnswers?.includes(
                              optIndex.toString()
                            ) && (
                              <CheckCircle className="inline h-4 w-4 ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Create New Exercise
                    </CardTitle>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Creation Mode
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <p className="text-gray-600">
                    Step {currentStep} of {STEPS.length}:{" "}
                    {STEPS[currentStep - 1]?.description}
                  </p>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex items-center justify-between">
                  {STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = completedSteps.has(step.id);
                    const isClickable =
                      step.id <= currentStep || completedSteps.has(step.id - 1);
                    return (
                      <div key={step.id} className="flex items-center">
                        <button
                          onClick={() => handleStepClick(step.id)}
                          disabled={!isClickable}
                          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-blue-100 text-blue-700"
                              : isCompleted
                              ? "bg-green-100 text-green-700"
                              : isClickable
                              ? "hover:bg-gray-100"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : isCompleted
                                ? "bg-green-600 text-white"
                                : "bg-gray-200"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="text-left hidden md:block">
                            <div className="font-medium text-sm">
                              {step.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {step.description}
                            </div>
                          </div>
                        </button>
                        {index < STEPS.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {formErrors.submit && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{formErrors.submit}</AlertDescription>
            </Alert>
          )}
          {formErrors.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {formErrors.success}
              </AlertDescription>
            </Alert>
          )}

          {/* Step Content */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === STEPS.length) {
                handleSubmit();
              }
            }}
          >
            {renderStepContent()}

            {/* Navigation Buttons */}
            <Card className="mt-2">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={handlePrevious}
                        variant="outline"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="flex space-x-3">
                    {currentStep < STEPS.length ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Create Quiz
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExerciseGenerator;
