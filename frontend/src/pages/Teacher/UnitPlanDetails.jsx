import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnitPlan,
  updateUnitPlan,
  resetCurrentUnitPlan,
} from "../../store/unitPlanSlice";
import {
  ChevronLeft,
  BookOpen,
  Calendar,
  Layers,
  ExternalLink,
  MessageSquare,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Info,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import moment from "moment";
import "moment/locale/fr";

const UnitPlanDetails = () => {
  const { annualPlanId, unitId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUnitPlan, loading, error, success } = useSelector(
    (state) => state.unitPlan,
  );

  // États locaux pour l'édition des ressources et remarques
  const [isEditing, setIsEditing] = useState(false);
  const [remarques, setRemarques] = useState("");
  const [newResource, setNewResource] = useState("");
  const [resources, setResources] = useState([]);

  useEffect(() => {
    dispatch(fetchUnitPlan({ annualPlanId, unitId }));
    return () => dispatch(resetCurrentUnitPlan());
  }, [dispatch, annualPlanId, unitId]);

  useEffect(() => {
    if (currentUnitPlan) {
      setRemarques(currentUnitPlan.remarques || "");
      setResources(currentUnitPlan.resources || []);
    }
  }, [currentUnitPlan]);

  const handleSaveData = () => {
    dispatch(
      updateUnitPlan({
        id: currentUnitPlan._id,
        data: { remarques, resources },
      }),
    );
    setIsEditing(false);
  };

  const addResource = () => {
    if (newResource.trim()) {
      setResources([...resources, newResource]);
      setNewResource("");
    }
  };

  const removeResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleOpenJoudada = (sessionId) => {
    // Redirige vers la page micro-planning (Joudada)
    navigate(`/joudada/${annualPlanId}/session/${sessionId}`);
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorView message={error} />;
  if (!currentUnitPlan) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Barre de navigation haute */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-semibold text-sm"
          >
            <ChevronLeft size={20} /> Retour au plan annuel
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
              Progression Unité
            </span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden hidden md:block">
              <div
                className="h-full bg-green-500 transition-all duration-1000"
                style={{ width: `${currentUnitPlan.progress?.percentage}%` }}
              />
            </div>
            <span className="font-black text-green-600 text-sm">
              {currentUnitPlan.progress?.percentage}%
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNE GAUCHE : Détails des semaines */}
        <div className="lg:col-span-2 space-y-8">
          <header>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Semestre {currentUnitPlan.semester}
              </span>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">
                {moment(currentUnitPlan.startDate).format("LL")} —{" "}
                {moment(currentUnitPlan.endDate).format("LL")}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              {currentUnitPlan.title}
            </h1>
          </header>

          {/* Timeline des semaines */}
          <div className="space-y-10">
            {currentUnitPlan.weeks.map((week) => (
              <section
                key={week.weekNumber}
                className="relative pl-8 border-l-2 border-slate-200 ml-4"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-sm" />
                <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                  {week.label}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {week.sessions.map((session, idx) => (
                    <div
                      key={idx}
                      // AJOUT DE L'INTERACTIVITÉ ICI
                      onClick={() => handleOpenJoudada(session._id)}
                      className={`group cursor-pointer p-4 rounded-2xl border transition-all hover:shadow-xl hover:scale-[1.02] active:scale-95 ${
                        session.type === "cours"
                          ? "bg-white border-slate-200 hover:border-blue-400"
                          : "bg-indigo-50 border-indigo-100 border-dashed border-2 hover:border-indigo-400"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-100 p-2 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <Calendar size={16} />
                          </div>
                          <span className="text-xs font-bold text-slate-500">
                            {moment(session.date).format("dddd DD/MM")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.status === "completed" && (
                            <CheckCircle2
                              size={18}
                              className="text-green-500"
                            />
                          )}
                          <ChevronRight
                            size={16}
                            className="text-slate-300 group-hover:text-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1 group-hover:text-blue-700 transition-colors">
                        {session.lessonTitle}
                      </h4>
                      <p className="text-xs text-slate-500 italic mb-3">
                        {session.sectionTitle || "Session normale"}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                            session.type === "cours"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {session.type}
                        </span>

                        {/* INDICATEUR DE FICHE DISPONIBLE */}
                        <div className="flex items-center gap-1 text-blue-600 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          <FileText size={12} />
                          Fiche de prépa
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <Clock size={12} /> {session.startTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE : Compétences visées et Ressources */}
        <div className="space-y-6">
          {/* Compétences & Connaissances */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" /> Compétences visées
            </h3>
            <div className="space-y-2">
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                <div className="flex gap-3 text-sm text-slate-700 leading-relaxed italic">
                  {/* Une seule puce car c'est un texte global */}
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <p>
                    {currentUnitPlan.competences ||
                      "Aucune compétence définie pour cette unité."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ressources & Liens */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <ExternalLink size={18} className="text-indigo-600" />{" "}
                Ressources
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Modifier
                </button>
              )}
            </div>

            <div className="space-y-3">
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between group bg-slate-50 p-2 rounded-xl"
                >
                  <span className="text-xs text-slate-600 truncate flex-1 pr-2">
                    {res}
                  </span>
                  {isEditing ? (
                    <button
                      onClick={() => removeResource(idx)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : (
                    <ExternalLink size={12} className="text-slate-300" />
                  )}
                </div>
              ))}

              {isEditing && (
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    placeholder="Lien ou titre..."
                    className="flex-1 text-xs border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={addResource}
                    className="p-2 bg-blue-600 text-white rounded-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Remarques / Observations */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-amber-500" /> Remarques
            </h3>
            {isEditing ? (
              <textarea
                value={remarques}
                onChange={(e) => setRemarques(e.target.value)}
                className="w-full h-32 text-sm border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Notes sur la classe, difficultés rencontrées..."
              />
            ) : (
              <p className="text-sm text-slate-500 italic leading-relaxed">
                {remarques || "Aucune remarque pour le moment."}
              </p>
            )}

            {isEditing && (
              <button
                onClick={handleSaveData}
                className="w-full mt-4 bg-slate-900 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <Save size={18} /> Enregistrer les modifs
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// COMPOSANTS DE FEEDBACK
const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto p-8 animate-pulse">
    <div className="h-10 bg-slate-200 rounded-xl w-1/4 mb-10"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-96 bg-slate-200 rounded-3xl"></div>
      <div className="h-96 bg-slate-200 rounded-3xl"></div>
    </div>
  </div>
);

const ErrorView = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center p-6 text-center">
    <div className="max-w-sm bg-white p-8 rounded-3xl shadow-xl border">
      <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
      <h3 className="text-xl font-black text-slate-800 mb-2">Erreur</h3>
      <p className="text-slate-500 text-sm mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold"
      >
        Réessayer
      </button>
    </div>
  </div>
);

export default UnitPlanDetails;
