import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Globe,
  BookOpen,
  CreditCard,
  FileText,
  Send,
  CheckCircle,
  Bell,
  Clock,
  DollarSign,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "rgb(59,130,246)", stopOpacity: 0.2 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "rgb(147,51,234)", stopOpacity: 0.2 }}
          />
        </linearGradient>
      </defs>
      <motion.circle
        cx="10%"
        cy="5%"
        r="20%"
        fill="url(#grad1)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.circle
        cx="80%"
        cy="80%"
        r="30%"
        fill="url(#grad1)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </svg>
  </div>
);

const steps = {
  fr: [
    {
      title: "Créer un compte",
      description:
        "Créez votre compte en utilisant votre email ou en vous connectant avec Google pour accéder à la plateforme.",
      icon: Mail,
      color: "bg-slate-500",
      options: [
        {
          type: "traditional",
          name: "Email & Mot de passe",
          description: "Créez un compte avec votre adresse email",
          icon: Mail,
          color: "bg-blue-500",
        },
        {
          type: "google",
          name: "Connexion Google",
          description: "Connectez-vous rapidement avec votre compte Google",
          icon: Globe,
          color: "bg-red-500",
        },
      ],
    },
    {
      title: "Informations éducatives",
      description:
        "Renseignez vos informations académiques pour personnaliser votre expérience d'apprentissage.",
      icon: BookOpen,
      color: "bg-emerald-500",
      examples: [
        {
          title: "Cycle éducatif",
          description: "Votre niveau d'enseignement actuel",
          examples: [
            "Primaire",
            "Collège",
            "Lycée",
            "Université",
            "Formation professionnelle",
          ],
          icon: BookOpen,
        },
        {
          title: "Niveau éducatif",
          description: "Votre année d'étude",
          examples: [
            "1ère année",
            "2ème année",
            "3ème année",
            "4ème année",
            "5ème année",
            "6ème année",
            "Terminale",
          ],
          icon: Clock,
        },
        {
          title: "Filière ou spécialisation",
          description: "Votre domaine d'étude principal",
          examples: [
            "Sciences Mathématiques",
            "Sciences Physiques",
            "Sciences de la Vie et de la Terre",
            "Sciences Économiques",
            "Littérature et Langues",
            "Sciences Humaines",
          ],
          icon: FileText,
        },
      ],
    },
    {
      title: "Choisir vos matières",
      description:
        "Sélectionnez les matières que vous souhaitez apprendre. Vous pouvez en choisir plusieurs selon vos besoins académiques.",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Sélectionner un plan",
      description:
        "Choisissez le plan d'abonnement qui vous convient le mieux.",
      icon: CreditCard,
      color: "bg-green-500",
      details: [
        {
          name: "Essai gratuit",
          duration: "7 jours",
          price: "Gratuit",
          note: "Disponible une seule fois",
        },
        {
          name: "Mensuel",
          duration: "1 mois",
          price: "Prix standard",
          note: "Par matière",
        },
        {
          name: "Semestriel",
          duration: "5 mois",
          price: "Réduction 20%",
          note: "Sur 5 mois",
        },
      ],
    },
    {
      title: "Recevoir le reçu",
      description:
        "Un reçu PDF est généré automatiquement avec toutes les informations nécessaires.",
      icon: FileText,
      color: "bg-purple-500",
      highlights: [
        "Montant total",
        "Numéro de compte bancaire",
        "Numéro de facture",
      ],
    },
    {
      title: "Effectuer le virement",
      description:
        "Réalisez le virement bancaire en utilisant les informations fournies dans le reçu.",
      icon: Send,
      color: "bg-orange-500",
      warning:
        "N'oubliez pas de mentionner le numéro de facture dans le libellé du virement.\n Envoyer à WHATSAPP 0612345678 : une photo du reçu, le nom d'utilisateur.",
    },
    {
      title: "Validation du paiement",
      description:
        "Notre équipe vérifie et valide votre paiement dans les plus brefs délais.",
      icon: CheckCircle,
      color: "bg-teal-500",
    },
    {
      title: "Activation & Notification",
      description:
        "Votre abonnement est activé et vous recevez une confirmation par email et notification.",
      icon: Bell,
      color: "bg-indigo-500",
    },
  ],
  ar: [
    {
      title: "إنشاء حساب",
      description:
        "أنشئ حسابك باستخدام بريدك الإلكتروني أو تسجيل الدخول عبر Google للوصول إلى المنصة.",
      icon: Mail,
      color: "bg-slate-500",
      options: [
        {
          type: "traditional",
          name: "البريد الإلكتروني وكلمة المرور",
          description: "أنشئ حساب بعنوان بريدك الإلكتروني",
          icon: Mail,
          color: "bg-blue-500",
        },
        {
          type: "google",
          name: "تسجيل الدخول عبر Google",
          description: "تسجيل دخول سريع بحسابك على Google",
          icon: Globe,
          color: "bg-red-500",
        },
      ],
    },
    {
      title: "المعلومات التعليمية",
      description: "أدخل معلوماتك الأكاديمية لتخصيص تجربة التعلم الخاصة بك.",
      icon: BookOpen,
      color: "bg-emerald-500",
      examples: [
        {
          title: "الدورة التعليمية",
          description: "مستوى التعليم الحالي",
          examples: [
            "الابتدائي",
            "الإعدادي",
            "الثانوي",
            "الجامعي",
            "التكوين المهني",
          ],
          icon: BookOpen,
        },
        {
          title: "المستوى التعليمي",
          description: "سنة الدراسة",
          examples: [
            "السنة الأولى",
            "السنة الثانية",
            "السنة الثالثة",
            "السنة الرابعة",
            "السنة الخامسة",
            "السنة السادسة",
            "البكالوريا",
          ],
          icon: Clock,
        },
        {
          title: "الشعبة أو التخصص",
          description: "مجال الدراسة الرئيسي",
          examples: [
            "العلوم الرياضية",
            "العلوم الفيزيائية",
            "علوم الحياة والأرض",
            "العلوم الاقتصادية",
            "الآداب واللغات",
            "العلوم الإنسانية",
          ],
          icon: FileText,
        },
      ],
    },
    {
      title: "اختيار المواد",
      description:
        "اختر المواد التي تريد دراستها. يمكنك اختيار أكثر من مادة حسب احتياجاتك الأكاديمية.",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "اختيار خطة الاشتراك",
      description: "اختر خطة الاشتراك التي تناسبك أكثر.",
      icon: CreditCard,
      color: "bg-green-500",
      details: [
        {
          name: "تجربة مجانية",
          duration: "7 أيام",
          price: "مجانية",
          note: "لمرة واحدة فقط",
        },
        {
          name: "شهري",
          duration: "شهر واحد",
          price: "السعر العادي",
          note: "لكل مادة",
        },
        {
          name: "نصف سنوي",
          duration: "5 أشهر",
          price: "تخفيض 20%",
          note: "على 5 أشهر",
        },
      ],
    },
    {
      title: "استلام الوصل",
      description:
        "يتم توليد وصل PDF تلقائياً يحتوي على جميع المعلومات المطلوبة.",
      icon: FileText,
      color: "bg-purple-500",
      highlights: ["المبلغ الإجمالي", "رقم الحساب البنكي", "رقم الفاتورة"],
    },
    {
      title: "القيام بالتحويل",
      description: "قم بالتحويل البنكي باستخدام المعلومات الموجودة في الوصل.",
      icon: Send,
      color: "bg-orange-500",
      warning:
        "لا تنس كتابة رقم الفاتورة في موضوع التحويل . لتفعيل اشتراكك، أرسل على واتساب 0612345678 صورة الإيصال واسم المستخدم.",
    },
    {
      title: "التحقق من الدفع",
      description:
        "يقوم فريقنا بالتحقق من دفعتك والموافقة عليها في أسرع وقت ممكن.",
      icon: CheckCircle,
      color: "bg-teal-500",
    },
    {
      title: "التفعيل والإشعار",
      description:
        "يتم تفعيل اشتراكك وتتلقى تأكيداً عبر البريد الإلكتروني والإشعارات.",
      icon: Bell,
      color: "bg-indigo-500",
    },
  ],
};

const Procedure = () => {
  const [lang, setLang] = useState("fr");
  const [currentStep, setCurrentStep] = useState(0);

  const currentSteps = steps[lang];

  const goToPrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const goToNext = () => {
    if (currentStep === currentSteps.length - 1) {
      setCurrentStep(0);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="relative z-0 min-h-screen py-10">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            {lang === "fr" ? "Procédure d'Abonnement" : "إجراءات الاشتراك"}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Clock className="h-3 w-3" />
              {lang === "fr" ? "8 étapes" : "8 خطوات"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
              className="hover:bg-muted h-8 w-8 sm:h-10 sm:w-10"
              aria-label="Changer la langue / Change language"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <div
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="overflow-y-auto max-h-[calc(100vh-200px)]"
        >
          {/* Main Step Card - Fixed Dimensions */}
          <div className="mb-6 lg:mb-8 flex justify-center">
            {(() => {
              const step = currentSteps[currentStep];
              const Icon = step.icon;
              return (
                <Card className="border-2 border-primary/20 shadow-lg w-full max-w-4xl h-[600px] sm:h-[450px] lg:h-[470px]">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Fixed Header */}
                    <div className="flex-shrink-0 p-4 sm:p-6 lg:p-2 border-b">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
                        <div
                          className={`
                  inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full text-white font-bold text-lg sm:text-xl
                  ${step.color} transition-all duration-300 shadow-lg
                `}
                        >
                          <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                            {step.title}
                          </h2>
                          <Badge
                            variant="outline"
                            className="text-xs sm:text-sm"
                          >
                            {lang === "fr" ? "Étape" : "خطوة"} {currentStep + 1}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-6">
                      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                        {/* Step Description */}
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed text-center">
                          {step.description}
                        </p>

                        {/* Account Creation Options */}
                        {step.options && (
                          <div className="space-y-4">
                            <h4 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
                              {lang === "fr"
                                ? "Choisissez votre méthode :"
                                : "اختر طريقتك:"}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {step.options.map((option, optionIndex) => {
                                const OptionIcon = option.icon;
                                return (
                                  <Card
                                    key={optionIndex}
                                    className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50"
                                  >
                                    <CardContent className="p-4 sm:p-6">
                                      <div className="text-center">
                                        <div
                                          className={`w-12 h-12 sm:w-16 sm:h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                                        >
                                          <OptionIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                        </div>
                                        <div className="font-bold text-sm sm:text-base lg:text-lg mb-2">
                                          {option.name}
                                        </div>
                                        <div className="text-xs sm:text-sm text-muted-foreground">
                                          {option.description}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Educational Information Examples */}
                        {step.examples && (
                          <div className="space-y-4">
                            <h4 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
                              {lang === "fr"
                                ? "Exemples d'informations :"
                                : "أمثلة على المعلومات:"}
                            </h4>
                            <div className="space-y-4 max-w-3xl mx-auto">
                              {step.examples.map((example, exampleIndex) => {
                                const ExampleIcon = example.icon;
                                return (
                                  <Card
                                    key={exampleIndex}
                                    className="border border-muted hover:shadow-md transition-all duration-200"
                                  >
                                    <CardContent className="p-4 sm:p-6">
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-3 mb-3">
                                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <ExampleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                                          </div>
                                          <div>
                                            <h5 className="text-sm sm:text-base font-semibold">
                                              {example.title}
                                            </h5>
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                              {example.description}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {example.examples.map(
                                            (item, itemIndex) => (
                                              <Badge
                                                key={itemIndex}
                                                variant="secondary"
                                                className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                              >
                                                {item}
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Plan Details */}
                        {step.details && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              {step.details.map((plan, planIndex) => (
                                <Card
                                  key={planIndex}
                                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                                >
                                  <CardContent className="p-3 sm:p-4 lg:p-6">
                                    <div className="text-center">
                                      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-2 sm:mb-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                                          <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                                        </div>
                                        <div className="font-bold text-sm sm:text-base lg:text-lg">
                                          {plan.name}
                                        </div>
                                      </div>
                                      <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                                        {plan.duration}
                                      </div>
                                      <div className="font-bold text-sm sm:text-base lg:text-lg text-green-600 mb-2">
                                        {plan.price}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {plan.note}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Highlights */}
                        {step.highlights && (
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
                              {lang === "fr"
                                ? "Informations incluses :"
                                : "المعلومات المتضمنة:"}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {step.highlights.map((highlight, index) => (
                                <div
                                  key={index}
                                  className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg"
                                >
                                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-purple-600" />
                                  <div className="font-medium text-xs sm:text-sm">
                                    {highlight}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Warning */}
                        {step.warning && (
                          <div>
                            <Card className="border-orange-200 bg-orange-50">
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-orange-800 mb-1 text-sm sm:text-base">
                                      {lang === "fr" ? "Important :" : "مهم:"}
                                    </h4>
                                    <p className="text-orange-700 text-xs sm:text-sm leading-relaxed break-words">
                                      {step.warning}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          {/* Enhanced Progress Indicator & Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6 lg:mb-8"
          >
            {/* Navigation Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center items-center space-x-4 mb-6"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={currentStep === 0}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 bg-transparent"
                aria-label={
                  lang === "fr" ? "Étape précédente" : "الخطوة السابقة"
                }
              >
                {lang === "ar" ? (
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
              {/* Enhanced Dots Indicator */}
              <div className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6">
                {currentSteps.map((step, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`relative transition-all duration-300 group ${
                      index === currentStep
                        ? "w-6 h-3 sm:w-8 sm:h-3"
                        : "w-3 h-3 hover:w-4 hover:h-4"
                    }`}
                    aria-label={`${
                      lang === "fr" ? "Aller à l'étape" : "الذهاب إلى الخطوة"
                    } ${index + 1}: ${step.title}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div
                      className={`w-full h-full rounded-full transition-all duration-300 ${
                        index < currentStep
                          ? "bg-green-500"
                          : index === currentStep
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : "bg-gray-300 hover:bg-gray-400 group-hover:bg-blue-200"
                      }`}
                    />
                    {index === currentStep && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                        layoutId="activeStepIndicator"
                      />
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {step.title}
                    </div>
                  </motion.button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-transparent"
                aria-label={lang === "fr" ? "Étape suivante" : "الخطوة التالية"}
              >
                {lang === "ar" ? (
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Procedure;
