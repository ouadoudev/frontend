import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourseExams, deleteExam } from "@/store/examSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import {
  Trash2,
  Edit,
  Play,
  Plus,
  Search,
  MoreHorizontal,
  BookOpen,
  Eye,
  Filter,
  SortAsc,
  Calendar,
  SortDesc,
  Users,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

const ExamList = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, loading, error } = useSelector((state) => state.exam);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);

  useEffect(() => {
    if (courseId) {
      dispatch(getAllCourseExams(courseId));
    }
  }, [courseId, dispatch]);

  const filteredAndSortedExams = exams
    .filter((exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortBy === "exerciseCount") {
        aValue = a.exercises?.length || 0;
        bValue = b.exercises?.length || 0;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  const handleDeleteClick = (examId) => {
    setExamToDelete(examId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!examToDelete) return;
      await dispatch(deleteExam(examToDelete)).unwrap();
      dispatch(getAllCourseExams(courseId));
      toast.success("Exam deleted successfully", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error deleting exam", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setShowDeleteConfirm(false);
      setExamToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getExamStats = () => {
    const totalExams = exams.length;
    const totalExercises = exams.reduce(
      (sum, exam) => sum + (exam.exercises?.length || 0),
      0
    );
    const avgExercises =
      totalExams > 0 ? Math.round(totalExercises / totalExams) : 0;

    return { totalExams, totalExercises, avgExercises };
  };

  const stats = getExamStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
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
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading exams: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 space-y-4">
      <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <Card>
          <CardHeader>
            <CardTitle>Exam Management</CardTitle>
            <CardDescription>
              Create, view, and manage exams along with their quizzes and exercises.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <Button onClick={() => navigate(`/exam/create/${courseId}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Exam
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("title")}>
                      <SortAsc className="h-4 w-4 mr-2" />
                      Title (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Creation Date
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("exerciseCount")}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Exercise Count
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => setSortBy("title")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Title</span>
                        {sortBy === "title" &&
                          (sortOrder === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                          ) : (
                            <SortDesc className="h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead>Exercises</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => setSortBy("createdAt")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Created At</span>
                        {sortBy === "createdAt" &&
                          (sortOrder === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                          ) : (
                            <SortDesc className="h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedExams.map((exam) => (
                    <TableRow key={exam._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{exam.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {exam.exercises?.length || 0} exercise
                          {(exam.exercises?.length || 0) !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {formatDate(exam.createdAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/exam/view/${exam._id}`)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/exam/edit/${exam._id}`)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/exam/view/${exam._id}`)
                                }
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Take Exam
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/exam/${exam._id}/leaderboard`)
                                }
                              >
                                <Users className="h-4 w-4 mr-2" />
                                View Results
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(exam._id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this exam? This action cannot be undone."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setExamToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        destructive
      />
    </div>
  );
};

export default ExamList;