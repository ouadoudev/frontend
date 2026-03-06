import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  Award,
  FileText,
  Users,
  Loader2,
  AlertCircle,
  BarChart3,
} from "lucide-react";

import {
  getChildren,
  getChildMetrics,
  clearChildMetrics,
} from "@/store/parentSlice";
import { loggedUser } from "@/store/authSlice";

const SuiviParEnfants = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const usernameFromQuery = queryParams.get("username");

  const dispatch = useDispatch();
  const authUser = useSelector(loggedUser);

  const {
    children,
    loadingChildren,
    childrenError,
    childMetrics,
    loadingMetrics,
    metricsError,
  } = useSelector((state) => state.parent);

  const [selectedChild, setSelectedChild] = useState(null);

  // Safely get children array
  const childrenArray = Array.isArray(children)
    ? children
    : children?.children || children?.data || children?.students || children?.enfants || [];

  // Fetch children on mount
  useEffect(() => {
    if (authUser?.id) dispatch(getChildren(authUser.id));
  }, [authUser?.id, dispatch]);

  // Set selected child from query or first child
  useEffect(() => {
    if (childrenArray.length > 0) {
      const childFromQuery = childrenArray.find(
        (c) => c.username === usernameFromQuery
      );
      setSelectedChild(childFromQuery || childrenArray[0]);
    }
  }, [childrenArray, usernameFromQuery]);

  // Fetch metrics when selected child changes
  useEffect(() => {
    if (selectedChild?._id) dispatch(getChildMetrics(selectedChild._id));
  }, [selectedChild, dispatch]);

  // Clear metrics on unmount
  useEffect(() => {
    return () => dispatch(clearChildMetrics());
  }, [dispatch]);

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    dispatch(clearChildMetrics());
    navigate(`/parent/suivi?username=${child.username}`, { replace: true });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds < 0) return "0s";
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (sec) parts.push(`${sec}s`);
    return parts.join(" ");
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (isPassed) => {
    return isPassed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (loadingChildren) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Chargement des enfants...</p>
        </div>
      </div>
    );
  }

  if (childrenError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4">
              {childrenError.message || "Impossible de charger la liste des enfants"}
            </p>
            <Button onClick={() => dispatch(getChildren(authUser.id))}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (childrenArray.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun enfant trouvé</h3>
            <p className="text-muted-foreground">
              Aucun enfant n'est actuellement associé à votre compte parent.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentChildMetrics = childMetrics || {};
  const globalStats = currentChildMetrics.globalStats || {};

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Enfants</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {childrenArray.length} enfant(s)
          </p>
        </div>
        <div className="p-2">
          {childrenArray.map((child) => {
            const childId = child._id;
            const username = child.username || "Enfant sans nom";
            const subjectsCount = Array.isArray(child.subjects)
              ? child.subjects.length
              : 0;
            return (
              <button
                key={childId}
                onClick={() => handleChildSelect(child)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  selectedChild?._id === childId
                    ? "bg-blue-700 text-primary-foreground"
                    : "hover:bg-secondary text-foreground"
                }`}
              >
                <div className="font-medium text-sm">{username}</div>
                <div
                  className={`text-xs mt-1 ${
                    selectedChild?._id === childId
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {subjectsCount} Matières
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={selectedChild?.user_image?.url || "/placeholder.svg"}
                alt={selectedChild?.username}
              />
              <AvatarFallback className="text-lg">
                {selectedChild?.username
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {selectedChild?.username || "Enfant sans nom"}
              </h1>
              <p className="text-muted-foreground">{selectedChild?.email}</p>
              <p className="text-sm text-muted-foreground">
                {selectedChild?.educationalCycle || "Cycle non spécifié"} •
                {selectedChild?.educationalLevel || "Niveau non spécifié"} •
                {selectedChild?.stream || "Filière non spécifiée"}
              </p>
            </div>
          </div>

          {loadingMetrics && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Chargement des métriques...</span>
            </div>
          )}

          {metricsError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              Erreur lors du chargement des métriques
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Cours en cours
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {currentChildMetrics.progress?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Quiz passés
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {globalStats.totalQuizzesTaken || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Examens</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {globalStats.totalExamsTaken || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Temps total
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatTime(currentChildMetrics.totalTimeSpent)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exam Results */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Résultats des Examens
              </h2>
              <div className="space-y-3">
                {currentChildMetrics.examResults?.length ? (
                  currentChildMetrics.examResults.map((exam, idx) => (
                    <div
                      key={exam.examId || idx}
                      className="bg-secondary rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-foreground mb-1">
                          {exam.title || `Examen ${idx + 1}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {exam.course?.title || "Cours"} •{" "}
                          {formatDate(exam.submittedAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary">
                          {(exam.totalScore || 0).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Score
                          {exam.duration && ` • ${formatTime(exam.duration)}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Aucun examen passé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Exercise Results */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Exercices Complétés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentChildMetrics.exerciseResults?.length ? (
                  currentChildMetrics.exerciseResults.map((exercise, idx) => (
                    <div
                      key={exercise.exerciseId || idx}
                      className="bg-secondary rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-foreground">
                          {exercise.title || `Exercice ${idx + 1}`}
                        </div>
                        <div className="text-sm font-semibold text-chart-3">
                          {exercise.points || 0}/{exercise.maxPoints || 10} pts
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div>{exercise.attempts || 1} tentative(s)</div>
                        <div>{formatDate(exercise.createdAt)}</div>
                      </div>
                      {exercise.lesson && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {exercise.lesson}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-muted-foreground py-8">
                    Aucun exercice complété
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuiviParEnfants;
