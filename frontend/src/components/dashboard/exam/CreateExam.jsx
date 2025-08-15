// import { useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { createExam } from "@/store/examSlice"
// import { fetchLessons } from "@/store/lessonSlice"
// import { fetchExercisesByLesson } from "@/store/exerciseSlice"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { toast } from "react-toastify"
// import { useParams } from "react-router-dom"
// import {
//   Plus,
//   Trash2,
//   BookOpen,
//   FileText,
//   AlertCircle,
//   Loader2,
//   ChevronDown,
//   ChevronUp,
//   Clock,
//   Target,
//   RotateCcw,
//   Eye,
//   HelpCircle,
// } from "lucide-react"

// const ExercisePreview = ({ exercise, isOpen, onToggle }) => {
//   if (!exercise) return null

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 1:
//         return "bg-green-100 text-green-800 border-green-200"
//       case 2:
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       case 3:
//         return "bg-red-100 text-red-800 border-red-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const getDifficultyLabel = (difficulty) => {
//     switch (difficulty) {
//       case 1:
//         return "Facile"
//       case 2:
//         return "Moyen"
//       case 3:
//         return "Difficile"
//       default:
//         return "Non défini"
//     }
//   }

//   const getQuestionTypeLabel = (type) => {
//     const types = {
//       "multiple-choice": "Choix multiple",
//       "short-answer": "Réponse courte",
//       "fill-in-the-blank": "Texte à trous",
//       matching: "Appariement",
//       "drag-and-drop": "Glisser-déposer",
//       "table-completion": "Complétion de tableau",
//     }
//     return types[type] || type
//   }

//   return (
//     <Collapsible open={isOpen} onOpenChange={onToggle}>
//       <CollapsibleTrigger asChild>
//         <Button variant="ghost" size="sm" className="w-full justify-between p-2 h-auto text-left">
//           <div className="flex items-center gap-2">
//             <Eye className="h-4 w-4" />
//             <span className="text-sm font-medium">Aperçu de l'exercice</span>
//           </div>
//           {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//         </Button>
//       </CollapsibleTrigger>

//       <CollapsibleContent className="space-y-3 mt-2">
//         <div className="p-4 bg-muted/30 rounded-lg border">
//           {/* Exercise Header */}
//           <div className="space-y-3 mb-4">
//             <div>
//               <h4 className="font-semibold text-base">{exercise.title}</h4>
//               <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
//             </div>

//             {/* Exercise Stats */}
//             <div className="flex flex-wrap gap-2">
//               <Badge variant="outline" className="text-xs">
//                 <Clock className="h-3 w-3 mr-1" />
//                 {exercise.timeLimit} min
//               </Badge>
//               <Badge variant="outline" className="text-xs">
//                 <Target className="h-3 w-3 mr-1" />
//                 {exercise.totalPoints} pts
//               </Badge>
//               <Badge variant="outline" className="text-xs">
//                 <RotateCcw className="h-3 w-3 mr-1" />
//                 {exercise.maxAttempts} tentatives
//               </Badge>
//               <Badge variant="outline" className="text-xs">
//                 <HelpCircle className="h-3 w-3 mr-1" />
//                 {exercise.questions?.length || 0} questions
//               </Badge>
//             </div>
//           </div>

//           <Separator className="my-3" />

//           {/* Questions Preview */}
//           {exercise.questions && exercise.questions.length > 0 && (
//             <div className="space-y-3">
//               <h5 className="font-medium text-sm flex items-center gap-2">
//                 <HelpCircle className="h-4 w-4" />
//                 Questions ({exercise.questions.length})
//               </h5>

//               <div className="space-y-2 max-h-48 overflow-y-auto">
//                 {exercise.questions.map((question, idx) => (
//                   <div key={idx} className="p-3 bg-background rounded border text-sm">
//                     <div className="flex items-start justify-between gap-2 mb-2">
//                       <span className="font-medium text-xs text-muted-foreground">Question {idx + 1}</span>
//                       <div className="flex gap-1">
//                         <Badge variant="outline" className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
//                           {getDifficultyLabel(question.difficulty)}
//                         </Badge>
//                         <Badge variant="secondary" className="text-xs">
//                           {getQuestionTypeLabel(question.type)}
//                         </Badge>
//                       </div>
//                     </div>

//                     <p className="text-sm mb-2">{question.questionText}</p>

//                     {/* Show options for multiple choice */}
//                     {question.type === "multiple-choice" && question.options && (
//                       <div className="space-y-1">
//                         {question.options.slice(0, 3).map((option, optIdx) => (
//                           <div key={optIdx} className="text-xs text-muted-foreground pl-2">
//                             • {option}
//                           </div>
//                         ))}
//                         {question.options.length > 3 && (
//                           <div className="text-xs text-muted-foreground pl-2">
//                             ... et {question.options.length - 3} autres options
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Show matching pairs */}
//                     {question.type === "matching" && question.matching?.pairs && (
//                       <div className="text-xs text-muted-foreground">
//                         {question.matching.pairs.length} paires à associer
//                       </div>
//                     )}

//                     {/* Show drag and drop items */}
//                     {question.type === "drag-and-drop" && question.dragAndDrop?.items && (
//                       <div className="text-xs text-muted-foreground">
//                         {question.dragAndDrop.items.length} éléments à ordonner
//                       </div>
//                     )}

//                     {/* Show table info */}
//                     {question.type === "table-completion" && question.tableCompletion && (
//                       <div className="text-xs text-muted-foreground">
//                         Tableau {question.tableCompletion.rows?.length || 0}×
//                         {question.tableCompletion.columns?.length || 0}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </CollapsibleContent>
//     </Collapsible>
//   )
// }

// const CreateExamForm = () => {
//   const { courseId } = useParams()
//   const dispatch = useDispatch()
//   const { loading, error } = useSelector((state) => state.exam)
//   const lessons = useSelector((state) => state.lesson.lessons)

//   // selectedExercises has objects like { lesson: lessonId, exercise: exerciseId }
//   const [selectedExercises, setSelectedExercises] = useState([{ lesson: "", exercise: "" }])

//   // Keep exercises fetched for each lesson, keyed by lessonId
//   const [exercisesByLesson, setExercisesByLesson] = useState({})
//   const [title, setTitle] = useState("")

//   // Track which exercise previews are open
//   const [openPreviews, setOpenPreviews] = useState({})

//   useEffect(() => {
//     dispatch(fetchLessons())
//   }, [dispatch])

//   const handleLessonChange = async (index, lessonId) => {
//     // Update selected lesson
//     const updated = [...selectedExercises]
//     updated[index].lesson = lessonId
//     updated[index].exercise = "" // reset exercise when lesson changes
//     setSelectedExercises(updated)

//     // Close preview when lesson changes
//     setOpenPreviews((prev) => ({ ...prev, [index]: false }))

//     // Fetch exercises for this lesson if not already fetched
//     if (lessonId && !exercisesByLesson[lessonId]) {
//       try {
//         const res = await dispatch(fetchExercisesByLesson(lessonId)).unwrap()
//         setExercisesByLesson((prev) => ({ ...prev, [lessonId]: res }))
//       } catch (err) {
//         toast.error("Erreur lors du chargement des exercices")
//       }
//     }
//   }

//   const handleExerciseChange = (index, exerciseId) => {
//     const updated = [...selectedExercises]
//     updated[index].exercise = exerciseId
//     setSelectedExercises(updated)

//     // Auto-open preview when exercise is selected
//     if (exerciseId) {
//       setOpenPreviews((prev) => ({ ...prev, [index]: true }))
//     } else {
//       setOpenPreviews((prev) => ({ ...prev, [index]: false }))
//     }
//   }

//   const addExercise = () => {
//     setSelectedExercises([...selectedExercises, { lesson: "", exercise: "" }])
//   }

//   const removeExercise = (index) => {
//     if (selectedExercises.length === 1) return
//     const updated = [...selectedExercises]
//     updated.splice(index, 1)
//     setSelectedExercises(updated)

//     // Remove preview state for removed exercise
//     const newPreviews = { ...openPreviews }
//     delete newPreviews[index]
//     // Shift down the preview states for exercises after the removed one
//     Object.keys(newPreviews).forEach((key) => {
//       const keyNum = Number.parseInt(key)
//       if (keyNum > index) {
//         newPreviews[keyNum - 1] = newPreviews[keyNum]
//         delete newPreviews[keyNum]
//       }
//     })
//     setOpenPreviews(newPreviews)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!title.trim()) {
//       toast.error("Le titre de l'examen est requis")
//       return
//     }
//     if (selectedExercises.some((ex) => !ex.lesson || !ex.exercise)) {
//       toast.error("Tous les champs des exercices doivent être remplis")
//       return
//     }

//     try {
//       const payload = {
//         courseId,
//         title: title.trim(),
//         selectedExercises,
//       }
//       await dispatch(createExam(payload)).unwrap()
//       toast.success("Examen créé avec succès")
//       setTitle("")
//       setSelectedExercises([{ lesson: "", exercise: "" }])
//       setExercisesByLesson({})
//       setOpenPreviews({})
//     } catch (err) {
//       toast.error(`Erreur lors de la création : ${err.message || err}`)
//     }
//   }

//   const getSelectedLessonTitle = (lessonId) => {
//     const lesson = lessons.find((l) => l._id === lessonId)
//     return lesson?.title || lesson?._id || ""
//   }

//   const getSelectedExercise = (lessonId, exerciseId) => {
//     const exercises = exercisesByLesson[lessonId] || []
//     return exercises.find((e) => e._id === exerciseId)
//   }

//   const togglePreview = (index) => {
//     setOpenPreviews((prev) => ({ ...prev, [index]: !prev[index] }))
//   }

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl font-bold flex items-center gap-2">
//           <FileText className="h-6 w-6 text-primary" />
//           Créer un nouvel examen
//         </CardTitle>
//         <CardDescription>Sélectionnez les exercices à inclure dans votre examen</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title Section */}
//           <div className="space-y-2">
//             <Label htmlFor="examTitle" className="text-sm font-medium">
//               Titre de l'examen *
//             </Label>
//             <Input
//               id="examTitle"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Ex: Examen final - Trimestre 1"
//               disabled={loading}
//               className="w-full"
//             />
//           </div>

//           <Separator />

//           {/* Exercises Section */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Exercices sélectionnés</Label>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Ajoutez les exercices que vous souhaitez inclure dans l'examen
//                 </p>
//               </div>
//               <Badge variant="secondary" className="text-xs">
//                 {selectedExercises.length} exercice{selectedExercises.length > 1 ? "s" : ""}
//               </Badge>
//             </div>

//             <div className="space-y-3">
//               {selectedExercises.map((ex, idx) => {
//                 const selectedExercise = getSelectedExercise(ex.lesson, ex.exercise)

//                 return (
//                   <Card
//                     key={idx}
//                     className="border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors"
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex items-center gap-2 mb-3">
//                         <BookOpen className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm font-medium">Exercice #{idx + 1}</span>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Lesson Selection */}
//                         <div className="space-y-2">
//                           <Label className="text-xs text-muted-foreground">Leçon</Label>
//                           <Select
//                             value={ex.lesson}
//                             onValueChange={(value) => handleLessonChange(idx, value)}
//                             disabled={loading}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Sélectionnez une leçon" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {lessons.map((lesson) => (
//                                 <SelectItem key={lesson._id} value={lesson._id}>
//                                   {lesson.title || lesson._id}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         {/* Exercise Selection */}
//                         <div className="space-y-2">
//                           <Label className="text-xs text-muted-foreground">Exercice</Label>
//                           <Select
//                             value={ex.exercise}
//                             onValueChange={(value) => handleExerciseChange(idx, value)}
//                             disabled={loading || !ex.lesson}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Sélectionnez un exercice" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {(ex.lesson && exercisesByLesson[ex.lesson] ? exercisesByLesson[ex.lesson] : []).map(
//                                 (exercise) => (
//                                   <SelectItem key={exercise._id} value={exercise._id}>
//                                     {exercise.title || exercise._id}
//                                   </SelectItem>
//                                 ),
//                               )}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       {/* Exercise Preview */}
//                       {selectedExercise && (
//                         <div className="mt-4">
//                           <ExercisePreview
//                             exercise={selectedExercise}
//                             isOpen={openPreviews[idx] || false}
//                             onToggle={() => togglePreview(idx)}
//                           />
//                         </div>
//                       )}

//                       {/* Remove Button */}
//                       <div className="flex justify-end mt-3">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeExercise(idx)}
//                           disabled={loading || selectedExercises.length === 1}
//                           className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                         >
//                           <Trash2 className="h-4 w-4 mr-1" />
//                           Supprimer
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>

//             {/* Add Exercise Button */}
//             <Button
//               type="button"
//               onClick={addExercise}
//               disabled={loading}
//               variant="outline"
//               className="w-full border-dashed border-2 hover:border-solid bg-transparent"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Ajouter un exercice
//             </Button>
//           </div>

//           <Separator />

//           {/* Error Display */}
//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>Erreur: {error.message || error}</AlertDescription>
//             </Alert>
//           )}

//           {/* Submit Button */}
//           <Button type="submit" disabled={loading} className="w-full h-11 text-base font-medium">
//             {loading ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Création en cours...
//               </>
//             ) : (
//               <>
//                 <FileText className="h-4 w-4 mr-2" />
//                 Créer l'examen
//               </>
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

// export default CreateExamForm



import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createExam } from "@/store/examSlice";
import { fetchLessonsByCourse } from "@/store/lessonSlice";
import { fetchExercisesByLesson } from "@/store/exerciseSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  BookOpen,
  FileText,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  RotateCcw,
  Eye,
  HelpCircle,
  EyeOffIcon,
  EyeIcon,
} from "lucide-react";
import { Textarea } from "../../ui/textarea";

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };


const ExercisePreview = ({ exercise, isOpen, onToggle }) => {
  if (!exercise) return null;

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
        return "Facile";
      case 2:
        return "Moyen";
      case 3:
        return "Difficile";
      default:
        return "Non défini";
    }
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      "multiple-choice": "Choix multiple",
      "short-answer": "Réponse courte",
      "fill-in-the-blank": "Texte à trous",
      matching: "Appariement",
      "drag-and-drop": "Glisser-déposer",
      "table-completion": "Complétion de tableau",
    };
    return types[type] || type;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between p-2 h-auto text-left"
        >
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Aperçu de l'exercice</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-3 mt-2">
        <div className="p-4 bg-muted/30 rounded-lg border">
          {/* Exercise Header */}
          <div className="space-y-3 mb-4">
            <div>
              <h4 className="font-semibold text-base" dir={getDirection(exercise.title)}>{exercise.title}</h4>
              <p className="text-sm text-muted-foreground mt-1" dir={getDirection(exercise.title)}>
                {exercise.description}
              </p>
            </div>

            {/* Exercise Stats */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {exercise.timeLimit} min
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                {exercise.totalPoints} pts
              </Badge>
              <Badge variant="outline" className="text-xs">
                <RotateCcw className="h-3 w-3 mr-1" />
                {exercise.maxAttempts} tentatives
              </Badge>
              <Badge variant="outline" className="text-xs">
                <HelpCircle className="h-3 w-3 mr-1" />
                {exercise.questions?.length || 0} questions
              </Badge>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Questions Preview */}
          {exercise.questions && exercise.questions.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-medium text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Questions ({exercise.questions.length})
              </h5>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {exercise.questions.map((question, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-background rounded border text-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-medium text-xs text-muted-foreground">
                        Question {idx + 1}
                      </span>
                      <div className="flex gap-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getDifficultyColor(
                            question.difficulty
                          )}`}
                        >
                          {getDifficultyLabel(question.difficulty)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getQuestionTypeLabel(question.type)}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm mb-2"  dir={getDirection(question.questionText)}>{question.questionText}</p>

                    {/* Show options for multiple choice */}
                    {question.type === "multiple-choice" &&
                      question.options && (
                        <div className="space-y-1">
                          {question.options
                            .slice(0, 3)
                            .map((option, optIdx) => (
                              <div
                                key={optIdx}
                                className="text-xs text-muted-foreground pl-2"
                              >
                                • {option}
                              </div>
                            ))}
                          {question.options.length > 3 && (
                            <div className="text-xs text-muted-foreground pl-2">
                              ... et {question.options.length - 3} autres
                              options
                            </div>
                          )}
                        </div>
                      )}

                    {/* Show matching pairs */}
                    {question.type === "matching" &&
                      question.matching?.pairs && (
                        <div className="text-xs text-muted-foreground">
                          {question.matching.pairs.length} paires à associer
                        </div>
                      )}

                    {/* Show drag and drop items */}
                    {question.type === "drag-and-drop" &&
                      question.dragAndDrop?.items && (
                        <div className="text-xs text-muted-foreground">
                          {question.dragAndDrop.items.length} éléments à
                          ordonner
                        </div>
                      )}

                    {/* Show table info */}
                    {question.type === "table-completion" &&
                      question.tableCompletion && (
                        <div className="text-xs text-muted-foreground">
                          Tableau {question.tableCompletion.rows?.length || 0}×
                          {question.tableCompletion.columns?.length || 0}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const CreateExamForm = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.exam);
  const lessons = useSelector((state) => state.lesson.lessons);

  // selectedExercises has objects like { lesson: lessonId, exercise: exerciseId }
  const [selectedExercises, setSelectedExercises] = useState([
    { lesson: "", exercise: "" },
  ]);

  // Keep exercises fetched for each lesson, keyed by lessonId
  const [exercisesByLesson, setExercisesByLesson] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);
  // Track which exercise previews are open
  const [openPreviews, setOpenPreviews] = useState({});

useEffect(() => {
  if (courseId) {
    dispatch(fetchLessonsByCourse(courseId));
  }
}, [dispatch, courseId]);

  const handleLessonChange = async (index, lessonId) => {
    // Update selected lesson
    const updated = [...selectedExercises];
    updated[index].lesson = lessonId;
    updated[index].exercise = "";
    setSelectedExercises(updated);

    // Close preview when lesson changes
    setOpenPreviews((prev) => ({ ...prev, [index]: false }));

    // Fetch exercises for this lesson if not already fetched
    if (lessonId && !exercisesByLesson[lessonId]) {
      try {
        const res = await dispatch(fetchExercisesByLesson(lessonId)).unwrap();
        setExercisesByLesson((prev) => ({ ...prev, [lessonId]: res }));
      } catch (err) {
        toast.error("Erreur lors du chargement des exercices");
      }
    }
  };

  const handleExerciseChange = (index, exerciseId) => {
    const updated = [...selectedExercises];
    updated[index].exercise = exerciseId;
    setSelectedExercises(updated);

    // Auto-open preview when exercise is selected
    if (exerciseId) {
      setOpenPreviews((prev) => ({ ...prev, [index]: true }));
    } else {
      setOpenPreviews((prev) => ({ ...prev, [index]: false }));
    }
  };

  const addExercise = () => {
    setSelectedExercises([...selectedExercises, { lesson: "", exercise: "" }]);
  };

  const removeExercise = (index) => {
    if (selectedExercises.length === 1) return;
    const updated = [...selectedExercises];
    updated.splice(index, 1);
    setSelectedExercises(updated);

    // Remove preview state for removed exercise
    const newPreviews = { ...openPreviews };
    delete newPreviews[index];
    // Shift down the preview states for exercises after the removed one
    Object.keys(newPreviews).forEach((key) => {
      const keyNum = Number.parseInt(key);
      if (keyNum > index) {
        newPreviews[keyNum - 1] = newPreviews[keyNum];
        delete newPreviews[keyNum];
      }
    });
    setOpenPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre de l'examen est requis");
      return;
    }
    if (selectedExercises.some((ex) => !ex.lesson || !ex.exercise)) {
      toast.error("Tous les champs des exercices doivent être remplis");
      return;
    }

    try {
      const payload = {
        courseId,
        title: title.trim(),
        selectedExercises,
        description,
        published,
      };
      await dispatch(createExam(payload)).unwrap();
      toast.success("Examen créé avec succès");
      setTitle("");
      setDescription("");
      setSelectedExercises([{ lesson: "", exercise: "" }]);
      setExercisesByLesson({});
      await navigate(-1)
    } catch (err) {
      toast.error(`Erreur lors de la création : ${err.message || err}`);
    }
  };

  const getSelectedLessonTitle = (lessonId) => {
    const lesson = lessons.find((l) => l._id === lessonId);
    return lesson?.title || lesson?._id || "";
  };

  const getSelectedExercise = (lessonId, exerciseId) => {
    const exercises = exercisesByLesson[lessonId] || [];
    return exercises.find((e) => e._id === exerciseId);
  };

  const togglePreview = (index) => {
    setOpenPreviews((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Créer un nouvel examen
        </CardTitle>
        <CardDescription>
          Sélectionnez les exercices à inclure dans votre examen
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <Label htmlFor="examTitle" className="text-sm font-medium">
              Titre de l'examen *
            </Label>
            <Input
              dir={getDirection(title)}
              id="examTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Examen final - Trimestre 1"
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              dir={getDirection(title)}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Enter quiz description"
            />
          </div>
          <div>
            <Label className="text-lg font-semibold text-gray-700">
              Visibility
            </Label>
            <div className="mt-2 space-x-4">
              <Label className="inline-flex items-center">
                <Input
                  type="radio"
                  className="size-6"
                  name="visibility"
                  value="true"
                  checked={published === true}
                  onChange={() => setPublished(true)}
                />
                <span className="ml-2 text-gray-700">
                  <EyeIcon className="inline-block mr-1 h-5 w-5" />
                  Public
                </span>
              </Label>
              <Label className="inline-flex items-center">
                <Input
                  type="radio"
                  className="size-6"
                  name="visibility"
                  value="false"
                  checked={published === false}
                  onChange={() => setPublished(false)}
                />
                <span className="ml-2 text-gray-700">
                  <EyeOffIcon className="inline-block mr-1 h-5 w-5" />
                  Private
                </span>
              </Label>
            </div>
          </div>

          <Separator />

          {/* Exercises Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Exercices sélectionnés
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Ajoutez les exercices que vous souhaitez inclure dans l'examen
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {selectedExercises.length} exercice
                {selectedExercises.length > 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="space-y-3">
              {selectedExercises.map((ex, idx) => {
                const selectedExercise = getSelectedExercise(
                  ex.lesson,
                  ex.exercise
                );

                return (
                  <Card
                    key={idx}
                    className="border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Exercice #{idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Lesson Selection */}
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Leçon
                          </Label>
                          <Select
                            value={ex.lesson}
                            onValueChange={(value) =>
                              handleLessonChange(idx, value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une leçon" />
                            </SelectTrigger>
                            <SelectContent>
                              {lessons.map((lesson) => (
                                <SelectItem key={lesson._id} value={lesson._id}>
                                  {lesson.title || lesson._id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Exercise Selection */}
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Exercice
                          </Label>
                          <Select
                            value={ex.exercise}
                            onValueChange={(value) =>
                              handleExerciseChange(idx, value)
                            }
                            disabled={loading || !ex.lesson}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un exercice" />
                            </SelectTrigger>
                            <SelectContent>
                              {(ex.lesson && exercisesByLesson[ex.lesson]
                                ? exercisesByLesson[ex.lesson]
                                : []
                              ).map((exercise) => (
                                <SelectItem
                                  key={exercise._id}
                                  value={exercise._id}
                                >
                                  {exercise.title || exercise._id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Exercise Preview */}
                      {selectedExercise && (
                        <div className="mt-4">
                          <ExercisePreview
                            exercise={selectedExercise}
                            isOpen={openPreviews[idx] || false}
                            onToggle={() => togglePreview(idx)}
                          />
                        </div>
                      )}

                      {/* Remove Button */}
                      <div className="flex justify-end mt-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(idx)}
                          disabled={loading || selectedExercises.length === 1}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Add Exercise Button */}
            <Button
              type="button"
              onClick={addExercise}
              disabled={loading}
              variant="outline"
              className="w-full border-dashed border-2 hover:border-solid bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un exercice
            </Button>
          </div>

          <Separator />

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erreur: {error.message || error}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Créer l'examen
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateExamForm;
