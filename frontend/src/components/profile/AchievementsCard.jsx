// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Award, Trophy, Star, Medal, Lock, HelpCircle } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { fetchUserBadges } from "@/store/badgeSlice"; 

// export function AchievementsCard({ user }) {
//   const dispatch = useDispatch(); 

//   const { userBadges, loading } = useSelector((state) => state.badges);
//   const {
//     earnedBadges = [],
//     availableBadges = [],
//     completionPercentage = 0,
//     totalBadges = 0,
//   } = userBadges; 

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchUserBadges(user.id));
//     }
//   }, [dispatch, user?.id]); 

//   const badgeAchievements = [
//     {
//       title: "Badges Obtenus",
//       value: earnedBadges.length,
//       icon: <Medal className="h-6 w-6 text-yellow-500" />,
//     },
//     {
//       title: "Badges Disponibles",
//       value: totalBadges,
//       icon: <Trophy className="h-6 w-6 text-blue-500" />,
//     },
//     {
//       title: "Progression",
//       value: `${completionPercentage}%`,
//       icon: <Star className="h-6 w-6 text-green-500" />,
//     },
//   ]; // Combine with existing achievements

//   const achievements = [
//     {
//       title: "Cours Terminés",
//       value:
//         user?.completedCourses?.reduce(
//           (acc, subject) => acc + subject.courses.length,
//           0
//         ) || 0,
//       icon: <Award className="h-6 w-6 text-purple-500" />,
//     },
//     {
//       title: "Matières Maîtrisées",
//       value: user?.completedCourses?.length || 0,
//       icon: <Award className="h-6 w-6 text-red-500" />,
//     },
//     {
//       title: "Points d'Exercice",
//       value: user?.exerciseScores
//         ? user.exerciseScores
//             .reduce((acc, score) => acc + score.points, 0)
//             .toFixed(2)
//         : "0.00",
//       icon: <Award className="h-6 w-6 text-indigo-500" />,
//     },
//     ...badgeAchievements,
//   ]; // Function to get icon component based on icon name

//   const getBadgeIcon = (iconName, color = "#3B82F6") => {
//     const iconProps = { className: "h-8 w-8", style: { color } };
//     const iconMap = {
//       medal: Medal,
//       star: Star,
//       trophy: Trophy,
//       lock: Lock,
//       "help-circle": HelpCircle,
//       award: Award, // Ajoutez d'autres icônes ici
//     };
//     const IconComponent = iconMap[iconName] || Award;
//     return <IconComponent {...iconProps} />;
//   };

//   if (loading) {
//     return (
//       <Card className="mt-8">
//                {" "}
//         <CardHeader>
//                    {" "}
//           <CardTitle className="text-sm font-medium">Réalisations</CardTitle>   
//              {" "}
//         </CardHeader>
//                {" "}
//         <CardContent>
//                    {" "}
//           <div className="animate-pulse">
//                        {" "}
//             <div className="grid grid-cols-3 gap-4">
//                            {" "}
//               {[1, 2, 3, 4, 5, 6].map((i) => (
//                 <div key={i} className="flex flex-col items-center">
//                                    {" "}
//                   <div className="h-6 w-6 bg-gray-200 rounded-full"></div>     
//                              {" "}
//                   <div className="h-8 w-12 bg-gray-200 rounded mt-2"></div>     
//                              {" "}
//                   <div className="h-4 w-16 bg-gray-200 rounded mt-1"></div>     
//                            {" "}
//                 </div>
//               ))}
//                          {" "}
//             </div>
//                      {" "}
//           </div>
//                  {" "}
//         </CardContent>
//              {" "}
//       </Card>
//     );
//   }

//   return (
//     <Card className="mt-8">
//            {" "}
//       <CardHeader>
//                {" "}
//         <CardTitle className="text-sm font-medium">Réalisations</CardTitle>     {" "}
//       </CardHeader>
//            {" "}
//       <CardContent>
//                {" "}
//         <div className="grid grid-cols-3 gap-4">
//                    {" "}
//           {achievements.map((achievement, index) => (
//             <div key={index} className="flex flex-col items-center">
//                             {achievement.icon}             {" "}
//               <span className="text-2xl font-bold mt-2">
//                 {achievement.value}
//               </span>
//                            {" "}
//               <span className="text-xs text-gray-500 text-center mt-1">
//                 {achievement.title}
//               </span>
//                          {" "}
//             </div>
//           ))}
//                  {" "}
//         </div>
//                 {/* Display earned badges */}       {" "}
//         {earnedBadges && earnedBadges.length > 0 && (
//           <div className="mt-8">
//                        {" "}
//             <h3 className="text-sm font-medium mb-4">
//               Vos Badges ({earnedBadges.length})
//             </h3>
//                        {" "}
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                            {" "}
//               {earnedBadges.map((badge) => (
//                 <div
//                   key={badge._id || badge.badgeId}
//                   className="flex flex-col items-center p-3 border rounded-lg bg-green-50 border-green-200"
//                   title={badge.description}
//                 >
//                                     {getBadgeIcon(badge.icon, badge.color)}     
//                              {" "}
//                   <span className="text-xs font-medium mt-2 text-center">
//                     {badge.name}
//                   </span>
//                                    {" "}
//                   <span className="text-xs text-gray-500 mt-1">
//                     {badge.points} pts
//                   </span>
//                                    {" "}
//                   {badge.earnedAt && (
//                     <span className="text-xs text-gray-400 mt-1">
//                                            {" "}
//                       {new Date(badge.earnedAt).toLocaleDateString()}           
//                              {" "}
//                     </span>
//                   )}
//                                  {" "}
//                 </div>
//               ))}
//                          {" "}
//             </div>
//                      {" "}
//           </div>
//         )}
//                 {/* Display available (unearned) badges */}       {" "}
//         {availableBadges && availableBadges.length > 0 && (
//           <div className="mt-8">
//                        {" "}
//             <h3 className="text-sm font-medium mb-4">
//               Badges à Découvrir ({availableBadges.length})
//             </h3>
//                        {" "}
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                            {" "}
//               {availableBadges.map((badge) => (
//                 <div
//                   key={badge._id || badge.badgeId}
//                   className={`flex flex-col items-center p-3 border rounded-lg ${
//                     badge.isSecret
//                       ? "bg-gray-100 border-gray-300"
//                       : "bg-blue-50 border-blue-200"
//                   }`}
//                   title={
//                     badge.isSecret
//                       ? "Badge secret - continuez à explorer pour le découvrir!"
//                       : badge.description
//                   }
//                 >
//                                    {" "}
//                   <div className="relative">
//                                        {" "}
//                     {badge.isSecret ? (
//                       <Lock className="h-8 w-8 text-gray-400" />
//                     ) : (
//                       getBadgeIcon(badge.icon, badge.color)
//                     )}
//                                      {" "}
//                   </div>
//                                    {" "}
//                   <span className="text-xs font-medium mt-2 text-center">
//                                         {badge.isSecret ? "???" : badge.name}   
//                                  {" "}
//                   </span>
//                                    {" "}
//                   <span className="text-xs text-gray-500 mt-1">
//                                        {" "}
//                     {badge.isSecret ? "Secret" : `${badge.points} pts`}         
//                            {" "}
//                   </span>
//                                  {" "}
//                 </div>
//               ))}
//                          {" "}
//             </div>
//                      {" "}
//           </div>
//         )}
//                 {/* Show message if no badges at all */}       {" "}
//         {!earnedBadges.length && !availableBadges.length && (
//           <div className="mt-8 text-center py-8">
//                        {" "}
//             <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />         
//               <p className="text-gray-500">Aucun badge pour le moment</p>       
//                {" "}
//             <p className="text-sm text-gray-400 mt-1">
//                             Complétez des cours et des exercices pour gagner vos
//               premiers badges!            {" "}
//             </p>
//                      {" "}
//           </div>
//         )}
//              {" "}
//       </CardContent>
//          {" "}
//     </Card>
//   );
// }

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Award, 
  Medal, 
  Star, 
  Lock, 
  HelpCircle 
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserBadges, fetchUserProgress } from "@/store/badgeSlice";

export function AchievementsCard({ user }) {
  const dispatch = useDispatch();
  const { userBadges, loading } = useSelector((state) => state.badges);
  const { userProgress = [] } = useSelector((state) => state.badges);

  const [currentQuote, setCurrentQuote] = useState(0);

  // Mock data for the dashboard
  const [points, setPoints] = useState(1250);
  const [level, setLevel] = useState(3);


  // const motivationalQuotes = [
  //   "The beautiful thing about learning is that no one can take it away from you.",
  //   "Education is not the filling of a pail, but the lighting of a fire.",
  //   "The more that you read, the more things you will know.",
  //   "Learning is a treasure that will follow its owner everywhere."
  // ];

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserBadges(user.id));
      dispatch(fetchUserProgress(user.id));
    }

    // Rotate quotes every 10 seconds
    // const quoteInterval = setInterval(() => {
    //   setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    // }, 10000);

    return () => clearInterval(quoteInterval);
  }, [dispatch, user?.id]);

  const {
    earnedBadges = [],
    availableBadges = [],
    completionPercentage = 0,
    totalBadges = 0,
  } = userBadges;

  // Function to get icon component based on icon name
  const getBadgeIcon = (iconName, color = "#3B82F6") => {
    const iconProps = { className: "h-6 w-6", style: { color } };
    const iconMap = {
      medal: Medal,
      star: Star,
      trophy: Trophy,
      lock: Lock,
      "help-circle": HelpCircle,
      award: Award,
    };
    const IconComponent = iconMap[iconName] || Award;
    return <IconComponent {...iconProps} />;
  };

  // Combine all badges for display
  const allBadges = [
    ...earnedBadges.map(badge => ({ 
      ...badge, 
      earned: true,
      displayIcon: getBadgeIcon(badge.icon, badge.color)
    })),
    ...availableBadges.map(badge => ({ 
      ...badge, 
      earned: false,
      displayIcon: badge.isSecret ? 
        <Lock className="h-6 w-6 text-gray-400" /> : 
        getBadgeIcon(badge.icon, "#CCCCCC") 
    }))
  ];

  if (loading) {
    return (
      <div className="relative">
        <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Learning Adventure
              </h2>
              <p className="text-muted-foreground mt-1">Level up your knowledge!</p>
            </div>
            <div className="animate-pulse">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-12 bg-gray-200 rounded mt-2"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Your Learning Adventure
            </h2>
              <p className="text-muted-foreground mt-1">Level up your knowledge!</p>
          </div>

          {/* Stats Overview
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold animate-pulse">{points.toLocaleString()}</div>
              <div className="text-sm opacity-90">Learning Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Level {level}</div>
              <div className="text-sm opacity-90">Scholar</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Top 10%</div>
              <div className="text-sm opacity-90">of Learners</div>
            </div>
          </div> */}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Badge Progress</span>
                <span className="font-semibold">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {earnedBadges.length} of {totalBadges} badges earned
              </p>
            </div>
          </div>

          {/* Combined Badges Display */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Your Badges ({earnedBadges.length}/{totalBadges})
            </h3>
            <div className="flex flex-wrap gap-3">
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
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {badge.isSecret ? "Secret Badge" : badge.name}
                    {badge.earned && badge.earnedAt && (
                      <div className="text-xs opacity-75">
                        Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Challenges from API */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Challenges Progress
            </h3>
            <div className="space-y-3">
              {userProgress.map((item) => (
                <div
                  key={item.badge.badgeId}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    item.meetsConditions
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{item.badge.name}</h4>
                    </div>
                    <Badge variant={item.meetsConditions ? "default" : "secondary"}>
                      +{item.badge.points} LP
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={item.progress.percentage} 
                      className="flex-1 h-2" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.progress.metConditions}/{item.progress.totalConditions}
                    </span>
                    {item.meetsConditions && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                  <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
                    {item.progress.conditionDetails.map((cond, idx) => (
                      <li key={idx} className={cond.met ? "text-green-600" : ""}>
                        {cond.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Quote */}
{/*           <div className="text-center p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
            <div className="text-lg font-medium text-purple-800 transition-all duration-500">
              {motivationalQuotes[currentQuote]}
            </div>
          </div> */}
        </div>
      </Card>
    </div>
  );
}
