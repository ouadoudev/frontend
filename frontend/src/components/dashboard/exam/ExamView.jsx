import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExamById } from "@/store/examSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex space-x-5 items-center justify-evenly">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {currentExam.title}
            </h1>
          </div>
          <div className="inline-flex items-start gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium ">
            <BookOpen className="h-4 w-4" />
            {currentExam.course?.title}
          </div>
        </div>

        {/* Exam Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentExam.exercises?.length || 0}
                </p>
                <p className="text-sm text-gray-600">
                  {t("Exercices", "تمارين")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {timeRemaining ? formatTime(timeRemaining, isRTL) : "∞"}
                </p>
                <p className="text-sm text-gray-600">{t("Durée", "المدة")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">
                  {t("Tentative", "محاولة")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8"
          dir={isRTL ? "rtl" : "ltr"}
        >
             <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {t("Consignes importantes", "تعليمات مهمة")}
            </h3>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <div className={`${isRTL ? "text-start" : ""}`}>
              <ul className="list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-2 text-gray-600">
                <li>
                  {t(
                    "Vous n'avez qu'une seule tentative pour cet examen",
                    "لديك محاولة واحدة فقط لاجتياز هذا الامتحان"
                  )}
                </li>
                <li>
                  {t(
                    "Assurez-vous d'une connexion Internet stable",
                    "تأكد من أن لديك اتصالًا ثابتًا بالإنترنت"
                  )}
                </li>
                <li>
                  {t(
                    "Le chronomètre démarre dès que vous commencez l'examen",
                    "سيبدأ المؤقت بمجرد بدء الامتحان"
                  )}
                </li>
                <li>
                  {t(
                    "Vous pouvez naviguer librement entre les questions",
                    "يمكنك التنقل بين الأسئلة بحرية"
                  )}
                </li>
                <li>
                  {t(
                    "Vos réponses sont enregistrées automatiquement",
                    "يتم حفظ إجاباتك تلقائيًا أثناء التقدم"
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {t("Contenu de l'examen", "محتوى الامتحان")}
            </h3>
          </div>

          <div className="space-y-4">
            {currentExam.exercises?.map((exercise, index) => (
              <div
                key={exercise._id}
                className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-gray-700">
                      {index + 1}
                    </span>
                  </div>
                  <div className={isRTL ? "text-end" : "text-start"}>
                    <h4 className="font-medium text-gray-900">
                      {exercise.exercise?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("De la leçon", "من الدرس")}: {exercise.lesson?.title}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {exercise.exercise?.timeLimit && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Timer className="h-3 w-3" />
                     {formatTime(exercise.exercise.timeLimit, isRTL)}
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 w-24"
                  >
                    {t(`Exercice ${index + 1}`, `تمرين ${index + 1}`)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 ${
            isRTL ? "sm:flex-row-reverse" : ""
          }`}
        >
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            size="lg"
            className={`flex-1 sm:flex-none border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeft className={`h-4 w-4 ${iconMargin("right")}`} />
            {t("Annuler", "إلغاء")}
          </Button>
          <Button
            onClick={handleStartExam}
            disabled={isStarting}
            size="lg"
            className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {isStarting ? (
              <>
                <Loader2
                  className={`h-4 w-4 animate-spin ${iconMargin("left")}`}
                />
                {t("Démarrage...", "جاري البدء...")}
              </>
            ) : (
              <>
                <Play className={`h-4 w-4 ${iconMargin("left")}`} />
                {t("Commencer l'examen", "بدء الامتحان")}
              </>
            )}
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>
                  {t("Contribue à la note finale", "يساهم في الدرجة النهائية")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>
                  {t(
                    "Sauvegarde automatique activée",
                    "تم تفعيل الحفظ التلقائي"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamView;
