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
} from "lucide-react";
import Quill from "quill";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useNavigate } from "react-router-dom";

window.katex = katex;

const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

const CreateLesson = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courses = useSelector((state) => state.courses.courses);
  const teacher = useSelector(loggedUser);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [course, setCourse] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [message, setMessage] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCourses()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    const observer = new MutationObserver(() => {});

    if (quillRef.current) {
      observer.observe(quillRef.current, { childList: true, subtree: true });
    }

    return () => {
      if (quillRef.current) {
        observer.disconnect();
      }
    };
  }, [quillRef]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handlePdfChange = (event) => {
    const selectedPdf = event.target.files[0];
    setPdf(selectedPdf);
  };

  const handleVideoChange = (event) => {
    const selectedFile = event.target.files[0];
    setVideo(selectedFile);
    setVideoPreviewUrl(URL.createObjectURL(selectedFile));
    setHasVideo(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    setVideo(selectedFile);
    setVideoPreviewUrl(URL.createObjectURL(selectedFile));
    setHasVideo(true);
  };

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("course", course);
    formData.append("teacher", teacher.id);
    formData.append("published", published ? "true" : "false");
    formData.append("video", video);
    if (pdf) {
      formData.append("pdf", pdf);
    }

    try {
      await dispatch(addLesson(formData));
      setMessage("Lesson created successfully!");
      dispatch(fetchLessons());
      setTitle("");
      setContent("");
      setCourse("");
      setPublished(false);
      setVideo(null);
      setVideoPreviewUrl(null);
      setHasVideo(false);
      setTimeout(() => {
        navigate("/lessons");
      }, 1000);
    } catch (error) {
      if (error.response) {
        setMessage(`Error creating lesson: ${error.response.data.error}`);
      } else {
        setMessage("Error creating lesson: " + error.message);
      }
    }
  };

  const filteredCourses = courses.filter(
    (course) => course.teacher.username === teacher.username
  );

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
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="title"
                  className="text-lg font-semibold text-gray-700"
                >
                  <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
                  Lesson Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  dir={getDirection(title)}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter lesson title"
                />
              </div>
              <div>
                <Label
                  htmlFor="course"
                  className="text-lg font-semibold text-gray-700"
                >
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
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
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
                <Label className="text-lg font-semibold text-gray-700">
                  Visibility
                </Label>
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
              <div className="space-y-2">
                <Label
                  htmlFor="pdf"
                  className="text-lg font-semibold text-gray-700"
                >
                  <UploadCloudIcon className="inline-block mr-2 h-5 w-5" />
                  Upload PDF (Optional)
                </Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="block w-full text-sm text-gray-900 file:mr-4  file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

              </div>
            </div>
            <div className="space-y-4">
              <Label
                htmlFor="video"
                className="text-lg font-semibold text-gray-700"
              >
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
                  <p className="mt-1 text-sm text-gray-600">
                    Drag and drop your video here, or click to select
                  </p>
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
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
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
            <Label
              htmlFor="description"
              className="text-lg font-semibold text-gray-700"
            >
              <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
              Lesson Content
            </Label>
            <div className="h-64 sm:h-72 md:h-80 overflow-y-auto border border-gray-300 rounded-md shadow-sm">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className="h-full bg-white"
                ref={quillRef}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            Create Lesson
          </Button>
        </form>
        {message && (
          <div
            className={`p-4 text-sm sm:text-base ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            } rounded-b-lg`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLesson;
