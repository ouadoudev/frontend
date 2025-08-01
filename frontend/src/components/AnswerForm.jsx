import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAnswerToQuestion } from '@/store/questionSlice';
import socket from '@/utils/socket';
import { loggedUser } from '@/store/authSlice';
import { Button } from './ui/button';
import { SendIcon } from 'lucide-react';

const AnswerForm = ({ questionId, questionCreatorId, isRTL }) => {
  const dispatch = useDispatch();
  const [newAnswer, setNewAnswer] = useState('');
  const user = useSelector(loggedUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id || !user.token) {
      alert(isRTL ? 'المستخدم غير مصادق عليه' : 'User not authenticated');
      return;
    }

    const answerData = {
      user: user.id,
      answer: newAnswer,
    };

    try {
      await dispatch(addAnswerToQuestion({ questionId, answerData }));

      // Emit socket notification (assuming socket setup supports this)
      socket.to(questionCreatorId).emit('notification', {
        questionId,
        answer: newAnswer,
        userId: user.id,
        username: user.username,
      });

      setNewAnswer("");
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <textarea
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        placeholder={isRTL ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
        required
        className="w-full p-2 rounded-xl border border-gray-300"
        style={{ textAlign: isRTL ? 'right' : 'left' }}
      ></textarea>
      <Button
        type="submit"
        size="icon"
        className={`absolute w-8 h-8 top-3 ${isRTL ? 'left-3' : 'right-3'} flex items-center justify-center bg-transparent text-black hover:bg-transparent hover:text-gray-700`}
        aria-label={isRTL ? 'إرسال الإجابة' : 'Send answer'}
      >
        <SendIcon className="w-5 h-5" />
      </Button>
    </form>
  );
};

export default AnswerForm;
