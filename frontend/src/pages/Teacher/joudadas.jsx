import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import "moment/locale/fr"; // Pour avoir les dates en français

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Calendar, 
  BookOpen, 
  Plus, 
  Loader2,
  AlertCircle
} from "lucide-react";

import { fetchMyJoudadas } from "@/store/joudadaSlice";

const Jodadas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  moment.locale("fr");

  // Récupération des données depuis Redux
  const { joudadas = [], loading, error } = useSelector((state) => state.joudada);

  // États locaux pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "all",
    level: "all",
    unitTitle: "all"
  });

  useEffect(() => {
    dispatch(fetchMyJoudadas());
  }, [dispatch]);

  /* =====================================================
     LOGIQUE DE FILTRAGE (Mémorisée pour la performance)
  ===================================================== */
  
  // 1. Extraction des options uniques pour les menus déroulants
  const filterOptions = useMemo(() => {
    return {
      subjects: [...new Set(joudadas.map(j => j.header?.subject))].filter(Boolean),
      levels: [...new Set(joudadas.map(j => j.header?.level))].filter(Boolean),
      units: [...new Set(joudadas.map(j => j.header?.unitTitle))].filter(Boolean)
    };
  }, [joudadas]);

  // 2. Application des filtres sur la liste
  const filteredJoudadas = useMemo(() => {
    return joudadas.filter((j) => {
      const header = j.header || {};
      const matchesSearch = (header.lessonTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filters.subject === "all" || header.subject === filters.subject;
      const matchesLevel = filters.level === "all" || header.level === filters.level;
      const matchesUnit = filters.unitTitle === "all" || header.unitTitle === filters.unitTitle;
      
      return matchesSearch && matchesSubject && matchesLevel && matchesUnit;
    });
  }, [joudadas, searchTerm, filters]);

  /* =====================================================
     RENDU
  ===================================================== */

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* EN-TÊTE & ACTIONS PRINCIPALES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                <FileText className="text-white" size={28} />
              </div>
              Mes Fiches (Joudadas)
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Consultez et gérez vos préparations pédagogiques
            </p>
          </div>
          <Button 
            onClick={() => navigate("/planning")} 
            className="bg-blue-600 hover:bg-blue-700 h-12 px-6 shadow-xl shadow-blue-100 flex gap-2 font-bold"
          >
            <Plus size={20} /> Nouvelle Fiche
          </Button>
        </div>

        {/* BARRE DE FILTRES */}
        <Card className="border-none shadow-sm bg-white/90 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  placeholder="Rechercher par titre..." 
                  className="pl-10 bg-slate-100/50 border-none focus-visible:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Matière */}
              <Select onValueChange={(v) => setFilters(f => ({...f, subject: v}))}>
                <SelectTrigger className="bg-slate-100/50 border-none">
                  <SelectValue placeholder="Toutes les matières" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les matières</SelectItem>
                  {filterOptions.subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Niveau */}
              <Select onValueChange={(v) => setFilters(f => ({...f, level: v}))}>
                <SelectTrigger className="bg-slate-100/50 border-none">
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {filterOptions.levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Unité Didactique */}
              <Select onValueChange={(v) => setFilters(f => ({...f, unitTitle: v}))}>
                <SelectTrigger className="bg-slate-100/50 border-none text-left">
                  <SelectValue placeholder="Unités Didactiques" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les unités</SelectItem>
                  {filterOptions.units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* TABLEAU DES RÉSULTATS */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-slate-500 font-bold animate-pulse">Chargement de vos fiches...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center flex flex-col items-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <p className="text-red-600 font-bold">Une erreur est survenue</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold py-4 text-slate-800">Leçon & Séance</TableHead>
                  <TableHead className="font-bold text-slate-800">Détails</TableHead>
                  <TableHead className="font-bold text-slate-800">Calendrier</TableHead>
                  <TableHead className="text-right font-bold text-slate-800">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredJoudadas.map((j) => (
                    <TableRow 
                      key={j._id} 
                      as={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group hover:bg-blue-50/30 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <p className="font-black text-slate-700 uppercase text-xs tracking-tight group-hover:text-blue-700 transition-colors">
                            {j.header?.lessonTitle || "Sans titre"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-black">
                              SÉANCE {j.header?.sessionNumber}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
                            <BookOpen size={12} className="text-slate-400" /> {j.header?.subject}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {j.header?.level} • {j.header?.unitTitle}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                             <Calendar size={13} className="text-blue-500" />
                             {moment(j.header?.date).format("DD MMMM YYYY")}
                           </div>
                           <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
                             {j.header?.duration || "N/A"}
                           </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs"
                          onClick={() => navigate(`/jodada/${j._id}`)}
                        >
                          <Eye size={14} className="mr-2" /> OUVRIR
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}

          {/* ÉTAT VIDE */}
          {!loading && filteredJoudadas.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                <Filter size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-800 font-black uppercase text-sm tracking-widest">Aucune fiche trouvée</p>
              <p className="text-slate-400 text-xs mt-2 font-medium">Réessayez avec d'autres critères de recherche.</p>
              <Button 
                variant="link" 
                className="text-blue-600 mt-2 font-bold"
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ subject: "all", level: "all", unitTitle: "all" });
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Jodadas;