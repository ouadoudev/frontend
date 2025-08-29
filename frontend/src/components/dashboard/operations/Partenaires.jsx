import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchPartenaires, deletePartenaire } from "@/store/partenaireSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../../ui/pagination";
import { Button } from "../../ui/button";
import { motion } from "framer-motion";
import {
  FileEditIcon,
  TrashIcon,
  Plus,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

const Partenaires = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { partenaires, status, error } = useSelector(
    (state) => state.partenaires
  );
 const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(fetchPartenaires());
  }, [dispatch]);

    const handleDelete = (id) => {
      setToDelete(id);
      setShowDeleteConfirm(true);
    };
  
    const handleConfirmDelete = async () => {
      try {
        if (!toDelete) return;
        await dispatch(deletePartenaire(toDelete));
        toast.success("partenaire  supprimée avec succès", {
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

  const handleEdit = (id) => navigate(`/update/partenaire/${id}`);
  const handleAdd = () => navigate("/CreatePartenaire");

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = partenaires.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(partenaires.length / itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Partenaires</CardTitle>
            <CardDescription>
              Gérez vos partenaires organisationnels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" /> Ajouter un partenaire
              </Button>
            </div>

            {status === "loading" && <p>Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>partenaire</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Site web</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <ExternalLink className="inline w-4 h-4 mr-1" />
                        Voir
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(item._id)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item._id)}
                        >
                          <FileEditIcon className="w-4 h-4 mr-1" /> Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" /> Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {currentItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center my-12"
              >
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  Il n’y a actuellement aucun partenaire enregistré.
                </h3>
                <p className="text-muted-foreground">
                  Chaque partenariat commence par une première main tendue.
                  Soyez le moteur du changement !
                </p>
              </motion.div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    {currentPage !== 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(currentPage - 1)}
                        />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    {currentPage !== totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(currentPage + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
            <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmer la suppression"
       message = "Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action est irréversible."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
    </div>
  );
};

export default Partenaires;
