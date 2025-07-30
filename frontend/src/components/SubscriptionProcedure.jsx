

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

const SubscriptionProcedure = () => {
  const [lang, setLang] = useState("fr");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = {
    fr: [
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
          "N'oubliez pas de mentionner le numéro de facture dans le libellé du virement.",
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
        warning: "لا تنس كتابة رقم الفاتورة في موضوع التحويل.",
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

  const currentSteps = steps[lang];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          {lang === "fr" ? "Voir la procédure" : "عرض الإجراءات"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl">
            <span>
              {lang === "fr" ? "Procédure d'Abonnement" : "إجراءات الاشتراك"}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {lang === "fr" ? "6 étapes" : "6 خطوات"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
                className="hover:bg-muted"
              >
                <Globe className="h-5 w-5" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {/* Current Step Display */}
          <div className="mb-6">
            {(() => {
              const step = currentSteps[currentStep];
              const Icon = step.icon;
              const isCompleted =
                currentStep < currentSteps.length - 1 && currentStep > 0;

              return (
                <Card className="border-2 border-primary/20 h-[340px] shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex justify-center gap-4 text-center">
                      <div
                        className={`
                inline-flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-xl mb-2
                ${step.color} transition-all duration-300 shadow-lg
              `}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <h2 className="text-2xl font-bold">{step.title}</h2>
                        <Badge variant="outline" className="text-sm">
                          {lang === "fr" ? "Étape" : "خطوة"} {currentStep + 1}
                        </Badge>
                      </div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                      <p className="text-lg text-muted-foreground mb-2 leading-relaxed text-center">
                        {step.description}
                      </p>

                      {/* Plan Details */}
                      {step.details && (
                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {step.details.map((plan, planIndex) => (
                              <Card
                                key={planIndex}
                                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                              >
                                <CardContent className="p-6">
                                  <div className="text-center">
                                    <div className=" flex justify-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                      <DollarSign className="h-6 w-6 text-green-600" />
                                        </div>
                                    <div className="font-bold text-xl mb-1">{plan.name}</div>
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-3">{plan.duration}</div>
                                    <div className="font-bold text-lg text-green-600 mb-2">{plan.price}</div>
                                    <div className="text-xs text-muted-foreground">{plan.note}</div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Highlights */}
                      {step.highlights && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-center mb-4">
                            {lang === "fr"
                              ? "Informations incluses :"
                              : "المعلومات المتضمنة:"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {step.highlights.map(
                              (highlight, highlightIndex) => (
                                <div
                                  key={highlightIndex}
                                  className="text-center p-4 bg-muted/50 rounded-lg"
                                >
                                  <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                                  <div className="font-medium text-sm">
                                    {highlight}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Warning */}
                      {step.warning && (
                        <div className="mb-6">
                          <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                  <Mail className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-orange-800 mb-1">
                                    {lang === "fr" ? "Important :" : "مهم:"}
                                  </h4>
                                  <p className="text-orange-700">
                                    {step.warning}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          {/* Step Completion Indicator */}
          <div className="text-center mb-2">
            <div className="flex justify-center items-center gap-2 mb-2">
              {currentSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentStep
                      ? "bg-green-500"
                      : index === currentStep
                      ? "bg-primary w-8"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {currentStep === currentSteps.length - 1
                ? lang === "fr"
                  ? "Procédure terminée !"
                  : "اكتملت الإجراءات!"
                : lang === "fr"
                ? `Étape ${currentStep + 1} sur ${currentSteps.length}`
                : `الخطوة ${currentStep + 1} من ${currentSteps.length}`}
            </p>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="gap-2 min-w-[120px]"
            >
              {lang === "fr" ? "← Précédent" : "→ السابق"}
            </Button>

            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                {currentStep + 1} / {currentSteps.length}
              </Badge>

              {currentStep === currentSteps.length - 1 && (
                <Badge
                  variant="default"
                  className="gap-1 px-4 py-2 bg-green-600"
                >
                  <CheckCircle className="h-4 w-4" />
                  {lang === "fr" ? "Terminé" : "مكتمل"}
                </Badge>
              )}
            </div>

            <Button
              size="lg"
              onClick={() =>
                setCurrentStep(
                  Math.min(currentSteps.length - 1, currentStep + 1)
                )
              }
              disabled={currentStep === currentSteps.length - 1}
              className="gap-2 min-w-[120px]"
            >
              {currentStep === currentSteps.length - 1
                ? lang === "fr"
                  ? "Recommencer"
                  : "إعادة البدء"
                : lang === "fr"
                ? "Suivant →"
                : "التالي ←"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionProcedure;
