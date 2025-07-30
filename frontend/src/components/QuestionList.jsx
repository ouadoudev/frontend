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
import { Edit, Trash, MessageCircle } from "lucide-react";

const QuestionList = () => {
  const { id } = useParams();
  const user = useSelector(loggedUser);
  const dispatch = useDispatch();
  const rawQuestions = useSelector((state) => state.question.questions);
  const [sortedQuestions, setSortedQuestions] = useState([]);
  const [visibleAnswers, setVisibleAnswers] = useState({});

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

  const handleUpdate = (lessonId, questionId) => {
    const newQuestionText = prompt("Enter the updated question:");
    if (newQuestionText) {
      dispatch(
        updateQuestion({
          lessonId,
          questionId,
          questionData: { question: newQuestionText },
        })
      );
    }
  };

  const handleDelete = (lessonId, questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      dispatch(deleteQuestion({ lessonId, questionId }));
    }
  };

  const toggleAnswersVisibility = (questionId) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return (
    <div className="space-y-4">
    {sortedQuestions.map((question) => (
      
      <div
        key={question._id}
        className="relative rounded-xl  bg-background px-3 py-2"
      >
        <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-4">
            {question.user?.user_image && (
              <img
                src={question.user.user_image.url}
                alt="User"
                className="rounded-xl object-cover"
                style={{ width: 40, height: 40 }}
              />
            )}
            <div className="text-gray-600 text-sm">
              <span className="font-semibold">{question.user?.username}</span>
              <h4>{moment(question.createdAt).fromNow()}</h4>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-1">
            {user && question.user && user.id === question.user._id && (
              <>
                <button
                  className="text-blue-800 px-1 py-1 rounded flex items-center"
                  onClick={() => handleUpdate(id, question._id)}
                >
                  <Edit/>
                </button>
                <button
                  className="text-red-500 px-1 py-1 rounded flex items-center"
                  onClick={() => handleDelete(id, question._id)}
                >
                  <Trash />
                </button>
              </>
            )}
            <button
              className="text-gray-900 px-2 py-1 rounded flex items-center gap-1"
              onClick={() => toggleAnswersVisibility(question._id)}
            >
              <MessageCircle />
              <span>Answer</span>
            </button>
          </div>
        </div>
        </div>
   

        <div className="my-2">
          <p className="text-gray-700">{question.question}</p>
        </div>
      
        {visibleAnswers[question._id] && (
          <div className="mt-2">
            <AnswerForm questionId={question._id} questionCreatorId={question.user._id}/>
            <AnswerList questionId={question._id} />
          </div>
        )}
      </div>
    ))}
  </div>
  
  );
};

export default QuestionList;
