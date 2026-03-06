import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnualPlans,
  deleteAnnualPlan,
  publishAnnualPlan,
} from "../../store/planningSlice";

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
  TrashIcon,
  UploadIcon,
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
import { motion } from "framer-motion";
import ConfirmDialog from "@/components/ConfirmDialog";

const AnnualPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { plans = [], loading, error } = useSelector((state) => state.planning);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    dispatch(fetchAnnualPlans());
  }, [dispatch]);

  const handleDeletePlan = (id) => {
    setPlanToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    await dispatch(deleteAnnualPlan(planToDelete));
    toast.success("Plan supprimé avec succès");
    setShowDeleteConfirm(false);
    setPlanToDelete(null);
  };

  const handlePublish = async (id) => {
    await dispatch(publishAnnualPlan(id));
    toast.success("Plan publié avec succès");
  };
  const handleCreatePlan = () => {
    navigate("/planning/create");
  }

  const currentPlans = plans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(plans.length / itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Plans Annuels</CardTitle>
          <CardDescription>
            Consultez et gérez vos planifications annuelles.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-between mb-6">
            <Button onClick={handleCreatePlan} className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Plan
            </Button>
          </div>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre Programme</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Région</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentPlans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>{plan.program?.title}</TableCell>
                  <TableCell>{plan.program?.subject}</TableCell>
                  <TableCell>{plan.program?.educationalLevel}</TableCell>
                  <TableCell>{plan.academicYear}</TableCell>
                  <TableCell>{plan.region}</TableCell>
                  <TableCell>
                    {plan.isPublished ? (
                      <span className="text-green-600 font-semibold">
                        Publié
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Brouillon
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/planning/view/${plan._id}`)}
                      >
                        <PlayIcon className="w-4 h-4" />
                      </Button>

                      {!plan.isPublished && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublish(plan._id)}
                          className="text-blue-600"
                        >
                          <UploadIcon className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => handleDeletePlan(plan._id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {currentPlans.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center my-12"
            >
              <h3 className="text-2xl font-semibold mb-2">
                Aucun plan annuel trouvé
              </h3>
              <p className="text-muted-foreground">
                Créez votre première planification annuelle.
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
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                  )}
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  {currentPage !== totalPages && (
                    <PaginationNext
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce plan ?"
        onCancel={() => {
          setShowDeleteConfirm(false);
          setPlanToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
    </div>
  );
};

export default AnnualPlans;
