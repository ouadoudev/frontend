import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createExercise } from "@/store/exerciseSlice";
import { fetchLesson } from "@/store/lessonSlice";
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
import { useSelector } from "react-redux";

const STEPS = [
  {
    id: 1,
    title: "Informations de base",
    description: "Définir les détails de l'exercice",
    icon: Settings,
  },
  {
    id: 2,
    title: "Questions",
    description: "Ajouter et modifier des questions",
    icon: HelpCircle,
  },
  {
    id: 3,
    title: "Vérifier et créer",
    description: "Prévisualiser et soumettre",
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
  const lesson = useSelector((state) => state.lesson.lesson);

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

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLesson(lessonId));
    }
  }, [dispatch, lessonId]);

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
      setFormErrors({ success: "Exercice créé avec succès !" });
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Erreur de création :", error);
      setFormErrors({
        submit:
          error.message ||
          "Échec de la création de l'exercice. Veuillez réessayer.",
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
                <Label>Options de réponse *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [...(question.options || []), ""];
                    updateQuestion(question.id, { options: newOptions });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une option
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
              <Label>Bonne réponse *</Label>
              <Select
                value={question.correctAnswer}
                onValueChange={(value) =>
                  updateQuestion(question.id, { correctAnswer: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la bonne réponse" />
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
      // case "short-answer":
      //   return (
      //     <Input
      //       dir={getDirection(exercise.title)}
      //       value={question.correctAnswers?.[0] || ""}
      //       onChange={(e) =>
      //         updateQuestion(question.id, { correctAnswers: [e.target.value] })
      //       }
      //       placeholder="Saisir la bonne réponse"
      //     />
      //   );
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
                placeholder={`Réponse correcte pour le blanc ${index + 1}`}
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
              <Plus className="h-4 w-4 mr-2" /> Ajouter un blanc
            </Button>
          </div>
        );
     case "short-answer":
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
          placeholder={`Réponse acceptable ${index + 1}`}
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
        <Plus className="h-4 w-4 mr-2" /> Ajouter une réponse acceptable
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
                    updateQuestion(question.id, {
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
                  updateQuestion(question.id, {
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
                    updateQuestion(question.id, {
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
                  updateQuestion(question.id, {
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
                      updateQuestion(question.id, {
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
                      updateQuestion(question.id, {
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
                  updateQuestion(question.id, {
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
              <Plus className="h-4 w-4 mr-2" /> Ajouter un élément
            </Button>

            {/* Correct Order Section */}
            <div className="mt-4">
              <p>Ordre correct :</p>
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
                    <option value="">Sélectionner un élément</option>
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
                          {item || `Élément ${i + 1}`}
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
                <Plus className="h-4 w-4 mr-2" /> Ajouter un ordre correct
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
                <Label>Lignes</Label>
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
                <Label>Colonnes</Label>
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
                                placeholder={`Colonne ${colIndex + 1}`}
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
                              placeholder={`Ligne ${rowIndex + 1}`}
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
                                      placeholder="Réponse"
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
                  <Label
                    htmlFor="timeLimit"
                    className="flex items-center space-x-1"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Durée limite (secondes) *</span>
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
                    <span>Points *</span>
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
                                  <Label>Texte de la question *</Label>
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
                                      updateQuestion(question.id, {
                                        difficulty: Number.parseInt(value),
                                      })
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
                  <div className="flex items-center space-x-1">
                    <Badge variant="secondary">Leçon :{lesson?.title}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Aperçu des questions</h4>
                {exercise.questions.map((question, index) => (
                  <div
                    key={question.id}
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
                      Créer un nouvel exercice
                    </CardTitle>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Mode création
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
                            Création en cours...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Créer l'exercice
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

// import { useState, useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { createExercise } from "@/store/exerciseSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import {
//   Plus,
//   Trash2,
//   ArrowLeft,
//   Settings,
//   HelpCircle,
//   Eye,
//   Clock,
//   Target,
//   CheckCircle,
//   ChevronRight,
//   ChevronLeft,
//   AlertTriangle,
//   Save,
//   GripVertical,
//   X,
// } from "lucide-react";
// import { useParams, useNavigate } from "react-router-dom";

// const STEPS = [
//   {
//     id: 1,
//     title: "Basic Information",
//     description: "Set exercise details",
//     icon: Settings,
//   },
//   {
//     id: 2,
//     title: "Questions",
//     description: "Add and edit questions",
//     icon: HelpCircle,
//   },
//   {
//     id: 3,
//     title: "Review & Create",
//     description: "Preview and submit",
//     icon: Eye,
//   },
// ];

// const ExerciseGenerator = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { lessonId } = useParams();

//   // Step management
//   const [currentStep, setCurrentStep] = useState(1);
//   const [completedSteps, setCompletedSteps] = useState(new Set());
//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

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

//   const validateStep = useCallback(
//     (step) => {
//       const errors = {};
//       if (step === 1) {
//         if (!exercise.title.trim()) {
//           errors.title = "Title is required";
//         }
//         if (!exercise.description.trim()) {
//           errors.description = "Description is required";
//         }
//         if (exercise.totalPoints <= 0 || exercise.totalPoints > 5) {
//           errors.totalPoints = "Total points must be between 1 and 5";
//         }
//         if (exercise.maxAttempts <= 0 || exercise.maxAttempts > 10) {
//           errors.maxAttempts = "Max attempts must be between 1 and 10";
//         }
//         if (exercise.timeLimit <= 0) {
//           errors.timeLimit = "Time limit must be greater than 0";
//         }
//       }
//       if (step === 2) {
//         if (exercise.questions.length === 0) {
//           errors.questions = "At least one question is required";
//         } else {
//           exercise.questions.forEach((question, index) => {
//             if (!question.questionText?.trim()) {
//               errors[`question_${index}`] = "Question text is required";
//             }
//           });
//         }
//       }
//       setFormErrors(errors);
//       return Object.keys(errors).length === 0;
//     },
//     [exercise]
//   );

//   const handleNext = useCallback(() => {
//     if (validateStep(currentStep)) {
//       setCompletedSteps((prev) => new Set([...prev, currentStep]));
//       setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
//     }
//   }, [currentStep, validateStep]);

//   const handlePrevious = useCallback(() => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   }, []);

//   const handleStepClick = useCallback(
//     (stepId) => {
//       if (stepId <= currentStep || completedSteps.has(stepId - 1)) {
//         setCurrentStep(stepId);
//       }
//     },
//     [currentStep, completedSteps]
//   );

//   const handleExerciseChange = (e) => {
//     const { name, value } = e.target;
//     setExercise((prev) => ({ ...prev, [name]: value }));
//     if (formErrors[name]) {
//       setFormErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const addQuestion = (type) => {
//     const newQuestion = {
//       id: `new_${Date.now().toString()}`,
//       type,
//       questionText: "",
//       difficulty: 1,
//       options: type === "multiple-choice" ? [""] : undefined,
//       correctAnswers:
//         type === "multiple-choice"
//           ? []
//           : type === "short-answer" || type === "fill-in-the-blank"
//           ? [""]
//           : undefined,
//       matching:
//         type === "matching"
//           ? {
//               leftItems: [""],
//               rightItems: [""],
//               pairs: [{ term: "", definition: "" }],
//             }
//           : undefined,
//       tableCompletion:
//         type === "table-completion"
//           ? { rows: [""], columns: [""], cells: [], cellCorrections: [] }
//           : undefined,
//       dragAndDrop:
//         type === "drag-and-drop"
//           ? { items: [""], correctOrder: [""] }
//           : undefined,
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
//     if (!validateStep(1) || !validateStep(2)) {
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       await dispatch(createExercise({ ...exercise, lessonId }));
//       setFormErrors({ success: "Exercise created successfully!" });
//       setTimeout(() => {
//         navigate(-1);
//       }, 1500);
//     } catch (error) {
//       console.error("Create error:", error);
//       setFormErrors({
//         submit: error.message || "Failed to create exercise. Please try again.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = useCallback(() => {
//     navigate(-1);
//   }, [navigate]);

//   const renderCorrectAnswerInput = (question) => {
//     switch (question.type) {
//       case "multiple-choice":
//         return (
//           <div className="space-y-4">
//             {/* Options List */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Answer Options *</Label>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     const newOptions = [...(question.options || []), ""];
//                     updateQuestion(question.id, { options: newOptions });
//                   }}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> Add Option
//                 </Button>
//               </div>
//               <div className="space-y-2">
//                 {question.options?.map((option, index) => (
//                   <div key={index} className="flex items-center space-x-2">
//                     <Badge
//                       variant="outline"
//                       className="min-w-[2rem] justify-center"
//                     >
//                       {String.fromCharCode(65 + index)}
//                     </Badge>
//                     <Input
//                       dir={getDirection(exercise.title)}
//                       value={option}
//                       onChange={(e) => {
//                         const newOptions = [...(question.options || [])];
//                         newOptions[index] = e.target.value;
//                         updateQuestion(question.id, { options: newOptions });

//                         // Clear correct answer if edited option was the correct one
//                         if (question.correctAnswer === option) {
//                           updateQuestion(question.id, { correctAnswer: "" });
//                         }
//                       }}
//                       placeholder={`Option ${index + 1}`}
//                       className="flex-1"
//                     />
//                     {question.options.length > 2 && (
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           const newOptions = question.options?.filter(
//                             (_, i) => i !== index
//                           );
//                           updateQuestion(question.id, { options: newOptions });

//                           // Clear correct answer if deleted option was the correct one
//                           if (question.correctAnswer === option) {
//                             updateQuestion(question.id, { correctAnswer: "" });
//                           }
//                         }}
//                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Correct Answer Selection */}
//             <div className="space-y-2">
//               <Label>Correct Answer *</Label>
//               <Select
//                 value={question.correctAnswer}
//                 onValueChange={(value) =>
//                   updateQuestion(question.id, { correctAnswer: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select correct answer" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {question.options
//                     ?.filter((opt) => opt.trim() !== "") // Only show non-empty options
//                     .map((option, index) => (
//                       <SelectItem key={index} value={option}>
//                         <span className="mr-2 font-mono">
//                           {String.fromCharCode(65 + index)}.
//                         </span>
//                         {option}
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         );
//       case "short-answer":
//         return (
//           <Input
//             dir={getDirection(exercise.title)}
//             value={question.correctAnswers?.[0] || ""}
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
//                 dir={getDirection(exercise.title)}
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
//               <Plus className="h-4 w-4 mr-2" /> Add Blank
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
//                   dir={getDirection(exercise.title)}
//                   key={index}
//                   value={item}
//                   onChange={(e) => {
//                     const newLeftItems = [
//                       ...(question.matching?.leftItems || []),
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
//                   dir={getDirection(exercise.title)}
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
//                     ...(question.matching?.rightItems || []),
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
//                     dir={getDirection(exercise.title)}
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
//                     dir={getDirection(exercise.title)}
//                     value={pair.definition}
//                     onChange={(e) => {
//                       const newPairs = [...(question.matching?.pairs || [])];
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
//                     ...(question.matching?.pairs || []),
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
//             {/* Drag Items Section */}
//             {question.dragAndDrop?.items?.map((item, index) => (
//               <div key={index} className="flex items-center space-x-2">
//                 <Input
//                   dir={getDirection(exercise.title)}
//                   value={item}
//                   onChange={(e) => {
//                     const newItems = [...(question.dragAndDrop?.items || [])];
//                     newItems[index] = e.target.value;
//                     updateQuestion(question.id, {
//                       dragAndDrop: {
//                         ...question.dragAndDrop,
//                         items: newItems,
//                       },
//                     });
//                   }}
//                   placeholder="Item"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     const newItems = question.dragAndDrop?.items?.filter(
//                       (_, i) => i !== index
//                     );
//                     updateQuestion(question.id, {
//                       dragAndDrop: {
//                         ...question.dragAndDrop,
//                         items: newItems,
//                         correctOrder: newItems,
//                       },
//                     });
//                   }}
//                   className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                 >
//                   <X className="h-4 w-4" />
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
//                   dragAndDrop: {
//                     ...question.dragAndDrop,
//                     items: newItems,
//                     correctOrder: newItems,
//                   },
//                 });
//               }}
//             >
//               <Plus className="h-4 w-4 mr-2" /> Add Item
//             </Button>

//             {/* Correct Order Section */}
//             <div className="mt-4">
//               <p>Correct Order:</p>
//               {question.dragAndDrop?.correctOrder?.map((order, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <span>{index + 1}.</span>
//                   <select
//                     className="border rounded px-2 py-1"
//                     value={order}
//                     onChange={(e) => {
//                       const newCorrectOrder = [
//                         ...question.dragAndDrop.correctOrder,
//                       ];
//                       newCorrectOrder[index] = e.target.value;
//                       updateQuestion(question.id, {
//                         dragAndDrop: {
//                           ...question.dragAndDrop,
//                           correctOrder: newCorrectOrder,
//                         },
//                       });
//                     }}
//                   >
//                     <option value="">Select item</option>
//                     {question.dragAndDrop?.items?.map((item, i) => {
//                       const isSelectedElsewhere =
//                         question.dragAndDrop.correctOrder.includes(item) &&
//                         question.dragAndDrop.correctOrder[index] !== item;
//                       return (
//                         <option
//                           key={i}
//                           value={item}
//                           disabled={isSelectedElsewhere}
//                         >
//                           {item || `Item ${i + 1}`}
//                         </option>
//                       );
//                     })}
//                   </select>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       const newCorrectOrder =
//                         question.dragAndDrop.correctOrder.filter(
//                           (_, i) => i !== index
//                         );
//                       updateQuestion(question.id, {
//                         dragAndDrop: {
//                           ...question.dragAndDrop,
//                           correctOrder: newCorrectOrder,
//                         },
//                       });
//                     }}
//                     className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   const currentCorrectOrder =
//                     question.dragAndDrop?.correctOrder || [];
//                   updateQuestion(question.id, {
//                     dragAndDrop: {
//                       ...question.dragAndDrop,
//                       correctOrder: [...currentCorrectOrder, ""],
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
//           <div className="space-y-4">
//             {/* Table Configuration */}
//             <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
//               <div className="flex-1">
//                 <Label>Rows</Label>
//                 <Input
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={question.tableCompletion?.rows?.length || 1}
//                   onChange={(e) => {
//                     const numRows = Math.max(
//                       1,
//                       Math.min(parseInt(e.target.value) || 1, 10)
//                     );
//                     const newRows = Array(numRows).fill("");
//                     const currentCols =
//                       question.tableCompletion?.columns?.length || 1;
//                     const newCells = Array.from(
//                       { length: numRows },
//                       (_, rowIndex) =>
//                         Array(currentCols)
//                           .fill("")
//                           .map((_, colIndex) => ({
//                             rowIndex,
//                             columnIndex: colIndex,
//                             text: "",
//                           }))
//                     ).flat();

//                     updateQuestion(question.id, {
//                       tableCompletion: {
//                         ...question.tableCompletion,
//                         rows: newRows,
//                         cells: newCells,
//                         cellCorrections: [],
//                       },
//                     });
//                   }}
//                   className="mt-1 w-20"
//                 />
//               </div>
//               <div className="flex-1">
//                 <Label>Columns</Label>
//                 <Input
//                   type="number"
//                   min="1"
//                   max="6"
//                   value={question.tableCompletion?.columns?.length || 1}
//                   onChange={(e) => {
//                     const numCols = Math.max(
//                       1,
//                       Math.min(parseInt(e.target.value) || 1, 6)
//                     );
//                     const newColumns = Array(numCols).fill("");
//                     const currentRows =
//                       question.tableCompletion?.rows?.length || 1;
//                     const newCells = Array.from(
//                       { length: currentRows },
//                       (_, rowIndex) =>
//                         Array(numCols)
//                           .fill("")
//                           .map((_, colIndex) => ({
//                             rowIndex,
//                             columnIndex: colIndex,
//                             text: "",
//                           }))
//                     ).flat();

//                     updateQuestion(question.id, {
//                       tableCompletion: {
//                         ...question.tableCompletion,
//                         columns: newColumns,
//                         cells: newCells,
//                         cellCorrections: [],
//                       },
//                     });
//                   }}
//                   className="mt-1 w-20"
//                 />
//               </div>
//             </div>

//             {/* Table Display */}
//             {question.tableCompletion?.rows?.length > 0 &&
//               question.tableCompletion?.columns?.length > 0 && (
//                 <div className="border rounded-lg overflow-hidden">
//                   <table className="w-full border-collapse">
//                     {/* Header Row */}
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="border p-2 w-32"></th>
//                         {question.tableCompletion.columns.map(
//                           (col, colIndex) => (
//                             <th key={`col-${colIndex}`} className="border p-2">
//                               <Input
//                                 value={col}
//                                 onChange={(e) => {
//                                   const newColumns = [
//                                     ...question.tableCompletion.columns,
//                                   ];
//                                   newColumns[colIndex] = e.target.value;
//                                   updateQuestion(question.id, {
//                                     tableCompletion: {
//                                       ...question.tableCompletion,
//                                       columns: newColumns,
//                                     },
//                                   });
//                                 }}
//                                 className="w-full border-none bg-transparent focus:ring-1 focus:ring-blue-500"
//                                 placeholder={`Col ${colIndex + 1}`}
//                               />
//                             </th>
//                           )
//                         )}
//                       </tr>
//                     </thead>

//                     {/* Table Body */}
//                     <tbody>
//                       {question.tableCompletion.rows.map((row, rowIndex) => (
//                         <tr
//                           key={`row-${rowIndex}`}
//                           className="hover:bg-gray-50"
//                         >
//                           <td className="border p-2 bg-gray-50">
//                             <Input
//                               value={row}
//                               onChange={(e) => {
//                                 const newRows = [
//                                   ...question.tableCompletion.rows,
//                                 ];
//                                 newRows[rowIndex] = e.target.value;
//                                 updateQuestion(question.id, {
//                                   tableCompletion: {
//                                     ...question.tableCompletion,
//                                     rows: newRows,
//                                   },
//                                 });
//                               }}
//                               className="w-full border-none bg-transparent focus:ring-1 focus:ring-blue-500"
//                               placeholder={`Row ${rowIndex + 1}`}
//                             />
//                           </td>

//                           {question.tableCompletion.columns.map(
//                             (_, colIndex) => {
//                               const cell = question.tableCompletion.cells?.find(
//                                 (c) =>
//                                   c.rowIndex === rowIndex &&
//                                   c.columnIndex === colIndex
//                               );
//                               const correction =
//                                 question.tableCompletion.cellCorrections?.find(
//                                   (c) =>
//                                     c.rowIndex === rowIndex &&
//                                     c.columnIndex === colIndex
//                                 );

//                               return (
//                                 <td
//                                   key={`cell-${rowIndex}-${colIndex}`}
//                                   className="border p-2"
//                                 >
//                                   <div className="space-y-1">
//                                     <Input
//                                       value={cell?.text || ""}
//                                       onChange={(e) => {
//                                         const newCells =
//                                           question.tableCompletion.cells.map(
//                                             (c) =>
//                                               c.rowIndex === rowIndex &&
//                                               c.columnIndex === colIndex
//                                                 ? { ...c, text: e.target.value }
//                                                 : c
//                                           );
//                                         updateQuestion(question.id, {
//                                           tableCompletion: {
//                                             ...question.tableCompletion,
//                                             cells: newCells,
//                                           },
//                                         });
//                                       }}
//                                       className="w-full border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//                                       placeholder="Answer"
//                                     />
//                                     <Input
//                                       value={correction?.correctionText || ""}
//                                       onChange={(e) => {
//                                         const existingCorrection =
//                                           question.tableCompletion.cellCorrections?.find(
//                                             (c) =>
//                                               c.rowIndex === rowIndex &&
//                                               c.columnIndex === colIndex
//                                           );

//                                         const newCorrections =
//                                           existingCorrection
//                                             ? question.tableCompletion.cellCorrections.map(
//                                                 (c) =>
//                                                   c === existingCorrection
//                                                     ? {
//                                                         ...c,
//                                                         correctionText:
//                                                           e.target.value,
//                                                       }
//                                                     : c
//                                               )
//                                             : [
//                                                 ...question.tableCompletion
//                                                   .cellCorrections,
//                                                 {
//                                                   rowIndex,
//                                                   columnIndex: colIndex,
//                                                   correctionText:
//                                                     e.target.value,
//                                                 },
//                                               ];

//                                         updateQuestion(question.id, {
//                                           tableCompletion: {
//                                             ...question.tableCompletion,
//                                             cellCorrections: newCorrections,
//                                           },
//                                         });
//                                       }}
//                                       className="w-full text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
//                                       placeholder="Correction"
//                                     />
//                                   </div>
//                                 </td>
//                               );
//                             }
//                           )}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Settings className="h-5 w-5" />
//                 <span>Basic Exercise Information</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Exercise Title *</Label>
//                   <Input
//                     dir={getDirection(exercise.title)}
//                     id="title"
//                     name="title"
//                     value={exercise.title}
//                     onChange={handleExerciseChange}
//                     className={formErrors.title ? "border-red-500" : ""}
//                     placeholder="Enter exercise title"
//                   />
//                   {formErrors.title && (
//                     <p className="text-red-500 text-sm">{formErrors.title}</p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="timeLimit"
//                     className="flex items-center space-x-1"
//                   >
//                     <Clock className="h-4 w-4" />
//                     <span>Time Limit (seconds) *</span>
//                   </Label>
//                   <Input
//                     id="timeLimit"
//                     name="timeLimit"
//                     type="number"
//                     value={exercise.timeLimit}
//                     onChange={handleExerciseChange}
//                     className={formErrors.timeLimit ? "border-red-500" : ""}
//                     min="30"
//                     placeholder="600"
//                   />
//                   {formErrors.timeLimit && (
//                     <p className="text-red-500 text-sm">
//                       {formErrors.timeLimit}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="totalPoints"
//                     className="flex items-center space-x-1"
//                   >
//                     <Target className="h-4 w-4" />
//                     <span>Total Points *</span>
//                   </Label>
//                   <Input
//                     id="totalPoints"
//                     name="totalPoints"
//                     type="number"
//                     value={exercise.totalPoints}
//                     onChange={handleExerciseChange}
//                     className={formErrors.totalPoints ? "border-red-500" : ""}
//                     min="1"
//                     max="5"
//                     placeholder="5"
//                   />
//                   {formErrors.totalPoints && (
//                     <p className="text-red-500 text-sm">
//                       {formErrors.totalPoints}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="maxAttempts">Max Attempts *</Label>
//                   <Input
//                     id="maxAttempts"
//                     name="maxAttempts"
//                     type="number"
//                     value={exercise.maxAttempts}
//                     onChange={handleExerciseChange}
//                     className={formErrors.maxAttempts ? "border-red-500" : ""}
//                     min="1"
//                     max="10"
//                     placeholder="3"
//                   />
//                   {formErrors.maxAttempts && (
//                     <p className="text-red-500 text-sm">
//                       {formErrors.maxAttempts}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description *</Label>
//                 <Textarea
//                   dir={getDirection(exercise.title)}
//                   id="description"
//                   name="description"
//                   value={exercise.description}
//                   onChange={handleExerciseChange}
//                   rows={3}
//                   className={formErrors.description ? "border-red-500" : ""}
//                   placeholder="Enter exercise description"
//                 />
//                 {formErrors.description && (
//                   <p className="text-red-500 text-sm">
//                     {formErrors.description}
//                   </p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         );

//       case 2:
//         return (
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="flex items-center space-x-2">
//                   <HelpCircle className="h-5 w-5" />
//                   <span>Questions ({exercise.questions.length})</span>
//                 </CardTitle>
//                 <Select onValueChange={(value) => addQuestion(value)}>
//                   <SelectTrigger className="w-[200px]">
//                     <SelectValue placeholder="Add question" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="multiple-choice">
//                       Multiple Choice
//                     </SelectItem>
//                     <SelectItem value="short-answer">Short Answer</SelectItem>
//                     <SelectItem value="fill-in-the-blank">
//                       Fill in the Blank
//                     </SelectItem>
//                     <SelectItem value="matching">Matching</SelectItem>
//                     <SelectItem value="table-completion">
//                       Table Completion
//                     </SelectItem>
//                     <SelectItem value="drag-and-drop">Drag and Drop</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {formErrors.questions && (
//                 <Alert variant="destructive" className="mb-4">
//                   <AlertTriangle className="h-4 w-4" />
//                   <AlertDescription>{formErrors.questions}</AlertDescription>
//                 </Alert>
//               )}
//               <DragDropContext onDragEnd={onDragEnd}>
//                 <Droppable droppableId="questions">
//                   {(provided) => (
//                     <div
//                       {...provided.droppableProps}
//                       ref={provided.innerRef}
//                       className="space-y-4"
//                     >
//                       {exercise.questions.map((question, index) => (
//                         <Draggable
//                           key={question.id}
//                           draggableId={`question_${question.id}`}
//                           index={index}
//                         >
//                           {(provided, snapshot) => (
//                             <Card
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               className={`${
//                                 snapshot.isDragging ? "shadow-lg" : ""
//                               } border-l-4 border-l-blue-500`}
//                             >
//                               <CardHeader className="pb-3">
//                                 <div className="flex items-center justify-between">
//                                   <div className="flex items-center space-x-3">
//                                     <div
//                                       {...provided.dragHandleProps}
//                                       className="cursor-move text-gray-400 hover:text-gray-600"
//                                     >
//                                       <GripVertical className="h-5 w-5" />
//                                     </div>
//                                     <Badge variant="outline">
//                                       Question {index + 1}
//                                     </Badge>
//                                     <Badge variant="secondary">
//                                       {question.type}
//                                     </Badge>
//                                   </div>
//                                   {exercise.questions.length > 1 && (
//                                     <Button
//                                       type="button"
//                                       onClick={() =>
//                                         removeQuestion(question.id)
//                                       }
//                                       variant="ghost"
//                                       size="sm"
//                                       className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                       <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                   )}
//                                 </div>
//                               </CardHeader>
//                               <CardContent className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label>Question Text *</Label>
//                                   <Textarea
//                                     value={question.questionText || ""}
//                                     onChange={(e) =>
//                                       updateQuestion(question.id, {
//                                         questionText: e.target.value,
//                                       })
//                                     }
//                                     className={
//                                       formErrors[`question_${index}`]
//                                         ? "border-red-500"
//                                         : ""
//                                     }
//                                     placeholder="Enter your question"
//                                     rows={2}
//                                   />
//                                   {formErrors[`question_${index}`] && (
//                                     <p className="text-red-500 text-sm">
//                                       {formErrors[`question_${index}`]}
//                                     </p>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label>Difficulty</Label>
//                                   <Select
//                                     value={
//                                       question.difficulty?.toString() || "1"
//                                     }
//                                     onValueChange={(value) =>
//                                       updateQuestion(question.id, {
//                                         difficulty: Number.parseInt(value),
//                                       })
//                                     }
//                                   >
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select difficulty" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="1">Easy</SelectItem>
//                                       <SelectItem value="2">Medium</SelectItem>
//                                       <SelectItem value="3">Hard</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 <Separator />
//                                 <div className="space-y-2">
//                                   <Label>Correct Answer:</Label>
//                                   {renderCorrectAnswerInput(question)}
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </div>
//                   )}
//                 </Droppable>
//               </DragDropContext>
//             </CardContent>
//           </Card>
//         );

//       case 3:
//         return (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Eye className="h-5 w-5" />
//                 <span>Review Exercise</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="bg-gray-50 p-4 rounded-lg space-y-3">
//                 <h3 className="font-semibold text-lg">{exercise.title}</h3>
//                 <p className="text-gray-600">{exercise.description}</p>
//                 <div className="flex flex-wrap gap-4 text-sm">
//                   <div className="flex items-center space-x-1">
//                     <Clock className="h-4 w-4" />
//                     <span>{exercise.timeLimit} seconds</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Target className="h-4 w-4" />
//                     <span>{exercise.totalPoints} points</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <HelpCircle className="h-4 w-4" />
//                     <span>{exercise.questions.length} questions</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Badge variant="secondary">Lesson: {lessonId}</Badge>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <h4 className="font-semibold">Questions Preview</h4>
//                 {exercise.questions.map((question, index) => (
//                   <div
//                     key={question.id}
//                     className="border rounded-lg p-4 space-y-2"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <Badge variant="outline">Q{index + 1}</Badge>
//                       <Badge variant="secondary">{question.type}</Badge>
//                     </div>
//                     <p className="font-medium">{question.questionText}</p>
//                     {question.type === "multiple-choice" && (
//                       <div className="space-y-1">
//                         {question.options?.map((option, optIndex) => (
//                           <div
//                             key={optIndex}
//                             className={`text-sm p-2 rounded ${
//                               question.correctAnswers?.includes(
//                                 optIndex.toString()
//                               )
//                                 ? "bg-green-100 text-green-800 font-medium"
//                                 : "bg-gray-50"
//                             }`}
//                           >
//                             <span className="mr-2 font-mono">
//                               {String.fromCharCode(65 + optIndex)}.
//                             </span>
//                             {option}
//                             {question.correctAnswers?.includes(
//                               optIndex.toString()
//                             ) && (
//                               <CheckCircle className="inline h-4 w-4 ml-2" />
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="container mx-auto py-8">
//         <div className="max-w-4xl mx-auto space-y-6">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle className="text-2xl font-bold text-gray-900">
//                       Create New Exercise
//                     </CardTitle>
//                   </div>
//                   <Badge
//                     variant="secondary"
//                     className="bg-green-100 text-green-800"
//                   >
//                     Creation Mode
//                   </Badge>
//                 </div>
//                 <div className="flex items-center justify-between text-sm text-gray-600">
//                   <p className="text-gray-600">
//                     Step {currentStep} of {STEPS.length}:{" "}
//                     {STEPS[currentStep - 1]?.description}
//                   </p>
//                   <span>{Math.round(progressPercentage)}% Complete</span>
//                 </div>
//                 <Progress value={progressPercentage} className="h-2" />
//                 <div className="flex items-center justify-between">
//                   {STEPS.map((step, index) => {
//                     const Icon = step.icon;
//                     const isActive = currentStep === step.id;
//                     const isCompleted = completedSteps.has(step.id);
//                     const isClickable =
//                       step.id <= currentStep || completedSteps.has(step.id - 1);
//                     return (
//                       <div key={step.id} className="flex items-center">
//                         <button
//                           onClick={() => handleStepClick(step.id)}
//                           disabled={!isClickable}
//                           className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
//                             isActive
//                               ? "bg-blue-100 text-blue-700"
//                               : isCompleted
//                               ? "bg-green-100 text-green-700"
//                               : isClickable
//                               ? "hover:bg-gray-100"
//                               : "text-gray-400 cursor-not-allowed"
//                           }`}
//                         >
//                           <div
//                             className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                               isActive
//                                 ? "bg-blue-600 text-white"
//                                 : isCompleted
//                                 ? "bg-green-600 text-white"
//                                 : "bg-gray-200"
//                             }`}
//                           >
//                             {isCompleted ? (
//                               <CheckCircle className="h-4 w-4" />
//                             ) : (
//                               <Icon className="h-4 w-4" />
//                             )}
//                           </div>
//                           <div className="text-left hidden md:block">
//                             <div className="font-medium text-sm">
//                               {step.title}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {step.description}
//                             </div>
//                           </div>
//                         </button>
//                         {index < STEPS.length - 1 && (
//                           <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Alerts */}
//           {formErrors.submit && (
//             <Alert variant="destructive">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription>{formErrors.submit}</AlertDescription>
//             </Alert>
//           )}
//           {formErrors.success && (
//             <Alert className="border-green-200 bg-green-50">
//               <CheckCircle className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-800">
//                 {formErrors.success}
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Step Content */}
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               if (currentStep === STEPS.length) {
//                 handleSubmit();
//               }
//             }}
//           >
//             {renderStepContent()}

//             {/* Navigation Buttons */}
//             <Card className="mt-2">
//               <CardContent className="p-2">
//                 <div className="flex items-center justify-between">
//                   <div className="flex space-x-3">
//                     {currentStep > 1 && (
//                       <Button
//                         type="button"
//                         onClick={handlePrevious}
//                         variant="outline"
//                       >
//                         <ChevronLeft className="h-4 w-4 mr-2" />
//                         Previous
//                       </Button>
//                     )}
//                     <Button
//                       type="button"
//                       onClick={handleCancel}
//                       variant="outline"
//                     >
//                       Cancel
//                     </Button>
//                   </div>

//                   <div className="flex space-x-3">
//                     {currentStep < STEPS.length ? (
//                       <Button
//                         type="button"
//                         onClick={handleNext}
//                         className="bg-blue-600 hover:bg-blue-700"
//                       >
//                         Next
//                         <ChevronRight className="h-4 w-4 ml-2" />
//                       </Button>
//                     ) : (
//                       <Button
//                         type="submit"
//                         disabled={isSubmitting}
//                         onClick={handleSubmit}
//                         className="bg-blue-600 hover:bg-blue-700"
//                       >
//                         {isSubmitting ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                             Creating...
//                           </>
//                         ) : (
//                           <>
//                             <Save className="h-4 w-4 mr-2" />
//                             Create Quiz
//                           </>
//                         )}
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExerciseGenerator;
