// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   Sparkles,
//   RefreshCw,
//   Quote,
//   Calendar,
//   User,
//   ThumbsUp,
//   MessageCircle,
// } from "lucide-react";
// import { useEffect, useState, useCallback, useRef } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useMotionValue,
//   useTransform,
// } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTestimonials } from "@/store/testimonialSlice";

// const Testimonials = () => {
//   const dispatch = useDispatch();
//   const { testimonials, status, error } = useSelector(
//     (state) => state.testimonials
//   );

//   // Filter only approved and visible testimonials
//   const visibleTestimonials = testimonials.filter(
//     (t) => t.isApproved && t.isVisible
//   );

//   const [currentTestimonial, setCurrentTestimonial] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const [direction, setDirection] = useState(0);
//   const autoPlayRef = useRef();
//   const x = useMotionValue(0);
//   const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

//   // Reset current index when filtered list changes
//   useEffect(() => {
//     setCurrentTestimonial(0);
//   }, [visibleTestimonials.length]);

//   // Fetch testimonials via Redux thunk
//   useEffect(() => {
//     dispatch(fetchTestimonials());
//   }, [dispatch]);

//   // Auto-rotation with pause on hover
//   const startAutoPlay = useCallback(() => {
//     if (visibleTestimonials.length <= 1) return;

//     autoPlayRef.current = setInterval(() => {
//       setDirection(1);
//       setCurrentTestimonial((prev) => {
//         const nextIndex = (prev + 1) % visibleTestimonials.length;
//         return nextIndex;
//       });
//     }, 6000);
//   }, [visibleTestimonials.length]);

//   const stopAutoPlay = useCallback(() => {
//     if (autoPlayRef.current) {
//       clearInterval(autoPlayRef.current);
//       autoPlayRef.current = undefined;
//     }
//   }, []);

//   useEffect(() => {
//     if (isAutoPlaying && visibleTestimonials.length > 1) {
//       startAutoPlay();
//     } else {
//       stopAutoPlay();
//     }

//     return () => stopAutoPlay();
//   }, [isAutoPlaying, startAutoPlay, stopAutoPlay, visibleTestimonials.length]);

//   // Navigation functions
//   const goToPrevious = useCallback(() => {
//     const newIndex =
//       (currentTestimonial - 1 + visibleTestimonials.length) %
//       visibleTestimonials.length;
//     setDirection(-1);
//     setCurrentTestimonial(newIndex);
//   }, [currentTestimonial, visibleTestimonials.length]);

//   const goToNext = useCallback(() => {
//     const newIndex = (currentTestimonial + 1) % visibleTestimonials.length;
//     setDirection(1);
//     setCurrentTestimonial(newIndex);
//   }, [currentTestimonial, visibleTestimonials.length]);

//   const goToTestimonial = useCallback(
//     (index) => {
//       setDirection(index > currentTestimonial ? 1 : -1);
//       setCurrentTestimonial(index);
//     },
//     [currentTestimonial]
//   );

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "ArrowLeft") {
//         goToPrevious();
//       } else if (event.key === "ArrowRight") {
//         goToNext();
//       } else if (event.key === " ") {
//         event.preventDefault();
//         setIsAutoPlaying((prev) => !prev);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [goToPrevious, goToNext]);

//   // Touch/swipe handling
//   const handleDragEnd = (event, info) => {
//     const threshold = 50;
//     if (info.offset.x > threshold) {
//       goToPrevious();
//     } else if (info.offset.x < -threshold) {
//       goToNext();
//     }
//   };

//   const renderStars = (rating) =>
//     [...Array(5)].map((_, i) => (
//       <motion.div
//         key={i}
//         initial={{ scale: 0, rotate: -180 }}
//         animate={{ scale: 1, rotate: 0 }}
//         transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
//       >
//         <Star
//           className={`h-4 w-4 ${
//             i < rating
//               ? "fill-yellow-400 text-yellow-400"
//               : "fill-gray-200 text-gray-200"
//           }`}
//         />
//       </motion.div>
//     ));

//   const formatUserInfo = (user) => {
//     const name = user?.username || "Utilisateur Anonyme";
//     const role = user?.role || "Membre de la communauté";
//     return { name, role };
//   };

//   const getUserInitials = (username) => {
//     if (!username) return "U";
//     return username
//       .split(" ")
//       .map((n) => n.charAt(0).toUpperCase())
//       .slice(0, 2)
//       .join("");
//   };

//   const retryFetch = () => {
//     dispatch(fetchTestimonials());
//   };

//   // Enhanced loading state
//   if (status === "loading") {
//     return (
//       <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="container mx-auto px-4 md:px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//               Ils Ont{" "}
//               <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                 Choisi Tamadrus
//               </span>
//             </h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Découvrez comment notre LMS a transformé leur parcours
//               d'apprentissage.
//             </p>
//           </motion.div>

//           <div className="max-w-4xl mx-auto">
//             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
//               <CardContent className="p-8">
//                 <div className="animate-pulse">
//                   <div className="flex items-center space-x-6 mb-6">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full"></div>
//                     <div className="flex-1">
//                       <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-3"></div>
//                       <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32"></div>
//                     </div>
//                   </div>
//                   <div className="flex mb-6 space-x-1">
//                     {[...Array(5)].map((_, i) => (
//                       <div
//                         key={i}
//                         className="w-5 h-5 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded"
//                       ></div>
//                     ))}
//                   </div>
//                   <div className="space-y-3">
//                     <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
//                     <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
//                     <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/6"></div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Enhanced error state
//   if (status === "failed") {
//     return (
//       <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="container mx-auto px-4 md:px-6">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="text-center max-w-md mx-auto"
//           >
//             <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <RefreshCw className="h-8 w-8 text-red-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 Oups ! Une erreur s'est produite
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Impossible de charger les témoignages pour le moment.
//               </p>
//               <Button
//                 onClick={retryFetch}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//               >
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 Réessayer
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     );
//   }

//   // Enhanced empty state
//   if (visibleTestimonials.length === 0) {
//     return (
//       <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="container mx-auto px-4 md:px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//               Ils Ont{" "}
//               <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                 Choisi Tamadrus
//               </span>
//             </h2>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-center max-w-md mx-auto"
//           >
//             <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-12">
//               <motion.div
//                 animate={{
//                   rotate: [0, 10, -10, 0],
//                   scale: [1, 1.1, 1],
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Number.POSITIVE_INFINITY,
//                   repeatDelay: 3,
//                 }}
//               >
//                 <Sparkles className="mx-auto h-16 w-16 text-blue-500 mb-6" />
//               </motion.div>
//               <h3 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Aucun témoignage disponible
//               </h3>
//               <p className="text-gray-600">
//                 Soyez le premier à partager votre expérience avec Tamadrus !
//               </p>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     );
//   }

//   // Debug info (remove in production)
//   console.log("Current testimonial index:", currentTestimonial);
//   console.log("Total visible testimonials:", visibleTestimonials.length);

//   const current =
//     visibleTestimonials[currentTestimonial] || visibleTestimonials[0];
//   if (!current) {
//     console.error("No current testimonial found");
//     return null;
//   }

//   const { name, role } = formatUserInfo(current.user);

//   return (
//     <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="container mx-auto px-4 md:px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Ils Ont{" "}
//             <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//               Choisi Tamadrus
//             </span>
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Découvrez comment notre LMS a transformé leur parcours
//             d'apprentissage.
//           </p>
//         </motion.div>

//         <div className="max-w-4xl mx-auto">
//           <div
//             className="relative"
//             onMouseEnter={() => setIsAutoPlaying(false)}
//             onMouseLeave={() => setIsAutoPlaying(true)}
//           >
//             <AnimatePresence mode="wait" custom={direction}>
//               <motion.div
//                 key={currentTestimonial}
//                 custom={direction}
//                 initial={{
//                   opacity: 0,
//                   x: direction > 0 ? 300 : -300,
//                   scale: 0.8,
//                 }}
//                 animate={{ opacity: 1, x: 0, scale: 1 }}
//                 exit={{ opacity: 0, x: direction > 0 ? -300 : 300, scale: 0.8 }}
//                 transition={{
//                   type: "spring",
//                   stiffness: 300,
//                   damping: 30,
//                   opacity: { duration: 0.2 },
//                 }}
//                 drag="x"
//                 dragConstraints={{ left: 0, right: 0 }}
//                 dragElastic={0.2}
//                 onDragEnd={handleDragEnd}
//                 style={{ x, opacity }}
//                 className="cursor-grab active:cursor-grabbing"
//               >
//                 <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden relative">
//                   <CardContent className="p-8 md:p-10">
//                     {/* Quote Icon */}
//                     <motion.div
//                       initial={{ scale: 0, rotate: -180 }}
//                       animate={{ scale: 1, rotate: 0 }}
//                       transition={{ delay: 0.2, type: "spring" }}
//                       className="absolute top-6 right-6"
//                     >
//                       <Quote className="h-8 w-8 text-blue-500 opacity-50" />
//                     </motion.div>

//                     {/* Testimonial Text */}
//                     <motion.blockquote
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.3 }}
//                       className="text-gray-700 text-lg leading-relaxed mb-6 italic"
//                     >
//                       "{current.testimonial}"
//                     </motion.blockquote>

//                     {/* Footer section with Avatar and Right Info */}
//                     <div className="flex items-center justify-between">
//                       {/* Avatar & user info */}
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.1 }}
//                         className="flex items-center space-x-4"
//                       >
//                         <Avatar className="h-16 w-16 ring-2 ring-blue-200">
//                           <AvatarImage
//                             src={
//                               current.user?.user_image?.url ||
//                               "/placeholder.svg"
//                             }
//                             alt={name}
//                             className="object-cover"
//                           />
//                           <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
//                             {getUserInitials(current.user?.username)}
//                           </AvatarFallback>
//                         </Avatar>

//                         <div>
//                           <div className="flex items-center space-x-2 mb-1">
//                             <h4 className="font-bold text-gray-900">{name}</h4>
//                           </div>
//                                <Badge
//                         variant="secondary"
//                         className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0"
//                       >
//                         {role}
//                       </Badge>
                    
//                         </div>
//                       </motion.div>

//                       {/* Rating + Actions */}
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.2 }}
//                         className="text-right"
//                       >
//                         <div className="flex items-center justify-end space-x-1 mb-2">
//                           {renderStars(current.rating)}
//                           <span className="text-sm font-medium text-gray-700">
//                             {current.rating}/5
//                           </span>
//                         </div>
//                       </motion.div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Navigation Controls */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="flex justify-center items-center mt-8 space-x-4"
//           >
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={goToPrevious}
//               disabled={visibleTestimonials.length <= 1}
//               className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 bg-transparent"
//               aria-label="Témoignage précédent"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>

//             {/* Enhanced Dots Indicator */}
//             <div className="flex items-center space-x-3 px-6">
//               {visibleTestimonials.map((_, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => goToTestimonial(index)}
//                   className={`relative transition-all duration-300 ${
//                     index === currentTestimonial
//                       ? "w-8 h-3"
//                       : "w-3 h-3 hover:w-4"
//                   }`}
//                   aria-label={`Aller au témoignage ${index + 1}`}
//                   whileHover={{ scale: 1.2 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   <div
//                     className={`w-full h-full rounded-full transition-all duration-300 ${
//                       index === currentTestimonial
//                         ? "bg-gradient-to-r from-blue-600 to-purple-600"
//                         : "bg-gray-300 hover:bg-gray-400"
//                     }`}
//                   />
//                   {index === currentTestimonial && (
//                     <motion.div
//                       className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
//                       layoutId="activeIndicator"
//                     />
//                   )}
//                 </motion.button>
//               ))}
//             </div>

//             <Button
//               variant="outline"
//               size="icon"
//               onClick={goToNext}
//               disabled={visibleTestimonials.length <= 1}
//               className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 bg-transparent"
//               aria-label="Témoignage suivant"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </Button>
//           </motion.div>

//           {/* Auto-play indicator */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="text-center mt-6"
//           >
//             <p className="text-sm text-gray-500">
//               {isAutoPlaying ? (
//                 <>
//                   <motion.span
//                     animate={{ opacity: [1, 0.5, 1] }}
//                     transition={{
//                       duration: 2,
//                       repeat: Number.POSITIVE_INFINITY,
//                     }}
//                     className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"
//                   />
//                   Lecture automatique • Survolez pour mettre en pause
//                 </>
//               ) : (
//                 "Lecture en pause • Appuyez sur Espace pour reprendre"
//               )}
//             </p>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;


import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  RefreshCw,
  Quote,
  Calendar,
  User,
  ThumbsUp,
  MessageCircle,
  Pause,
  Play,
  
} from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useInView,
} from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestimonials } from "@/store/testimonialSlice";

const Testimonials = () => {
  const dispatch = useDispatch();
  const { testimonials, status, error } = useSelector(
    (state) => state.testimonials
  );

  // Filter only approved and visible testimonials
  const visibleTestimonials = testimonials.filter(
    (t) => t.isApproved && t.isVisible
  );

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  // Reset current index when filtered list changes
  useEffect(() => {
    setCurrentTestimonial(0);
  }, [visibleTestimonials.length]);

  // Fetch testimonials via Redux thunk
  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  // Auto-rotation with pause on hover
  const startAutoPlay = useCallback(() => {
    if (visibleTestimonials.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentTestimonial((prev) => {
        const nextIndex = (prev + 1) % visibleTestimonials.length;
        return nextIndex;
      });
    }, 5000); // Adjusted to match template timing
  }, [visibleTestimonials.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (isAutoPlaying && visibleTestimonials.length > 1) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => stopAutoPlay();
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay, visibleTestimonials.length]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    const newIndex =
      (currentTestimonial - 1 + visibleTestimonials.length) %
      visibleTestimonials.length;
    setDirection(-1);
    setCurrentTestimonial(newIndex);
  }, [currentTestimonial, visibleTestimonials.length]);

  const goToNext = useCallback(() => {
    const newIndex = (currentTestimonial + 1) % visibleTestimonials.length;
    setDirection(1);
    setCurrentTestimonial(newIndex);
  }, [currentTestimonial, visibleTestimonials.length]);

  const goToTestimonial = useCallback(
    (index) => {
      setDirection(index > currentTestimonial ? 1 : -1);
      setCurrentTestimonial(index);
    },
    [currentTestimonial]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === " ") {
        event.preventDefault();
        setIsAutoPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Touch/swipe handling
  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      goToPrevious();
    } else if (info.offset.x < -threshold) {
      goToNext();
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <Star
          className={`h-4 w-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      </motion.div>
    ));

  const formatUserInfo = (user) => {
    const name = user?.username || "Utilisateur Anonyme";
    const role = user?.role || "Membre de la communauté";
    return { name, role };
  };

  const getUserInitials = (username) => {
    if (!username) return "U";
    return username
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const retryFetch = () => {
    dispatch(fetchTestimonials());
  };


  const averageRating = visibleTestimonials.length
    ? (
        visibleTestimonials.reduce((sum, t) => sum + t.rating, 0) /
        visibleTestimonials.length
      ).toFixed(1)
    : "0.0";

  const satisfaction = visibleTestimonials.length
    ? (
        (visibleTestimonials.filter((t) => t.rating >= 4).length /
          visibleTestimonials.length) *
        100
      ).toFixed(0) + "%"
    : "0%";

      const getDirection = (text) => {
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlChars.test(text) ? "rtl" : "ltr";
};

  // Enhanced loading state
  if (status === "loading") {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ils Ont{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Choisi Tamadrus
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez comment notre LMS a transformé leur parcours
              d'apprentissage.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-3"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32"></div>
                      </div>
                    </div>
                    <div className="flex mb-6 space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded"
                        ></div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
                      <div className="h-5 bg-gradient-to-r from-gray.difficulty-200 to-gray-300 rounded-lg w-4/6"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Enhanced error state
  if (status === "failed") {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <RefreshCw className="h-8 w-8 text-red-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Oups ! Une erreur s'est produite
              </h3>
              <p className="text-gray-600 mb-6">
                Impossible de charger les témoignages pour le moment.
              </p>
              <Button
                onClick={retryFetch}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Enhanced empty state
  if (visibleTestimonials.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ils Ont{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Choisi Tamadrus
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Sparkles className="mx-auto h-16 w-16 text-blue-500 mb-6" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Aucun témoignage disponible
              </h3>
              <p className="text-gray-600">
                Soyez le premier à partager votre expérience avec Tamadrus !
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const current =
    visibleTestimonials[currentTestimonial] || visibleTestimonials[0];
  if (!current) {
    console.error("No current testimonial found");
    return null;
  }

  const { name, role } = formatUserInfo(current.user);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ils Ont{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Choisi Tamadrus
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez comment notre LMS a transformé leur parcours
            d'apprentissage.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentTestimonial}
                custom={direction}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{ x, opacity }}
                className="cursor-grab active:cursor-grabbing"
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden relative lg:h-72 h-[450px]">
                  <CardContent className="p-8 md:p-10">
                    {/* Quote Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute top-6 right-6"
                    >
                      <Quote className="h-8 w-8 text-blue-500 opacity-50" />
                    </motion.div>

                    {/* Testimonial Text */}
                    <motion.blockquote
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-gray-700 text-lg leading-relaxed mb-6 italic lg:h-32 mt-2 h-[280px]"
                      dir={getDirection(current.testimonial)}
                    >
                      "{current.testimonial}"
                    </motion.blockquote>

                    {/* Footer section with Avatar and Right Info */}
                    <div className="flex items-center justify-between">
                      {/* Avatar & user info */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex items-center space-x-4"
                      >
                        <Avatar className="h-16 w-16 ring-2 ring-blue-200">
                          <AvatarImage
                            src={
                              current.user?.user_image?.url ||
                              "/placeholder.svg"
                            }
                            alt={name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                            {getUserInitials(current.user?.username)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-gray-900">{name}</h4>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0"
                          >
                            {role}
                          </Badge>
                        </div>
                      </motion.div>

                      {/* Rating + Actions */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-right"
                      >
                        <div className="flex items-center justify-end space-x-1 mb-2">
                          {renderStars(current.rating)}
                          <span className="text-sm font-medium text-gray-700">
                            {current.rating}/5
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center items-center mt-8 space-x-4"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={visibleTestimonials.length <= 1}
              className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 bg-transparent"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Enhanced Dots Indicator */}
            <div className="flex items-center space-x-3 px-6">
              {visibleTestimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative transition-all duration-300 ${
                    index === currentTestimonial
                      ? "w-8 h-3"
                      : "w-3 h-3 hover:w-4"
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className={`w-full h-full rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                  {index === currentTestimonial && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={visibleTestimonials.length <= 1}
              className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 bg-transparent"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

          </motion.div>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-4"
          >
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{satisfaction}</div>
              <div className="text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{averageRating}</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;