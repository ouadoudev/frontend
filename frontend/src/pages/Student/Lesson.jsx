// import { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchLesson, fetchRelatedLessons } from "../../store/lessonSlice";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { updateProgress } from "@/store/courseProgressSlice";
// import { fetchLessonQuestions } from "@/store/questionSlice";
// import DiscussionForum from "@/components/DiscussionForum";
// import QuizComponent from "@/components/dashboard/quiz/QuizComponent";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import katex from "katex";
// import "katex/dist/katex.min.css";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { BookOpenCheck, BrainCircuit, Download } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
// window.katex = katex;

// const Lesson = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { lesson, relatedLessons, error, status } = useSelector(
//     (state) => state.lesson
//   );
//   const [numPages, setNumPages] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const videoRef = useRef(null);
//   const [isPiPActive, setIsPiPActive] = useState(false);

//   useEffect(() => {
//     dispatch(fetchLesson(id));
//     dispatch(fetchRelatedLessons(id));
//     dispatch(fetchLessonQuestions(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     const handleScroll = async () => {
//       if (
//         videoRef.current &&
//         !isPiPActive &&
//         videoRef.current.paused === false &&
//         window.scrollY > 200
//       ) {
//         try {
//           await videoRef.current.requestPictureInPicture();
//           setIsPiPActive(true);
//         } catch (error) {
//           console.error("Error entering PiP mode:", error);
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isPiPActive]);

//   const handlePlayLesson = async (lessonId) => {
//     try {
//       setIsPiPActive(false);
//       navigate(`/lessons/${lessonId}`);
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     }
//   };

//   const handleCompleteLesson = async () => {
//     try {
//       await dispatch(
//         updateProgress({ courseId: lesson.course._id, lessonId: id })
//       );
//       alert("Lesson marked as completed!");
//     } catch (error) {
//       console.error("Error updating progress:", error);
//     }
//   };

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = Math.floor(seconds % 60);

//     return [
//       minutes.toString().padStart(2, "0"),
//       secs.toString().padStart(2, "0"),
//     ].join(":");
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const handleDownload = async () => {
//     try {
//       const response = await fetch(lesson.pdf.url, {
//         mode: "cors",
//       });

//       if (!response.ok) throw new Error("Failed to fetch the file");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${lesson.title || "lesson"}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (status === "failed") {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 w-full">
//           {lesson && (
//             <Card className="mb-6 border-hidden">
//               <CardHeader className="relative p-0 rounded-md border border-opacity-10 overflow-hidden">
//                 <video
//                   ref={videoRef}
//                   className="w-full max-h-[250px] sm:max-h-[360px] md:max-h-[502px] rounded-md bg-muted object-contain"
//                   controls
//                   controlsList="nodownload"
//                   preload="metadata"
//                   onPlay={() => setIsPiPActive(false)}
//                 >
//                   <source src={lesson.video.url} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </CardHeader>
//               <CardContent className="pt-4">
//                 <h2 className="text-xl sm:text-2xl md:text-3xl text-center font-bold px-2">
//                   {lesson.title}
//                 </h2>

//                 <div className="space-y-2">
//                   {lesson.pdf && lesson.pdf.url ? (
//                     <div className="mt-6 border border-gray-300 rounded-md shadow-sm bg-white">
//                       <ScrollArea className="h-[600px] p-4 bg-gray-50 rounded-md">
//                         <Document
//                           file={lesson.pdf.url}
//                           onLoadSuccess={onDocumentLoadSuccess}
//                           loading={<p>Loading PDF...</p>}
//                           error={<p>Failed to load PDF.</p>}
//                         >
//                           {Array.from(new Array(numPages), (_, index) => (
//                             <Page
//                               key={`page_${index + 1}`}
//                               pageNumber={index + 1}
//                               width={Math.min(window.innerWidth - 48, 800)}
//                             />
//                           ))}
//                         </Document>
//                       </ScrollArea>
//                     </div>
//                   ) : (
//                     <ReactQuill
//                       id="lesson-content"
//                       theme="snow"
//                       value={lesson.content}
//                       readOnly
//                       modules={{ toolbar: false, formula: true }}
//                       formats={[
//                         "header",
//                         "font",
//                         "size",
//                         "bold",
//                         "italic",
//                         "underline",
//                         "strike",
//                         "color",
//                         "background",
//                         "align",
//                         "link",
//                         "image",
//                         "video",
//                         "list",
//                         "bullet",
//                         "formula",
//                         "direction",
//                       ]}
//                       className="mt-6 border border-gray-300 rounded-md shadow-sm bg-white"
//                     />
//                   )}
//                 </div>
//               </CardContent>
//               <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-2 p-4 border-t border-gray-200">
//                 <Button
//                   className="flex items-center gap-2 w-full sm:w-auto justify-center"
//                   variant="outline"
//                   size="sm"
//                   onClick={handleCompleteLesson}
//                 >
//                   <BookOpenCheck className="w-4 h-4" />
//                   Marquer comme terminée
//                 </Button>

//                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex items-center gap-2 w-full sm:w-auto justify-center"
//                     >
//                       <BrainCircuit className="w-4 h-4" />
//                       Lancer le quiz
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <QuizComponent lessonId={id} />
//                   </DialogContent>
//                 </Dialog>

//                 {lesson.pdf?.url && (
//                   <Button
//                     onClick={handleDownload}
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center gap-2 w-full sm:w-auto justify-center"
//                   >
//                     <Download className="w-4 h-4" />
//                     Télécharger le support
//                   </Button>
//                 )}
//               </CardFooter>
//             </Card>
//           )}
//           {lesson && (
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle className="mx-auto">
//                   Poursuivre l’Apprentissage
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {relatedLessons && relatedLessons.length > 0 ? (
//                   <Carousel>
//                     <CarouselContent>
//                       {relatedLessons.map((relatedLesson) => (
//                         <CarouselItem
//                           key={relatedLesson._id}
//                           className="basis-[80%] sm:basis-1/2 md:basis-1/3"
//                         >
//                           <Card className="flex flex-col">
//                             <div className="relative group">
//                               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <Button
//                                   className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl px-4 py-2"
//                                   onClick={() =>
//                                     handlePlayLesson(relatedLesson._id)
//                                   }
//                                 >
//                                   Play
//                                 </Button>
//                               </div>
//                               <CardHeader className="p-0">
//                                 <img
//                                   src={relatedLesson.thumbnail?.url}
//                                   alt={relatedLesson.title}
//                                   className="w-full h-32 object-cover rounded-t-lg"
//                                 />
//                               </CardHeader>
//                             </div>
//                             <CardContent className="flex-grow p-4">
//                               <h3 className="text-sm font-semibold">
//                                 {relatedLesson.title}
//                               </h3>
//                               <span className="text-xs">
//                                 {formatDuration(relatedLesson.video.duration)}{" "}
//                                 min
//                               </span>
//                             </CardContent>
//                           </Card>
//                         </CarouselItem>
//                       ))}
//                     </CarouselContent>
//                   </Carousel>
//                 ) : (
//                   <p className="text-center text-gray-500">
//                     Aucune leçon en relation pour le moment
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <div>
//           {lesson && (
//             <Card className="lg:sticky lg:top-4 h-[560px] lg:h-[680px]">
//               <DiscussionForum lessonId={lesson._id} />
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Lesson;
// import { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchLesson, fetchRelatedLessons } from "../../store/lessonSlice";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { updateProgress } from "@/store/courseProgressSlice";
// import { fetchLessonQuestions } from "@/store/questionSlice";
// import DiscussionForum from "@/components/DiscussionForum";
// import QuizComponent from "@/components/dashboard/quiz/QuizComponent";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import katex from "katex";
// import "katex/dist/katex.min.css";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { BookOpenCheck, BrainCircuit, Download } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
// window.katex = katex;

// const Lesson = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { lesson, relatedLessons, error, status } = useSelector(
//     (state) => state.lesson
//   );
//   const [numPages, setNumPages] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const videoRef = useRef(null);
//   const [isPiPActive, setIsPiPActive] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 1280);

//   useEffect(() => {
//     dispatch(fetchLesson(id));
//     dispatch(fetchRelatedLessons(id));
//     dispatch(fetchLessonQuestions(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     const handleScroll = async () => {
//       if (
//         videoRef.current &&
//         !isPiPActive &&
//         videoRef.current.paused === false &&
//         window.scrollY > 200
//       ) {
//         try {
//           await videoRef.current.requestPictureInPicture();
//           setIsPiPActive(true);
//         } catch (error) {
//           console.error("Error entering PiP mode:", error);
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isPiPActive]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handlePlayLesson = async (lessonId) => {
//     try {
//       setIsPiPActive(false);
//       navigate(`/lessons/${lessonId}`);
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     }
//   };

//   const handleCompleteLesson = async () => {
//     try {
//       await dispatch(
//         updateProgress({ courseId: lesson.course._id, lessonId: id })
//       );
//       alert("Lesson marked as completed!");
//     } catch (error) {
//       console.error("Error updating progress:", error);
//     }
//   };

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = Math.floor(seconds % 60);
//     return [
//       minutes.toString().padStart(2, "0"),
//       secs.toString().padStart(2, "0"),
//     ].join(":");
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const handleDownload = async () => {
//     try {
//       const response = await fetch(lesson.pdf.url, {
//         mode: "cors",
//       });

//       if (!response.ok) throw new Error("Failed to fetch the file");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${lesson.title || "lesson"}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (status === "failed") {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 w-full">
//           {lesson && (
//             <div className="mb-6">
//               <div className="w-full rounded-md overflow-hidden mb-4">
//                 <video
//                   ref={videoRef}
//                   className="w-full max-h-[502px] rounded-md bg-muted"
//                   controls
//                   controlsList="nodownload"
//                   preload="metadata"
//                   onPlay={() => setIsPiPActive(false)}
//                 >
//                   <source src={lesson.video.url} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </div>

//               <Card className="border-hidden">
//                 <CardContent className="pt-4">
//                   <h2 className="text-xl sm:text-2xl md:text-3xl text-center font-bold px-2">
//                     {lesson.title}
//                   </h2>

//                   <div className="space-y-2">
//                     {isMobile ? (
//                       <ReactQuill
//                         theme="snow"
//                         value={lesson.content}
//                         readOnly
//                         modules={{ toolbar: false, formula: true }}
//                         formats={[
//                           "header",
//                           "font",
//                           "size",
//                           "bold",
//                           "italic",
//                           "underline",
//                           "strike",
//                           "color",
//                           "background",
//                           "align",
//                           "link",
//                           "image",
//                           "video",
//                           "list",
//                           "bullet",
//                           "formula",
//                           "direction",
//                         ]}
//                         className="mt-6 border border-gray-300 rounded-md shadow-sm bg-white"
//                       />
//                     ) : lesson.pdf?.url ? (
//                       <div className="mt-6 border border-gray-300 rounded-md shadow-sm bg-white">
//                         <ScrollArea className="h-[600px] p-4 bg-gray-50 rounded-md">
//                           <Document
//                             file={lesson.pdf.url}
//                             onLoadSuccess={onDocumentLoadSuccess}
//                             loading={<p>Loading PDF...</p>}
//                             error={<p>Failed to load PDF.</p>}
//                           >
//                             {Array.from(new Array(numPages), (_, index) => (
//                               <Page
//                                 key={`page_${index + 1}`}
//                                 pageNumber={index + 1}
//                                 width={Math.min(window.innerWidth - 48, 800)}
//                               />
//                             ))}
//                           </Document>
//                         </ScrollArea>
//                       </div>
//                     ) : (
//                       <ReactQuill
//                         theme="snow"
//                         value={lesson.content}
//                         readOnly
//                         modules={{ toolbar: false, formula: true }}
//                         formats={[
//                           "header",
//                           "font",
//                           "size",
//                           "bold",
//                           "italic",
//                           "underline",
//                           "strike",
//                           "color",
//                           "background",
//                           "align",
//                           "link",
//                           "image",
//                           "video",
//                           "list",
//                           "bullet",
//                           "formula",
//                           "direction",
//                         ]}
//                         className="mt-6 border border-gray-300 rounded-md shadow-sm bg-white"
//                       />
//                     )}
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-2 p-4 border-t border-gray-200">
//                   <Button
//                     className="flex items-center gap-2 w-full sm:w-auto justify-center"
//                     variant="outline"
//                     size="sm"
//                     onClick={handleCompleteLesson}
//                   >
//                     <BookOpenCheck className="w-4 h-4" />
//                     Marquer comme terminée
//                   </Button>

//                   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                     <DialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex items-center gap-2 w-full sm:w-auto justify-center"
//                       >
//                         <BrainCircuit className="w-4 h-4" />
//                         Lancer le quiz
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <QuizComponent lessonId={id} />
//                     </DialogContent>
//                   </Dialog>

//                   {lesson.pdf?.url && (
//                     <Button
//                       onClick={handleDownload}
//                       variant="outline"
//                       size="sm"
//                       className="flex items-center gap-2 w-full sm:w-auto justify-center"
//                     >
//                       <Download className="w-4 h-4" />
//                       Télécharger le support
//                     </Button>
//                   )}
//                 </CardFooter>
//               </Card>
//             </div>
//           )}

//           {lesson && (
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle className="mx-auto">
//                   Poursuivre l’Apprentissage
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {relatedLessons && relatedLessons.length > 0 ? (
//                   <Carousel>
//                     <CarouselContent>
//                       {relatedLessons.map((relatedLesson) => (
//                         <CarouselItem
//                           key={relatedLesson._id}
//                           className="basis-[80%] sm:basis-1/2 md:basis-1/3"
//                         >
//                           <Card className="flex flex-col">
//                             <div className="relative group">
//                               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <Button
//                                   className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl px-4 py-2"
//                                   onClick={() =>
//                                     handlePlayLesson(relatedLesson._id)
//                                   }
//                                 >
//                                   Play
//                                 </Button>
//                               </div>
//                               <CardHeader className="p-0">
//                                 <img
//                                   src={relatedLesson.thumbnail?.url}
//                                   alt={relatedLesson.title}
//                                   className="w-full h-32 object-cover rounded-t-lg"
//                                 />
//                               </CardHeader>
//                             </div>
//                             <CardContent className="flex-grow p-4">
//                               <h3 className="text-sm font-semibold">
//                                 {relatedLesson.title}
//                               </h3>
//                               <span className="text-xs">
//                                 {formatDuration(
//                                   relatedLesson.video.duration
//                                 )}{" "}
//                                 min
//                               </span>
//                             </CardContent>
//                           </Card>
//                         </CarouselItem>
//                       ))}
//                     </CarouselContent>
//                   </Carousel>
//                 ) : (
//                   <p className="text-center text-gray-500">
//                     Aucune leçon en relation pour le moment
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <div>
//           {lesson && (
//             <Card className="lg:sticky lg:top-4 h-[560px] lg:h-[680px]">
//               <DiscussionForum lessonId={lesson._id} />
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Lesson;
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchLesson, fetchRelatedLessons } from "../../store/lessonSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateProgress } from "@/store/courseProgressSlice";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { fetchReviews } from "@/store/reviewSlice";
import { fetchLessonQuestions } from "@/store/questionSlice";
import DiscussionForum from "@/components/DiscussionForum";
import QuizComponent from "@/components/QuizComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpenCheck, BrainCircuit, Download } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
window.katex = katex;

const Lesson = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lesson, relatedLessons, error, status } = useSelector(
    (state) => state.lesson
  );
  const [numPages, setNumPages] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const videoRef = useRef(null);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    dispatch(fetchLesson(id));
    dispatch(fetchRelatedLessons(id));
    dispatch(fetchLessonQuestions(id));
    dispatch(fetchReviews({ lessonId: id }));
  }, [dispatch, id]);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        videoRef.current &&
        !isPiPActive &&
        videoRef.current.paused === false &&
        window.scrollY > 200
      ) {
        try {
          await videoRef.current.requestPictureInPicture();
          setIsPiPActive(true);
        } catch (error) {
          console.error("Error entering PiP mode:", error);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPiPActive]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePlayLesson = async (lessonId) => {
    try {
      setIsPiPActive(false);
      await dispatch(fetchReviews({ lessonId }));
      navigate(`/lessons/${lessonId}`);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleCompleteLesson = async () => {
    try {
      await dispatch(
        updateProgress({ courseId: lesson.course._id, lessonId: id })
      );
      alert("Lesson marked as completed!");
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(lesson.pdf.url, {
        mode: "cors",
      });

      if (!response.ok) throw new Error("Failed to fetch the file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${lesson.title || "lesson"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {lesson && (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            <div className="rounded-lg border border-opacity-10 overflow-hidden">
              <video
                ref={videoRef}
                className="w-full max-h-[502px] rounded-md bg-muted"
                controls
                controlsList="nodownload"
                preload="metadata"
                onPlay={() => setIsPiPActive(false)}
              >
                <source src={lesson.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <Card className="bg-gray-100 dark:bg-gray-800 rounded-lg">
              <CardContent className="pt-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl text-center font-bold px-2">
                  {lesson.title}
                </h2>
                <div className="space-y-2 mt-6">
                  {isMobile ? (
                    <ReactQuill
                      theme="snow"
                      value={lesson.content}
                      readOnly
                      modules={{ toolbar: false, formula: true }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "color",
                        "background",
                        "align",
                        "link",
                        "image",
                        "video",
                        "list",
                        "bullet",
                        "formula",
                        "direction",
                      ]}
                      className="border border-gray-300 rounded-md shadow-sm bg-white"
                    />
                  ) : lesson.pdf?.url ? (
                    <div className="border border-gray-300 rounded-md shadow-sm bg-white">
                      <ScrollArea className="h-[600px] p-4 bg-gray-50 rounded-md">
                        <Document
                          file={lesson.pdf.url}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={<p>Loading PDF...</p>}
                          error={<p>Failed to load PDF.</p>}
                        >
                          {Array.from(new Array(numPages), (_, index) => (
                            <Page
                              key={`page_${index + 1}`}
                              pageNumber={index + 1}
                              width={Math.min(window.innerWidth - 48, 800)}
                            />
                          ))}
                        </Document>
                      </ScrollArea>
                    </div>
                  ) : (
                    <ReactQuill
                      theme="snow"
                      value={lesson.content}
                      readOnly
                      modules={{ toolbar: false, formula: true }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "color",
                        "background",
                        "align",
                        "link",
                        "image",
                        "video",
                        "list",
                        "bullet",
                        "formula",
                        "direction",
                      ]}
                      className="border border-gray-300 rounded-md shadow-sm bg-white"
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-2 p-4 border-t border-gray-200">
                <Button
                  className="flex items-center gap-2 w-full sm:w-auto justify-center bg-blue-500 text-white hover:bg-blue-600"
                  variant="outline"
                  size="sm"
                  onClick={handleCompleteLesson}
                >
                  <BookOpenCheck className="w-4 h-4" />
                  Complete Lesson
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 w-full sm:w-auto justify-center bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <BrainCircuit className="w-4 h-4" />
                      Open Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <QuizComponent lessonId={id} />
                  </DialogContent>
                </Dialog>
                {lesson.pdf?.url && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 w-full sm:w-auto justify-center bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                )}
              </CardFooter>
            </Card>
            <Card className="relative flex flex-col bg-transparent">
              <CardHeader>
                <CardTitle>Related Lessons:</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedLessons && relatedLessons.length > 0 ? (
                  <Carousel>
                    <CarouselContent>
                      {relatedLessons.map((relatedLesson) => (
                        <CarouselItem
                          key={relatedLesson._id}
                          className="basis-[80%] sm:basis-1/2 md:basis-1/3"
                        >
                          <Card className="flex flex-col">
                            <div className="relative group">
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl px-4 py-2"
                                  onClick={() =>
                                    handlePlayLesson(relatedLesson._id)
                                  }
                                >
                                  Play
                                </Button>
                              </div>
                              <CardHeader className="p-0">
                                <img
                                  src={relatedLesson.thumbnail?.url || relatedLesson.thumbnailUrl}
                                  alt={relatedLesson.title}
                                  className="w-full h-32 object-cover rounded-t-lg"
                                />
                              </CardHeader>
                            </div>
                            <CardContent className="flex-grow p-4">
                              <h3 className="text-sm font-semibold">
                                {relatedLesson.title}
                              </h3>
                              <span className="text-xs">
                                {formatDuration(relatedLesson.video.duration)}{" "}
                                min
                              </span>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <p className="text-center text-gray-500">
                    No related lessons available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-4">
            <Card
              className="lg:sticky lg:top-4 flex flex-col bg-transparent"
              style={{ maxHeight: "680px", overflowY: "auto" }}
            >
              <DiscussionForum lessonId={lesson._id} />
            </Card>
            <Card
              className="flex flex-col bg-transparent"
              style={{ maxHeight: "470px", overflowY: "auto" }}
            >
              <CardHeader>
                <CardTitle>Reviews:</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm lessonId={lesson._id} />
              </CardContent>
              <CardContent>
                <ReviewList lessonId={lesson._id} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lesson;
