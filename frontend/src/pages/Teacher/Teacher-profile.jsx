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
import {
  Mail,
  Phone,
  User,
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  MailIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "@/store/userSlice";
import { loggedUser } from "@/store/authSlice";
import { createConversation } from "@/store/conversationSlice";
import { fetchSubjectById } from "@/store/subjectSlice";
import { fetchReviews } from "@/store/reviewSlice";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        if (visitor.role === "admin" || visitor.role === "teacher") {
          navigate("/dashboard/messages");
        } else {
          navigate("/messages");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-muted-foreground">
                 Chargement du profil de l'enseignant...
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
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <p className="text-red-600 font-medium">
                 Erreur lors du chargement du profil de l'enseignant
                </p>
                <p className="text-muted-foreground">
                  {error.message || error.error || "Une erreur s'est produite"}
                </p>
                <Button
                  onClick={() => dispatch(fetchUserById(id))}
                  variant="outline"
                >
                  Réessayer
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
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Enseignant non trouvé</p>
                <Button onClick={() => window.history.back()} variant="outline">
                 Retourner
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

  const formatLastLogin = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-14">
            <div className="flex-shrink-0 ml-4">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={
                    teacherData.user_image?.url ||
                    "/placeholder.svg?height=120&width=120"
                  }
                  alt={teacherData.username || "Unknown Teacher"}
                />
                <AvatarFallback className="text-2xl">
                  {(teacherData.username || "Unknown Teacher")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-3xl font-bold">
                  {teacherData.username || "Unknown Teacher"}
                </h1>
                <div className="flex gap-2">
                  <Badge className={getRoleBadgeColor(teacherData.role)}>
                    {teacherData.role?.charAt(0).toUpperCase() +
                      teacherData.role?.slice(1)}
                  </Badge>
                  {teacherData.isOnline && (
                    <Badge className="bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      En ligne
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {teacherData.email || "No email provided"}
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {teacherData.discipline || "No discipline specified"}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed max-w-[620px]"
               dir={getDirection(teacherData.bio )}>
                {teacherData.bio || "No bio available"}
              </p>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  className="bg-indigo-500 w-36"
                  onClick={handleContactInstructor}
                >
                  <MailIcon className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-center">{totalCourses}</p>
                <p className="text-sm text-muted-foreground">Cours actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-center">
                  {totalStudents}
                </p>
                <p className="text-sm text-muted-foreground">Total d'étudiants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-center">
                  {averageRating}
                </p>
                <p className="text-sm text-muted-foreground ">Note moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Cours actuels
            </CardTitle>
            <CardDescription>Cours actifs ce semestre</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 px-1 ">
              <div className="space-y-3">
                {teacherData.courses && teacherData.courses.length > 0 ? (
                  teacherData.courses.map((course, index) => {
                    const subjectData = subjectsData[course.subject];
                    const courseReviews = reviewsData[course._id] || [];
                    const courseReviewCount = courseReviews.length;
                    return (
                      <div
                        key={course._id || index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">
                              {course.title || "Untitled Course"}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {subjectsData[course.subject] && (
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                {subjectsData[course.subject].title}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {courseReviewCount} avis
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-medium text-sm text-center">
                            {course.enrolls || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            étudiants
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
                    className="text-center mt-2"
                  >
                    <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">
                      Aucun cours trouvé
                    </h3>
                    <p className="text-muted-foreground">
                      Aucun cours n’est disponible pour le moment.
                    </p>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
             Témoignages des étudiants
            </CardTitle>
            <CardDescription>
           Ce que les étudiants disent de cet enseignant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewsStatus === "loading" && (
                <p className="text-muted-foreground text-center py-4">
                  Chargement des avis...
                </p>
              )}

              {reviewsStatus === "failed" && (
                <p className="text-red-600 text-center py-4">
                  {reviewsError || "Échec du chargement des avis"}
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
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={
                              testimonial.user?.user_image?.url ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={testimonial.user?.username || "Student"}
                          />
                          <AvatarFallback>
                            {(testimonial.user?.username || "S")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-sm">
                              {testimonial.user?.username ||
                                "Anonymous Student"}
                            </p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
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
                                  ).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : ""}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed">
                            "{testimonial.comment || "Excellent enseignant !"}"
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
                  className="text-center mt-2"
                >
                  <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">
                    Aucun avis trouvé
                  </h3>
                  <p className="text-muted-foreground">
                    Aucun avis n’a encore été publié pour le moment.
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Section */}
    </div>
  );
};

export default TeacherProfile;
