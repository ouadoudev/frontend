import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import {
  updateQuiz,
  getQuizByLesson,
  deleteQuiz,
  clearQuizState,
} from "@/store/quizSlice";

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

const UpdateQuiz = () => {
  const { lessonId, quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, loading, error, successMessage } = useSelector(
    (state) => state.quiz
  );

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
    timeLimit: 10,
    passingScore: 75,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // Load quiz data for editing
  useEffect(() => {
    if (lessonId) {
      dispatch(getQuizByLesson(lessonId));
    }
  }, [dispatch, lessonId]);

  // Populate form when quiz data is loaded
  useEffect(() => {
    if (currentQuiz && lessonId) {
      const quizData = Array.isArray(currentQuiz)
        ? currentQuiz[0]
        : currentQuiz;
      if (quizData && quizData._id === quizId) {
        populateFormWithQuizData(quizData);
      }
    }
  }, [currentQuiz, quizId, lessonId]);

 const populateFormWithQuizData = useCallback((quizData) => {
    setFormData({
      title: quizData.title || "",
      description: quizData.description || "",
      questions: quizData.questions?.map((q, index) => ({
        id: q._id || `existing_${index}`,
        questionText: q.questionText || "",
        hint: q.hint || "",
        attachment: q.attachment || null,
        options: q.options?.map(opt => ({
          text: opt.text || "",
          rationale: opt.rationale || "",
        })) || [{ text: "", rationale: "" }, { text: "", rationale: "" }],
        correctAnswer: q.correctAnswer || "",
      })) || [],
      timeLimit: quizData.timeLimit ? Math.round(quizData.timeLimit / 60) : 10,
      passingScore: quizData.passingScore || 75,
    });
  }, []);

 const validateStep = useCallback((step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.title.trim()) errors.title = "Le titre est requis";
      if (!formData.description.trim()) errors.description = "La description est requise";
      if (formData.timeLimit <= 0) errors.timeLimit = "La limite de temps doit être supérieure à 0";
      if (formData.passingScore <= 0 || formData.passingScore > 100)
        errors.passingScore = "Le score de passage doit être entre 1 et 100";
    }

    if (step === 2) {
      formData.questions.forEach((question, index) => {
        if (!question.questionText.trim())
          errors[`question_${index}`] = "Le texte de la question est requis";

        if (!question.correctAnswer?.trim())
          errors[`correctAnswer_${index}`] = "La bonne réponse est requise";

        const optionTexts = question.options.map(opt => opt.text?.trim());

        if (optionTexts.some(text => !text))
          errors[`options_${index}`] = "Toutes les options doivent être remplies";

        if (question.options.length < 2)
          errors[`options_${index}`] = "Au moins 2 options sont requises";

        if (!optionTexts.includes(question.correctAnswer?.trim()))
          errors[`correctAnswer_${index}`] = "La bonne réponse doit correspondre à une option";
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

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

 const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    setIsSubmitting(true);

    try {
      const quizData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        timeLimit: Number(formData.timeLimit) * 60,
        passingScore: Number(formData.passingScore),
        questions: formData.questions.map(question => ({
          questionText: question.questionText.trim(),
          hint: question.hint?.trim() || undefined,
          attachment: question.attachment || undefined,
          options: question.options.map(opt => ({
            text: opt.text.trim(),
            rationale: opt.rationale?.trim() || undefined,
          })),
          correctAnswer: question.correctAnswer.trim(),
        })),
      };

      await dispatch(updateQuiz({ quizId, quizData })).unwrap();
      // success handling...
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateStep, quizId, dispatch]);

  const handleDelete = useCallback(async () => {
    if (!quizId) return;
    setIsSubmitting(true);
    try {
      await dispatch(deleteQuiz(quizId)).unwrap();
      dispatch(clearQuizState());
      navigate("/lessons");
    } catch (err) {
      console.error("Erreur lors de la suppression du quiz :", err);
      setFormErrors({
        submit: err.message || "Échec de la suppression du quiz",
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  }, [quizId, dispatch, navigate]);

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
    [formErrors]
  );

 const handleQuestionChange = useCallback((qIndex, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex][field] = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  }, [formData.questions]);

  const handleOptionChange = useCallback((qIndex, optIndex, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[optIndex][field] = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  }, [formData.questions]);

  const addOption = useCallback((qIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options.push({ text: "", rationale: "" });
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  }, [formData.questions]);

  const removeOption = useCallback((qIndex, optIndex) => {
    const newQuestions = [...formData.questions];
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options.splice(optIndex, 1);
      setFormData(prev => ({ ...prev, questions: newQuestions }));
    }
  }, [formData.questions]);

  const addQuestion = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: generateQuestionId(),
          questionText: "",
          hint: "",
          attachment: null,
          options: [{ text: "", rationale: "" }, { text: "", rationale: "" }],
          correctAnswer: "",
        },
      ],
    }));
  }, [generateQuestionId]);

  const removeQuestion = useCallback((index) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  }, [formData.questions]);

  const handleAttachmentChange = useCallback((qIndex, file) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].attachment = file ? URL.createObjectURL(file) : null;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  }, [formData.questions]);

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const items = Array.from(formData.questions);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setFormData((prev) => ({ ...prev, questions: items }));
    },
    [formData.questions]
  );

  const memoizedQuestions = useMemo(
    () => formData.questions,
    [formData.questions]
  );

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  if (loading && !currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">
            Chargement des données du quiz...
          </div>
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
                    <span>Limite de temps (minutes) *</span>
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) =>
                      handleInputChange(
                        "timeLimit",
                        Number.parseInt(e.target.value, 10) || 0
                      )
                    }
                    className={formErrors.timeLimit ? "border-red-500" : ""}
                    min="1"
                    placeholder="10"
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
                        Number.parseInt(e.target.value, 10) || 0
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
                <Button
                  type="button"
                  onClick={addQuestion}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une question
                </Button>
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
                      className="space-y-4"
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
                              <CardContent className="space-y-4">
                                {/* Question Type */}
                                <div className="space-y-2">
                                  <Label>Type de question *</Label>
                                  <Select
                                    value={question.questionType}
                                    onValueChange={(value) =>
                                      handleQuestionChange(
                                        qIndex,
                                        "questionType",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple-choice">
                                        Choix multiple
                                      </SelectItem>
                                      <SelectItem value="true-false">
                                        Vrai/Faux
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {/* Question Text */}
                                <div className="space-y-2">
                                  <Label>Texte de la question *</Label>
                                  <Textarea
                                    value={question.questionText}
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        qIndex,
                                        "questionText",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      formErrors[`question_${qIndex}`]
                                        ? "border-red-500"
                                        : ""
                                    }
                                    placeholder="Saisir votre question"
                                    rows={2}
                                  />
                                  {formErrors[`question_${qIndex}`] && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors[`question_${qIndex}`]}
                                    </p>
                                  )}

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

                                <div>
                            <Label>Indice (facultatif)</Label>
                            <Input
                              value={question.hint || ""}
                              onChange={(e) => handleQuestionChange(qIndex, "hint", e.target.value)}
                              placeholder="Indice pour aider l'apprenant..."
                            />
                          </div>
                                {/* Question Attachment */}
                                <div className="space-y-2">
                                  <Label className="flex items-center space-x-1">
                                    <ImageIcon className="h-4 w-4" />
                                    <span>
                                      Pièce jointe à la question (facultatif)
                                    </span>
                                  </Label>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleAttachmentChange(
                                          qIndex,
                                          e.target.files[0]
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Upload className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {question.attachment && (
                                    <div className="mt-2">
                                      <img
                                        src={
                                          question.attachment ||
                                          "/placeholder.svg"
                                        }
                                        alt="Pièce jointe à la question"
                                        className="max-w-xs h-auto rounded border"
                                      />
                                    </div>
                                  )}
                                </div>
                                <Separator />
                                {/* Options */}
                                {question.questionType === "true-false" ? (
                                  <div className="space-y-2">
                                    <Label>Options</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Input
                                        value="Vrai"
                                        disabled
                                        className="bg-gray-50"
                                      />
                                      <Input
                                        value="Faux"
                                        disabled
                                        className="bg-gray-50"
                                      />
                                    </div>
                                  </div>
                                ) : (
                               <div className="space-y-4">
                            <div className="flex justify-between">
                              <Label>Options de réponse *</Label>
                              <Button type="button" variant="outline" size="sm" onClick={() => addOption(qIndex)}>
                                <Plus className="mr-1 h-4 w-4" /> Ajouter
                              </Button>
                            </div>

                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex gap-4 bg-gray-50 p-4 rounded-xl">
                                <Badge className="mt-3">{String.fromCharCode(65 + optIndex)}</Badge>
                                <div className="flex-1 space-y-3">
                                  <Input
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(qIndex, optIndex, "text", e.target.value)}
                                    placeholder="Texte de l'option"
                                  />
                                  <Textarea
                                    value={option.rationale || ""}
                                    onChange={(e) => handleOptionChange(qIndex, optIndex, "rationale", e.target.value)}
                                    placeholder="Explication / Rationale (visible après réponse)"
                                    rows={2}
                                  />
                                </div>
                                {question.options.length > 2 && (
                                  <Button variant="ghost" size="sm" onClick={() => removeOption(qIndex, optIndex)} className="text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                                )}
                                {/* Correct Answer */}
                                <div className="space-y-2">
                                  <Label>Bonne réponse *</Label>
                                  <Select
                                    value={question.correctAnswer}
                                    onValueChange={(value) =>
                                      handleQuestionChange(
                                        qIndex,
                                        "correctAnswer",
                                        value
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
    .filter((opt) => opt && opt.text && opt.text.trim() !== "") 
    .map((opt, optIndex) => (
      <SelectItem 
        key={optIndex} 
        value={opt.text} // On utilise la chaîne de caractères, pas l'objet
      >
        <div className="flex items-center">
          {question.questionType !== "true-false" && (
            <span className="mr-2 font-mono text-xs text-muted-foreground">
              {String.fromCharCode(65 + optIndex)}.
            </span>
          )}
          {/* CRUCIAL : On affiche opt.text, pas opt tout court */}
          <span>{opt.text}</span> 
        </div>
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
                <p className="text-gray-600">{formData.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formData.timeLimit} minutes</span>
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
              <div className="space-y-4">
                <h4 className="font-semibold">Aperçu des questions</h4>
                {formData.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Badge variant="secondary">
                        {question.questionType === "multiple-choice"
                          ? "Choix multiple"
                          : question.questionType === "true-false"
                          ? "Vrai/Faux"
                          : question.questionType}
                      </Badge>
                    </div>
                    <p className="font-medium"> <MathText text={question.questionText} /></p>
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`text-sm p-2 rounded ${
                            option === question.correctAnswer
                              ? "bg-green-100 text-green-800 font-medium"
                              : "bg-gray-50"
                          }`}
                        >
                          {question.questionType !== "true-false" && (
                            <span className="mr-2 font-mono">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                          )}
                          <MathText text={option.text} />
                          {option === question.correctAnswer && (
                            <CheckCircle className="inline h-4 w-4 ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/lessons")}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux leçons</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Modifier le quiz : {formData.title || "Chargement..."}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Étape {currentStep} sur {STEPS.length} :{" "}
                    {STEPS[currentStep - 1]?.description}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Progression</span>
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
                    <Button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer le quiz
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
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Mettre à jour le quiz
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-md w-full mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Confirmer la suppression</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action
                    est irréversible et supprimera toutes les données associées.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      variant="destructive"
                    >
                      {isSubmitting ? "Suppression..." : "Supprimer"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default UpdateQuiz;
