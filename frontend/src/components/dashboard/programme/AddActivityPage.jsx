import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addActivitySession, clearPlanningState } from '../../../store/planningSlice';
import { 
  Calendar, Clock, Zap, Save, ChevronLeft, 
  AlertCircle, Info, Sparkles, Timer
} from 'lucide-react';
import { toast } from 'react-toastify';
import moment from 'moment';

const AddActivityPage = () => {
  const { planId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, success } = useSelector((state) => state.planning);

  // --- ÉTAT DU FORMULAIRE ---
  const [formData, setFormData] = useState({
    date: moment().format('YYYY-MM-DD'),
    startTime: '08:30',
    durationHours: 2,
    type: 'activités de soutien et de remédiation',
    description: ''
  });

  // --- OPTIONS DU SYSTÈME MAROCAIN (Basé sur votre Schema) ---
  const activityTypes = [
    { value: "activités de soutien et de remédiation", label: "Soutien et Remédiation (TaRL/Soutien)" },
    { value: "évaluation diagnostique", label: "Évaluation Diagnostique (Début)" },
    { value: "surveillance continue", label: "Surveillance Continue (Contrôle)" },
    { value: "stabilisation", label: "Stabilisation des acquis" },
    { value: "activités d'évaluation", label: "Activités d'évaluation (Formative)" },
    { value: "correction du contrôle continu", label: "Correction du contrôle" }
  ];

  useEffect(() => {
    if (success) {
      toast.success("Activité ajoutée. Les cours ont été décalés !");
      navigate(`/planning/view/${planId}`);
      dispatch(clearPlanningState());
    }
  }, [success, dispatch, navigate, planId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.date || !formData.startTime) {
      return toast.error("Veuillez remplir tous les champs obligatoires");
    }

    dispatch(addActivitySession({ 
      planId, 
      data: formData 
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* BOUTON RETOUR */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Retour au planning
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* HEADER COLORÉ */}
          <div className="bg-indigo-600 p-8 text-white relative">
            <div className="relative z-10">
              <div className="inline-flex p-3 bg-indigo-500 rounded-2xl mb-4 shadow-lg">
                <Zap size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tight uppercase">Ajouter une Activité</h1>
              <p className="text-indigo-100 text-sm mt-1 font-medium">Insérez une séance personnalisée dans votre emploi du temps.</p>
            </div>
            {/* Décoration de fond */}
            <Sparkles className="absolute top-8 right-8 opacity-20 text-white" size={60} />
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* ALERTE RIPPLE EFFECT */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4">
              <div className="bg-amber-100 text-amber-600 p-2 rounded-xl h-fit">
                <Info size={20} />
              </div>
              <div>
                <h4 className="text-amber-800 font-bold text-sm">Effet de décalage automatique</h4>
                <p className="text-amber-700/80 text-xs mt-0.5 leading-relaxed">
                  Si vous choisissez un créneau déjà occupé par une leçon, celle-ci et les suivantes seront 
                  automatiquement décalées vers vos prochains créneaux disponibles.
                </p>
              </div>
            </div>

            {/* TYPE D'ACTIVITÉ */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nature de l'activité</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DATE */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={14} /> Date de la séance
                </label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              {/* HEURE DÉBUT */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Clock size={14} /> Heure de début
                </label>
                <input 
                  type="time" 
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                />
              </div>
            </div>

            {/* DURÉE ET DESCRIPTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Timer size={14} /> Durée (H)
                  </label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                    value={formData.durationHours}
                    onChange={(e) => setFormData({...formData, durationHours: parseInt(e.target.value)})}
                  >
                    <option value={1}>1 Heure</option>
                    <option value={2}>2 Heures</option>
                    <option value={4}>4 Heures</option>
                  </select>
               </div>
               
               <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description / Notes</label>
                  <input 
                    type="text"
                    placeholder="Ex: Chapitre 2 - Électricité..."
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
               </div>
            </div>

            {/* ERREUR BACKEND */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            {/* BOUTON VALIDATION */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? "Calcul du nouveau plan..." : (
                  <>ENREGISTRER L'ACTIVITÉ <Save size={20} /></>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddActivityPage;