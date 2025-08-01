// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Progress } from "../ui/progress";

// const QuickStats = ({ user, ongoingCourses }) => {
//   const calculateOverallProgress = () => {
//     if (!user?.progress?.length) return 0;
//     const totalLessons = user.progress.reduce(
//       (sum, course) => sum + course.totalLessons,
//       0
//     );
//     const completedLessons = user.progress.reduce(
//       (sum, course) => sum + course.completedLessons.length,
//       0
//     );
//     return totalLessons > 0
//       ? Math.round((completedLessons / totalLessons) * 100)
//       : 0;
//   };

//   const averageExerciseScore = () => {
//     if (!user?.exerciseScores?.length) return 0;
//     const total = user.exerciseScores.reduce(
//       (sum, score) => sum + score.points,
//       0
//     );
//     return Math.round(total / user.exerciseScores.length);
//   };

//   return (
//     <Card className="md:w-80">
//       <CardHeader>
//         <CardTitle className="text-lg">Quick Stats</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex justify-between items-center">
//           <span className="text-sm text-muted-foreground">
//             Overall Progress
//           </span>
//           <span className="font-semibold">{calculateOverallProgress()}%</span>
//         </div>
//         <Progress value={calculateOverallProgress()} className="h-2" />

//         <div className="grid grid-cols-2 gap-4 pt-2">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600">
//               {ongoingCourses?.length}
//             </div>
//             <div className="text-xs text-muted-foreground">Active Courses</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-green-600">
//               {averageExerciseScore()}
//             </div>
//             <div className="text-xs text-muted-foreground">Avg Score</div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default QuickStats;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { BookOpen, CheckCircle2, Target, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";

const QuickStats = ({ user, ongoingCourses }) => {
  const calculateOverallProgress = () => {
    if (!user?.progress?.length) return 0;
    const totalLessons = user.progress.reduce(
      (sum, course) => sum + course.totalLessons,
      0
    );
    const completedLessons = user.progress.reduce(
      (sum, course) => sum + course.completedLessons.length,
      0
    );
    return totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  };

  const averageExerciseScore = () => {
    if (!user?.exerciseScores?.length) return 0;
    const total = user.exerciseScores.reduce(
      (sum, score) => sum + score.points,
      0
    );
    return Math.round(total / user.exerciseScores.length);
  };

  const getCompletedLessonsCount = () => {
    if (!user?.progress?.length) return 0;
    return user.progress.reduce(
      (sum, course) => sum + course.completedLessons.length,
      0
    );
  };

  const getTotalLessonsCount = () => {
    if (!user?.progress?.length) return 0;
    return user.progress.reduce((sum, course) => sum + course.totalLessons, 0);
  };

  const getProgressLevel = (progress) => {
    if (progress >= 80)
      return {
        label: "Excellent",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (progress >= 60)
      return { label: "Bon", color: "text-blue-600", bg: "bg-blue-100" };
    if (progress >= 40)
      return { label: "Moyen", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "Débutant", color: "text-gray-600", bg: "bg-gray-100" };
  };

const formatTime = (seconds) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return [d, h, m].map((v) => String(v).padStart(2, "0")).join(":");
};

  const overallProgress = calculateOverallProgress();
  const progressLevel = getProgressLevel(overallProgress);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            <span className="text-base pr-4">Statistiques détaillées</span>
          </CardTitle>
          <Badge
            variant="secondary"
            className={`${progressLevel.bg} ${progressLevel.color} border-0`}
          >
            {progressLevel.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Progression globale
            </span>
            <span className="text-lg font-bold text-gray-900">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{getCompletedLessonsCount()} leçons terminées</span>
            <span>{getTotalLessonsCount()} leçons au total</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {ongoingCourses?.length || 0}
            </div>
            <div className="text-xs text-blue-600 font-medium">
              Cours actifs
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700">
              {formatTime(user?.totalTimeSpent || 0)}
            </div>
            <div className="text-xs text-green-600 font-medium">
              Temps total passé
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Matières inscrites
                </div>
                <div className="text-xs text-gray-600">Cours disponibles</div>
              </div>
            </div>
            <div className="text-lg font-bold text-indigo-600">
              {user?.enrolledSubjects?.length || 0}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default QuickStats;
