// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSubjects,
//   addSubject,
//   updateSubject,
//   deleteSubject,
// } from "@/store/subjectSlice";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "../ui/table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationPrevious,
//   PaginationLink,
//   PaginationNext,
// } from "../ui/pagination";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";
// import { FileEditIcon, PlayIcon, TrashIcon } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Subjects = () => {
//   const subjects = useSelector((state) => state.subjects.entities);
//   const isLoading = useSelector((state) => state.subjects.isLoading);
//   const error = useSelector((state) => state.subjects.error);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [objectives, setObjectives] = useState([]);

//   const [newSubject, setNewSubject] = useState({
//     title: "",
//     description: "",
//     price: "",
//     educationalCycle: "",
//     educationalLevel: "",
//     stream: "",
//     objectives: [],
//   });

//   useEffect(() => {
//     dispatch(fetchSubjects());
//   }, [dispatch]);

//   const handleDelete = async (subjectId) => {
//     try {
//       const confirmDelete = window.confirm(
//         "Are you sure you want to delete this subject?"
//       );
//       if (confirmDelete) {
//         await dispatch(deleteSubject(subjectId));
//         toast.success("Subject deleted successfully", {
//           position: "bottom-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       toast.error("Error deleting subject", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleUpdateSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await dispatch(updateSubject({ ...selectedSubject, objectives }));
//       toast.success("Subject updated successfully", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//       setShowEditForm(false);
//     } catch (error) {
//       toast.error("Error updating subject", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAddSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await dispatch(addSubject({ ...newSubject, objectives }));
//       setNewSubject({
//         title: "",
//         description: "",
//         price: "",
//         educationalCycle: "",
//         educationalLevel: "",
//         stream: "",
//         objectives: [],
//       });
//       setShowAddForm(false);
//     } catch (error) {
//       toast.error("Error adding subject", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handlePlaySubject = (id) => {
//     navigate(`/subject/${id}`);
//   };

//   const handleObjectiveChange = (index, value) => {
//     const updatedObjectives = [...objectives];
//     updatedObjectives[index] = value;
//     setObjectives(updatedObjectives);
//   };

//   const addObjectiveField = () => {
//     setObjectives([...objectives, ""]);
//   };

//   const removeObjectiveField = (index) => {
//     const updatedObjectives = [...objectives];
//     updatedObjectives.splice(index, 1);
//     setObjectives(updatedObjectives);
//   };
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(9);

//   const [selectedEducationalLevel, setSelectedEducationalLevel] = useState("");
//   const [selectedStream, setSelectedStream] = useState("");

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const filteredSubjects = subjects.filter(
//     (subject) =>
//       (!selectedEducationalLevel ||
//         subject.educationalLevel === selectedEducationalLevel) &&
//       (!selectedStream || subject.stream === selectedStream)
//   );

//   const validEducationalLevels = [
//     ...new Set(subjects.map((subject) => subject.educationalLevel)),
//   ];
//   const validStreams = [...new Set(subjects.map((subject) => subject.stream))];

//   const indexOfLastSubject = currentPage * itemsPerPage;
//   const indexOfFirstSubject = indexOfLastSubject - itemsPerPage;

//   const currentSubjects = filteredSubjects.slice(
//     indexOfFirstSubject,
//     indexOfLastSubject
//   );

//   const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

//   const educationalLevels = {
//     Primaire: [
//       "1ère année Primaire",
//       "2ème année Primaire",
//       "3ème année Primaire",
//       "4ème année Primaire",
//       "5ème année Primaire",
//       "6ème année Primaire",
//     ],
//     Collège: ["1ère année collège", "2ème année collège", "3ème année collège"],
//     Lycée: [
//       "Tronc Commun",
//       "1ère année du Baccalauréat",
//       "2ème année du Baccalauréat",
//     ],
//   };

//   const streams = {
//     "Tronc Commun": [
//       "Sciences",
//       "Lettres et Sciences Humaines",
//       "Technologies",
//     ],
//     "1ère année du Baccalauréat": [
//       "Sciences Mathématiques",
//       "Sciences Expérimentales",
//       "Sciences et Technologies Électriques",
//       "Sciences et Technologies Mécaniques",
//       "Lettres et Sciences Humaines",
//       "Sciences Économiques et Gestion",
//     ],
//     "2ème année du Baccalauréat": [
//       "Sciences Mathématiques A",
//       "Sciences Mathématiques B",
//       "Sciences Physiques",
//       "Sciences de la Vie et de la Terre",
//       "Sciences Agronomiques",
//       "Sciences et Technologies Électriques",
//       "Sciences et Technologies Mécaniques",
//       "Lettres",
//       "Sciences Humaines",
//       "Sciences Économiques",
//       "Techniques de Gestion et Comptabilité",
//     ],
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <main className="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
//       <div className="w-full overflow-x-auto">
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <div>
//                 <Button
//                   className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
//                   onClick={() => setShowAddForm((prevState) => !prevState)}
//                 >
//                   Add Subject
//                 </Button>
//               </div>
//               <div className="flex flex-row gap-4 items-center">
//                 <div className="flex flex-row items-center">
//                   <Label htmlFor="levelFilter" className="mr-2">
//                     Level:
//                   </Label>
//                   <select
//                     id="levelFilter"
//                     onChange={(e) =>
//                       setSelectedEducationalLevel(e.target.value || "")
//                     }
//                     value={selectedEducationalLevel || ""}
//                     className="py-1 px-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">All</option>
//                     {validEducationalLevels.map((level, index) => (
//                       <option key={index} value={level}>
//                         {level}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex flex-row items-center">
//                   <Label htmlFor="streamFilter" className="mr-2">
//                     Stream:
//                   </Label>
//                   <select
//                     id="streamFilter"
//                     onChange={(e) => setSelectedStream(e.target.value || "")}
//                     value={selectedStream || ""}
//                     className="py-1 px-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">All</option>
//                     {validStreams.map((stream, index) => (
//                       <option key={index} value={stream}>
//                         {stream}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div>
//               <Table>
//                 <TableHeader>
//                   <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
//                     <TableHead className=" px-4 py-2">Title</TableHead>
//                     <TableHead className=" px-4 py-2">
//                       Educational Level
//                     </TableHead>
//                     <TableHead className=" px-4 py-2">Stream</TableHead>
//                     <TableHead className=" px-4 py-2">Enrolls</TableHead>
//                     <TableHead className=" px-4 py-2">Price</TableHead>
//                     <TableHead className="text-center px-4 py-2">
//                       Actions
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentSubjects.map((subject) => (
//                     <TableRow key={subject._id}>
//                       <TableCell className=" px-4 py-2">
//                         {subject.title.split("-")[0]}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2 ">
//                         {subject.educationalLevel}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2">
//                         {subject.stream}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2">
//                         {subject.enrolls}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2">
//                         {subject.price ? `$${subject.price}` : "Free"}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2">
//                         <div className="flex gap-2">
//                           <Button
//                             className="h-8"
//                             variant="outline"
//                             onClick={() => handlePlaySubject(subject._id)}
//                           >
//                             <PlayIcon className="w-4 h-4 mr-1" /> View
//                           </Button>
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 className="h-8"
//                                 onClick={() => {
//                                   setSelectedSubject(subject);
//                                   setShowEditForm(true);
//                                 }}
//                               >
//                                 <FileEditIcon className="w-4 h-4 mr-2" /> Edit
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent
//                               open={showEditForm}
//                               onOpenChange={setShowEditForm}
//                             >
//                               <DialogHeader>
//                                 <DialogTitle>Edit Subject</DialogTitle>
//                               </DialogHeader>
//                               <form onSubmit={handleUpdateSubmit}>
//                                 <div className="flex flex-col mb-4">
//                                   <Label htmlFor="title" className="block mb-1">
//                                     Title
//                                   </Label>
//                                   <Input
//                                     id="title"
//                                     type="text"
//                                     value={selectedSubject?.title || ""}
//                                     onChange={(e) =>
//                                       setSelectedSubject((prev) => ({
//                                         ...prev,
//                                         title: e.target.value,
//                                       }))
//                                     }
//                                   />
//                                 </div>
//                                 <div className="mb-4">
//                                   <Label
//                                     htmlFor="description"
//                                     className="block mb-1"
//                                   >
//                                     Description
//                                   </Label>
//                                   <Textarea
//                                     id="description"
//                                     value={selectedSubject?.description || ""}
//                                     onChange={(e) =>
//                                       setSelectedSubject((prev) => ({
//                                         ...prev,
//                                         description: e.target.value,
//                                       }))
//                                     }
//                                   />
//                                 </div>
//                                 <div className="space-y-1/2">
//                                   <Label htmlFor="objectives" className="block">
//                                     Objectives
//                                   </Label>
//                                   {selectedSubject?.objectives.map(
//                                     (objective, index) => (
//                                       <div
//                                         key={index}
//                                         className="flex items-center space-x-2"
//                                       >
//                                         <Input
//                                           type="text"
//                                           value={objectives[index] || ""}
//                                           onChange={(e) =>
//                                             handleObjectiveChange(
//                                               index,
//                                               e.target.value
//                                             )
//                                           }
//                                           placeholder={` Objective ${
//                                             index + 1
//                                           }`}
//                                           className="w-full"
//                                         />
//                                         <button
//                                           type="button"
//                                           onClick={() =>
//                                             removeObjectiveField(index)
//                                           }
//                                           className="text-red-600 hover:text-red-700 focus:outline-none"
//                                         >
//                                           Remove
//                                         </button>
//                                       </div>
//                                     )
//                                   )}
//                                   <button
//                                     type="button"
//                                     onClick={addObjectiveField}
//                                     className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
//                                   >
//                                     Add objective
//                                   </button>
//                                 </div>
//                                 <div className="mb-4">
//                                   <Label htmlFor="price" className="block mb-1">
//                                     Price
//                                   </Label>
//                                   <Input
//                                     id="price"
//                                     type="text"
//                                     value={selectedSubject?.price || ""}
//                                     onChange={(e) =>
//                                       setSelectedSubject((prev) => ({
//                                         ...prev,
//                                         price: e.target.value,
//                                       }))
//                                     }
//                                   />
//                                 </div>
//                                 <div className="mb-4">
//                                   <Label
//                                     htmlFor="educationalCycle"
//                                     className="block mb-1"
//                                   >
//                                     Educational Cycle
//                                   </Label>
//                                   <select
//                                     id="educationalCycle"
//                                     value={
//                                       selectedSubject?.educationalCycle || ""
//                                     }
//                                     onChange={(e) => {
//                                       const cycle = e.target.value;
//                                       setSelectedSubject((prev) => ({
//                                         ...prev,
//                                         educationalCycle: cycle,
//                                         educationalLevel: "",
//                                         stream: "",
//                                       }));
//                                     }}
//                                     className="w-full focus:outline-none focus:border-blue-500"
//                                   >
//                                     <option value="">Select Cycle</option>
//                                     <option value="Primaire">Primaire</option>
//                                     <option value="Collège">Collège</option>
//                                     <option value="Lycée">Lycée</option>
//                                   </select>
//                                 </div>
//                                 {selectedSubject?.educationalCycle && (
//                                   <>
//                                     <div className="mb-4">
//                                       <Label
//                                         htmlFor="educationalLevel"
//                                         className="block mb-1"
//                                       >
//                                         Educational Level
//                                       </Label>
//                                       <select
//                                         id="educationalLevel"
//                                         value={
//                                           selectedSubject?.educationalLevel ||
//                                           ""
//                                         }
//                                         onChange={(e) => {
//                                           const level = e.target.value;
//                                           setSelectedSubject((prev) => ({
//                                             ...prev,
//                                             educationalLevel: level,
//                                             stream: "",
//                                           }));
//                                         }}
//                                         className="w-full focus:outline-none focus:border-blue-500"
//                                       >
//                                         <option value="">Select Level</option>
//                                         {educationalLevels[
//                                           selectedSubject.educationalCycle
//                                         ]?.map((level, index) => (
//                                           <option key={index} value={level}>
//                                             {level}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </div>
//                                     {selectedSubject?.educationalLevel && (
//                                       <div className="mb-4">
//                                         <Label
//                                           htmlFor="stream"
//                                           className="block mb-1"
//                                         >
//                                           Stream
//                                         </Label>
//                                         <select
//                                           id="stream"
//                                           value={selectedSubject?.stream || ""}
//                                           onChange={(e) =>
//                                             setSelectedSubject((prev) => ({
//                                               ...prev,
//                                               stream: e.target.value,
//                                             }))
//                                           }
//                                           className="w-full focus:outline-none focus:border-blue-500"
//                                         >
//                                           <option value="">
//                                             Select Stream
//                                           </option>
//                                           {streams[
//                                             selectedSubject.educationalLevel
//                                           ]?.map((stream, index) => (
//                                             <option key={index} value={stream}>
//                                               {stream}
//                                             </option>
//                                           ))}
//                                         </select>
//                                       </div>
//                                     )}
//                                   </>
//                                 )}
//                                 <DialogFooter>
//                                   <Button type="submit">Save</Button>
//                                 </DialogFooter>
//                               </form>
//                             </DialogContent>
//                           </Dialog>
//                           <Button
//                             variant="outline"
//                             className="h-8"
//                             onClick={() => handleDelete(subject._id)}
//                           >
//                             <TrashIcon className="w-4 h-4" /> Delete
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               <div className="flex justify-center mt-4">
//                 <Pagination>
//                   <PaginationContent>
//                     <PaginationItem>
//                       {currentPage !== 1 && (
//                         <PaginationPrevious
//                           className="cursor-pointer"
//                           onClick={() => handlePageChange(currentPage - 1)}
//                           disabled={currentPage === 1}
//                         />
//                       )}
//                     </PaginationItem>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <PaginationItem key={page}>
//                           <PaginationLink
//                             className="cursor-pointer"
//                             onClick={() => handlePageChange(page)}
//                             isActive={page === currentPage}
//                           >
//                             {page}
//                           </PaginationLink>
//                         </PaginationItem>
//                       )
//                     )}
//                     <PaginationItem>
//                       {currentPage !== totalPages && (
//                         <PaginationNext
//                           className="cursor-pointer"
//                           onClick={() => handlePageChange(currentPage + 1)}
//                           disabled={currentPage === totalPages}
//                         />
//                       )}
//                     </PaginationItem>
//                   </PaginationContent>
//                 </Pagination>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {showAddForm && (
//         <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Subject</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleAddSubmit}>
//               <Label htmlFor="newTitle" className="text-sm mx-4 text-gray-500 ">
//                 Title
//               </Label>
//               <Input
//                 type="text"
//                 id="newTitle"
//                 name="newTitle"
//                 value={newSubject.title}
//                 onChange={(event) =>
//                   setNewSubject({
//                     ...newSubject,
//                     title: event.target.value,
//                   })
//                 }
//                 className="focus:outline-none focus:border-blue-500"
//               />
//               <Label
//                 htmlFor="newDescription"
//                 className="text-sm mx-4 text-gray-500"
//               >
//                 Description
//               </Label>
//               <Textarea
//                 id="newDescription"
//                 name="newDescription"
//                 value={newSubject.description}
//                 onChange={(event) =>
//                   setNewSubject({
//                     ...newSubject,
//                     description: event.target.value,
//                   })
//                 }
//                 className="focus:outline-none focus:border-blue-500"
//               />
//               <div className="space-y-1/2">
//                 <Label htmlFor="objectives" className="block">
//                   Objectives
//                 </Label>
//                 {objectives.map((objective, index) => (
//                   <div key={index} className="flex items-center space-x-2">
//                     <Input
//                       type="text"
//                       value={objective}
//                       onChange={(e) =>
//                         handleObjectiveChange(index, e.target.value)
//                       }
//                       placeholder={`Objective ${index + 1}`}
//                       className="w-full"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeObjectiveField(index)}
//                       className="text-red-600 hover:text-red-700 focus:outline-none"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={addObjectiveField}
//                   className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
//                 >
//                   Add objective
//                 </button>
//               </div>
//               <Label htmlFor="newPrice" className="text-sm mx-4 text-gray-500">
//                 Price
//               </Label>
//               <Input
//                 type="number"
//                 id="newPrice"
//                 name="newPrice"
//                 value={newSubject.price}
//                 onChange={(event) =>
//                   setNewSubject({
//                     ...newSubject,
//                     price: event.target.value,
//                   })
//                 }
//                 className="focus:outline-none focus:border-blue-500"
//               />
//               <Label
//                 htmlFor="newEducationalCycle"
//                 className="text-sm mx-4 text-gray-500"
//               >
//                 Educational Cycle
//               </Label>
//               <select
//                 id="newEducationalCycle"
//                 name="newEducationalCycle"
//                 value={newSubject.educationalCycle}
//                 onChange={(event) =>
//                   setNewSubject({
//                     ...newSubject,
//                     educationalCycle: event.target.value,
//                     educationalLevel: "",
//                     stream: "",
//                   })
//                 }
//                 className="w-full focus:outline-none focus:border-blue-500"
//               >
//                 <option value="">Select Cycle</option>
//                 <option value="Primaire">Primaire</option>
//                 <option value="Collège">Collège</option>
//                 <option value="Lycée">Lycée</option>
//               </select>
//               {newSubject.educationalCycle && (
//                 <>
//                   <Label
//                     htmlFor="newEducationalLevel"
//                     className="text-sm mx-4 text-gray-500"
//                   >
//                     Educational Level
//                   </Label>
//                   <select
//                     id="newEducationalLevel"
//                     name="newEducationalLevel"
//                     value={newSubject.educationalLevel}
//                     onChange={(event) =>
//                       setNewSubject({
//                         ...newSubject,
//                         educationalLevel: event.target.value,
//                         stream: "",
//                       })
//                     }
//                     className="w-full focus:outline-none focus:border-blue-500"
//                     disabled={!newSubject.educationalCycle}
//                   >
//                     <option value="">Select Level</option>
//                     {educationalLevels[newSubject.educationalCycle]?.map(
//                       (level) => (
//                         <option key={level} value={level}>
//                           {level}
//                         </option>
//                       )
//                     )}
//                   </select>
//                 </>
//               )}
//               {newSubject.educationalCycle === "Lycée" &&
//                 newSubject.educationalLevel && (
//                   <>
//                     <Label
//                       htmlFor="newStream"
//                       className="text-sm mx-4 text-gray-500"
//                     >
//                       Stream
//                     </Label>
//                     <select
//                       id="newStream"
//                       name="newStream"
//                       value={newSubject.stream}
//                       onChange={(event) =>
//                         setNewSubject({
//                           ...newSubject,
//                           stream: event.target.value,
//                         })
//                       }
//                       className="w-full focus:outline-none focus:border-blue-500"
//                       disabled={!newSubject.educationalLevel}
//                     >
//                       <option value="">Select Stream</option>
//                       {streams[newSubject.educationalLevel]?.map((stream) => (
//                         <option key={stream} value={stream}>
//                           {stream}
//                         </option>
//                       ))}
//                     </select>
//                   </>
//                 )}
//               <div className="flex justify-center items-center mt-4">
//                 <Button
//                   type="submit"
//                   className="font-semibold text-white bg-blue-500 hover:bg-blue-600"
//                 >
//                   Add Subject
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       )}
//     </main>
//   );
// };

// export default Subjects;

///////////////////////////////////

// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSubjects,
//   addSubject,
//   updateSubject,
//   deleteSubject,
// } from "@/store/subjectSlice";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "../ui/table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationPrevious,
//   PaginationLink,
//   PaginationNext,
// } from "../ui/pagination";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";
// import { FileEditIcon, PlayIcon, TrashIcon } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Subjects = () => {
//   const subjects = useSelector((state) => state.subjects.entities);
//   const isLoading = useSelector((state) => state.subjects.isLoading);
//   const error = useSelector((state) => state.subjects.error);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [objectives, setObjectives] = useState([]);

//   const [newSubject, setNewSubject] = useState({
//     title: "",
//     description: "",
//     price: "",
//     educationalCycle: "",
//     educationalLevel: "",
//     stream: "",
//     objectives: [],
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(9);
//   const [selectedEducationalLevel, setSelectedEducationalLevel] = useState("");
//   const [selectedStream, setSelectedStream] = useState("");

//   useEffect(() => {
//     dispatch(fetchSubjects());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedSubject) {
//       setObjectives(selectedSubject.objectives || []);
//     }
//   }, [selectedSubject]);

//   const handleDelete = async (subjectId) => {
//     try {
//       const confirmDelete = window.confirm(
//         "Are you sure you want to delete this subject?"
//       );
//       if (confirmDelete) {
//         await dispatch(deleteSubject(subjectId));
//         toast.success("Subject deleted successfully", {
//           position: "bottom-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       toast.error("Error deleting subject", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleUpdateSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const updatedSubject = { ...selectedSubject, objectives };
//       await dispatch(updateSubject(updatedSubject));
//       toast.success("Subject updated successfully", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//       setShowEditForm(false);
//     } catch (error) {
//       toast.error("Error updating subject", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAddSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await dispatch(addSubject({ ...newSubject, objectives }));
//       setNewSubject({
//         title: "",
//         description: "",
//         price: "",
//         educationalCycle: "",
//         educationalLevel: "",
//         stream: "",
//         objectives: [],
//       });
//       setObjectives([]);
//       setShowAddForm(false);
//     } catch (error) {
//       toast.error("Error adding subject", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handlePlaySubject = (id) => {
//     navigate(`/subject/${id}`);
//   };

//   const handleObjectiveChange = (index, value) => {
//     const updatedObjectives = [...objectives];
//     updatedObjectives[index] = value;
//     setObjectives(updatedObjectives);
//   };

//   const addObjectiveField = () => {
//     setObjectives([...objectives, ""]);
//   };

//   const removeObjectiveField = (index) => {
//     const updatedObjectives = [...objectives];
//     updatedObjectives.splice(index, 1);
//     setObjectives(updatedObjectives);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const filteredSubjects = subjects.filter(
//     (subject) =>
//       (!selectedEducationalLevel ||
//         subject.educationalLevel === selectedEducationalLevel) &&
//       (!selectedStream || subject.stream === selectedStream)
//   );

//   const validEducationalLevels = [
//     ...new Set(subjects.map((subject) => subject.educationalLevel)),
//   ];
//   const validStreams = [...new Set(subjects.map((subject) => subject.stream))];

//   const indexOfLastSubject = currentPage * itemsPerPage;
//   const indexOfFirstSubject = indexOfLastSubject - itemsPerPage;
//   const currentSubjects = filteredSubjects.slice(
//     indexOfFirstSubject,
//     indexOfLastSubject
//   );
//   const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

//   const educationalLevels = {
//     Primaire: [
//       "1ère année Primaire",
//       "2ème année Primaire",
//       "3ème année Primaire",
//       "4ème année Primaire",
//       "5ème année Primaire",
//       "6ème année Primaire",
//     ],
//     Collège: ["1ère année collège", "2ème année collège", "3ème année collège"],
//     Lycée: [
//       "Tronc Commun",
//       "1ère année du Baccalauréat",
//       "2ème année du Baccalauréat",
//     ],
//   };

//   const streams = {
//     "Tronc Commun": [
//       "Sciences",
//       "Lettres et Sciences Humaines",
//       "Technologies",
//     ],
//     "1ère année du Baccalauréat": [
//       "Sciences Mathématiques",
//       "Sciences Expérimentales",
//       "Sciences et Technologies Électriques",
//       "Sciences et Technologies Mécaniques",
//       "Lettres et Sciences Humaines",
//       "Sciences Économiques et Gestion",
//     ],
//     "2ème année du Baccalauréat": [
//       "Sciences Mathématiques A",
//       "Sciences Mathématiques B",
//       "Sciences Physiques",
//       "Sciences de la Vie et de la Terre",
//       "Sciences Agronomiques",
//       "Sciences et Technologies Électriques",
//       "Sciences et Technologies Mécaniques",
//       "Lettres",
//       "Sciences Humaines",
//       "Sciences Économiques",
//       "Techniques de Gestion et Comptabilité",
//     ],
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <main className="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
//       <div className="w-full overflow-x-auto">
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <div>
//                 <Button
//                   className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
//                   onClick={() => setShowAddForm((prevState) => !prevState)}
//                 >
//                   Add Subject
//                 </Button>
//               </div>
//               <div className="flex flex-row gap-4 items-center">
//                 <div className="flex flex-row items-center">
//                   <Label htmlFor="levelFilter" className="mr-2">
//                     Level:
//                   </Label>
//                   <select
//                     id="levelFilter"
//                     onChange={(e) =>
//                       setSelectedEducationalLevel(e.target.value || "")
//                     }
//                     value={selectedEducationalLevel || ""}
//                     className="py-1 px-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">All</option>
//                     {validEducationalLevels.map((level, index) => (
//                       <option key={index} value={level}>
//                         {level}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex flex-row items-center">
//                   <Label htmlFor="streamFilter" className="mr-2">
//                     Stream:
//                   </Label>
//                   <select
//                     id="streamFilter"
//                     onChange={(e) => setSelectedStream(e.target.value || "")}
//                     value={selectedStream || ""}
//                     className="py-1 px-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">All</option>
//                     {validStreams.map((stream, index) => (
//                       <option key={index} value={stream}>
//                         {stream}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div>
//               <Table>
//                 <TableHeader>
//                   <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
//                     <TableHead className=" px-4 py-2">Title</TableHead>
//                     <TableHead className=" px-4 py-2">
//                       Educational Level
//                     </TableHead>
//                     <TableHead className=" px-4 py-2">Stream</TableHead>
//                     <TableHead className=" px-4 py-2">Enrolls</TableHead>
//                     <TableHead className=" px-4 py-2">Price</TableHead>
//                     <TableHead className="text-center px-4 py-2">
//                       Actions
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentSubjects.map((subject) => (
//                     <TableRow key={subject._id}>
//                       <TableCell className=" px-4 py-2">
//                         {subject.title.split("-")[0]}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2 ">
//                         {subject.educationalLevel}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2">
//                         {subject.stream}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2">
//                         {subject.enrolls}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2">
//                         {subject.price ? `$${subject.price}` : "Free"}
//                       </TableCell>
//                       <TableCell className=" px-4 py-2">
//                         <div className="flex justify-center gap-2">
//                           <Button
//                             className="h-8"
//                             variant="outline"
//                             onClick={() => handlePlaySubject(subject._id)}
//                           >
//                             <PlayIcon className="w-4 h-4 mr-1" /> View
//                           </Button>
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 className="h-8"
//                                 onClick={() => {
//                                   setSelectedSubject(subject);
//                                   setShowEditForm(true);
//                                 }}
//                               >
//                                 <FileEditIcon className="w-4 h-4 mr-2" /> Edit
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent
//                               open={showEditForm}
//                               onOpenChange={setShowEditForm}
//                             >
//                               <DialogHeader>
//                                 <DialogTitle>Edit Subject</DialogTitle>
//                               </DialogHeader>
//                               <form onSubmit={handleUpdateSubmit}>
//                                 <div className="flex flex-col mb-4">
//                                   <Label htmlFor="title" className="block mb-1">
//                                     Title
//                                   </Label>
//                                   <Input
//                                     id="title"
//                                     type="text"
//                                     value={selectedSubject?.title || ""}
//                                     onChange={(e) =>
//                                       setSelectedSubject((prev) => ({
//                                         ...prev,
//                                         title: e.target.value,
//                                       }))
//                                     }
//                                   />
//                                 </div>
//                                 <div className="mb-4">
//                                   <Label
//                                     htmlFor="description"
//                                     className="block mb-1"
//                                   >
//                                     Description
//                                   </Label>
//                                   <Textarea
//                                     id="description"
//                                     value={selectedSubject?.description || ""}
//                                     onChange={(e) =>
//                                       setSelectedSubject((prev) => ({
//                                         ...prev,
//                                         description: e.target.value,
//                                       }))
//                                     }
//                                   />
//                                 </div>
//                                 <div className="space-y-1/2">
//                                   <Label htmlFor="objectives" className="block">
//                                     Objectives
//                                   </Label>
//                                   {objectives.map((objective, index) => (
//                                     <div
//                                       key={index}
//                                       className="flex items-center space-x-2"
//                                     >
//                                       <Input
//                                         type="text"
//                                         value={objective}
//                                         onChange={(e) =>
//                                           handleObjectiveChange(
//                                             index,
//                                             e.target.value
//                                           )
//                                         }
//                                         placeholder={`Objective ${index + 1}`}
//                                         className="w-full"
//                                       />
//                                       <button
//                                         type="button"
//                                         onClick={() => removeObjectiveField(index)}
//                                         className="text-red-600 hover:text-red-700 focus:outline-none"
//                                       >
//                                         Remove
//                                       </button>
//                                     </div>
//                                   ))}
//                                   <button
//                                     type="button"
//                                     onClick={addObjectiveField}
//                                     className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
//                                   >
//                                     Add objective
//                                   </button>
//                                 </div>
//                                 <div className="mb-4">
//                                   <Label htmlFor="price" className="block mb-1">
//                                     Price
//                                   </Label>
//                                   <Input
//                                     id="price"
//                                     type="text"
//                                     value={selectedSubject?.price || ""}
//                                     onChange={(e) =>
//                                       setSelectedSubject((prev) => ({
//                                         ...prev,
//                                         price: e.target.value,
//                                       }))
//                                     }
//                                   />
//                                 </div>
//                                 <div className="mb-4">
//                                   <Label
//                                     htmlFor="educationalCycle"
//                                     className="block mb-1"
//                                   >
//                                     Educational Cycle
//                                   </Label>
//                                   <select
//                                     id="educationalCycle"
//                                     value={
//                                       selectedSubject?.educationalCycle || ""
//                                     }
//                                     onChange={(e) => {
//                                       const cycle = e.target.value;
//                                       setSelectedSubject((prev) => ({
//                                         ...prev,
//                                         educationalCycle: cycle,
//                                         educationalLevel: "",
//                                         stream: "",
//                                       }));
//                                     }}
//                                     className="w-full focus:outline-none focus:border-blue-500"
//                                   >
//                                     <option value="">Select Cycle</option>
//                                     <option value="Primaire">Primaire</option>
//                                     <option value="Collège">Collège</option>
//                                     <option value="Lycée">Lycée</option>
//                                   </select>
//                                 </div>
//                                 {selectedSubject?.educationalCycle && (
//                                   <>
//                                     <div className="mb-4">
//                                       <Label
//                                         htmlFor="educationalLevel"
//                                         className="block mb-1"
//                                       >
//                                         Educational Level
//                                       </Label>
//                                       <select
//                                         id="educationalLevel"
//                                         value={
//                                           selectedSubject?.educationalLevel ||
//                                           ""
//                                         }
//                                         onChange={(e) => {
//                                           const level = e.target.value;
//                                           setSelectedSubject((prev) => ({
//                                             ...prev,
//                                             educationalLevel: level,
//                                             stream: "",
//                                           }));
//                                         }}
//                                         className="w-full focus:outline-none focus:border-blue-500"
//                                       >
//                                         <option value="">Select Level</option>
//                                         {educationalLevels[
//                                           selectedSubject.educationalCycle
//                                         ]?.map((level, index) => (
//                                           <option key={index} value={level}>
//                                             {level}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </div>
//                                     {selectedSubject?.educationalLevel && (
//                                       <div className="mb-4">
//                                         <Label
//                                           htmlFor="stream"
//                                           className="block mb-1"
//                                         >
//                                           Stream
//                                         </Label>
//                                         <select
//                                           id="stream"
//                                           value={selectedSubject?.stream || ""}
//                                           onChange={(e) =>
//                                             setSelectedSubject((prev) => ({
//                                               ...prev,
//                                               stream: e.target.value,
//                                             }))
//                                           }
//                                           className="w-full focus:outline-none focus:border-blue-500"
//                                         >
//                                           <option value="">
//                                             Select Stream
//                                           </option>
//                                           {streams[
//                                             selectedSubject.educationalLevel
//                                           ]?.map((stream, index) => (
//                                             <option key={index} value={stream}>
//                                               {stream}
//                                             </option>
//                                           ))}
//                                         </select>
//                                       </div>
//                                     )}
//                                   </>
//                                 )}
//                                 <DialogFooter>
//                                   <Button type="submit">Save</Button>
//                                 </DialogFooter>
//                               </form>
//                             </DialogContent>
//                           </Dialog>
//                           <Button
//                             variant="outline"
//                             className="h-8"
//                             onClick={() => handleDelete(subject._id)}
//                           >
//                             <TrashIcon className="w-4 h-4" /> Delete
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               <div className="flex justify-center mt-4">
//                 <Pagination>
//                   <PaginationContent>
//                     <PaginationItem>
//                       {currentPage !== 1 && (
//                         <PaginationPrevious
//                           className="cursor-pointer"
//                           onClick={() => handlePageChange(currentPage - 1)}
//                           disabled={currentPage === 1}
//                         />
//                       )}
//                     </PaginationItem>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <PaginationItem key={page}>
//                           <PaginationLink
//                             className="cursor-pointer"
//                             onClick={() => handlePageChange(page)}
//                             isActive={page === currentPage}
//                           >
//                             {page}
//                           </PaginationLink>
//                         </PaginationItem>
//                       )
//                     )}
//                     <PaginationItem>
//                       {currentPage !== totalPages && (
//                         <PaginationNext
//                           className="cursor-pointer"
//                           onClick={() => handlePageChange(currentPage + 1)}
//                           disabled={currentPage === totalPages}
//                         />
//                       )}
//                     </PaginationItem>
//                   </PaginationContent>
//                 </Pagination>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {showAddForm && (
//         <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Subject</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleAddSubmit}>
//               <Label htmlFor="newTitle" className="text-sm mx-4 text-gray-500 ">
//                 Title
//               </Label>
//               <Input
//                 type="text"
//                 id="newTitle"
//                 name="newTitle"
//                 value={newSubject.title}
//                 onChange={(event) =>
//                   setNewSubject({
//                     ...newSubject,
//                     title: event.target.value,
//                   })
//                 }
//                 className="focus:outline-none focus:border-blue-500"
//               />
//               <Label
//                 htmlFor="newDescription"
//                 className="text-sm mx-4 text-gray-500"
//               >
//                 Description
//               </Label>
//               <Textarea
//                 id="newDescription"
//                 name="newDescription"
//                 value={newSubject.description}
//                 onChange={(event) =>
//                   setNewSubject({
//                     ...newSubject,
//                     description: event.target.value,
//                   })
//                 }
//                 className="focus:outline-none focus:border-blue-500"
//               />
//               <div className="space-y-1/2">
//                 <Label htmlFor="objectives" className="block">
//                   Objectives
//                 </Label>
//                 {objectives.map((objective, index) => (
//                   <div key={index} className="flex items-center space-x-2">
//                     <Input
//                       type="text"
//                       value={objective}
//                       onChange={(e) =>
//                         handleObjectiveChange(index, e.target.value)
//                       }
//                       placeholder={`Objective ${index + 1}`}
//                       className="w-full"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeObjectiveField(index)}
//                       className="text-red-600 hover:text-red-700 focus:outline-none"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={addObjectiveField}
//                   className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
//                 >
//                   Add objective
//                 </button>
//               </div>
//               <Label htmlFor="newPrice" className="text-sm mx-4 text-gray-500">
//                 Price
//               </Label>
//               <Input
//                 type="number"
//                 id="newPrice"
//                 name="newPrice"
//                 value={newSubject.price}
//                 onChange={(event) =>
//                   setNewSubject({
//                     ...newSubject,
//                     price: event.target.value,
//                   })
//                 }
//                 className="focus:outline-none focus:border-blue-500"
//               />
//               <Label
//                 htmlFor="newEducationalCycle"
//                 className="text-sm mx-4 text-gray-500"
//               >
//                 Educational Cycle
//               </Label>
//               <select
//                 id="newEducationalCycle"
//                 name="newEducationalCycle"
//                 value={newSubject.educationalCycle}
//                 onChange={(event) =>
//                   setNewSubject({
//                     ...newSubject,
//                     educationalCycle: event.target.value,
//                     educationalLevel: "",
//                     stream: "",
//                   })
//                 }
//                 className="w-full focus:outline-none focus:border-blue-500"
//               >
//                 <option value="">Select Cycle</option>
//                 <option value="Primaire">Primaire</option>
//                 <option value="Collège">Collège</option>
//                 <option value="Lycée">Lycée</option>
//               </select>
//               {newSubject.educationalCycle && (
//                 <>
//                   <Label
//                     htmlFor="newEducationalLevel"
//                     className="text-sm mx-4 text-gray-500"
//                   >
//                     Educational Level
//                   </Label>
//                   <select
//                     id="newEducationalLevel"
//                     name="newEducationalLevel"
//                     value={newSubject.educationalLevel}
//                     onChange={(event) =>
//                       setNewSubject({
//                         ...newSubject,
//                         educationalLevel: event.target.value,
//                         stream: "",
//                       })
//                     }
//                     className="w-full focus:outline-none focus:border-blue-500"
//                     disabled={!newSubject.educationalCycle}
//                   >
//                     <option value="">Select Level</option>
//                     {educationalLevels[newSubject.educationalCycle]?.map(
//                       (level) => (
//                         <option key={level} value={level}>
//                           {level}
//                         </option>
//                       )
//                     )}
//                   </select>
//                 </>
//               )}
//               {newSubject.educationalCycle === "Lycée" &&
//                 newSubject.educationalLevel && (
//                   <>
//                     <Label
//                       htmlFor="newStream"
//                       className="text-sm mx-4 text-gray-500"
//                     >
//                       Stream
//                     </Label>
//                     <select
//                       id="newStream"
//                       name="newStream"
//                       value={newSubject.stream}
//                       onChange={(event) =>
//                         setNewSubject({
//                           ...newSubject,
//                           stream: event.target.value,
//                         })
//                       }
//                       className="w-full focus:outline-none focus:border-blue-500"
//                       disabled={!newSubject.educationalLevel}
//                     >
//                       <option value="">Select Stream</option>
//                       {streams[newSubject.educationalLevel]?.map((stream) => (
//                         <option key={stream} value={stream}>
//                           {stream}
//                         </option>
//                       ))}
//                     </select>
//                   </>
//                 )}
//               <div className="flex justify-center items-center mt-4">
//                 <Button
//                   type="submit"
//                   className="font-semibold text-white bg-blue-500 hover:bg-blue-600"
//                 >
//                   Add Subject
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       )}
//     </main>
//   );
// };

// export default Subjects;

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubjects, deleteSubject } from "@/store/subjectSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../../components/ui/pagination";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  FileEditIcon,
  PlayIcon,
  TrashIcon,
  Plus,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ConfirmDialog from "@/components/ConfirmDialog";

const Subjects = () => {
  const subjects = useSelector((state) => state.subjects.entities);
  const isLoading = useSelector((state) => state.subjects.isLoading);
  const error = useSelector((state) => state.subjects.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [selectedEducationalLevel, setSelectedEducationalLevel] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleDeleteSubject = (subjectId) => {
    setSubjectToDelete(subjectId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!subjectToDelete) return;
      await dispatch(deleteSubject(subjectToDelete));
      toast.success("Matière supprimée avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setShowDeleteConfirm(false);
      setSubjectToDelete(null);
    }
  };

  const handlePlaySubject = (id) => {
    navigate(`/subject/${id}`);
  };

  const handleCreateSubject = () => {
    navigate("/CreateSubject");
  };

  const handleEditSubject = (id) => {
    navigate(`/update/subject/${id}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      (!selectedEducationalLevel ||
        subject.educationalLevel === selectedEducationalLevel) &&
      (!selectedStream || subject.stream === selectedStream)
  );

  const validEducationalLevels = [
    ...new Set(subjects.map((subject) => subject.educationalLevel)),
  ];
  const validStreams = [...new Set(subjects.map((subject) => subject.stream))];

  const indexOfLastSubject = currentPage * itemsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - itemsPerPage;
  const currentSubjects = filteredSubjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Disciplines</CardTitle>
            <CardDescription>
              Gérez vos disciplines pédagogiques facilement.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              {/* Bouton Ajouter une discipline */}
              <Button
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                onClick={handleCreateSubject}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une discipline
              </Button>

              {/* Filtres Niveau et Filière */}
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
                  <TableHead className="px-4 py-3">Title</TableHead>
                  <TableHead className="px-4 py-3">
                    Niveau d’enseignement
                  </TableHead>
                  <TableHead className="px-4 py-3">Filière</TableHead>
                  <TableHead className="px-4 py-3">Inscriptions</TableHead>
                  <TableHead className="px-4 py-3">Prix</TableHead>
                  <TableHead className="text-center px-4 py-3">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              {isLoading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              <TableBody>
                {currentSubjects.map((subject) => (
                  <TableRow key={subject._id} className="hover:bg-gray-50">
                    <TableCell className="px-4 py-3 font-medium">
                      {subject.title.split("-")[0]}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {subject.educationalLevel}
                    </TableCell>
                    <TableCell className="text-center">
                      {subject.stream}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {subject.enrolls || 0}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {subject.price ? `${subject.price} DH` : "Free"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePlaySubject(subject._id)}
                          className="bg-transparent"
                        >
                          <PlayIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSubject(subject._id)}
                          className="bg-transparent"
                        >
                          <FileEditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSubject(subject._id)}
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

            {currentSubjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center my-12"
              >
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  Aucune matière n’a été ajoutée pour le moment.
                </h3>
                <p className="text-muted-foreground">
                  Il n’y a actuellement aucune matière à afficher.
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
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette matière ? Cette action est irréversible."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSubjectToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
    </div>
  );
};
export default Subjects;
