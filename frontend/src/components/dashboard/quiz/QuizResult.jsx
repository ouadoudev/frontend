// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import {
//   Trophy,
//   RotateCcw,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Award,
//   TrendingUp,
//   Lock,
//   Star,
//   Clock,
//   BarChart3,
//   Home,
//   X,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const QuizResult = ({
//   result,
//   lessonTitle,
//   onRetake,
//   isRetaking,
//   error,
//   alreadyPassed = false,
//   onClose,
//   isInDialog = false,
// }) => {
//   const isPassed = result.percentageScore >= 75;
//   const correctAnswers = result.results?.filter((r) => r.isCorrect).length || 0;
//   const totalQuestions = result.results?.length || 0;

//   const getScoreColor = (score) => {
//     if (score >= 90) return "text-emerald-600";
//     if (score >= 75) return "text-blue-600";
//     if (score >= 60) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getScoreBgColor = (score) => {
//     if (score >= 90) return "from-emerald-50 to-green-50 border-emerald-200";
//     if (score >= 75) return "from-blue-50 to-indigo-50 border-blue-200";
//     if (score >= 60) return "from-yellow-50 to-orange-50 border-yellow-200";
//     return "from-red-50 to-pink-50 border-red-200";
//   };

//   const getPerformanceMessage = (score) => {
//     if (score >= 90)
//       return "Outstanding performance! You've mastered this topic.";
//     if (score >= 75) return "Great job! You've successfully passed the quiz.";
//     if (score >= 60)
//       return "Good effort! You're close to passing. Try again to improve.";
//     return "Keep studying and try again. You can do better!";
//   };

//   const getPerformanceIcon = (score) => {
//     if (alreadyPassed) return <Star className="w-12 h-12 text-emerald-500" />;
//     if (score >= 90) return <Trophy className="w-12 h-12 text-yellow-500" />;
//     if (score >= 75) return <Award className="w-12 h-12 text-blue-500" />;
//     if (score >= 60)
//       return <TrendingUp className="w-12 h-12 text-yellow-500" />;
//     return <AlertTriangle className="w-12 h-12 text-red-500" />;
//   };

// const formatTime = (seconds) => {
//   const totalSeconds = Math.ceil(seconds);
//   const mins = Math.floor(totalSeconds / 60);
//   const secs = totalSeconds % 60;
//   return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// };


//   const getDirection = (text) => {
//     const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
//     return rtlChars.test(text) ? "rtl" : "ltr";
//   };

//   const isRTL = getDirection(lessonTitle) === "rtl";

// return (
//   <div className="w-full max-w-full sm:max-w-xl md:max-w-4xl mx-auto space-y-6 px-4 sm:px-6 overflow-auto">
//     <Card
//       className={cn(
//         "shadow-xl border-2 bg-gradient-to-br",
//         alreadyPassed
//           ? "from-emerald-50 to-green-50 border-emerald-200"
//           : getScoreBgColor(result.percentageScore)
//       )}
//     >
//       <CardHeader className="text-center space-y-6 pb-6 px-2 sm:px-6">
//         {isInDialog && onClose && (
//           <div className="flex justify-end">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={onClose}
//               className="absolute top-4 right-4"
//             >
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         )}

//         <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-white shadow-lg">
//           {getPerformanceIcon(result.percentageScore)}
//         </div>

//         <div className="space-y-2 px-2 sm:px-6">
//           <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
//             {alreadyPassed
//               ? "Quiz Already Completed!"
//               : isPassed
//               ? "Congratulations!"
//               : "Keep Trying!"}
//           </CardTitle>
//           <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
//             {alreadyPassed
//               ? "You have already passed this quiz. Retaking is not allowed."
//               : getPerformanceMessage(result.percentageScore)}
//           </p>
//         </div>

//         {alreadyPassed && (
//           <div className="flex items-center justify-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium max-w-xs mx-auto">
//             <Lock className="w-4 h-4" />
//             <span>Quiz Locked - Already Passed</span>
//           </div>
//         )}
//       </CardHeader>

//       <CardContent className="space-y-8 px-2 sm:px-6">
//         {/* Score Display */}
//         <div className="text-center space-y-4">
//           <div className="relative inline-block">
//             <div
//               className={cn(
//                 "text-5xl sm:text-7xl font-bold",
//                 alreadyPassed
//                   ? "text-emerald-600"
//                   : getScoreColor(result.percentageScore)
//               )}
//             >
//               {result.percentageScore}%
//             </div>
//             <Badge
//               variant={isPassed || alreadyPassed ? "default" : "secondary"}
//               className={cn(
//                 "absolute -top-2 -right-36 text-sm font-bold",
//                 isPassed || alreadyPassed
//                   ? "bg-green-100 text-green-800 border-green-300"
//                   : "bg-red-100 text-red-800 border-red-300"
//               )}
//             >
//               {isPassed || alreadyPassed ? "PASSED" : "FAILED"}
//             </Badge>
//           </div>
//           <Progress
//             value={result.percentageScore}
//             className="h-4 max-w-md mx-auto"
//           />
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {/* Correct Answers */}
//           <Card className="bg-white/70 border-blue-200">
//             <CardContent className="flex flex-col items-center p-4 sm:p-6">
//               <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3" />
//               <div className="text-2xl sm:text-3xl font-bold text-green-700">
//                 {correctAnswers}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                 Correct Answers
//               </div>
//             </CardContent>
//           </Card>

//           {/* Total Questions */}
//           <Card className="bg-white/70 border-purple-200">
//             <CardContent className="flex flex-col items-center p-4 sm:p-6">
//               <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3" />
//               <div className="text-2xl sm:text-3xl font-bold text-purple-700">
//                 {totalQuestions}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                 Total Questions
//               </div>
//             </CardContent>
//           </Card>

//           {/* Time Taken */}
//           <Card className="bg-white/70 border-orange-200">
//             <CardContent className="flex flex-col items-center p-4 sm:p-6">
//               <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-3" />
//               <div className="text-2xl sm:text-3xl font-bold text-orange-700">
//                 {result.timeTaken ? formatTime(result.timeTaken) : "N/A"}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                 Time Taken
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Question Breakdown */}
//         {result.results?.length > 0 && (
//           <Card className="bg-white/50">
//             <CardHeader className="px-4 sm:px-6">
//               <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
//                 <span>Question Breakdown</span>
//                 {alreadyPassed && (
//                   <Badge
//                     variant="outline"
//                     className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
//                   >
//                     Previous Attempt
//                   </Badge>
//                 )}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="px-4 sm:px-6">
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
//                 {result.results.map((item, index) => (
//                   <Card
//                     key={index}
//                     className={cn(
//                       "transition-all hover:shadow-md",
//                       item.isCorrect
//                         ? "border-green-200 bg-green-50"
//                         : "border-red-200 bg-red-50"
//                     )}
//                   >
//                     <CardContent className="flex flex-col items-center justify-center p-2 sm:p-4">
//                       {item.isCorrect ? (
//                         <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-1 sm:mb-2" />
//                       ) : (
//                         <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mb-1 sm:mb-2" />
//                       )}
//                       <div className="text-xs sm:text-sm font-bold text-gray-700">
//                         Q{index + 1}
//                       </div>
//                       <div
//                         className={cn(
//                           "text-xs font-medium mt-1",
//                           item.isCorrect ? "text-green-600" : "text-red-600"
//                         )}
//                       >
//                         {item.isCorrect ? "Correct" : "Wrong"}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         <Separator />

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center px-2 sm:px-6">
//           {!isPassed && !alreadyPassed && onRetake && (
//             <Button
//               onClick={onRetake}
//               disabled={isRetaking}
//               size="lg"
//               className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
//             >
//               {isRetaking ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Retaking Quiz...
//                 </>
//               ) : (
//                 <>
//                   <RotateCcw className="w-5 h-5 mr-2" />
//                   Retake Quiz
//                 </>
//               )}
//             </Button>
//           )}

//           {alreadyPassed && (
//             <Card className="bg-white/70 border border-emerald-200 w-full sm:w-auto">
//               <CardContent className="text-center p-6">
//                 <div className="flex items-center justify-center space-x-2 text-emerald-700 mb-2">
//                   <Lock className="w-5 h-5" />
//                   <span className="font-semibold">Retaking Not Allowed</span>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   You have successfully passed this quiz. No further attempts
//                   are needed.
//                 </p>
//               </CardContent>
//             </Card>
//           )}

//           <Button
//             variant="outline"
//             size="lg"
//             className="w-full sm:w-auto px-8 py-3 font-semibold bg-white hover:bg-gray-50"
//             onClick={onClose || (() => window.location.reload())}
//           >
//             <Home className="w-4 h-4 mr-2" />
//             {isInDialog ? "Close" : "Back to Lesson"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>

//     {/* Error Alert */}
//     {error && (
//       <Alert variant="destructive" className="px-4 sm:px-6">
//         <AlertTriangle className="h-4 w-4" />
//         <AlertDescription>
//           <strong>Error:</strong> {error}
//         </AlertDescription>
//       </Alert>
//     )}
//   </div>
// );

// };

// export default QuizResult;



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    if (alreadyPassed) return <Star className="w-12 h-12 text-emerald-500" />;
    if (score >= 90) return <Trophy className="w-12 h-12 text-yellow-500" />;
    if (score >= 75) return <Award className="w-12 h-12 text-blue-500" />;
    if (score >= 60)
      return <TrendingUp className="w-12 h-12 text-yellow-500" />;
    return <AlertTriangle className="w-12 h-12 text-red-500" />;
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
        "w-full max-w-full sm:max-w-xl md:max-w-4xl mx-auto space-y-6 px-4 sm:px-6 overflow-auto",
        isRTL ? "text-right" : "text-left"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card
        className={cn(
          "shadow-xl border-2 bg-gradient-to-br",
          alreadyPassed
            ? "from-emerald-50 to-green-50 border-emerald-200"
            : getScoreBgColor(result.percentageScore)
        )}
      >
        <CardHeader className="text-center space-y-6 pb-6 px-2 sm:px-6">
          {isInDialog && onClose && (
            <div className={cn("flex", isRTL ? "justify-start" : "justify-end")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className={cn("absolute top-4", isRTL ? "left-4" : "right-4")}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-white shadow-lg">
            {getPerformanceIcon(result.percentageScore)}
          </div>

          <div className="space-y-2 px-2 sm:px-6">
            <CardTitle
              className={cn(
                "text-2xl sm:text-3xl font-bold text-gray-900",
                isRTL ? "text-right" : "text-left"
              )}
            >
              {alreadyPassed
                ? isRTL
                  ? "الاختبار مكتمل بالفعل !"
                  : "Quiz déjà complété !"
                : isPassed
                ? isRTL
                  ? "تهانينا !"
                  : "Félicitations !"
                : isRTL
                ? "استمر في المحاولة!"
                : "Continuez d'essayer !"}
            </CardTitle>
            <p
              className={cn(
                "text-base sm:text-lg text-gray-600 max-w-md mx-auto leading-relaxed",
                isRTL ? "text-right" : "text-left"
              )}
            >
              {alreadyPassed
                ? isRTL
                  ? "لقد نجحت في هذا الاختبار من قبل. لا يُسمح بإعادة المحاولة."
                  : "Vous avez déjà réussi ce quiz. La reprise n'est pas autorisée."
                : getPerformanceMessage(result.percentageScore)}
            </p>
          </div>

          {alreadyPassed && (
            <div
              className={cn(
                "flex items-center justify-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium max-w-xs mx-auto",
                isRTL ? "space-x-reverse" : ""
              )}
            >
              <Lock className="w-4 h-4" />
              <span>
                {isRTL
                  ? "الاختبار مقفل - تم اجتيازه"
                  : "Quiz verrouillé - Déjà réussi"}
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-8 px-2 sm:px-6">
          {/* Affichage du score */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div
                className={cn(
                  "text-5xl sm:text-7xl font-bold",
                  alreadyPassed
                    ? "text-emerald-600"
                    : getScoreColor(result.percentageScore)
                )}
              >
                {result.percentageScore}%
              </div>
              <Badge
                variant={isPassed || alreadyPassed ? "default" : "secondary"}
                className={cn(
                  "absolute -top-2",
                  isRTL ? "-left-36" : "-right-36",
                  "text-sm font-bold",
                  isPassed || alreadyPassed
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-100 text-red-800 border-red-300"
                )}
              >
                {isPassed || alreadyPassed
                  ? isRTL
                    ? "نجاح"
                    : "RÉUSSI"
                  : isRTL
                  ? "لم تحقق النتيجة"
                  : "ÉCHOUÉ"}
              </Badge>
            </div>
            <Progress
              value={result.percentageScore}
              className="h-4 max-w-md mx-auto"
            />
          </div>

          {/* Grille des statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Réponses correctes */}
            <Card className="bg-white/70 border-blue-200">
              <CardContent className="flex flex-col items-center p-4 sm:p-6">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-green-700">
                  {correctAnswers}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  {isRTL ? "الإجابات الصحيحة" : "Réponses correctes"}
                </div>
              </CardContent>
            </Card>

            {/* Total des questions */}
            <Card className="bg-white/70 border-purple-200">
              <CardContent className="flex flex-col items-center p-4 sm:p-6">
                <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-purple-700">
                  {totalQuestions}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  {isRTL ? "إجمالي الأسئلة" : "Total des questions"}
                </div>
              </CardContent>
            </Card>

            {/* Temps pris */}
            <Card className="bg-white/70 border-orange-200">
              <CardContent className="flex flex-col items-center p-4 sm:p-6">
                <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-orange-700">
                  {result.timeTaken ? formatTime(result.timeTaken) : "N/A"}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  {isRTL ? "الوقت المستغرق" : "Temps pris"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Décomposition des questions */}
          {result.results?.length > 0 && (
            <Card className="bg-white/50">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle
                  className={cn(
                    "text-base sm:text-lg flex items-center space-x-2",
                    isRTL ? "space-x-reverse text-right" : "text-left"
                  )}
                >
                  <span>
                    {isRTL ? "تفصيل الأسئلة" : "Décomposition des questions"}
                  </span>
                  {alreadyPassed && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {isRTL ? "محاولة سابقة" : "Tentative précédente"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                  {result.results.map((item, index) => {
                    const isQuestionRTL = getDirection(item.questionText || "") === "rtl";
                    return (
                      <Card
                        key={index}
                        className={cn(
                          "transition-all hover:shadow-md",
                          item.isCorrect
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        )}
                      >
                        <CardContent
                          className={cn(
                            "flex flex-col items-center justify-center p-2 sm:p-4",
                            isRTL || isQuestionRTL ? "text-right" : "text-left"
                          )}
                          dir={isRTL || isQuestionRTL ? "rtl" : "ltr"}
                        >
                          {item.isCorrect ? (
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-1 sm:mb-2" />
                          ) : (
                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mb-1 sm:mb-2" />
                          )}
                          <div className="text-xs sm:text-sm font-bold text-gray-700">
                            {isRTL || isQuestionRTL ? `س${index + 1}` : `Q${index + 1}`}
                          </div>
                          <div
                            className={cn(
                              "text-xs font-medium mt-1",
                              item.isCorrect ? "text-green-600" : "text-red-600"
                            )}
                          >
                            {item.isCorrect
                              ? isRTL || isQuestionRTL
                                ? "صحيح"
                                : "Correct"
                              : isRTL || isQuestionRTL
                              ? "خطأ"
                              : "Faux"}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Boutons d'action */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center px-2 sm:px-6",
              isRTL ? "sm:flex-row-reverse" : ""
            )}
          >
            {!isPassed && !alreadyPassed && onRetake && (
              <Button
                onClick={onRetake}
                disabled={isRetaking}
                size="lg"
                className={cn(
                  "w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105",
                  isRTL ? "space-x-reverse" : ""
                )}
              >
                {isRetaking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isRTL ? "جاري إعادة الاختبار..." : "Reprise du quiz..."}
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2" />
                    {isRTL ? "إعادة الاختبار" : "Reprendre le quiz"}
                  </>
                )}
              </Button>
            )}

            {alreadyPassed && (
              <Card className="bg-white/70 border border-emerald-200 w-full sm:w-auto">
                <CardContent
                  className={cn(
                    "text-center p-6",
                    isRTL ? "text-right" : "text-left"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center space-x-2 text-emerald-700 mb-2",
                      isRTL ? "space-x-reverse justify-end" : ""
                    )}
                  >
                    <Lock className="w-5 h-5" />
                    <span className="font-semibold">
                      {isRTL
                        ? "غير مسموح بإعادة المحاولة"
                        : "Reprise non autorisée"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isRTL
                      ? "لقد نجحت في اجتياز هذا الاختبار. لا حاجة لمحاولات إضافية."
                      : "Vous avez réussi ce quiz. Aucune tentative supplémentaire n'est nécessaire."}
                  </p>
                </CardContent>
              </Card>
            )}

            <Button
              variant="outline"
              size="lg"
              className={cn(
                "w-full sm:w-auto px-8 py-3 font-semibold bg-white hover:bg-gray-50",
                isRTL ? "space-x-reverse" : ""
              )}
              onClick={onClose || (() => window.location.reload())}
            >
              <Home className="w-4 h-4 mr-2" />
              {isInDialog
                ? isRTL
                  ? "إغلاق"
                  : "Fermer"
                : isRTL
                ? "العودة إلى الدرس"
                : "Retour à la leçon"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerte d'erreur */}
      {error && (
        <Alert
          variant="destructive"
          className="px-4 sm:px-6"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{isRTL ? "خطأ :" : "Erreur :"}</strong>{" "}
            {isRTL
              ? "حدث خطأ. يرجى المحاولة مرة أخرى."
              : error || "Une erreur est survenue. Veuillez réessayer."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default QuizResult;