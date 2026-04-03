import katex from "katex";
import "katex/dist/katex.min.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Target,
  HelpCircle,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Upload,
  ImageIcon,
  ChevronRight,
  ChevronLeft,
  Eye,
  Settings,
  ArrowLeft,
  Lightbulb,
} from "lucide-react";
import { createQuiz, getQuizByLesson, clearQuizState } from "@/store/quizSlice";

// Composant pour afficher le texte avec support KaTeX
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
          <span key={match.index} dangerouslySetInnerHTML={{ __html: html }} />,
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

const STEPS = [
  {
    id: 1,
    title: "Informations de base",
    description: "Configurer les détails du quiz",
    icon: Settings,
  },
  {
    id: 2,
    title: "Questions",
    description: "Créer les questions du quiz",
    icon: HelpCircle,
  },
  {
    id: 3,
    title: "Vérifier et soumettre",
    description: "Vérifier et enregistrer le quiz",
    icon: Eye,
  },
];

const CreateQuiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, loading, error, successMessage } = useSelector(
    (state) => state.quiz,
  );

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
    timeLimit: 600,
    passingScore: 75,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingQuizDetected, setExistingQuizDetected] = useState(false);
  const [detectedQuizId, setDetectedQuizId] = useState(null);

  // Generate unique ID for new questions
  const generateQuestionId = useCallback(() => {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Clear state on component mount and unmount
  useEffect(() => {
    dispatch(clearQuizState());
    return () => {
      dispatch(clearQuizState());
    };
  }, [dispatch]);

  // Check for existing quiz
  useEffect(() => {
    if (lessonId) {
      dispatch(getQuizByLesson(lessonId));
    }
  }, [dispatch, lessonId]);

  // Handle existing quiz detection
  useEffect(() => {
    if (currentQuiz && lessonId) {
      const quizData = Array.isArray(currentQuiz)
        ? currentQuiz[0]
        : currentQuiz;
      if (quizData && quizData._id) {
        setExistingQuizDetected(true);
        setDetectedQuizId(quizData._id);
        populateFormWithQuizData(quizData);
      } else {
        initializeEmptyForm();
      }
    } else if (!loading) {
      initializeEmptyForm();
    }
  }, [currentQuiz, lessonId, loading]);

  const initializeEmptyForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      questions: [
        {
          id: generateQuestionId(),
          questionText: "",
          hint: "",
          options: [
            { text: "", rationale: "" },
            { text: "", rationale: "" },
            { text: "", rationale: "" },
            { text: "", rationale: "" },
          ],
          correctAnswer: "",
        },
      ],
      timeLimit: 600,
      passingScore: 75,
    });
    setCompletedSteps(new Set());
    setCurrentStep(1);
  }, [generateQuestionId]);

  const populateFormWithQuizData = useCallback((quizData) => {
    setFormData({
      title: quizData.title || "",
      description: quizData.description || "",
      questions:
        quizData.questions?.map((q, index) => ({
          id: q._id || `existing_${index}`,
          questionText: q.questionText || "",
          hint: q.hint || "",
          options: q.options?.length
            ? q.options.map((opt) => ({
                text: opt.text || "",
                rationale: opt.rationale || "",
              }))
            : [
                { text: "", rationale: "" },
                { text: "", rationale: "" },
                { text: "", rationale: "" },
                { text: "", rationale: "" },
              ],
          correctAnswer: q.correctAnswer || "",
        })) || [],
      timeLimit: quizData.timeLimit || 600,
      passingScore: quizData.passingScore || 75,
    });
  }, []);

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const validateStep = useCallback(
    (step) => {
      const errors = {};

      if (step === 1) {
        if (!formData.title.trim()) {
          errors.title = "Le titre est requis";
        }
        if (!formData.description.trim()) {
          errors.description = "La description est requise";
        }
        if (formData.timeLimit <= 0) {
          errors.timeLimit = "La limite de temps doit être supérieure à 0";
        }
        if (formData.passingScore <= 0 || formData.passingScore > 100) {
          errors.passingScore =
            "Le score de passage doit être compris entre 1 et 100";
        }
      }

      if (step === 2) {
        if (formData.questions.length === 0) {
          errors.questions = "Au moins une question est requise";
        } else {
          formData.questions.forEach((question, index) => {
            if (!question.questionText?.trim()) {
              errors[`question_${index}`] =
                "Le texte de la question est requis";
            }

            if (!question.correctAnswer?.trim()) {
              errors[`correctAnswer_${index}`] = "La bonne réponse est requise";
            }

            // Validation des options (nouveau format)
            if (question.options && question.options.length > 0) {
              const optionTexts = question.options.map(
                (option) => option.text?.trim() || "",
              );

              if (optionTexts.some((text) => !text)) {
                errors[`options_${index}`] =
                  "Toutes les options doivent être remplies";
              }

              if (question.options.length < 2) {
                errors[`options_${index}`] = "Au moins 2 options sont requises";
              }

              if (!optionTexts.includes(question.correctAnswer?.trim())) {
                errors[`correctAnswer_${index}`] =
                  "La bonne réponse doit correspondre à l'une des options remplies";
              }
            }
          });
        }
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [formData],
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
    [currentStep, completedSteps],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateStep(1) || !validateStep(2)) return;

      setIsSubmitting(true);

      try {
        const quizData = {
          lessonId,
          title: formData.title.trim(),
          description: formData.description.trim(),
          timeLimit: Number(formData.timeLimit),
          passingScore: Number(formData.passingScore),
          questions: formData.questions.map((question) => ({
            questionText: question.questionText.trim(),
            hint: question.hint?.trim() || undefined,
            options: question.options.map((option) => ({
              text: option.text.trim(),
              rationale: option.rationale?.trim() || undefined,
            })),
            correctAnswer: question.correctAnswer.trim(),
          })),
        };

        await dispatch(createQuiz(quizData)).unwrap();
        if (successMessage) {
          setFormErrors({ success: "Quiz créé avec succès !" });
          setTimeout(() => {
            dispatch(clearQuizState());
            navigate("/lessons");
          }, 1500);
        }
      } catch (err) {
        console.error("Erreur lors de la création du quiz :", err);
        setFormErrors({
          submit:
            err.message || "Échec de la création du quiz. Veuillez réessayer.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, lessonId, dispatch],
  );

  const handleCancel = useCallback(() => {
    dispatch(clearQuizState());
    navigate("/lessons");
  }, [dispatch, navigate]);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [formErrors],
  );

  const handleQuestionChange = useCallback(
    (qIndex, field, value) => {
      const newQuestions = [...formData.questions];
      newQuestions[qIndex][field] = value;
      setFormData((prev) => ({ ...prev, questions: newQuestions }));
    },
    [formData.questions],
  );

  const handleOptionChange = useCallback(
    (qIndex, optIndex, field, value) => {
      const newQuestions = [...formData.questions];
      newQuestions[qIndex].options[optIndex][field] = value;
      setFormData((prev) => ({ ...prev, questions: newQuestions }));
    },
    [formData.questions],
  );

  const addOption = useCallback(
    (qIndex) => {
      const newQuestions = [...formData.questions];
      newQuestions[qIndex].options.push({ text: "", rationale: "" });
      setFormData((prev) => ({ ...prev, questions: newQuestions }));
    },
    [formData.questions],
  );

  const removeOption = useCallback(
    (qIndex, optIndex) => {
      const newQuestions = [...formData.questions];
      if (newQuestions[qIndex].options.length > 2) {
        newQuestions[qIndex].options.splice(optIndex, 1);
        setFormData((prev) => ({ ...prev, questions: newQuestions }));
      }
    },
    [formData.questions],
  );

  const addQuestion = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: generateQuestionId(),
          questionText: "",
          hint: "",
          options: [
            { text: "", rationale: "" },
            { text: "", rationale: "" },
            { text: "", rationale: "" },
            { text: "", rationale: "" },
          ],
          correctAnswer: "",
        },
      ],
    }));
  }, [generateQuestionId]);

  const removeQuestion = useCallback(
    (index) => {
      const newQuestions = [...formData.questions];
      newQuestions.splice(index, 1);
      setFormData((prev) => ({ ...prev, questions: newQuestions }));
    },
    [formData.questions],
  );

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const items = Array.from(formData.questions);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setFormData((prev) => ({ ...prev, questions: items }));
    },
    [formData.questions],
  );

  const memoizedQuestions = useMemo(
    () => formData.questions,
    [formData.questions],
  );

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Chargement...</div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Informations de base du quiz</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du quiz *</Label>
                  <Input
                    dir={getDirection(formData.title)}
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={formErrors.title ? "border-red-500" : ""}
                    placeholder="Saisir le titre du quiz"
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
                    <span>Limite de temps (secondes) *</span>
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) =>
                      handleInputChange(
                        "timeLimit",
                        Number.parseInt(e.target.value, 10) || 0,
                      )
                    }
                    className={formErrors.timeLimit ? "border-red-500" : ""}
                    min="1"
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
                    htmlFor="passingScore"
                    className="flex items-center space-x-1"
                  >
                    <Target className="h-4 w-4" />
                    <span>Score de passage (%) *</span>
                  </Label>
                  <Input
                    id="passingScore"
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) =>
                      handleInputChange(
                        "passingScore",
                        Number.parseInt(e.target.value, 10) || 0,
                      )
                    }
                    className={formErrors.passingScore ? "border-red-500" : ""}
                    min="1"
                    max="100"
                    placeholder="75"
                  />
                  {formErrors.passingScore && (
                    <p className="text-red-500 text-sm">
                      {formErrors.passingScore}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  dir={getDirection(formData.title)}
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className={formErrors.description ? "border-red-500" : ""}
                  placeholder="Saisir la description du quiz"
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
                  <span>Questions ({formData.questions.length})</span>
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              {formErrors.questions && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{formErrors.questions}</AlertDescription>
                </Alert>
              )}

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-6"
                    >
                      {memoizedQuestions.map((question, qIndex) => (
                        <Draggable
                          key={question.id}
                          draggableId={question.id}
                          index={qIndex}
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
                                      Question {qIndex + 1}
                                    </Badge>
                                  </div>

                                  {formData.questions.length > 1 && (
                                    <Button
                                      type="button"
                                      onClick={() => removeQuestion(qIndex)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>

                              <CardContent className="space-y-6">
                                {/* Question Text */}
                                <div className="space-y-2">
                                  <Label>Texte de la question *</Label>
                                  <Textarea
                                    value={question.questionText}
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        qIndex,
                                        "questionText",
                                        e.target.value,
                                      )
                                    }
                                    className={
                                      formErrors[`question_${qIndex}`]
                                        ? "border-red-500"
                                        : ""
                                    }
                                    placeholder="Saisir votre question (utilisez $...$ pour les formules mathématiques)"
                                    rows={3}
                                  />
                                  {formErrors[`question_${qIndex}`] && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors[`question_${qIndex}`]}
                                    </p>
                                  )}

                                  {/* Aperçu KaTeX */}
                                  {question.questionText && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded border">
                                      <Label className="text-sm text-gray-600">
                                        Aperçu :
                                      </Label>
                                      <div className="mt-1 text-sm">
                                        <MathText
                                          text={question.questionText}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Hint */}
                                <div className="space-y-2">
                                  <Label>Indice / Hint (facultatif)</Label>
                                  <Input
                                    value={question.hint || ""}
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        qIndex,
                                        "hint",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Indice pour aider l'étudiant..."
                                  />
                                </div>
                                <Separator />

                                {/* Options */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label>Options de réponse *</Label>
                                    <Button
                                      type="button"
                                      onClick={() => addOption(qIndex)}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Ajouter une option
                                    </Button>
                                  </div>

                                  <div className="space-y-4">
                                    {question.options.map(
                                      (option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg border"
                                        >
                                          <Badge
                                            variant="outline"
                                            className="mt-3 min-w-[2rem] justify-center"
                                          >
                                            {String.fromCharCode(65 + optIndex)}
                                          </Badge>

                                          <div className="flex-1 space-y-3">
                                            {/* Texte de l'option */}
                                            <div>
                                              <Label className="text-sm">
                                                Texte de l'option
                                              </Label>
                                              <Input
                                                value={option.text}
                                                onChange={(e) =>
                                                  handleOptionChange(
                                                    qIndex,
                                                    optIndex,
                                                    "text",
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder={`Option ${optIndex + 1} (utilisez $...$ pour les formules)`}
                                              />
                                              {option.text && (
                                                <div className="mt-1 text-xs text-gray-600">
                                                  <MathText
                                                    text={option.text}
                                                  />
                                                </div>
                                              )}
                                            </div>

                                            {/* Rationale / Explication */}
                                            <div>
                                              <Label className="text-sm">
                                                Explication (Rationale)
                                              </Label>
                                              <Textarea
                                                value={option.rationale || ""}
                                                onChange={(e) =>
                                                  handleOptionChange(
                                                    qIndex,
                                                    optIndex,
                                                    "rationale",
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder="Pourquoi cette option est-elle correcte ou incorrecte ? (facultatif)"
                                                rows={2}
                                              />
                                            </div>
                                          </div>

                                          {/* Bouton supprimer */}
                                          {question.options.length > 2 && (
                                            <Button
                                              type="button"
                                              onClick={() =>
                                                removeOption(qIndex, optIndex)
                                              }
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-500 hover:text-red-700 mt-8"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </div>

                                  {formErrors[`options_${qIndex}`] && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors[`options_${qIndex}`]}
                                    </p>
                                  )}
                                </div>

                                {/* Correct Answer */}
                                <div className="space-y-2">
                                  <Label>Bonne réponse *</Label>
                                  <Select
                                    value={question.correctAnswer}
                                    onValueChange={(value) =>
                                      handleQuestionChange(
                                        qIndex,
                                        "correctAnswer",
                                        value,
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      className={
                                        formErrors[`correctAnswer_${qIndex}`]
                                          ? "border-red-500"
                                          : ""
                                      }
                                    >
                                      <SelectValue placeholder="Sélectionner la bonne réponse" />
                                    </SelectTrigger>

                                    <SelectContent>
                                      {question.options
                                        .filter(
                                          (opt) =>
                                            opt.text && opt.text.trim() !== "",
                                        ) // ← Correction importante
                                        .map((option, optIndex) => (
                                          <SelectItem
                                            key={optIndex}
                                            value={option.text}
                                          >
                                            <span className="mr-2 font-mono">
                                              {String.fromCharCode(
                                                65 + optIndex,
                                              )}
                                              .
                                            </span>
                                            <MathText text={option.text} />
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>

                                  {formErrors[`correctAnswer_${qIndex}`] && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors[`correctAnswer_${qIndex}`]}
                                    </p>
                                  )}
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

            <CardFooter>
              <Button
                type="button"
                onClick={addQuestion}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une question
              </Button>
            </CardFooter>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Vérifier le quiz</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Quiz Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{formData.title}</h3>
                <p className="text-gray-600">
                  {" "}
                  <MathText text={formData.description} />
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formData.timeLimit} secondes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{formData.passingScore}% score de passage</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>{formData.questions.length} questions</span>
                  </div>
                </div>
              </div>

              {/* Questions Preview */}
              <div className="space-y-6">
                <h4 className="font-semibold text-lg">Aperçu des questions</h4>

                {formData.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border rounded-xl p-5 space-y-4 bg-white"
                  >
                    {/* En-tête question */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="outline"
                          className="text-base px-3 py-1"
                        >
                          Q{index + 1}
                        </Badge>
                        <Badge variant="secondary">Question</Badge>
                      </div>
                      {question.hint && (
                        <div className="text-xs text-amber-600 flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          Indice disponible
                        </div>
                      )}
                    </div>

                    {/* Texte de la question */}
                    <div className="font-medium text-lg leading-relaxed">
                      <MathText text={question.questionText} />
                    </div>

                    {/* Pièce jointe si présente */}
                    {question.attachment && (
                      <div className="my-3">
                        <img
                          src={
                            typeof question.attachment === "string"
                              ? question.attachment
                              : URL.createObjectURL(question.attachment)
                          }
                          alt="Pièce jointe"
                          className="max-w-md rounded-lg border"
                        />
                      </div>
                    )}

                    {/* Options */}
                    <div className="space-y-3">
                      <Label className="text-sm text-gray-500">
                        Options de réponse
                      </Label>
                      {question.options.map((option, optIndex) => {
                        const isCorrect =
                          option.text === question.correctAnswer;
                        return (
                          <div
                            key={optIndex}
                            className={`p-4 rounded-lg border text-sm transition-all ${
                              isCorrect
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="font-mono text-base mt-0.5">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <div className="flex-1">
                                <MathText text={option.text} />
                              </div>
                              {isCorrect && (
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>

                            {/* Affichage du Rationale (très utile en preview) */}
                            {option.rationale && (
                              <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                                <span className="font-medium">
                                  Explication :
                                </span>{" "}
                                <MathText text={option.rationale} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Hint (si présent) */}
                    {question.hint && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
                        <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                          <Lightbulb className="h-4 w-4" />
                          Indice
                        </div>
                        <MathText text={question.hint} />
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {existingQuizDetected
                      ? `Mettre à jour le quiz existant : ${
                          formData.title || "Chargement..."
                        }`
                      : "Créer un nouveau quiz"}
                  </CardTitle>
                </div>
                {existingQuizDetected && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Quiz existant détecté
                  </Badge>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <p className="text-gray-600">
                    Étape {currentStep} sur {STEPS.length} :{" "}
                    {STEPS[currentStep - 1]?.description}
                  </p>
                  <span>{Math.round(progressPercentage)}% Terminé</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />

                {/* Steps Navigation */}
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
                handleSubmit(e);
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
                        Précédent
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                    >
                      Annuler
                    </Button>
                  </div>

                  <div className="flex space-x-3">
                    {currentStep < STEPS.length ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Création en cours...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Créer le quiz
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

export default CreateQuiz;
