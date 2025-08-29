import { useState, useMemo, useEffect } from "react";
import {
  Check,
  Calendar,
  CreditCard,
  BookOpen,
  Zap,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubjects } from "@/store/subjectSlice";
import { subscribeToSubjects } from "@/store/subscriptionSlice";
import { useNavigate } from "react-router-dom";
import { loggedUser, updateUserSuccess } from "@/store/authSlice";
import { fetchUserById } from "@/store/userSlice";
import SubscriptionProcedure from "./SubscriptionProcedure";
import ConfirmDialog from "./ConfirmDialog"; 

export default function StudentPackPricing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [subjectSelection, setSubjectSelection] = useState("all");
  const [customSubjects, setCustomSubjects] = useState([]);
  const [plan, setPlan] = useState("semester");
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
  const [selectedPlan, setSelectedPlan] = useState(null); 

  const {
    entities: subjects = [],
    loading: subjectsLoading,
    error: subjectsError,
  } = useSelector((state) => state.subjects);
  const { loading: subscriptionsLoading } = useSelector(
    (state) => state.subscription
  );
  const user = useSelector(loggedUser);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      setIsLoginPopupOpen(true);
    } else if (user.educationalLevel) {
      const filteredSubjects = subjects.filter(
        (subject) => subject.educationalLevel === user.educationalLevel
      );
      setCustomSubjects(filteredSubjects.map((subject) => subject._id));
    }
  }, [user, subjects]);

  const handleSubjectChange = (value) => {
    setSubjectSelection(value);
    const levelFilteredSubjects = subjects.filter(
      (subject) => subject.educationalLevel === user.educationalLevel
    );

    if (value === "all") {
      setCustomSubjects(levelFilteredSubjects.map((subject) => subject._id));
    } else if (value === "scientific") {
      const scientificSubjectsStart = [
        "Mathématiques",
        "Physique et Chimie",
        "Sciences de la Vie et de la Terre",
      ];
      setCustomSubjects(
        levelFilteredSubjects
          .filter((subject) => {
            const prefix = subject.title.split(" - ")[0];
            return scientificSubjectsStart.includes(prefix);
          })
          .map((subject) => subject._id)
      );
    } else if (value === "language") {
      const languageSubjectsStart = [
        "Français",
        "اللغة العربية",
        "English",
        "Español",
      ];
      setCustomSubjects(
        levelFilteredSubjects
          .filter((subject) => {
            const prefix = subject.title.split(" - ")[0];
            return languageSubjectsStart.includes(prefix);
          })
          .map((subject) => subject._id)
      );
    } else {
      setCustomSubjects([]);
    }
  };

  const handleCustomSubjectChange = (checked, subjectId) => {
    if (checked) {
      setCustomSubjects((prev) => [...prev, subjectId]);
    } else {
      setCustomSubjects((prev) => prev.filter((id) => id !== subjectId));
    }
  };

  const handleSubscribe = (planValue) => {
    if (!planValue) return;

    // Show confirmation dialog instead of directly subscribing
    setSelectedPlan(planValue);
    setShowConfirmDialog(true);
  };

  const confirmSubscription = () => {
    if (!selectedPlan) return;

    if (selectedPlan === "free-trial") {
      dispatch(subscribeToSubjects({ customSubjects, plan: selectedPlan })).then(
        (response) => {
          if (!response.error) {
            dispatch(fetchUserById(user.id)).then((res) => {
              if (res.payload) {
                dispatch(updateUserSuccess(res.payload));
                navigate("/profile");
              }
            });
          } else {
            alert(response.payload?.msg || "Erreur lors de l’abonnement.");
          }
        }
      );
    } else if (Array.isArray(customSubjects) && customSubjects.length > 0) {
      dispatch(subscribeToSubjects({ customSubjects, plan: selectedPlan })).then(
        (response) => {
          if (!response.error) {
              dispatch(fetchUserById(user.id)).then((res) => {
              if (res.payload) {
                dispatch(updateUserSuccess(res.payload));
                navigate("/profile");
              }
            });
          } else {
            alert(response.payload?.msg || "Erreur lors de l’abonnement.");
          }
        }
      );
    } else {
      alert("Veuillez sélectionner des disciplines avant de vous abonner.");
    }

    setShowConfirmDialog(false); // Close dialog after confirmation
    setSelectedPlan(null); // Reset selected plan
  };

  const cancelSubscription = () => {
    setShowConfirmDialog(false); // Close dialog
    setSelectedPlan(null); // Reset selected plan
  };

  const totalPrice = subjects
    .filter((subject) => customSubjects.includes(subject._id))
    .reduce((acc, subject) => acc + subject.price, 0);

  const discountedPrice = totalPrice * 0.8 * 5;

  const plans = useMemo(
    () => [
      {
        name: "Essai Gratuit",
        value: "free-trial",
        price: "0 MAD",
        duration: "7 jours",
        features: [
          "Accès à certaines leçons de plusieurs disciplines",
          "Aucun paiement requis pour commencer",
          "Idéal pour explorer la plateforme",
          "Sans engagement — résiliez à tout moment",
          "Possibilité de mise à niveau à tout moment",
        ],
        cta: "Commencer l’essai gratuit",
        icon: Rocket,
      },
      {
        name: "Mensuel",
        value: "monthly",
        price: totalPrice,
        duration: "par mois",
        features: [
          `Accès à ${customSubjects.length} disciplines sélectionnées`,
          "Rapports de progression mensuels",
          "Assistance e-mail limitée",
          "Aucune attestation délivrée",
        ],
        cta: "Choisir le forfait mensuel",
        highlight: false,
        icon: CreditCard,
      },
      {
        name: "Semestre",
        value: "semester",
        price: discountedPrice,
        duration: "par semestre",
        features: [
          `Accès à ${customSubjects.length} disciplines sélectionnées`,
          "Contenu complet pour chaque discipline",
          "Suivi de la progression pour toutes les matières",
          "Assistance par e-mail pour tous les cours",
          "Attestation de réussite à la fin de chaque matière",
        ],
        cta: "Choisir le forfait semestriel",
        highlight: true,
        icon: Calendar,
      },
    ],
    [customSubjects]
  );

  const levelFilteredSubjects = subjects.filter(
    (subject) => subject.educationalLevel === user.educationalLevel
  );

  const scientificSubjectsStart = [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de la Vie et de la Terre",
  ];

  const languageSubjectsStart = [
    "Français",
    "اللغة العربية",
    "English",
    "Español",
  ];

  const scientificSubjects = levelFilteredSubjects.filter((subject) =>
    scientificSubjectsStart.includes(subject.title.split(" - ")[0])
  );
  const languageSubjects = levelFilteredSubjects.filter((subject) =>
    languageSubjectsStart.includes(subject.title.split(" - ")[0])
  );
  const otherSubjects = levelFilteredSubjects.filter(
    (subject) =>
      !scientificSubjectsStart.includes(subject.title.split(" - ")[0]) &&
      !languageSubjectsStart.includes(subject.title.split(" - ")[0])
  );

  return (
    <div className="mx-auto px-4 py-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end pt-4">
          <SubscriptionProcedure />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 pt-4">
            Choose Your Learning Plan
          </h1>
          <div className="max-w-4xl mx-auto">
            <RadioGroup
              defaultValue="all"
              onValueChange={handleSubjectChange}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Toutes les disciplines</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scientific" id="scientific" />
                <Label htmlFor="scientific">Disciplines scientifiques</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="language" id="language" />
                <Label htmlFor="language">Langues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Sélection personnalisée</Label>
              </div>
            </RadioGroup>

            {subjectSelection === "custom" && (
              <div className="space-y-6 mb-8">
                {scientificSubjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Disciplines scientifiques
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {scientificSubjects.map((subject) => (
                        <div
                          key={subject._id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={subject._id}
                            checked={customSubjects.includes(subject._id)}
                            onCheckedChange={(checked) =>
                              handleCustomSubjectChange(checked, subject._id)
                            }
                          />
                          <label htmlFor={subject._id} className="text-sm">
                            {subject.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {languageSubjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Disciplines linguistiques
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {languageSubjects.map((subject) => (
                        <div
                          key={subject._id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={subject._id}
                            checked={customSubjects.includes(subject._id)}
                            onCheckedChange={(checked) =>
                              handleCustomSubjectChange(checked, subject._id)
                            }
                          />
                          <label htmlFor={subject._id} className="text-sm">
                            {subject.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {otherSubjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Autres disciplines
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {otherSubjects.map((subject) => (
                        <div
                          key={subject._id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={subject._id}
                            checked={customSubjects.includes(subject._id)}
                            onCheckedChange={(checked) =>
                              handleCustomSubjectChange(checked, subject._id)
                            }
                          />
                          <label htmlFor={subject._id} className="text-sm">
                            {subject.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col justify-between transform transition-all duration-300 hover:scale-105 ${
                plan.highlight ? "border-primary shadow-lg" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-2xl font-semibold">
                    {plan.name}
                  </CardTitle>
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-1 flex items-baseline text-5xl font-extrabold">
                  {typeof plan.price === "number"
                    ? `${plan.price.toFixed(2)}DH`
                    : plan.price}
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    {plan.duration}
                  </span>
                </div>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-1" />
                      <span className="ml-3 text-base text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full text-lg py-6"
                  variant={plan.highlight ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleSubscribe(plan.value)}
                  disabled={
                    plan.value === "free-trial" && user?.hasUsedFreeTrial
                  }
                >
                  {plan.cta}
                </Button>
              </CardFooter>
              {plan.highlight && (
                <div className="absolute top-0 right-0 -mt-4 mr-4">
                  <Badge
                    variant="destructive"
                    className="text-sm px-3 py-1 flex items-center"
                  >
                    <Zap className="w-4 h-4 mr-1" /> Le plus populaire
                  </Badge>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* ConfirmDialog for subscription confirmation */}
        <ConfirmDialog
          show={showConfirmDialog}
          title="Confirmer l'abonnement"
           icon={<BookOpen className="h-5 w-5 " />}
          message={`Êtes-vous sûr de vouloir vous abonner au plan ${
            plans.find((p) => p.value === selectedPlan)?.name || ""
          } avec ${customSubjects.length} discipline(s) sélectionnée(s) ?`}
          onConfirm={confirmSubscription}
          onCancel={cancelSubscription}
          confirmText="S'abonner"
          cancelText="Annuler"
         destructive={false}
        />
      </div>
    </div>
  );
}

// import { useState, useMemo, useEffect } from "react";
// import {
//   Check,
//   Calendar,
//   CreditCard,
//   BookOpen,
//   Zap,
//   Rocket,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSubjects } from "@/store/subjectSlice";
// import { subscribeToSubjects } from "@/store/subscriptionSlice";
// import { useNavigate } from "react-router-dom";
// import { loggedUser, updateUserSuccess } from "@/store/authSlice";
// import { LoginPopup } from "./login-popup";
// import { fetchUserById } from "@/store/userSlice";
// import SubscriptionProcedure from "./SubscriptionProcedure";

// export default function StudentPackPricing() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [subjectSelection, setSubjectSelection] = useState("all");
//   const [customSubjects, setCustomSubjects] = useState([]);
//   const [plan, setPlan] = useState("semester");
//   const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

//   const {
//     entities: subjects = [],
//     loading: subjectsLoading,
//     error: subjectsError,
//   } = useSelector((state) => state.subjects);
//   const { loading: subscriptionsLoading } = useSelector(
//     (state) => state.subscription
//   );
//   const user = useSelector(loggedUser);

//   useEffect(() => {
//     dispatch(fetchSubjects());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!user) {
//       setIsLoginPopupOpen(true);
//     } else if (user.educationalLevel) {
//       const filteredSubjects = subjects.filter(
//         (subject) => subject.educationalLevel === user.educationalLevel
//       );
//       setCustomSubjects(filteredSubjects.map((subject) => subject._id));
//     }
//   }, [user, subjects]);

//   const handleSubjectChange = (value) => {
//     setSubjectSelection(value);
//     const levelFilteredSubjects = subjects.filter(
//       (subject) => subject.educationalLevel === user.educationalLevel
//     );

//     if (value === "all") {
//       setCustomSubjects(levelFilteredSubjects.map((subject) => subject._id));
//     } else if (value === "scientific") {
//       const scientificSubjectsStart = [
//         "Mathématiques",
//         "Physique et Chimie",
//         "Sciences de la Vie et de la Terre",
//       ];
//       setCustomSubjects(
//         levelFilteredSubjects
//           .filter((subject) => {
//             const prefix = subject.title.split(" - ")[0];
//             return scientificSubjectsStart.includes(prefix);
//           })
//           .map((subject) => subject._id)
//       );
//     } else if (value === "language") {
//       const languageSubjectsStart = [
//         "Langue française",
//         "اللغة العربية",
//         "English",
//         "Español",
//       ];
//       setCustomSubjects(
//         levelFilteredSubjects
//           .filter((subject) => {
//             const prefix = subject.title.split(" - ")[0];
//             return languageSubjectsStart.includes(prefix);
//           })
//           .map((subject) => subject._id)
//       );
//     } else {
//       setCustomSubjects([]);
//     }
//   };

//   const handleCustomSubjectChange = (checked, subjectId) => {
//     if (checked) {
//       setCustomSubjects((prev) => [...prev, subjectId]);
//     } else {
//       setCustomSubjects((prev) => prev.filter((id) => id !== subjectId));
//     }
//   };

//   const handleSubscribe = (planValue) => {
//     if (!planValue) return;

//     if (planValue === "free-trial") {
//       dispatch(subscribeToSubjects({ customSubjects, plan: planValue })).then(
//         (response) => {
//           if (!response.error) {
//             dispatch(fetchUserById(user._id)).then((res) => {
//               if (res.payload) {
//                 dispatch(updateUserSuccess(res.payload));
//                 navigate("/profile");
//               }
//             });
//           } else {
//             alert(response.payload?.msg || "Erreur lors de l’abonnement.");
//           }
//         }
//       );
//     } else if (Array.isArray(customSubjects) && customSubjects.length > 0) {
//       dispatch(subscribeToSubjects({ customSubjects, plan: planValue })).then(
//         (response) => {
//           if (!response.error) {
//             navigate("/profile");
//           } else {
//             alert(response.payload?.msg || "Erreur lors de l’abonnement.");
//           }
//         }
//       );
//     } else {
//       alert("Veuillez sélectionner des disciplines avant de vous abonner.");
//     }
//   };

//   const totalPrice = subjects
//     .filter((subject) => customSubjects.includes(subject._id))
//     .reduce((acc, subject) => acc + subject.price, 0);

//   const discountedPrice = totalPrice * 0.8 * 5;

//   const plans = useMemo(
//     () => [
//       {
//         name: "Essai Gratuit",
//         value: "free-trial",
//         price: "0 MAD",
//         duration: "7 jours",
//         features: [
//           "Accès à certaines leçons de plusieurs disciplines",
//           "Aucun paiement requis pour commencer",
//           "Idéal pour explorer la plateforme",
//           "Sans engagement — résiliez à tout moment",
//           "Possibilité de mise à niveau à tout moment",
//         ],
//         cta: "Commencer l’essai gratuit",
//         icon: Rocket,
//       },
//       {
//         name: "Mensuel",
//         value: "monthly",
//         price: totalPrice,
//         duration: "par mois",
//         features: [
//           `Accès à ${customSubjects.length} disciplines sélectionnées`,
//           "Rapports de progression mensuels",
//           "Assistance e-mail limitée",
//           "Aucune attestation délivrée",
//         ],
//         cta: "Choisir le forfait mensuel",
//         highlight: false,
//         icon: CreditCard,
//       },
//       {
//         name: "Semestre",
//         value: "semester",
//         price: discountedPrice,
//         duration: "par semestre",
//         features: [
//           `Accès à ${customSubjects.length} disciplines sélectionnées`,
//           "Contenu complet pour chaque discipline",
//           "Suivi de la progression pour toutes les matières",
//           "Assistance par e-mail pour tous les cours",
//           "Attestation de réussite à la fin de chaque matière",
//         ],
//         cta: "Choisir le forfait semestriel",
//         highlight: true,
//         icon: Calendar,
//       },
//     ],
//     [customSubjects]
//   );
//   const levelFilteredSubjects = subjects.filter(
//     (subject) => subject.educationalLevel === user.educationalLevel
//   );

//   const scientificSubjectsStart = [
//     "Mathématiques",
//     "Physique et Chimie",
//     "Sciences de la Vie et de la Terre",
//   ];

//   const languageSubjectsStart = [
//     "Langue française",
//     "اللغة العربية",
//     "English",
//     "Español",
//   ];

//   const scientificSubjects = levelFilteredSubjects.filter((subject) =>
//     scientificSubjectsStart.includes(subject.title.split(" - ")[0])
//   );
//   const languageSubjects = levelFilteredSubjects.filter((subject) =>
//     languageSubjectsStart.includes(subject.title.split(" - ")[0])
//   );
//   const otherSubjects = levelFilteredSubjects.filter(
//     (subject) =>
//       !scientificSubjectsStart.includes(subject.title.split(" - ")[0]) &&
//       !languageSubjectsStart.includes(subject.title.split(" - ")[0])
//   );

//   return (
//     <div className="mx-auto px-4 py-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-end pt-4">
//           <SubscriptionProcedure />
//         </div>
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-extrabold text-gray-900 mb-8 pt-4">
//             Choose Your Learning Plan
//           </h1>
//           <div className="max-w-4xl mx-auto ">
//             <RadioGroup
//               defaultValue="all"
//               onValueChange={handleSubjectChange}
//               className="flex flex-wrap justify-center gap-4 mb-8"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="all" id="all" />
//                 <Label htmlFor="all">Toutes les disciplines</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="scientific" id="scientific" />
//                 <Label htmlFor="scientific">Disciplines scientifiques</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="language" id="language" />
//                 <Label htmlFor="language">Langues</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="custom" id="custom" />
//                 <Label htmlFor="custom">Sélection personnalisée</Label>
//               </div>
//             </RadioGroup>

//             {subjectSelection === "custom" && (
//               <div className="space-y-6 mb-8">
//                 {scientificSubjects.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold mb-2">
//                       Disciplines scientifiques
//                     </h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                       {scientificSubjects.map((subject) => (
//                         <div
//                           key={subject._id}
//                           className="flex items-center space-x-2"
//                         >
//                           <Checkbox
//                             id={subject._id}
//                             checked={customSubjects.includes(subject._id)}
//                             onCheckedChange={(checked) =>
//                               handleCustomSubjectChange(checked, subject._id)
//                             }
//                           />
//                           <label htmlFor={subject._id} className="text-sm">
//                             {subject.title}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {languageSubjects.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold mb-2">
//                       Disciplines linguistiques
//                     </h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                       {languageSubjects.map((subject) => (
//                         <div
//                           key={subject._id}
//                           className="flex items-center space-x-2"
//                         >
//                           <Checkbox
//                             id={subject._id}
//                             checked={customSubjects.includes(subject._id)}
//                             onCheckedChange={(checked) =>
//                               handleCustomSubjectChange(checked, subject._id)
//                             }
//                           />
//                           <label htmlFor={subject._id} className="text-sm">
//                             {subject.title}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {otherSubjects.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold mb-2">
//                       Autres disciplines
//                     </h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                       {otherSubjects.map((subject) => (
//                         <div
//                           key={subject._id}
//                           className="flex items-center space-x-2"
//                         >
//                           <Checkbox
//                             id={subject._id}
//                             checked={customSubjects.includes(subject._id)}
//                             onCheckedChange={(checked) =>
//                               handleCustomSubjectChange(checked, subject._id)
//                             }
//                           />
//                           <label htmlFor={subject._id} className="text-sm">
//                             {subject.title}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {plans.map((plan) => (
//             <Card
//               key={plan.name}
//               className={`flex flex-col justify-between transform transition-all duration-300 hover:scale-105 ${
//                 plan.highlight ? "border-primary shadow-lg" : ""
//               }`}
//             >
//               <CardHeader>
//                 <div className="flex items-center justify-between mb-1">
//                   <CardTitle className="text-2xl font-semibold">
//                     {plan.name}
//                   </CardTitle>
//                   <plan.icon className="h-6 w-6 text-primary" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="mt-1 flex items-baseline text-5xl font-extrabold">
//                   {typeof plan.price === "number"
//                     ? `${plan.price.toFixed(2)}DH`
//                     : plan.price}
//                   <span className="ml-1 text-xl font-medium text-gray-500">
//                     {plan.duration}
//                   </span>
//                 </div>

//                 <ul className="mt-6 space-y-4">
//                   {plan.features.map((feature) => (
//                     <li key={feature} className="flex items-start">
//                       <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-1" />
//                       <span className="ml-3 text-base text-gray-700">
//                         {feature}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//               <CardFooter>
//                 <Button
//                   className="w-full text-lg py-6"
//                   variant={plan.highlight ? "default" : "outline"}
//                   size="lg"
//                   onClick={() => handleSubscribe(plan.value)}
//                   disabled={
//                     plan.value === "free-trial" && user?.hasUsedFreeTrial
//                   }
//                 >
//                   {plan.cta}
//                 </Button>
//               </CardFooter>
//               {plan.highlight && (
//                 <div className="absolute top-0 right-0 -mt-4 mr-4">
//                   <Badge
//                     variant="destructive"
//                     className="text-sm px-3 py-1 flex items-center"
//                   >
//                     <Zap className="w-4 h-4 mr-1" /> Le plus populaire
//                   </Badge>
//                 </div>
//               )}
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
