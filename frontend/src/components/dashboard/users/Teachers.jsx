import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  assignEducationToTeacher,
} from "@/store/userSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, GraduationCap, Plus, Sparkles, Trash2, User } from "lucide-react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/ConfirmDialog";

const Teachers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status, error } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [currentCycle, setCurrentCycle] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const educationalCycles = ["Primaire", "Collège", "Lycée"];

  const educationalLevels = {
    Primaire: [
      "1ère année Primaire",
      "2ème année Primaire",
      "3ème année Primaire",
      "4ème année Primaire",
      "5ème année Primaire",
      "6ème année Primaire",
    ],
    Collège: ["1ère année collège", "2ème année collège", "3ème année collège"],
    Lycée: [
      "Tronc Commun",
      "1ère année du Baccalauréat",
      "2ème année du Baccalauréat",
    ],
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
      toast.success("Enseignant supprimée avec succès", {
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

  const openAssignDialog = (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedCycles(teacher.educationalCycles || []);
    setSelectedLevels(teacher.educationalLevels || []);
    setIsAssignDialogOpen(true);
  };

  const closeAssignDialog = () => {
    setIsAssignDialogOpen(false);
    setSelectedTeacher(null);
    setSelectedCycles([]);
    setSelectedLevels([]);
    setCurrentCycle("");
    setCurrentLevel("");
  };

  const addCycle = () => {
    if (currentCycle && !selectedCycles.includes(currentCycle)) {
      setSelectedCycles([...selectedCycles, currentCycle]);
      setCurrentCycle("");
    }
  };

  const removeCycle = (cycle) => {
    setSelectedCycles(selectedCycles.filter((c) => c !== cycle));
    // Remove associated levels when cycle is removed
    const levelsToRemove = educationalLevels[cycle] || [];
    setSelectedLevels(
      selectedLevels.filter((level) => !levelsToRemove.includes(level))
    );
  };

  const addLevel = () => {
    if (currentLevel && !selectedLevels.includes(currentLevel)) {
      setSelectedLevels([...selectedLevels, currentLevel]);
      setCurrentLevel("");
    }
  };

  const removeLevel = (level) => {
    setSelectedLevels(selectedLevels.filter((l) => l !== level));
  };

  const getAvailableLevels = () => {
    return selectedCycles.flatMap((cycle) => educationalLevels[cycle] || []);
  };

  const handleAssignEducation = async () => {
    if (
      !selectedTeacher ||
      selectedCycles.length === 0 ||
      selectedLevels.length === 0
    ) {
      toast.error("Please select at least one cycle and one level", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await dispatch(
        assignEducationToTeacher({
          userId: selectedTeacher._id,
          educationalCycles: selectedCycles,
          educationalLevels: selectedLevels,
        })
      ).unwrap();

      toast.success("Educational details assigned successfully", {
        position: "bottom-right",
        autoClose: 3000,
      });

      closeAssignDialog();
      dispatch(fetchUsers()); // Refresh the users list
    } catch (error) {
      toast.error(error.message || "Error assigning educational details", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Filter users with role 'teacher'
  const teacherUsers = users.filter((user) => user.role === "teacher");
  const currentTeachers = teacherUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(teacherUsers.length / itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enseignants</CardTitle>
            <CardDescription>
              Gérez et consultez les informations liées aux enseignants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <TableHead className="px-4 py-3">Enseignant</TableHead>
                  <TableHead className="px-4 py-3">Discipline</TableHead>
                  {/* <TableHead className="px-4 py-3">Adresse e-mail</TableHead> */}
                  <TableHead className="px-4 py-3">
                    Détails pédagogiques
                  </TableHead>
                  {/* <TableHead className="px-4 py-3">Courses</TableHead> */}
                  <TableHead className="px-4 py-3">Inscrit depuis</TableHead>
                  <TableHead className="text-center px-4 py-3">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              {status === "loading" && <p>Loading...</p>}
              {status === "failed" && <p>Error: {error}</p>}
              {status === "succeeded" && (
                <TableBody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  {currentTeachers.map((user) => (
                    <TableRow
                      key={user._id}
                      className="text-gray-700 dark:text-gray-400"
                    >
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
                        {user.discipline}
                      </TableCell>
                      {/* <TableCell className="px-4 py-3 text-sm">
                        {user.email}
                      </TableCell> */}
                      <TableCell className="px-4 py-3 text-sm">
                        <div className="space-y-1">
                          {user.educationalCycles &&
                          user.educationalCycles.length > 0 ? (
                            <>
                              <div className="flex flex-wrap gap-1">
                                {user.educationalCycles.map((cycle, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {cycle}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {user.educationalLevels &&
                                  user.educationalLevels
                                    .slice(0, 2)
                                    .map((level, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {level}
                                      </Badge>
                                    ))}
                                {user.educationalLevels &&
                                  user.educationalLevels.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{user.educationalLevels.length - 2} plus
                                    </Badge>
                                  )}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              Not assigned
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {/* <TableCell className="px-4 py-3 text-sm">
                        {user.courses?.length || 0}
                      </TableCell> */}
                      <TableCell className="px-4 py-3 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAssignDialog(user)}
                            className="bg-transparent text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <GraduationCap className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/teacher/${user._id}`)}
                          >
                            <User className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
            {currentTeachers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center my-12"
              >
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  Aucun enseignant
                </h3>
                <p className="text-muted-foreground">
                  Il n’y a actuellement aucun enseignant enregistré.
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
      {/* Assign Educational Details Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Educational Details</DialogTitle>
            <DialogDescription>
              Assign educational cycles and levels to{" "}
              {selectedTeacher?.username}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 m-10">
            {/* Educational Cycles Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Educational Cycles</Label>
              <div className="flex gap-2">
                <Select value={currentCycle} onValueChange={setCurrentCycle}>
                  <SelectTrigger  className="bg-white border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select a cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationalCycles
                      .filter((cycle) => !selectedCycles.includes(cycle))
                      .map((cycle) => (
                        <SelectItem key={cycle} value={cycle}>
                          {cycle}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addCycle}
                  disabled={!currentCycle}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCycles.map((cycle) => (
                  <Badge
                    key={cycle}
                    variant="default"
                    className="flex items-center gap-1"
                  >
                    {cycle}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeCycle(cycle)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Educational Levels Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Educational Levels</Label>
              <div className="flex gap-2">
                <Select
                  value={currentLevel}
                  onValueChange={setCurrentLevel}
                  disabled={selectedCycles.length === 0}
                >
                  <SelectTrigger  className="bg-white border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableLevels()
                      .filter((level) => !selectedLevels.includes(level))
                      .map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addLevel}
                  disabled={!currentLevel}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedLevels.map((level) => (
                  <Badge
                    key={level}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {level}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeLevel(level)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeAssignDialog}  className="border-gray-300 text-gray-700 hover:bg-gray-100">
              Cancel
            </Button>
            <Button onClick={handleAssignEducation}  className="bg-blue-600 text-white hover:bg-blue-700">
              Assign Educational Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
