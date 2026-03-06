import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnitPlan, clearUnitPlanState } from '../../store/unitPlanSlice';
import { 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  CheckCircle2,
  ListChecks
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GenerateUnitPlan = () => {
  const { annualPlanId, unitId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUnitPlan, loading, error } = useSelector((state) => state.unitPlan);
  const [step, setStep] = useState('idle'); // 'idle' | 'generating' | 'success'

  useEffect(() => {
    // Si on arrive sur cette page, on lance la récupération/génération
    handleGenerate();
    return () => dispatch(clearUnitPlanState());
  }, []);

  const handleGenerate = async () => {
    setStep('generating');
    // Le thunk fetchUnitPlan appelle le contrôleur qui fait "getOrGenerate"
    const result = await dispatch(fetchUnitPlan({ annualPlanId, unitId }));
    
    if (fetchUnitPlan.fulfilled.match(result)) {
      setStep('success');
      // On attend 2 secondes pour montrer le succès avant de rediriger
      setTimeout(() => {
        navigate(`/unit-planning/${annualPlanId}/${unitId}`);
      }, 2000);
    } else {
      setStep('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        
        <AnimatePresence mode="wait">
          {/* ÉTAPE : GÉNÉRATION EN COURS */}
          {step === 'generating' && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-100 border border-slate-100 text-center"
            >
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 border-4 border-blue-50 rounded-full flex items-center justify-center">
                  <Loader2 className="text-blue-600 animate-spin" size={40} />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg"
                >
                  <Sparkles size={16} />
                </motion.div>
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
                Moteur de Planification
              </h2>
              <div className="space-y-3">
                <p className="text-slate-500 font-medium leading-relaxed">
                  Nous analysons votre plan annuel pour extraire les leçons, les activités de soutien et les dates de vacances...
                </p>
                
                <div className="flex flex-col gap-2 pt-6">
                   <LoadingTask label="Scan du calendrier scolaire" delay={0} />
                   <LoadingTask label="Groupement hebdomadaire des leçons" delay={0.5} />
                   <LoadingTask label="Injection des compétences officielles" delay={1} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE : SUCCÈS */}
          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-green-100 border border-green-50 text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
                Répartition Prête !
              </h2>
              <p className="text-slate-500 font-medium mb-8">
                L'unité a été organisée par semaines. Redirection vers votre tableau de bord moyen terme...
              </p>
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm uppercase tracking-widest animate-pulse">
                Ouverture <ChevronRight size={16} />
              </div>
            </motion.div>
          )}

          {/* ÉTAPE : ERREUR */}
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-red-100 border border-red-50 text-center"
            >
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={48} />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Génération interrompue</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">{error}</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} /> Retour
                </button>
                <button 
                  onClick={handleGenerate}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Réessayer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

// --- PETIT COMPOSANT DE FEEDBACK VISUEL ---
const LoadingTask = ({ label, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center gap-3 text-left px-4 py-2 rounded-xl bg-slate-50 border border-slate-100"
  >
    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
  </motion.div>
);

export default GenerateUnitPlan;