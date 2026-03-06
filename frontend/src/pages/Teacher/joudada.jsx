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
} from "lucide-react";
import moment from "moment";
import "moment/locale/fr";

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

  // les prolongements internes
  const addInternalProlongement = () => {
    const updated = [
      ...j.pedagogicalFrame.prolongements.internal,
      { theme: "", level: "", notions: [] },
    ];
    dispatch(
      updatePedagogicalFrame({
        field: "prolongements",
        value: { ...j.pedagogicalFrame.prolongements, internal: updated },
      }),
    );
  };

  const addInterdisciplinaryProlongement = () => {
    const updated = [
      ...j.pedagogicalFrame.prolongements.interdisciplinary,
      { discipline: "", notions: [] },
    ];
    dispatch(
      updatePedagogicalFrame({
        field: "prolongements",
        value: {
          ...j.pedagogicalFrame.prolongements,
          interdisciplinary: updated,
        },
      }),
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
          {/* Prolongements Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Lightbulb size={18} className="text-purple-500" /> Prolongements du cours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* COLONNE GAUCHE : INTERNE (Vertical) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={addInternalProlongement}
                    className="flex items-center gap-1 text-[12px] font-black text-purple-600 hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Plus size={14} /> Interne (Matière)
                  </button>
                </div>

                <div className="space-y-3">
                  {j.pedagogicalFrame.prolongements.internal.map((p, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-slate-50/50 p-4 rounded-2xl border border-transparent hover:border-purple-100 hover:bg-white transition-all shadow-sm"
                    >
                      <input
                        className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none mb-1"
                        placeholder="Thème (ex: Électronique de puissance)"
                        value={p.theme}
                        onChange={(e) => {
                          const updated = [
                            ...j.pedagogicalFrame.prolongements.internal,
                          ];
                          updated[idx] = {
                            ...updated[idx],
                            theme: e.target.value,
                          };
                          dispatch(
                            updatePedagogicalFrame({
                              field: "prolongements",
                              value: {
                                ...j.pedagogicalFrame.prolongements,
                                internal: updated,
                              },
                            }),
                          );
                        }}
                      />
                      <input
                        className="w-full bg-transparent text-[10px] text-slate-500 outline-none italic"
                        placeholder="Niveau (ex: 1ère Année Bac)"
                        value={p.level}
                        onChange={(e) => {
                          const updated = [
                            ...j.pedagogicalFrame.prolongements.internal,
                          ];
                          updated[idx] = {
                            ...updated[idx],
                            level: e.target.value,
                          };
                          dispatch(
                            updatePedagogicalFrame({
                              field: "prolongements",
                              value: {
                                ...j.pedagogicalFrame.prolongements,
                                internal: updated,
                              },
                            }),
                          );
                        }}
                      />

                      {/* Gestion simple des notions via virgule */}
                      <input
                        className="w-full bg-transparent text-[9px] text-purple-400 font-medium outline-none mt-2 border-t border-slate-100 pt-2"
                        placeholder="Notions (séparées par des virgules)"
                        value={p.notions?.join(", ")}
                        onChange={(e) => {
                          const updated = [
                            ...j.pedagogicalFrame.prolongements.internal,
                          ];
                          updated[idx] = {
                            ...updated[idx],
                            notions: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          };
                          dispatch(
                            updatePedagogicalFrame({
                              field: "prolongements",
                              value: {
                                ...j.pedagogicalFrame.prolongements,
                                internal: updated,
                              },
                            }),
                          );
                        }}
                      />

                      <button
                        onClick={() => {
                          const updated =
                            j.pedagogicalFrame.prolongements.internal.filter(
                              (_, i) => i !== idx,
                            );
                          dispatch(
                            updatePedagogicalFrame({
                              field: "prolongements",
                              value: {
                                ...j.pedagogicalFrame.prolongements,
                                internal: updated,
                              },
                            }),
                          );
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLONNE DROITE : INTERDISCIPLINAIRE (Horizontal) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={addInterdisciplinaryProlongement}
                    className="flex items-center gap-1 text-[14px] font-black text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Plus size={14} /> Interdisciplinaire
                  </button>
                </div>

                <div className="space-y-3">
                  {j.pedagogicalFrame.prolongements.interdisciplinary.map(
                    (p, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-blue-50/30 p-4 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all shadow-sm"
                      >
                        <input
                          className="w-full bg-transparent text-[11px] font-black text-blue-700 outline-none uppercase tracking-wide"
                          placeholder="Discipline (ex: SVT, MATHS)"
                          value={p.discipline}
                          onChange={(e) => {
                            const updated = [
                              ...j.pedagogicalFrame.prolongements
                                .interdisciplinary,
                            ];
                            updated[idx] = {
                              ...updated[idx],
                              discipline: e.target.value,
                            };
                            dispatch(
                              updatePedagogicalFrame({
                                field: "prolongements",
                                value: {
                                  ...j.pedagogicalFrame.prolongements,
                                  interdisciplinary: updated,
                                },
                              }),
                            );
                          }}
                        />

                        <input
                          className="w-full bg-transparent text-[9px] text-blue-400 font-medium outline-none mt-2 border-t border-blue-100 pt-2"
                          placeholder="Notions transversales..."
                          value={p.notions?.join(", ")}
                          onChange={(e) => {
                            const updated = [
                              ...j.pedagogicalFrame.prolongements
                                .interdisciplinary,
                            ];
                            updated[idx] = {
                              ...updated[idx],
                              notions: e.target.value
                                .split(",")
                                .map((s) => s.trim()),
                            };
                            dispatch(
                              updatePedagogicalFrame({
                                field: "prolongements",
                                value: {
                                  ...j.pedagogicalFrame.prolongements,
                                  interdisciplinary: updated,
                                },
                              }),
                            );
                          }}
                        />

                        <button
                          onClick={() => {
                            const updated =
                              j.pedagogicalFrame.prolongements.interdisciplinary.filter(
                                (_, i) => i !== idx,
                              );
                            dispatch(
                              updatePedagogicalFrame({
                                field: "prolongements",
                                value: {
                                  ...j.pedagogicalFrame.prolongements,
                                  interdisciplinary: updated,
                                },
                              }),
                            );
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : DÉROULEMENT (Le Scénario) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">
              Scénario de la séance
            </h3>
            <button
              onClick={() => dispatch(addStep())}
              className="flex items-center gap-1 text-blue-600 font-black text-xs hover:underline uppercase"
            >
              <Plus size={14} /> Ajouter une étape
            </button>
          </div>

          <div className="space-y-4">
            {j.steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <input
                    className="text-xl font-black text-slate-800 bg-transparent outline-none focus:text-blue-600 w-full md:w-auto"
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

                  <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
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
                      className="bg-transparent text-[10px] font-black uppercase text-slate-500 outline-none cursor-pointer"
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
                      className="text-slate-300 hover:text-red-500 ml-2 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2">
                      <Lightbulb size={12} /> Activités de l'enseignant
                    </label>
                    <textarea
                      className="w-full bg-slate-50/50 border-none rounded-2xl p-4 text-xs h-32 outline-none focus:ring-2 ring-blue-100 transition-all leading-relaxed"
                      placeholder="Quelles questions ? Quelle expérience montrer ?"
                      value={step.teacherActivity}
                      onChange={(e) =>
                        dispatch(
                          updateStep({
                            index,
                            field: "teacherActivity",
                            value: e.target.value,
                          }),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">
                      <Users size={12} /> Activités de l'apprenant
                    </label>
                    <textarea
                      className="w-full bg-slate-50/50 border-none rounded-2xl p-4 text-xs h-32 outline-none focus:ring-2 ring-emerald-100 transition-all leading-relaxed"
                      placeholder="Que fait l'élève ? Ce qu'il doit écrire..."
                      value={step.studentActivity}
                      onChange={(e) =>
                        dispatch(
                          updateStep({
                            index,
                            field: "studentActivity",
                            value: e.target.value,
                          }),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Observations finales */}
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
