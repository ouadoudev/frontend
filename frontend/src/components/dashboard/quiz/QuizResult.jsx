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
  Star,
  Clock,
  BarChart3,
  X,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import katex from "katex";
import "katex/dist/katex.min.css";

const MathText = ({ text, dir = "ltr", className = "" }) => {
  if (!text) return null;

  const renderWithKaTeX = (content) => {
    const latexRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = latexRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const latexContent = match[1] || match[2];
      const isDisplayMode = match[1] !== undefined;

      try {
        const html = katex.renderToString(latexContent, {
          displayMode: isDisplayMode,
          throwOnError: false,
          output: "html",
        });
        parts.push(
          <span key={match.index} dangerouslySetInnerHTML={{ __html: html }} />,
        );
      } catch (error) {
        parts.push(`$${latexContent}$`);
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    return parts.length > 0 ? parts : content;
  };

  return (
    <span dir={dir} className={cn("inline-block", className)}>
      {renderWithKaTeX(text)}
    </span>
  );
};

const QuizResult = ({
  result,
  lessonTitle,
  onRetake,
  isRetaking,
  alreadyPassed = false,
  onClose,
  isInDialog = false,
}) => {
  const isPassed = result.percentageScore >= 75;
  const correctAnswers = result.results?.filter((r) => r.isCorrect).length || 0;
  const totalQuestions = result.results?.length || 0;

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const isRTL = getDirection(lessonTitle || "") === "rtl";

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  console.log("QuizResult Rendered with result:", result);
  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto space-y-6",
        isRTL ? "text-right" : "text-left",
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card
        className={cn(
          "shadow-xl border-2 bg-gradient-to-br transition-all overflow-hidden",
          isPassed || alreadyPassed
            ? "from-emerald-50 to-green-50 border-emerald-200"
            : "from-red-50 to-pink-50 border-red-200",
        )}
      >
        <CardHeader className="text-center relative pb-2">
          {isInDialog && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={cn("absolute top-2", isRTL ? "left-2" : "right-2")}
            >
              <X className="w-5 h-5" />
            </Button>
          )}

          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-md mb-4">
            {isPassed || alreadyPassed ? (
              <Trophy className="w-10 h-10 text-yellow-500" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-red-500" />
            )}
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            {alreadyPassed
              ? isRTL
                ? "اكتمل بنجاح"
                : "Déjà complété"
              : isPassed
                ? isRTL
                  ? "تهانينا !"
                  : "Félicitations !"
                : isRTL
                  ? "حاول مرة أخرى"
                  : "Continuez d'essayer !"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 px-4 sm:px-8">
          {/* Score Principal */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative inline-flex items-center">
              <span
                className={cn(
                  "text-6xl font-black tabular-nums",
                  getScoreColor(result.percentageScore),
                )}
              >
                {result.percentageScore}%
              </span>
              <Badge
                className={cn(
                  "ml-4",
                  isPassed || alreadyPassed ? "bg-green-600" : "bg-red-600",
                )}
              >
                {isPassed || alreadyPassed
                  ? isRTL
                    ? "ناجح"
                    : "RÉUSSI"
                  : isRTL
                    ? "راسب"
                    : "ÉCHOUÉ"}
              </Badge>
            </div>
            <Progress
              value={result.percentageScore}
              className="h-3 w-full max-w-md"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <StatItem
              icon={<CheckCircle className="text-green-600" />}
              value={correctAnswers}
              label={isRTL ? "صحيح" : "Correct"}
            />
            <StatItem
              icon={<BarChart3 className="text-blue-600" />}
              value={totalQuestions}
              label={isRTL ? "أسئلة" : "Questions"}
            />
            <StatItem
              icon={<Clock className="text-orange-600" />}
              value={result.timeTaken ? formatTime(result.timeTaken) : "--:--"}
              label={isRTL ? "وقت" : "Temps"}
            />
          </div>

          <Separator />
          {/* Détails des Questions */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              {isRTL ? "مراجعة الإجابات" : "Révision des réponses"}
            </h3>
            <div className="space-y-4">
              {result.results?.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-4 rounded-xl border-l-4 bg-white shadow-sm transition-all hover:shadow-md",
                    item.isCorrect ? "border-l-green-500" : "border-l-red-500",
                  )}
                >
                  {/* En-tête de la question : Numéro + Texte de la question */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="h-7 w-7 rounded-full flex items-center justify-center p-0 shrink-0 border-2 font-bold text-gray-600"
                      >
                        {idx + 1}
                      </Badge>
                      <MathText
                        text={item.question}
                        className="font-bold text-gray-900 text-sm sm:text-base leading-tight"
                      />
                    </div>

                    {/* Badge de statut à droite */}
                    <div className="shrink-0 self-end sm:self-center">
                      {item.isCorrect ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-2 py-0.5 gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">
                            {isRTL ? "صحيح" : "Correct"}
                          </span>
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 px-2 py-0.5 gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">
                            {isRTL ? "خطأ" : "Incorrect"}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Réponses utilisateur et correcte */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div
                      className={cn(
                        "p-3 rounded-lg border",
                        item.isCorrect
                          ? "bg-green-50/50 border-green-100"
                          : "bg-red-50/50 border-red-100",
                      )}
                    >
                      <span className="text-gray-500 block text-[10px] font-bold uppercase mb-1">
                        {isRTL ? "إجابتك:" : "Votre réponse:"}
                      </span>
                      <MathText
                        text={item.userAnswer}
                        className={
                          item.isCorrect ? "text-green-800" : "text-red-800"
                        }
                      />
                    </div>

                    {!item.isCorrect && (
                      <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                        <span className="text-gray-500 block text-[10px] font-bold uppercase mb-1">
                          {isRTL ? "الإجابة الصحيحة:" : "Réponse correcte:"}
                        </span>
                        <MathText
                          text={item.correctAnswer}
                          className="text-blue-800 font-medium"
                        />
                      </div>
                    )}
                  </div>

                  {/* Explication (Rationale) */}
                  {item.rationale && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 border-dashed text-sm text-slate-700">
                      <div className="flex items-center gap-2 mb-1 text-indigo-600">
                        <Info className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase">
                          {isRTL ? "توضيح:" : "Explication:"}
                        </span>
                      </div>
                      <MathText
                        text={item.rationale}
                        className="italic leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bouton Recommencer */}
          {!isPassed && !alreadyPassed && onRetake && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={onRetake}
                disabled={isRetaking}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 px-12"
              >
                {isRetaking ? (
                  <RotateCcw className="animate-spin mr-2" />
                ) : (
                  <RotateCcw className="mr-2" />
                )}
                {isRTL ? "إعادة المحاولة" : "Réessayer l'examen"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StatItem = ({ icon, value, label }) => (
  <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
    <div className="mb-1">{icon}</div>
    <div className="text-lg font-bold text-gray-800">{value}</div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
      {label}
    </div>
  </div>
);

export default QuizResult;
