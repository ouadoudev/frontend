import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  TrendingUp,
  Lock,
  Star,
  Clock,
  BarChart3,
  Home,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QuizResult = ({
  result,
  lessonTitle,
  onRetake,
  isRetaking,
  error,
  alreadyPassed = false,
  onClose,
  isInDialog = false,
}) => {
  const isPassed = result.percentageScore >= 75;
  const correctAnswers = result.results?.filter((r) => r.isCorrect).length || 0;
  const totalQuestions = result.results?.length || 0;

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "from-emerald-50 to-green-50 border-emerald-200";
    if (score >= 75) return "from-blue-50 to-indigo-50 border-blue-200";
    if (score >= 60) return "from-yellow-50 to-orange-50 border-yellow-200";
    return "from-red-50 to-pink-50 border-red-200";
  };

  const getPerformanceMessage = (score) => {
    if (score >= 90)
      return isRTL
        ? "أداء متميز! لقد أتقنت هذا الموضوع."
        : "Performance exceptionnelle ! Vous avez maîtrisé ce sujet.";
    if (score >= 75)
      return isRTL
        ? "عمل رائع! لقد نجحت في اجتياز الاختبار."
        : "Excellent travail ! Vous avez réussi le quiz.";
    if (score >= 60)
      return isRTL
        ? "جهد جيد! أنت قريب من النجاح. حاول مرة أخرى لتحسين درجتك."
        : "Bon effort ! Vous êtes proche de la réussite. Réessayez pour améliorer.";
    return isRTL
      ? "واصل الدراسة وحاول مرة أخرى. يمكنك تحقيق نتيجة أفضل!"
      : "Continuez à étudier et réessayez. Vous pouvez faire mieux !";
  };

  const getPerformanceIcon = (score) => {
    if (alreadyPassed) return <Star className="w-10 h-10 text-emerald-500" />;
    if (score >= 90) return <Trophy className="w-10 h-10 text-yellow-500" />;
    if (score >= 75) return <Award className="w-10 h-10 text-blue-500" />;
    if (score >= 60)
      return <TrendingUp className="w-10 h-10 text-yellow-500" />;
    return <AlertTriangle className="w-10 h-10 text-red-500" />;
  };

  const formatTime = (seconds) => {
    const totalSeconds = Math.ceil(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const isRTL = getDirection(lessonTitle || "") === "rtl";

  return (
   <div
      className={cn(
        "w-full max-w-full mx-auto space-y-4 sm:space-y-6 px-2 sm:px-6 overflow-x-hidden",
        isRTL ? "text-right" : "text-left"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card
        className={cn(
          "shadow-xl border-2 bg-gradient-to-br transition-all",
          alreadyPassed
            ? "from-emerald-50 to-green-50 border-emerald-200"
            : getScoreBgColor(result.percentageScore)
        )}
      >
        <CardHeader className="text-center space-y-4 pb-4 px-4 sm:px-6 relative">
          {/* Bouton Fermer optimisé */}
          {isInDialog && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={cn("absolute top-2 z-10", isRTL ? "left-2" : "right-2")}
            >
              <X className="w-5 h-5" />
            </Button>
          )}

          {/* Icone de performance adaptable */}
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg shrink-0">
            {getPerformanceIcon(result.percentageScore)}
          </div>

          <div className="space-y-1 px-2 sm:px-6">
            <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
              {alreadyPassed 
                ? (isRTL ? "الاختبار مكتمل بالفعل !" : "Quiz déjà complété !") 
                : isPassed 
                ? (isRTL ? "تهانينا !" : "Félicitations !") 
                : (isRTL ? "استمر في المحاولة!" : "Continuez d'essayer !")}
            </CardTitle>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-snug">
              {alreadyPassed 
                ? (isRTL ? "لقد نجحت في هذا الاختبار من قبل." : "Vous avez déjà réussi ce quiz.") 
                : getPerformanceMessage(result.percentageScore)}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 px-4 sm:px-8 pb-8">
          {/* Section Score - Correction du Badge décalé */}
          <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center">
              <div className={cn(
                  "text-4xl lg:text-6xl font-black tabular-nums",
                  alreadyPassed ? "text-emerald-600" : getScoreColor(result.percentageScore)
                )}
              >
                {result.percentageScore}%
              </div>
              <Badge
                variant={isPassed || alreadyPassed ? "default" : "secondary"}
                className={cn(
                  "mt-2 sm:absolute sm:mt-0 sm:-top-2 sm:-right-20 text-xs font-bold py-1 px-3",
                  isPassed || alreadyPassed
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-100 text-red-800 border-red-300"
                )}
              >
                {isPassed || alreadyPassed ? (isRTL ? "نجاح" : "RÉUSSI") : (isRTL ? "لم تنجح" : "ÉCHOUÉ")}
              </Badge>
            </div>
            <Progress value={result.percentageScore} className="h-3 w-full max-w-xs sm:max-w-md bg-gray-100" />
          </div>

          {/* Statistiques - Grid responsive */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 ">
            <StatItem 
              icon={<CheckCircle className="w-10 h-10 text-green-600" />}
              value={correctAnswers}
              label={isRTL ? "صحصيحة" : "Correctes"}
              borderColor="border-green-100"
            />
            <StatItem 
              icon={<BarChart3 className="w-10 h-10 text-purple-600" />}
              value={totalQuestions}
              label={isRTL ? "الأسئلة" : "Questions"}
              borderColor="border-purple-100"
            />
            <StatItem 
              icon={<Clock className="w-10 h-10 text-orange-600" />}
              value={result.timeTaken ? formatTime(result.timeTaken) : "--:--"}
              label={isRTL ? "الوقت" : "Temps"}
              borderColor="border-orange-100"
            />
          </div>

          {/* Décomposition des questions - Utilisation de Flex Wrap */}
          {result.results?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                {isRTL ? "تفصيل الأسئلة" : "Détails par question"}
                {alreadyPassed && <Badge className="text-[10px] h-5">Ancien</Badge>}
              </h4>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {result.results.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex flex-col items-center justify-center w-12 h-14 rounded-lg border-2 transition-transform hover:scale-105",
                      item.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    )}
                  >
                    <span className="text-[10px] font-bold text-gray-400">Q{index + 1}</span>
                    {item.isCorrect ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="opacity-50" />

          {/* Actions - Flex-col sur mobile */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-3 w-full",
            isRTL ? "sm:flex-row-reverse" : "sm:justify-center"
          )}>
            {!isPassed && !alreadyPassed && onRetake && (
              <Button
                onClick={onRetake}
                disabled={isRetaking}
                size="lg"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-lg shadow-indigo-100"
              >
                {isRetaking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                {isRTL ? "إعادة الاختبار" : "Réessayer"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Helper pour les stats
const StatItem = ({ icon, value, label, borderColor }) => (
  <div className={cn("bg-white/50 border-2 rounded-xl p-3 flex flex-col items-center justify-center", borderColor)}>
    <div className="p-1.5 bg-white rounded-full shadow-sm mb-1">{icon}</div>
    <div className="text-xl font-bold text-gray-800">{value}</div>
    <div className="text-[10px] font-medium text-gray-500 uppercase">{label}</div>
  </div>
);

export default QuizResult;