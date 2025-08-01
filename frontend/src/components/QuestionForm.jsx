import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuestionToLesson } from "@/store/questionSlice";
import socket from "@/utils/socket";
import { loggedUser } from "@/store/authSlice";
import { useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";

const QuestionForm = ({ lessonTitle }) => {
  const { id } = useParams();
  const user = useSelector(loggedUser);
  const [newQuestion, setNewQuestion] = useState("");
  const dispatch = useDispatch();

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    await dispatch(
      addQuestionToLesson({
        lessonId: id,
        questionData: {
          user: user.id,
          question: newQuestion,
        },
      })
    );

    socket.emit("notification", {
      lessonId: id,
      question: newQuestion,
      userId: user.id,
      username: user.username,
    });

    setNewQuestion("");
  };

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const isRTL = getDirection(lessonTitle) === "rtl";

  return (
    <div className="grid gap-4">
      <form onSubmit={handleSubmitQuestion} className="relative">
        <Textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder={
            isRTL ? "اكتب سؤالك هنا..." : "Écrivez votre question ici..."
          }
          required
          dir={isRTL ? "rtl" : "ltr"}
          className={`pr-12 w-full max-h-32 p-2 mb-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary`}
        />
        <Button
          type="submit"
          size="icon"
          className={`absolute w-8 h-8 top-2 ${
            isRTL ? "left-3" : "right-3"
          } flex items-center justify-center  bg-transparent text-black hover:bg-transparent hover:text-gray-700 "
       `}
          aria-label={isRTL ? "إرسال السؤال" : "Envoyer la question"}
        >
          <SendIcon className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default QuestionForm;
