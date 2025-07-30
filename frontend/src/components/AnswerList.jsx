/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionAnswers, updateAnswer, deleteAnswer } from '@/store/questionSlice';
import moment from 'moment';
import { loggedUser } from '@/store/authSlice';
import { Edit, Trash } from 'lucide-react';

const AnswerList = ({ questionId }) => {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.question.answers[questionId] || []);
  const status = useSelector((state) => state.question.status);
  const error = useSelector((state) => state.question.error);
  const user = useSelector(loggedUser);

  useEffect(() => {
    dispatch(fetchQuestionAnswers(questionId));
  }, [dispatch, questionId]);

  const handleUpdate = (answerId) => {
    const newAnswerText = prompt('Enter the updated answer:');
    if (newAnswerText) {
      dispatch(updateAnswer({ questionId, answerId, answerData: { answer: newAnswerText } }));
    }
  };

  const handleDelete = (answerId) => {
    if (window.confirm('Are you sure you want to delete this answer?')) {
      dispatch(deleteAnswer({ questionId, answerId }));
    }
  };

  if (status === 'loading') {
    return <p>Loading answers...</p>;
  }

  if (status === 'failed') {
    return <p>Error loading answers: {error}</p>;
  }
  answers.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
  return (
    <div className="space-y-4">
      {answers.map((answer) => (
        <div key={answer._id} className="relative rounded-xl bg-background px-3 py-1">
           <div className='flex justify-between'>
          <div className="flex items-center gap-4">
          {answer.user && (
                        <img
                        src={answer.user.user_image.url}
                        alt="User"
                        className="rounded-full object-cover"
                        style={{ width: 40, height: 40 }}
              />
            )}
            <div className="text-gray-600 text-sm">
              <span className="font-semibold">{answer.user?.username}</span>
              <h4>{moment(answer.createdAt).fromNow()}</h4>
            </div>
          </div>
          <div className="flex justify-end items-center">
          {user && user.id === answer.user._id && ( 
            <>
            <button
              className="text-blue-800 px-1 py-1 rounded flex items-center"
              onClick={() => handleUpdate(answer._id)}
            >
              <Edit />
            </button>
            <button
              className="text-red-500 px-1 py-1 rounded flex items-center"
              onClick={() => handleDelete(answer._id)}
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
  );
};

export default AnswerList;
