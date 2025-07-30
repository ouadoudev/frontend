import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

const ManageHiring = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const authUser = useSelector(loggedUser);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState("approve");
  const [interviewDate, setInterviewDate] = useState("");
  const [showCv, setShowCv] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchUsers()).catch((err) =>
      console.error("Failed to fetch users:", err)
    );
  }, [dispatch]);

  // const handleHiring = () => {
  //   if (authUser.role !== "admin") {
  //     window.alert("Only admins can perform this action.");
  //     return;
  //   }
  //   dispatch(
  //     hiringTeacher({ userId: selectedUserId, action, interviewDate })
  //   ).catch((err) => console.error("Failed to update user status:", err));
  // };

  const handleHiring = async () => {
    if (authUser.role !== "admin") {
      toast.error("Seuls les administrateurs peuvent effectuer cette action", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await dispatch(
        hiringTeacher({ userId: selectedUserId, action, interviewDate })
      ).unwrap();

      toast.success("Enseignant recruté avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Échec du recrutement :", error);
      toast.error("Échec du recrutement", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setSelectedUserId("");
      setSelectedUser(null);
      setAction("");
      setInterviewDate("");
    }
  };
  const handleCancel = () => {
    setSelectedUserId("");
    setSelectedUser(null);
    setAction("");
    setInterviewDate("");
  };

  const handleCvFetch = async (userId) => {
    setCvLoading(true);
    setCvError("");
    try {
      const response = await dispatch(fetchCvByUserId(userId));
      if (response.payload && response.payload.cvUrl) {
        setCvUrl(response.payload.cvUrl);
        setShowCv(true);
        const user = users.find((user) => user._id === userId);
        setSelectedUser(user);
      } else {
        throw new Error("Failed to fetch CV");
      }
    } catch (err) {
      console.error("Failed to fetch CV:", err);
      setCvError("Failed to fetch CV");
    } finally {
      setCvLoading(false);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  const filteredUsers = users.filter(
    (user) => !["admin", "student", "teacher"].includes(user.role)
  );
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  return (
    <main className="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
      <div className="w-full overflow-x-auto">
        <Card>
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
                  <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <TableHead className="px-4 py-3">Enseignant</TableHead>
                    <TableHead className="px-4 py-3">Discipline</TableHead>
                    <TableHead className="px-4 py-3">Expérience</TableHead>
                    <TableHead className="px-4 py-3">Statut</TableHead>
                    <TableHead className="px-4 py-3">CV</TableHead>
                    <TableHead className="px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {status === "loading" && <p>Loading...</p>}
                {status === "failed" && (
                  <p className="text-red-500">Error: {error}</p>
                )}
                {status === "succeeded" && (
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50">
                        <TableCell className="px-4 py-3 text-sm">
                          {user.username}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {user.discipline}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {user.experience}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {user.status}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleCvFetch(user._id)}
                            className="text-blue-500 hover:underline flex items-center"
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Review
                          </button>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          <button
                            onClick={() => setSelectedUserId(user._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Select
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
              {currentUsers.length === 0 && (
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

              {selectedUserId && (
                <Card className="absolute flex flex-col justify-center w-96 mx-auto mt-8 pt-4 px-4">
                  <CardTitle className="text-lg font-bold mb-4 text-center">
                    Hiring Process
                  </CardTitle>
                  <CardContent className="flex flex-row justify-center gap-4 mb-8">
                    <Select
                      value={action}
                      onValueChange={setAction}
                      className="border border-gray-300 p-2 rounded mb-2 mx-4"
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Teacher Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="approve">Approve</SelectItem>
                          <SelectItem value="refuse">Refuse</SelectItem>
                          <SelectItem value="interview">
                            Schedule Interview
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {action === "interview" && (
                      <DatePicker
                        date={interviewDate}
                        setDate={setInterviewDate}
                      />
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-row justify-end gap-4 ">
                    <button onClick={handleHiring}>
                      <Check className="w-6 h-6 text-green-500" />
                    </button>
                    <button onClick={handleCancel}>
                      <X className="w-6 h-6 text-red-600" />
                    </button>
                  </CardFooter>
                </Card>
              )}
              {showCv && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
                  <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-xl max-w-4xl w-full relative">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-2">
                        <button onClick={handleZoomIn} className="">
                          <ZoomInIcon className="w-4 h-4 mr-1" />
                        </button>
                        <button onClick={handleZoomOut} className="">
                          <ZoomOutIcon className="w-4 h-4 mr-1" />
                        </button>
                      </div>
                    </div>
                    {cvLoading ? (
                      <p className="text-center text-gray-700">Loading CV...</p>
                    ) : cvError ? (
                      <p className="text-center text-red-600">{cvError}</p>
                    ) : (
                      <div className="flex flex-col items-center">
                        {selectedUser && <h1>{selectedUser.username}</h1>}
                        <div className="w-full h-[500px] overflow-auto mt-2 bg-gray-100 border border-gray-300 rounded-lg">
                          <Document
                            file={cvUrl}
                            onLoadError={(error) => {
                              console.error("Error loading PDF:", error);
                              setCvError("Failed to load CV");
                            }}
                            onLoadSuccess={() =>
                              console.log("PDF loaded successfully")
                            }
                            className="w-full h-full flex justify-center"
                          >
                            <Page pageNumber={1} scale={zoom} />
                          </Document>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setShowCv(false)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          {totalPages > 1 && (
            <div className="flex justify-center my-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {currentPage !== 1 && (
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                    )}
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default ManageHiring;
