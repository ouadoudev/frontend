import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuizByLesson, deleteQuiz, clearQuizState } from "@/store/quizSlice";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Clock,
  Target,
  HelpCircle,
  Edit,
  CheckCircle,
  ArrowLeft,
  TrashIcon,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { toast } from "react-toastify";

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

const ViewQuiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, loading } = useSelector((state) => state.quiz);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    dispatch(clearQuizState());
    if (lessonId) {
      dispatch(getQuizByLesson(lessonId));
    }
    return () => {
      dispatch(clearQuizState());
    };
  }, [dispatch, lessonId]);

  const quiz = Array.isArray(currentQuiz) ? currentQuiz[0] : currentQuiz;

  const handleEdit = () => {
    if (quiz?._id) {
      dispatch(clearQuizState());
      navigate(`/quiz/update/${lessonId}/${quiz._id}`);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteQuiz(quiz._id)).unwrap();
      toast.success("Quiz supprimé avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(clearQuizState());
      navigate("/lessons");
    } catch (error) {
      console.error("Delete quiz error:", error);
      toast.error("Erreur lors de la suppression du quiz", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    setShowDeleteConfirm(false);
  };

  const handleBackToLessons = () => {
    dispatch(clearQuizState());
    navigate(-1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Chargement du quiz...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <Button onClick={handleBackToLessons} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux leçons
          </Button>

          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun quiz trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                Cette leçon n'a pas encore de quiz.
              </p>
              <Button onClick={() => navigate(`/quiz/create/${lessonId}`)}>
                Créer un quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 max-w-4xl">
        {/* Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={handleBackToLessons} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="flex gap-3">
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Modifier le quiz
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Quiz Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">{quiz.title}</CardTitle>
                <p className="text-gray-600 mt-2 text-lg"> <MathText text={quiz.description} /></p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-1">
                Publié
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Temps :</span>
                <span>{formatTime(quiz.timeLimit)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Score de passage :</span>
                <span>{quiz.passingScore}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Questions :</span>
                <span>{quiz.questions?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Questions ({quiz.questions?.length || 0})</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {quiz.questions?.map((question, index) => (
              <div
                key={question._id || index}
                className="border rounded-xl p-6 space-y-5 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      Question {index + 1}
                    </Badge>
                  </div>
                  {question.hint && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Indice présent
                    </div>
                  )}
                </div>

                {/* Question Text */}
                <h4 className="text-xl font-semibold text-gray-900">
              <MathText text={question.questionText} />    
                </h4>
                {/* Options */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">Options de réponse :</h5>
                  <div className="space-y-3">
                    {question.options?.map((option, optIndex) => {
                      const isCorrect = option.text === question.correctAnswer;
                      return (
                        <div
                          key={optIndex}
                          className={`p-4 rounded-lg border flex items-start gap-4 ${
                            isCorrect
                              ? "bg-green-50 border-green-300"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <Badge variant="outline" className="mt-1 min-w-[2rem] justify-center">
                            {String.fromCharCode(65 + optIndex)}
                          </Badge>

                          <div className="flex-1">
                            <p className="text-gray-800"><MathText text={option.text}/></p>
                            {option.rationale && (
                              <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                                <span className="font-medium">Explication :</span>{" "}
                              <MathText text=  {option.rationale}/>
                              </p>
                            )}
                          </div>

                          {isCorrect && (
                            <div className="text-green-600">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hint */}
                {question.hint && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                      <Lightbulb className="h-5 w-5" />
                      Indice
                    </div>
                    <p className="text-amber-800"><MathText text={question.hint}/></p>
                  </div>
                )}
              </div>
            ))}

            {(!quiz.questions || quiz.questions.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <HelpCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Aucune question n'a été ajoutée à ce quiz.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Confirmer la suppression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <Button onClick={() => setShowDeleteConfirm(false)} variant="outline">
                  Annuler
                </Button>
                <Button onClick={handleDelete} variant="destructive">
                  Supprimer le quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ViewQuiz;