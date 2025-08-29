import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loggedUser } from "@/store/authSlice";
import { fetchLesson, fetchRelatedLessons } from "@/store/lessonSlice";
import { updateProgress } from "@/store/courseProgressSlice";
import { fetchLessonQuestions } from "@/store/questionSlice";
import DiscussionForum from "@/components/DiscussionForum";
import QuizComponent from "@/components/dashboard/quiz/QuizComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, BrainCircuit, Download } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import ConfirmDialog from "@/components/ConfirmDialog";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
window.katex = katex;

const Lesson = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lesson, relatedLessons, error, status } = useSelector(
    (state) => state.lesson
  );
  const user = useSelector(loggedUser);
  const [numPages, setNumPages] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const videoRef = useRef(null);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(fetchLesson(id));
    dispatch(fetchRelatedLessons(id));
    dispatch(fetchLessonQuestions(id));
  }, [dispatch, id]);

  // Detect if this lesson is already completed
  const isCompleted = useMemo(() => {
    const courseProgress = user?.progress?.find(
      (p) => p.course === lesson?.course?._id
    );
    return courseProgress?.completedLessons?.some((l) => l.lesson === id);
  }, [user, lesson, id]);

  // Create a Set of all completed lesson IDs
  const completedLessonIds = useMemo(() => {
    const all =
      user?.progress?.flatMap((p) =>
        p.completedLessons.map((l) => l.lesson?.toString())
      ) || [];
    return new Set(all);
  }, [user]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleScroll = async () => {
      if (
        videoElement &&
        !isPiPActive &&
        !videoElement.paused &&
        window.scrollY > 200
      ) {
        try {
          await videoElement.requestPictureInPicture();
          setIsPiPActive(true);
        } catch (error) {
          console.error("Error entering PiP mode:", error);
        }
      }
    };

    const handlePiPChange = () => {
      if (document.pictureInPictureElement !== videoElement) {
        setIsPiPActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    if (videoElement) {
      videoElement.addEventListener("enterpictureinpicture", handlePiPChange);
      videoElement.addEventListener("leavepictureinpicture", handlePiPChange);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (videoElement) {
        videoElement.removeEventListener(
          "enterpictureinpicture",
          handlePiPChange
        );
        videoElement.removeEventListener(
          "leavepictureinpicture",
          handlePiPChange
        );
      }
    };
  }, [isPiPActive]);

  const handlePlayLesson = async (lessonId) => {
    try {
      setIsPiPActive(false);
      navigate(`/lessons/${lessonId}`);
    } catch (error) {
      console.error("Error navigating to lesson:", error);
    }
  };

  // Lesson component
  const handleConfirmComplete = async () => {
    try {
      await dispatch(
        updateProgress({
          courseId: lesson.course._id,
          lessonId: id,
        })
      ).unwrap();

      setShowConfirmDialog(false);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
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
      const response = await fetch(lesson.pdf.url, { mode: "cors" });
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

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "failed") {
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 w-full">
          {lesson && (
            <>
              {/* Video Player */}
              <Card className="mb-6 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <CardTitle
                    className="lg:text-2xl text-lg font-bold"
                    dir={getDirection(lesson?.title)}
                  >
                    {lesson.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted shadow-md">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      controls
                      controlsList="nodownload"
                      preload="metadata"
                      onPlay={() => setIsPiPActive(false)}
                    >
                      <source src={lesson.video.url} type="video/mp4" />
                      {"Your browser does not support the video tag."}
                    </video>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 p-4 border-t border-gray-200 bg-gray-50">
                  <Button
                    className="flex items-center gap-2 w-full sm:w-auto justify-center"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isCompleted}
                  >
                    <BookOpenCheck className="w-4 h-4" />
                    {isCompleted
                      ? getDirection(lesson?.title) === "rtl"
                        ? "منتهى"
                        : "Terminée"
                      : getDirection(lesson?.title) === "rtl"
                      ? "تحديد كمكتمل"
                      : "Marquer comme terminée"}
                  </Button>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2 w-full sm:w-auto justify-center"
                      >
                        <BrainCircuit className="w-4 h-4" />
                        {getDirection(lesson?.title) === "rtl"
                          ? "سؤال وجواب"
                          : "Lancer le quiz"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <QuizComponent
                        lessonId={id}
                        lessonTitle={lesson?.title}
                      />
                    </DialogContent>
                  </Dialog>

                  {lesson.pdf?.url && (
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <Download className="w-4 h-4" />
                      {"Télécharger le support"}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* PDF or Text Content */}
              <Card className="my-6 shadow-lg rounded-xl">
                <CardContent className="p-4">
                  {lesson.pdf && lesson.pdf.url && !isMobile ? (
                    <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
                      <ScrollArea className="h-[600px] p-4 bg-gray-50 rounded-lg">
                        <Document
                          file={lesson.pdf.url}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={
                            <p className="text-center text-gray-500">
                              Loading PDF...
                            </p>
                          }
                          error={
                            <p className="text-center text-red-500">
                              Failed to load PDF.
                            </p>
                          }
                        >
                          {Array.from(new Array(numPages), (_, index) => (
                            <Page
                              key={`page_${index + 1}`}
                              pageNumber={index + 1}
                              width={Math.min(window.innerWidth - 48, 800)}
                              className="mb-4 shadow-md rounded-md overflow-hidden"
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
                      className="border border-gray-200 rounded-lg shadow-sm bg-white min-h-[300px]"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Related Lessons */}
              <Card className="mb-6 shadow-lg rounded-xl">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-xl font-bold text-center">
                    {getDirection(lesson?.title) === "rtl"
                      ? "مواصلة التعلم"
                      : "Poursuivre l’Apprentissage"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {relatedLessons?.length > 0 ? (
                    <Carousel opts={{ align: "start" }} className="w-full">
                      <CarouselContent className="-ml-2">
                        {relatedLessons.map((relatedLesson) => (
                          <CarouselItem
                            key={relatedLesson._id}
                            className="pl-2 basis-[80%] sm:basis-1/2 md:basis-1/3"
                          >
                            <Card className="flex flex-col h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200">
                              <div className="relative group aspect-video overflow-hidden">
                                <img
                                  src={
                                    relatedLesson.thumbnail?.url ||
                                    "/placeholder.svg"
                                  }
                                  alt={relatedLesson.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Button
                                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6 py-3 text-lg"
                                    onClick={() =>
                                      handlePlayLesson(relatedLesson._id)
                                    }
                                  >
                                    {completedLessonIds.has(relatedLesson._id)
                                      ? "Terminée"
                                      : "Play"}
                                  </Button>
                                </div>
                              </div>
                              <CardContent className="flex-grow p-4">
                                <h3 className="text-base font-semibold mb-1 line-clamp-2">
                                  {relatedLesson.title}
                                </h3>
                                <span className="text-sm text-gray-600">
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
                    <p className="text-center text-gray-500 py-4">
                      {"Aucune leçon en relation pour le moment"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Discussion Forum */}
        <div>
          {lesson && (
            <Card className="lg:sticky lg:top-8 h-[560px] lg:h-[680px] shadow-lg rounded-xl overflow-hidden">
              <DiscussionForum
                lessonId={lesson._id}
                lessonTitle={lesson?.title}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        show={showConfirmDialog}
        title="Confirmation"
        message="Êtes-vous sûr de vouloir marquer cette leçon comme terminée ?"
        onConfirm={handleConfirmComplete}
        onCancel={() => setShowConfirmDialog(false)}
        confirmText="Oui, confirmer"
        cancelText="Annuler"
        destructive={false}
      />
    </div>
  );
};

export default Lesson;
