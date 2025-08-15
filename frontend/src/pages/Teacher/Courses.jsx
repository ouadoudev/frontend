import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, deleteCourse } from "@/store/courseSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileEditIcon,
  PlayIcon,
  Plus,
  PlusCircleIcon,
  Sparkles,
  TrashIcon,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { loggedUser } from "@/store/authSlice";
import { motion } from "framer-motion";
import ConfirmDialog from "@/components/ConfirmDialog";

const Courses = () => {
  const dispatch = useDispatch();
  const {
    courses = [],
    status = "idle",
    error = null,
  } = useSelector((state) => state.courses);
  const user = useSelector(loggedUser);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedEducationalLevel, setSelectedEducationalLevel] =
    useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const handleCreateNewCourse = () => {
    navigate("/CreateCourse");
  };

  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!courseToDelete) return;
      await dispatch(deleteCourse(courseToDelete));
      toast.success("Course supprimée avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
    }
  };
  const handlePlayCourse = (id) => {
    navigate(`/courses/${id}`);
  };

  const filteredCourses =
    user.role === "admin"
      ? courses.filter(
          (course) =>
            (!selectedSubject || course.subject.title === selectedSubject) &&
            (!selectedEducationalLevel ||
              course.subject.educationalLevel === selectedEducationalLevel) &&
            (!selectedTeacher || course.teacher.username === selectedTeacher)
        )
      : courses.filter(
          (course) =>
            course.teacher.username === user.username &&
            (!selectedEducationalLevel ||
              course.subject.educationalLevel === selectedEducationalLevel)
        );
  const currentCourses = filteredCourses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const subjects = [...new Set(courses.map((course) => course.subject.title))];
  const educationalLevels = [
    ...new Set(courses.map((course) => course.subject.educationalLevel)),
  ];
  const teachers = [
    ...new Set(courses.map((course) => course.teacher.username)),
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gestion des Cours</CardTitle>
            <CardDescription>
              Consultez et gérez les informations des cours proposés.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              {/* Bouton "Ajouter un cours" */}
              <Button
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                onClick={handleCreateNewCourse}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un cours
              </Button>

              {/* Filtres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:w-auto">
                {user.role === "admin" && (
                  <>
                    {/* Discipline */}
                    <div>
                      <Label
                        htmlFor="subjectFilter"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Discipline :
                      </Label>
                      <select
                        id="subjectFilter"
                        onChange={(e) =>
                          setSelectedSubject(e.target.value || null)
                        }
                        value={selectedSubject || ""}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Toutes</option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Enseignant */}
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
                        <option value="">Tous</option>
                        {teachers.map((teacher, index) => (
                          <option key={index} value={teacher}>
                            {teacher}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Niveau */}
                <div>
                  <Label
                    htmlFor="levelFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Niveau :
                  </Label>
                  <select
                    id="levelFilter"
                    onChange={(e) =>
                      setSelectedEducationalLevel(e.target.value || null)
                    }
                    value={selectedEducationalLevel || ""}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous</option>
                    {educationalLevels.map((level, index) => (
                      <option key={index} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <TableHead className=" px-4 py-2">Titre</TableHead>
                  <TableHead className=" px-4 py-2">Enseignant</TableHead>
                  <TableHead className=" px-4 py-2">Discipline</TableHead>
                  <TableHead className=" px-4 py-2">Niveau</TableHead>
                  <TableHead className="text-center px-4 py-2">
                    Actions
                  </TableHead>
                  <TableHead className="text-center px-4 py-2">
                    Gestion des Exams
                  </TableHead>
                </TableRow>
              </TableHeader>
              {status === "loading" && <p>Loading...</p>}
              {status === "failed" && <p>Error: {error}</p>}
              {status === "succeeded" && (
                <TableBody>
                  {currentCourses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell className=" px-4 py-2">
                        {course.title}
                      </TableCell>
                      <TableCell className=" px-4 py-2">
                        {course.teacher.username}
                      </TableCell>
                      <TableCell className=" px-4 py-2">
                        {course.subject.title.split("-")[0]}
                      </TableCell>
                      <TableCell className=" px-4 py-2">
                        {course.subject.educationalLevel}
                      </TableCell>
                      <TableCell className=" px-4 py-2">
                        <div className="flex justify-center gap-2">
                          <Button
                            className="h-8"
                            variant="outline"
                            onClick={() => handlePlayCourse(course._id)}
                          >
                            <PlayIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8"
                            onClick={() =>
                              navigate(`/update/course/${course._id}`)
                            }
                          >
                            <FileEditIcon className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteCourse(course._id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/course/${course._id}/exams`)
                            }
                            title=" Gestion des Exams"
                            className="text-green-600 hover:text-green-700"
                          >
                            <PlusCircleIcon className="w-4 h-4 " />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>

            {currentCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center my-12"
              >
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  Aucun cours n’a été ajouté pour le moment
                </h3>
                <p className="text-muted-foreground">
                  Il n’y a actuellement aucun cours à afficher.
                </p>
              </motion.div>
            )}
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
        message="Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
    </div>
  );
};

export default Courses;
