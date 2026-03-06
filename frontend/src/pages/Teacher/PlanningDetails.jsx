// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAnnualPlanById,
//   updateSessionStatus,
//   publishAnnualPlan,
//   clearCurrentPlan,
// } from "../../store/planningSlice";
// import {
//   Calendar,
//   CheckCircle,
//   Clock,
//   MoreVertical,
//   Download,
//   Send,
//   AlertTriangle,
//   BookOpen,
//   Umbrella,
//   Flag,
//   ShieldCheck,
//   Plus,
//   Info,
// } from "lucide-react";
// import moment from "moment";
// import "moment/locale/fr";

// const PlanningDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { currentPlan, loading, error } = useSelector(
//     (state) => state.planning,
//   );
//   const [activeSemester, setActiveSemester] = useState("S1");

//   useEffect(() => {
//     dispatch(fetchAnnualPlanById(id));
//     return () => dispatch(clearCurrentPlan());
//   }, [dispatch, id]);

//   /**
//    * FUSION ET TRI DES DONNÉES
//    * On combine Sessions, ActivitySessions et CalendarEvents
//    */
//   const timelineData = useMemo(() => {
//     if (!currentPlan) return {};

//     // 1. Transformer les cours
//     const courses = (currentPlan.sessions || []).map((s) => ({
//       ...s,
//       viewType: "COURSE",
//       sortDate: new Date(s.date),
//     }));

//     // 2. Transformer les activités manuelles (soutien/stabilisation)
//     const activities = (currentPlan.activitySessions || []).map((a) => ({
//       ...a,
//       viewType: "ACTIVITY",
//       sortDate: new Date(a.date),
//     }));

//     // 3. Transformer les vacances et jours fériés
//     const holidays = (currentPlan.calendarEvents || []).map((h) => ({
//       ...h,
//       viewType: "HOLIDAY",
//       date: h.startDate, // On utilise startDate pour le positionnement
//       sortDate: new Date(h.startDate),
//     }));

//     // Fusionner tout
//     const allItems = [...courses, ...activities, ...holidays];

//     // Filtrer par semestre
//     // Note: On définit le semestre selon le mois si non spécifié (pour les vacances)
//     const filtered = allItems.filter((item) => {
//       if (item.semester) return item.semester === activeSemester;
//       const month = moment(item.sortDate).month(); // 0-11
//       const itemSem = month >= 7 || month <= 0 ? "S1" : "S2";
//       return itemSem === activeSemester;
//     });

//     // Trier chronologiquement
//     const sorted = filtered.sort((a, b) => a.sortDate - b.sortDate);

//     // Grouper par mois
//     const grouped = {};
//     sorted.forEach((item) => {
//       const monthKey = moment(item.sortDate).format("MMMM YYYY");
//       if (!grouped[monthKey]) grouped[monthKey] = [];
//       grouped[monthKey].push(item);
//     });

//     return grouped;
//   }, [currentPlan, activeSemester]);

//   const handleToggleStatus = (sessionId, currentStatus) => {
//     const newStatus = currentStatus === "completed" ? "planned" : "completed";
//     dispatch(
//       updateSessionStatus({
//         planId: id,
//         sessionId,
//         data: { status: newStatus },
//       }),
//     );
//   };

//   const handlePublish = () => {
//     if (
//       window.confirm(
//         "Voulez-vous publier ce plan ? Il sera visible par l'administration.",
//       )
//     ) {
//       dispatch(publishAnnualPlan(id));
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;
//   if (!currentPlan) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 pb-12">
//       {/* HEADER */}
//       <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <h1 className="text-xl font-bold text-gray-900">
//                 {currentPlan.program?.title}
//               </h1>
//               <span
//                 className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
//                   currentPlan.isPublished
//                     ? "bg-green-100 text-green-700"
//                     : "bg-gray-100 text-gray-500"
//                 }`}
//               >
//                 {currentPlan.isPublished ? "Publié" : "Brouillon"}
//               </span>
//             </div>
//             <p className="text-sm text-gray-500 font-medium italic">
//               Année Scolaire {currentPlan.academicYear} • {currentPlan.region}
//             </p>
//           </div>

//           <div className="flex gap-2 w-full md:w-auto">
//             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
//               <Download size={16} /> Export PDF
//             </button>
//             {!currentPlan.isPublished && (
//               <button
//                 onClick={handlePublish}
//                 className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 shadow-md"
//               >
//                 <Send size={16} /> Publier
//               </button>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
//         {/* PROGRESSION & STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white rounded-2xl p-6 border shadow-sm md:col-span-2 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
//                 <BookOpen size={24} />
//               </div>
//               <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                   Progression
//                 </p>
//                 <h2 className="text-2xl font-black text-gray-800">
//                   {currentPlan.progress?.percentage || 0}%
//                 </h2>
//               </div>
//             </div>
//             <div className="flex-1 max-w-xs ml-8 hidden sm:block h-2 bg-gray-100 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-blue-600"
//                 style={{ width: `${currentPlan.progress?.percentage}%` }}
//               ></div>
//             </div>
//           </div>
//           <div className="bg-indigo-600 rounded-2xl p-6 shadow-md text-white flex items-center justify-between">
//             <div>
//               <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">
//                 Activités / 12h
//               </p>
//               <h2 className="text-2xl font-black">
//                 {currentPlan.activitySessions?.length || 0} / 6{" "}
//                 <span className="text-sm font-normal text-indigo-200">
//                   séances
//                 </span>
//               </h2>
//             </div>
//             <ShieldCheck size={32} className="opacity-50" />
//           </div>
//         </div>

//         {/* SEMESTER SELECTOR */}
//         <div className="flex justify-center mb-10">
//           <div className="bg-gray-200 p-1 rounded-xl flex w-full max-w-xs shadow-inner">
//             {["S1", "S2"].map((sem) => (
//               <button
//                 key={sem}
//                 onClick={() => setActiveSemester(sem)}
//                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeSemester === sem ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
//               >
//                 Semestre {sem === "S1" ? "1" : "2"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* TIMELINE */}
//         <div className="space-y-12">
//           {Object.entries(timelineData).map(([month, items]) => (
//             <section key={month}>
//               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Calendar size={14} /> {month}
//               </h3>

//               <div className="space-y-4">
//                 {items.map((item, idx) => {
//                   // --- TYPE 1: VACANCES / FÉRIÉS ---
//                   if (item.viewType === "HOLIDAY") {
//                     return (
//                       <div
//                         key={`hol-${idx}`}
//                         className="bg-amber-100 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 text-amber-800"
//                       >
//                         <div className="p-2 bg-amber-200 rounded-full">
//                           {item.type === "vacances" ? (
//                             <Umbrella size={20} />
//                           ) : (
//                             <Flag size={20} />
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
//                             {moment(item.startDate).format("DD MMMM")} —{" "}
//                             {moment(item.endDate).format("DD MMMM")}
//                           </p>
//                           <h4 className="font-black italic uppercase tracking-wide">
//                             {item.title}
//                           </h4>
//                         </div>
//                         <span className="ml-auto text-[10px] font-bold border border-amber-300 px-2 py-0.5 rounded italic uppercase">
//                           Repos
//                         </span>
//                       </div>
//                     );
//                   }

//                   // --- TYPE 2: ACTIVITÉS MANUELLES (Soutien/Stabilisation) ---
//                   if (item.viewType === "ACTIVITY") {
//                     return (
//                       <div
//                         key={`act-${idx}`}
//                         className="bg-indigo-50 border-2 border-indigo-200 border-dashed rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md"
//                       >
//                         <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
//                           <ShieldCheck size={24} />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="text-[10px] font-black text-indigo-500 bg-white border border-indigo-100 px-2 py-0.5 rounded uppercase">
//                               {moment(item.date).format("dddd DD/MM")} •{" "}
//                               {item.startTime}
//                             </span>
//                             <span className="text-[10px] font-bold text-indigo-400 uppercase italic">
//                               Saisie Manuelle
//                             </span>
//                           </div>
//                           <h4 className="font-bold text-indigo-900 uppercase tracking-tight">
//                             {item.type}
//                           </h4>
//                           {item.observations && (
//                             <p className="text-xs text-indigo-500 flex items-center gap-1 italic">
//                               <Info size={12} /> {item.observations}
//                             </p>
//                           )}
//                         </div>
//                         <div className="text-right">
//                           <span className="text-xs font-black text-indigo-400 block tracking-widest">
//                             {item.durationHours}H
//                           </span>
//                           <button className="text-indigo-300 hover:text-indigo-600">
//                             <MoreVertical size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   }

//                   // --- TYPE 3: COURS NORMAUX ---
//                   return (
//                     <div
//                       key={item._id}
//                       className={`group bg-white border rounded-2xl p-4 transition-all hover:shadow-lg flex items-center gap-4 ${item.status === "completed" ? "opacity-60 grayscale-[0.5] bg-gray-50" : "hover:border-blue-300"}`}
//                     >
//                       <button
//                         onClick={() =>
//                           handleToggleStatus(item._id, item.status)
//                         }
//                         className={`flex-shrink-0 transition-colors ${item.status === "completed" ? "text-green-500" : "text-gray-200 hover:text-blue-400"}`}
//                       >
//                         <CheckCircle
//                           size={28}
//                           fill={
//                             item.status === "completed"
//                               ? "currentColor"
//                               : "none"
//                           }
//                         />
//                       </button>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex flex-wrap items-center gap-2 mb-1">
//                           <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
//                             {moment(item.date).format("dddd DD/MM")} •{" "}
//                             {item.startTime}
//                           </span>
//                           <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
//                             {item.unitTitle || "Unité"}
//                           </span>
//                           {item.isRamadan && (
//                             <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 italic">
//                               🌙 Ramadan
//                             </span>
//                           )}
//                         </div>
//                         <h4
//                           className={`font-bold truncate text-slate-800 ${item.status === "completed" ? "line-through text-slate-400" : ""}`}
//                         >
//                           {item.lessonTitle}
//                         </h4>
//                         <p className="text-xs text-slate-400 font-medium truncate italic">
//                           {item.sectionTitle || "Séance de cours"}
//                         </p>
//                       </div>

//                       <div className="flex flex-col items-end gap-1">
//                         <div className="flex items-center gap-1 text-[11px] font-black text-slate-400">
//                           <Clock size={12} /> {item.durationHours}h
//                         </div>
//                         <button className="text-gray-300 hover:text-gray-600 p-1">
//                           <MoreVertical size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>
//           ))}
//         </div>
//       </main>

//       {/* FAB - Ajouter activité manuelle */}
//       <button
//         className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110 group"
//         onClick={() => navigate(`/planning/${currentPlan._id}/add-activity`)}
//       >
//         <Plus size={28} />
//         <span className="absolute right-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//           Ajouter un soutien
//         </span>
//       </button>
//     </div>
//   );
// };

// // --- HELPERS ---

// const LoadingSpinner = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//     <p className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">
//       Génération du plan...
//     </p>
//   </div>
// );

// const ErrorMessage = ({ message }) => (
//   <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-red-100 rounded-3xl text-center shadow-2xl">
//     <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//       <AlertTriangle size={32} />
//     </div>
//     <h3 className="text-slate-800 font-black text-xl mb-2">Oups ! Erreur</h3>
//     <p className="text-slate-500 text-sm mb-6 leading-relaxed">{message}</p>
//     <button
//       onClick={() => window.location.reload()}
//       className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
//     >
//       Réessayer
//     </button>
//   </div>
// );

// export default PlanningDetails;

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnualPlanById,
  updateSessionStatus,
  publishAnnualPlan,
  clearCurrentPlan,
  downloadFile,
} from "../../store/planningSlice";
import {
  Calendar,
  CheckCircle,
  Clock,
  MoreVertical,
  Download,
  Send,
  AlertTriangle,
  BookOpen,
  Umbrella,
  Flag,
  ShieldCheck,
  Plus,
  Info,
  FileText, // Icone pour la Joudada
  ChevronRight, // Icone pour indiquer le lien vers l'unité
} from "lucide-react";
import moment from "moment";
import "moment/locale/fr";

const PlanningDetails = () => {
  const { id } = useParams(); // L'ID du plan annuel
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPlan, loading, error } = useSelector(
    (state) => state.planning,
  );
  const [activeSemester, setActiveSemester] = useState("S1");

  useEffect(() => {
    dispatch(fetchAnnualPlanById(id));
    return () => dispatch(clearCurrentPlan());
  }, [dispatch, id]);

  const timelineData = useMemo(() => {
    if (!currentPlan) return {};

    const courses = (currentPlan.sessions || []).map((s) => ({
      ...s,
      viewType: "COURSE",
      sortDate: new Date(s.date),
    }));

    const activities = (currentPlan.activitySessions || []).map((a) => ({
      ...a,
      viewType: "ACTIVITY",
      sortDate: new Date(a.date),
    }));

    const holidays = (currentPlan.calendarEvents || []).map((h) => ({
      ...h,
      viewType: "HOLIDAY",
      date: h.startDate,
      sortDate: new Date(h.startDate),
    }));

    const allItems = [...courses, ...activities, ...holidays];

    const filtered = allItems.filter((item) => {
      if (item.semester) return item.semester === activeSemester;
      const month = moment(item.sortDate).month();
      const itemSem = month >= 7 || month <= 0 ? "S1" : "S2";
      return itemSem === activeSemester;
    });

    const sorted = filtered.sort((a, b) => a.sortDate - b.sortDate);

    const grouped = {};
    sorted.forEach((item) => {
      const monthKey = moment(item.sortDate).format("MMMM YYYY");
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(item);
    });

    return grouped;
  }, [currentPlan, activeSemester]);

  const handleToggleStatus = (e, sessionId, currentStatus) => {
    e.stopPropagation(); // Empêche la navigation vers l'unité quand on coche
    const newStatus = currentStatus === "completed" ? "planned" : "completed";
    dispatch(
      updateSessionStatus({
        planId: id,
        sessionId,
        data: { status: newStatus },
      }),
    );
  };

  const handlePublish = () => {
    if (
      window.confirm(
        "Voulez-vous publier ce plan ? Il sera visible par l'administration.",
      )
    ) {
      dispatch(publishAnnualPlan(id));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!currentPlan) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* nom de prof  */}
              <h1 className="text-xl font-bold text-gray-900">
                {currentPlan.program?.educationalCycle}
              </h1>
              <h1 className="text-xl font-bold text-gray-900">
                {currentPlan.program?.educationalLevel}
              </h1>
              <h1 className="text-xl font-bold text-gray-900">
                {currentPlan.program?.subject}
              </h1>
              <h1 className="text-xl font-bold text-gray-900">
                {currentPlan.teacher.username}
              </h1>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${currentPlan.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
              >
                {currentPlan.isPublished ? "Publié" : "Brouillon"}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium italic">
              Année Scolaire {currentPlan.academicYear} • {currentPlan.region}
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
              onClick={() =>
                dispatch(
                  downloadFile({
                    url: "/exports/annual/" + id,
                    fileName: "Plan_Annuel.xlsx",
                  }),
                )
              }
            >
              <Download size={16} /> Export PDF
            </button>
            {!currentPlan.isPublished && (
              <button
                onClick={handlePublish}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 shadow-md"
              >
                <Send size={16} /> Publier
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border shadow-sm md:col-span-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Progression
                </p>
                <h2 className="text-2xl font-black text-gray-800">
                  {currentPlan.progress?.percentage || 0}%
                </h2>
              </div>
            </div>
            <div className="flex-1 max-w-xs ml-8 hidden sm:block h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${currentPlan.progress?.percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-indigo-600 rounded-2xl p-6 shadow-md text-white flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">
                Activités / 12h
              </p>
              <h2 className="text-2xl font-black">
                {currentPlan.activitySessions?.length || 0}{" "}
                <span className="text-sm font-normal text-indigo-200">
                  séances
                </span>
              </h2>
            </div>
            <ShieldCheck size={32} className="opacity-50" />
          </div>
        </div>

        {/* SEMESTER SELECTOR */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-200 p-1 rounded-xl flex w-full max-w-xs shadow-inner">
            {["S1", "S2"].map((sem) => (
              <button
                key={sem}
                onClick={() => setActiveSemester(sem)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeSemester === sem ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
              >
                Semestre {sem === "S1" ? "1" : "2"}
              </button>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="space-y-12">
          {Object.entries(timelineData).map(([month, items]) => (
            <section key={month}>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calendar size={14} /> {month}
              </h3>

              <div className="space-y-4">
                {items.map((item, idx) => {
                  if (item.viewType === "HOLIDAY") {
                    return (
                      <div
                        key={`hol-${idx}`}
                        className="bg-amber-100 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 text-amber-800"
                      >
                        <div className="p-2 bg-amber-200 rounded-full">
                          {item.type === "vacances" ? (
                            <Umbrella size={20} />
                          ) : (
                            <Flag size={20} />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
                            {moment(item.startDate).format("DD MMMM")} —{" "}
                            {moment(item.endDate).format("DD MMMM")}
                          </p>
                          <h4 className="font-black italic uppercase tracking-wide">
                            {item.title}
                          </h4>
                        </div>
                        <span className="ml-auto text-[10px] font-bold border border-amber-300 px-2 py-0.5 rounded italic uppercase">
                          Repos
                        </span>
                      </div>
                    );
                  }

                  if (item.viewType === "ACTIVITY") {
                    return (
                      <div
                        key={`act-${idx}`}
                        className="bg-indigo-50 border-2 border-indigo-200 border-dashed rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md cursor-pointer"
                        onClick={() => navigate(`/joudada/${id}/${item._id}`)}
                      >
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                          <ShieldCheck size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-indigo-500 bg-white border border-indigo-100 px-2 py-0.5 rounded uppercase">
                              {moment(item.date).format("dddd DD/MM")} •{" "}
                              {item.startTime}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase italic">
                              Saisie Manuelle
                            </span>
                          </div>
                          <h4 className="font-bold text-indigo-900 uppercase tracking-tight">
                            {item.type}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-indigo-400">
                            {item.durationHours}H
                          </span>
                          <button className="p-2 hover:bg-indigo-100 rounded-full text-indigo-400">
                            <FileText size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // --- COURS NORMAUX (LIEN VERS UNIT PLAN) ---
                  return (
                    <div
                      key={item._id}
                      // On ne navigue que si item.unitId existe
                      onClick={() => {
                        if (item.unitId) {
                          navigate(`/unit-plan/${id}/unit/${item.unitId}`);
                        }
                      }}
                      className={`group bg-white border rounded-2xl p-4 transition-all flex items-center gap-4 
    ${
      item.unitId
        ? "hover:shadow-lg cursor-pointer hover:border-blue-400"
        : "cursor-default border-slate-100" 
    } 
    ${item.status === "completed" ? "opacity-60 grayscale-[0.5] bg-gray-50" : ""}`}
                    >
                      <button
                        onClick={(e) =>
                          handleToggleStatus(e, item._id, item.status)
                        }
                        className={`flex-shrink-0 transition-colors ${
                          item.status === "completed"
                            ? "text-green-500"
                            : "text-gray-200 hover:text-blue-400"
                        }`}
                      >
                        <CheckCircle
                          size={28}
                          fill={
                            item.status === "completed"
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {moment(item.date).format("dddd DD/MM")} •{" "}
                            {item.startTime}
                          </span>
                          {/* Afficher l'unité seulement si elle existe */}
                          {item.unitTitle && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                              {item.unitTitle}
                            </span>
                          )}
                        </div>

                        <h4
                          className={`font-bold truncate text-slate-800 ${item.status === "completed" ? "line-through text-slate-400" : ""}`}
                        >
                          {item.lessonTitle}
                        </h4>

                        <p className="text-xs text-slate-500 font-medium italic mt-1 flex items-center gap-1">
                          <span className="truncate">
                            {item.sectionTitle || "Contenu de la leçon"}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* N'afficher les indicateurs de clic que si unitId existe */}
                        {item.unitId ? (
                          <>
                            <div className="text-right hidden sm:block">
                              <p className="text-xs text-slate-400 font-medium italic">
                                Voir le détail de l'unité
                              </p>
                            </div>
                            <button className="text-gray-300 group-hover:text-blue-600">
                              <ChevronRight size={24} />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2">
                            Fixe
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* FAB */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110 group"
        onClick={() => navigate(`/planning/${id}/add-activity`)}
      >
        <Plus size={28} />
        <span className="absolute right-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ajouter un soutien
        </span>
      </button>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="text-sm font-bold text-slate-400 animate-pulse uppercase">
      Chargement du plan...
    </p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-red-100 rounded-3xl text-center shadow-2xl">
    <AlertTriangle size={32} className="text-red-500 mx-auto mb-4" />
    <h3 className="text-slate-800 font-black text-xl mb-2">Erreur</h3>
    <p className="text-slate-500 text-sm mb-6">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
    >
      Réessayer
    </button>
  </div>
);

export default PlanningDetails;
