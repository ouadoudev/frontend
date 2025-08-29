import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Mail,
  BookOpen,
  Users,
  GraduationCap,
  MailIcon,
  Sparkles,
  Star,
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Store actions
import { fetchUserById } from "@/store/userSlice";
import { loggedUser } from "@/store/authSlice";
import { createConversation } from "@/store/conversationSlice";
import { fetchSubjectById } from "@/store/subjectSlice";
import { fetchReviews } from "@/store/reviewSlice";

const TeacherProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [subjectsData, setSubjectsData] = useState({});
  const [reviewsData, setReviewsData] = useState({});

  const {
    user: teacherData,
    loading,
    error,
  } = useSelector((state) => ({
    user: state.user?.user || null,
    loading: state.user?.status === "loading" || false,
    error: state.user?.error || null,
  }));

  const { status: reviewsStatus, error: reviewsError } = useSelector(
    (state) =>
      state.reviews || {
        reviews: [],
        status: "idle",
        error: null,
      }
  );

  const visitor = useSelector(loggedUser);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (teacherData?.courses && Array.isArray(teacherData.courses)) {
      // Fetch subjects
      const fetchSubjects = async () => {
        const subjectPromises = teacherData.courses
          .filter(
            (course) => course.subject && typeof course.subject === "string"
          )
          .map(async (course) => {
            try {
              const result = await dispatch(fetchSubjectById(course.subject));
              return { subjectId: course.subject, data: result.payload };
            } catch (error) {
              console.error(
                `Failed to fetch subject ${course.subject}:`,
                error
              );
              return { subjectId: course.subject, data: null };
            }
          });

        const subjects = await Promise.all(subjectPromises);
        const subjectsMap = {};
        subjects.forEach(({ subjectId, data }) => {
          if (data) {
            subjectsMap[subjectId] = data;
          }
        });
        setSubjectsData(subjectsMap);
      };

      // Fetch reviews for each course
      const fetchCourseReviews = async () => {
        const reviewPromises = teacherData.courses.map(async (course) => {
          try {
            const result = await dispatch(
              fetchReviews({ courseId: course._id })
            );
            return { courseId: course._id, reviews: result.payload };
          } catch (error) {
            console.error(
              `Failed to fetch reviews for course ${course._id}:`,
              error
            );
            return { courseId: course._id, reviews: [] };
          }
        });

        const reviews = await Promise.all(reviewPromises);
        const reviewsMap = {};
        reviews.forEach(({ courseId, reviews }) => {
          reviewsMap[courseId] = reviews;
        });
        setReviewsData(reviewsMap);
      };

      fetchSubjects();
      fetchCourseReviews();
    }
  }, [teacherData?.courses, dispatch]);

  const handleContactInstructor = () => {
    dispatch(
      createConversation({
        userId: visitor.id,
        teacherId: teacherData._id,
        groupTitle: visitor.id,
      })
    ).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        if (visitor.role === "teacher") {
          navigate("/dashboard/messages");
        } else if (visitor.role === "admin") {
          navigate("/dashboard/admin/messages");
        } else {
          navigate("/messages");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 ">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-muted-foreground">
                  Loading teacher profile...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 ">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <p className="text-red-600 font-medium">
                  Error loading teacher profile
                </p>
                <p className="text-muted-foreground">
                  {error.message || error.error || "Something went wrong"}
                </p>
                <Button
                  onClick={() => dispatch(fetchUserById(id))}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="max-w-6xl mx-auto p-4 ">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Teacher not found</p>
                <Button onClick={() => window.history.back()} variant="outline">
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper functions
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "teacher":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  // Calculate totals with null checks
  const totalStudents =
    teacherData.courses?.reduce(
      (sum, course) => sum + (course.enrolls || 0),
      0
    ) || 0;
  const totalCourses = teacherData.courses?.length || 0;
  const allReviews = Object.values(reviewsData).flat();
  const averageRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          allReviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-7xl mx-auto p-4  space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-4 ">
          <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-center md:items-start">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage
                  src={
                    teacherData.user_image?.url ||
                    "/placeholder.svg?height=120&width=120"
                  }
                  alt={teacherData.username || "Unknown Teacher"}
                />
                <AvatarFallback className="text-xl sm:text-2xl">
                  {(teacherData.username || "Unknown Teacher")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center md:justify-start">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {teacherData.username || "Unknown Teacher"}
                </h1>
                <div className="flex gap-2 justify-center md:justify-start">
                  <Badge className={getRoleBadgeColor(teacherData.role)}>
                    {teacherData.role?.charAt(0).toUpperCase() +
                      teacherData.role?.slice(1)}
                  </Badge>
                  {teacherData.isOnline && (
                    <Badge className="bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  {teacherData.email || "No email provided"}
                </div>

                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <GraduationCap className="w-4 h-4" />
                  {teacherData.discipline || "No discipline specified"}
                </div>
              </div>

              <p
                className="text-muted-foreground leading-relaxed max-w-[620px] mx-auto md:mx-0"
                dir={getDirection(teacherData.bio)}
              >
                {teacherData.bio || "No bio available"}
              </p>

              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                <Button
                  className="bg-indigo-500 w-full sm:w-36"
                  onClick={handleContactInstructor}
                  size="sm"
                >
                  <MailIcon className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          {/* Active Courses Card */}
          <Card>
            <CardContent className="p-4 ">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold">
                    {totalCourses}
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Active Courses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Students Card */}
          <Card>
            <CardContent className="p-4 ">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold">
                    {totalStudents}
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Total Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Rating Card */}
          <Card>
                <CardContent className="p-4 ">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold">
                    {averageRating}
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Average Rating
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Courses & Testimonials Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 ">
            <CardTitle className="flex items-center galg:p-2 text-lg sm:text-xl">
              Current Courses
            </CardTitle>
            <CardDescription>Active courses this semester</CardDescription>
          </CardHeader>
          <CardContent className="p-4 ">
            <ScrollArea className="h-80 px-1">
              <div className="space-y-3">
                {teacherData.courses && teacherData.courses.length > 0 ? (
                  teacherData.courses.map((course, index) => {
                    const subjectData = subjectsData[course.subject];
                    const courseReviews = reviewsData[course._id] || [];
                    const courseReviewCount = courseReviews.length;
                    return (
                      <div
                        key={course._id || index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm md:text-base truncate">
                              {course.title || "Untitled Course"}
                            </p>
                          </div>

                          {/* Subject + Reviews + Students (inline on mobile, split on sm+) */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {subjectData && (
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                {subjectData.title}
                              </span>
                            )}

                            {/* Reviews */}
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {courseReviewCount} reviews
                            </span>

                            {/* Students count: inline on mobile, separate on sm+ */}
                            <span className="flex items-center gap-1 sm:hidden">
                              <Users className="w-3 h-3" />
                              {course.enrolls || 0} students
                            </span>
                          </div>
                        </div>

                        {/* Right side: only visible on sm+ */}
                        <div className="hidden sm:block text-left sm:text-right shrink-0">
                          <p className="font-semibold text-base md:text-lg">
                            {course.enrolls || 0}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            students
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <Sparkles className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      No courses found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      No courses are available at the moment.
                    </p>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 ">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Users className="w-5 h-5" />
              Student Testimonials
            </CardTitle>
            <CardDescription>
              What students say about this teacher
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 ">
            <div className="space-y-4">
              {reviewsStatus === "loading" && (
                <p className="text-muted-foreground text-center py-4">
                  Loading reviews...
                </p>
              )}

              {reviewsStatus === "failed" && (
                <p className="text-red-600 text-center py-4">
                  {reviewsError || "Failed to load reviews"}
                </p>
              )}

              {reviewsStatus === "succeeded" && allReviews.length > 0 ? (
                allReviews.slice(0, 6).map((testimonial, index) => {
                  const course = teacherData.courses.find(
                    (c) => c._id === testimonial.courseId
                  );

                  return (
                    <div
                      key={testimonial._id || index}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                          <AvatarImage
                            src={
                              testimonial.user?.user_image?.url ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={testimonial.user?.username || "Student"}
                          />
                          <AvatarFallback className="text-xs">
                            {(testimonial.user?.username || "S")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-medium text-sm">
                              {testimonial.user?.username ||
                                "Anonymous Student"}
                            </p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    i < (testimonial.rating || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {testimonial.createdAt
                                ? new Date(
                                    testimonial.createdAt
                                  ).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : ""}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed">
                            "{testimonial.comment || "Great teacher!"}"
                          </p>

                          {course && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Course: {course.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <Sparkles className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    No reviews found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No reviews have been posted yet.
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherProfile;
