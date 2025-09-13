
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupedResources } from "@/store/resourcesSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayIcon, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Resources = () => {
  const resources = useSelector((state) => state.resources.groupedResources);
  const isLoading = useSelector((state) => state.resources.isLoading);
  const error = useSelector((state) => state.resources.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [selectedEducationalLevel, setSelectedEducationalLevel] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

  useEffect(() => {
    dispatch(getGroupedResources());
  }, [dispatch]);

  const handlePlayResource = (resourceGroup) => {
    let url = `/resource/${encodeURIComponent(resourceGroup.subject)}?level=${encodeURIComponent(
      resourceGroup.educationalLevel
    )}`;

    if (resourceGroup.stream) {
      url += `&stream=${encodeURIComponent(resourceGroup.stream)}`;
    }

    navigate(url);
  };

  const handleCreateResource = () => {
    navigate("/CreateResource");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredResources = resources.filter(
    (resource) =>
      (!selectedEducationalLevel ||
        resource.educationalLevel === selectedEducationalLevel) &&
      (!selectedStream || resource.stream === selectedStream)
  );

  const validEducationalLevels = [
    ...new Set(resources.map((resource) => resource.educationalLevel)),
  ];
  const validStreams = [
    ...new Set(resources.map((resource) => resource.stream)),
  ];

  const indexOfLastResource = currentPage * itemsPerPage;
  const indexOfFirstResource = indexOfLastResource - itemsPerPage;
  const currentResources = filteredResources.slice(
    indexOfFirstResource,
    indexOfLastResource
  );

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ressources</CardTitle>
            <CardDescription>
              Gérez vos ressources pédagogiques facilement.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <Button
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                onClick={handleCreateResource}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une ressource
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                <div>
                  <Label
                    htmlFor="levelFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Niveau :
                  </Label>
                  <select
                    id="levelFilter"
                    onChange={(e) =>
                      setSelectedEducationalLevel(e.target.value || "")
                    }
                    value={selectedEducationalLevel || ""}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les niveaux</option>
                    {validEducationalLevels.map((level, index) => (
                      <option key={index} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="streamFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Filière :
                  </Label>
                  <select
                    id="streamFilter"
                    onChange={(e) => setSelectedStream(e.target.value || "")}
                    value={selectedStream || ""}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toutes les filières</option>
                    {validStreams.map((stream, index) => (
                      <option key={index} value={stream}>
                        {stream}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <TableHead className="px-4 py-3">Matière</TableHead>
                  <TableHead className="px-4 py-3">
                    Niveau d'enseignement
                  </TableHead>
                  <TableHead className="px-4 py-3">Filière</TableHead>
                  <TableHead className="px-4 py-3">Cycle</TableHead>
                  <TableHead className="px-4 py-3">
                    Nombre de ressources
                  </TableHead>
                  <TableHead className="text-center px-4 py-3">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              {isLoading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              <TableBody>
                {currentResources.map((resourceGroup, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="px-4 py-3 font-medium">
                      {resourceGroup.subject}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {resourceGroup.educationalLevel}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {resourceGroup.stream || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {resourceGroup.educationalCycle}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {resourceGroup.count}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePlayResource(resourceGroup)}
                          className="bg-transparent"
                        >
                          <PlayIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {currentResources.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center my-12"
              >
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  Aucune ressource n'a été ajoutée pour le moment.
                </h3>
                <p className="text-muted-foreground">
                  Il n'y a actuellement aucune ressource à afficher.
                </p>
              </motion.div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {currentPage !== 1 && (
                        <PaginationPrevious
                          className="cursor-pointer"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                      )}
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            className="cursor-pointer"
                            onClick={() => handlePageChange(page)}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      {currentPage !== totalPages && (
                        <PaginationNext
                          className="cursor-pointer"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
