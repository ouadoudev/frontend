import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSubjectById, fetchCourseBySubjectId } from "@/store/subjectSlice";
import { loggedUser } from "@/store/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle,
  GraduationCapIcon,
  Info,
  School2Icon,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchReviews } from "@/store/reviewSlice";


const Subject = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subject, courses, status, error } = useSelector(
    (state) => state.subjects
  );
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector(loggedUser);

  useEffect(() => {
    dispatch(fetchSubjectById(id));
    dispatch(fetchCourseBySubjectId(id));
  }, [dispatch, id]);

  const handlePlayCourse = async (courseId) => {
    if (user) {
      try {
        await dispatch(fetchReviews({ courseId }));
        navigate(`/courses/${courseId}`);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    } else {
      alert("Please login to access the lesson");
    }
  };

  const filteredCourses = courses?.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const newCourses = courses
    ?.filter((course) => {
      const courseDate = new Date(course.createdAt);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return courseDate > oneMonthAgo;
    })
    .slice(0, 4);

  const teachers = [...new Set(courses?.map((course) => course.teacher))].slice(
    0,
    4
  );

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div
                className={`bottom-4 ${
                  getDirection(subject?.title) === "rtl" ? "right-4" : "left-4"
                }`}
              >
                <Badge
                  variant="secondary"
                  className="m-2 px-4 py-1 text-xl"
                  dir={getDirection(subject?.title)}
                >
                  {subject?.title}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p
                className="text-muted-foreground"
                dir={getDirection(subject?.description)}
              >
                {subject?.description}
              </p>
              <div
                className={`flex items-center mt-4 text-sm text-muted-foreground ${
                  getDirection(subject?.title) === "rtl"
                    ? "flex-row-reverse justify-end"
                    : "space-x-4"
                }`}
              >
                {[
                  {
                    icon: School2Icon,
                    text: subject?.educationalCycle,
                  },
                  {
                    icon: GraduationCapIcon,
                    text: subject?.educationalLevel,
                  },
                  { icon: Users, text: `${subject?.enrolls} Students` },
                ].map((item, index) => (
                  <span
                    key={index}
                    className={`flex items-center ${
                      getDirection(subject?.title) === "rtl" ? "ml-4" : ""
                    }`}
                  >
                    <item.icon
                      className={`${
                        getDirection(subject?.title) === "rtl" ? "ml-1" : "mr-1"
                      } h-4 w-4`}
                    />
                    {item.text}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-between p-4 border-t border-gray-200">
              <h2 className="text-2xl text-center font-bold mb-8">
                {getDirection(subject?.title || "") === "rtl"
                  ? "الدروس المميزة"
                  : "Cours"}
              </h2>
              <Carousel className="w-full">
                <CarouselContent>
                  {newCourses?.map((course) => {
                    const titleDir = getDirection(course.title);
                    const descriptionDir = getDirection(course.description);
                    return (
                      <CarouselItem
                        key={course._id}
                        className="md:basis-1/2 lg:basis-1/2 "
                      >
                        <Card className="flex flex-col w-80">
                          <CardHeader className="p-0">
                            <img
                              src={course.thumbnail.url}
                              alt={`${course.title} thumbnail`}
                              className="w-full h-32 object-cover rounded-t-lg"
                            />
                          </CardHeader>

                          <CardContent className="flex-grow p-4">
                            <h3
                              className={`text-lg font-semibold mb-2 ${
                                titleDir === "rtl" ? "text-right" : "text-left"
                              }`}
                              dir={titleDir}
                            >
                              {course.title}
                            </h3>

                            <p
                              className={`text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 ${
                                descriptionDir === "rtl"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                              dir={descriptionDir}
                            >
                              {course.description}
                            </p>

                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Star className="w-4 h-4 mr-1 text-yellow-400" />
                              <span>{course.rating || "N/A"}</span>
                            </div>
                          </CardContent>

                          <CardFooter className="p-4">
                            <Button
                              onClick={() => handlePlayCourse(course._id)}
                              className="w-full bg-gradient-to-br from-blue-600 to-purple-600"
                            >
                              {titleDir === "rtl"
                                ? "ابدأ الدرس"
                                : "Commencer le cours"}
                            </Button>
                          </CardFooter>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </CardFooter>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="mb-4 mx-auto">
                {getDirection(subject?.title || "") === "rtl"
                  ? "المنهج"
                  : "Programme"}
              </CardTitle>
              <CardDescription>
                <div className="relative w-full mb-2">
                  <label className="flex items-center gap-2 w-full">
                    <Search className="absolute left-3 top-1/2  transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={
                        getDirection(subject?.title || "") === "rtl"
                          ? "ابحث عن الدروس..."
                          : "Recherchez des cours..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-1/3 pl-10"
                    />
                  </label>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === "loading" ? (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : status === "failed" ? (
                <div className="col-span-full text-center text-red-500 dark:text-red-400">
                  Error: {error}
                </div>
              ) : (
                filteredCourses?.map((course) => (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value={`item-${course._id}`}
                      key={course._id}
                    >
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                          <h3
                            className="text-lg font-semibold text-gray-900 dark:text-gray-50"
                            dir={getDirection(course.title)}
                          >
                            {course.title}
                          </h3>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p
                          className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2"
                          dir={getDirection(course.description)}
                        >
                          {course.description}
                        </p>
                        <p
                          className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2"
                          dir={getDirection(course.title)}
                        >
                          {getDirection(course.title) === "rtl" ? (
                            <>
                              ابدأ تدريبك مع
                              <span className="text-sm text-gray-950 ml-1">
                                {course.lessons.length} دروس
                              </span>
                              الأساسية للنجاح
                            </>
                          ) : (
                            <>
                              Démarrez votre formation avec
                              <span className="text-sm text-gray-950 ml-1">
                                {course.lessons.length} leçons
                              </span>
                              clés pour réussir
                            </>
                          )}
                        </p>

                        <div className="flex justify-between items-center pt-1">
                          <div className="flex items-center">
                            <img
                              alt={`${course.teacher.username} avatar`}
                              className="w-10 h-10 rounded-full mr-2"
                              src={
                                course.teacher.user_image?.url ||
                                "/placeholder.svg"
                              }
                            />
                            <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                              {course.teacher.username}
                            </span>
                          </div>
                          <Button onClick={() => handlePlayCourse(course._id)} className="bg-gradient-to-br from-blue-600 to-purple-600">
                            Start Course
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
              )}
              {filteredCourses?.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mt-12"
                >
                  <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">
                    No courses found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to find more courses.
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Carousel>
            <h2 className="text-2xl text-center font-bold mb-8">
              {getDirection(subject?.title || "") === "rtl"
                ? "المدرسون" // عربي (RTL)
                : "Enseignants"}
            </h2>
            <CarouselContent>
              {teachers
                .filter(
                  (value, index, self) =>
                    index === self.findIndex((t) => t._id === value._id)
                )
                .map(({ _id, user_image, username, bio }) => (
                  <CarouselItem key={_id} className="md:basis-1/2 lg:basis-1/2">
                    <Card className="flex flex-col border-hidden">
                      <CardHeader>
                        <div className="flex flex-col items-center gap-4">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={user_image?.url} alt={username} />
                            <AvatarFallback>
                              {username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-bold">{username}</p>
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/teacher/${_id}`)}
                          className="mx-auto hover:"
                        >
                          {getDirection(user?.name || "") === "rtl"
                            ? "عرض الملف الشخصي"
                            : "Voir le profil"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex justify-center">
                {getDirection(subject?.title || "") === "rtl"
                  ? "تفاصيل المادة"
                  : "Détails du sujet"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4
                  className={`font-bold mb-3 flex items-center text-base ${
                    getDirection(subject?.title) === "rtl"
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  <BookOpen
                    className={`${
                      getDirection(subject?.title) === "rtl" ? "ml-2" : "mr-2"
                    } h-8 w-8`}
                  />
                  {getDirection(subject?.title) === "rtl"
                    ? "ماذا ستتعلم :"
                    : "Ce que vous allez apprendre :"}
                </h4>
                <ul className="space-y-2">
                  {subject?.objectives &&
                    subject?.objectives.map((objective, index) => (
                      <li
                        key={index}
                        className={`flex items-start ${
                          getDirection(subject.title) === "rtl"
                            ? "flex-row-reverse"
                            : ""
                        }`}
                      >
                        <CheckCircle
                          className={`${
                            getDirection(subject.title) === "rtl"
                              ? "ml-2"
                              : "mr-2"
                          } h-5 w-5 text-green-500 flex-shrink-0 mt-0.5`}
                        />
                        <span
                          className="text-start text-sm"
                          dir={getDirection(objective)}
                        >
                          {objective}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subject;
