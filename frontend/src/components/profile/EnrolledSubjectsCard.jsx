import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Play } from "lucide-react";
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
    <Card className="flex-1 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Matières inscrites
        </CardTitle>
        <Badge variant="secondary" className="text-xs">
          {enrolledSubjects?.length || 0} Matières
        </Badge>
      </CardHeader>

      <ScrollArea className="h-96 px-1">
        <CardContent className="space-y-4">
          {enrolledSubjects.length > 0 ? (
            <>
              {enrolledSubjects.map((subjectEntry) => {
                const expired = isExpired(subjectEntry.expiredAt);
                const isActive = subjectEntry.isActive && !expired;

                return (
                  <div
                    key={subjectEntry.subject?.id || subjectEntry.subject?._id}
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
                            handlePlaySubject(
                              subjectEntry.subject?.id ||
                                subjectEntry.subject?._id
                            )
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
              })}

              {/* Button always at the end */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={handleSubscribe}
                  aria-label="Enroll in a new subject"
                  className="w-full"
                >
                  <BookOpen className="mr-2 h-4 w-4" /> S'inscrire à une matière
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-16">
              <div className="text-sm text-center text-muted-foreground mb-2">
                Le savoir est un pouvoir. Explorez de nouvelles disciplines
                aujourd'hui
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
