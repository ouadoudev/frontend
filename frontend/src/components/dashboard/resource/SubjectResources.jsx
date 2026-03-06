// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { getGroupedResources, deleteResource } from "@/store/resourcesSlice";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, FileEditIcon, FileText, TrashIcon } from "lucide-react";
// import { toast } from "react-toastify";
// import ConfirmDialog from "@/components/ConfirmDialog";

// const SubjectResources = () => {
//   const { subject } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const groupedResources = useSelector(
//     (state) => state.resources.groupedResources
//   );
//   const isLoading = useSelector((state) => state.resources.isLoading);
//   const error = useSelector((state) => state.resources.error);

//   const [subjectResources, setSubjectResources] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [resourceToDelete, setResourceToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(getGroupedResources());
//   }, [dispatch]);

//   const handleDeleteResource = (resourceId) => {
//     setResourceToDelete(resourceId);
//     setShowDeleteConfirm(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       if (!resourceToDelete) return;
//       await dispatch(deleteResource(resourceToDelete)).unwrap();
//       toast.success("Ressource supprimée avec succès", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//       // Refresh resources after deletion
//       dispatch(getGroupedResources());
//     } catch (error) {
//       toast.error("Erreur lors de la suppression", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setShowDeleteConfirm(false);
//       setResourceToDelete(null);
//     }
//   };

//   const handleEditResource = (id) => {
//     navigate(`/update/resource/${id}`);
//   };

//   useEffect(() => {
//     // Find the resource group matching the subject
//     const resourceGroup = groupedResources.find(
//       (group) => group.subject === decodeURIComponent(subject)
//     );
//     setSubjectResources(resourceGroup);
//   }, [groupedResources, subject]);

//   const handleViewPDF = (pdfUrl) => {
//     window.open(pdfUrl, "_blank");
//   };

//   const handleBack = () => {
//     navigate("/resources");
//   };

//   if (isLoading) {
//     return <div className="text-center py-12">Loading...</div>;
//   }

//   if (error) {
//     toast.error(error, {
//       position: "bottom-right",
//       autoClose: 3000,
//     });
//     return <div className="text-center py-12 text-red-600">Error: {error}</div>;
//   }

//   if (!subjectResources) {
//     return (
//       <div className="text-center py-12">
//         <h3 className="text-2xl font-semibold mb-2">
//           Aucune ressource trouvée
//         </h3>
//         <p className="text-muted-foreground">
//           Aucune ressource ne correspond à cette matière.
//         </p>
//         <Button onClick={handleBack} className="mt-4">
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Retour
//         </Button>
//       </div>
//     );
//   }
//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>
//             Ressources pour {subjectResources.subject} -{" "}
//             {subjectResources.educationalLevel}
//           </CardTitle>
//           <div className="flex justify-between items-center">
//             <p className="text-muted-foreground">
//               Filière: {subjectResources.stream} | Cycle:{" "}
//               {subjectResources.educationalCycle}
//             </p>
//             <Button onClick={handleBack}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Retour
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
//                 <TableHead className="px-4 py-3">Titre</TableHead>
//                 <TableHead className="px-4 py-3">Description</TableHead>
//                 <TableHead className="px-4 py-3">Type</TableHead>
//                 <TableHead className="px-4 py-3">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {subjectResources.resources.map((resource) => (
//                 <TableRow key={resource._id} className="hover:bg-gray-50">
//                   <TableCell className="px-4 py-3 font-medium">
//                     {resource.title}
//                   </TableCell>
//                   <TableCell className="px-4 py-3">
//                     {resource.description}
//                   </TableCell>
//                   <TableCell className="px-4 py-3">{resource.type}</TableCell>
//                   <TableCell className="px-4 py-3">
//                     <div className="flex justify-center gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleViewPDF(resource.pdf.url)}
//                         className="bg-transparent"
//                       >
//                         <FileText className="w-4 h-4 mr-2" />
//                         Voir le PDF
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleEditResource(resource._id)}
//                         className="bg-transparent"
//                       >
//                         <FileEditIcon className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDeleteResource(resource._id)}
//                         className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
//                       >
//                         <TrashIcon className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//       <ConfirmDialog
//         show={showDeleteConfirm}
//         title="Confirmer la suppression"
//         message="Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible."
//         onCancel={() => {
//           setShowDeleteConfirm(false);
//           setResourceToDelete(null);
//         }}
//         onConfirm={handleConfirmDelete}
//         confirmText="Supprimer"
//         cancelText="Annuler"
//         destructive
//       />
//     </div>
//   );
// };

// export default SubjectResources;
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getGroupedResources, deleteResource } from "@/store/resourcesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileEditIcon, FileText, TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";

const SubjectResources = () => {
  const { subject } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const groupedResources = useSelector(
    (state) => state.resources.groupedResources
  );
  const isLoading = useSelector((state) => state.resources.isLoading);
  const error = useSelector((state) => state.resources.error);

  const queryParams = new URLSearchParams(location.search);
  const educationalLevel = queryParams.get("level");
  const stream = queryParams.get("stream");

  const [subjectResources, setSubjectResources] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  useEffect(() => {
    dispatch(getGroupedResources());
  }, [dispatch]);

  useEffect(() => {
    const resourceGroup = groupedResources.find(
      (group) =>
        group.subject === decodeURIComponent(subject) &&
        group.educationalLevel === educationalLevel &&
        (!stream || group.stream === stream) // ✅ only check stream if exists
    );
    setSubjectResources(resourceGroup);
  }, [groupedResources, subject, educationalLevel, stream]);

  const handleDeleteResource = (resourceId) => {
    setResourceToDelete(resourceId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!resourceToDelete) return;
      await dispatch(deleteResource(resourceToDelete)).unwrap();
      toast.success("Ressource supprimée avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(getGroupedResources());
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setShowDeleteConfirm(false);
      setResourceToDelete(null);
    }
  };

  const handleEditResource = (id) => {
    navigate(`/update/resource/${id}`);
  };

  const handleViewPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  const handleBack = () => {
    navigate("/resources");
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    toast.error(error, {
      position: "bottom-right",
      autoClose: 3000,
    });
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  if (!subjectResources) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold mb-2">
          Aucune ressource trouvée
        </h3>
        <p className="text-muted-foreground">
          Aucune ressource ne correspond à cette matière.
        </p>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Ressources pour {subjectResources.subject} -{" "}
            {subjectResources.educationalLevel}
            {subjectResources.stream ? ` | ${subjectResources.stream}` : ""}
          </CardTitle>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Cycle: {subjectResources.educationalCycle}
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <TableHead className="px-4 py-3">Titre</TableHead>
                <TableHead className="px-4 py-3">Description</TableHead>
                <TableHead className="px-4 py-3">Type</TableHead>
                <TableHead className="px-4 py-3">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectResources.resources.map((resource) => (
                <TableRow key={resource._id} className="hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-medium">
                    {resource.title}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {resource.description}
                  </TableCell>
                  <TableCell className="px-4 py-3">{resource.type}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPDF(resource.pdf.url)}
                        className="bg-transparent"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Voir le PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditResource(resource._id)}
                        className="bg-transparent"
                      >
                        <FileEditIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteResource(resource._id)}
                        className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setResourceToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
    </div>
  );
};

export default SubjectResources;
