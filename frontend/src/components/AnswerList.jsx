import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestionAnswers,
  updateAnswer,
  deleteAnswer,
} from "@/store/questionSlice";
import moment from "moment";
import { loggedUser } from "@/store/authSlice";
import { Edit, Trash, Pencil } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { Input } from "./ui/input"; // Adjust import path if needed

const AnswerList = ({ questionId, isRTL }) => {
  const dispatch = useDispatch();
  const answers = useSelector(
    (state) => state.question.answers[questionId] || []
  );
  const status = useSelector((state) => state.question.status);
  const error = useSelector((state) => state.question.error);
  const user = useSelector(loggedUser);

  // Edit state
  const [editAnswerId, setEditAnswerId] = useState(null);
  const [editedAnswerText, setEditedAnswerText] = useState("");

  // Delete state
  const [deleteAnswerId, setDeleteAnswerId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuestionAnswers(questionId));
  }, [dispatch, questionId]);

  const handleDelete = (answerId) => {
    setDeleteAnswerId(answerId);
  };

  const openEditModal = (answerId, currentText) => {
    setEditAnswerId(answerId);
    setEditedAnswerText(currentText);
  };

  const handleSaveUpdate = () => {
    if (editedAnswerText.trim()) {
      dispatch(
        updateAnswer({
          questionId,
          answerId: editAnswerId,
          answerData: { answer: editedAnswerText },
        })
      );
      setEditAnswerId(null);
      setEditedAnswerText("");
    }
  };

  const handleConfirmDelete = () => {
    if (deleteAnswerId) {
      dispatch(deleteAnswer({ questionId, answerId: deleteAnswerId }));
      setDeleteAnswerId(null);
    }
  };

  if (status === "loading") {
    return <p>{isRTL ? "جاري تحميل الإجابات..." : "Loading answers..."}</p>;
  }

  if (status === "failed") {
    return (
      <p>
        {isRTL ? "خطأ في تحميل الإجابات:" : "Error loading answers:"} {error}
      </p>
    );
  }

  answers.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));

  return (
    <>
      <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        {answers.map((answer) => (
          <div
            key={answer._id}
            className="relative rounded-xl bg-background px-3 py-1"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            <div
              className={`flex justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {answer.user && (
                  <img
                    src={answer.user.user_image.url}
                    alt="User"
                    className="rounded-full object-cover"
                    style={{ width: 40, height: 40 }}
                  />
                )}
                <div
                  className="text-gray-600 text-sm"
                  style={{ direction: isRTL ? "rtl" : "ltr" }}
                >
                  <span className="font-semibold">{answer.user?.username}</span>
                  <h4>{moment(answer.createdAt).fromNow()}</h4>
                </div>
              </div>

              <div className="flex justify-end items-center gap-1">
                {user && user.id === answer.user._id && (
                  <>
                    <button
                      className="text-blue-800 px-1 py-1 rounded flex items-center"
                      onClick={() => openEditModal(answer._id, answer.answer)}
                      title={isRTL ? "تعديل الإجابة" : "Edit answer"}
                    >
                      <Edit />
                    </button>
                    <button
                      className="text-red-500 px-1 py-1 rounded flex items-center"
                      onClick={() => handleDelete(answer._id)}
                      title={isRTL ? "حذف الإجابة" : "Delete answer"}
                    >
                      <Trash />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="my-2">
              <p className="mt-2 text-gray-700">{answer.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Answer Modal */}
      <ConfirmDialog
        show={!!editAnswerId}
        title={isRTL ? "تعديل الإجابة" : "Edit Answer"}
        icon={<Pencil className="h-5 w-5" />}
        message={
          <div className="space-y-3" dir={isRTL ? "rtl" : "ltr"}>
            <p className="text-gray-600">
              {isRTL
                ? "يرجى تعديل إجابتك أدناه:"
                : "Please edit your answer below:"}
            </p>
            <Input
              value={editedAnswerText}
              onChange={(e) => setEditedAnswerText(e.target.value)}
              placeholder={isRTL ? "أدخل الإجابة المحدثة:" : "Enter the updated answer:"}
              dir={isRTL ? "rtl" : "ltr"}
              className="mt-1"
            />
          </div>
        }
        confirmText={isRTL ? "تحديث" : "Update"}
        cancelText={isRTL ? "إلغاء" : "Cancel"}
        onCancel={() => {
          setEditAnswerId(null);
          setEditedAnswerText("");
        }}
        onConfirm={handleSaveUpdate}
      />

      {/* Confirm Deletion Modal */}
      <ConfirmDialog
        show={!!deleteAnswerId}
        title={isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
        message={
          isRTL
            ? "هل أنت متأكد من حذف هذه الإجابة؟"
            : "Are you sure you want to delete this answer?"
        }
        confirmText={isRTL ? "حذف" : "Delete"}
        cancelText={isRTL ? "إلغاء" : "Cancel"}
        destructive
        onCancel={() => setDeleteAnswerId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default AnswerList;
