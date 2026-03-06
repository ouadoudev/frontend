import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "@/store/userSlice";
import { addChild, removeChild, getChildren } from "@/store/parentSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, User, Plus, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/ConfirmDialog";

const Parents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status, error } = useSelector((state) => state.user);
  const { children } = useSelector((state) => state.parent);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);

  // Fetch all users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const parentUsers = users.filter((u) => u.role === "parent");
  const studentUsers = users.filter((u) => u.role === "student");

  // Map of parentId -> children
  const [childrenMap, setChildrenMap] = useState({});

  useEffect(() => {
    parentUsers.forEach((parent) => {
      if (!childrenMap[parent._id]) {
        dispatch(getChildren(parent._id))
          .unwrap()
          .then((res) => {
            setChildrenMap((prev) => ({ ...prev, [parent._id]: res }));
          })
          .catch((err) => console.error(err));
      }
    });
  }, [parentUsers, childrenMap, dispatch]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentParents = parentUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(parentUsers.length / itemsPerPage);

  // Helper: get children for a parent
  const getCurrentChildren = (parent) => childrenMap[parent._id] || [];

  // Helper: available students to add
  const availableStudents = (parent) =>
    studentUsers.filter(
      (s) => !getCurrentChildren(parent).some((c) => c._id === s._id)
    );

  /** Delete parent */
  const handleDeleteUser = (userId) => {
    setToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser(toDelete)).unwrap();
      toast.success("Parent supprimé");
    } catch {
      toast.error("Erreur suppression");
    } finally {
      setShowDeleteConfirm(false);
      setToDelete(null);
    }
  };

  /** Add child to parent */
  const handleAddChild = async () => {
    if (!selectedParent || !selectedChild) return;
    try {
      const result = await dispatch(
        addChild({ parentId: selectedParent._id, childId: selectedChild._id })
      ).unwrap();

      // Update local childrenMap instantly
      setChildrenMap((prev) => ({
        ...prev,
        [selectedParent._id]: [
          ...(prev[selectedParent._id] || []),
          studentUsers.find((s) => s._id === selectedChild._id),
        ],
      }));

      toast.success("Enfant ajouté");
      setIsAddChildOpen(false);
      setSelectedChild(null);
    } catch {
      toast.error("Erreur ajout");
    }
  };

  /** Remove child from parent */
  const handleRemoveChild = async (parent, childId) => {
    try {
      await dispatch(
        removeChild({ parentId: parent._id, childId })
      ).unwrap();

      // Update local childrenMap instantly
      setChildrenMap((prev) => ({
        ...prev,
        [parent._id]: prev[parent._id].filter((c) => c._id !== childId),
      }));

      toast.success("Enfant supprimé");
    } catch {
      toast.error("Erreur suppression");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce parent ?"
        onCancel={() => {
          setShowDeleteConfirm(false);
          setToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />

      <Card>
        <CardHeader>
          <CardTitle>Parents</CardTitle>
          <CardDescription>Gérez les comptes des parents inscrits</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enfants</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p>Error: {error}</p>}

            {status === "succeeded" && (
              <TableBody>
                {currentParents.map((parent) => {
                  const currentChildren = getCurrentChildren(parent);
                  return (
                    <TableRow key={parent._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={parent.user_image?.url || "/profile.png"}
                            alt={parent.username}
                          />
                          <p className="font-semibold">{parent.username}</p>
                        </div>
                      </TableCell>
                      <TableCell>{parent.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {currentChildren.length > 0 ? (
                            currentChildren.map((child) => (
                              <Badge
                                key={child._id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {child.username}
                                <X
                                  className="w-3 h-3 cursor-pointer"
                                  onClick={() =>
                                    handleRemoveChild(parent, child._id)
                                  }
                                />
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedParent(parent) || setIsAddChildOpen(true)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/parent/${parent._id}`)}
                          >
                            <User className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDeleteUser(parent._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>

          {currentParents.length === 0 && status === "succeeded" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center my-12"
            >
              <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold">Aucun parent trouvé</h3>
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "secondary" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Child Dialog */}
      {isAddChildOpen && selectedParent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Ajouter un enfant à {selectedParent.username}
            </h3>

            <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
              {availableStudents(selectedParent).length > 0 ? (
                availableStudents(selectedParent).map((s) => (
                  <Button
                    key={s._id}
                    variant={selectedChild?._id === s._id ? "secondary" : "outline"}
                    onClick={() => setSelectedChild(s)}
                  >
                    {s.username}
                  </Button>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Aucun enfant disponible
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddChildOpen(false);
                  setSelectedChild(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddChild} disabled={!selectedChild}>
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parents;
