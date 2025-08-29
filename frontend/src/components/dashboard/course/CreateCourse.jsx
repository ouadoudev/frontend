// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createCourse } from "@/store/courseSlice";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Textarea } from "../../components/ui/textarea";
// import { fetchSubjects } from "@/store/subjectSlice";
// import { Card } from "../../components/ui/card";
// import { loggedUser } from "../../store/authSlice";

// function CreateCourseForm() {
//   const subjects = useSelector((state) => state.subjects.entities);
//   const teacher = useSelector(loggedUser);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [prerequisites, setPrerequisites] = useState([]);
//   const [subject, setSubject] = useState("");
//   const [published, setPublished] = useState(false);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchSubjects()).then(() => setLoading(false));
//   }, [dispatch]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("prerequisites", JSON.stringify(prerequisites));
//     formData.append("subject", subject);
//     formData.append("published", published);
//     formData.append("thumbnail", thumbnail);
//     formData.append("teacher", teacher.id);

//     try {
//       await dispatch(createCourse(formData));
//       setMessage("Course created successfully!");
//     } catch (error) {
//       if (error.response) {
//         setMessage(`Error creating Course: ${error.response.data.error}`);
//       } else {
//         setMessage("Error creating Course: " + error.message);
//       }
//     }
//   };

//   const handlePrerequisiteChange = (index, value) => {
//     const updatedPrerequisites = [...prerequisites];
//     updatedPrerequisites[index] = value;
//     setPrerequisites(updatedPrerequisites);
//   };

//   const addPrerequisiteField = () => {
//     setPrerequisites([...prerequisites, ""]);
//   };

//   const removePrerequisiteField = (index) => {
//     const updatedPrerequisites = [...prerequisites];
//     updatedPrerequisites.splice(index, 1);
//     setPrerequisites(updatedPrerequisites);
//   };

//   return (
//     <Card className="w-[60%] bg-transparent mx-auto px-4 md:px-6">
//       <div className="mx-auto max-w-xl space-y-1 md:p-">
//         <div className="space-y-2 text-center">
//           <h1 className="text-xl font-bold">Create New Course</h1>
//           <p className="text-gray-500 dark:text-gray-400">
//             Upload your Course and share it with your students.
//           </p>
//         </div>
//         <form className="space-y-3" onSubmit={handleSubmit}>
//           <div className="space-y-1">
//             <Label htmlFor="title" className="block">
//               Title
//             </Label>
//             <Input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full"
//             />
//           </div>

//           <div className="space-y-1/2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           <div className="space-y-1/2">
//             <Label htmlFor="subject" className="block">
//               Subject
//             </Label>
//             <div className="relative">
//               <select
//                 id="subject"
//                 value={subject}
//                 onChange={(event) => setSubject(event.target.value)}
//                 className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               >
//                 <option value="">Select a subject</option>
//                 {subjects ? (
//                   subjects.map((subject) => (
//                     <option key={subject._id} value={subject._id}>
//                       {subject.title}
//                     </option>
//                   ))
//                 ) : (
//                   <option value="">No subjects available</option>
//                 )}
//               </select>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Label
//               className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300"
//               htmlFor="file-upload"
//             >
//               Select Thumbnail
//             </Label>
//             <Input
//               className="hidden"
//               id="file-upload"
//               multiple
//               type="file"
//               onChange={(e) => setThumbnail(e.target.files[0])}
//             />
//           </div>

//           <div className="space-y-1">
//             <div className="flex items-center">
//               <Input
//                 id="published"
//                 type="checkbox"
//                 checked={published}
//                 onChange={(e) => setPublished(e.target.checked)}
//                 className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//               />
//               <Label htmlFor="published" className="ml-2">
//                 Published
//               </Label>
//             </div>
//           </div>

//           <div className="space-y-1/2">
//             <Label htmlFor="prerequisites" className="block">
//               Prerequisites
//             </Label>
//             {prerequisites.map((prerequisite, index) => (
//               <div key={index} className="flex items-center space-x-2">
//                 <Input
//                   type="text"
//                   value={prerequisite}
//                   onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
//                   placeholder={`Prerequisite ${index + 1}`}
//                   className="w-full"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removePrerequisiteField(index)}
//                   className="text-red-600 hover:text-red-700 focus:outline-none"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addPrerequisiteField}
//               className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
//             >
//               Add Prerequisite
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Create Course
//           </button>
//         </form>

//         {message && <p className="text-center text-green-500">{message}</p>}
//       </div>
//     </Card>
//   );
// }

// export default CreateCourseForm;
//////////////////////////
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createCourse } from "@/store/courseSlice";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Textarea } from "../../components/ui/textarea";
// import { fetchSubjects } from "@/store/subjectSlice";
// import { Card } from "../../components/ui/card";
// import { loggedUser } from "../../store/authSlice";
// import { BookOpenIcon, EyeIcon, EyeOffIcon } from "lucide-react";

// function CreateCourseForm() {
//   const dispatch = useDispatch();
//   const subjects = useSelector((state) => state.subjects.entities);
//   const teacher = useSelector(loggedUser);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [prerequisites, setPrerequisites] = useState([]);
//   const [objectives, setObjectives] = useState([]);
//   const [subject, setSubject] = useState("");
//   const [published, setPublished] = useState(false);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [level, setLevel] = useState("");
//   const [stream, setStream] = useState("");
//   const [filteredSubjects, setFilteredSubjects] = useState([]);
//   const [validEducationalLevels, setValidEducationalLevels] = useState([]);
//   const [validStreams, setValidStreams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     dispatch(fetchSubjects()).then(() => setLoading(false));
//   }, [dispatch]);

//   useEffect(() => {
//     const levels = [
//       ...new Set(subjects.map((subject) => subject.educationalLevel)),
//     ];
//     const streams = [...new Set(subjects.map((subject) => subject.stream))];

//     setValidEducationalLevels(levels);
//     setValidStreams(streams);

//     const filtered = subjects.filter(
//       (subject) =>
//         (level ? subject.educationalLevel === level : true) &&
//         (stream ? subject.stream === stream : true) &&
//         subject.title.startsWith(teacher.discipline)
//     );
//     setFilteredSubjects(filtered);
//   }, [subjects, level, stream, teacher]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("prerequisites", JSON.stringify(prerequisites));
//     formData.append("objectives", JSON.stringify(objectives));
//     formData.append("subject", subject);
//     formData.append("published", published);
//     formData.append("thumbnail", thumbnail);
//     formData.append("teacher", teacher.id);

//     try {
//       await dispatch(createCourse(formData));
//       setMessage("Course created successfully!");
//     } catch (error) {
//       if (error.response) {
//         setMessage(`Error creating Course: ${error.response.data.error}`);
//       } else {
//         setMessage("Error creating Course: " + error.message);
//       }
//     }
//   };

//   const handlePrerequisiteChange = (index, value) => {
//     const updatedPrerequisites = [...prerequisites];
//     updatedPrerequisites[index] = value;
//     setPrerequisites(updatedPrerequisites);
//   };

//   const addPrerequisiteField = () => {
//     setPrerequisites([...prerequisites, ""]);
//   };

//   const removePrerequisiteField = (index) => {
//     const updatedPrerequisites = [...prerequisites];
//     updatedPrerequisites.splice(index, 1);
//     setPrerequisites(updatedPrerequisites);
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

//   return (
//     <div className="bg-gray-100 h-screen p-8">
//       <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         <form className="p-6 space-y-6" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <Label
//                   htmlFor="title"
//                   className="text-lg font-semibold text-gray-700"
//                 >
//                   <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//                   Course Title
//                 </Label>
//                 <Input
//                   id="title"
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                   placeholder="Enter course title"
//                 />
//               </div>
//               <div>
//                 <Label
//                   htmlFor="subject"
//                   className="text-lg font-semibold text-gray-700"
//                 >
//                   Subject
//                 </Label>
//                 <div className="relative mt-1">
//                   <select
//                     id="subject"
//                     value={subject}
//                     onChange={(event) => setSubject(event.target.value)}
//                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                   >
//                     <option value="">Select a subject</option>
//                     {filteredSubjects.length > 0 ? (
//                       filteredSubjects.map((subject) => (
//                         <option key={subject._id} value={subject._id}>
//                           {subject.title}
//                         </option>
//                       ))
//                     ) : (
//                       <option value="">No subjects available</option>
//                     )}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="level" className="block">
//                   Educational Level
//                 </Label>
//                 <select
//                   id="level"
//                   value={level}
//                   onChange={(event) => setLevel(event.target.value)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                 >
//                   <option value="">Select a level</option>
//                   {validEducationalLevels.map((level) => (
//                     <option key={level} value={level}>
//                       {level}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <Label htmlFor="stream" className="block">
//                   Stream
//                 </Label>
//                 <select
//                   id="stream"
//                   value={stream}
//                   onChange={(event) => setStream(event.target.value)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                 >
//                   <option value="">Select a stream</option>
//                   {validStreams.map((stream) => (
//                     <option key={stream} value={stream}>
//                       {stream}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <Label className="text-lg font-semibold text-gray-700">
//                   Visibility
//                 </Label>
//                 <div className="mt-2 space-x-4">
//                   <Label className="inline-flex items-center">
//                     <Input
//                       type="radio"
//                       name="visibility"
//                       value="true"
//                       checked={published === true}
//                       onChange={() => setPublished(true)}
//                       className="form-radio h-5 w-5 text-blue-600"
//                     />
//                     <span className="ml-2 text-gray-700">
//                       <EyeIcon className="inline-block mr-1 h-5 w-5" />
//                       Public
//                     </span>
//                   </Label>
//                   <Label className="inline-flex items-center">
//                     <Input
//                       type="radio"
//                       name="visibility"
//                       value="false"
//                       checked={published === false}
//                       onChange={() => setPublished(false)}
//                       className="form-radio h-5 w-5 text-blue-600"
//                     />
//                     <span className="ml-2 text-gray-700">
//                       <EyeOffIcon className="inline-block mr-1 h-5 w-5" />
//                       Private
//                     </span>
//                   </Label>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <Label htmlFor="file-upload" className="text-lg font-semibold text-gray-700">
//                 Select Thumbnail
//               </Label>
//               <Input
//                 className="hidden"
//                 id="file-upload"
//                 multiple
//                 type="file"
//                 onChange={(e) => setThumbnail(e.target.files[0])}
//               />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label
//               htmlFor="description"
//               className="text-lg font-semibold text-gray-700"
//             >
//               Description
//             </Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           <div className="space-y-1/2">
//             <Label htmlFor="prerequisites" className="block">
//               Prerequisites
//             </Label>
//             {prerequisites.map((prerequisite, index) => (
//               <div key={index} className="flex items-center space-x-2">
//                 <Input
//                   type="text"
//                   value={prerequisite}
//                   onChange={(e) =>
//                     handlePrerequisiteChange(index, e.target.value)
//                   }
//                   placeholder={`Prerequisite ${index + 1}`}
//                   className="w-full"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removePrerequisiteField(index)}
//                   className="text-red-600 hover:text-red-700 focus:outline-none"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addPrerequisiteField}
//               className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
//             >
//               Add Prerequisite
//             </button>
//           </div>
//           <div className="space-y-1/2">
//             <Label htmlFor="objectives" className="block">
//               Objectives
//             </Label>
//             {objectives.map((objective, index) => (
//               <div key={index} className="flex items-center space-x-2">
//                 <Input
//                   type="text"
//                   value={objective}
//                   onChange={(e) => handleObjectiveChange(index, e.target.value)}
//                   placeholder={`Objective ${index + 1}`}
//                   className="w-full"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeObjectiveField(index)}
//                   className="text-red-600 hover:text-red-700 focus:outline-none"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addObjectiveField}
//               className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
//             >
//               Add Objective
//             </button>
//           </div>

//           <div className="text-center">
//             <button
//               type="submit"
//               disabled={loading}
//               className="inline-flex items-center px-4 py-2 text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               {loading ? "Creating..." : "Create Course"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateCourseForm;



// import { useEffect, useState, useRef } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { createCourse } from "@/store/courseSlice"
// import { fetchSubjects } from "@/store/subjectSlice"
// import { loggedUser } from "../../../store/authSlice"
// import { Input } from "../../ui/input"
// import { Label } from "../../ui/label"
// import { Button } from "../../ui/button"
// import { Textarea } from "../../ui/textarea"
// import { Badge } from "../../ui/badge"
// import { Alert, AlertDescription } from "../../ui/alert"
// import {
//   UploadCloudIcon,
//   BookOpenIcon,
//   EyeIcon,
//   EyeOffIcon,
//   Plus,
//   CheckCircle2,
//   X,
//   Target,
//   GripVertical,
//   Edit3,
//   Save,
//   AlertCircle,
//   Lightbulb,
//   InfoIcon,
// } from "lucide-react"
// import { Separator } from "../../ui/separator"
// import { useNavigate } from "react-router-dom"
// import { cn } from "@/lib/utils"

// function CreateCourseForm() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const subjects = useSelector((state) => state.subjects.entities)
//   const teacher = useSelector(loggedUser)

//   // Original form state
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [subject, setSubject] = useState("")
//   const [published, setPublished] = useState(false)
//   const [thumbnail, setThumbnail] = useState(null)
//   const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null)
//   const [hasThumbnail, setHasThumbnail] = useState(false)
//   const [level, setLevel] = useState("")
//   const [stream, setStream] = useState("")
//   const [filteredSubjects, setFilteredSubjects] = useState([])
//   const [validEducationalLevels, setValidEducationalLevels] = useState([])
//   const [validStreams, setValidStreams] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState("")

//   // New state for educational restrictions
//   const [hasEducationalDetails, setHasEducationalDetails] = useState(false)
//   const [availableSubjects, setAvailableSubjects] = useState([])
//   const [restrictionMessage, setRestrictionMessage] = useState("")

//   // Enhanced prerequisites and objectives state
//   const [prerequisites, setPrerequisites] = useState([])
//   const [objectives, setObjectives] = useState([])
//   const [draggedItem, setDraggedItem] = useState(null)
//   const [draggedType, setDraggedType] = useState(null)
//   const inputRefs = useRef({})

//   const getDirection = (text) => {
//     const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
//     return rtlChars.test(text) ? "rtl" : "ltr"
//   }

//   const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

//   useEffect(() => {
//     dispatch(fetchSubjects()).then(() => setLoading(false))
//   }, [dispatch])

//   // Check teacher's educational details and filter subjects accordingly
//   useEffect(() => {
//     if (!teacher) return

//     const teacherCycles = teacher.educationalCycles || []
//     const teacherLevels = teacher.educationalLevels || []

//     // Check if teacher has assigned educational details
//     const hasDetails = teacherCycles.length > 0 && teacherLevels.length > 0
//     setHasEducationalDetails(hasDetails)

//     if (!hasDetails) {
//       setRestrictionMessage(
//         "You don't have assigned educational details. Please contact an administrator to assign your teaching levels before creating courses.",
//       )
//       setAvailableSubjects([])
//       setFilteredSubjects([])
//       return
//     }

//     // Filter subjects based on teacher's discipline AND assigned educational details
//     const matchingSubjects = subjects.filter((subject) => {
//       // Must match teacher's discipline
//       const matchesDiscipline = subject.title.startsWith(teacher.discipline)

//       // Must match at least one of teacher's assigned cycles
//       const matchesCycle = teacherCycles.includes(subject.educationalCycle)

//       // Must match at least one of teacher's assigned levels
//       const matchesLevel = teacherLevels.includes(subject.educationalLevel)

//       return matchesDiscipline && matchesCycle && matchesLevel
//     })

//     setAvailableSubjects(matchingSubjects)

//     if (matchingSubjects.length === 0) {
//       setRestrictionMessage(
//         `No subjects available for your discipline (${teacher.discipline}) within your assigned educational levels. Your assigned levels: ${teacherLevels.join(", ")}`,
//       )
//     } else {
//       setRestrictionMessage("")
//     }

//     // Set valid levels and streams based on teacher's assignments
//     setValidEducationalLevels(teacherLevels)
//     const teacherStreams = [...new Set(matchingSubjects.map((subject) => subject.stream).filter(Boolean))]
//     setValidStreams(teacherStreams)
//   }, [subjects, teacher])

//   // Filter available subjects based on selected level and stream
//   useEffect(() => {
//     if (!hasEducationalDetails) {
//       setFilteredSubjects([])
//       return
//     }

//     const filtered = availableSubjects.filter(
//       (subject) => (level ? subject.educationalLevel === level : true) && (stream ? subject.stream === stream : true),
//     )
//     setFilteredSubjects(filtered)
//   }, [availableSubjects, level, stream, hasEducationalDetails])

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // Additional validation for educational restrictions
//     if (!hasEducationalDetails) {
//       setMessage("Error: You must have assigned educational details to create courses.")
//       return
//     }

//     if (availableSubjects.length === 0) {
//       setMessage("Error: No subjects available for your assigned educational levels.")
//       return
//     }

//     const formData = new FormData()
//     formData.append("title", title)
//     formData.append("description", description)

//     // Convert enhanced format to array of strings (matching schema)
//     const prereqArray = prerequisites.map((item) => item.text.trim()).filter((text) => text.length > 0)
//     const objArray = objectives.map((item) => item.text.trim()).filter((text) => text.length > 0)

//     // Send as JSON strings since FormData doesn't handle arrays well
//     formData.append("prerequisites", JSON.stringify(prereqArray))
//     formData.append("objectives", JSON.stringify(objArray))
//     formData.append("subject", subject)
//     formData.append("published", published)
//     formData.append("thumbnail", thumbnail)
//     formData.append("teacher", teacher.id)

//     try {
//       await dispatch(createCourse(formData)).unwrap()
//       setMessage("Course created successfully!")
//       setTimeout(() => {
//         navigate(-1)
//       }, 1000)
//     } catch (error) {
//       if (error.response) {
//         setMessage(`Error creating Course: ${error.response.data.error}`)
//       } else {
//         setMessage("Error creating Course: " + error.message)
//       }
//     }
//   }

//   const handleDragOver = (event) => {
//     event.preventDefault()
//   }

//   const handleDrop = (event) => {
//     event.preventDefault()
//     const selectedFile = event.dataTransfer.files[0]
//     setThumbnail(selectedFile)
//     setThumbnailPreviewUrl(URL.createObjectURL(selectedFile))
//     setHasThumbnail(true)
//   }

//   const handleThumbnailChange = (event) => {
//     const selectedFile = event.target.files[0]
//     setThumbnail(selectedFile)
//     setThumbnailPreviewUrl(URL.createObjectURL(selectedFile))
//     setHasThumbnail(true)
//   }

//   // Enhanced prerequisites and objectives functions
//   const addPrerequisite = () => {
//     const newItem = {
//       id: generateId(),
//       text: "",
//       isEditing: true,
//       isNew: true,
//     }
//     setPrerequisites((prev) => [...prev, newItem])
//     setTimeout(() => {
//       const input = inputRefs.current[newItem.id]
//       if (input) input.focus()
//     }, 100)
//   }

//   const addObjective = () => {
//     const newItem = {
//       id: generateId(),
//       text: "",
//       isEditing: true,
//       isNew: true,
//     }
//     setObjectives((prev) => [...prev, newItem])
//     setTimeout(() => {
//       const input = inputRefs.current[newItem.id]
//       if (input) input.focus()
//     }, 100)
//   }

//   const updatePrerequisite = (id, text) => {
//     setPrerequisites((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
//   }

//   const updateObjective = (id, text) => {
//     setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
//   }

//   const toggleEdit = (id, type) => {
//     if (type === "prerequisites") {
//       setPrerequisites((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing, isNew: false } : item)),
//       )
//     } else {
//       setObjectives((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing, isNew: false } : item)),
//       )
//     }
//     setTimeout(() => {
//       const input = inputRefs.current[id]
//       if (input) input.focus()
//     }, 100)
//   }

//   const saveItem = (id, type) => {
//     if (type === "prerequisites") {
//       setPrerequisites((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, isEditing: false, isNew: false } : item)),
//       )
//     } else {
//       setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false, isNew: false } : item)))
//     }
//   }

//   const removeItem = (id, type) => {
//     if (type === "prerequisites") {
//       setPrerequisites((prev) => prev.filter((item) => item.id !== id))
//     } else {
//       setObjectives((prev) => prev.filter((item) => item.id !== id))
//     }
//   }

//   const handleKeyDown = (e, id, type) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       saveItem(id, type)
//     } else if (e.key === "Escape") {
//       const items = type === "prerequisites" ? prerequisites : objectives
//       const item = items.find((i) => i.id === id)
//       if (item?.isNew && !item.text.trim()) {
//         removeItem(id, type)
//       } else {
//         if (type === "prerequisites") {
//           setPrerequisites((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
//         } else {
//           setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
//         }
//       }
//     }
//   }

//   const handleDragStart = (e, id, type) => {
//     setDraggedItem(id)
//     setDraggedType(type)
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOverItem = (e) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "move"
//   }

//   const handleDropItem = (e, targetId, type) => {
//     e.preventDefault()
//     if (!draggedItem || draggedType !== type) return

//     const items = type === "prerequisites" ? prerequisites : objectives
//     const draggedIndex = items.findIndex((item) => item.id === draggedItem)
//     const targetIndex = items.findIndex((item) => item.id === targetId)

//     if (draggedIndex === -1 || targetIndex === -1) return

//     const newItems = [...items]
//     const [draggedItemData] = newItems.splice(draggedIndex, 1)
//     newItems.splice(targetIndex, 0, draggedItemData)

//     if (type === "prerequisites") {
//       setPrerequisites(newItems)
//     } else {
//       setObjectives(newItems)
//     }

//     setDraggedItem(null)
//     setDraggedType(null)
//   }

//   const renderEditableItem = (item, type, index) => {
//     const isEmpty = !item.text.trim()
//     const isLongText = item.text.length > 100

//     return (
//       <div
//         key={item.id}
//         className={cn(
//           "group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
//           item.isEditing ? "border-blue-200 bg-blue-50/50" : "border-gray-200 hover:border-gray-300",
//           draggedItem === item.id && "opacity-50",
//           isEmpty && !item.isEditing && "border-red-200 bg-red-50/30",
//         )}
//         draggable={!item.isEditing}
//         onDragStart={(e) => handleDragStart(e, item.id, type)}
//         onDragOver={handleDragOverItem}
//         onDrop={(e) => handleDropItem(e, item.id, type)}
//       >
//         {/* Drag Handle */}
//         <div
//           className={cn(
//             "flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity",
//             item.isEditing && "opacity-0 pointer-events-none",
//           )}
//         >
//           <GripVertical className="h-4 w-4 text-gray-400" />
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           {item.isEditing ? (
//             <div className="space-y-2">
//               {isLongText || item.isNew ? (
//                 <Textarea
//                   ref={(el) => {
//                     inputRefs.current[item.id] = el
//                   }}
//                   value={item.text}
//                   onChange={(e) =>
//                     type === "prerequisites"
//                       ? updatePrerequisite(item.id, e.target.value)
//                       : updateObjective(item.id, e.target.value)
//                   }
//                   onKeyDown={(e) => handleKeyDown(e, item.id, type)}
//                   placeholder={`Enter ${type === "prerequisites" ? "prerequisite" : "objective"} ${index + 1}...`}
//                   className="min-h-[20px] resize-none"
//                   dir={getDirection(item.text)}
//                 />
//               ) : (
//                 <Input
//                   ref={(el) => {
//                     inputRefs.current[item.id] = el
//                   }}
//                   value={item.text}
//                   onChange={(e) =>
//                     type === "prerequisites"
//                       ? updatePrerequisite(item.id, e.target.value)
//                       : updateObjective(item.id, e.target.value)
//                   }
//                   onKeyDown={(e) => handleKeyDown(e, item.id, type)}
//                   placeholder={`Enter ${type === "prerequisites" ? "prerequisite" : "objective"} ${index + 1}...`}
//                   dir={getDirection(item.text)}
//                 />
//               )}
//               <div className="flex items-center gap-2 text-xs text-gray-500">
//                 <span>Press Enter to save, Esc to cancel</span>
//                 {item.text.length > 0 && (
//                   <Badge variant="secondary" className="text-xs">
//                     {item.text.length} chars
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-1">
//               <p
//                 className={cn("text-sm leading-relaxed", isEmpty && "text-red-500 italic")}
//                 dir={getDirection(item.text)}
//               >
//                 {item.text || `Empty ${type === "prerequisites" ? "prerequisite" : "objective"}`}
//               </p>
//               {isEmpty && (
//                 <div className="flex items-center gap-1 text-xs text-red-500">
//                   <AlertCircle className="h-3 w-3" />
//                   <span>This item is empty</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex-shrink-0 flex items-center gap-1">
//           {item.isEditing ? (
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={() => saveItem(item.id, type)}
//               className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
//             >
//               <Save className="h-4 w-4" />
//             </Button>
//           ) : (
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={() => toggleEdit(item.id, type)}
//               className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <Edit3 className="h-4 w-4" />
//             </Button>
//           )}
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             onClick={() => removeItem(item.id, type)}
//             className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Restriction Message */}
//         {restrictionMessage && (
//           <Alert className="m-6 mb-0" variant="destructive">
//             <InfoIcon className="h-4 w-4" />
//             <AlertDescription>{restrictionMessage}</AlertDescription>
//           </Alert>
//         )}

//         <form className="p-6 space-y-6" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
//                   <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//                   Course Title
//                 </Label>
//                 <Input
//                   id="title"
//                   type="text"
//                   value={title}
//                   dir={getDirection(title)}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter course title"
//                   disabled={!hasEducationalDetails}
//                 />
//               </div>

//               {/* Educational Level Filter */}
//               {hasEducationalDetails && validEducationalLevels.length > 1 && (
//                 <div>
//                   <Label htmlFor="level" className="text-lg font-semibold text-gray-700">
//                     Educational Level
//                   </Label>
//                   <select
//                     id="level"
//                     value={level}
//                     onChange={(event) => setLevel(event.target.value)}
//                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
//                   >
//                     <option value="">All authorized levels</option>
//                     {validEducationalLevels.map((levelOption) => (
//                       <option key={levelOption} value={levelOption}>
//                         {levelOption}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Stream Filter */}
//               {hasEducationalDetails && validStreams.length > 0 && (
//                 <div>
//                   <Label htmlFor="stream" className="text-lg font-semibold text-gray-700">
//                     Stream
//                   </Label>
//                   <select
//                     id="stream"
//                     value={stream}
//                     onChange={(event) => setStream(event.target.value)}
//                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
//                   >
//                     <option value="">All streams</option>
//                     {validStreams.map((streamOption) => (
//                       <option key={streamOption} value={streamOption}>
//                         {streamOption}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <div>
//                 <Label htmlFor="subject" className="text-lg font-semibold text-gray-700">
//                   Subject
//                 </Label>
//                 <select
//                   id="subject"
//                   value={subject}
//                   onChange={(event) => setSubject(event.target.value)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
//                   disabled={!hasEducationalDetails || filteredSubjects.length === 0}
//                 >
//                   <option value="">
//                     {!hasEducationalDetails
//                       ? "No educational details assigned"
//                       : filteredSubjects.length === 0
//                         ? "No subjects available"
//                         : "Select a subject"}
//                   </option>
//                   {filteredSubjects.map((subject) => (
//                     <option key={subject._id} value={subject._id}>
//                       {subject.title} ({subject.educationalLevel})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <Label className="text-lg font-semibold text-gray-700">Visibility</Label>
//                 <div className="mt-2 space-x-4">
//                   <Label className="inline-flex items-center">
//                     <Input
//                       type="radio"
//                       className="size-6"
//                       name="visibility"
//                       value="true"
//                       checked={published === true}
//                       onChange={() => setPublished(true)}
//                       disabled={!hasEducationalDetails}
//                     />
//                     <span className="ml-2 text-gray-700">
//                       <EyeIcon className="inline-block mr-1 h-5 w-5" />
//                       Public
//                     </span>
//                   </Label>
//                   <Label className="inline-flex items-center">
//                     <Input
//                       type="radio"
//                       className="size-6"
//                       name="visibility"
//                       value="false"
//                       checked={published === false}
//                       onChange={() => setPublished(false)}
//                       disabled={!hasEducationalDetails}
//                     />
//                     <span className="ml-2 text-gray-700">
//                       <EyeOffIcon className="inline-block mr-1 h-5 w-5" />
//                       Private
//                     </span>
//                   </Label>
//                 </div>
//               </div>
//             </div>
//             {/* Right Column */}
//             <div className="space-y-4">
//               <Label htmlFor="file-upload" className="text-lg font-semibold text-gray-700">
//                 Select Thumbnail
//               </Label>
//               <div
//                 className={`border-2 border-dashed rounded-lg p-4 text-center ${
//                   hasThumbnail
//                     ? "hidden"
//                     : !hasEducationalDetails
//                       ? "border-gray-200 bg-gray-50"
//                       : "border-gray-300 hover:border-blue-500 transition-colors duration-300"
//                 }`}
//                 onDragOver={hasEducationalDetails ? handleDragOver : undefined}
//                 onDrop={hasEducationalDetails ? handleDrop : undefined}
//               >
//                 <div>
//                   <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-1 text-sm text-gray-600">
//                     {hasEducationalDetails
//                       ? "Drag and drop your image here, or click to select"
//                       : "Thumbnail upload disabled"}
//                   </p>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     className="sr-only"
//                     onChange={handleThumbnailChange}
//                     accept="image/*"
//                     disabled={!hasEducationalDetails}
//                   />
//                   <Button
//                     type="button"
//                     onClick={() => document.getElementById("file-upload").click()}
//                     className="mt-2"
//                     disabled={!hasEducationalDetails}
//                   >
//                     Select Thumbnail
//                   </Button>
//                 </div>
//               </div>
//               {thumbnailPreviewUrl && (
//                 <div className="relative">
//                   <img
//                     src={thumbnailPreviewUrl || "/placeholder.svg"}
//                     alt="Thumbnail Preview"
//                     className="w-full h-80 rounded-lg shadow-md object-cover"
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     className="absolute top-2 right-2 bg-white/90 hover:bg-white"
//                     onClick={() => {
//                       setThumbnailPreviewUrl(null)
//                       setHasThumbnail(false)
//                       setThumbnail(null)
//                     }}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
//               <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//               Description
//             </Label>
//             <Textarea
//               id="description"
//               value={description}
//               dir={getDirection(description)}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter course description"
//               className="min-h-[100px]"
//               disabled={!hasEducationalDetails}
//             />
//           </div>

//           {/* Enhanced Prerequisites Section */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label className="flex items-center gap-2">
//                 <CheckCircle2 className="h-5 w-5 text-blue-600" />
//                 <div>
//                   <h3 className="text-lg font-semibold">Prerequisites</h3>
//                   <p className="text-sm text-gray-500 font-normal">
//                     What knowledge or skills are required before starting?
//                   </p>
//                 </div>
//               </Label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addPrerequisite}
//                 className="flex items-center gap-2 bg-transparent"
//                 disabled={!hasEducationalDetails}
//               >
//                 <Plus className="h-4 w-4" />
//                 Add
//               </Button>
//             </div>
//             {prerequisites.length === 0 ? (
//               <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
//                 <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                 <p className="text-sm">No prerequisites added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {hasEducationalDetails ? 'Click "Add" to get started' : "Educational details required"}
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {prerequisites.map((item, index) => renderEditableItem(item, "prerequisites", index))}
//               </div>
//             )}
//             {prerequisites.length > 0 && (
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                   <Badge variant="secondary">
//                     {prerequisites.length} prerequisite{prerequisites.length !== 1 ? "s" : ""}
//                   </Badge>
//                   <span>•</span>
//                   <span>Drag to reorder</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Separator />

//           {/* Enhanced Objectives Section */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label className="flex items-center gap-2">
//                 <Target className="h-5 w-5 text-blue-600" />
//                 <div>
//                   <h3 className="text-lg font-semibold">Objectives</h3>
//                   <p className="text-sm text-gray-500 font-normal">What will learners achieve by the end?</p>
//                 </div>
//               </Label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addObjective}
//                 className="flex items-center gap-2 bg-transparent"
//                 disabled={!hasEducationalDetails}
//               >
//                 <Plus className="h-4 w-4" />
//                 Add
//               </Button>
//             </div>
//             {objectives.length === 0 ? (
//               <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
//                 <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                 <p className="text-sm">No objectives added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {hasEducationalDetails ? 'Click "Add" to get started' : "Educational details required"}
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {objectives.map((item, index) => renderEditableItem(item, "objectives", index))}
//               </div>
//             )}
//             {objectives.length > 0 && (
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                   <Badge variant="secondary">
//                     {objectives.length} objective{objectives.length !== 1 ? "s" : ""}
//                   </Badge>
//                   <span>•</span>
//                   <span>Drag to reorder</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Button
//             type="submit"
//             disabled={loading || !hasEducationalDetails || availableSubjects.length === 0}
//             className="w-full px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {loading
//               ? "Creating..."
//               : !hasEducationalDetails
//                 ? "Educational Details Required"
//                 : availableSubjects.length === 0
//                   ? "No Subjects Available"
//                   : "Create Course"}
//           </Button>
//         </form>

//         {message && (
//           <div
//             className={`p-4 ${
//               message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
//             } rounded-b-lg`}
//           >
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CreateCourseForm



import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createCourse } from "@/store/courseSlice"
import { fetchSubjects } from "@/store/subjectSlice"
import { loggedUser } from "../../../store/authSlice"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import { Badge } from "../../ui/badge"
import { Alert, AlertDescription } from "../../ui/alert"
import {
  UploadCloudIcon,
  BookOpenIcon,
  EyeIcon,
  EyeOffIcon,
  Plus,
  CheckCircle2,
  X,
  Target,
  GripVertical,
  Edit3,
  Save,
  AlertCircle,
  Lightbulb,
  InfoIcon,
} from "lucide-react"
import { Separator } from "../../ui/separator"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

// Translation object for static text
const translations = {
  ltr_fr: {
    // French translations for LTR
    courseTitle: "Titre du cours",
    educationalLevel: "Niveau éducatif",
    allAuthorizedLevels: "Tous les niveaux autorisés",
    stream: "Filière",
    allStreams: "Toutes les filières",
    subject: "Matière",
    noEducationalDetails: "Aucun détail éducatif assigné",
    noSubjectsAvailable: "Aucune matière disponible",
    selectSubject: "Sélectionner une matière",
    visibility: "Visibilité",
    public: "Public",
    private: "Privé",
    selectThumbnail: "Sélectionner une miniature",
    thumbnailUploadDisabled: "Téléchargement de miniature désactivé",
    dragDropImage: "Glissez-déposez votre image ici, ou cliquez pour sélectionner",
    description: "Description",
    enterCourseDescription: "Entrez la description du cours",
    prerequisites: "Prérequis",
    prerequisitesSubtitle: "Quelles connaissances ou compétences sont requises avant de commencer ?",
    noPrerequisites: "Aucun prérequis ajouté pour le moment",
    add: "Ajouter",
    objectives: "Objectifs",
    objectivesSubtitle: "Que vont atteindre les apprenants à la fin ?",
    noObjectives: "Aucun objectif ajouté pour le moment",
    getStarted: "Cliquez sur 'Ajouter' pour commencer",
    educationalDetailsRequired: "Détails éducatifs requis",
    dragToReorder: "Glisser pour réorganiser",
    pressEnterToSave: "Appuyez sur Entrée pour enregistrer, Échap pour annuler",
    thisItemIsEmpty: "Cet élément est vide",
    restrictionMessage: (discipline, levels) =>
      `Aucune matière disponible pour votre discipline (${discipline}) dans les niveaux éducatifs assignés. Vos niveaux assignés : ${levels}`,
    noEducationalDetailsMessage:
      "Vous n'avez pas de détails éducatifs assignés. Veuillez contacter un administrateur pour assigner vos niveaux d'enseignement avant de créer des cours.",
    creating: "Création en cours...",
    createCourse: "Créer le cours",
    noSubjectsAvailableButton: "Aucune matière disponible",
    educationalDetailsRequiredButton: "Détails éducatifs requis",
    disciplineMessage: (discipline) => `Votre discipline : ${discipline}`,
    enterPrerequisite: (index) => `Entrez le prérequis ${index}...`,
    enterObjective: (index) => `Entrez l'objectif ${index}...`,
    emptyPrerequisite: "Prérequis vide",
    emptyObjective: "Objectif vide",
    chars: "caractères",
  },
  rtl: {
    // Arabic translations for RTL
    courseTitle: "عنوان الدورة",
    educationalLevel: "المستوى التعليمي",
    allAuthorizedLevels: "جميع المستويات المصرح بها",
    stream: "التيار",
    allStreams: "جميع التيارات",
    subject: "المادة",
    noEducationalDetails: "لم يتم تعيين تفاصيل تعليمية",
    noSubjectsAvailable: "لا توجد مواد متاحة",
    selectSubject: "اختر مادة",
    visibility: "الرؤية",
    public: "عام",
    private: "خاص",
    selectThumbnail: "اختر الصورة المصغرة",
    thumbnailUploadDisabled: "تحميل الصورة المصغرة معطل",
    dragDropImage: "اسحب وأفلت صورتك هنا، أو انقر للاختيار",
    description: "الوصف",
    enterCourseDescription: "أدخل وصف الدورة",
    prerequisites: "المتطلبات الأساسية",
    prerequisitesSubtitle: "ما هي المعرفة أو المهارات المطلوبة قبل البدء؟",
    noPrerequisites: "لم يتم إضافة متطلبات أساسية بعد",
    add: "إضافة",
    objectives: "الأهداف",
    objectivesSubtitle: "ماذا سيحقق المتعلمون بنهاية الدورة؟",
    noObjectives: "لم يتم إضافة أهداف بعد",
    getStarted: "انقر 'إضافة' للبدء",
    educationalDetailsRequired: "التفاصيل التعليمية مطلوبة",
    dragToReorder: "اسحب لإعادة الترتيب",
    pressEnterToSave: "اضغط Enter لحفظ، Esc للإلغاء",
    thisItemIsEmpty: "هذا العنصر فارغ",
    restrictionMessage: (discipline, levels) =>
      `لا توجد مواد متاحة لتخصصك (${discipline}) ضمن المستويات التعليمية المعينة. المستويات المعينة: ${levels}`,
    noEducationalDetailsMessage:
      "لم يتم تعيين تفاصيل تعليمية لك. يرجى التواصل مع المسؤول لتعيين مستويات التدريس الخاصة بك قبل إنشاء الدورات.",
    creating: "جارٍ الإنشاء...",
    createCourse: "إنشاء الدورة",
    noSubjectsAvailableButton: "لا توجد مواد متاحة",
    educationalDetailsRequiredButton: "التفاصيل التعليمية مطلوبة",
    disciplineMessage: (discipline) => `تخصصك: ${discipline}`,
    enterPrerequisite: (index) => `أدخل المتطلب ${index}...`,
    enterObjective: (index) => `أدخل الهدف ${index}...`,
    emptyPrerequisite: "متطلب فارغ",
    emptyObjective: "هدف فارغ",
    chars: "حرف",
  },
}

function CreateCourseForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const subjects = useSelector((state) => state.subjects.entities)
  const teacher = useSelector(loggedUser)

  // Original form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [published, setPublished] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null)
  const [hasThumbnail, setHasThumbnail] = useState(false)
  const [level, setLevel] = useState("")
  const [stream, setStream] = useState("")
  const [filteredSubjects, setFilteredSubjects] = useState([])
  const [validEducationalLevels, setValidEducationalLevels] = useState([])
  const [validStreams, setValidStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  // New state for educational restrictions
  const [hasEducationalDetails, setHasEducationalDetails] = useState(false)
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [restrictionMessage, setRestrictionMessage] = useState("")

  // Enhanced prerequisites and objectives state
  const [prerequisites, setPrerequisites] = useState([])
  const [objectives, setObjectives] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedType, setDraggedType] = useState(null)
  const inputRefs = useRef({})

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
    return rtlChars.test(text) ? "rtl" : "ltr"
  }

  // Determine direction and translation key based on teacher.discipline
  const disciplineDirection = teacher?.discipline ? getDirection(teacher.discipline) : "ltr"
  const translationKey = disciplineDirection === "rtl" ? "rtl" : "ltr_fr"
  const t = translations[translationKey]

  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  useEffect(() => {
    dispatch(fetchSubjects()).then(() => setLoading(false))
  }, [dispatch])

  // Check teacher's educational details and filter subjects accordingly
  useEffect(() => {
    if (!teacher) return

    const teacherCycles = teacher.educationalCycles || []
    const teacherLevels = teacher.educationalLevels || []

    // Check if teacher has assigned educational details
    const hasDetails = teacherCycles.length > 0 && teacherLevels.length > 0
    setHasEducationalDetails(hasDetails)

    if (!hasDetails) {
      setRestrictionMessage(t.noEducationalDetailsMessage)
      setAvailableSubjects([])
      setFilteredSubjects([])
      return
    }

    // Filter subjects based on teacher's discipline AND assigned educational details
    const matchingSubjects = subjects.filter((subject) => {
      // Must match teacher's discipline
      const matchesDiscipline = subject.title.startsWith(teacher.discipline)
      // Must match at least one of teacher's assigned cycles
      const matchesCycle = teacherCycles.includes(subject.educationalCycle)
      // Must match at least one of teacher's assigned levels
      const matchesLevel = teacherLevels.includes(subject.educationalLevel)
      return matchesDiscipline && matchesCycle && matchesLevel
    })

    setAvailableSubjects(matchingSubjects)

    if (matchingSubjects.length === 0) {
      setRestrictionMessage(t.restrictionMessage(teacher.discipline, teacherLevels.join(", ")))
    } else {
      setRestrictionMessage("")
    }

    // Set valid levels and streams based on teacher's assignments
    setValidEducationalLevels(teacherLevels)
    const teacherStreams = [...new Set(matchingSubjects.map((subject) => subject.stream).filter(Boolean))]
    setValidStreams(teacherStreams)
  }, [subjects, teacher, t])

  // Filter available subjects based on selected level and stream
  useEffect(() => {
    if (!hasEducationalDetails) {
      setFilteredSubjects([])
      return
    }

    const filtered = availableSubjects.filter(
      (subject) => (level ? subject.educationalLevel === level : true) && (stream ? subject.stream === stream : true),
    )
    setFilteredSubjects(filtered)
  }, [availableSubjects, level, stream, hasEducationalDetails])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Additional validation for educational restrictions
    if (!hasEducationalDetails) {
      setMessage(t.noEducationalDetailsMessage)
      return
    }
    if (availableSubjects.length === 0) {
      setMessage(t.restrictionMessage(teacher.discipline, validEducationalLevels.join(", ")))
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)

    // Convert enhanced format to array of strings (matching schema)
    const prereqArray = prerequisites.map((item) => item.text.trim()).filter((text) => text.length > 0)
    const objArray = objectives.map((item) => item.text.trim()).filter((text) => text.length > 0)

    // Send as JSON strings since FormData doesn't handle arrays well
    formData.append("prerequisites", JSON.stringify(prereqArray))
    formData.append("objectives", JSON.stringify(objArray))
    formData.append("subject", subject)
    formData.append("published", published)
    formData.append("thumbnail", thumbnail)
    formData.append("teacher", teacher.id)

    try {
      await dispatch(createCourse(formData)).unwrap()
      setMessage(t.courseCreatedSuccessfully || "Course created successfully!")
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    } catch (error) {
      if (error.response) {
        setMessage(`${t.errorCreatingCourse || "Error creating Course"}: ${error.response.data.error}`)
      } else {
        setMessage(`${t.errorCreatingCourse || "Error creating Course"}: ${error.message}`)
      }
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const selectedFile = event.dataTransfer.files[0]
    setThumbnail(selectedFile)
    setThumbnailPreviewUrl(URL.createObjectURL(selectedFile))
    setHasThumbnail(true)
  }

  const handleThumbnailChange = (event) => {
    const selectedFile = event.target.files[0]
    setThumbnail(selectedFile)
    setThumbnailPreviewUrl(URL.createObjectURL(selectedFile))
    setHasThumbnail(true)
  }

  // Enhanced prerequisites and objectives functions
  const addPrerequisite = () => {
    const newItem = {
      id: generateId(),
      text: "",
      isEditing: true,
      isNew: true,
    }
    setPrerequisites((prev) => [...prev, newItem])
    setTimeout(() => {
      const input = inputRefs.current[newItem.id]
      if (input) input.focus()
    }, 100)
  }

  const addObjective = () => {
    const newItem = {
      id: generateId(),
      text: "",
      isEditing: true,
      isNew: true,
    }
    setObjectives((prev) => [...prev, newItem])
    setTimeout(() => {
      const input = inputRefs.current[newItem.id]
      if (input) input.focus()
    }, 100)
  }

  const updatePrerequisite = (id, text) => {
    setPrerequisites((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const updateObjective = (id, text) => {
    setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const toggleEdit = (id, type) => {
    if (type === "prerequisites") {
      setPrerequisites((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing, isNew: false } : item)),
      )
    } else {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing, isNew: false } : item)),
      )
    }
    setTimeout(() => {
      const input = inputRefs.current[id]
      if (input) input.focus()
    }, 100)
  }

  const saveItem = (id, type) => {
    if (type === "prerequisites") {
      setPrerequisites((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEditing: false, isNew: false } : item)),
      )
    } else {
      setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false, isNew: false } : item)))
    }
  }

  const removeItem = (id, type) => {
    if (type === "prerequisites") {
      setPrerequisites((prev) => prev.filter((item) => item.id !== id))
    } else {
      setObjectives((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleKeyDown = (e, id, type) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveItem(id, type)
    } else if (e.key === "Escape") {
      const items = type === "prerequisites" ? prerequisites : objectives
      const item = items.find((i) => i.id === id)
      if (item?.isNew && !item.text.trim()) {
        removeItem(id, type)
      } else {
        if (type === "prerequisites") {
          setPrerequisites((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
        } else {
          setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
        }
      }
    }
  }

  const handleDragStart = (e, id, type) => {
    setDraggedItem(id)
    setDraggedType(type)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOverItem = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDropItem = (e, targetId, type) => {
    e.preventDefault()
    if (!draggedItem || draggedType !== type) return

    const items = type === "prerequisites" ? prerequisites : objectives
    const draggedIndex = items.findIndex((item) => item.id === draggedItem)
    const targetIndex = items.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newItems = [...items]
    const [draggedItemData] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItemData)

    if (type === "prerequisites") {
      setPrerequisites(newItems)
    } else {
      setObjectives(newItems)
    }
    setDraggedItem(null)
    setDraggedType(null)
  }

  const renderEditableItem = (item, type, index) => {
    const isEmpty = !item.text.trim()
    const isLongText = item.text.length > 100
    return (
      <div
        key={item.id}
        className={cn(
          "group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
          item.isEditing ? "border-blue-200 bg-blue-50/50" : "border-gray-200 hover:border-gray-300",
          draggedItem === item.id && "opacity-50",
          isEmpty && !item.isEditing && "border-red-200 bg-red-50/30",
          disciplineDirection === "rtl" && "flex-row-reverse", // Apply flex-row-reverse for RTL
        )}
        draggable={!item.isEditing}
        onDragStart={(e) => handleDragStart(e, item.id, type)}
        onDragOver={handleDragOverItem}
        onDrop={(e) => handleDropItem(e, item.id, type)}
      >
        {/* Drag Handle */}
        <div
          className={cn(
            "flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity",
            item.isEditing && "opacity-0 pointer-events-none",
          )}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0">
          {item.isEditing ? (
            <div className="space-y-2">
              {isLongText || item.isNew ? (
                <Textarea
                  ref={(el) => {
                    inputRefs.current[item.id] = el
                  }}
                  value={item.text}
                  onChange={(e) =>
                    type === "prerequisites"
                      ? updatePrerequisite(item.id, e.target.value)
                      : updateObjective(item.id, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, item.id, type)}
                  placeholder={t[`enter${type === "prerequisites" ? "Prerequisite" : "Objective"}`](index + 1)}
                  className="min-h-[20px] resize-none"
                  dir={disciplineDirection}
                />
              ) : (
                <Input
                  ref={(el) => {
                    inputRefs.current[item.id] = el
                  }}
                  value={item.text}
                  onChange={(e) =>
                    type === "prerequisites"
                      ? updatePrerequisite(item.id, e.target.value)
                      : updateObjective(item.id, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, item.id, type)}
                  placeholder={t[`enter${type === "prerequisites" ? "Prerequisite" : "Objective"}`](index + 1)}
                  dir={disciplineDirection}
                />
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500" dir={disciplineDirection}>
                <span>{t.pressEnterToSave}</span>
                {item.text.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {item.text.length} {t.chars}
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className={cn("text-sm leading-relaxed", isEmpty && "text-red-500 italic")} dir={disciplineDirection}>
                {item.text || t[`empty${type === "prerequisites" ? "Prerequisite" : "Objective"}`]}
              </p>
              {isEmpty && (
                <div className="flex items-center gap-1 text-xs text-red-500" dir={disciplineDirection}>
                  <AlertCircle className="h-3 w-3" />
                  <span>{t.thisItemIsEmpty}</span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Actions */}
        <div className={cn("flex-shrink-0 flex items-center gap-1")}>
          {item.isEditing ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => saveItem(item.id, type)}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Save className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toggleEdit(item.id, type)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id, type)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Restriction Message */}
        {restrictionMessage && (
          <Alert className="m-6 mb-0" variant="destructive">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription dir={disciplineDirection}>{restrictionMessage}</AlertDescription>
          </Alert>
        )}
        <form className="p-6 space-y-6" onSubmit={handleSubmit} dir={disciplineDirection}>
          {" "}
          {/* Apply dir here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
                  {" "}
                  {/* dir already on parent form */}
                  <BookOpenIcon
                    className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t.courseTitle}
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  dir={disciplineDirection}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.enterCourseTitle || t.courseTitle}
                  disabled={!hasEducationalDetails}
                />
              </div>
              {/* Educational Level Filter */}
              {hasEducationalDetails && validEducationalLevels.length > 1 && (
                <div>
                  <Label htmlFor="level" className="text-lg font-semibold text-gray-700">
                    {" "}
                    {/* dir already on parent form */}
                    {t.educationalLevel}
                  </Label>
                  <select
                    id="level"
                    value={level}
                    onChange={(event) => setLevel(event.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    dir={disciplineDirection}
                  >
                    <option value="">{t.allAuthorizedLevels}</option>
                    {validEducationalLevels.map((levelOption) => (
                      <option key={levelOption} value={levelOption}>
                        {levelOption}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Stream Filter */}
              {hasEducationalDetails && validStreams.length > 0 && (
                <div>
                  <Label htmlFor="stream" className="text-lg font-semibold text-gray-700">
                    {" "}
                    {/* dir already on parent form */}
                    {t.stream}
                  </Label>
                  <select
                    id="stream"
                    value={stream}
                    onChange={(event) => setStream(event.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    dir={disciplineDirection}
                  >
                    <option value="">{t.allStreams}</option>
                    {validStreams.map((streamOption) => (
                      <option key={streamOption} value={streamOption}>
                        {streamOption}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <Label htmlFor="subject" className="text-lg font-semibold text-gray-700">
                  {" "}
                  {/* dir already on parent form */}
                  {t.subject}
                </Label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-200"
                  disabled={!hasEducationalDetails || filteredSubjects.length === 0}
                  dir={disciplineDirection}
                >
                  <option value="">
                    {!hasEducationalDetails
                      ? t.noEducationalDetails
                      : filteredSubjects.length === 0
                        ? t.noSubjectsAvailable
                        : t.selectSubject}
                  </option>
                  {filteredSubjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.title} ({subject.educationalLevel})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-lg font-semibold text-gray-700">
                  {" "}
                  {/* dir already on parent form */}
                  {t.visibility}
                </Label>
                <div
                  className={cn(
                    "mt-2 flex",
                    disciplineDirection === "rtl" ? "flex-row-reverse space-x-reverse" : "space-x-4",
                  )}
                >
                  {" "}
                  {/* Adjust spacing for RTL */}
                  <Label className="inline-flex items-center">
                    <Input
                      type="radio"
                      className="size-6"
                      name="visibility"
                      value="true"
                      checked={published === true}
                      onChange={() => setPublished(true)}
                      disabled={!hasEducationalDetails}
                    />
                    <span className={cn("text-gray-700", disciplineDirection === "rtl" ? "mr-2" : "ml-2")}>
                      {" "}
                      {/* Adjust margin for RTL */}
                      <EyeIcon
                        className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-1" : "mr-1")}
                      />{" "}
                      {/* Adjust icon margin */}
                      {t.public}
                    </span>
                  </Label>
                  <Label className="inline-flex items-center">
                    <Input
                      type="radio"
                      className="size-6"
                      name="visibility"
                      value="false"
                      checked={published === false}
                      onChange={() => setPublished(false)}
                      disabled={!hasEducationalDetails}
                    />
                    <span className={cn("text-gray-700", disciplineDirection === "rtl" ? "mr-2" : "ml-2")}>
                      {" "}
                      {/* Adjust margin for RTL */}
                      <EyeOffIcon
                        className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-1" : "mr-1")}
                      />{" "}
                      {/* Adjust icon margin */}
                      {t.private}
                    </span>
                  </Label>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <Label htmlFor="file-upload" className="text-lg font-semibold text-gray-700">
                {" "}
                {/* dir already on parent form */}
                {t.selectThumbnail}
              </Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center",
                  hasThumbnail
                    ? "hidden"
                    : !hasEducationalDetails
                      ? "border-gray-200 bg-gray-50"
                      : "border-gray-300 hover:border-blue-500 transition-colors duration-300",
                )}
                onDragOver={hasEducationalDetails ? handleDragOver : undefined}
                onDrop={hasEducationalDetails ? handleDrop : undefined}
              >
                <div>
                  <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600" dir={disciplineDirection}>
                    {hasEducationalDetails ? t.dragDropImage : t.thumbnailUploadDisabled}
                  </p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleThumbnailChange}
                    accept="image/*"
                    disabled={!hasEducationalDetails}
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById("file-upload").click()}
                    className="mt-2"
                    disabled={!hasEducationalDetails}
                  >
                    {t.selectThumbnail}
                  </Button>
                </div>
              </div>
              {thumbnailPreviewUrl && (
                <div className="relative">
                  <img
                    src={thumbnailPreviewUrl || "/placeholder.svg"}
                    alt="Thumbnail Preview"
                    className="w-full h-80 rounded-lg shadow-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "absolute top-2 bg-white/90 hover:bg-white",
                      disciplineDirection === "rtl" ? "left-2" : "right-2", // Adjust position for RTL
                    )}
                    onClick={() => {
                      setThumbnailPreviewUrl(null)
                      setHasThumbnail(false)
                      setThumbnail(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
              {" "}
              {/* dir already on parent form */}
              <BookOpenIcon className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")} />{" "}
              {/* Adjust icon margin */}
              {t.description}
            </Label>
            <Textarea
              id="description"
              value={description}
              dir={disciplineDirection}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.enterCourseDescription}
              className="min-h-[100px]"
              disabled={!hasEducationalDetails}
            />
          </div>
          {/* Enhanced Prerequisites Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                {" "}
                {/* dir already on parent form */}
                <CheckCircle2
                  className={cn("h-5 w-5 text-blue-600", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
                />{" "}
                {/* Adjust icon margin */}
                <div>
                  <h3 className="text-lg font-semibold">{t.prerequisites}</h3>
                  <p className="text-sm text-gray-500 font-normal">{t.prerequisitesSubtitle}</p>
                </div>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPrerequisite}
                className={cn(
                  "flex items-center gap-2 bg-transparent",
                  disciplineDirection === "rtl" ? "flex-row-reverse" : "",
                )} // Reverse button content for RTL
                disabled={!hasEducationalDetails}
              >
                <Plus className={cn("h-4 w-4", disciplineDirection === "rtl" ? "ml-2" : "mr-2")} />{" "}
                {/* Adjust icon margin */}
                {t.add}
              </Button>
            </div>
            {prerequisites.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm" dir={disciplineDirection}>
                  {t.noPrerequisites}
                </p>
                <p className="text-xs text-gray-400 mt-1" dir={disciplineDirection}>
                  {hasEducationalDetails ? t.getStarted : t.educationalDetailsRequired}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {prerequisites.map((item, index) => renderEditableItem(item, "prerequisites", index))}
              </div>
            )}
            {prerequisites.length > 0 && (
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs text-gray-500",
                    disciplineDirection === "rtl" ? "flex-row-reverse" : "",
                  )}
                >
                  {" "}
                  {/* Reverse for RTL */}
                  <Badge variant="secondary">
                    {prerequisites.length} {t.prerequisites.toLowerCase()}
                    {prerequisites.length !== 1 ? (disciplineDirection === "rtl" ? "ات" : "s") : ""}
                  </Badge>
                  <span>•</span>
                  <span dir={disciplineDirection}>{t.dragToReorder}</span>
                </div>
              </div>
            )}
          </div>
          <Separator />
          {/* Enhanced Objectives Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                {" "}
                {/* dir already on parent form */}
                <Target className={cn("h-5 w-5 text-blue-600", disciplineDirection === "rtl" ? "ml-2" : "mr-2")} />{" "}
                {/* Adjust icon margin */}
                <div>
                  <h3 className="text-lg font-semibold">{t.objectives}</h3>
                  <p className="text-sm text-gray-500 font-normal">{t.objectivesSubtitle}</p>
                </div>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addObjective}
                className={cn(
                  "flex items-center gap-2 bg-transparent",
                  disciplineDirection === "rtl" ? "flex-row-reverse" : "",
                )} // Reverse button content for RTL
                disabled={!hasEducationalDetails}
              >
                <Plus className={cn("h-4 w-4", disciplineDirection === "rtl" ? "ml-2" : "mr-2")} />{" "}
                {/* Adjust icon margin */}
                {t.add}
              </Button>
            </div>
            {objectives.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm" dir={disciplineDirection}>
                  {t.noObjectives}
                </p>
                <p className="text-xs text-gray-400 mt-1" dir={disciplineDirection}>
                  {hasEducationalDetails ? t.getStarted : t.educationalDetailsRequired}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {objectives.map((item, index) => renderEditableItem(item, "objectives", index))}
              </div>
            )}
            {objectives.length > 0 && (
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs text-gray-500",
                    disciplineDirection === "rtl" ? "flex-row-reverse" : "",
                  )}
                >
                  {" "}
                  {/* Reverse for RTL */}
                  <Badge variant="secondary">
                    {objectives.length} {t.objectives.toLowerCase()}
                    {objectives.length !== 1 ? (disciplineDirection === "rtl" ? "ات" : "s") : ""}
                  </Badge>
                  <span>•</span>
                  <span dir={disciplineDirection}>{t.dragToReorder}</span>
                </div>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || !hasEducationalDetails || availableSubjects.length === 0}
            className="w-full px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? t.creating
              : !hasEducationalDetails
                ? t.educationalDetailsRequiredButton
                : availableSubjects.length === 0
                  ? t.noSubjectsAvailableButton
                  : t.createCourse}
          </Button>
        </form>
        {message && (
          <div
            className={cn(
              "p-4 rounded-b-lg",
              message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
            )}
            dir={disciplineDirection}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateCourseForm
