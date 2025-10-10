import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editExam, getExamById } from "@/store/examSlice";
import { fetchLessons } from "@/store/lessonSlice";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import katex from "katex";
import "katex/dist/katex.min.css";
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
  Save,
  ArrowLeft,
} from "lucide-react";
import { Textarea } from "../../ui/textarea";

const getDirection = (text) => {
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlChars.test(text) ? "rtl" : "ltr";
};

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

const ExercisePreview = ({ exercise, isOpen, onToggle }) => {
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
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between p-2 h-auto text-left"
        >
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Exercise Preview</span>
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
          <div className="space-y-3 mb-4">
            <div>
              <h4
                className="font-semibold text-base"
                dir={getDirection(exercise.title)}
              >
              <MathText text={exercise.title}/>
              </h4>
              <p
                className="text-sm text-muted-foreground mt-1"
                dir={getDirection(exercise.title)}
              >
               <MathText text={exercise.description}/>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {exercise.timeLimit || 0} min
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                {exercise.totalPoints || 0} pts
              </Badge>
              <Badge variant="outline" className="text-xs">
                <RotateCcw className="h-3 w-3 mr-1" />
                {exercise.maxAttempts || 0} attempts
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <HelpCircle className="h-3 w-3 mr-1" />
                {exercise.questions?.length || 0} questions
              </Badge>
            </div>
          </div>

          <Separator className="my-3" />

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

                    <p
                      className="text-sm mb-2"
                      dir={getDirection(question.questionText)}
                    >
                      {question.questionText}
                    </p>

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
                              ... and {question.options.length - 3} more options
                            </div>
                          )}
                        </div>
                      )}

                    {question.type === "matching" &&
                      question.matching?.pairs && (
                        <div className="text-xs text-muted-foreground">
                          {question.matching.pairs.length} pairs to match
                        </div>
                      )}

                    {question.type === "drag-and-drop" &&
                      question.dragAndDrop?.items && (
                        <div className="text-xs text-muted-foreground">
                          {question.dragAndDrop.items.length} items to order
                        </div>
                      )}

                    {question.type === "table-completion" &&
                      question.tableCompletion && (
                        <div className="text-xs text-muted-foreground">
                          Table {question.tableCompletion.rows?.length || 0}×
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

const UpdateExamForm = () => {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, currentExam } = useSelector((state) => state.exam);
  const lessons = useSelector((state) => state.lesson.lessons);

  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercisesByLesson, setExercisesByLesson] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openPreviews, setOpenPreviews] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(getExamById(examId)),
          dispatch(fetchLessons()),
        ]);
      } catch (err) {
        toast.error("Error loading data");
      }
    };

    if (examId) {
      loadData();
    }
  }, [dispatch, examId]);

  useEffect(() => {
    if (currentExam && lessons.length > 0 && !isInitialized) {
      setTitle(currentExam.title || "");
      setDescription(currentExam.description || "");

      // Initialize selected exercises
      if (currentExam.exercises && Array.isArray(currentExam.exercises)) {
        const initialExercises = currentExam.exercises.map((ex) => ({
          lesson: typeof ex.lesson === "object" ? ex.lesson._id : ex.lesson,
          exercise:
            typeof ex.exercise === "object" ? ex.exercise._id : ex.exercise,
        }));
        setSelectedExercises(initialExercises);

        // Load exercises for each lesson
        const loadExercisesForLessons = async () => {
          const lessonIds = [
            ...new Set(initialExercises.map((ex) => ex.lesson).filter(Boolean)),
          ];

          for (const lessonId of lessonIds) {
            if (lessonId && !exercisesByLesson[lessonId]) {
              try {
                const res = await dispatch(
                  fetchExercisesByLesson(lessonId)
                ).unwrap();
                setExercisesByLesson((prev) => ({
                  ...prev,
                  [lessonId]: res,
                }));
              } catch (err) {
                toast.error(`Error loading exercises for lesson ${lessonId}`);
              }
            }
          }
        };

        loadExercisesForLessons();
      } else {
        setSelectedExercises([{ lesson: "", exercise: "" }]);
      }

      setIsInitialized(true);
    }
  }, [currentExam, lessons, isInitialized, dispatch, exercisesByLesson]);

  const handleLessonChange = async (index, lessonId) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], lesson: lessonId, exercise: "" };
    setSelectedExercises(updated);

    setOpenPreviews((prev) => ({ ...prev, [index]: false }));

    if (lessonId && !exercisesByLesson[lessonId]) {
      try {
        const res = await dispatch(fetchExercisesByLesson(lessonId)).unwrap();
        setExercisesByLesson((prev) => ({ ...prev, [lessonId]: res }));
      } catch (err) {
        toast.error("Error loading exercises");
      }
    }
  };

  const handleExerciseChange = (index, exerciseId) => {
    const updated = [...selectedExercises];
    updated[index].exercise = exerciseId;
    setSelectedExercises(updated);

    setOpenPreviews((prev) => ({ ...prev, [index]: !!exerciseId }));
  };

  const addExercise = () => {
    setSelectedExercises([...selectedExercises, { lesson: "", exercise: "" }]);
  };

  const removeExercise = (index) => {
    if (selectedExercises.length <= 1) return;

    const updated = [...selectedExercises];
    updated.splice(index, 1);
    setSelectedExercises(updated);

    const newPreviews = { ...openPreviews };
    delete newPreviews[index];
    Object.keys(newPreviews).forEach((key) => {
      const keyNum = parseInt(key);
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
      toast.error("Exam title is required");
      return;
    }

    if (selectedExercises.some((ex) => !ex.lesson || !ex.exercise)) {
      toast.error("All exercise fields must be completed");
      return;
    }

    try {
      await dispatch(
        editExam({
          examId,
          updatedData: {
            title: title.trim(),
            description,
            selectedExercises,
          },
        })
      ).unwrap();

      toast.success("Exam updated successfully");
      navigate(-1);
    } catch (err) {
      toast.error(err.message || "Failed to update exam");
    }
  };

  const getSelectedExercise = (lessonId, exerciseId) => {
    const exercises = exercisesByLesson[lessonId] || [];
    return exercises.find((e) => e._id === exerciseId);
  };

  const togglePreview = (index) => {
    setOpenPreviews((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!currentExam && loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentExam && !loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load exam. Please try again.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mt-4 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Edit Exam
            </CardTitle>
            <CardDescription>
              Modify the exercises and settings of your exam
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="examTitle" className="text-sm font-medium">
              Exam Title *
            </Label>
            <Input
              dir={getDirection(title)}
              id="examTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Final Exam - Semester 1"
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

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Selected Exercises
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Modify the exercises included in the exam
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {selectedExercises.length} exercise
                {selectedExercises.length !== 1 ? "s" : ""}
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
                          Exercise #{idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Lesson
                          </Label>
                          <Select
                            value={ex.lesson}
                            onValueChange={(value) =>
                              handleLessonChange(idx, value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a lesson" />
                            </SelectTrigger>
                            <SelectContent>
                              {lessons.map((lesson) => (
                                <SelectItem key={lesson._id} value={lesson._id}>
                                  {lesson.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Exercise
                          </Label>
                          <Select
                            value={ex.exercise}
                            onValueChange={(value) =>
                              handleExerciseChange(idx, value)
                            }
                            disabled={loading || !ex.lesson}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an exercise" />
                            </SelectTrigger>
                            <SelectContent>
                              {(ex.lesson
                                ? exercisesByLesson[ex.lesson] || []
                                : []
                              ).map((exercise) => (
                                <SelectItem
                                  key={exercise._id}
                                  value={exercise._id}
                                >
                                  {exercise.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {selectedExercise && (
                        <div className="mt-4">
                          <ExercisePreview
                            exercise={selectedExercise}
                            isOpen={!!openPreviews[idx]}
                            onToggle={() => togglePreview(idx)}
                          />
                        </div>
                      )}

                      <div className="flex justify-end mt-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(idx)}
                          disabled={loading || selectedExercises.length <= 1}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button
              type="button"
              onClick={addExercise}
              disabled={loading}
              variant="outline"
              className="w-full border-dashed border-2 hover:border-solid bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </div>

          <Separator />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error: {error.message || error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              variant="outline"
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 text-base font-medium"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateExamForm;

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { editExam, getExamById } from "@/store/examSlice";
// import { fetchLessons } from "@/store/lessonSlice";
// import { fetchExercisesByLesson } from "@/store/exerciseSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
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
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "react-toastify";
// import { useParams, useNavigate } from "react-router-dom";
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
//   Save,
//   ArrowLeft,
// } from "lucide-react";
// import { Textarea } from "../../ui/textarea";

// const getDirection = (text) => {
//   const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
//   return rtlChars.test(text) ? "rtl" : "ltr";
// };

// const ExercisePreview = ({ exercise, isOpen, onToggle }) => {
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
//         return "Facile";
//       case 2:
//         return "Moyen";
//       case 3:
//         return "Difficile";
//       default:
//         return "Non spécifié";
//     }
//   };

//   const getQuestionTypeLabel = (type) => {
//     const types = {
//       "multiple-choice": "Choix multiple",
//       "short-answer": "Réponse courte",
//       "fill-in-the-blank": "Compléter le blanc",
//       matching: "Appariement",
//       "drag-and-drop": "Glisser-déposer",
//       "table-completion": "Complétion de tableau",
//     };
//     return types[type] || type;
//   };

//   return (
//     <Collapsible open={isOpen} onOpenChange={onToggle}>
//       <CollapsibleTrigger asChild>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="w-full justify-between p-2 h-auto text-left"
//         >
//           <div className="flex items-center gap-2">
//             <Eye className="h-4 w-4" />
//             <span className="text-sm font-medium">Aperçu de l'exercice</span>
//           </div>
//           {isOpen ? (
//             <ChevronUp className="h-4 w-4" />
//           ) : (
//             <ChevronDown className="h-4 w-4" />
//           )}
//         </Button>
//       </CollapsibleTrigger>

//       <CollapsibleContent className="space-y-3 mt-2">
//         <div className="p-4 bg-muted/30 rounded-lg border">
//           <div className="space-y-3 mb-4">
//             <div>
//               <h4
//                 className="font-semibold text-base"
//                 dir={getDirection(exercise.title)}
//               >
//                 {exercise.title}
//               </h4>
//               <p
//                 className="text-sm text-muted-foreground mt-1"
//                 dir={getDirection(exercise.title)}
//               >
//                 {exercise.description}
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <Badge variant="outline" className="text-xs">
//                 <Clock className="h-3 w-3 mr-1" />
//                 {exercise.timeLimit/60 || 0} min
//               </Badge>
//               <Badge variant="outline" className="text-xs">
//                 <Target className="h-3 w-3 mr-1" />
//                 {exercise.totalPoints || 0} pts
//               </Badge>
//               <Badge variant="outline" className="text-xs">
//                 <RotateCcw className="h-3 w-3 mr-1" />
//                 {exercise.maxAttempts || 0} tentatives
//               </Badge>
//               <Badge variant="secondary" className="text-xs">
//                 <HelpCircle className="h-3 w-3 mr-1" />
//                 {exercise.questions?.length || 0} questions
//               </Badge>
//             </div>
//           </div>

//           <Separator className="my-3" />

//           {exercise.questions && exercise.questions.length > 0 && (
//             <div className="space-y-3">
//               <h5 className="font-medium text-sm flex items-center gap-2">
//                 <HelpCircle className="h-4 w-4" />
//                 Questions ({exercise.questions.length})
//               </h5>

//               <div className="space-y-2 max-h-48 overflow-y-auto">
//                 {exercise.questions.map((question, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-background rounded border text-sm"
//                   >
//                     <div className="flex items-start justify-between gap-2 mb-2">
//                       <span className="font-medium text-xs text-muted-foreground">
//                         Question {idx + 1}
//                       </span>
//                       <div className="flex gap-1">
//                         <Badge
//                           variant="outline"
//                           className={`text-xs ${getDifficultyColor(
//                             question.difficulty
//                           )}`}
//                         >
//                           {getDifficultyLabel(question.difficulty)}
//                         </Badge>
//                         <Badge variant="secondary" className="text-xs">
//                           {getQuestionTypeLabel(question.type)}
//                         </Badge>
//                       </div>
//                     </div>

//                     <p
//                       className="text-sm mb-2"
//                       dir={getDirection(question.questionText)}
//                     >
//                       {question.questionText}
//                     </p>

//                     {question.type === "multiple-choice" &&
//                       question.options && (
//                         <div className="space-y-1">
//                           {question.options
//                             .slice(0, 3)
//                             .map((option, optIdx) => (
//                               <div
//                                 key={optIdx}
//                                 className="text-xs text-muted-foreground pl-2"
//                               >
//                                 • {option}
//                               </div>
//                             ))}
//                           {question.options.length > 3 && (
//                             <div className="text-xs text-muted-foreground pl-2">
//                               ... et {question.options.length - 3} options supplémentaires
//                             </div>
//                           )}
//                         </div>
//                       )}

//                     {question.type === "matching" &&
//                       question.matching?.pairs && (
//                         <div className="text-xs text-muted-foreground">
//                           {question.matching.pairs.length} paires à associer
//                         </div>
//                       )}

//                     {question.type === "drag-and-drop" &&
//                       question.dragAndDrop?.items && (
//                         <div className="text-xs text-muted-foreground">
//                           {question.dragAndDrop.items.length} éléments à ordonner
//                         </div>
//                       )}

//                     {question.type === "table-completion" &&
//                       question.tableCompletion && (
//                         <div className="text-xs text-muted-foreground">
//                           Tableau {question.tableCompletion.rows?.length || 0}×
//                           {question.tableCompletion.columns?.length || 0}
//                         </div>
//                       )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </CollapsibleContent>
//     </Collapsible>
//   );
// };

// const UpdateExamForm = () => {
//   const { courseId, examId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, error, currentExam } = useSelector((state) => state.exam);
//   const lessons = useSelector((state) => state.lesson.lessons);

//   const [selectedExercises, setSelectedExercises] = useState([]);
//   const [exercisesByLesson, setExercisesByLesson] = useState({});
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [openPreviews, setOpenPreviews] = useState({});
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         await Promise.all([
//           dispatch(getExamById(examId)),
//           dispatch(fetchLessons()),
//         ]);
//       } catch (err) {
//         toast.error("Erreur lors du chargement des données");
//       }
//     };

//     if (examId) {
//       loadData();
//     }
//   }, [dispatch, examId]);

//   useEffect(() => {
//     if (currentExam && lessons.length > 0 && !isInitialized) {
//       setTitle(currentExam.title || "");
//       setDescription(currentExam.description || "");

//       // Initialize selected exercises
//       if (currentExam.exercises && Array.isArray(currentExam.exercises)) {
//         const initialExercises = currentExam.exercises.map((ex) => ({
//           lesson: typeof ex.lesson === "object" ? ex.lesson._id : ex.lesson,
//           exercise:
//             typeof ex.exercise === "object" ? ex.exercise._id : ex.exercise,
//         }));
//         setSelectedExercises(initialExercises);

//         // Load exercises for each lesson
//         const loadExercisesForLessons = async () => {
//           const lessonIds = [
//             ...new Set(initialExercises.map((ex) => ex.lesson).filter(Boolean)),
//           ];

//           for (const lessonId of lessonIds) {
//             if (lessonId && !exercisesByLesson[lessonId]) {
//               try {
//                 const res = await dispatch(
//                   fetchExercisesByLesson(lessonId)
//                 ).unwrap();
//                 setExercisesByLesson((prev) => ({
//                   ...prev,
//                   [lessonId]: res,
//                 }));
//               } catch (err) {
//                 toast.error(`Erreur lors du chargement des exercices pour la leçon ${lessonId}`);
//               }
//             }
//           }
//         };

//         loadExercisesForLessons();
//       } else {
//         setSelectedExercises([{ lesson: "", exercise: "" }]);
//       }

//       setIsInitialized(true);
//     }
//   }, [currentExam, lessons, isInitialized, dispatch, exercisesByLesson]);

//   const handleLessonChange = async (index, lessonId) => {
//     const updated = [...selectedExercises];
//     updated[index] = { ...updated[index], lesson: lessonId, exercise: "" };
//     setSelectedExercises(updated);

//     setOpenPreviews((prev) => ({ ...prev, [index]: false }));

//     if (lessonId && !exercisesByLesson[lessonId]) {
//       try {
//         const res = await dispatch(fetchExercisesByLesson(lessonId)).unwrap();
//         setExercisesByLesson((prev) => ({ ...prev, [lessonId]: res }));
//       } catch (err) {
//         toast.error("Erreur lors du chargement des exercices");
//       }
//     }
//   };

//   const handleExerciseChange = (index, exerciseId) => {
//     const updated = [...selectedExercises];
//     updated[index].exercise = exerciseId;
//     setSelectedExercises(updated);

//     setOpenPreviews((prev) => ({ ...prev, [index]: !!exerciseId }));
//   };

//   const addExercise = () => {
//     setSelectedExercises([...selectedExercises, { lesson: "", exercise: "" }]);
//   };

//   const removeExercise = (index) => {
//     if (selectedExercises.length <= 1) return;

//     const updated = [...selectedExercises];
//     updated.splice(index, 1);
//     setSelectedExercises(updated);

//     const newPreviews = { ...openPreviews };
//     delete newPreviews[index];
//     Object.keys(newPreviews).forEach((key) => {
//       const keyNum = parseInt(key);
//       if (keyNum > index) {
//         newPreviews[keyNum - 1] = newPreviews[keyNum];
//         delete newPreviews[keyNum];
//       }
//     });
//     setOpenPreviews(newPreviews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       toast.error("Le titre de l'examen est requis");
//       return;
//     }

//     if (selectedExercises.some((ex) => !ex.lesson || !ex.exercise)) {
//       toast.error("Tous les champs des exercices doivent être remplis");
//       return;
//     }

//     try {
//       await dispatch(
//         editExam({
//           examId,
//           updatedData: {
//             title: title.trim(),
//             description,
//             selectedExercises,
//           },
//         })
//       ).unwrap();

//       toast.success("Examen mis à jour avec succès");
//       navigate(-1);
//     } catch (err) {
//       toast.error(err.message || "Échec de la mise à jour de l'examen");
//     }
//   };

//   const getSelectedExercise = (lessonId, exerciseId) => {
//     const exercises = exercisesByLesson[lessonId] || [];
//     return exercises.find((e) => e._id === exerciseId);
//   };

//   const togglePreview = (index) => {
//     setOpenPreviews((prev) => ({ ...prev, [index]: !prev[index] }));
//   };

//   if (!currentExam && loading) {
//     return (
//       <Card className="w-full max-w-4xl mx-auto">
//         <CardHeader className="space-y-1">
//           <Skeleton className="h-8 w-64" />
//           <Skeleton className="h-4 w-96" />
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="space-y-2">
//             <Skeleton className="h-4 w-32" />
//             <Skeleton className="h-10 w-full" />
//           </div>
//           <Skeleton className="h-px w-full" />
//           <div className="space-y-4">
//             <Skeleton className="h-6 w-48" />
//             <Skeleton className="h-32 w-full" />
//             <Skeleton className="h-32 w-full" />
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!currentExam && !loading) {
//     return (
//       <Card className="w-full max-w-4xl mx-auto">
//         <CardContent className="p-6">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               Échec du chargement de l'examen. Veuillez réessayer.
//             </AlertDescription>
//           </Alert>
//           <Button
//             onClick={() => navigate(-1)}
//             variant="outline"
//             className="mt-4 bg-transparent"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Retour
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader className="space-y-1">
//         <div className="flex items-center gap-2">
//           <div>
//             <CardTitle className="text-2xl font-bold flex items-center gap-2">
//               <FileText className="h-6 w-6 text-primary" />
//               Modifier l'examen
//             </CardTitle>
//             <CardDescription>
//               Modifier les exercices et les paramètres de votre examen
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="examTitle" className="text-sm font-medium">
//               Titre de l'examen *
//             </Label>
//             <Input
//               dir={getDirection(title)}
//               id="examTitle"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Ex : Examen final - Semestre 1"
//               disabled={loading}
//               className="w-full"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="description">Description *</Label>
//             <Textarea
//               dir={getDirection(title)}
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={3}
//               placeholder="Saisir la description de l'examen"
//             />
//           </div>

//           <Separator />

//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">
//                   Exercices sélectionnés
//                 </Label>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Modifier les exercices inclus dans l'examen
//                 </p>
//               </div>
//               <Badge variant="secondary" className="text-xs">
//                 {selectedExercises.length} exercice
//                 {selectedExercises.length !== 1 ? "s" : ""}
//               </Badge>
//             </div>

//             <div className="space-y-3">
//               {selectedExercises.map((ex, idx) => {
//                 const selectedExercise = getSelectedExercise(
//                   ex.lesson,
//                   ex.exercise
//                 );

//                 return (
//                   <Card
//                     key={idx}
//                     className="border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors"
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex items-center gap-2 mb-3">
//                         <BookOpen className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm font-medium">
//                           Exercice #{idx + 1}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label className="text-xs text-muted-foreground">
//                             Leçon
//                           </Label>
//                           <Select
//                             value={ex.lesson}
//                             onValueChange={(value) =>
//                               handleLessonChange(idx, value)
//                             }
//                             disabled={loading}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Sélectionner une leçon" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {lessons.map((lesson) => (
//                                 <SelectItem key={lesson._id} value={lesson._id}>
//                                   {lesson.title}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div className="space-y-2">
//                           <Label className="text-xs text-muted-foreground">
//                             Exercice
//                           </Label>
//                           <Select
//                             value={ex.exercise}
//                             onValueChange={(value) =>
//                               handleExerciseChange(idx, value)
//                             }
//                             disabled={loading || !ex.lesson}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Sélectionner un exercice" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {(ex.lesson
//                                 ? exercisesByLesson[ex.lesson] || []
//                                 : []
//                               ).map((exercise) => (
//                                 <SelectItem
//                                   key={exercise._id}
//                                   value={exercise._id}
//                                 >
//                                   {exercise.title}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       {selectedExercise && (
//                         <div className="mt-4">
//                           <ExercisePreview
//                             exercise={selectedExercise}
//                             isOpen={!!openPreviews[idx]}
//                             onToggle={() => togglePreview(idx)}
//                           />
//                         </div>
//                       )}

//                       <div className="flex justify-end mt-3">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeExercise(idx)}
//                           disabled={loading || selectedExercises.length <= 1}
//                           className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                         >
//                           <Trash2 className="h-4 w-4 mr-1" />
//                           Supprimer
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>

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

//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>
//                 Erreur : {error.message || error}
//               </AlertDescription>
//             </Alert>
//           )}

//           <div className="flex gap-3">
//             <Button
//               type="button"
//               onClick={() => navigate(-1)}
//               variant="outline"
//               disabled={loading}
//               className="flex-1 bg-transparent"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Annuler
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading}
//               className="flex-1 h-11 text-base font-medium"
//             >
//               {loading ? (
//                 <div className="flex items-center">
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Enregistrement...
//                 </div>
//               ) : (
//                 <div className="flex items-center">
//                   <Save className="h-4 w-4 mr-2" />
//                   Enregistrer les modifications
//                 </div>
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default UpdateExamForm;
