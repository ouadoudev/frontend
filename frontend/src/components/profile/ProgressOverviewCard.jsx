import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressOverviewCard({ progress }) {
  const calculateProgress = (progress) => {
    if (!progress || progress.totalLessons === 0) return 0;
    return (progress.completedLessons.length / progress.totalLessons) * 100;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Progress Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {progress?.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{item.course.title}</span>
              <span className="text-sm font-medium">{`${Math.round(calculateProgress(item))}%`}</span>
            </div>
            <Progress value={calculateProgress(item)} className="w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}