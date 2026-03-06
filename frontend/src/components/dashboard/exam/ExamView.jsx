import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExamById } from "@/store/examSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import katex from "katex";
import "katex/dist/katex.min.css";
import {
  Clock,
  FileText,
  ArrowLeft,
  Loader2,
  BookOpen,
  Target,
  Timer,
  CheckCircle,
  AlertCircle,
  Play,
  Award,
  Zap,
} from "lucide-react";

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
          <span key={match.index} dangerouslySetInnerHTML={{ __html: html }} />
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

const ExamView = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentExam, loading, error } = useSelector((state) => state.exam);
  const user = useSelector((state) => state.auth.user);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isStarting, setIsStarting] = useState(false);


  useEffect(() => {
    if (examId) {
      dispatch(getExamById(examId));
    }
  }, [dispatch, examId]);

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const isRTL = getDirection(currentExam?.course?.title) === "rtl";

  // Translation helper (French, Arabic)
  const t = (fr, ar) => (isRTL ? ar : fr);

  const handleStartExam = () => {
    setIsStarting(true);
    setTimeout(() => {
      navigate(`/exam/${currentExam._id}/submit`);
    }, 1500);
  };

  useEffect(() => {
    if (currentExam?.exercises?.[0]?.exercise?.timeLimit) {
      const totalTime = currentExam.exercises.reduce(
        (sum, ex) => sum + (ex.exercise?.timeLimit || 0),
        0
      );
      setTimeRemaining(totalTime);
    }
  }, [currentExam]);

const formatTime = (seconds, isRTL = false) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hLabel = isRTL ? "س" : "h";
  const mLabel = isRTL ? "د" : "min";
  const sLabel = isRTL ? "ث" : "s";

  if (hours > 0) {
    return `${hours}${hLabel} ${minutes.toString().padStart(2, "0")}${mLabel} ${secs
      .toString()
      .padStart(2, "0")}${sLabel}`;
  }

  return `${minutes}${mLabel} ${secs.toString().padStart(2, "0")}${sLabel}`;
};


  const iconMargin = (pos = "left") => {
    if (isRTL) return pos === "left" ? "ml-2" : "mr-2";
    return pos === "left" ? "mr-2" : "ml-2";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            {t(
              `Erreur lors du chargement de l'examen : ${error}`,
              `حدث خطأ أثناء تحميل الامتحان: ${error}`
            )}
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mt-2 flex items-center justify-center"
          >
            <ArrowLeft className={`h-4 w-4 ${iconMargin("right")}`} />
            {t("Retour", "عودة")}
          </Button>
        </div>
      </div>
    );
  }

  if (!currentExam) {
    return (
      <div className="max-w-2xl mx-auto p-4" dir={isRTL ? "rtl" : "ltr"}>
        <p>{t("Examen introuvable.", "الامتحان غير موجود.")}</p>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mt-2 flex items-center justify-center"
        >
          <ArrowLeft className={`h-4 w-4 ${iconMargin("right")}`} />
          {t("Retour", "عودة")}
        </Button>
      </div>
    );
  }

  return (
  <div
  dir={isRTL ? "rtl" : "ltr"}
  className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
>
  {/* Main Content */}
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
    
    {/* Hero Section */}
    <div className="text-center mb-8 sm:mb-12">
      <div className={`flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-evenly mb-6`}>
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
          <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
        </div>
        <h1
          className={`text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight text-center ${
            isRTL ? "sm:text-right" : "sm:text-left"
          }`}
        >
          {currentExam.title}
        </h1>
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
        <BookOpen className="h-4 w-4" />
        {currentExam.course?.title}
      </div>
    </div>

    {/* Exam Stats - Grid responsive: 1 col sur mobile, 3 sur desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {/* Stat Card Item Helper */}
      {[
        { icon: <FileText className="text-blue-600" />, bg: "bg-blue-100", val: currentExam.exercises?.length || 0, label: t("Exercices", "تمارين") },
        { icon: <Clock className="text-green-600" />, bg: "bg-green-100", val: timeRemaining ? formatTime(timeRemaining, isRTL) : "∞", label: t("Durée", "المدة") },
        { icon: <Target className="text-purple-600" />, bg: "bg-purple-100", val: "1", label: t("Tentative", "محاولة") }
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{stat.val}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Instructions */}
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {t("Consignes importantes", "تعليمات مهمة")}
        </h3>
      </div>
      <ul className={`space-y-3 text-gray-600 text-sm sm:text-base ${isRTL ? "pr-2" : "pl-2"}`}>
        {[
          t("Vous n'avez qu'une seule tentative pour cet examen", "لديك محاولة واحدة فقط لاجتياز هذا الامتحان"),
          t("Assurez-vous d'une connexion Internet stable", "تأكد من أن لديك اتصالًا ثابتًا بالإنترنت"),
          t("Le chronomètre démarre dès que vous commencez l'examen", "سيبدأ المؤقت بمجرد بدء الامتحان"),
          t("Vous pouvez naviguer librement entre les questions", "يمكنك التنقل بين الأسئلة بحرية"),
          t("Vos réponses sont enregistrées automatiquement", "يتم حفظ إجاباتك تلقائيًا أثناء التقدم")
        ].map((text, idx) => (
          <li key={idx} className="flex gap-3 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Exercise List */}
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {t("Contenu de l'examen", "محتوى الامتحان")}
        </h3>
      </div>

      <div className="space-y-3">
        {currentExam.exercises?.map((exercise, index) => (
          <div
            key={exercise._id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4 hover:bg-gray-100 transition-colors border border-transparent hover:border-blue-100`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-sm font-bold text-gray-700">{index + 1}</span>
              </div>
              <div className="w-96 sm:w-auto">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                  <MathText text={exercise.exercise?.title}/>
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t("De la leçon", "من الدرس")}: {exercise.lesson?.title}
                </p>
              </div>
            </div>
            <div className={`flex items-center justify-between sm:justify-end gap-3`}>
              {exercise.exercise?.timeLimit && (
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100">
                  <Timer className="h-3 w-3" />
                  {formatTime(exercise.exercise.timeLimit, isRTL)}
                </div>
              )}
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 whitespace-nowrap">
                {t(`Exercice ${index + 1}`, `تمرين ${index + 1}`)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Action Buttons - Stack vertical on mobile */}
    <div className={`flex flex-col sm:flex-row gap-4`}>
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        size="lg"
        className="w-full sm:w-auto border-2 py-6 border-gray-200 hover:border-gray-300 px-8"
      >
        <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
        {t("Annuler", "إلغاء")}
      </Button>
      <Button
        onClick={handleStartExam}
        disabled={isStarting}
        size="lg"
        className="w-full flex-1 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isStarting ? (
          <><Loader2 className="h-5 w-5 animate-spin mr-2 ml-2" /> {t("Démarrage...", "جاري البدء...")}</>
        ) : (
          <><Play className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} /> {t("Commencer l'examen", "بدء الامتحان")}</>
        )}
      </Button>
    </div>

    {/* Footer Info */}
    <div className="mt-8 sm:mt-12 pt-6 border-t border-gray-200">
      <div className={`flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs sm:text-sm text-gray-500`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-indigo-500" />
            <span>{t("Contribue à la note finale", "يساهم في الدرجة النهائية")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>{t("Sauvegarde automatique", "حفظ تلقائي")}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default ExamView;
