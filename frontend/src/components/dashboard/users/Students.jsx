import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "@/store/userSlice";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "../../ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Sparkles } from "lucide-react";
import { toast } from "react-toastify";
const Students = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteUser = (userId) => {
    setToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!toDelete) return;
      await dispatch(deleteUser(toDelete));
      toast.success("élève  supprimée avec succès", {
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
      setToDelete(null);
    }
  };

  const studentUsers = users.filter((user) => user.role === "student");
  const currentStudents = studentUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(studentUsers.length / itemsPerPage);
  return (
    <main className="bg-gray-100 min-h-screen p-8">
      <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <Card>
          <CardHeader>
            <CardTitle>Étudiants</CardTitle>
            <CardDescription>
              Consultez les informations détaillées des étudiants inscrits sur
              la plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Table>
                <TableHeader>
                  <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <TableHead className="px-4 py-3">Étudiant</TableHead>
                    <TableHead className="px-4 py-3">Adresse e-mail</TableHead>
                    <TableHead className="px-4 py-3">
                      Cycle d’enseignement
                    </TableHead>
                    <TableHead className="px-4 py-3">Inscrit le </TableHead>
                    <TableHead className="px-4 py-3">
                      Disciplines suivies
                    </TableHead>
                    <TableHead className="px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {status === "loading" && <p>Loading...</p>}
                {status === "failed" && <p>Error: {error}</p>}
                {status === "succeeded" && (
                  <TableBody>
                    {currentStudents.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50">
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center text-sm">
                            <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                              <img
                                className="object-cover w-full h-full rounded-full"
                                src={
                                  user.user_image
                                    ? user.user_image.url
                                    : "/profile.png"
                                }
                                alt={user.username}
                                loading="lazy"
                              />
                              <div
                                className="absolute inset-0 rounded-full shadow-inner"
                                aria-hidden="true"
                              ></div>
                            </div>
                            <div>
                              <p className="font-semibold">{user.username}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {user.role}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {user.educationalCycle}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {user.enrolledSubjects.length}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
              {currentStudents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center my-12"
                >
                  <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Aucun élève</h3>
                  <p className="text-muted-foreground">
                    Il n’y a actuellement aucun élève enregistré.
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
        message="Êtes-vous sûr de vouloir supprimer cet élève  ? Cette action est irréversible."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
    </main>
  );
};

export default Students;
