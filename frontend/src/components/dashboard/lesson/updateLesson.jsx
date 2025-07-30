import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { fetchLesson, updateLesson } from "@/store/lessonSlice";
import { fetchCourses } from "@/store/courseSlice";
import { UploadCloudIcon, VideoIcon, BookOpenIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import Loader from "@/components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify"

const UpdateLesson = () => {
  const { id: lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courses = useSelector((state) => state.courses.courses);
  const lesson = useSelector((state) => state.lesson.lesson);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [course, setCourse] = useState("");
  const [published, setPublished] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [video, setVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [message, setMessage] = useState("");

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
      }
    };

    fetchData();
  }, [dispatch, lessonId]);

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
  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!lessonId) {
      console.error("Lesson ID is undefined.");
      setMessage("Error: Lesson ID is missing.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("course", course);
    formData.append("published", published);
    if (video) {
      formData.append("video", video);
    }

    try {
       setLoading(true)
      await dispatch(updateLesson({ lessonId, formData })).unwrap();
      toast.success("Lesson updated successfully!")
      setTimeout(() => navigate("/lessons"), 1000)
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.error}`);
      } else {
        setMessage("Error: " + error.message);
      }
    } finally {
      setSubmitting(false);
      setLoading(false)
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ font: [] }],
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

  if (loading || submitting) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-100 h-screen p-8">
      <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
                  <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
                  Lesson Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  dir={getDirection(title)}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter lesson title"
                />
              </div>
              <div>
                <Label htmlFor="course" className="text-lg font-semibold text-gray-700">
                  <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
                  Course
                </Label>
                <div className="relative mt-1">
                  <select
                    id="course"
                    value={course}
                    onChange={(event) => setCourse(event.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="">Select a course</option>
                    {courses ? (
                      courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))
                    ) : (
                      <option value="">No courses available</option>
                    )}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-lg font-semibold text-gray-700">Visibility</Label>
                <div className="mt-2 space-x-4">
                  <Label className="inline-flex items-center">
                    <Input
                      type="radio"
                      name="visibility"
                      value="true"
                      checked={published === true}
                      onChange={() => setPublished(true)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">
                      <EyeIcon className="inline-block mr-1 h-5 w-5" />
                      Public
                    </span>
                  </Label>
                  <Label className="inline-flex items-center">
                    <Input
                      type="radio"
                      name="visibility"
                      value="false"
                      checked={published === false}
                      onChange={() => setPublished(false)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">
                      <EyeOffIcon className="inline-block mr-1 h-5 w-5" />
                      Private
                    </span>
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="video" className="text-lg font-semibold text-gray-700">
                <VideoIcon className="inline-block mr-2 h-5 w-5" />
                Lesson Video
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  hasVideo
                    ? "hidden"
                    : "border-gray-300 hover:border-blue-500 transition-colors duration-300"
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div>
                  <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">Drag and drop your video here, or click to select</p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleVideoChange}
                    accept="video/*"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById("file-upload").click()}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Select Video
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
            <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
              <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
              Lesson Content
            </Label>
            <div className="h-80 overflow-y-auto border border-gray-300 rounded-md shadow-sm">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className="h-full bg-white"
                placeholder="Write your lesson content here..."
                style={{ direction: "rtl" }} // Set the direction to RTL
              />
            </div>
          </div>
           <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/lessons")} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              {loading ? "Updating..." : "Update Lesson"}
            </Button>
          </div>
        </form>
        {message && (
          <div
            className={`p-4 ${
              message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            } rounded-b-lg`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateLesson;

// import { useState, useEffect, useRef } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLesson, updateLesson } from "@/store/lessonSlice";
// import { fetchCourses } from "@/store/courseSlice";
// import { UploadCloudIcon } from "lucide-react";
// import Loader from "@/components/Loader";
// import {
//   BookOpenIcon,
//   EyeIcon,
//   EyeOffIcon,
// } from "lucide-react";
// import Quill from "quill";
// import katex from "katex";
// import "katex/dist/katex.min.css";

// window.katex = katex;

// const Font = Quill.import("formats/font");
// Font.whitelist = ["sans-serif", "serif", "monospace"];
// Quill.register(Font, true);

// const UpdateLesson = ({ lessonId }) => {
//   const dispatch = useDispatch();
//   const courses = useSelector((state) => state.courses.courses);
//   const lesson = useSelector((state) => state.lesson.lesson);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [course, setCourse] = useState("");
//   const [published, setPublished] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [video, setVideo] = useState(null);
//   const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
//   const [hasVideo, setHasVideo] = useState(false);
//   const [message, setMessage] = useState("");
//   const quillRef = useRef(null);

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
//     const observer = new MutationObserver(() => {});

//     if (quillRef.current) {
//       observer.observe(quillRef.current, { childList: true, subtree: true });
//     }

//     return () => {
//       if (quillRef.current) {
//         observer.disconnect();
//       }
//     };
//   }, [quillRef]);

//   useEffect(() => {
//     if (lesson) {
//       setTitle(lesson.title || "");
//       setContent(lesson.content || "");
//       setCourse(lesson.course || "");
//       setPublished(lesson.published|| false);
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
//     formData.append("published", published ? "true" : "false");
//     if (video) {
//       formData.append("video", video);
//     }

//     try {
//       await dispatch(updateLesson({ lessonId, formData }));
//       setMessage("Lesson updated successfully!");
//     } catch (error) {
//       if (error.response) {
//         setMessage(`Error: ${error.response.data.error}`);
//       } else {
//         setMessage("Error: " + error.message);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const modules = {
//     toolbar: {
//       container: [
//         [{ header: [1, 2, false] }],
//         [{ font: Font.whitelist }],
//         [{ size: ["small", false, "large", "huge"] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ color: [] }, { background: [] }],
//         [{ script: "sub" }, { script: "super" }],
//         [{ align: [] }],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link", "image", "video"],
//         ["formula"],
//         ["clean"],
//       ],
//     },
//     formula: true,
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
//   ];

//   if (loading ) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }
//   return (
    
//     <div className=" mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//       <form className="p-6 space-y-6" onSubmit={handleSubmit}>
//         <div className="flex gap-4">
//           <div className="flex-1">
//             <div
//               className={`flex flex-col items-center justify-center h-[200px] w-full max-w-xs border-2 border-dashed border-gray-300 rounded-lg ${
//                 hasVideo ? "hidden" : ""
//               }`}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//             ></div>
//             {videoPreviewUrl && (
//               <video
//                 className="w-full h-auto max-w-xs object-cover rounded-md"
//                 controls
//                 autoPlay
//                 muted
//               >
//                 <source src={videoPreviewUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             )}
//             <div className="flex flex-col items-center justify-center space-y-2">
//               <UploadCloudIcon className="h-8 w-8 text-gray-500" />
//               <p className="text-gray-500">Drag and drop files to upload</p>
//               <label
//                 className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
//                 htmlFor="file-upload"
//               >
//                 Select Files
//               </label>
//               <input
//                 className="hidden"
//                 id="file-upload"
//                 type="file"
//                 onChange={handleVideoChange}
//               />
//             </div>
//           </div>
//           <div className="flex-1 space-y-4">
//             <div>
//               <Label
//                 htmlFor="title"
//                 className="text-lg font-semibold text-gray-700"
//               >
//                 <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//                 Lesson Title
//               </Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(event) => setTitle(event.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//               />
//             </div>
//             <div>
//               <Label
//                 htmlFor="course"
//                 className="text-lg font-semibold text-gray-700"
//               >
//                 <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//                 Course
//               </Label>
//               <div className="relative mt-1">
//               <select
//                 id="course"
//                 value={course}
//                 onChange={(event) => setCourse(event.target.value)}
//                 className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="">Select a course</option>
//                 {courses ? (
//                   courses.map((course) => (
//                     <option key={course._id} value={course._id}>
//                       {course.title}
//                     </option>
//                   ))
//                 ) : (
//                   <option value="">No courses available</option>
//                 )}
//               </select>
//             </div>
//             </div>
//             <div>
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
//           </div>
//         </div>
//         <div>
//           <Label htmlFor="description">Description</Label>
//           <ReactQuill
//             theme="snow"
//             value={content}
//             onChange={setContent}
//             modules={modules}
//             formats={formats}
//             className="text-sm h-56 overflow-y-auto"
//           />
//         </div>
//         <Button
//           type="submit"
//           className="bg-gray-900 text-white hover:bg-gray-800"
//         >
//           Update Lesson
//         </Button>
//       </form>
//       {message && (
//         <div
//           className={`mt-4 p-2 text-center rounded ${
//             message.includes("Error")
//               ? "bg-red-100 text-red-700"
//               : "bg-green-100 text-green-700"
//           }`}
//         >
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateLesson;
