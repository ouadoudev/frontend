import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

export function OngoingCoursesCard({ user, ongoingCourses, handleViewCourse }) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Cours en cours</CardTitle>
      </CardHeader>
      <CardContent>
         {ongoingCourses.length > 0 ? (

        <ScrollArea className="h-56 px-1">
          <div className="space-y-4">
            {ongoingCourses?.map((ongoing, index) => {
              const courseId = ongoing.course._id?.toString?.() || ongoing.course?.toString?.();

              const progress = user?.progress?.find(
                (p) => p.course?.toString?.() === courseId
              );

              const progressPercentage = progress
                ? Math.round(
                    (progress.completedLessons.length / progress.totalLessons) * 100
                  )
                : 0;

              return (
                <div
                  key={index}
                  className="space-y-3 rounded-lg border border-gray-100 p-4 transition-all hover:shadow-md"
                >
                  <div className="flex justify-end mb-1">
                    <Badge variant="outline">
                      Started: {new Date(ongoing.startedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div
                    className="cursor-pointer hover:text-sky-700 mb-1"
                    onClick={() => handleViewCourse(courseId)}
                  >
                    <h3 className="text-sm font-medium">
                      {ongoing.course?.title || "Untitled Course"}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {progress?.completedLessons.length || 0}/
                        {progress?.totalLessons || 0} lessons
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
         ):(
          <div className="h-56 px-1">
            <p className="text-muted-foreground text-center pt-14">Vous n'avez pas encore de cours en cours. C'est le moment idéal pour commencer !</p>
          </div>
         )}
      </CardContent>
    </Card>
  );
}
