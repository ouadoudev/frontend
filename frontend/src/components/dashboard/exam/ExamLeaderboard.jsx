

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExamLeaderboard, getExamById } from "@/store/examSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Medal,
  Award,
  Users,
  Target,
  Clock,
  TrendingUp,
  ArrowLeft,
  Download,
  RefreshCw,
  Star,
  Calendar,
  BarChart3,
  AlertCircle,
} from "lucide-react";

const Leaderboard = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaderboard, currentExam, loading, error } = useSelector(
    (state) => state.exam
  );

  // Local state
  const [sortBy, setSortBy] = useState("score");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    if (examId) {
      dispatch(getExamLeaderboard(examId));
      dispatch(getExamById(examId));
    }
  }, [dispatch, examId]);

  const handleRefresh = () => {
    if (examId) {
      dispatch(getExamLeaderboard(examId));
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-medium text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getPerformanceBadge = (score) => {
    const percentage = (score / 20) * 100;

    if (percentage >= 90) {
      return { label: "Excellent", color: "bg-green-100 text-green-800" };
    }
    if (percentage >= 80) {
      return { label: "Très bien", color: "bg-blue-100 text-blue-800" };
    }
    if (percentage >= 70) {
      return { label: "Bien", color: "bg-yellow-100 text-yellow-800" };
    }
    if (percentage >= 60) {
      return { label: "Passable", color: "bg-orange-100 text-orange-800" };
    }
    return { label: "Insuffisant", color: "bg-red-100 text-red-800" };
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getStatistics = () => {
    if (!leaderboard || leaderboard.length === 0) {
      return {
        totalParticipants: 0,
        averageScore: 0,
        highestScore: 0,
        averageTime: 0,
        passRate: 0,
      };
    }

    const totalParticipants = leaderboard.length;
    const totalScore = leaderboard.reduce((sum, entry) => sum + entry.score, 0);
    const averageScore = totalScore / totalParticipants;
    const highestScore = Math.max(...leaderboard.map((entry) => entry.score));
    const totalTime = leaderboard.reduce(
      (sum, entry) => sum + (entry.timeSpent || 0),
      0
    );
    const averageTime = totalTime / totalParticipants;
    const passedCount = leaderboard.filter((entry) => entry.score >= 12).length;
    const passRate = (passedCount / totalParticipants) * 100;

    return {
      totalParticipants,
      averageScore: Math.round(averageScore * 10) / 10,
      highestScore,
      averageTime: Math.round(averageTime),
      passRate: Math.round(passRate),
    };
  };

  const stats = getStatistics();

  // Filter and sort leaderboard
  const filteredAndSortedLeaderboard = leaderboard
    .filter((entry) => {
      if (filterBy === "all") return true;
      if (filterBy === "passed") return entry.score >= 12;
      if (filterBy === "failed") return entry.score < 12;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "time":
          return (a.timeSpent || 0) - (b.timeSpent || 0);
        case "name":
          return (a.user?.username || "").localeCompare(b.user?.username || "");
        case "date":
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        default:
          return b.score - a.score;
      }
    });

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-8 rounded mb-2" />
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-6 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full mb-4" />
          ))}
        </CardContent>
      </Card>
    </div>
  );

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement du classement : {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Classement
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentExam?.title || "Examen"} • {stats.totalParticipants}{" "}
              participant
              {stats.totalParticipants > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Participants
                </p>
                <p className="text-2xl font-bold">{stats.totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Score moyen
                </p>
                <p className="text-2xl font-bold">{stats.averageScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Meilleur score
                </p>
                <p className="text-2xl font-bold">{stats.highestScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taux de réussite
                </p>
                <p className="text-2xl font-bold">{stats.passRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Podium */}
      {leaderboard && leaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Podium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leaderboard.slice(0, 3).map((entry, index) => {
                const rank = index + 1;
                const performance = getPerformanceBadge(entry.score);
                const percentage = Math.round((entry.score / 20) * 100);

                return (
                  <Card
                    key={entry.user?._id}
                    className={`relative ${
                      rank === 1 ? "ring-2 ring-yellow-400" : ""
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className={getRankBadgeColor(rank)}>
                          #{rank}
                        </Badge>
                      </div>
                      <Avatar className="h-16 w-16 mx-auto mb-4 mt-2">
                        <AvatarImage
                          src={
                            entry.user?.user_image?.url || "/placeholder.svg"
                          }
                        />
                        <AvatarFallback className="text-lg">
                          {entry.user?.username?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg mb-2">
                        {entry.user?.username || "Utilisateur anonyme"}
                      </h3>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">
                          {entry.score}
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <Badge className={performance.color}>
                          {performance.label}
                        </Badge>
                        {entry.timeSpent && (
                          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(entry.timeSpent)}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Classement complet
              </CardTitle>
              <CardDescription>Tous les résultats de l'examen</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Trier par score</SelectItem>
                  <SelectItem value="time">Trier par temps</SelectItem>
                  <SelectItem value="name">Trier par nom</SelectItem>
                  <SelectItem value="date">Trier par date</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="passed">Réussis</SelectItem>
                  <SelectItem value="failed">Échoués</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedLeaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
              <p className="text-muted-foreground">
                Aucun participant n'a encore soumis cet examen.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rang</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Pourcentage</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedLeaderboard.map((entry, index) => {
                    const rank = entry.rank || index + 1;
                    const performance = getPerformanceBadge(entry.score);
                    const percentage = Math.round((entry.score / 20) * 100);

                    return (
                      <TableRow
                        key={entry.user?._id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={entry.user?.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {entry.user?.username
                                  ?.charAt(0)
                                  ?.toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {entry.user?.username || "Utilisateur anonyme"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono font-medium">
                            {entry.score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={percentage} className="w-16 h-2" />
                            <span className="text-sm font-medium">
                              {percentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={performance.color}>
                            {performance.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(entry.submittedAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
