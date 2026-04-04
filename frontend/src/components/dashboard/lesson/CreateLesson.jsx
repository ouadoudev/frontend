import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addLesson, fetchLessons } from "@/store/lessonSlice";
import { fetchCourses } from "@/store/courseSlice";
import { loggedUser } from "@/store/authSlice";
import {
  UploadCloudIcon,
  VideoIcon,
  BookOpenIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  Trash2Icon,
  Loader2,
} from "lucide-react";

import Quill from "quill";
import katex from "katex";
import "katex/dist/katex.min.css";

// Image Resize Module Imports
window.Quill = Quill;
import ImageResize from "quill-image-resize-module-react";

import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";

window.katex = katex;

const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);
Quill.register("modules/imageResize", ImageResize);

const translations = {
  ltr: {
    lessonTitle: "Titre de la leçon",
    enterLessonTitle: "Saisir le titre de la leçon",
    course: "Cours",
    selectCourse: "Sélectionner un cours",
    noCoursesAvailable: "Aucun cours disponible",
    noEducationalDetails: "Aucun détail éducatif",
    visibility: "Visibilité",
    public: "Public",
    private: "Privé",
    uploadPdf: "Télécharger un PDF (facultatif)",
    lessonVideo: "Vidéo de la leçon",
    dragDropVideo: "Glisser-déposer votre vidéo ici, ou cliquer pour sélectionner",
    selectVideo: "Sélectionner une vidéo",
    removeVideo: "Supprimer la vidéo",
    lessonContent: "Contenu de la leçon",
    createLesson: "Créer une leçon",
    lessonCreatedSuccessfully: "Leçon créée avec succès !",
    errorCreatingLesson: "Erreur lors de la création de la leçon",
    uploading: "Téléchargement en cours...",
    educationalDetailsRequiredButton: "Détails éducatifs requis",
    noCoursesAvailableButton: "Aucun cours disponible",
    restrictionMessage: (discipline, levels) =>
      `Aucun cours disponible pour votre discipline (${discipline}) dans vos niveaux éducatifs assignés. Vos niveaux assignés : ${levels}`,
    noEducationalDetailsMessage:
      "Vous n'avez pas de détails éducatifs assignés. Veuillez contacter un administrateur pour assigner vos niveaux d'enseignement avant de créer des leçons.",
  },
  rtl: {
    lessonTitle: "عنوان الدرس",
    enterLessonTitle: "أدخل عنوان الدرس",
    course: "الدورة",
    selectCourse: "اختر دورة",
    noCoursesAvailable: "لا توجد دورات متاحة",
    noEducationalDetails: "لا توجد تفاصيل تعليمية",
    visibility: "الرؤية",
    public: "عام",
    private: "خاص",
    uploadPdf: "تحميل ملف PDF (اختياري)",
    lessonVideo: "فيديو الدرس",
    dragDropVideo: "اسحب وأفلت الفيديو هنا، أو انقر للاختيار",
    selectVideo: "اختر الفيديو",
    removeVideo: "إزالة الفيديو",
    lessonContent: "محتوى الدرس",
    createLesson: "إنشاء الدرس",
    lessonCreatedSuccessfully: "تم إنشاء الدرس بنجاح!",
    errorCreatingLesson: "خطأ في إنشاء الدرس",
    uploading: "جارٍ الرفع...",
    educationalDetailsRequiredButton: "التفاصيل التعليمية مطلوبة",
    noCoursesAvailableButton: "لا توجد دورات متاحة",
    restrictionMessage: (discipline, levels) =>
      `لا توجد دورات متاحة لتخصصك (${discipline}) ضمن المستويات التعليمية المعينة. المستويات المعينة: ${levels}`,
    noEducationalDetailsMessage:
      "لم يتم تعيين تفاصيل تعليمية لك. يرجى التواصل مع المسؤول لتعيين مستويات التدريس الخاصة بك قبل إنشاء الدروس.",
  },
};

const CreateLesson = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courses = useSelector((state) => state.courses.courses);
  const teacher = useSelector(loggedUser);
  const lessonStatus = useSelector((state) => state.lesson.status);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [course, setCourse] = useState("");
  const [published, setPublished] = useState(false);
  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [hasVideo, setHasVideo] = useState(false);
  const quillRef = useRef(null);
  const videoInputRef = useRef(null);

  const [hasEducationalDetails, setHasEducationalDetails] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [restrictionMessage, setRestrictionMessage] = useState("");

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const disciplineDirection = teacher?.discipline ? getDirection(teacher.discipline) : "ltr";
  const t = translations[disciplineDirection];

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  useEffect(() => {
    if (!teacher || !courses.length) return;

    const teacherCycles = teacher.educationalCycles || [];
    const teacherLevels = teacher.educationalLevels || [];

    const hasDetails = teacherCycles.length > 0 && teacherLevels.length > 0;
    setHasEducationalDetails(hasDetails);

    if (!hasDetails) {
      setRestrictionMessage(t.noEducationalDetailsMessage);
      setAvailableCourses([]);
      return;
    }

    const matchingCourses = courses.filter((course) => {
      if (
        !course.subject ||
        !course.subject.educationalLevel ||
        !course.subject.educationalCycle ||
        !course.teacher ||
        !course.teacher.username
      ) {
        return false;
      }

      const matchesCycle = teacherCycles.includes(course.subject.educationalCycle);
      const matchesLevel = teacherLevels.includes(course.subject.educationalLevel);
      const matchesTeacher = course.teacher.username === teacher.username;

      return matchesCycle && matchesLevel && matchesTeacher;
    });

    setAvailableCourses(matchingCourses);

    if (matchingCourses.length === 0) {
      setRestrictionMessage(t.restrictionMessage(teacher.discipline, teacherLevels.join(", ")));
    } else {
      setRestrictionMessage("");
    }
  }, [courses, teacher, t.noEducationalDetailsMessage, t.restrictionMessage]);

  const handlePdfChange = (event) => {
    const selectedPdf = event.target.files[0];
    setPdf(selectedPdf);
  };

  const handleVideoChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setVideo(selectedFile);
      setVideoPreviewUrl(URL.createObjectURL(selectedFile));
      setHasVideo(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setVideo(selectedFile);
      setVideoPreviewUrl(URL.createObjectURL(selectedFile));
      setHasVideo(true);
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideo(null);
    setVideoPreviewUrl(null);
    setHasVideo(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasEducationalDetails) {
      toast.error(t.noEducationalDetailsMessage);
      return;
    }
    if (availableCourses.length === 0) {
      toast.error(t.restrictionMessage(teacher.discipline, teacher.educationalLevels.join(", ")));
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("course", course);
    formData.append("teacher", teacher.id);
    formData.append("published", published ? "true" : "false");
    if (video) formData.append("video", video);
    if (pdf) formData.append("pdf", pdf);

    try {
      await dispatch(addLesson(formData)).unwrap();
      toast.success(t.lessonCreatedSuccessfully);
      dispatch(fetchLessons());
      
      setTitle("");
      setContent("");
      setCourse("");
      setPublished(false);
      handleRemoveVideo();
      setPdf(null);
      
      setTimeout(() => {
        navigate("/lessons");
      }, 1000);
    } catch (error) {
      const errorMsg = error.response ? error.response.data.error : error.message;
      toast.error(`${t.errorCreatingLesson}: ${errorMsg}`);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        [{ font: Font.whitelist }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["formula"],
        ["clean"],
        [{ direction: "rtl" }],
      ],
    },
    formula: true,
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };

  const formats = [
    "header", "font", "size", "bold", "italic", "underline", "strike",
    "color", "background", "script", "align", "list", "bullet",
    "link", "image", "video", "formula", "direction",
    "width", "height", "style" 
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {restrictionMessage && (
          <Alert className="m-6 mb-0" variant="destructive">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription dir={disciplineDirection}>
              {restrictionMessage}
            </AlertDescription>
          </Alert>
        )}
        <form className="p-6 space-y-6" onSubmit={handleSubmit} dir={disciplineDirection}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Left Column inputs ... */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
                  <BookOpenIcon
                    className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t.lessonTitle}
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  dir={disciplineDirection}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t.enterLessonTitle}
                  disabled={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="course" className="text-lg font-semibold text-gray-700">
                  <BookOpenIcon
                    className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t.course}
                </Label>
                <div className="relative mt-1">
                  <select
                    id="course"
                    value={course}
                    onChange={(event) => setCourse(event.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    dir={disciplineDirection}
                    disabled={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
                    required
                  >
                    <option value="">
                      {!hasEducationalDetails
                        ? t.noEducationalDetails
                        : availableCourses.length === 0
                        ? t.noCoursesAvailable
                        : t.selectCourse}
                    </option>
                    {availableCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold text-gray-700">{t.visibility}</Label>
                <div className={cn("mt-2 flex", disciplineDirection === "rtl" ? "flex-row-reverse space-x-reverse" : "space-x-4")}>
                  <Label className="inline-flex items-center">
                    <Input
                      type="radio"
                      className="size-6"
                      name="visibility"
                      value="true"
                      checked={published === true}
                      onChange={() => setPublished(true)}
                      disabled={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
                    />
                    <span className={cn("text-gray-700", disciplineDirection === "rtl" ? "mr-2" : "ml-2")}>
                      <EyeIcon className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-1" : "mr-1")} />
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
                      disabled={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
                    />
                    <span className={cn("text-gray-700", disciplineDirection === "rtl" ? "mr-2" : "ml-2")}>
                      <EyeOffIcon className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-1" : "mr-1")} />
                      {t.private}
                    </span>
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf" className="text-lg font-semibold text-gray-700">
                  <UploadCloudIcon
                    className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t.uploadPdf}
                </Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  dir={disciplineDirection}
                  disabled={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
                />
              </div>
            </div>

            {/* Right Column Video Dropzone ... */}
            <div className="space-y-4">
              <Label htmlFor="video" className="text-lg font-semibold text-gray-700">
                <VideoIcon
                  className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
                />
                {t.lessonVideo}
              </Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center",
                  hasVideo ? "hidden" : "border-gray-300 hover:border-blue-500 transition-colors duration-300"
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div>
                  <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600" dir={disciplineDirection}>
                    {t.dragDropVideo}
                  </p>
                  <input
                    ref={videoInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleVideoChange}
                    accept="video/*"
                    disabled={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
                  />
                  <Button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
                  >
                    {t.selectVideo}
                  </Button>
                </div>
              </div>
              
              {videoPreviewUrl && (
                <div className="space-y-3">
                  <video className="w-full h-auto rounded-lg shadow-md" controls>
                    <source src={videoPreviewUrl} type={video?.type || "video/mp4"} />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleRemoveVideo}
                    className="w-full"
                    disabled={lessonStatus === "loading"}
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    {t.removeVideo}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* QUILL TEXT EDITOR AREA */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
              <BookOpenIcon
                className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
              />
              {t.lessonContent}
            </Label>
            
            {/* FIX: Scoped CSS to enforce strict Flexbox layout inside Quill */}
            <style>{`
              .custom-quill {
                display: flex;
                flex-direction: column;
                height: 100%;
              }
              .custom-quill .ql-toolbar {
                border: none !important;
                border-bottom: 1px solid #e5e7eb !important; /* matches Tailwind gray-200 */
                background-color: #f9fafb; /* matches Tailwind gray-50 */
              }
              .custom-quill .ql-container {
                border: none !important;
                height: auto !important; /* overriding Quill's problematic 100% */
                flex: 1;
                min-height: 0;
                overflow-y: auto; /* enables scrolling purely inside the container */
              }
            `}</style>
            
            {/* FIX: The wrapper uses flex flex-col and overflow-hidden, constraining Quill completely */}
            <div className="h-64 sm:h-72 md:h-80 border border-gray-300 rounded-md shadow-sm bg-white flex flex-col overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className="custom-quill flex-1"
                ref={quillRef}
                readOnly={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
              />
            </div>
          </div>

          {lessonStatus === "loading" && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 animate-pulse" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-center" dir={disciplineDirection}>
                {t.uploading}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={lessonStatus === "loading" || !hasEducationalDetails || availableCourses.length === 0}
            className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            {lessonStatus === "loading" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.uploading}
              </>
            ) : !hasEducationalDetails ? (
              t.educationalDetailsRequiredButton
            ) : availableCourses.length === 0 ? (
              t.noCoursesAvailableButton
            ) : (
              t.createLesson
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateLesson;