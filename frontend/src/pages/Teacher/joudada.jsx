import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrCreateJoudada,
  saveJoudada,
  updateStep,
  addStep,
  removeStep,
  updatePedagogicalFrame,
  updateObservations,
  resetJoudadaState,
} from "../../store/joudadaSlice";
import {
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Target,
  Clock,
  FileText,
  CheckCircle,
  Lightbulb,
  Users,
  Activity,
} from "lucide-react";
import moment from "moment";
import "moment/locale/fr";

const BulletTextarea = ({ value, onChange, placeholder, className }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue =
        value.substring(0, start) + "\n• " + value.substring(end);

      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 3;
      }, 0);
    }
  };

  const handleFocus = () => {
    if (!value || value.trim() === "") {
      onChange("• ");
    }
  };

  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      className={className}
    />
  );
};

const JoudadaPage = () => {
  const { annualPlanId, sessionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentJoudada: j,
    loading,
    saving,
    error,
    success,
  } = useSelector((state) => state.joudada);
  const [newTool, setNewTool] = useState("");

  useEffect(() => {
    dispatch(fetchOrCreateJoudada({ annualPlanId, sessionId }));
    return () => dispatch(resetJoudadaState());
  }, [dispatch, annualPlanId, sessionId]);

  // --- HANDLERS ---
  const handleAddTool = () => {
    if (!newTool.trim()) return;
    const updatedTools = [...j.pedagogicalFrame.didacticTools, newTool.trim()];
    dispatch(
      updatePedagogicalFrame({ field: "didacticTools", value: updatedTools }),
    );
    setNewTool("");
  };

  const handleRemoveTool = (index) => {
    const updatedTools = j.pedagogicalFrame.didacticTools.filter(
      (_, i) => i !== index,
    );
    dispatch(
      updatePedagogicalFrame({ field: "didacticTools", value: updatedTools }),
    );
  };

  const handleUpdatePrerequisite = (index, value) => {
    const updated = [...j.pedagogicalFrame.prerequisites];
    updated[index] = value;
    dispatch(
      updatePedagogicalFrame({ field: "prerequisites", value: updated }),
    );
  };

  const addPrerequisite = () => {
    const updated = [...j.pedagogicalFrame.prerequisites, ""];
    dispatch(
      updatePedagogicalFrame({ field: "prerequisites", value: updated }),
    );
  };

  if (loading) return <LoadingSkeleton />;
  if (!j) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* NAVBAR D'ACTION */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase transition-colors"
          >
            <ChevronLeft size={18} /> Retour au plan
          </button>

          <div className="flex items-center gap-4">
            {success && (
              <span className="text-green-500 text-xs font-bold animate-fade-out">
                Modifications enregistrées !
              </span>
            )}
            <button
              onClick={() => dispatch(saveJoudada(j))}
              disabled={saving}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50"
            >
              <Save size={16} /> {saving ? "Sauvegarde..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNE GAUCHE : INFOS & CADRE */}
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <FileText size={24} />
              <h2 className="font-black uppercase text-sm tracking-tighter">
                Entête Officielle
              </h2>
            </div>
            <div className="space-y-4">
              <InfoRow label="Matière" value={j.header.subject} />
              <InfoRow label="Leçon" value={j.header.lessonTitle} />
              <InfoRow label="Section" value={j.header.sectionTitle} />
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Séance" value={j.header.sessionNumber} />
                <InfoRow label="Durée" value={j.header.duration} />
              </div>
              <InfoRow
                label="Date"
                value={moment(j.header.date).format("LL")}
              />
            </div>
          </div>
          {/* competence Specifique Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" /> Compétence
              spécifique
            </h3>

            <textarea
              className="w-full bg-green-50/40 border-none rounded-2xl p-4 text-xs h-24 outline-none focus:ring-2 ring-green-100 leading-relaxed"
              placeholder="Ex : Mobiliser les connaissances sur les états de la matière pour interpréter des phénomènes observés..."
              value={j.pedagogicalFrame.competenceSpecifique || ""}
              onChange={(e) =>
                dispatch(
                  updatePedagogicalFrame({
                    field: "competenceSpecifique",
                    value: e.target.value,
                  }),
                )
              }
            />
          </div>

          {/* Objectifs Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target size={18} className="text-red-500" /> Connaissances
              habiletés
            </h3>
            <div className="space-y-2">
              {j.pedagogicalFrame.objectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] font-bold text-blue-800 leading-tight"
                >
                  <CheckCircle size={14} className="shrink-0" /> {obj}
                </div>
              ))}
            </div>
          </div>

          {/* Pré-requis Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-orange-500" /> Pré-requis
            </h3>
            <div className="space-y-2">
              {j.pedagogicalFrame.prerequisites.map((pre, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <input
                    className="flex-1 bg-orange-50/30 border-none rounded-xl px-3 py-2 text-[11px] font-medium outline-none focus:ring-1 ring-orange-200"
                    value={pre}
                    onChange={(e) =>
                      handleUpdatePrerequisite(i, e.target.value)
                    }
                    placeholder="Acquis antérieurs..."
                  />
                  <button
                    onClick={() => {
                      const filtered = j.pedagogicalFrame.prerequisites.filter(
                        (_, idx) => idx !== i,
                      );
                      dispatch(
                        updatePedagogicalFrame({
                          field: "prerequisites",
                          value: filtered,
                        }),
                      );
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addPrerequisite}
                className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all text-[10px] font-black uppercase"
              >
                + Ajouter un pré-requis
              </button>
            </div>
          </div>

          {/* Supports Manager Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-500" /> Supports
              Didactiques
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {j.pedagogicalFrame.didacticTools.map((tool, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase border border-slate-200"
                >
                  {tool}
                  <button
                    onClick={() => handleRemoveTool(i)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="Ajouter un support..."
                className="flex-1 bg-slate-50 border-none rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 ring-blue-200"
              />
              <button
                onClick={handleAddTool}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-amber-500" />{" "}
              Auto-évaluation / Observations
            </h3>
            <textarea
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs h-24 outline-none focus:ring-2 ring-amber-100"
              placeholder="Difficultés rencontrées, remédiation à prévoir pour la séance suivante..."
              value={j.observations}
              onChange={(e) => dispatch(updateObservations(e.target.value))}
            />
          </div>
        </div>

        {/* COLONNE DROITE : DÉROULEMENT (Le Scénario) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SITUATION DE DÉPART (Améliorée) */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-[2.5rem] p-8 shadow-xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Lightbulb size={20} />
              </div>
              <h2 className="font-black uppercase text-xl tracking-widest">
                Situation de départ
              </h2>
            </div>
            <textarea
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm font-medium placeholder:text-blue-200 outline-none focus:ring-2 ring-white/30 transition-all min-h-[120px] leading-relaxed"
              placeholder="Décrivez ici la situation déclenchante, l'obstacle ou le défi proposé aux élèves..."
              value={j.pedagogicalFrame.situation}
              onChange={(e) =>
                dispatch(
                  updatePedagogicalFrame({
                    field: "situation",
                    value: e.target.value,
                  }),
                )
              }
            />
          </div>

          <div className="flex justify-between items-center px-4">
            <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">
              Déroulement des activités
            </h3>
            <button
              onClick={() => dispatch(addStep())}
              className="flex items-center gap-1 bg-white text-blue-600 px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-black text-xs hover:bg-blue-50 transition-colors"
            >
              <Plus size={14} /> Ajouter une phase
            </button>
          </div>

          {/* PHASES DU COURS */}
          <div className="space-y-6">
            {j.steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <input
                    className="text-2xl font-black text-slate-800 bg-transparent outline-none focus:text-blue-600 flex-1"
                    value={step.phase}
                    onChange={(e) =>
                      dispatch(
                        updateStep({
                          index,
                          field: "phase",
                          value: e.target.value,
                        }),
                      )
                    }
                  />

                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={14} />
                      <input
                        type="number"
                        className="w-8 bg-transparent font-black text-xs"
                        value={step.duration}
                        onChange={(e) =>
                          dispatch(
                            updateStep({
                              index,
                              field: "duration",
                              value: parseInt(e.target.value),
                            }),
                          )
                        }
                      />
                      <span className="text-[10px] font-bold uppercase">
                        min
                      </span>
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <select
                      className="bg-transparent text-[10px] font-black uppercase text-slate-500 outline-none"
                      value={step.modality}
                      onChange={(e) =>
                        dispatch(
                          updateStep({
                            index,
                            field: "modality",
                            value: e.target.value,
                          }),
                        )
                      }
                    >
                      <option value="Collectif">Collectif</option>
                      <option value="Groupes">En Groupes</option>
                      <option value="Individuel">Individuel</option>
                      <option value="Binômes">Binômes</option>
                    </select>
                    <button
                      onClick={() => dispatch(removeStep(index))}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Activités Enseignant */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2">
                      <Lightbulb size={12} /> Activités de l'enseignant
                    </label>
                    <BulletTextarea
                      className="w-full bg-slate-50/50 border-none rounded-3xl p-5 text-xs h-40 outline-none focus:ring-2 ring-blue-100 leading-relaxed"
                      placeholder="Activités de l'enseignant..."
                      value={step.teacherActivity}
                      onChange={(value) =>
                        dispatch(
                          updateStep({
                            index,
                            field: "teacherActivity",
                            value,
                          }),
                        )
                      }
                    />
                  </div>

                  {/* Activités Apprenant */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">
                      <Users size={12} /> Activités de l'apprenant
                    </label>
                    <BulletTextarea
                      className="w-full bg-slate-50/50 border-none rounded-3xl p-5 text-xs h-40 outline-none focus:ring-2 ring-emerald-100 leading-relaxed"
                      placeholder="Activités des apprenants..."
                      value={step.studentActivity}
                      onChange={(value) =>
                        dispatch(
                          updateStep({
                            index,
                            field: "studentActivity",
                            value,
                          }),
                        )
                      }
                    />
                  </div>

                  {/* ÉVALUATION DE LA PHASE (Améliorée) */}
                  <div className="md:col-span-2 bg-amber-50/40 rounded-[2rem] p-6 border border-amber-100/50">
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                        <CheckCircle size={14} /> Évaluation & Indicateurs de
                        réussite
                      </label>
                      <select
                        className="bg-white text-[9px] font-black uppercase text-amber-700 outline-none px-3 py-1.5 rounded-xl border border-amber-200 shadow-sm"
                        value={step.evaluation?.evaluationType || "Formative"}
                        onChange={(e) =>
                          dispatch(
                            updateStep({
                              index,
                              field: "evaluation.evaluationType",
                              value: e.target.value,
                            }),
                          )
                        }
                      >
                        <option value="Diagnostic">Diagnostic</option>
                        <option value="Formative">Formative</option>
                        <option value="Sommative">Sommative</option>
                      </select>
                    </div>
                    <BulletTextarea
                      className="w-full bg-white/60 border-none rounded-2xl p-4 text-[11px] h-20 outline-none focus:ring-2 ring-amber-200 italic leading-relaxed"
                      placeholder="Indicateurs de réussite..."
                      value={step.evaluation?.evaluationCriteria || ""}
                      onChange={(value) =>
                        dispatch(
                          updateStep({
                            index,
                            field: "evaluation",
                            value: {
                              ...step.evaluation,
                              evaluationCriteria: value,
                            },
                          }),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- COMPOSANTS INTERNES ---

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
      {label}
    </p>
    <p className="text-sm font-bold text-slate-700 leading-tight">
      {value || "---"}
    </p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto p-10 animate-pulse space-y-8">
    <div className="h-20 bg-slate-200 rounded-3xl w-full"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="h-96 bg-slate-200 rounded-3xl"></div>
      <div className="lg:col-span-2 h-96 bg-slate-200 rounded-3xl"></div>
    </div>
  </div>
);

export default JoudadaPage;
