import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchExerciseById,
  fetchUserScore,
  submitExercise,
} from "@/store/exerciseSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home,
  Info,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AnimatedBackground from "@/components/AnimatedBackground";
import katex from "katex";
import "katex/dist/katex.min.css";

const MathText = ({ text, dir = "ltr", className = "" }) => {
  if (!text) return null;

  const renderWithKaTeX = (content) => {
    const latexRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = latexRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const latexContent = match[1] || match[2];
      const isDisplayMode = match[1] !== undefined;

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

const translations = {
  ar: {
    enterAnswer: "أدخل إجابتك هنا",
    selectMatch: "اختر التطابق",
    error: "خطأ",
    maxAttemptsReached: "تم الوصول إلى الحد الأقصى للمحاولات",
    maxAttemptsDesc: "لقد وصلت إلى الحد الأقصى للمحاولات (%d) لهذا التمرين.",
    question: "السؤال %d من %d",
    previous: "السابق",
    next: "التالي",
    submit: "إرسال جميع الإجابات",
    submitting: "جارٍ الإرسال...",
    goToPrevious: "الانتقال إلى السؤال السابق",
    goToNext: "الانتقال إلى السؤال التالي",
    submitForGrading: "إرسال إجاباتك للتصحيح",
    submissionResult: "نتيجة الإرسال",
    pointsWord: "نقاط",
    pointsOutOf: "من أصل %d نقاط ممكنة",
    attempts: "المحاولات :",
    retake: "إعادة المحاولة",
    goBack: "العودة",
    startAgain: "بدء التمرين من جديد",
    returnToPreviousPage: "العودة إلى الصفحة السابقة",
    submissionFailed: "فشل الإرسال! الرجاء المحاولة مرة أخرى.",
    element: "عنصر",
    yourScore: "أعلى نتيجة لك",
    highestScore: "أعلى نتيجة",
    correctAnswer: "الإجابات الصحيحة",
    examMode: "وضع الامتحان",
    examModeDesc: "الإجابات الصحيحة مخفية حاليًا لأن هذا تمرين بصيغة امتحان.",
    answersComparison: "مقارنة الإجابات",
    yourAnswer: "إجابتك:",
    correctAnswerLabel: "الإجابة الصحيحة:",
    noAnswer: "لا توجد إجابة مسجلة",
  },
  fr: {
    enterAnswer: "Entrez votre réponse ici",
    selectMatch: "Sélectionner une correspondance",
    error: "Erreur",
    maxAttemptsReached: "Nombre maximum de tentatives atteint",
    maxAttemptsDesc: "Vous avez atteint le nombre maximum de tentatives (%d) pour cet exercice.",
    question: "Question %d sur %d",
    previous: "Précédent",
    next: "Suivant",
    submit: "Soumettre toutes les réponses",
    submitting: "Soumission en cours...",
    goToPrevious: "Aller à la question précédente",
    goToNext: "Aller à la question suivante",
    submitForGrading: "Soumettre vos réponses pour correction",
    submissionResult: "Résultat de la soumission",
    pointsWord: "points",
    pointsOutOf: "sur %d points possibles",
    attempts: "Tentatives :",
    retake: "Recommencer",
    goBack: "Retour",
    startAgain: "Recommencer l'exercice",
    returnToPreviousPage: "Retourner à la page précédente",
    submissionFailed: "Échec de la soumission ! Veuillez réessayer.",
    element: "Élément",
    yourScore: "Votre meilleur score",
    highestScore: "Meilleur score",
    correctAnswer: "Réponses correctes",
    examMode: "Mode Examen",
    examModeDesc: "Les réponses correctes sont masquées car il s'agit d'un examen.",
    answersComparison: "Comparaison des réponses",
    yourAnswer: "Votre réponse :",
    correctAnswerLabel: "Réponse correcte :",
    noAnswer: "Aucune réponse enregistrée",
  },
};

const ExerciseSubmit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { exercise, loading, error } = useSelector((state) => state.exercises);
  const user = useSelector((state) => state.auth.user);

  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchExerciseById(id));
    setStartTime(new Date().toISOString());
  }, [dispatch, id]);

  useEffect(() => {
    if (exercise && user) {
      dispatch(fetchUserScore({ userId: user.id, exerciseId: exercise._id }))
        .unwrap()
        .then((result) => {
          if (result && result.score) {
            setScore(result.score);
            if (result.score.attempts >= exercise.maxAttempts) {
              setMaxAttemptsReached(true);
            }
          } else {
            setMaxAttemptsReached(false);
            setScore(null);
          }
        })
        .catch((error) => console.error("Error fetching user score:", error));
    }
  }, [exercise, user, dispatch]);

  useEffect(() => {
    if (exercise && exercise.timeLimit && !maxAttemptsReached) {
      const timer = setInterval(() => {
        const now = new Date();
        const end = new Date(startTime);
        end.setSeconds(end.getSeconds() + exercise.timeLimit);
        const remaining = Math.max(0, Math.floor((end - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          clearInterval(timer);
          if (!maxAttemptsReached) handleSubmit();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [exercise, startTime, maxAttemptsReached]);

  const getDirection = (text) => {
    if (!text) return "ltr";
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const isRTL = exercise ? getDirection(exercise.title) === "rtl" : false;
  const t = isRTL ? translations.ar : translations.fr;
  const flexDir = isRTL ? "flex-row-reverse" : "flex-row";

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  // -------------------------------------------------------------
  // FORMATTING HELPERS FOR THE COMPARISON
  // -------------------------------------------------------------
  const formatUserAnswer = (q, ans) => {
    if (ans === undefined || ans === null || ans === "") {
      return <span className="text-gray-400 italic">{t.noAnswer}</span>;
    }
    switch (q.type) {
      case "multiple-choice":
      case "short-answer":
        return ans;
      case "fill-in-the-blank":
        return (Array.isArray(ans) ? ans : []).map(a => a || "___").join(" | ");
      case "drag-and-drop":
        return (Array.isArray(ans) ? ans : []).join(" ➔ ");
      case "matching":
        return (Array.isArray(ans) ? ans : [])
          .filter(p => p.definition)
          .map(p => `${p.term} ➔ ${p.definition}`)
          .join(" | ");
      case "table-completion":
        let res = [];
        if (Array.isArray(ans)) {
          ans.forEach((row, rIdx) => {
            row.forEach((col, cIdx) => {
              if (col && col.trim() !== "") {
                res.push(`Ligne ${rIdx + 1}, Col ${cIdx + 1}: ${col}`);
              }
            });
          });
        }
        return res.length > 0 ? res.join(" | ") : <span className="text-gray-400 italic">{t.noAnswer}</span>;
      default:
        return String(ans);
    }
  };

  const formatCorrectAnswer = (q) => {
    switch (q.type) {
      case "multiple-choice":
        return (q.correctAnswers || []).map((idx) => q.options[parseInt(idx)]).join(" | ");
      case "short-answer":
      case "fill-in-the-blank":
        return (q.correctAnswers || []).join(" | ");
      case "matching":
        return (q.matching?.pairs || []).map((p) => `${p.term} ➔ ${p.definition}`).join(" | ");
      case "drag-and-drop":
        return (q.dragAndDrop?.correctOrder || []).join(" ➔ ");
      case "table-completion":
        return (q.tableCompletion?.cellCorrections || [])
          .map((c) => `Ligne ${c.rowIndex + 1}, Col ${c.columnIndex + 1}: ${c.correctionText}`)
          .join(" | ");
      default:
        return "";
    }
  };

  const renderComparisonSection = () => {
    if (!exercise) return null;

    return (
      <div className="mt-6 w-full">
        <h3 className="text-xl font-bold mb-4" dir={isRTL ? "rtl" : "ltr"}>{t.answersComparison}</h3>
        {exercise.forExam ? (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800" dir={isRTL ? "rtl" : "ltr"}>
            <Info className="inline-block w-5 h-5 mr-2" />
            {t.examModeDesc}
          </div>
        ) : (
          <div className="space-y-4">
            {exercise.questions.map((q, idx) => {
              const uAns = userAnswers[q._id];
              return (
                <div key={q._id} className="p-4 border rounded-md bg-gray-50 text-left" dir={getDirection(q.questionText)}>
                  <p className="font-semibold text-gray-800 mb-3 text-sm">
                    {idx + 1}. <MathText text={q.questionText} />
                  </p>
                  
                  <div className={`flex flex-col md:flex-row gap-4 text-sm ${flexDir}`}>
                    <div className="flex-1 p-3 bg-red-50 border border-red-100 rounded-md">
                      <span className="font-semibold text-red-700 block mb-1">
                        {t.yourAnswer}
                      </span>
                      <span className="text-gray-700 break-words">
                        <MathText text={formatUserAnswer(q, uAns)} />
                      </span>
                    </div>
                    
                    <div className="flex-1 p-3 bg-green-50 border border-green-100 rounded-md">
                      <span className="font-semibold text-green-700 block mb-1">
                        {t.correctAnswerLabel}
                      </span>
                      <span className="text-gray-800 break-words">
                        <MathText text={formatCorrectAnswer(q)} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDERING THE NORMAL FORM
  // -------------------------------------------------------------
  const renderQuestion = (question) => {
    const questionDir = getDirection(question.questionText);
    const flexDir = questionDir === "rtl" ? "flex-row-reverse" : "flex-row";

    switch (question.type) {
      case "multiple-choice":
        return (
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
                <Label htmlFor={`${question._id}-${index}`} className="flex-grow cursor-pointer" dir={getDirection(option)}>
                  <MathText text={option} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "short-answer":
        return (
          <Textarea
            value={userAnswers[question._id] || ""}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder={t.enterAnswer}
            className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            dir={questionDir}
          />
        );

      case "fill-in-the-blank":
        return (
          <div className="space-y-2">
            {(question.correctAnswers || []).map((_, index) => (
              <Input
                key={index}
                value={userAnswers[question._id]?.[index] !== undefined ? userAnswers[question._id][index] : ""}
                onChange={(e) => {
                  const updatedAnswers = userAnswers[question._id] ? [...userAnswers[question._id]] : [];
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
        return (
          <div className="space-y-4" dir={questionDir}>
            {leftItems.map((term, index) => (
              <div key={index} className={`flex items-center space-x-4 ${flexDir}`}>
                <Label className="w-1/3 text-right font-medium" dir={getDirection(term)}>
                  <MathText text={term} />
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
                        <MathText text={definition} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );

      case "drag-and-drop":
        return (
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;
              const items = Array.from(userAnswers[question._id] || question.dragAndDrop.items);
              const [reorderedItem] = items.splice(result.source.index, 1);
              items.splice(result.destination.index, 0, reorderedItem);
              handleAnswerChange(question._id, items);
            }}
          >
            <Droppable droppableId={question._id}>
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2" dir={questionDir}>
                  {(userAnswers[question._id] || question.dragAndDrop.items).map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 bg-white border rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow duration-200"
                          dir={getDirection(item)}
                        >
                          <MathText text={item} />
                        </li>
                      )}
                    </Draggable>
                  ))}
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
        return (
          <div className="overflow-x-auto" dir={questionDir}>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className={`border border-gray-300 p-2 ${questionDir === "rtl" ? "text-right" : "text-left"}`}>
                    {t.element}
                  </th>
                  {columns.map((header, index) => (
                    <th key={index} className={`border border-gray-300 p-2 ${questionDir === "rtl" ? "text-right" : "text-left"}`} dir={getDirection(header)}>
                      <MathText text={header} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((rowLabel, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className={`border border-gray-300 p-2 font-medium ${questionDir === "rtl" ? "text-right" : "text-left"}`} dir={getDirection(rowLabel)}>
                      <MathText text={rowLabel} />
                    </td>
                    {columns.map((_, colIndex) => {
                      const cell = cells.find((c) => c.rowIndex === rowIndex && c.columnIndex === colIndex);
                      const cellText = cell?.text || "";
                      const isCellTextNonEmpty = cellText.trim() !== "";
                      const inputValue = isCellTextNonEmpty ? cellText : userAnswers[question._id]?.[rowIndex]?.[colIndex] || "";

                      return (
                        <td key={colIndex} className="border border-gray-300 p-2">
                          <Input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                              if (!isCellTextNonEmpty) {
                                const newAnswers = [...(userAnswers[question._id] || [])];
                                if (!newAnswers[rowIndex]) newAnswers[rowIndex] = Array(columns.length).fill("");
                                newAnswers[rowIndex][colIndex] = e.target.value;
                                handleAnswerChange(question._id, newAnswers);
                              }
                            }}
                            disabled={isCellTextNonEmpty}
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

  const handleSubmit = async () => {
    if (!exercise || !user) return;
    setIsSubmitting(true);
    try {
      const userScoreResult = await dispatch(fetchUserScore({ userId: user.id, exerciseId: exercise._id })).unwrap();

      if (userScoreResult.score && userScoreResult.score.attempts >= exercise.maxAttempts) {
        setSubmissionResult({
          error: true,
          message: t.maxAttemptsDesc.replace("%d", exercise.maxAttempts),
          maxAttempts: exercise.maxAttempts,
          attempts: userScoreResult.score.attempts,
        });
        setShowDialog(true);
        setMaxAttemptsReached(true);
        return;
      }

      const formattedAnswers = exercise.questions.map((question) => {
        const answer = userAnswers[question._id];
        if (question.type === "table-completion") {
          const tableAnswers = [];
          question.tableCompletion.rows.forEach((_, rowIndex) => {
            question.tableCompletion.columns.forEach((_, colIndex) => {
              tableAnswers.push({ rowIndex, columnIndex: colIndex, text: answer?.[rowIndex]?.[colIndex] || "" });
            });
          });
          return tableAnswers;
        }
        return answer;
      });

      const submissionData = { userAnswers: formattedAnswers, userId: user.id, startTime };
      const result = await dispatch(submitExercise({ id: exercise._id, ...submissionData })).unwrap();
      
      setSubmissionResult(result);
      setShowDialog(true);

      if (result.attempts >= exercise.maxAttempts) {
        setMaxAttemptsReached(true);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmissionResult({ error: true, message: err.message || t.submissionFailed });
      setShowDialog(true);
    } finally {
      setIsSubmitting(false);
      setTimeRemaining(null);
    }
  };

  const questions = exercise?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const timerColor = timeRemaining && timeRemaining < exercise?.timeLimit * 0.1 ? "text-red-500" : "text-gray-500";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50" dir={isRTL ? "rtl" : "ltr"}>
      <AnimatedBackground />
      <div className="z-50 container mx-auto p-4 max-w-4xl my-10">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white relative">
            <CardTitle className="text-2xl" dir={getDirection(exercise?.title)}>
              <MathText text={exercise?.title} />
            </CardTitle>
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1">
                <CardDescription className="text-gray-100 mt-2" dir={getDirection(exercise?.description)}>
                  <MathText text={exercise?.description} />
                </CardDescription>
              </div>
              {exercise?.attachment?.file && (
                <div className="flex-shrink-0 w-full md:w-2/5">
                  {exercise.attachment.file.mimetype.startsWith("image/") && (
                    <img src={exercise.attachment.file.url} alt="Attachment" className="rounded-md max-w-full h-auto bg-white/20 p-1" />
                  )}
                  {exercise.attachment.file.mimetype.startsWith("audio/") && (
                    <audio controls className="w-full mt-2">
                      <source src={exercise.attachment.file.url} type={exercise.attachment.file.mimetype} />
                    </audio>
                  )}
                  {(exercise.attachment.file.mimetype === "application/pdf" || exercise.attachment.file.mimetype.startsWith("application/")) && (
                    <a href={exercise.attachment.file.url} download className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2">
                      Download {exercise.attachment.file.originalname}
                    </a>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          {loading && (
            <CardContent className="flex flex-col space-y-2 mt-4">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          )}

          {error && (
            <CardContent className="mt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle dir={isRTL ? "rtl" : "ltr"}>{t.error}</AlertTitle>
                <AlertDescription dir={isRTL ? "rtl" : "ltr"}>{error}</AlertDescription>
              </Alert>
            </CardContent>
          )}

          {/* 
            SI MAX ATTEMPTS REACHED: 
            Affiche juste le warning et la section comparaison. (CACHE LE FORMULAIRE) 
          */}
          {maxAttemptsReached ? (
            <CardContent className="p-6">
              <Alert variant="warning" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle dir={isRTL ? "rtl" : "ltr"}>{t.maxAttemptsReached}</AlertTitle>
                <AlertDescription dir={isRTL ? "rtl" : "ltr"}>
                  {t.maxAttemptsDesc.replace("%d", exercise.maxAttempts)}
                </AlertDescription>
                {score && score.points !== undefined && (
                  <div className="mt-2 text-sm text-gray-800" dir={isRTL ? "rtl" : "ltr"}>
                    {t.yourScore}: <strong className="text-blue-600">{score.points}</strong>
                  </div>
                )}
              </Alert>

              {/* AFFICHE LA COMPARAISON ICI */}
              {renderComparisonSection()}

              {/* BOUTON RETOUR POUR QUITTER LA PAGE */}
              <div className={`mt-8 flex justify-end ${flexDir}`}>
                <Button onClick={() => navigate(-1)} variant="outline" className={`flex items-center ${flexDir}`}>
                  <Home className="mr-2 h-4 w-4" />
                  {t.goBack}
                </Button>
              </div>
            </CardContent>
          ) : (
            /* 
              SINON (PAS ATTEINT): 
              Affiche le formulaire normal avec questions
            */
            currentQuestion && (
              <>
                <CardContent className="p-6">
                  <div className={`flex items-center justify-between mb-4 ${flexDir}`}>
                    <h2 className="text-xl font-semibold" dir={isRTL ? "rtl" : "ltr"}>
                      {t.question.replace("%d", currentQuestionIndex + 1).replace("%d", questions.length)}
                    </h2>
                    <div className={`flex items-center ${flexDir} space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
                      <Clock className={`h-5 w-5 ${timerColor}`} />
                      <span className={timerColor} dir="ltr">
                        {Math.floor(timeRemaining / 60)}:
                        {(timeRemaining % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-6" />
                  
                  <div className="bg-gray-100 p-4 rounded-md mb-6" dir={getDirection(currentQuestion.questionText)}>
                    <h3 className="text-lg font-medium mb-2">
                      <MathText text={currentQuestion.questionText} />
                    </h3>
                    
                    {renderQuestion(currentQuestion)}
                  </div>
                </CardContent>
                
                <Separator />
                <CardFooter className={`flex justify-between p-4 ${flexDir}`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                          disabled={currentQuestionIndex === 0}
                          variant="outline"
                          className={`flex items-center ${flexDir}`}
                        >
                          {isRTL ? <>{t.next}<ArrowRight className="mr-2 h-4 w-4" /></> : <><ArrowLeft className="mr-2 h-4 w-4" />{t.previous}</>}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isRTL ? t.goToNext : t.goToPrevious}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {currentQuestionIndex === questions.length - 1 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={handleSubmit} 
                            className="bg-green-500 hover:bg-green-600 text-white" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className={`flex items-center ${flexDir}`}>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                {t.submitting}
                              </div>
                            ) : (
                              t.submit
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t.submitForGrading}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                            className={`flex items-center ${flexDir}`}
                          >
                            {isRTL ? <><ArrowLeft className="mr-2 h-4 w-4" />{t.previous}</> : <>{t.next}<ArrowRight className="ml-2 h-4 w-4" /></>}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isRTL ? t.goToPrevious : t.goToNext}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardFooter>
              </>
            )
          )}
        </Card>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold mb-4 text-center">{t.submissionResult}</DialogTitle>
            </DialogHeader>
            {submissionResult?.error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t.error}</AlertTitle>
                <AlertDescription>{submissionResult.message}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                
                <div className="flex flex-col items-center justify-center text-center space-y-2 mb-6">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                  
                  <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2 flex-wrap">
                    <span>{submissionResult?.pointsAwarded || 0} {t.pointsWord}</span>
                    <span className="text-lg font-medium text-gray-500">
                      {t.pointsOutOf.replace("%d", submissionResult?.totalPossiblePoints || exercise?.totalPoints || 0)}
                    </span>
                  </div>

                  {submissionResult?.highestPoints !== undefined && (
                    <div className="text-md text-blue-600 font-semibold">
                      {t.highestScore} : {submissionResult.highestPoints}
                    </div>
                  )}

                  <div className="text-md text-gray-600 font-medium">
                    {t.attempts} {submissionResult?.attempts || 1} / {submissionResult?.maxAttempts || exercise?.maxAttempts}
                  </div>
                </div>

                <Separator />
                
                {/* AFFICHE LA COMPARAISON ICI (Réutilisation de la même fonction) */}
                {renderComparisonSection()}

              </div>
            )}
            <DialogFooter className={`flex justify-between mt-4 ${flexDir}`}>
              {submissionResult?.attempts < (submissionResult?.maxAttempts || exercise?.maxAttempts) && (
                <Button
                  onClick={() => {
                    setShowDialog(false);
                    setStartTime(new Date().toISOString());
                    setUserAnswers({});
                    setCurrentQuestionIndex(0);
                  }}
                  variant="secondary"
                  className={`flex items-center ${flexDir}`}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t.retake}
                </Button>
              )}
              <Button onClick={() => navigate(-1)} variant="outline" className={`flex items-center ${flexDir}`}>
                <Home className="mr-2 h-4 w-4" />
                {t.goBack}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ExerciseSubmit;
