import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Calendar, CreditCard, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

import {
  getSubscription,
  renewSubscription,
} from "@/store/subscriptionSlice";
import { fetchSubjects } from "@/store/subjectSlice";
import ConfirmDialog from "./ConfirmDialog";
import { loggedUser } from "@/store/authSlice";

export default function RenewSubscription() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoiceNumber } = useParams();

  const [subjectSelection, setSubjectSelection] = useState("all");
  const [customSubjects, setCustomSubjects] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("semester");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Subscription state
  const { subscription, loading, error } = useSelector(
    (state) => state.subscription
  );

  // Subjects state
  const { entities: subjects, isLoading: subjectsLoading, error: subjectsError } =
    useSelector((state) => state.subjects);

  const user = useSelector(loggedUser);

  // Fetch subscription and subjects
  useEffect(() => {
    if (invoiceNumber) {
      dispatch(getSubscription(invoiceNumber));
    }
    dispatch(fetchSubjects());
  }, [dispatch, invoiceNumber]);

  // Pre-select subscription subjects
  useEffect(() => {
    if (subscription?.subjects) {
      setCustomSubjects(subscription.subjects.map((s) => s._id));
    }
  }, [subscription]);

  const filteredSubjects = useMemo(() => {
    if (!user?.educationalLevel) return [];
    return subjects.filter(
      (subject) => subject.educationalLevel === user.educationalLevel
    );
  }, [subjects, user]);

  const handleSubjectChange = (value) => {
    setSubjectSelection(value);
    if (value === "all" && subscription?.subjects) {
      setCustomSubjects(subscription.subjects.map((s) => s._id));
    } else {
      setCustomSubjects([]); // custom only if user selects manually
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
    setSelectedPlan(planValue);
    setShowConfirmDialog(true);
  };

  const confirmRenewal = () => {
    if (!Array.isArray(customSubjects) || customSubjects.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins une discipline.",
      });
      return;
    }

    dispatch(
      renewSubscription({
        invoiceNumber,
        selectedSubjects: customSubjects,
        plan: selectedPlan,
      })
    ).then((res) => {
      if (!res.error) {
        toast({
          title: "Succès",
          description: "Votre abonnement a été renouvelé avec succès.",
        });
        navigate("/profile");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: res.payload?.msg || "Échec du renouvellement.",
        });
      }
    });

    setShowConfirmDialog(false);
  };

  const cancelRenewal = () => {
    setShowConfirmDialog(false);
    setSelectedPlan(null);
  };

  // Prix basé sur les subjects choisis
const totalPrice = filteredSubjects
  .filter((s) => customSubjects.includes(s._id))
  .reduce((acc, s) => acc + (s.price || 0), 0);

const discountedPrice = totalPrice * 0.8 * 5;

  const plans = useMemo(
    () => [
      {
        name: "Mensuel",
        value: "monthly",
        price: totalPrice,
        duration: "par mois",
        features: [
          `Accès à ${customSubjects.length} disciplines sélectionnées`,
          "Rapports de progression mensuels",
          "Assistance e-mail limitée",
        ],
        cta: "Renouveler en mensuel",
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
          "Suivi de la progression",
          "Assistance par e-mail",
          "Attestation de réussite",
        ],
        cta: "Renouveler en semestriel",
        highlight: true,
        icon: Calendar,
      },
    ],
    [customSubjects, totalPrice, discountedPrice]
  );

  if (loading || subjectsLoading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (subjectsError) return <p className="text-red-500">{subjectsError}</p>;
  
  

  return (
    <div className="mx-auto px-4 py-16 ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Renouvellement d’abonnement
          </h1>
          <p className="text-gray-600">
            Facture: {subscription?.invoiceNumber} — Statut:{" "}
            {subscription?.status}
          </p>
        </div>

        {/* Sélection des matières */}
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
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Sélection personnalisée</Label>
          </div>
        </RadioGroup>

        {subjectSelection === "custom" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {filteredSubjects.map((s) => (
              <div key={s._id} className="flex items-center space-x-2">
                <Checkbox
                  id={s._id}
                  checked={customSubjects.includes(s._id)}
                  onCheckedChange={(checked) =>
                    handleCustomSubjectChange(checked, s._id)
                  }
                />
                <label htmlFor={s._id} className="text-sm">
                  {s.title}
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.value}
              className={`flex flex-col justify-between transform transition-all duration-300 hover:scale-105 ${
                plan.highlight ? "border-primary shadow-lg" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  {plan.name}
                </CardTitle>
                <plan.icon className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="mt-1 flex items-baseline text-4xl font-bold">
                  {typeof plan.price === "number"
                    ? `${plan.price.toFixed(2)} DH`
                    : plan.price}
                  <span className="ml-1 text-xl text-gray-500">
                    {plan.duration}
                  </span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mt-1" />
                      <span className="ml-2 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full text-lg py-4"
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.value)}
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

        <ConfirmDialog
          show={showConfirmDialog}
          title="Confirmer le renouvellement"
          icon={<BookOpen className="h-5 w-5 " />}
          message={`Êtes-vous sûr de vouloir renouveler avec le plan ${
            plans.find((p) => p.value === selectedPlan)?.name
          } et ${customSubjects.length} discipline(s) ?`}
          onConfirm={confirmRenewal}
          onCancel={cancelRenewal}
          confirmText="Confirmer"
          cancelText="Annuler"
        />
      </div>
    </div>
  );
}
