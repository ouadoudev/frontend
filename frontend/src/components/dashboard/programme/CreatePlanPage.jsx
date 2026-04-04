import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createAnnualPlan,
  clearPlanningState,
} from "../../../store/planningSlice";
// Assumez que vous avez un slice pour récupérer les programmes officiels
import { fetchPrograms } from "../../../store/programSlice";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const CreatePlanPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { programs } = useSelector((state) => state.program); // Liste des programmes PC, Maths, etc.
  const { loading, error, success } = useSelector((state) => state.planning);

  // --- ÉTAT DU FORMULAIRE ---
  const [formData, setFormData] = useState({
    programId: "",
    academicYear: "2025/2026",
    region: "National",
    startDate: "2025-09-02",
    endDate: "2026-06-30",
    ManuelScolaire: "",
    weeklySchedule: [
      { day: 1, startTime: "08:30", endTime: "10:30", durationHours: 2 },
    ],
  });

  useEffect(() => {
    dispatch(fetchPrograms());
    if (success) {
      toast.success("Planning généré avec succès !");
      navigate("/planning"); // Redirection vers la liste des plans
      dispatch(clearPlanningState());
    }
  }, [dispatch, success, navigate]);

  // --- GESTION DE L'EMPLOI DU TEMPS ---
  const addScheduleSlot = () => {
    setFormData({
      ...formData,
      weeklySchedule: [
        ...formData.weeklySchedule,
        { day: 1, startTime: "14:00", endTime: "16:00", durationHours: 2 },
      ],
    });
  };

  const removeSlot = (index) => {
    const newSchedule = formData.weeklySchedule.filter((_, i) => i !== index);
    setFormData({ ...formData, weeklySchedule: newSchedule });
  };

  const updateSlot = (index, field, value) => {
    const newSchedule = [...formData.weeklySchedule];
    newSchedule[index][field] =
      field === "day" || field === "durationHours" ? parseInt(value) : value;
    setFormData({ ...formData, weeklySchedule: newSchedule });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.programId)
      return toast.error("Veuillez choisir un programme");
    if (!formData.ManuelScolaire)
      return toast.error("Veuillez choisir un manuel scolaire");
    dispatch(createAnnualPlan(formData));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="inline-flex p-3 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Assistant de Planification
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">
            Générez votre année scolaire 2025/2026 en quelques secondes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1 : CONFIGURATION GÉNÉRALE */}
          {/* SECTION 1 : CONFIGURATION GÉNÉRALE */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <BookOpen size={16} /> Informations de base
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Programme Officiel */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  Programme Officiel
                </label>
                <select
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold"
                  value={formData.programId}
                  onChange={(e) =>
                    setFormData({ ...formData, programId: e.target.value })
                  }
                >
                  <option value="">Sélectionnez un programme...</option>
                  {programs?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.educationalLevel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Région (Vacances) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  Région (Vacances)
                </label>
                <select
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                >
                  <option value="National">National (Toutes zones)</option>
                  <option value="Zone 1">Zone 1</option>
                  <option value="Zone 2">Zone 2</option>
                  <option value="Zone 3">Zone 3</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Date de la rentrée */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  Date de la rentrée
                </label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              {/* Fin de l'année */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  Fin de l'année
                </label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Manuel Scolaire */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mt-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  Manuel Scolaire
                </label>
                <select
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold"
                  value={formData.ManuelScolaire}
                  onChange={(e) =>
                    setFormData({ ...formData, ManuelScolaire: e.target.value })
                  }
                >
                  <option value="">Sélectionnez un manuel...</option>
                  <option value="Etincelle physique chimie 1ère année collège">
                    Etincelle physique chimie 1ère année collège
                  </option>
                  <option value="Etincelle physique chimie 2ème année collège">
                    Etincelle physique chimie 2ème année collège
                  </option>
                  <option value="Etincelle physique chimie 3ème année collège">
                    Etincelle physique chimie 3ème année collège
                  </option>
                  <option value="Mon grand labo physique chimie 1ère année collège">
                    Mon grand labo physique chimie 1ère année collège
                  </option>
                  <option value="Mon grand labo physique chimie 2ème année collège">
                    Mon grand labo physique chimie 2ème année collège
                  </option>
                  <option value="Mon grand labo physique chimie 3ème année collège">
                    Mon grand labo physique chimie 3ème année collège
                  </option>
                  <option value="Univers Plus physique chimie 1ère année collège">
                    Univers Plus physique chimie 1ère année collège
                  </option>
                  <option value="Univers Plus physique chimie 2ème année collège">
                    Univers Plus physique chimie 2ème année collège
                  </option>
                  <option value="Univers Plus physique chimie 3ème année collège">
                    Univers Plus physique chimie 3ème année collège
                  </option>
                  <option value="AL Moufid en Physique Chimie 1ère année collège">
                    AL Moufid en Physique Chimie 1ère année collège
                  </option>
                  <option value="AL Moufid en Physique Chimie 2ème année collège">
                    AL Moufid en Physique Chimie 2ème année collège
                  </option>
                  <option value="AL Moufid en Physique Chimie 3ème année collège">
                    AL Moufid en Physique Chimie 3ème année collège
                  </option>
                  <option value="Manuel personnalisé">
                    Manuel personnalisé
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2 : EMPLOI DU TEMPS HEBDOMADAIRE */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock size={16} /> Emploi du temps
              </h2>
              <button
                type="button"
                onClick={addScheduleSlot}
                className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase"
              >
                <Plus size={14} /> Ajouter un créneau
              </button>
            </div>

            <div className="space-y-4">
              {formData.weeklySchedule.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative group"
                >
                  <div className="flex-1 w-full space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                      Jour
                    </label>
                    <select
                      className="w-full bg-white border-none rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm"
                      value={slot.day}
                      onChange={(e) => updateSlot(index, "day", e.target.value)}
                    >
                      <option value={1}>Lundi</option>
                      <option value={2}>Mardi</option>
                      <option value={3}>Mercredi</option>
                      <option value={4}>Jeudi</option>
                      <option value={5}>Vendredi</option>
                      <option value={6}>Samedi</option>
                    </select>
                  </div>

                  <div className="w-full md:w-32 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                      Début
                    </label>
                    <input
                      type="time"
                      className="w-full bg-white border-none rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateSlot(index, "startTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="w-full md:w-24 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                      Durée (H)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white border-none rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm"
                      value={slot.durationHours}
                      onChange={(e) =>
                        updateSlot(index, "durationHours", e.target.value)
                      }
                    />
                  </div>

                  {formData.weeklySchedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="p-2.5 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BOUTON GÉNÉRATION */}
          <div className="flex flex-col items-center gap-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold w-full border border-red-100">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                "Calcul en cours..."
              ) : (
                <>
                  LANCER LA GÉNÉRATION <ChevronRight size={24} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanPage;
