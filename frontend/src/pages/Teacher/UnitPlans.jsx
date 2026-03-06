import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyUnitPlans, resetCurrentUnitPlan } from "../../store/unitPlanSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import moment from "moment";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress"; // Assurez-vous d'avoir ce composant Shadcn
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { BookOpenIcon, CalendarIcon, EyeIcon, LayoutDashboardIcon } from "lucide-react";

const UnitPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // On récupère unitPlans du nouveau state
  const { unitPlans = [], loading, error } = useSelector((state) => state.unitPlan);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getMyUnitPlans());
  }, [dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUnits = unitPlans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(unitPlans.length / itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Répartitions Mensuelles</CardTitle>
              <CardDescription>
                Suivi du moyen terme et planification par Unité Didactique.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate("/planning")}>
              <LayoutDashboardIcon className="h-4 w-4 mr-2" />
              Vue Annuelle
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading && <div className="py-10 text-center animate-pulse text-slate-400">Chargement des unités...</div>}
          {error && <div className="p-4 mb-4 text-red-700 bg-red-50 rounded-lg">{error}</div>}

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold">Unité</TableHead>
                <TableHead className="font-bold">Plan Parent</TableHead>
                <TableHead className="font-bold">Semestre</TableHead>
                <TableHead className="font-bold">Période</TableHead>
                <TableHead className="font-bold">Progression</TableHead>
                <TableHead className="text-center font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentUnits.map((unit) => (
                <TableRow key={unit._id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-blue-600">
                    {unit.title}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-semibold">{unit.annualPlanId?.academicYear}</p>
                      <p className="text-slate-500 uppercase text-[10px]">Plan ID: ...{unit.annualPlanId?._id?.slice(-6)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                      {unit.semester}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <CalendarIcon size={12} />
                      {moment(unit.startDate).format("DD/MM")} - {moment(unit.endDate).format("DD/MM")}
                    </div>
                  </TableCell>
                  <TableCell className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <Progress value={unit.progress?.percentage || 0} className="h-1.5" />
                      <span className="text-[11px] font-bold text-slate-700">{unit.progress?.percentage}%</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        className="bg-slate-800 hover:bg-slate-900"
                        onClick={() => navigate(`/unit-plan/${unit.annualPlanId?._id}/unit/${unit.unitId}`)}
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {unitPlans.length === 0 && !loading && (
            <div className="text-center py-20">
              <BookOpenIcon className="mx-auto h-12 w-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Aucune unité générée</h3>
              <p className="text-slate-500 text-sm">
                Allez dans un plan annuel et cliquez sur une unité pour la générer automatiquement.
              </p>
            </div>
          )}
        </CardContent>

        {/* Pagination identique à votre code */}
        {totalPages > 1 && (
          <div className="pb-6">
             {/* ... copier ici votre bloc Pagination ... */}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UnitPlans;