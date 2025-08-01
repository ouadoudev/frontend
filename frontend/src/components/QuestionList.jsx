// import  { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchLessonQuestions, updateQuestion, deleteQuestion } from '@/store/questionSlice';
// import { loggedUser } from '@/store/authSlice';
// import { useParams } from 'react-router-dom';
// import moment from 'moment';
// import AnswerForm from './AnswerForm';
// import AnswerList from './AnswerList';

// const QuestionList = () => {
//   const { id } = useParams();
//   const user = useSelector(loggedUser);
//   const dispatch = useDispatch();
//   const rawQuestions = useSelector((state) => state.question.questions);
//   const [sortedQuestions, setSortedQuestions] = useState([]);
//   const [visibleAnswers, setVisibleAnswers] = useState({});

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchLessonQuestions(id));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     const sorted = [...rawQuestions].sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
//     setSortedQuestions(sorted);
//   }, [rawQuestions]);

//   const handleUpdate = (lessonId, questionId) => {
//     const newQuestionText = prompt('Enter the updated question:');
//     if (newQuestionText) {
//       dispatch(updateQuestion({ lessonId, questionId, questionData: { question: newQuestionText } }));
//     }
//   };

//   const handleDelete = (lessonId, questionId) => {
//     if (window.confirm('Are you sure you want to delete this question?')) {
//       dispatch(deleteQuestion({ lessonId, questionId }));
//     }
//   };

//   const toggleAnswersVisibility = (questionId) => {
//     setVisibleAnswers((prev) => ({
//       ...prev,
//       [questionId]: !prev[questionId],
//     }));
//   };

//   return (
//     <div className="space-y-4">
//       {sortedQuestions.map((question) => (

//         <div key={question._id} className="rounded-lg border bg-background p-4">
//           <div>
//             <div className="flex items-center gap-4">
//               {question.user?.user_image && (
//                 <img
//                   src={question.user.user_image.url}
//                   alt="User"
//                   className="rounded-xl object-cover"
//                   style={{ width: 40, height: 40 }}
//                 />
//               )}
//               <div className="text-gray-600 text-sm">
//                 <span className="font-semibold">{question.user?.username}</span>
//                 <h4>{moment(question.createdAt).fromNow()}</h4>
//               </div>
//             </div>
//           </div>
//           <p className="text-gray-700 mt-2">{question.question}</p>
//           <div className="flex gap-2 mt-2">
//           <button className=" text-gray-900 px-2 py-1 rounded"
//             onClick={() => toggleAnswersVisibility(question._id)}>Answer</button>
//           </div>

//           {user && question.user && user.id === question.user._id && (
//             <div className="flex gap-2 mt-2">
//               <button
//                 className="bg-blue-500 text-white px-2 py-1 rounded"
//                 onClick={() => handleUpdate(id, question._id)}
//               >
//                 Update
//               </button>
//               <button
//                 className="bg-red-500 text-white px-2 py-1 rounded"
//                 onClick={() => handleDelete(id, question._id)}
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//           {visibleAnswers[question._id] && (
//             <div className="mt-2">
//               <AnswerForm questionId={question._id} />
//               <AnswerList questionId={question._id} />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default QuestionList;

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
      moment(b.createdAt).diff(moment(a.createdAt))
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
                <p className="text-sm text-foreground">{question.question}</p>
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


// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchLessonQuestions,
//   updateQuestion,
//   deleteQuestion,
// } from "@/store/questionSlice";
// import { loggedUser } from "@/store/authSlice";
// import { useParams } from "react-router-dom";
// import moment from "moment";
// import AnswerForm from "./AnswerForm";
// import AnswerList from "./AnswerList";
// import { Edit, Trash, MessageCircle } from "lucide-react";

// const QuestionList = () => {
//   const { id } = useParams();
//   const user = useSelector(loggedUser);
//   const dispatch = useDispatch();
//   const rawQuestions = useSelector((state) => state.question.questions);
//   const [sortedQuestions, setSortedQuestions] = useState([]);
//   const [visibleAnswers, setVisibleAnswers] = useState({});

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchLessonQuestions(id));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     const sorted = [...rawQuestions].sort((a, b) =>
//       moment(b.createdAt).diff(moment(a.createdAt))
//     );
//     setSortedQuestions(sorted);
//   }, [rawQuestions]);

//   const handleUpdate = (lessonId, questionId) => {
//     const newQuestionText = prompt("Enter the updated question:");
//     if (newQuestionText) {
//       dispatch(
//         updateQuestion({
//           lessonId,
//           questionId,
//           questionData: { question: newQuestionText },
//         })
//       );
//     }
//   };

//   const handleDelete = (lessonId, questionId) => {
//     if (window.confirm("Are you sure you want to delete this question?")) {
//       dispatch(deleteQuestion({ lessonId, questionId }));
//     }
//   };

//   const toggleAnswersVisibility = (questionId) => {
//     setVisibleAnswers((prev) => ({
//       ...prev,
//       [questionId]: !prev[questionId],
//     }));
//   };

//   return (
//     <div className="space-y-4">
//     {sortedQuestions.map((question) => (

//       <div
//         key={question._id}
//         className="relative rounded-xl  bg-background px-3 py-2"
//       >
//         <div className="flex justify-between">
//         <div>
//           <div className="flex items-center gap-4">
//             {question.user?.user_image && (
//               <img
//                 src={question.user.user_image.url}
//                 alt="User"
//                 className="rounded-xl object-cover"
//                 style={{ width: 40, height: 40 }}
//               />
//             )}
//             <div className="text-gray-600 text-sm">
//               <span className="font-semibold">{question.user?.username}</span>
//               <h4>{moment(question.createdAt).fromNow()}</h4>
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-end items-center">
//           <div className="flex items-center space-x-1">
//             {user && question.user && user.id === question.user._id && (
//               <>
//                 <button
//                   className="text-blue-800 px-1 py-1 rounded flex items-center"
//                   onClick={() => handleUpdate(id, question._id)}
//                 >
//                   <Edit/>
//                 </button>
//                 <button
//                   className="text-red-500 px-1 py-1 rounded flex items-center"
//                   onClick={() => handleDelete(id, question._id)}
//                 >
//                   <Trash />
//                 </button>
//               </>
//             )}
//             <button
//               className="text-gray-900 px-2 py-1 rounded flex items-center gap-1"
//               onClick={() => toggleAnswersVisibility(question._id)}
//             >
//               <MessageCircle />
//               <span>Answer</span>
//             </button>
//           </div>
//         </div>
//         </div>

//         <div className="my-2">
//           <p className="text-gray-700">{question.question}</p>
//         </div>

//         {visibleAnswers[question._id] && (
//           <div className="mt-2">
//             <AnswerForm questionId={question._id} questionCreatorId={question.user._id}/>
//             <AnswerList questionId={question._id} />
//           </div>
//         )}
//       </div>
//     ))}
//   </div>

//   );
// };

// export default QuestionList;
