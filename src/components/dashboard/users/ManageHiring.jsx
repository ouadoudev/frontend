import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, hiringTeacher, fetchCvByUserId } from "@/store/userSlice";
import { loggedUser } from "@/store/authSlice";
import { motion } from "framer-motion";
import {
  Check,
  EyeIcon,
  Sparkles,
  X,
  ZoomInIcon,
  ZoomOutIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const ManageHiring = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const authUser = useSelector(loggedUser);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [action, setAction] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [showCv, setShowCv] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState("");
  const [cv, setCv] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) => !["admin", "student", "teacher"].includes(user.role)
    );
  }, [users]);

  const paginationData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    return {
      currentUsers,
      totalPages,
      indexOfFirstItem,
      indexOfLastItem,
    };
  }, [currentPage, filteredUsers, itemsPerPage]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const handleHiring = async () => {
    if (authUser.role !== "admin") {
      toast.error("Seuls les administrateurs peuvent effectuer cette action", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    try {
      await dispatch(
        hiringTeacher({ userId: selectedUserId, action, interviewDate })
      ).unwrap();
      toast.success("Enseignant recruté avec succès", {
        position: "bottom-right",
        duration: 3000,
      });

      setSelectedUserId("");
      setAction("");
      setInterviewDate("");
    } catch (error) {
      console.error("Échec du recrutement :", error);
      toast.error("Échec du recrutement", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const handleCvFetch = useCallback(
    async (userId) => {
      setCvLoading(true);
      setCvError("");
      setCv(null); // clear previous CV

      try {
        const response = await dispatch(fetchCvByUserId(userId)).unwrap();

        // response is the whole cv object
        if (response && response.url) {
          setCv(response); // store full cv object
          setShowCv(true);
        } else {
          throw new Error("CV non trouvé");
        }
      } catch (err) {
        console.error("Failed to fetch CV:", err);
        setCvError(err.message || "Échec du chargement du CV");
      } finally {
        setCvLoading(false);
      }
    },
    [dispatch]
  );
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const selectedUser = useMemo(() => {
    return users.find((user) => user._id === selectedUserId);
  }, [users, selectedUserId]);

  return (
     <main className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recrutement des enseignants</CardTitle>
            <CardDescription>
              Examinez les profils, CV et statuts des enseignants postulants.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2 mt-4 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                    <TableHead className="px-4 py-3">Enseignant</TableHead>
                    <TableHead className="px-4 py-3">Discipline</TableHead>
                    <TableHead className="px-4 py-3">Expérience</TableHead>
                    <TableHead className="px-4 py-3">Statut</TableHead>
                    <TableHead className="px-4 py-3">CV</TableHead>
                    <TableHead className="px-4 py-3 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {status === "loading" && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                        <p className="mt-2">Chargement des candidatures...</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {status === "failed" && (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-red-500"
                      >
                        Erreur: {error || "Échec du chargement des données"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {status === "succeeded" && (
                  <TableBody>
                    {paginationData.currentUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50">
                        <TableCell className="px-4 py-3 text-sm font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {user.discipline || "Non spécifié"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {user.experience || "Non spécifié"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : user.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status || "En attente"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCvFetch(user._id)}
                            disabled={cvLoading}
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Voir le CV
                          </Button>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-right">
                          <Button
                            size="sm"
                            onClick={() => setSelectedUserId(user._id)}
                          >
                            Sélectionner
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>

              {status === "succeeded" &&
                paginationData.currentUsers.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center my-12"
                  >
                    <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">
                      Aucune candidature en attente
                    </h3>
                    <p className="text-muted-foreground">
                      Il n’y a actuellement aucune candidature à examiner ou à
                      valider.
                    </p>
                  </motion.div>
                )}
            </div>
          </CardContent>

          {paginationData.totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                {paginationData.currentUsers.length > 0
                  ? `Affichage des enseignants ${
                      paginationData.indexOfFirstItem + 1
                    } à ${Math.min(
                      paginationData.indexOfLastItem,
                      filteredUsers.length
                    )} sur ${filteredUsers.length}`
                  : "Aucun enseignant à afficher"}
              </p>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm font-medium">
                  Page {currentPage} sur {paginationData.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationData.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* CV Modal with iframe */}
        {showCv && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">CV de l'enseignant</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCv(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto p-4 bg-gray-100">
                {cvLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <p className="mt-4">Chargement du CV...</p>
                  </div>
                ) : cvError ? (
                  <div className="flex flex-col items-center justify-center h-full text-red-500 p-8">
                    <X className="h-12 w-12 mb-4" />
                    <p className="text-center">{cvError}</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowCv(false)}
                    >
                      Fermer
                    </Button>
                  </div>
                ) : (
                  <iframe
                    src={cv?.url}
                    title="CV"
                    className="w-full h-[75vh] rounded border border-gray-300"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hiring Modal */}
        {selectedUserId && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Processus de recrutement</CardTitle>
                <CardDescription>
                  Action pour {selectedUser?.username || "l'enseignant"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <Select value={action} onValueChange={setAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="approve">Approuver</SelectItem>
                        <SelectItem value="refuse">Refuser</SelectItem>
                        <SelectItem value="interview">
                          Planifier un entretien
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {action === "interview" && (
                    <DatePicker
                      date={interviewDate}
                      setDate={setInterviewDate}
                      label="Date de l'entretien"
                    />
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedUserId("")}>
                  Annuler
                </Button>
                <Button
                  onClick={handleHiring}
                  disabled={
                    !action || (action === "interview" && !interviewDate)
                  }
                >
                  Confirmer
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      </main>
  );
};

export default ManageHiring;

// import { useEffect, useState, useMemo, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers, hiringTeacher, fetchCvByUserId } from "@/store/userSlice";
// import { loggedUser } from "@/store/authSlice";
// import { motion } from "framer-motion";
// import {
//   Check,
//   EyeIcon,
//   Sparkles,
//   X,
//   ZoomInIcon,
//   ZoomOutIcon,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DatePicker } from "@/components/DatePicker";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import { toast } from "react-toastify";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

// const ManageHiring = () => {
//   const dispatch = useDispatch();
//   const users = useSelector((state) => state.user.users);
//   const status = useSelector((state) => state.user.status);
//   const error = useSelector((state) => state.user.error);
//   const authUser = useSelector(loggedUser);
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [action, setAction] = useState("");
//   const [interviewDate, setInterviewDate] = useState("");
//   const [showCv, setShowCv] = useState(false);
//   const [cvLoading, setCvLoading] = useState(false);
//   const [cvError, setCvError] = useState("");
//   const [cvUrl, setCvUrl] = useState("");
//   const [zoom, setZoom] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const itemsPerPage = 8;

//   // Memoize filtered users to avoid recalculating on every render
//   const filteredUsers = useMemo(() => {
//     return users.filter(
//       (user) => !["admin", "student", "teacher"].includes(user.role)
//     );
//   }, [users]);

//   // Calculate pagination data
//   const paginationData = useMemo(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//     return {
//       currentUsers,
//       totalPages,
//       indexOfFirstItem,
//       indexOfLastItem
//     };
//   }, [currentPage, filteredUsers, itemsPerPage]);

//   // Handle CV loading success
//   const onDocumentLoadSuccess = useCallback(({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   }, []);

//   // Fetch users on mount
//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchUsers());
//     }
//   }, [dispatch, status]);

//   // Handle hiring action
//   const handleHiring = async () => {
//     if (authUser.role !== "admin") {
//       toast.error("Seuls les administrateurs peuvent effectuer cette action", {
//         position: "bottom-right",
//         duration: 3000,
//       });
//       return;
//     }

//     try {
//       await dispatch(
//         hiringTeacher({ userId: selectedUserId, action, interviewDate })
//       ).unwrap();

//       toast.success("Enseignant recruté avec succès", {
//         position: "bottom-right",
//         duration: 3000,
//       });

//       // Reset form and close modal
//       setSelectedUserId("");
//       setAction("");
//       setInterviewDate("");
//     } catch (error) {
//       console.error("Échec du recrutement :", error);
//       toast.error("Échec du recrutement", {
//         position: "bottom-right",
//         duration: 3000,
//       });
//     }
//   };

//   // Handle CV fetching
//   const handleCvFetch = useCallback(async (userId) => {
//     setCvLoading(true);
//     setCvError("");
//     setPageNumber(1);
//     setNumPages(null);

//     try {
//       const response = await dispatch(fetchCvByUserId(userId));
//       if (response.payload?.cvUrl) {
//         setCvUrl(response.payload.cvUrl);
//         setShowCv(true);
//       } else {
//         throw new Error("CV non trouvé");
//       }
//     } catch (err) {
//       console.error("Failed to fetch CV:", err);
//       setCvError(err.message || "Échec du chargement du CV");
//     } finally {
//       setCvLoading(false);
//     }
//   }, [dispatch]);

//   // Zoom handlers
//   const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev + 0.25, 3)), []);
//   const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev - 0.25, 0.5)), []);

//   // Page navigation handlers
//   const handlePageChange = useCallback((pageNumber) => {
//     setCurrentPage(pageNumber);
//   }, []);

//   // Find selected user for display
//   const selectedUser = useMemo(() => {
//     return users.find(user => user._id === selectedUserId);
//   }, [users, selectedUserId]);

//   return (
//     <main className="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
//       <div className="w-full overflow-x-auto">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recrutement des enseignants</CardTitle>
//             <CardDescription>
//               Examinez les profils, CV et statuts des enseignants postulants.
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <div className="flex flex-col gap-2 mt-4 bg-white">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
//                     <TableHead className="px-4 py-3">Enseignant</TableHead>
//                     <TableHead className="px-4 py-3">Discipline</TableHead>
//                     <TableHead className="px-4 py-3">Expérience</TableHead>
//                     <TableHead className="px-4 py-3">Statut</TableHead>
//                     <TableHead className="px-4 py-3">CV</TableHead>
//                     <TableHead className="px-4 py-3 text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 {status === "loading" && (
//                   <TableBody>
//                     <TableRow>
//                       <TableCell colSpan={6} className="py-8 text-center">
//                         <Loader2 className="mx-auto h-8 w-8 animate-spin" />
//                         <p className="mt-2">Chargement des candidatures...</p>
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 )}

//                 {status === "failed" && (
//                   <TableBody>
//                     <TableRow>
//                       <TableCell colSpan={6} className="py-8 text-center text-red-500">
//                         Erreur: {error || "Échec du chargement des données"}
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 )}

//                 {status === "succeeded" && (
//                   <TableBody>
//                     {paginationData.currentUsers.map((user) => (
//                       <TableRow
//                         key={user._id}
//                         className="hover:bg-gray-50"
//                       >
//                         <TableCell className="px-4 py-3 text-sm font-medium">
//                           {user.username}
//                         </TableCell>
//                         <TableCell className="px-4 py-3 text-sm">
//                           {user.discipline || "Non spécifié"}
//                         </TableCell>
//                         <TableCell className="px-4 py-3 text-sm">
//                           {user.experience || "Non spécifié"}
//                         </TableCell>
//                         <TableCell className="px-4 py-3 text-sm">
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             user.status === "pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : user.status === "approved"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                           }`}>
//                             {user.status || "En attente"}
//                           </span>
//                         </TableCell>
//                         <TableCell className="px-4 py-3 text-sm">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleCvFetch(user._id)}
//                             disabled={cvLoading}
//                           >
//                             <EyeIcon className="w-4 h-4 mr-2" />
//                             Voir le CV
//                           </Button>
//                         </TableCell>
//                         <TableCell className="px-4 py-3 text-sm text-right">
//                           <Button
//                             size="sm"
//                             onClick={() => setSelectedUserId(user._id)}
//                           >
//                             Sélectionner
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 )}
//               </Table>

//               {status === "succeeded" && paginationData.currentUsers.length === 0 && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="text-center my-12"
//                 >
//                   <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                   <h3 className="text-2xl font-semibold mb-2">
//                     Aucune candidature en attente
//                   </h3>
//                   <p className="text-muted-foreground">
//                     Il n’y a actuellement aucune candidature à examiner ou à valider.
//                   </p>
//                 </motion.div>
//               )}
//             </div>
//           </CardContent>

//           {/* Pagination */}
//           {paginationData.totalPages > 1 && (
//             <div className="flex justify-between items-center px-6 py-4 border-t">
//               <p className="text-sm text-muted-foreground">
//                 {paginationData.currentUsers.length > 0
//                   ? `Affichage des enseignants ${paginationData.indexOfFirstItem + 1} à ${Math.min(
//                       paginationData.indexOfLastItem,
//                       filteredUsers.length
//                     )} sur ${filteredUsers.length}`
//                   : "Aucun enseignant à afficher"}
//               </p>

//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 <span className="text-sm font-medium">
//                   Page {currentPage} sur {paginationData.totalPages}
//                 </span>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === paginationData.totalPages}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </Card>

//         {/* CV Modal */}
//         {showCv && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 p-4">
//             <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
//               <div className="flex justify-between items-center p-4 border-b">
//                 <h2 className="text-lg font-bold">
//                   CV de l'enseignant
//                 </h2>
//                 <div className="flex items-center gap-3">
//                   <div className="flex bg-gray-100 rounded-md">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={handleZoomOut}
//                       disabled={zoom <= 0.5}
//                     >
//                       <ZoomOutIcon className="w-5 h-5" />
//                     </Button>
//                     <span className="flex items-center px-2 text-sm">
//                       {Math.round(zoom * 100)}%
//                     </span>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={handleZoomIn}
//                       disabled={zoom >= 3}
//                     >
//                       <ZoomInIcon className="w-5 h-5" />
//                     </Button>
//                   </div>

//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setShowCv(false)}
//                   >
//                     <X className="w-5 h-5" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex-1 overflow-auto p-4 bg-gray-100">
//                 {cvLoading ? (
//                   <div className="flex flex-col items-center justify-center h-full">
//                     <Loader2 className="h-12 w-12 animate-spin" />
//                     <p className="mt-4">Chargement du CV...</p>
//                   </div>
//                 ) : cvError ? (
//                   <div className="flex flex-col items-center justify-center h-full text-red-500 p-8">
//                     <X className="h-12 w-12 mb-4" />
//                     <p className="text-center">{cvError}</p>
//                     <Button
//                       variant="outline"
//                       className="mt-4"
//                       onClick={() => setShowCv(false)}
//                     >
//                       Fermer
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center">
//                     <Document
//                       file={cvUrl}
//                       onLoadSuccess={onDocumentLoadSuccess}
//                       onLoadError={() => setCvError("Échec du chargement du PDF")}
//                       className="w-full"
//                     >
//                       <Page
//                         pageNumber={pageNumber}
//                         scale={zoom}
//                         className="border"
//                       />
//                     </Document>

//                     {numPages > 1 && (
//                       <div className="mt-4 flex items-center gap-4">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
//                           disabled={pageNumber <= 1}
//                         >
//                           Précédent
//                         </Button>

//                         <span className="text-sm">
//                           Page {pageNumber} sur {numPages}
//                         </span>

//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
//                           disabled={pageNumber >= numPages}
//                         >
//                           Suivant
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Hiring Modal */}
//         {selectedUserId && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
//             <Card className="w-full max-w-md">
//               <CardHeader>
//                 <CardTitle>Processus de recrutement</CardTitle>
//                 <CardDescription>
//                   Action pour {selectedUser?.username || "l'enseignant"}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent>
//                 <div className="space-y-4">
//                   <Select
//                     value={action}
//                     onValueChange={setAction}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Sélectionner une action" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectItem value="approve">Approuver</SelectItem>
//                         <SelectItem value="refuse">Refuser</SelectItem>
//                         <SelectItem value="interview">
//                           Planifier un entretien
//                         </SelectItem>
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>

//                   {action === "interview" && (
//                     <DatePicker
//                       date={interviewDate}
//                       setDate={setInterviewDate}
//                       label="Date de l'entretien"
//                     />
//                   )}
//                 </div>
//               </CardContent>

//               <CardFooter className="flex justify-end gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setSelectedUserId("")}
//                 >
//                   Annuler
//                 </Button>
//                 <Button
//                   onClick={handleHiring}
//                   disabled={!action || (action === "interview" && !interviewDate)}
//                 >
//                   Confirmer
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default ManageHiring;
