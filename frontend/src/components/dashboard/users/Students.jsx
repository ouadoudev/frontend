import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  updateEducationalDetails,
} from "@/store/userSlice";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../../ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
const Students = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [educationalCycle, setEducationalCycle] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");
  const [stream, setStream] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedUser ||
      !educationalCycle ||
      !educationalLevel ||
      (educationalCycle === "Lycée" && !stream)
    ) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(
        updateEducationalDetails({
          userId: selectedUser._id,
          educationalCycle,
          educationalLevel,
          stream,
        })
      ).unwrap();
      dispatch(fetchUsers());
      toast.success("Informations mises à jour avec succès");
      setShowDialog(false);
    } catch (err) {
      toast.error("Échec de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  const studentUsers = users.filter((user) => user.role === "student");
  const currentStudents = studentUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(studentUsers.length / itemsPerPage);
  return (
    <main className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
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
                        <TableCell className="text-center text-sm">
                          {user.educationalCycle}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {user.enrolledSubjects.length}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          <Button
                            size="sm"
                            variant="outline"
                            className="mr-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedUser(user);
                              setEducationalCycle(user.educationalCycle || "");
                              setEducationalLevel(user.educationalLevel || "");
                              setStream(user.stream || "");
                              setShowDialog(true);
                            }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
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
       <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Mettre à jour les informations éducatives
          </DialogTitle>
          <div className="flex items-center mt-3">
            <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden ring-2 ring-blue-100">
              <img
                className="object-cover w-full h-full"
                src={selectedUser?.user_image?.url || "/profile.png"}
                alt={selectedUser?.username}
                loading="lazy"
              />
            </div>
            <span className="text-lg font-medium text-gray-700">{selectedUser?.username}</span>
          </div>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6 py-6 m-10">
          <div className="space-y-3">
            <Label htmlFor="educationalCycle" className="text-sm font-medium text-gray-700">
              Cycle d’enseignement <span className="text-red-500">*</span>
            </Label>
            <Select
              value={educationalCycle}
              onValueChange={(value) => {
                setEducationalCycle(value);
                setEducationalLevel("");
                setStream("");
              }}
            >
              <SelectTrigger
                id="educationalCycle"
                className="bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <SelectValue placeholder="Sélectionner un cycle" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Primaire">Primaire</SelectItem>
                <SelectItem value="Collège">Collège</SelectItem>
                <SelectItem value="Lycée">Lycée</SelectItem>
              </SelectContent>
            </Select>
            {!educationalCycle && (
              <p className="text-sm text-red-500 mt-1">Veuillez sélectionner un cycle</p>
            )}
          </div>

          {educationalCycle && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <Label htmlFor="educationalLevel" className="text-sm font-medium text-gray-700">
                Niveau d’enseignement <span className="text-red-500">*</span>
              </Label>
              <Select
                value={educationalLevel}
                onValueChange={(value) => {
                  setEducationalLevel(value);
                  setStream("");
                }}
              >
                <SelectTrigger
                  id="educationalLevel"
                  className="bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {educationalCycle === "Primaire" && (
                    <>
                      <SelectItem value="1ère année Primaire">1ère année Primaire</SelectItem>
                      <SelectItem value="2ème année Primaire">2ème année Primaire</SelectItem>
                      <SelectItem value="3ème année Primaire">3ème année Primaire</SelectItem>
                      <SelectItem value="4ème année Primaire">4ème année Primaire</SelectItem>
                      <SelectItem value="5ème année Primaire">5ème année Primaire</SelectItem>
                      <SelectItem value="6ème année Primaire">6ème année Primaire</SelectItem>
                    </>
                  )}
                  {educationalCycle === "Collège" && (
                    <>
                      <SelectItem value="1ère année collège">1ère année collège</SelectItem>
                      <SelectItem value="2ème année collège">2ème année collège</SelectItem>
                      <SelectItem value="3ème année collège">3ème année collège</SelectItem>
                    </>
                  )}
                  {educationalCycle === "Lycée" && (
                    <>
                      <SelectItem value="Tronc Commun">Tronc Commun</SelectItem>
                      <SelectItem value="1ère année du Baccalauréat">1ère année du Baccalauréat</SelectItem>
                      <SelectItem value="2ème année du Baccalauréat">2ème année du Baccalauréat</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {!educationalLevel && (
                <p className="text-sm text-red-500 mt-1">Veuillez sélectionner un niveau</p>
              )}
            </motion.div>
          )}

          {educationalCycle === "Lycée" && educationalLevel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <Label htmlFor="stream" className="text-sm font-medium text-gray-700">
                Filière <span className="text-red-500">*</span>
              </Label>
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger
                  id="stream"
                  className="bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Sélectionner une filière" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {educationalLevel === "Tronc Commun" && (
                    <>
                      <SelectItem value="Sciences">Sciences</SelectItem>
                      <SelectItem value="Lettres et Sciences Humaines">
                        Lettres et Sciences Humaines
                      </SelectItem>
                      <SelectItem value="Technologies">Technologies</SelectItem>
                    </>
                  )}
                  {educationalLevel === "1ère année du Baccalauréat" && (
                    <>
                      <SelectItem value="Sciences Mathématiques">Sciences Mathématiques</SelectItem>
                      <SelectItem value="Sciences Expérimentales">Sciences Expérimentales</SelectItem>
                      <SelectItem value="Sciences et Technologies Électriques">
                        Sciences et Technologies Électriques
                      </SelectItem>
                      <SelectItem value="Sciences et Technologies Mécaniques">
                        Sciences et Technologies Mécaniques
                      </SelectItem>
                      <SelectItem value="Lettres et Sciences Humaines">
                        Lettres et Sciences Humaines
                      </SelectItem>
                      <SelectItem value="Sciences Économiques et Gestion">
                        Sciences Économiques et Gestion
                      </SelectItem>
                    </>
                  )}
                  {educationalLevel === "2ème année du Baccalauréat" && (
                    <>
                      <SelectItem value="Sciences Mathématiques A">Sciences Mathématiques A</SelectItem>
                      <SelectItem value="Sciences Mathématiques B">Sciences Mathématiques B</SelectItem>
                      <SelectItem value="Sciences Physiques">Sciences Physiques</SelectItem>
                      <SelectItem value="Sciences de la Vie et de la Terre">
                        Sciences de la Vie et de la Terre
                      </SelectItem>
                      <SelectItem value="Sciences Agronomiques">Sciences Agronomiques</SelectItem>
                      <SelectItem value="Sciences et Technologies Électriques">
                        Sciences et Technologies Électriques
                      </SelectItem>
                      <SelectItem value="Sciences et Technologies Mécaniques">
                        Sciences et Technologies Mécaniques
                      </SelectItem>
                      <SelectItem value="Lettres">
                        Lettres
                      </SelectItem>
                      <SelectItem value="Sciences Humaines">
                        Sciences Humaines
                      </SelectItem>
                      <SelectItem value="Sciences Économiques">
                        Sciences Économiques
                      </SelectItem>
                      <SelectItem value="Techniques de Gestion et Comptabilité">
                        Techniques de Gestion et Comptabilité
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {!stream && (
                <p className="text-sm text-red-500 mt-1">Veuillez sélectionner une filière</p>
              )}
            </motion.div>
          )}

          <DialogFooter className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting || !educationalCycle || !educationalLevel || (educationalCycle === "Lycée" && !stream)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

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
