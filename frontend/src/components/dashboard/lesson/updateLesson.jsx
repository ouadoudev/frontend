// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Button } from "../../ui/button";
// import { Input } from "../../ui/input";
// import { Label } from "../../ui/label";
// import { fetchLesson, updateLesson } from "@/store/lessonSlice";
// import { fetchCourses } from "@/store/courseSlice";
// import { UploadCloudIcon, VideoIcon, BookOpenIcon, EyeIcon, EyeOffIcon } from "lucide-react";
// import Loader from "@/components/Loader";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify"

// const UpdateLesson = () => {
//   const { id: lessonId } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const courses = useSelector((state) => state.courses.courses);
//   const lesson = useSelector((state) => state.lesson.lesson);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [course, setCourse] = useState("");
//   const [published, setPublished] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [video, setVideo] = useState(null);
//   const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
//   const [hasVideo, setHasVideo] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (!lessonId) {
//       console.error("Lesson ID is undefined.");
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         await dispatch(fetchCourses());
//         await dispatch(fetchLesson(lessonId));
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [dispatch, lessonId]);

//   useEffect(() => {
//     if (lesson) {
//       setTitle(lesson.title || "");
//       setContent(lesson.content || "");
//       setCourse(lesson.course || "");
//       setPublished(lesson.published || false);
//       setVideoPreviewUrl(lesson.video ? lesson.video.url : null);
//       setHasVideo(Boolean(lesson.video));
//     }
//   }, [lesson]);

//   const handleVideoChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setVideo(selectedFile);
//       setVideoPreviewUrl(URL.createObjectURL(selectedFile));
//       setHasVideo(true);
//     }
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const selectedFile = event.dataTransfer.files[0];
//     if (selectedFile) {
//       setVideo(selectedFile);
//       setVideoPreviewUrl(URL.createObjectURL(selectedFile));
//       setHasVideo(true);
//     }
//   };
//   const getDirection = (text) => {
//     const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
//     return rtlChars.test(text) ? "rtl" : "ltr";
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!lessonId) {
//       console.error("Lesson ID is undefined.");
//       setMessage("Error: Lesson ID is missing.");
//       return;
//     }

//     setSubmitting(true);

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", content);
//     formData.append("course", course);
//     formData.append("published", published);
//     if (video) {
//       formData.append("video", video);
//     }

//     try {
//        setLoading(true)
//       await dispatch(updateLesson({ lessonId, formData })).unwrap();
//       toast.success("Lesson updated successfully!")
//       setTimeout(() => navigate("/lessons"), 1000)
//     } catch (error) {
//       if (error.response) {
//         setMessage(`Error: ${error.response.data.error}`);
//       } else {
//         setMessage("Error: " + error.message);
//       }
//     } finally {
//       setSubmitting(false);
//       setLoading(false)
//     }
//   };

//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       [{ font: [] }],
//       [{ size: ["small", false, "large", "huge"] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }],
//       [{ script: "sub" }, { script: "super" }],
//       [{ align: [] }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "image", "video"],
//       ["formula"],
//       ["clean"],
//       [{ direction: "rtl" }],
//     ],
//   };

//   const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "color",
//     "background",
//     "script",
//     "align",
//     "list",
//     "bullet",
//     "link",
//     "image",
//     "video",
//     "formula",
//     "direction",
//   ];

//   if (loading || submitting) {
//     return <Loader />;
//   }

//   return (
//     <div className="bg-gray-100 h-screen p-8">
//       <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         <form className="p-6 space-y-6" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
//                   <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//                   Lesson Title
//                 </Label>
//                 <Input
//                   id="title"
//                   value={title}
//                   dir={getDirection(title)}
//                   onChange={(event) => setTitle(event.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                   placeholder="Enter lesson title"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="course" className="text-lg font-semibold text-gray-700">
//                   <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//                   Course
//                 </Label>
//                 <div className="relative mt-1">
//                   <select
//                     id="course"
//                     value={course}
//                     onChange={(event) => setCourse(event.target.value)}
//                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                   >
//                     <option value="">Select a course</option>
//                     {courses ? (
//                       courses.map((course) => (
//                         <option key={course._id} value={course._id}>
//                           {course.title}
//                         </option>
//                       ))
//                     ) : (
//                       <option value="">No courses available</option>
//                     )}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <Label className="text-lg font-semibold text-gray-700">Visibility</Label>
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
//               <Label htmlFor="video" className="text-lg font-semibold text-gray-700">
//                 <VideoIcon className="inline-block mr-2 h-5 w-5" />
//                 Lesson Video
//               </Label>
//               <div
//                 className={`border-2 border-dashed rounded-lg p-4 text-center ${
//                   hasVideo
//                     ? "hidden"
//                     : "border-gray-300 hover:border-blue-500 transition-colors duration-300"
//                 }`}
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//               >
//                 <div>
//                   <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-1 text-sm text-gray-600">Drag and drop your video here, or click to select</p>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     className="sr-only"
//                     onChange={handleVideoChange}
//                     accept="video/*"
//                   />
//                   <Button
//                     type="button"
//                     onClick={() => document.getElementById("file-upload").click()}
//                     className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Select Video
//                   </Button>
//                 </div>
//               </div>
//               {videoPreviewUrl && (
//                 <video className="w-full h-auto rounded-lg shadow-md" controls>
//                   <source src={videoPreviewUrl} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               )}
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
//               <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//               Lesson Content
//             </Label>
//             <div className="h-80 overflow-y-auto border border-gray-300 rounded-md shadow-sm">
//               <ReactQuill
//                 theme="snow"
//                 value={content}
//                 onChange={setContent}
//                 modules={modules}
//                 formats={formats}
//                 className="h-full bg-white"
//                 placeholder="Write your lesson content here..."
//                 style={{ direction: "rtl" }} // Set the direction to RTL
//               />
//             </div>
//           </div>
//            <div className="flex gap-4 pt-4">
//             <Button type="button" variant="outline" onClick={() => navigate("/lessons")} className="flex-1">
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
//             >
//               {loading ? "Updating..." : "Update Lesson"}
//             </Button>
//           </div>
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
//   );
// };

// export default UpdateLesson;

import { useRef } from "react";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { fetchLesson, updateLesson } from "@/store/lessonSlice";
import { fetchCourses } from "@/store/courseSlice";
import { loggedUser } from "@/store/authSlice";
import {
  UploadCloudIcon,
  VideoIcon,
  BookOpenIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import Quill from "quill";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Alert, AlertDescription } from "@/components/ui/alert";

window.katex = katex;

const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

// Translation object for static text
const translations = {
  ltr: {
    lessonTitle: "Lesson Title",
    enterLessonTitle: "Enter lesson title",
    course: "Course",
    selectCourse: "Select a course",
    noCoursesAvailable: "No courses available",
    visibility: "Visibility",
    public: "Public",
    private: "Private",
    uploadPdf: "Upload PDF (Optional)",
    lessonVideo: "Lesson Video",
    dragDropVideo: "Drag and drop your video here, or click to select",
    selectVideo: "Select Video",
    lessonContent: "Lesson Content",
    updateLesson: "Update Lesson",
    lessonUpdatedSuccessfully: "Lesson updated successfully!",
    errorUpdatingLesson: "Error updating lesson",
    updating: "Updating...",
    cancel: "Cancel",
    educationalDetailsRequiredButton: "Educational Details Required",
    noCoursesAvailableButton: "No Courses Available",
    restrictionMessage: (discipline, levels) =>
      `No courses available for your discipline (${discipline}) within your assigned educational levels. Your assigned levels: ${levels}`,
    noEducationalDetailsMessage:
      "You don't have assigned educational details. Please contact an administrator to assign your teaching levels before updating lessons.",
  },
  rtl: {
    lessonTitle: "عنوان الدرس",
    enterLessonTitle: "أدخل عنوان الدرس",
    course: "الدورة",
    selectCourse: "اختر دورة",
    noCoursesAvailable: "لا توجد دورات متاحة",
    visibility: "الرؤية",
    public: "عام",
    private: "خاص",
    uploadPdf: "تحميل ملف PDF (اختياري)",
    lessonVideo: "فيديو الدرس",
    dragDropVideo: "اسحب وأفلت الفيديو هنا، أو انقر للاختيار",
    selectVideo: "اختر الفيديو",
    lessonContent: "محتوى الدرس",
    updateLesson: "تحديث الدرس",
    lessonUpdatedSuccessfully: "تم تحديث الدرس بنجاح!",
    errorUpdatingLesson: "خطأ في تحديث الدرس",
    updating: "جارٍ التحديث...",
    cancel: "إلغاء",
    educationalDetailsRequiredButton: "التفاصيل التعليمية مطلوبة",
    noCoursesAvailableButton: "لا توجد دورات متاحة",
    restrictionMessage: (discipline, levels) =>
      `لا توجد دورات متاحة لتخصصك (${discipline}) ضمن المستويات التعليمية المعينة. المستويات المعينة: ${levels}`,
    noEducationalDetailsMessage:
      "لم يتم تعيين تفاصيل تعليمية لك. يرجى التواصل مع المسؤول لتعيين مستويات التدريس الخاصة بك قبل تحديث الدروس.",
  },
};

const UpdateLesson = () => {
  const { id: lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courses = useSelector((state) => state.courses.courses);
  const lesson = useSelector((state) => state.lesson.lesson);
  const teacher = useSelector(loggedUser); // Get logged in teacher for discipline

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [course, setCourse] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true); // For initial data fetch
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [video, setVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [message, setMessage] = useState("");

  // New state for educational restrictions
  const [hasEducationalDetails, setHasEducationalDetails] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [restrictionMessage, setRestrictionMessage] = useState("");

  const quillRef = useRef(null);
  const [quillEditorInstance, setQuillEditorInstance] = useState(null);

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  // Determine direction and translation key based on teacher.discipline
  const disciplineDirection = teacher?.discipline
    ? getDirection(teacher.discipline)
    : "ltr";
  const t = translations[disciplineDirection];

  useEffect(() => {
    if (!lessonId) {
      console.error("Lesson ID is undefined.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        await dispatch(fetchCourses());
        await dispatch(fetchLesson(lessonId));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        toast.error(`Error fetching data: ${error.message || "Unknown error"}`);
      }
    };
    fetchData();
  }, [dispatch, lessonId]);

  // Check teacher's educational details and filter courses accordingly
useEffect(() => {
  if (!teacher || !courses.length) return;

  const teacherCycles = teacher.educationalCycles || [];
  const teacherLevels = teacher.educationalLevels || [];

  // Check if teacher has assigned educational details
  const hasDetails = teacherCycles.length > 0 && teacherLevels.length > 0;
  setHasEducationalDetails(hasDetails);

  if (!hasDetails) {
    setRestrictionMessage(t.noEducationalDetailsMessage);
    setAvailableCourses([]);
    return;
  }

  // Filter courses based on teacher's educational details AND ownership
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
    setRestrictionMessage(
      t.restrictionMessage(teacher.discipline, teacherLevels.join(", "))
    );
  } else {
    setRestrictionMessage("");
  }
}, [courses, teacher, t]);


  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "");
      setContent(lesson.content || "");
      setCourse(lesson.course || "");
      setPublished(lesson.published || false);
      setVideoPreviewUrl(lesson.video ? lesson.video.url : null);
      setHasVideo(Boolean(lesson.video));
    }
  }, [lesson]);

  useEffect(() => {
    if (quillEditorInstance && quillEditorInstance.root) {
      const observer = new MutationObserver(() => {
        // Callback for when mutations are observed
        // You can add logic here if you need to react to content changes
      });
      observer.observe(quillEditorInstance.root, {
        childList: true,
        subtree: true,
      });
      return () => {
        observer.disconnect();
      };
    }
  }, [quillEditorInstance]);

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
    if (selectedFile) {
      setVideo(selectedFile);
      setVideoPreviewUrl(URL.createObjectURL(selectedFile));
      setHasVideo(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!lessonId) {
      console.error("Lesson ID is undefined.");
      setMessage("Error: Lesson ID is missing.");
      toast.error("Error: Lesson ID is missing.");
      return;
    }

    // Additional validation for educational restrictions
    if (!hasEducationalDetails) {
      toast.error(t.noEducationalDetailsMessage);
      return;
    }
    if (availableCourses.length === 0) {
      toast.error(
        t.restrictionMessage(
          teacher.discipline,
          teacher.educationalLevels.join(", ")
        )
      );
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("course", course);
    formData.append("published", published ? "true" : "false");
    if (video) {
      formData.append("video", video);
    }

    try {
      await dispatch(updateLesson({ lessonId, formData })).unwrap();
      toast.success(t.lessonUpdatedSuccessfully);
      setTimeout(() => navigate("/lessons"), 1000);
    } catch (error) {
      console.error("Update error:", error);
      if (error.response) {
        setMessage(`${t.errorUpdatingLesson}: ${error.response.data.error}`);
        toast.error(`${t.errorUpdatingLesson}: ${error.response.data.error}`);
      } else {
        setMessage(`${t.errorUpdatingLesson}: ${error.message}`);
        toast.error(`${t.errorUpdatingLesson}: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
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
  };
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "align",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "formula",
    "direction",
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Restriction Message */}
        {restrictionMessage && (
          <Alert className="m-6 mb-0" variant="destructive">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription dir={disciplineDirection}>
              {restrictionMessage}
            </AlertDescription>
          </Alert>
        )}
        <form
          className="p-6 space-y-6"
          onSubmit={handleSubmit}
          dir={disciplineDirection}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="title"
                  className="text-lg font-semibold text-gray-700"
                >
                  <BookOpenIcon
                    className={cn(
                      "inline-block h-5 w-5",
                      disciplineDirection === "rtl" ? "ml-2" : "mr-2"
                    )}
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
                  disabled={
                    loading ||
                    submitting ||
                    !hasEducationalDetails ||
                    availableCourses.length === 0
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="course"
                  className="text-lg font-semibold text-gray-700"
                >
                  <BookOpenIcon
                    className={cn(
                      "inline-block h-5 w-5",
                      disciplineDirection === "rtl" ? "ml-2" : "mr-2"
                    )}
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
                    disabled={
                      loading ||
                      submitting ||
                      !hasEducationalDetails ||
                      availableCourses.length === 0
                    }
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
                <Label className="text-lg font-semibold text-gray-700">
                  {t.visibility}
                </Label>
                <div
                  className={cn(
                    "mt-2 flex",
                    disciplineDirection === "rtl"
                      ? "flex-row-reverse space-x-reverse"
                      : "space-x-4"
                  )}
                >
                  <Label className="inline-flex items-center">
                    <Input
                      type="radio"
                      className="size-6"
                      name="visibility"
                      value="true"
                      checked={published === true}
                      onChange={() => setPublished(true)}
                      disabled={
                        loading ||
                        submitting ||
                        !hasEducationalDetails ||
                        availableCourses.length === 0
                      }
                    />
                    <span
                      className={cn(
                        "text-gray-700",
                        disciplineDirection === "rtl" ? "mr-2" : "ml-2"
                      )}
                    >
                      <EyeIcon
                        className={cn(
                          "inline-block h-5 w-5",
                          disciplineDirection === "rtl" ? "ml-1" : "mr-1"
                        )}
                      />
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
                      disabled={
                        loading ||
                        submitting ||
                        !hasEducationalDetails ||
                        availableCourses.length === 0
                      }
                    />
                    <span
                      className={cn(
                        "text-gray-700",
                        disciplineDirection === "rtl" ? "mr-2" : "ml-2"
                      )}
                    >
                      <EyeOffIcon
                        className={cn(
                          "inline-block h-5 w-5",
                          disciplineDirection === "rtl" ? "ml-1" : "mr-1"
                        )}
                      />
                      {t.private}
                    </span>
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="pdf"
                  className="text-lg font-semibold text-gray-700"
                >
                  <UploadCloudIcon
                    className={cn(
                      "inline-block h-5 w-5",
                      disciplineDirection === "rtl" ? "ml-2" : "mr-2"
                    )}
                  />
                  {t.uploadPdf}
                </Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={() => {}} // Placeholder for PDF upload, not implemented in this update
                  className="block w-full text-sm text-gray-900 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  dir={disciplineDirection}
                  disabled={
                    loading ||
                    submitting ||
                    !hasEducationalDetails ||
                    availableCourses.length === 0
                  }
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label
                htmlFor="video"
                className="text-lg font-semibold text-gray-700"
              >
                <VideoIcon
                  className={cn(
                    "inline-block h-5 w-5",
                    disciplineDirection === "rtl" ? "ml-2" : "mr-2"
                  )}
                />
                {t.lessonVideo}
              </Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center",
                  hasVideo
                    ? "hidden"
                    : "border-gray-300 hover:border-blue-500 transition-colors duration-300"
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div>
                  <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p
                    className="mt-1 text-sm text-gray-600"
                    dir={disciplineDirection}
                  >
                    {t.dragDropVideo}
                  </p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleVideoChange}
                    accept="video/*"
                    disabled={
                      loading ||
                      submitting ||
                      !hasEducationalDetails ||
                      availableCourses.length === 0
                    }
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={
                      loading ||
                      submitting ||
                      !hasEducationalDetails ||
                      availableCourses.length === 0
                    }
                  >
                    {t.selectVideo}
                  </Button>
                </div>
              </div>
              {videoPreviewUrl && (
                <video className="w-full h-auto rounded-lg shadow-md" controls>
                  <source src={videoPreviewUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-lg font-semibold text-gray-700"
            >
              <BookOpenIcon
                className={cn(
                  "inline-block h-5 w-5",
                  disciplineDirection === "rtl" ? "ml-2" : "mr-2"
                )}
              />
              {t.lessonContent}
            </Label>
            <div className="h-64 sm:h-72 md:h-80 overflow-y-auto border border-gray-300 rounded-md shadow-sm">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className="h-full bg-white"
                ref={(el) => {
                  quillRef.current = el;
                  if (el) {
                    setQuillEditorInstance(el.getEditor());
                  }
                }}
                style={{ direction: disciplineDirection }}
                readOnly={
                  loading ||
                  submitting ||
                  !hasEducationalDetails ||
                  availableCourses.length === 0
                }
              />
            </div>
          </div>
          {submitting && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-blue-600 animate-pulse"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <p
                className="text-sm text-gray-600 mt-1 text-center"
                dir={disciplineDirection}
              >
                {t.updating}
              </p>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/lessons")}
              className="flex-1"
              disabled={submitting}
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                submitting ||
                !hasEducationalDetails ||
                availableCourses.length === 0
              }
              className="flex-1 px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting
                ? t.updating
                : !hasEducationalDetails
                ? t.educationalDetailsRequiredButton
                : availableCourses.length === 0
                ? t.noCoursesAvailableButton
                : t.updateLesson}
            </Button>
          </div>
        </form>
        {message && (
          <div
            className={cn(
              "p-4 text-sm sm:text-base rounded-b-lg",
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            )}
            dir={disciplineDirection}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateLesson;
