import { useState } from "react";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import { ScrollArea } from "./ui/scroll-area";

const DiscussionForum = () => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const toggleQuestionForm = () => {
    setShowQuestionForm(!showQuestionForm);
  };

  return (
    <div className="p-2 pb-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold mx-auto">Aide et Discussions</h2>
      </div>
      <div className="text-center text-sm text-muted-foreground mb-2">
        <p className="italic">
          Besoin d’aide ?{" "}
          <span className="font-medium text-primary">
            Demandez à la communauté.
          </span>
        </p>
      </div>
      <ScrollArea className="lg:h-[520px] h-96  p-4">
        <QuestionList />
      </ScrollArea>
      <QuestionForm />
    </div>
  );
};

export default DiscussionForum;
