import { useState } from "react";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import { ScrollArea } from "./ui/scroll-area";
import { MessageCircle, Users } from "lucide-react";
import { Separator } from "./ui/separator";

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
    <div className="flex flex-col h-full border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* En-tête de la section */}
      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1 justify-center">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-900">
            {isRTL ? "الأسئلة والمناقشات" : "Aide et Discussions"}
          </h2>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 opacity-70" />
          <p>
            {isRTL ? "لست وحدك، " : "Vous n'êtes pas seul, "}
            <span className="font-semibold text-primary/90">
              {isRTL ? "اسأل وناقش مع زملائك" : "interagissez avec vos collègues."}
            </span>
          </p>
        </div>
      </div>

      {/* Zone des questions avec ScrollArea */}
      <div className="relative flex-1 bg-white">
        <ScrollArea className="h-[360px] lg:h-[480px] px-4 py-2">
          <div className="space-y-4">
            <QuestionList lessonTitle={lessonTitle} />
          </div>
        </ScrollArea>
        
        {/* Ombre subtile pour indiquer le défilement en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <Separator />

      {/* Formulaire en bas - Fixé */}
      <div className="p-4 bg-gray-50/30">
        <QuestionForm lessonTitle={lessonTitle} />
      </div>
    </div>
  );
};

export default DiscussionForum;
