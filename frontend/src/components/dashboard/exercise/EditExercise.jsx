import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateExercise,
  fetchExerciseById,
  clearFetchedExercise,
  uploadAttachment,
  deleteAttachment,
  clearUploadState,
} from "@/store/exerciseSlice";
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

import katex from "katex";
import "katex/dist/katex.min.css";

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
    description: "Modifier les détails de l'exercice",
    icon: Settings,
  },
  {
    id: 2,
    title: "Questions",
    description: "Modifier les questions de l'exercice",
    icon: HelpCircle,
  },
  {
    id: 3,
    title: "Vérifier et mettre à jour",
    description: "Vérifier et enregistrer les modifications",
    icon: Eye,
  },
];

const EditExercise = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exerciseId } = useParams();

  const {
    exercise: fetchedExercise,
    loading: isReduxLoading,
    error: reduxError,
    attachment: uploadedAttachment,
  } = useSelector((state) => state.exercises);

  const fetchLoading = isReduxLoading && !fetchedExercise;

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [exercise, setExercise] = useState({
    title: "",
    description: "",
    questions: [],
    difficulty: 1,
    totalPoints: 0,
    maxAttempts: 1,
    timeLimit: 600,
    lesson: "",
    attachment: null,
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch exercise data on component mount
  useEffect(() => {
    if (exerciseId) {
      dispatch(fetchExerciseById(exerciseId));
    }
  }, [dispatch, exerciseId]);

  // Populate form when exercise data is fetched
  useEffect(() => {
    if (fetchedExercise && !isInitialized) {
      setExercise({
        title: fetchedExercise.title || "",
        description: fetchedExercise.description || "",
        questions: fetchedExercise.questions || [],
        difficulty: fetchedExercise.difficulty || 1,
        totalPoints: fetchedExercise.totalPoints || 0,
        maxAttempts: fetchedExercise.maxAttempts || 1,
        timeLimit: fetchedExercise.timeLimit || 600,
        lesson: fetchedExercise.lesson || "",
        attachment: fetchedExercise.attachment || null,
      });
      setIsInitialized(true);

      // Mark steps as completed if data exists
      if (fetchedExercise.title && fetchedExercise.description) {
        setCompletedSteps((prev) => new Set([...prev, 1]));
      }
      if (fetchedExercise.questions?.length > 0) {
        setCompletedSteps((prev) => new Set([...prev, 2]));
      }
    }
  }, [fetchedExercise, isInitialized]);

  // Synchronise Redux uploadedAttachment with local exercise state
useEffect(() => {
    if (uploadedAttachment) {
      setExercise((prev) => ({
        ...prev,
        attachment: uploadedAttachment,
      }));
      if (isReduxLoading) {
        setUploadProgress(100); 
      }
    }
}, [uploadedAttachment, isReduxLoading]);

  useEffect(() => {
    return () => {
      dispatch(clearFetchedExercise());
      dispatch(clearUploadState());
      setExercise({
        title: "",
        description: "",
        questions: [],
        difficulty: 1,
        totalPoints: 0,
        maxAttempts: 1,
        timeLimit: 600,
        lesson: "",
        attachment: null,
      });
      setIsInitialized(false);
      setCompletedSteps(new Set());
    };
  }, [dispatch, exerciseId]);

  const validateStep = useCallback(
    (step) => {
      const errors = {};
      if (step === 1) {
        if (!exercise.title.trim()) {
          errors.title = "Le titre est requis";
        }
        if (!exercise.description.trim()) {
          errors.description = "La description est requise";
        }
        if (exercise.totalPoints <= 0 || exercise.totalPoints > 5) {
          errors.totalPoints =
            "Les points totaux doivent être compris entre 1 et 5";
        }
        if (exercise.maxAttempts <= 0 || exercise.maxAttempts > 10) {
          errors.maxAttempts =
            "Le nombre maximum de tentatives doit être compris entre 1 et 10";
        }
        if (exercise.timeLimit <= 0) {
          errors.timeLimit = "La limite de temps doit être supérieure à 0";
        }
      }
      if (step === 2) {
        if (exercise.questions.length === 0) {
          errors.questions = "Au moins une question est requise";
        } else {
          exercise.questions.forEach((question, index) => {
            if (!question.questionText?.trim()) {
              errors[`question_${index}`] =
                "Le texte de la question est requis";
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

  // Gestionnaire pour l'upload de fichier
const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadProgress(0);
      dispatch(clearUploadState()); 

      const idToUse = exerciseId || fetchedExercise?._id; 

      if (idToUse) {
        dispatch(
          uploadAttachment({
            exerciseId: idToUse,
            file,
            onProgress: setUploadProgress, // Passe la fonction pour suivre la progression
          })
        ).then((action) => {
           if (action.error) {
              setFormErrors((prev) => ({ ...prev, upload: action.payload || "Échec du téléchargement du fichier." }));
           } else {
              setFormErrors((prev) => ({ ...prev, upload: undefined }));
           }
        });
      } else {
        setFormErrors((prev) => ({
          ...prev,
          upload: "Impossible d'uploader l'attachement sans ID d'exercice.",
        }));
      }
    },
    [dispatch, exerciseId, fetchedExercise?._id]
);

// Gestionnaire pour la suppression de fichier
const handleFileDelete = useCallback(() => {
    const attachmentInState = exercise.attachment || uploadedAttachment;

    if (!attachmentInState) {
        dispatch(clearUploadState());
        setExercise((prev) => ({ ...prev, attachment: null }));
        return;
    }

    const idToDelete = exerciseId || fetchedExercise?._id; 

    if (idToDelete) {
        dispatch(deleteAttachment(idToDelete)).then((action) => {
             if (!action.error) {
                setExercise((prev) => ({ ...prev, attachment: null })); // Mise à jour de l'état local
                setUploadProgress(0);
                setFormErrors((prev) => ({ ...prev, delete: undefined }));
             } else {
                setFormErrors((prev) => ({ ...prev, delete: action.payload || "Échec de la suppression du fichier." }));
             }
        });
    }

}, [dispatch, exercise.attachment, uploadedAttachment, exerciseId, fetchedExercise?._id]);


  const addQuestion = (type) => {
    const newQuestion = {
      id: `new_${Date.now().toString()}`,
      type,
      questionText: "",
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
        q.id === id || q._id === id ? { ...q, ...updates } : q
      ),
    }));
  };

  const removeQuestion = (id) => {
    setExercise((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id && q._id !== id),
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
      const response = await dispatch(
        updateExercise({ id: exerciseId, exerciseData: exercise })
      );
      setFormErrors({ success: "Exercice mis à jour avec succès !" });
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      setFormErrors({
        submit:
          error.message ||
          "Échec de la mise à jour de l'exercice. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
      setExercise({
        title: "",
        description: "",
        questions: [],
        difficulty: 1,
        totalPoints: 0,
        maxAttempts: 1,
        timeLimit: 600,
        lesson: "",
      });
      setIsInitialized(false);
      setCompletedSteps(new Set());
      dispatch(clearFetchedExercise());
    }
  };

  const handleCancel = useCallback((e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  navigate(-1);
}, [navigate]);
  const renderCorrectAnswerInput = (question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
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
                    updateQuestion(question.id || question._id, {
                      options: newOptions,
                    });
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                <Input
                  type="checkbox"
                  checked={question.correctAnswers?.includes(index.toString())}
                  onChange={(e) => {
                    const newCorrectAnswers = [
                      ...(question.correctAnswers || []),
                    ];
                    if (e.target.checked) {
                      newCorrectAnswers.push(index.toString());
                    } else {
                      newCorrectAnswers.splice(
                        newCorrectAnswers.indexOf(index.toString()),
                        1
                      );
                    }
                    updateQuestion(question.id || question._id, {
                      correctAnswers: newCorrectAnswers,
                    });
                  }}
                  className="w-4 h-4"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newOptions = question.options?.filter(
                      (_, i) => i !== index
                    );
                    updateQuestion(question.id || question._id, {
                      options: newOptions,
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
                const newOptions = [...(question.options || []), ""];
                updateQuestion(question.id || question._id, {
                  options: newOptions,
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter une option
            </Button>
          </div>
        );
      case "short-answer":
        return (
          <Input
            dir={getDirection(exercise.title)}
            value={question.correctAnswers?.[0] || ""}
            onChange={(e) =>
              updateQuestion(question.id || question._id, {
                correctAnswers: [e.target.value],
              })
            }
            placeholder="Saisir la bonne réponse"
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
                  updateQuestion(question.id || question._id, {
                    correctAnswers: newAnswers,
                  });
                }}
                placeholder={`Réponse correcte pour le blanc ${index + 1}`}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newAnswers = [...(question.correctAnswers || []), ""];
                updateQuestion(question.id || question._id, {
                  correctAnswers: newAnswers,
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter un blanc
            </Button>
          </div>
        );
      case "matching":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <p>Éléments gauche :</p>
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
                    updateQuestion(question.id || question._id, {
                      matching: {
                        ...question.matching,
                        leftItems: newLeftItems,
                      },
                    });
                  }}
                  placeholder="Élément gauche"
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
                  updateQuestion(question.id || question._id, {
                    matching: { ...question.matching, leftItems: newLeftItems },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un élément gauche
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <p>Éléments droite :</p>
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
                    updateQuestion(question.id || question._id, {
                      matching: {
                        ...question.matching,
                        rightItems: newRightItems,
                      },
                    });
                  }}
                  placeholder="Élément droite"
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
                  updateQuestion(question.id || question._id, {
                    matching: {
                      ...question.matching,
                      rightItems: newRightItems,
                    },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un élément droite
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <p>Paires correctes :</p>
              {question.matching?.pairs?.map((pair, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    dir={getDirection(exercise.title)}
                    value={pair.term}
                    onChange={(e) => {
                      const newPairs = [...(question.matching?.pairs || [])];
                      newPairs[index].term = e.target.value;
                      updateQuestion(question.id || question._id, {
                        matching: { ...question.matching, pairs: newPairs },
                      });
                    }}
                    placeholder="Terme"
                  />
                  <Input
                    dir={getDirection(exercise.title)}
                    value={pair.definition}
                    onChange={(e) => {
                      const newPairs = [...(question.matching?.pairs || [])];
                      newPairs[index].definition = e.target.value;
                      updateQuestion(question.id || question._id, {
                        matching: { ...question.matching, pairs: newPairs },
                      });
                    }}
                    placeholder="Définition"
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
                  updateQuestion(question.id || question._id, {
                    matching: { ...question.matching, pairs: newPairs },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter une paire
              </Button>
            </div>
          </div>
        );
      case "drag-and-drop":
        return (
          <div className="space-y-2">
            {question.dragAndDrop?.items?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  dir={getDirection(exercise.title)}
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(question.dragAndDrop?.items || [])];
                    newItems[index] = e.target.value;
                    updateQuestion(question.id || question._id, {
                      dragAndDrop: { ...question.dragAndDrop, items: newItems },
                    });
                  }}
                  placeholder="Élément"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newItems = question.dragAndDrop?.items?.filter(
                      (_, i) => i !== index
                    );
                    updateQuestion(question.id || question._id, {
                      dragAndDrop: { ...question.dragAndDrop, items: newItems },
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
                updateQuestion(question.id || question._id, {
                  dragAndDrop: { ...question.dragAndDrop, items: newItems },
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter un élément
            </Button>
            <div className="mt-4">
              <p>Ordre correct :</p>
              {question.dragAndDrop?.correctOrder?.map((order, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>{index + 1}.</span>
                  <Input
                    dir={getDirection(exercise.title)}
                    value={order}
                    onChange={(e) => {
                      const newCorrectOrder = [
                        ...(question.dragAndDrop?.correctOrder || []),
                      ];
                      newCorrectOrder[index] = e.target.value;
                      updateQuestion(question.id || question._id, {
                        dragAndDrop: {
                          ...question.dragAndDrop,
                          correctOrder: newCorrectOrder,
                        },
                      });
                    }}
                    placeholder="Saisir l'ordre correct"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newCorrectOrder = [
                    ...(question.dragAndDrop?.correctOrder || []),
                    "",
                  ];
                  updateQuestion(question.id || question._id, {
                    dragAndDrop: {
                      ...question.dragAndDrop,
                      correctOrder: newCorrectOrder,
                    },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un ordre correct
              </Button>
            </div>
          </div>
        );
      case "table-completion":
        return (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                dir={getDirection(exercise.title)}
                type="number"
                value={question.tableCompletion?.rows?.length || 0}
                onChange={(e) => {
                  const numRows = Number.parseInt(e.target.value, 10);
                  const newRows = numRows > 0 ? Array(numRows).fill("") : [];
                  const newCells = Array.from(
                    { length: numRows },
                    (_, rowIndex) =>
                      Array(question.tableCompletion?.columns?.length || 0)
                        .fill("")
                        .map((_, colIndex) => ({
                          rowIndex: rowIndex,
                          columnIndex: colIndex,
                          text: "",
                        }))
                  ).flat();
                  const newCorrections = [];
                  updateQuestion(question.id || question._id, {
                    tableCompletion: {
                      ...question.tableCompletion,
                      rows: newRows,
                      cells: newCells,
                      cellCorrections: newCorrections,
                    },
                  });
                }}
                placeholder="Nombre de lignes"
              />
              <Input
                dir={getDirection(exercise.title)}
                type="number"
                value={question.tableCompletion?.columns?.length || 0}
                onChange={(e) => {
                  const numCols = Number.parseInt(e.target.value, 10);
                  const newColumns = numCols > 0 ? Array(numCols).fill("") : [];
                  const newCells = question.tableCompletion?.rows?.flatMap(
                    (_, rowIndex) =>
                      Array(numCols)
                        .fill("")
                        .map((_, colIndex) => ({
                          rowIndex: rowIndex,
                          columnIndex: colIndex,
                          text: "",
                        }))
                  );
                  const newCorrections = [];
                  updateQuestion(question.id || question._id, {
                    tableCompletion: {
                      ...question.tableCompletion,
                      columns: newColumns,
                      cells: newCells,
                      cellCorrections: newCorrections,
                    },
                  });
                }}
                placeholder="Nombre de colonnes"
              />
            </div>
            {question.tableCompletion?.rows?.length > 0 &&
              question.tableCompletion?.columns?.length > 0 && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="font-bold">Étiquettes de lignes</div>
                    {question.tableCompletion?.columns?.map(
                      (columnHeader, colIndex) => (
                        <Input
                          dir={getDirection(exercise.title)}
                          key={`col-header-${colIndex}`}
                          value={columnHeader}
                          onChange={(e) => {
                            const newColumns = [
                              ...(question.tableCompletion?.columns || []),
                            ];
                            newColumns[colIndex] = e.target.value;
                            updateQuestion(question.id || question._id, {
                              tableCompletion: {
                                ...question.tableCompletion,
                                columns: newColumns,
                              },
                            });
                          }}
                          placeholder={`Colonne ${colIndex + 1}`}
                        />
                      )
                    )}
                  </div>
                  {question.tableCompletion?.rows?.map(
                    (rowHeader, rowIndex) => (
                      <div key={`row-${rowIndex}`} className="flex space-x-2">
                        <Input
                          dir={getDirection(exercise.title)}
                          value={rowHeader}
                          onChange={(e) => {
                            const newRows = [
                              ...(question.tableCompletion?.rows || []),
                            ];
                            newRows[rowIndex] = e.target.value;
                            updateQuestion(question.id || question._id, {
                              tableCompletion: {
                                ...question.tableCompletion,
                                rows: newRows,
                              },
                            });
                          }}
                          placeholder={`Ligne ${rowIndex + 1}`}
                        />
                        {question.tableCompletion?.cells
                          ?.filter((cell) => cell.rowIndex === rowIndex)
                          .map((cell, colIndex) => (
                            <div
                              key={`cell-${rowIndex}-${colIndex}`}
                              className="flex space-x-1"
                            >
                              <Input
                                dir={getDirection(exercise.title)}
                                value={cell.text}
                                onChange={(e) => {
                                  const newCells =
                                    question.tableCompletion?.cells?.map(
                                      (c) => {
                                        if (
                                          c.rowIndex === rowIndex &&
                                          c.columnIndex === colIndex
                                        ) {
                                          return { ...c, text: e.target.value };
                                        }
                                        return c;
                                      }
                                    );
                                  updateQuestion(question.id || question._id, {
                                    tableCompletion: {
                                      ...question.tableCompletion,
                                      cells: newCells,
                                    },
                                  });
                                }}
                                placeholder={`Score L${rowIndex + 1}C${
                                  colIndex + 1
                                }`}
                              />
                              <Input
                                dir={getDirection(exercise.title)}
                                value={
                                  question.tableCompletion?.cellCorrections?.find(
                                    (correction) =>
                                      correction.rowIndex === rowIndex &&
                                      correction.columnIndex === colIndex
                                  )?.correctionText || ""
                                }
                                onChange={(e) => {
                                  const newCorrections = [
                                    ...(question.tableCompletion
                                      ?.cellCorrections || []),
                                  ];
                                  const correctionIndex =
                                    newCorrections.findIndex(
                                      (correction) =>
                                        correction.rowIndex === rowIndex &&
                                        correction.columnIndex === colIndex
                                    );
                                  if (correctionIndex >= 0) {
                                    newCorrections[
                                      correctionIndex
                                    ].correctionText = e.target.value;
                                  } else {
                                    newCorrections.push({
                                      rowIndex,
                                      columnIndex: colIndex,
                                      correctionText: e.target.value,
                                    });
                                  }
                                  updateQuestion(question.id || question._id, {
                                    tableCompletion: {
                                      ...question.tableCompletion,
                                      cellCorrections: newCorrections,
                                    },
                                  });
                                }}
                                placeholder={`Correction L${rowIndex + 1}C${
                                  colIndex + 1
                                }`}
                              />
                            </div>
                          ))}
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  // Show loading state while fetching exercise data
  if (fetchLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">
            Chargement des données de l'exercice...
          </div>
        </div>
      </div>
    );
  }

  // Show error state if exercise fetch failed
  if (reduxError && !fetchedExercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              <AlertTriangle className="h-8 w-8 mx-auto mb-4" />
              <p className="mb-4">
                Erreur lors du chargement de l'exercice : {reduxError}
              </p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour
              </Button>
            </div>
          </CardContent>
        </Card>
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
                <span>Informations de base sur l'exercice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'exercice *</Label>
                  <Input
                    dir={getDirection(exercise.title)}
                    id="title"
                    name="title"
                    value={exercise.title}
                    onChange={handleExerciseChange}
                    className={formErrors.title ? "border-red-500" : ""}
                    placeholder="Saisir le titre de l'exercice"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm">{formErrors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="attachment">Attachement (Facultatif)</Label>
                {exercise.attachment ? (
                  // Fichier attaché existant ou uploadé avec succès
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="flex justify-between items-center">
                      <span className="truncate">
                        Fichier attaché :{" "}
                        <a
                          href={exercise.attachment.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {exercise.attachment.fileName || exercise.attachment.key || "Fichier"}
                        </a>
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleFileDelete}
                        disabled={isReduxLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  // Champ de saisie de fichier
                  <div className="space-y-2">
                    <Input
                      id="attachment"
                      name="attachment"
                      type="file"
                      onChange={handleFileUpload}
                      disabled={isReduxLoading} // Désactiver l'input pendant l'upload
                    />
                    {isReduxLoading && uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Téléchargement en cours... {uploadProgress}%
                        </p>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}
                    {(reduxError || formErrors.upload) && (
                      <p className="text-red-500 text-sm">
                        {formErrors.upload || (typeof reduxError === 'string' ? reduxError : "Une erreur est survenue lors de l'upload.")}
                      </p>
                    )}
                  </div>
                )}
                {formErrors.delete && (
                    <p className="text-red-500 text-sm">{formErrors.delete}</p>
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
                    <span>Points totaux *</span>
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
                  <Label htmlFor="maxAttempts">Tentatives maximales *</Label>
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
                  placeholder="Saisir la description de l'exercice"
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
                    <SelectValue placeholder="Ajouter une question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">
                      Choix multiple
                    </SelectItem>
                    <SelectItem value="short-answer">Réponse courte</SelectItem>
                    <SelectItem value="fill-in-the-blank">
                      Remplissage de blancs
                    </SelectItem>
                    <SelectItem value="matching">Appariement</SelectItem>
                    <SelectItem value="table-completion">
                      Complétion de tableau
                    </SelectItem>
                    <SelectItem value="drag-and-drop">
                      Glisser-Déposer
                    </SelectItem>
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
                          key={question.id || question._id}
                          draggableId={`question_${
                            question.id || question._id
                          }`}
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
                                      {question.type === "multiple-choice"
                                        ? "Choix multiple"
                                        : question.type === "short-answer"
                                        ? "Réponse courte"
                                        : question.type === "fill-in-the-blank"
                                        ? "Remplissage de blancs"
                                        : question.type === "matching"
                                        ? "Appariement"
                                        : question.type === "table-completion"
                                        ? "Complétion de tableau"
                                        : question.type === "drag-and-drop"
                                        ? "Glisser-Déposer"
                                        : question.type}
                                    </Badge>
                                  </div>
                                  {exercise.questions.length > 1 && (
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        removeQuestion(
                                          question.id || question._id
                                        )
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
                                  <Label>Texte de la question *</Label>
                                  <Textarea
                                    value={question.questionText || ""}
                                    onChange={(e) =>
                                      updateQuestion(
                                        question.id || question._id,
                                        {
                                          questionText: e.target.value,
                                        }
                                      )
                                    }
                                    className={
                                      formErrors[`question_${index}`]
                                        ? "border-red-500"
                                        : ""
                                    }
                                    placeholder="Saisir votre question"
                                    rows={2}
                                  />
                                  {formErrors[`question_${index}`] && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors[`question_${index}`]}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label>Difficulté</Label>
                                  <Select
                                    value={
                                      question.difficulty?.toString() || "1"
                                    }
                                    onValueChange={(value) =>
                                      updateQuestion(
                                        question.id || question._id,
                                        {
                                          difficulty: Number.parseInt(value),
                                        }
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner la difficulté" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">Facile</SelectItem>
                                      <SelectItem value="2">Moyen</SelectItem>
                                      <SelectItem value="3">
                                        Difficile
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <Label>Bonne réponse :</Label>
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
                <span>Vérifier l'exercice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{exercise.title}</h3>
                <p className="text-gray-600">{exercise.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{exercise.timeLimit} secondes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{exercise.totalPoints} points</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>{exercise.questions.length} questions</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Aperçu des questions</h4>
                {exercise.questions.map((question, index) => (
                  <div
                    key={question.id || question._id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Badge variant="secondary">
                        {question.type === "multiple-choice"
                          ? "Choix multiple"
                          : question.type === "short-answer"
                          ? "Réponse courte"
                          : question.type === "fill-in-the-blank"
                          ? "Remplissage de blancs"
                          : question.type === "matching"
                          ? "Appariement"
                          : question.type === "table-completion"
                          ? "Complétion de tableau"
                          : question.type === "drag-and-drop"
                          ? "Glisser-Déposer"
                          : question.type}
                      </Badge>
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
                      Modifier l'exercice :
                      <MathText text={exercise.title || "Chargement..."} />
                    </CardTitle>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Mode édition
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <p className="text-gray-600">
                    Étape {currentStep} sur {STEPS.length} :{" "}
                    {STEPS[currentStep - 1]?.description}
                  </p>
                  <span>{Math.round(progressPercentage)}% Terminé</span>
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
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Mise à jour en cours...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Mettre à jour l'exercice
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

export default EditExercise;
