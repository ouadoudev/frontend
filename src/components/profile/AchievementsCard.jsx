import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export function AchievementsCard({ user }) {
  const achievements = [
    {
      title: "Courses Completed",
      value: user?.completedCourses?.reduce(
        (acc, subject) => acc + subject.courses.length,
        0
      ),
    },
    { title: "Subjects Mastered", value: user?.completedCourses?.length },
    {
      title: "Total Exercise Points",
      value: user?.exerciseScores
        ? user.exerciseScores
            .reduce((acc, score) => acc + score.points, 0)
            .toFixed(2)
        : "0.00",
    },
  ];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {achievements?.map((achievement, index) => (
            <div key={index} className="flex flex-col items-center">
              <Award className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="text-2xl font-bold">{achievement.value}</span>
              <span className="text-xs text-gray-500">{achievement.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
