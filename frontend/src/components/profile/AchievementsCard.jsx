import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Star, Medal, Lock, HelpCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserBadges } from "@/store/badgeSlice"; 

export function AchievementsCard({ user }) {
  const dispatch = useDispatch(); 

  const { userBadges, loading } = useSelector((state) => state.badges);
  const {
    earnedBadges = [],
    availableBadges = [],
    completionPercentage = 0,
    totalBadges = 0,
  } = userBadges; 

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserBadges(user.id));
    }
  }, [dispatch, user?.id]); 

  const badgeAchievements = [
    {
      title: "Badges Obtenus",
      value: earnedBadges.length,
      icon: <Medal className="h-6 w-6 text-yellow-500" />,
    },
    {
      title: "Badges Disponibles",
      value: totalBadges,
      icon: <Trophy className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Progression",
      value: `${completionPercentage}%`,
      icon: <Star className="h-6 w-6 text-green-500" />,
    },
  ]; // Combine with existing achievements

  const achievements = [
    {
      title: "Cours Terminés",
      value:
        user?.completedCourses?.reduce(
          (acc, subject) => acc + subject.courses.length,
          0
        ) || 0,
      icon: <Award className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Matières Maîtrisées",
      value: user?.completedCourses?.length || 0,
      icon: <Award className="h-6 w-6 text-red-500" />,
    },
    {
      title: "Points d'Exercice",
      value: user?.exerciseScores
        ? user.exerciseScores
            .reduce((acc, score) => acc + score.points, 0)
            .toFixed(2)
        : "0.00",
      icon: <Award className="h-6 w-6 text-indigo-500" />,
    },
    ...badgeAchievements,
  ]; // Function to get icon component based on icon name

  const getBadgeIcon = (iconName, color = "#3B82F6") => {
    const iconProps = { className: "h-8 w-8", style: { color } };
    const iconMap = {
      medal: Medal,
      star: Star,
      trophy: Trophy,
      lock: Lock,
      "help-circle": HelpCircle,
      award: Award, // Ajoutez d'autres icônes ici
    };
    const IconComponent = iconMap[iconName] || Award;
    return <IconComponent {...iconProps} />;
  };

  if (loading) {
    return (
      <Card className="mt-8">
               {" "}
        <CardHeader>
                   {" "}
          <CardTitle className="text-sm font-medium">Réalisations</CardTitle>   
             {" "}
        </CardHeader>
               {" "}
        <CardContent>
                   {" "}
          <div className="animate-pulse">
                       {" "}
            <div className="grid grid-cols-3 gap-4">
                           {" "}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center">
                                   {" "}
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>     
                             {" "}
                  <div className="h-8 w-12 bg-gray-200 rounded mt-2"></div>     
                             {" "}
                  <div className="h-4 w-16 bg-gray-200 rounded mt-1"></div>     
                           {" "}
                </div>
              ))}
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </CardContent>
             {" "}
      </Card>
    );
  }

  return (
    <Card className="mt-8">
           {" "}
      <CardHeader>
               {" "}
        <CardTitle className="text-sm font-medium">Réalisations</CardTitle>     {" "}
      </CardHeader>
           {" "}
      <CardContent>
               {" "}
        <div className="grid grid-cols-3 gap-4">
                   {" "}
          {achievements.map((achievement, index) => (
            <div key={index} className="flex flex-col items-center">
                            {achievement.icon}             {" "}
              <span className="text-2xl font-bold mt-2">
                {achievement.value}
              </span>
                           {" "}
              <span className="text-xs text-gray-500 text-center mt-1">
                {achievement.title}
              </span>
                         {" "}
            </div>
          ))}
                 {" "}
        </div>
                {/* Display earned badges */}       {" "}
        {earnedBadges && earnedBadges.length > 0 && (
          <div className="mt-8">
                       {" "}
            <h3 className="text-sm font-medium mb-4">
              Vos Badges ({earnedBadges.length})
            </h3>
                       {" "}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {" "}
              {earnedBadges.map((badge) => (
                <div
                  key={badge._id || badge.badgeId}
                  className="flex flex-col items-center p-3 border rounded-lg bg-green-50 border-green-200"
                  title={badge.description}
                >
                                    {getBadgeIcon(badge.icon, badge.color)}     
                             {" "}
                  <span className="text-xs font-medium mt-2 text-center">
                    {badge.name}
                  </span>
                                   {" "}
                  <span className="text-xs text-gray-500 mt-1">
                    {badge.points} pts
                  </span>
                                   {" "}
                  {badge.earnedAt && (
                    <span className="text-xs text-gray-400 mt-1">
                                           {" "}
                      {new Date(badge.earnedAt).toLocaleDateString()}           
                             {" "}
                    </span>
                  )}
                                 {" "}
                </div>
              ))}
                         {" "}
            </div>
                     {" "}
          </div>
        )}
                {/* Display available (unearned) badges */}       {" "}
        {availableBadges && availableBadges.length > 0 && (
          <div className="mt-8">
                       {" "}
            <h3 className="text-sm font-medium mb-4">
              Badges à Découvrir ({availableBadges.length})
            </h3>
                       {" "}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {" "}
              {availableBadges.map((badge) => (
                <div
                  key={badge._id || badge.badgeId}
                  className={`flex flex-col items-center p-3 border rounded-lg ${
                    badge.isSecret
                      ? "bg-gray-100 border-gray-300"
                      : "bg-blue-50 border-blue-200"
                  }`}
                  title={
                    badge.isSecret
                      ? "Badge secret - continuez à explorer pour le découvrir!"
                      : badge.description
                  }
                >
                                   {" "}
                  <div className="relative">
                                       {" "}
                    {badge.isSecret ? (
                      <Lock className="h-8 w-8 text-gray-400" />
                    ) : (
                      getBadgeIcon(badge.icon, badge.color)
                    )}
                                     {" "}
                  </div>
                                   {" "}
                  <span className="text-xs font-medium mt-2 text-center">
                                        {badge.isSecret ? "???" : badge.name}   
                                 {" "}
                  </span>
                                   {" "}
                  <span className="text-xs text-gray-500 mt-1">
                                       {" "}
                    {badge.isSecret ? "Secret" : `${badge.points} pts`}         
                           {" "}
                  </span>
                                 {" "}
                </div>
              ))}
                         {" "}
            </div>
                     {" "}
          </div>
        )}
                {/* Show message if no badges at all */}       {" "}
        {!earnedBadges.length && !availableBadges.length && (
          <div className="mt-8 text-center py-8">
                       {" "}
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />         
              <p className="text-gray-500">Aucun badge pour le moment</p>       
               {" "}
            <p className="text-sm text-gray-400 mt-1">
                            Complétez des cours et des exercices pour gagner vos
              premiers badges!            {" "}
            </p>
                     {" "}
          </div>
        )}
             {" "}
      </CardContent>
         {" "}
    </Card>
  );
}
