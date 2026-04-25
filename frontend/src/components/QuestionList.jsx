import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLessonQuestions,
  updateQuestion,
  deleteQuestion,
} from "@/store/questionSlice";
import { loggedUser } from "@/store/authSlice";
import { useParams } from "react-router-dom";
import moment from "moment";
import AnswerForm from "./AnswerForm";
import AnswerList from "./AnswerList";
import { Edit, Trash, MessageCircle, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
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

const QuestionList = ({ lessonTitle }) => {
  const { id } = useParams();
  const user = useSelector(loggedUser);
  const dispatch = useDispatch();
  const rawQuestions = useSelector((state) => state.question.questions);
  const [sortedQuestions, setSortedQuestions] = useState([]);
  const [visibleAnswers, setVisibleAnswers] = useState({});

  // Edit state
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editedQuestionText, setEditedQuestionText] = useState("");

  // Delete state
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchLessonQuestions(id));
    }
  }, [dispatch, id]);

 useEffect(() => {
  const sorted = [...rawQuestions].sort((a, b) =>
    moment(a.createdAt).diff(moment(b.createdAt))
  );
  setSortedQuestions(sorted);
}, [rawQuestions]);

  const openEditModal = (questionId, currentText) => {
    setEditQuestionId(questionId);
    setEditedQuestionText(currentText);
  };

  const handleSaveUpdate = () => {
    if (editedQuestionText.trim()) {
      dispatch(
        updateQuestion({
          lessonId: id,
          questionId: editQuestionId,
          questionData: { question: editedQuestionText },
        })
      );
      setEditQuestionId(null);
      setEditedQuestionText("");
    }
  };

  const handleConfirmDelete = () => {
    if (deleteQuestionId) {
      dispatch(deleteQuestion({ lessonId: id, questionId: deleteQuestionId }));
      setDeleteQuestionId(null);
    }
  };

  const toggleAnswersVisibility = (questionId) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const isRTL = getDirection(lessonTitle) === "rtl";

  return (
    <>
      <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        {sortedQuestions.map((question) => {
          const questionDirection = getDirection(question.question);
          const questionIsRTL = questionDirection === "rtl";

          return (
            <div
              key={question._id}
              className="relative rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md"
            >
              <div
                className={`flex justify-between items-start ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {question.user?.user_image && (
                    <img
                      src={question.user.user_image.url}
                      alt="User avatar"
                      className="rounded-full object-cover border"
                      style={{ width: 40, height: 40 }}
                    />
                  )}
                  <div
                    className="text-left"
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {question.user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {moment(question.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                {/* Buttons: Edit/Delete/Answer */}
                <div
                  className={`flex items-center gap-1 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {user && question.user && user.id === question.user._id && (
                    <>
                      <button
                        onClick={() =>
                          openEditModal(question._id, question.question)
                        }
                        className="text-muted-foreground hover:text-blue-600 transition p-2 rounded-md hover:bg-accent"
                        title={isRTL ? "تعديل السؤال" : "Modifier la question"}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteQuestionId(question._id)}
                        className="text-muted-foreground hover:text-red-600 transition p-2 rounded-md hover:bg-accent"
                        title={isRTL ? "حذف السؤال" : "Supprimer la question"}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => toggleAnswersVisibility(question._id)}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-accent transition"
                    title={isRTL ? "عرض الإجابات" : "Afficher les réponses"}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Content */}
              <div
                className="mt-3 bg-muted px-4 py-3 rounded-md"
                dir={questionIsRTL ? "rtl" : "ltr"}
                style={{ textAlign: questionIsRTL ? "right" : "left" }}
              >
                <p className="text-sm text-foreground"><MathText text= {question.question}/></p>
              </div>

              {/* Answers Section */}
              {visibleAnswers[question._id] && (
                <div className="mt-4 space-y-2">
                  <AnswerForm
                    questionId={question._id}
                    questionCreatorId={question.user._id}
                    isRTL={isRTL}
                  />
                  <AnswerList questionId={question._id} isRTL={isRTL} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm Update */}
      <ConfirmDialog
        show={!!editQuestionId}
        title={isRTL ? "تعديل السؤال" : "Modifier la question"}
        icon={<Pencil className="h-5 w-5" />}
        message={
          <div className="space-y-3" dir={isRTL ? "rtl" : "ltr"}>
            <p className="text-gray-600">
              {isRTL
                ? "يرجى تعديل سؤالك أدناه:"
                : "Veuillez modifier votre question ci-dessous :"}
            </p>
            <Input
              value={editedQuestionText}
              onChange={(e) => setEditedQuestionText(e.target.value)}
              placeholder={isRTL ? "أدخل سؤالك الجديد" : "Entrez votre nouvelle question"}
              dir={isRTL ? "rtl" : "ltr"}
              className="mt-1"
            />
          </div>
        }
        confirmText={isRTL ? "تحديث" : "Mettre à jour"}
        cancelText={isRTL ? "إلغاء" : "Annuler"}
        onCancel={() => {
          setEditQuestionId(null);
          setEditedQuestionText("");
        }}
        onConfirm={handleSaveUpdate}
      />

      {/* Confirm Deletion */}
      <ConfirmDialog
        show={!!deleteQuestionId}
        title={isRTL ? "تأكيد الحذف" : "Confirmer la suppression"}
        message={
          isRTL
            ? "هل أنت متأكد أنك تريد حذف هذا السؤال؟ هذا الإجراء لا يمكن التراجع عنه."
            : "Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible."
        }
        confirmText={isRTL ? "حذف" : "Supprimer"}
        cancelText={isRTL ? "إلغاء" : "Annuler"}
        destructive
        onCancel={() => setDeleteQuestionId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default QuestionList;
