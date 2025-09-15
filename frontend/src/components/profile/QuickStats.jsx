// // import React from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// // import { Progress } from "../ui/progress";

// // const QuickStats = ({ user, ongoingCourses }) => {
// //   const calculateOverallProgress = () => {
// //     if (!user?.progress?.length) return 0;
// //     const totalLessons = user.progress.reduce(
// //       (sum, course) => sum + course.totalLessons,
// //       0
// //     );
// //     const completedLessons = user.progress.reduce(
// //       (sum, course) => sum + course.completedLessons.length,
// //       0
// //     );
// //     return totalLessons > 0
// //       ? Math.round((completedLessons / totalLessons) * 100)
// //       : 0;
// //   };

// //   const averageExerciseScore = () => {
// //     if (!user?.exerciseScores?.length) return 0;
// //     const total = user.exerciseScores.reduce(
// //       (sum, score) => sum + score.points,
// //       0
// //     );
// //     return Math.round(total / user.exerciseScores.length);
// //   };

// //   return (
// //     <Card className="md:w-80">
// //       <CardHeader>
// //         <CardTitle className="text-lg">Quick Stats</CardTitle>
// //       </CardHeader>
// //       <CardContent className="space-y-4">
// //         <div className="flex justify-between items-center">
// //           <span className="text-sm text-muted-foreground">
// //             Overall Progress
// //           </span>
// //           <span className="font-semibold">{calculateOverallProgress()}%</span>
// //         </div>
// //         <Progress value={calculateOverallProgress()} className="h-2" />

// //         <div className="grid grid-cols-2 gap-4 pt-2">
// //           <div className="text-center">
// //             <div className="text-2xl font-bold text-blue-600">
// //               {ongoingCourses?.length}
// //             </div>
// //             <div className="text-xs text-muted-foreground">Active Courses</div>
// //           </div>
// //           <div className="text-center">
// //             <div className="text-2xl font-bold text-green-600">
// //               {averageExerciseScore()}
// //             </div>
// //             <div className="text-xs text-muted-foreground">Avg Score</div>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default QuickStats;

// import React, { useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Progress } from "../ui/progress";
// import {
//   BookOpen,
//   CheckCircle2,
//   Target,
//   Trophy,
//   Award,
//   Medal,
//   Star,
//   Lock,
//   HelpCircle,
// } from "lucide-react";
// import { Badge } from "../ui/badge";
// import { fetchUserBadges } from "@/store/badgeSlice";
// import { useSelector, useDispatch } from "react-redux";

// const QuickStats = ({ user, ongoingCourses }) => {
//   const dispatch = useDispatch();
//   const { userBadges, loading } = useSelector((state) => state.badges);

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchUserBadges(user.id));
//     }
//   }, [dispatch, user?.id]);

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

//   const {
//     earnedBadges = [],
//     availableBadges = [],
//     completionPercentage = 0,
//     totalBadges = 0,
//   } = userBadges;

//   // Function to get icon component based on icon name
//   const getBadgeIcon = (iconName, color = "#3B82F6") => {
//     const iconProps = { className: "h-6 w-6", style: { color } };
//     const iconMap = {
//       medal: Medal,
//       star: Star,
//       trophy: Trophy,
//       lock: Lock,
//       "help-circle": HelpCircle,
//       award: Award,
//     };
//     const IconComponent = iconMap[iconName] || Award;
//     return <IconComponent {...iconProps} />;
//   };

//   // Combine all badges for display
//   const allBadges = [
//     ...earnedBadges.map((badge) => ({
//       ...badge,
//       earned: true,
//       displayIcon: getBadgeIcon(badge.icon, badge.color),
//     })),
//     ...availableBadges.map((badge) => ({
//       ...badge,
//       earned: false,
//       displayIcon: badge.isSecret ? (
//         <Lock className="h-6 w-6 text-gray-400" />
//       ) : (
//         getBadgeIcon(badge.icon, "#CCCCCC")
//       ),
//     })),
//   ];

//   const averageExerciseScore = () => {
//     if (!user?.exerciseScores?.length) return 0;
//     const total = user.exerciseScores.reduce(
//       (sum, score) => sum + score.points,
//       0
//     );
//     return Math.round(total / user.exerciseScores.length);
//   };

//   const getCompletedLessonsCount = () => {
//     if (!user?.progress?.length) return 0;
//     return user.progress.reduce(
//       (sum, course) => sum + course.completedLessons.length,
//       0
//     );
//   };

//   const getTotalLessonsCount = () => {
//     if (!user?.progress?.length) return 0;
//     return user.progress.reduce((sum, course) => sum + course.totalLessons, 0);
//   };

//   const getProgressLevel = (progress) => {
//     if (progress >= 80)
//       return {
//         label: "Excellent",
//         color: "text-green-600",
//         bg: "bg-green-100",
//       };
//     if (progress >= 60)
//       return { label: "Bon", color: "text-blue-600", bg: "bg-blue-100" };
//     if (progress >= 40)
//       return { label: "Moyen", color: "text-yellow-600", bg: "bg-yellow-100" };
//     return { label: "Débutant", color: "text-gray-600", bg: "bg-gray-100" };
//   };

//   const formatTime = (seconds) => {
//     const d = Math.floor(seconds / 86400);
//     const h = Math.floor((seconds % 86400) / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     return [d, h, m].map((v) => String(v).padStart(2, "0")).join(":");
//   };

//   const overallProgress = calculateOverallProgress();
//   const progressLevel = getProgressLevel(overallProgress);

//   return (
//     // <Card className=" bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
//     //   <CardHeader className="pb-3">
//     //     <div className="flex items-center justify-between">
//     //       <CardTitle className="flex items-center space-x-2">
//     //         <Trophy className="h-5 w-5 text-blue-600" />
//     //         <span className="text-base pr-4">Statistiques détaillées</span>
//     //       </CardTitle>
//     //       <Badge
//     //         variant="secondary"
//     //         className={`${progressLevel.bg} ${progressLevel.color} border-0`}
//     //       >
//     //         {progressLevel.label}
//     //       </Badge>
//     //     </div>
//     //   </CardHeader>
//     //   <CardContent className="space-y-6">
//     //     <div className="space-y-3">
//     //       <div className="flex justify-between items-center">
//     //         <span className="text-sm font-medium text-gray-700">
//     //           Progression globale
//     //         </span>
//     //         <span className="text-lg font-bold text-gray-900">
//     //           {overallProgress}%
//     //         </span>
//     //       </div>
//     //       <Progress value={overallProgress} className="h-3" />
//     //       <div className="flex justify-between text-xs text-gray-500">
//     //         <span>{getCompletedLessonsCount()} leçons terminées</span>
//     //         <span>{getTotalLessonsCount()} leçons au total</span>
//     //       </div>
//     //     </div>

//     //     <div>
//     //       <h3 className="font-semibold mb-3 flex items-center gap-2">
//     //         <Trophy className="w-5 h-5 text-yellow-500" />
//     //         Your Badges ({earnedBadges.length}/{totalBadges})
//     //       </h3>
//     //       <div className="flex flex-wrap gap-3">
//     //         {allBadges.map((badge) => (
//     //           <div
//     //             key={badge._id || badge.badgeId}
//     //             className={`group relative cursor-pointer transition-all duration-200 ${
//     //               badge.earned ? "hover:scale-110 hover:rotate-3" : "opacity-70"
//     //             }`}
//     //             title={
//     //               badge.isSecret
//     //                 ? "Secret badge - keep exploring to unlock!"
//     //                 : badge.description
//     //             }
//     //           >
//     //             <div
//     //               className={`p-3 rounded-full ${
//     //                 badge.earned
//     //                   ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg"
//     //                   : "bg-gray-200 text-gray-400"
//     //               }`}
//     //             >
//     //               {badge.displayIcon}
//     //             </div>
//     //             {badge.earned && (
//     //               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
//     //                 <CheckCircle2 className="w-3 h-3 text-white" />
//     //               </div>
//     //             )}
//     //             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//     //               {badge.isSecret ? "Secret Badge" : badge.name}
//     //               {badge.earned && badge.earnedAt && (
//     //                 <div className="text-xs opacity-75">
//     //                   Earned: {new Date(badge.earnedAt).toLocaleDateString()}
//     //                 </div>
//     //               )}
//     //             </div>
//     //           </div>
//     //         ))}
//     //       </div>
//     //       <div className="space-y-3 mt-2">
//     //         <Progress value={completionPercentage} className="h-3" />
//     //         <div className="flex justify-between text-sm">
//     //           <p className="text-xs text-muted-foreground">
//     //             {earnedBadges.length} of {totalBadges} badges earned
//     //           </p>
//     //           <span className="font-semibold">{completionPercentage}%</span>
//     //         </div>
//     //       </div>
//     //     </div>

//     //     {/* Stats Grid */}
//     //     <div className="grid grid-cols-2 gap-4">
//     //       <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
//     //         <div className="flex items-center justify-center mb-2">
//     //           <BookOpen className="h-5 w-5 text-blue-600" />
//     //         </div>
//     //         <div className="text-2xl font-bold text-blue-700">
//     //           {ongoingCourses?.length || 0}
//     //         </div>
//     //         <div className="text-xs text-blue-600 font-medium">
//     //           Cours actifs
//     //         </div>
//     //       </div>

//     //       <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
//     //         <div className="flex items-center justify-center mb-2">
//     //           <Target className="h-5 w-5 text-green-600" />
//     //         </div>
//     //         <div className="text-2xl font-bold text-green-700">
//     //           {formatTime(user?.totalTimeSpent || 0)}
//     //         </div>
//     //         <div className="text-xs text-green-600 font-medium">
//     //           Temps total passé
//     //         </div>
//     //       </div>
//     //     </div>
//     //     <div className="space-y-3">
//     //       <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//     //         <div className="flex items-center space-x-3">
//     //           <div className="p-2 bg-indigo-100 rounded-full">
//     //             <CheckCircle2 className="h-4 w-4 text-indigo-600" />
//     //           </div>
//     //           <div>
//     //             <div className="text-sm font-medium text-gray-900">
//     //               Matières inscrites
//     //             </div>
//     //             <div className="text-xs text-gray-600">Cours disponibles</div>
//     //           </div>
//     //         </div>
//     //         <div className="text-lg font-bold text-indigo-600">
//     //           {user?.enrolledSubjects?.length || 0}
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </CardContent>
//     // </Card>
//       <Card className="flex-1 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
//    <CardHeader className="flex flex-row items-center space-y-0 pb-4">
//   <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//     Mes Badges{" "}
//     <span className="text-sm font-medium text-muted-foreground">
//       ({earnedBadges.length}/{totalBadges})
//     </span>
//   </CardTitle>
// </CardHeader>

// <CardContent className="py-6">
//   <div className="flex flex-wrap gap-3">
//     {allBadges.map((badge) => (
//       <div
//         key={badge._id || badge.badgeId}
//         className={`group relative cursor-pointer transition-all duration-200 ${
//           badge.earned ? "hover:scale-110 hover:rotate-3" : "opacity-70"
//         }`}
//         title={
//           badge.isSecret
//             ? "Secret badge - keep exploring to unlock!"
//             : badge.description
//         }
//       >
//         <div
//           className={`p-3 rounded-full ${
//             badge.earned
//               ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg"
//               : "bg-gray-200 text-gray-400"
//           }`}
//         >
//           {badge.displayIcon}
//         </div>
//         {badge.earned && (
//           <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
//             <CheckCircle2 className="w-3 h-3 text-white" />
//           </div>
//         )}
//         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//           {badge.isSecret ? "Secret Badge" : badge.name}
//           {badge.earned && badge.earnedAt && (
//             <div className="text-xs opacity-75">
//               Gagné le : {new Date(badge.earnedAt).toLocaleDateString()}
//             </div>
//           )}
//         </div>
//       </div>
//     ))}
//   </div>

//   {/* Progression */}
//   <div className="space-y-3 mt-4">
//     <Progress value={completionPercentage} className="h-3" />
//     <div className="flex justify-between text-sm">
//       <p className="text-xs text-muted-foreground">
//         {earnedBadges.length} sur {totalBadges} badges obtenus
//       </p>
//       <span className="font-semibold">{completionPercentage}%</span>
//     </div>
//   </div>
// </CardContent>

//     </Card>
//   );
// };
// export default QuickStats;

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { CheckCircle2, Trophy, Award, Medal, Star, Lock, HelpCircle } from "lucide-react"
import { fetchUserBadges } from "@/store/badgeSlice"
import { useSelector, useDispatch } from "react-redux"

const QuickStats = ({ user, ongoingCourses }) => {
  const dispatch = useDispatch()
  const { userBadges, loading } = useSelector((state) => state.badges)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserBadges(user.id))
    }
  }, [dispatch, user?.id])

  const calculateOverallProgress = () => {
    if (!user?.progress?.length) return 0
    const totalLessons = user.progress.reduce((sum, course) => sum + course.totalLessons, 0)
    const completedLessons = user.progress.reduce((sum, course) => sum + course.completedLessons.length, 0)
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  const { earnedBadges = [], availableBadges = [], completionPercentage = 0, totalBadges = 0 } = userBadges

  // Function to get icon component based on icon name
  const getBadgeIcon = (iconName, color = "#3B82F6") => {
    const iconProps = { className: "h-6 w-6", style: { color } }
    const iconMap = {
      medal: Medal,
      star: Star,
      trophy: Trophy,
      lock: Lock,
      "help-circle": HelpCircle,
      award: Award,
    }
    const IconComponent = iconMap[iconName] || Award
    return <IconComponent {...iconProps} />
  }

  // Combine all badges for display
  const allBadges = [
    ...earnedBadges.map((badge) => ({
      ...badge,
      earned: true,
      displayIcon: getBadgeIcon(badge.icon, badge.color),
    })),
    ...availableBadges.map((badge) => ({
      ...badge,
      earned: false,
      displayIcon: badge.isSecret ? <Lock className="h-6 w-6 text-gray-400" /> : getBadgeIcon(badge.icon, "#CCCCCC"),
    })),
  ]

  const averageExerciseScore = () => {
    if (!user?.exerciseScores?.length) return 0
    const total = user.exerciseScores.reduce((sum, score) => sum + score.points, 0)
    return Math.round(total / user.exerciseScores.length)
  }

  const getCompletedLessonsCount = () => {
    if (!user?.progress?.length) return 0
    return user.progress.reduce((sum, course) => sum + course.completedLessons.length, 0)
  }

  const getTotalLessonsCount = () => {
    if (!user?.progress?.length) return 0
    return user.progress.reduce((sum, course) => sum + course.totalLessons, 0)
  }

  const getProgressLevel = (progress) => {
    if (progress >= 80)
      return {
        label: "Excellent",
        color: "text-green-600",
        bg: "bg-green-100",
      }
    if (progress >= 60) return { label: "Bon", color: "text-blue-600", bg: "bg-blue-100" }
    if (progress >= 40) return { label: "Moyen", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { label: "Débutant", color: "text-gray-600", bg: "bg-gray-100" }
  }

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return [d, h, m].map((v) => String(v).padStart(2, "0")).join(":")
  }

  const overallProgress = calculateOverallProgress()
  const progressLevel = getProgressLevel(overallProgress)

  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Mes Badges{" "}
          <span className="text-sm font-medium text-muted-foreground">
            ({earnedBadges.length}/{totalBadges})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="py-6">
        <div className="relative">
          <div className="grid grid-rows-3 grid-flow-col auto-cols-max gap-3 overflow-x-auto pb-2 max-h-48">
            {allBadges.map((badge) => (
              <div
                key={badge._id || badge.badgeId}
                className={`group relative cursor-pointer transition-all duration-200 ${
                  badge.earned ? "hover:scale-110 hover:rotate-3" : "opacity-70"
                }`}
                title={badge.isSecret ? "Secret badge - keep exploring to unlock!" : badge.description}
              >
                <div
                  className={`p-3 rounded-full ${
                    badge.earned
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {badge.displayIcon}
                </div>
                {badge.earned && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {badge.isSecret ? "Secret Badge" : badge.name}
                  {badge.earned && badge.earnedAt && (
                    <div className="text-xs opacity-75">Gagné le : {new Date(badge.earnedAt).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {allBadges.length > 9 && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Progression */}
        <div className="space-y-3 mt-4">
          <Progress value={completionPercentage} className="h-3" />
          <div className="flex justify-between text-sm">
            <p className="text-xs text-muted-foreground">
              {earnedBadges.length} sur {totalBadges} badges obtenus
            </p>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default QuickStats

