import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLessons, deleteLesson } from "@/store/lessonSlice";
import { clearQuizState } from "@/store/quizSlice";
import { loggedUser } from "@/store/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../../components/ui/pagination";
import {
  File,
  FileEditIcon,
  PlayIcon,
  Plus,
  PlusCircleIcon,
  TrashIcon,
  BookOpen,
  Sparkles,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import ConfirmDialog from "@/components/ConfirmDialog";

const Lessons = () => {
  const dispatch = useDispatch();
  const lessons = useSelector((state) => state.lesson.lessons);
  const { status, error } = useSelector((state) => state.lesson);
  const user = useSelector(loggedUser);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchLessons());
    dispatch(clearQuizState());
  }, [dispatch]);

  const handleDeleteLesson = (lessonId) => {
    setLessonToDelete(lessonId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!lessonToDelete) return;
      await dispatch(deleteLesson(lessonToDelete));
      toast.success("Leçon supprimée avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(fetchLessons());
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setShowDeleteConfirm(false);
      setLessonToDelete(null);
    }
  };

  const handlePlayLesson = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  const handleCreateLesson = () => {
    navigate("/CreateLesson");
  };

  const handleCreateQuiz = (lessonId) => {
    dispatch(clearQuizState());
    navigate(`/quiz/create/${lessonId}`);
  };

  const handleViewQuiz = (lessonId) => {
    dispatch(clearQuizState());
    navigate(`/quiz/view/${lessonId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredLessons =
    user.role === "admin"
      ? lessons.filter(
          (lesson) =>
            (!selectedCourse || lesson.course.title === selectedCourse) &&
            (!selectedTeacher || lesson.teacher.username === selectedTeacher)
        )
      : lessons.filter(
        (lesson) =>
          lesson.teacher.username === user.username &&
          (!selectedCourse || lesson.course.title === selectedCourse)
      );

  const indexOfLastLesson = currentPage * itemsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - itemsPerPage;
  const lessonsOnPage = filteredLessons.slice(
    indexOfFirstLesson,
    indexOfLastLesson
  );

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);

  const courses = [...new Set(lessons.map((lesson) => lesson.course.title))];
  const teachers = [
    ...new Set(lessons.map((lesson) => lesson.teacher.username)),
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gestion des leçons</CardTitle>
            <CardDescription>
              Créez, consultez et gérez les leçons ainsi que leurs quiz et
              exercices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              {/* Bouton "Ajouter une leçon" */}
              <Button
                onClick={handleCreateLesson}
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une leçon
              </Button>

              {/* Filtres (enseignant + cours) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
               {user.role === "admin" && (
                  <div>
                    <Label
                      htmlFor="teacherFilter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enseignant :
                    </Label>
                    <select
                      id="teacherFilter"
                      onChange={(e) =>
                        setSelectedTeacher(e.target.value || null)
                      }
                      value={selectedTeacher || ""}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les enseignants</option>
                      {teachers.map((teacher, index) => (
                        <option key={index} value={teacher}>
                          {teacher}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                  <div>
                    <Label
                      htmlFor="courseFilter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Cours :
                    </Label>
                    <select
                      id="courseFilter"
                      onChange={(e) =>
                        setSelectedCourse(e.target.value || null)
                      }
                      value={selectedCourse || ""}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les cours</option>
                      {courses.map((course, index) => (
                        <option key={index} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <TableHead className="text-center px-4 py-2">
                      Titre
                    </TableHead>
                    <TableHead className="text-center px-4 py-2">
                      Statut
                    </TableHead>
                    <TableHead className="text-center px-4 py-2">
                      Cours
                    </TableHead>
                    <TableHead className="text-center px-4 py-2">
                      Actions
                    </TableHead>
                    <TableHead className="text-center px-4 py-2">
                      Gestion des quiz
                    </TableHead>
                    <TableHead className="text-center px-4 py-2">
                      Gestion des Exercices
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {status === "loading" && <p>Loading...</p>}
                {status === "failed" && <p>Error: {error}</p>}
                {status === "succeeded" && (
                  <TableBody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {lessonsOnPage.map((lesson) => (
                      <TableRow
                        key={lesson._id}
                        className="text-gray-700 dark:text-gray-400"
                      >
                        <TableCell className="px-4 py-2 font-medium">
                          {lesson.title}
                        </TableCell>
                        <TableCell className="text-center px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              lesson.published
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            } dark:bg-opacity-20 dark:text-opacity-80`}
                          >
                            {lesson.published ? "Publié" : "Brouillon"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center px-4 py-2">
                          {lesson.course.title}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePlayLesson(lesson._id)}
                              title="View Lesson"
                            >
                              <PlayIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/update/lesson/${lesson._id}`)
                              }
                              title="Edit Lesson"
                            >
                              <FileEditIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteLesson(lesson._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Lesson"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          <div className="flex justify-center gap-2">
                            {lesson.quiz || lesson.quizId ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewQuiz(lesson._id)}
                                title="View Quiz"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <BookOpen className="w-4 h-4 mr-1" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCreateQuiz(lesson._id)}
                                title="Create Quiz"
                                className="text-green-600 hover:text-green-700"
                              >
                                <PlusCircleIcon className="w-4 h-4 mr-1" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/exercise/create/${lesson._id}`)
                              }
                              title="Create Exercise"
                              className="text-green-600 hover:text-green-700"
                            >
                              <PlusCircleIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/exercises/${lesson._id}`)
                              }
                              title="View Exercises"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <File className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>

              {lessonsOnPage.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center my-12"
                >
                  <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">
                    Il n’y a actuellement aucune leçon à afficher.
                  </h3>
                  <p className="text-muted-foreground">
                    Aucune leçon n’a encore été ajoutée à ce cours.
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
          {totalPages > 1 && (
            <div className="flex justify-center my-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {currentPage !== 1 && (
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                    )}
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    {currentPage !== totalPages && (
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      </div>
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette leçon ? Cette action est irréversible."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setLessonToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
    </div>
  );
};

export default Lessons;
