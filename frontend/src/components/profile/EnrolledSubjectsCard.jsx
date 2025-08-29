import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";

export function EnrolledSubjectsCard({
  enrolledSubjects,
  handlePlaySubject,
  handleSubscribe,
}) {
  const isExpired = (expiredAt) => {
    return expiredAt && new Date(expiredAt) < new Date();
  };

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Matières inscrites</CardTitle>
        <Button
          variant="outline"
          onClick={handleSubscribe}
          aria-label="Enroll in a new subject"
        >
          <BookOpen className="mr-1 h-4 w-4" /> S'inscrire
        </Button>
      </CardHeader>
      <ScrollArea className="h-96 px-1">
        <CardContent className="space-y-4">
          {enrolledSubjects.length > 0 ? (
            enrolledSubjects.map((subjectEntry) => {
              const expired = isExpired(subjectEntry.expiredAt);
              const isActive = subjectEntry.isActive && !expired;

              return (
                <div
                  key={subjectEntry.subject?.id}
                  className="space-y-3 rounded-lg border border-gray-100 p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {
                          (
                            subjectEntry.subject?.title || "Untitled Subject"
                          ).split(" -")[0]
                        }
                      </h3>

                      {expired ? (
                        <Badge
                          variant="outline"
                          className="mt-1 text-yellow-700 border-yellow-200 bg-yellow-50"
                        >
                          Expired
                        </Badge>
                      ) : isActive ? (
                        <Badge
                          variant="outline"
                          className="mt-1 text-green-700 border-green-200 bg-green-50"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="mt-1 text-red-700 border-red-200 bg-red-50"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>

                    <Badge
                      variant="outline"
                      className="ml-2 text-green-700 border-green-200 bg-green-50"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!isActive}
                        onClick={() =>
                          handlePlaySubject(subjectEntry.subject.id ||subjectEntry.subject._id )
                        }
                        aria-label={`Play ${
                          subjectEntry.subject?.title || "subject"
                        }`}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </Badge>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col gap-2 pt-16">
              <div className="text-sm text-center text-muted-foreground mb-2">
               Le savoir est un pouvoir. Explorez de nouvelles disciplines aujourd'hui 
              </div>
              <Button
                variant="outline"
                onClick={handleSubscribe}
                aria-label="Enroll in a new subject"
              >
                <BookOpen className="mr-2 h-4 w-4" /> S'inscrire à une matière
              </Button>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
