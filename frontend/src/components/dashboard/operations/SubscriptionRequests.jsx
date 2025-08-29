import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  confirmSubscription,
  getAllSubscriptionRequests,
} from "@/store/subscriptionSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { fetchSubjects } from "@/store/subjectSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SubscriptionRequests = () => {
  const dispatch = useDispatch();
  const { subscriptionRequests, loading, error } = useSelector(
    (state) => state.subscription
  );

  const [invoiceInput, setInvoiceInput] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    dispatch(getAllSubscriptionRequests());
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleConfirm = async () => {
    if (!selectedSubscription) {
      toast({
        title: "Error",
        description: "Please select a subscription first.",
        variant: "destructive",
      });
      return;
    }

    if (invoiceInput !== selectedSubscription.invoiceNumber) {
      toast({
        title: "Error",
        description:
          "The invoice number does not match the selected subscription.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resultAction = await dispatch(
        confirmSubscription({ invoiceNumber: invoiceInput })
      );
      if (confirmSubscription.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "Subscription confirmed successfully.",
        });
        setSelectedSubscription(null);
        setInvoiceInput("");
        dispatch(getAllSubscriptionRequests());
      } else if (confirmSubscription.rejected.match(resultAction)) {
        throw new Error(
          resultAction.payload || "Failed to confirm subscription."
        );
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleInvoiceChange = (e) => {
    setInvoiceInput(e.target.value);
  };

  const handleSelectSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setInvoiceInput(subscription.invoiceNumber);
  };

  return (
    <main className="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Demandes d’abonnement</CardTitle>
            <CardDescription>
              Voir et gérer les demandes d’abonnement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <TableHead className="px-4 py-3">
                      Étudiants
                    </TableHead>
                    <TableHead className="px-4 py-3">Forfait</TableHead>
                    <TableHead className="px-4 py-3">Disciplines</TableHead>
                    <TableHead className="px-4 py-3">
                      Facture
                    </TableHead>
                    <TableHead className="px-4 py-3">Statut</TableHead>
                    <TableHead className="px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {loading && <p>Loading...</p>}
                <TableBody>
                  {subscriptionRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="px-4 py-2 text-sm">
                        {request.user.username}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm">
                        {request.plan}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm">
                        {request.subjects.map((s) => (
                          <div key={s._id}>{s.title.split(" -")[0]}</div>
                        ))}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm">
                        {request.invoiceNumber}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm">
                        {request.status}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm">
                        {request.status === "pending" && (
                          <Button
                            onClick={() => handleSelectSubscription(request)}
                            variant="outline"
                            size="sm"
                          >
                            Sélection pour confirmation
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {subscriptionRequests.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center my-12"
                >
                  <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">
                    Aucune demande d’abonnement en attente
                  </h3>
                  <p className="text-muted-foreground">
                    Il n’y a actuellement aucune demande d’abonnement à
                    approuver.
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedSubscription && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Confirmer l’abonnement</CardTitle>
              <CardDescription>
                Vérifiez le numéro de facture pour confirmer l’abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceInput">Numéro de facture</Label>
                  <Input
                    id="invoiceInput"
                    type="text"
                    onChange={handleInvoiceChange}
                    placeholder="Enter invoice number"
                  />
                </div>
                <Button onClick={handleConfirm}>Confirmer l’abonnement</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default SubscriptionRequests;
