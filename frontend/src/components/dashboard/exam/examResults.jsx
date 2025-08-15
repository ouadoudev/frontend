// import { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getUserScore, getExamById } from "../../../store/examSlice";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../ui/card";
// import { Badge } from "../../ui/badge";
// import { Button } from "../../ui/button";
// import { Progress } from "../../ui/progress";
// import {
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   ArrowLeft,
//   Download,
//   Share2,
//   BarChart3,
//   Calendar,
// } from "lucide-react";
// import { toast } from "react-toastify";

// const UserScorePage = () => {
//   const { examId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const handleGoBack = () => {
//     const isFromSubmit = location.pathname === `/exam/${examId}/submit`;
//     navigate(isFromSubmit ? -2 : -1);
//   };
//   const { currentExam, submissionResults, loading, error } = useSelector(
//     (state) => state.exam
//   );
//   const currentUser = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     if (examId) {
//       dispatch(getUserScore({ examId }));
//       if (!currentExam) {
//         dispatch(getExamById(examId));
//       }
//     }
//   }, [dispatch, examId, currentExam]);

//   const getGradeColor = (percentage) => {
//     if (percentage >= 90) return "text-green-600 bg-green-100 border-green-200";
//     if (percentage >= 80) return "text-blue-600 bg-blue-100 border-blue-200";
//     if (percentage >= 70)
//       return "text-yellow-600 bg-yellow-100 border-yellow-200";
//     if (percentage >= 60)
//       return "text-orange-600 bg-orange-100 border-orange-200";
//     return "text-red-600 bg-red-100 border-red-200";
//   };

//   const getGradeLetter = (percentage) => {
//     if (percentage >= 90) return "A";
//     if (percentage >= 80) return "B";
//     if (percentage >= 70) return "C";
//     if (percentage >= 60) return "D";
//     return "F";
//   };

//   const getPerformanceMessage = (percentage) => {
//     if (percentage >= 90) return "Outstanding performance! 🎉";
//     if (percentage >= 80) return "Great job! Well done! 👏";
//     if (percentage >= 70) return "Good work! Keep it up! 👍";
//     if (percentage >= 60) return "Fair performance. Room for improvement. 📚";
//     return "Needs improvement. Consider reviewing the material. 📖";
//   };

//   const calculateStats = () => {
//     if (!submissionResults) return null;

//     const totalPossibleScore =
//       submissionResults.answers?.reduce(
//         (sum, answer) => sum + (answer.exercise?.totalPoints || 0),
//         0
//       ) || 0;

//     const totalScore = submissionResults.totalScore || 0;
//     const percentage =
//       totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;

//     const correctAnswers =
//       submissionResults.answers?.filter((answer) => answer.correct).length || 0;
//     const totalAnswers = submissionResults.answers?.length || 0;
//     const incorrectAnswers = totalAnswers - correctAnswers;

//     return {
//       totalScore,
//       totalPossibleScore,
//       percentage: Math.round(percentage * 100) / 100,
//       correctAnswers,
//       incorrectAnswers,
//       totalAnswers,
//       gradeLetter: getGradeLetter(percentage),
//       submittedAt: submissionResults.submittedAt,
//     };
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const handleDownloadScore = () => {
//     const stats = calculateStats();
//     if (!stats) return;

//     const scoreData = {
//       examTitle: currentExam?.title,
//       userId: submissionResults.user,
//       examId: submissionResults.exam,
//       submissionDate: formatDate(submissionResults.submittedAt),
//       ...stats,
//       exerciseBreakdown:
//         submissionResults.answers?.map((answer) => ({
//           exerciseTitle: answer.exercise?.title,
//           totalPoints: answer.exercise?.totalPoints,
//           score: answer.score,
//           correct: answer.correct,
//         })) || [],
//     };

//     const dataStr = JSON.stringify(scoreData, null, 2);
//     const dataBlob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `user-score-${examId}-${currentUser._id}.json`;
//     link.click();
//     URL.revokeObjectURL(url);
//     toast.success("Score data downloaded successfully!");
//   };

//   const handleShareScore = async () => {
//     const stats = calculateStats();
//     if (!stats) return;

//     const shareText = `Score: ${stats.percentage}% (${stats.gradeLetter}) on "${currentExam?.title}" exam! ${stats.correctAnswers}/${stats.totalAnswers} exercises completed correctly.`;

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Exam Score",
//           text: shareText,
//           url: window.location.href,
//         });
//       } catch (err) {
//         console.log("Share cancelled");
//       }
//     } else {
//       navigator.clipboard.writeText(shareText);
//       toast.success("Score copied to clipboard!");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <BarChart3 className="h-6 w-6 text-blue-600" />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Loading Score
//             </h3>
//             <p className="text-gray-600">Retrieving your performance data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !submissionResults) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full text-center space-y-6">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
//             <AlertCircle className="h-8 w-8 text-red-600" />
//           </div>
//           <div className="space-y-2">
//             <h3 className="text-xl font-bold text-gray-800">Score Not Found</h3>
//             <p className="text-gray-600">
//               Unable to load the score data. Please try again.
//             </p>
//           </div>
//           <Button
//             onClick={handleGoBack}
//             variant="outline"
//             size="lg"
//             className="w-full"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const stats = calculateStats();
//   if (!stats) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//             <div className="flex items-center gap-4">
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                   Your Score
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   {currentExam?.title} • Submitted{" "}
//                   {formatDate(stats.submittedAt)}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm" onClick={handleDownloadScore}>
//                 <Download className="h-4 w-4 mr-2" />
//                 Download
//               </Button>
//               <Button variant="outline" size="sm" onClick={handleShareScore}>
//                 <Share2 className="h-4 w-4 mr-2" />
//                 Share
//               </Button>
//             </div>
//           </div>

//           {/* Score Summary Card */}
//           <Card className="border-2 border-blue-100 shadow-lg bg-gradient-to-r from-white to-blue-50">
//             <CardContent className="p-6 sm:p-8">
//               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//                 <div className="flex items-center gap-6">
//                   <div
//                     className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-2 ${getGradeColor(
//                       stats.percentage
//                     )}`}
//                   >
//                     {stats.gradeLetter}
//                   </div>
//                   <div>
//                     <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                       {stats.percentage}%
//                     </h2>
//                     <p className="text-lg text-gray-600 mb-1">
//                       {stats.totalScore} / {stats.totalPossibleScore} points
//                     </p>
//                     <p className="text-sm font-medium text-blue-600">
//                       {getPerformanceMessage(stats.percentage)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
//                   <div className="text-center">
//                     <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
//                       <CheckCircle className="h-6 w-6 text-green-600" />
//                     </div>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {stats.correctAnswers}
//                     </p>
//                     <p className="text-sm text-gray-600">Correct</p>
//                   </div>
//                   <div className="text-center">
//                     <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-2 mx-auto">
//                       <XCircle className="h-6 w-6 text-red-600" />
//                     </div>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {stats.incorrectAnswers}
//                     </p>
//                     <p className="text-sm text-gray-600">Incorrect</p>
//                   </div>
//                   <div className="text-center">
//                     <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-2 mx-auto">
//                       <Calendar className="h-6 w-6 text-yellow-600" />
//                     </div>
//                     <p className="text-sm text-gray-600">Submitted on</p>
//                     <p className="text-xs text-gray-500">
//                       {formatDate(stats.submittedAt)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Tabs */}
//         <Card className="p-6 bg-white shadow-lg space-y-4 max-h-[60vh] overflow-y-auto">
//           <h3 className="text-xl font-semibold mb-4">Answer Details</h3>
//           {submissionResults.answers?.length === 0 && (
//             <p className="text-gray-600">No answers submitted yet.</p>
//           )}
//           {submissionResults.answers?.map((answer) => {
//             const percentageScore = answer.exercise.totalPoints
//               ? ((answer.score / answer.exercise.totalPoints) * 100).toFixed(0)
//               : 0;
//             return (
//               <div
//                 key={answer._id}
//                 className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center"
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
//                   <h4 className="font-semibold text-gray-900">
//                     {answer.exercise.title}
//                   </h4>
//                   <Badge
//                     variant={answer.correct ? "outline" : "destructive"}
//                     className="capitalize"
//                   >
//                     {answer.correct ? "Correct" : "Incorrect"}
//                   </Badge>
//                 </div>
//                 <div className="text-gray-700 font-mono">
//                   {answer.score} / {answer.exercise.totalPoints} pts (
//                   {percentageScore}%)
//                 </div>
//               </div>
//             );
//           })}
//         </Card>

//         <div className="text-center my-8">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => navigate(-1)}
//             className="flex-shrink-0"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserScorePage;

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserScore, getExamById } from "../../../store/examSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Share2,
  BarChart3,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";

const UserScorePage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleGoBack = () => {
    const isFromSubmit = location.pathname === `/exam/${examId}/submit`;
    navigate(isFromSubmit ? -2 : -1);
  };
  const { currentExam, submissionResults, loading, error } = useSelector(
    (state) => state.exam
  );
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (examId) {
      dispatch(getUserScore({ examId }));
      if (!currentExam) {
        dispatch(getExamById(examId));
      }
    }
  }, [dispatch, examId, currentExam]);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-100 border-green-200";
    if (percentage >= 80) return "text-blue-600 bg-blue-100 border-blue-200";
    if (percentage >= 70)
      return "text-yellow-600 bg-yellow-100 border-yellow-200";
    if (percentage >= 60)
      return "text-orange-600 bg-orange-100 border-orange-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "Performance exceptionnelle ! 🎉";
    if (percentage >= 80) return "Excellent travail ! Bravo ! 👏";
    if (percentage >= 70) return "Bon travail ! Continuez ainsi ! 👍";
    if (percentage >= 60) return "Performance correcte. Il y a place à l'amélioration. 📚";
    return "Amélioration nécessaire. Pensez à réviser le matériel. 📖";
  };

  const calculateStats = () => {
    if (!submissionResults) return null;

    const totalPossibleScore =
      submissionResults.answers?.reduce(
        (sum, answer) => sum + (answer.exercise?.totalPoints || 0),
        0
      ) || 0;

    const totalScore = submissionResults.totalScore || 0;
    const percentage =
      totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;

    const correctAnswers =
      submissionResults.answers?.filter((answer) => answer.correct).length || 0;
    const totalAnswers = submissionResults.answers?.length || 0;
    const incorrectAnswers = totalAnswers - correctAnswers;

    return {
      totalScore,
      totalPossibleScore,
      percentage: Math.round(percentage * 100) / 100,
      correctAnswers,
      incorrectAnswers,
      totalAnswers,
      gradeLetter: getGradeLetter(percentage),
      submittedAt: submissionResults.submittedAt,
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadScore = () => {
    const stats = calculateStats();
    if (!stats) return;

    const scoreData = {
      examTitle: currentExam?.title,
      userId: submissionResults.user,
      examId: submissionResults.exam,
      submissionDate: formatDate(submissionResults.submittedAt),
      ...stats,
      exerciseBreakdown:
        submissionResults.answers?.map((answer) => ({
          exerciseTitle: answer.exercise?.title,
          totalPoints: answer.exercise?.totalPoints,
          score: answer.score,
          correct: answer.correct,
        })) || [],
    };

    const dataStr = JSON.stringify(scoreData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `score-utilisateur-${examId}-${currentUser._id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Données de score téléchargées avec succès !");
  };

  const handleShareScore = async () => {
    const stats = calculateStats();
    if (!stats) return;

    const shareText = `Score : ${stats.percentage}% (${stats.gradeLetter}) pour l'examen "${currentExam?.title}" ! ${stats.correctAnswers}/${stats.totalAnswers} exercices complétés correctement.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Score de l'examen",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Score copié dans le presse-papiers !");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Chargement du score
            </h3>
            <p className="text-gray-600">Récupération de vos données de performance...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !submissionResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800">Score non trouvé</h3>
            <p className="text-gray-600">
              Impossible de charger les données de score. Veuillez réessayer.
            </p>
          </div>
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Votre score
                </h1>
                <p className="text-gray-600 mt-1">
                  {currentExam?.title} • Soumis le{" "}
                  {formatDate(stats.submittedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadScore}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareScore}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>

          {/* Score Summary Card */}
          <Card className="border-2 border-blue-100 shadow-lg bg-gradient-to-r from-white to-blue-50">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-2 ${getGradeColor(
                      stats.percentage
                    )}`}
                  >
                    {stats.gradeLetter}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {stats.percentage}%
                    </h2>
                    <p className="text-lg text-gray-600 mb-1">
                      {stats.totalScore} / {stats.totalPossibleScore} points
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      {getPerformanceMessage(stats.percentage)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.correctAnswers}
                    </p>
                    <p className="text-sm text-gray-600">Correct</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-2 mx-auto">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.incorrectAnswers}
                    </p>
                    <p className="text-sm text-gray-600">Incorrect</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-2 mx-auto">
                      <Calendar className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-sm text-gray-600">Soumis le</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(stats.submittedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-6 bg-white shadow-lg space-y-4 max-h-[60vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Détails des réponses</h3>
          {submissionResults.answers?.length === 0 && (
            <p className="text-gray-600">Aucune réponse soumise pour l'instant.</p>
          )}
          {submissionResults.answers?.map((answer) => {
            const percentageScore = answer.exercise.totalPoints
              ? ((answer.score / answer.exercise.totalPoints) * 100).toFixed(0)
              : 0;
            return (
              <div
                key={answer._id}
                className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {answer.exercise.title}
                  </h4>
                  <Badge
                    variant={answer.correct ? "outline" : "destructive"}
                    className="capitalize"
                  >
                    {answer.correct ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                <div className="text-gray-700 font-mono">
                  {answer.score} / {answer.exercise.totalPoints} pts (
                  {percentageScore}%)
                </div>
              </div>
            );
          })}
        </Card>

        <div className="text-center my-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-3)}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserScorePage;