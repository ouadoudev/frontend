import { useState } from "react";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import { ScrollArea } from "./ui/scroll-area";

const DiscussionForum = ({lessonTitle}) => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const toggleQuestionForm = () => {
    setShowQuestionForm(!showQuestionForm);
  };
    const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
    return rtlChars.test(text) ? "rtl" : "ltr"
  }

  const isRTL = getDirection(lessonTitle) === "rtl"

  return (
    <div className="p-2 pb-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold mx-auto"> {isRTL ? "الأسئلة والمناقشات" : "Aide et Discussions"}</h2>
      </div>
      <div className="text-center text-sm text-muted-foreground mb-2">
        <p className="italic">
          {isRTL ? "لست وحدك , " : "Besoin d’aide ?"}
          
          <span className="font-medium text-primary">
             {isRTL ? "اسأل وناقش مع زملائك" : " Demandez à la communauté."}
           
          </span>
        </p>
      </div>
      <ScrollArea className="lg:h-[520px] h-96  p-4">
        <QuestionList lessonTitle={lessonTitle}/>
      </ScrollArea>
      <QuestionForm lessonTitle={lessonTitle} />
    </div>
  );
};

export default DiscussionForum;
