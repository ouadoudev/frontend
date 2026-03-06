import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestimonials,
  approveTestimonial,
  deleteTestimonial,
  toggleVisibility,
} from "@/store/testimonialSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const TestimonialsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { testimonials, status, error } = useSelector(
    (state) => state.testimonials
  );
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  // wrapper pour afficher toast et gérer l'état loading par testimonial
  const handleAction = async (action, testimonialId, successMsg) => {
    try {
      setLoadingIds((ids) => [...ids, testimonialId]);
      const result = await dispatch(action(testimonialId));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(successMsg, {
          position: "bottom-right",
          autoClose: 3000,
        });
        dispatch(fetchTestimonials());
      } else {
        toast.error(result.payload || "Action failed", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch {
      toast.error("Action failed", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingIds((ids) => ids.filter((id) => id !== testimonialId));
    }
  };

  const handleDelete = (testimonialId) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      handleAction(
        deleteTestimonial,
        testimonialId,
        "Testimonial deleted successfully"
      );
    }
  };

  const renderStars = (rating) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const getStatusBadge = (testimonial) => {
    if (!testimonial.isApproved)
      return <Badge variant="secondary">Pending</Badge>;
    if (!testimonial.isVisible) return <Badge variant="outline">Hidden</Badge>;
    return <Badge variant="default">Published</Badge>;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Gestion des témoignages</CardTitle>
          <CardDescription>
            Gérez et modérez les témoignages des utilisateurs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                <TableHead className="px-4 py-3">Utilisateur</TableHead>
                <TableHead className="px-4 py-3">Note</TableHead>
                <TableHead className="px-4 py-3">Témoignage</TableHead>
                <TableHead className="px-4 py-3">Statut</TableHead>
                <TableHead className="px-4 py-3">Date</TableHead>
                <TableHead className="text-center px-4 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p> Error: {error}</p>}
            <TableBody>
              {testimonials.map((testimonial) => {
                const isLoading = loadingIds.includes(testimonial._id);
                return (
                  <TableRow key={testimonial._id} className="text-gray-700">
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <img
                          className="w-8 h-8 mr-3 rounded-full object-cover"
                          src={
                            testimonial.user?.user_image?.url || "/profile.png"
                          }
                          alt={testimonial.user?.username || "User"}
                        />
                        <div>
                          <p className="font-semibold">
                            {testimonial.user?.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {testimonial.user?.role}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {renderStars(testimonial.rating)}
                        <span className="text-sm">({testimonial.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 max-w-xs">
                      <p className="truncate" title={testimonial.testimonial}>
                        "{testimonial.testimonial}"
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getStatusBadge(testimonial)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-center gap-2 flex-wrap">
                        {!testimonial.isApproved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAction(
                                approveTestimonial,
                                testimonial._id,
                                "Testimonial approved successfully"
                              )
                            }
                            disabled={isLoading}
                            className="text-green-600 hover:bg-green-50"
                          >
                            Approuver
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleAction(
                              toggleVisibility,
                              testimonial._id,
                              `Testimonial ${
                                testimonial.isVisible ? "caché" : "affiché"
                              } successfully`
                            )
                          }
                          disabled={isLoading}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          {testimonial.isVisible ? "Cacher" : "Afficher"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(testimonial._id)}
                          disabled={isLoading}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {testimonials.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center my-12"
            >
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                Aucun témoignage en attente
              </h3>
              <p className="text-muted-foreground">
                Il n’y a actuellement aucun témoignage à modérer ou à approuver.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default TestimonialsList;
