import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  ArrowRight,
  Sparkles,
  GraduationCap,
  School,
  BookOpen,
  X,
  Calculator,
  Sun,
  PenTool,
  Book,
  Atom,
  Globe,
  Code,
  Briefcase,
  LanguagesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

import { fetchSubjects } from "@/store/subjectSlice";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const PopularCourses = () => {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.subjects.entities);
  const isLoading = useSelector((state) => state.subjects.isLoading);
  const error = useSelector((state) => state.subjects.error);

  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [educationalCycle, setEducationalCycle] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");
  const [stream, setStream] = useState("");

  const clearFilters = () => {
    setEducationalCycle("");
    setEducationalLevel("");
    setStream("");
  };

  const getActiveFiltersCount = () => {
    return [educationalCycle, educationalLevel, stream].filter(Boolean).length;
  };

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (subjects.length > 0) {
      let filtered = subjects;

      if (educationalCycle) {
        filtered = filtered.filter(
          (subject) => subject.educationalCycle === educationalCycle
        );
      }
      if (educationalLevel) {
        filtered = filtered.filter(
          (subject) => subject.educationalLevel === educationalLevel
        );
      }
      if (stream && educationalCycle === "Lycée") {
        filtered = filtered.filter((subject) => subject.stream === stream);
      }
      filtered = filtered.filter((subject) => subject.enrolls > 0);
      const sortedSubjects = filtered
        .sort((a, b) => {
        const enrollCompare = b.enrolls - a.enrolls;
        if (enrollCompare !== 0) {
          return enrollCompare;
        }
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      })
        .slice(0, 6);
      setFilteredSubjects(sortedSubjects);
    }
  }, [subjects, educationalCycle, educationalLevel, stream]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">
        Error: {error}
      </div>
    );
  }

  const getDirection = (text) => {
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlChars.test(text) ? "rtl" : "ltr";
};

  const getSubjectIcon = (title) => {
    if (title.startsWith("Mathématiques"))
      return <Calculator className="mr-2" />;
    if (title.startsWith("Physique et Chimie"))
      return <Atom className="mr-2" />;
    if (title.startsWith("Sciences de la vie et de la terre"))
      return <Sun className="mr-2" />;
     if (title.startsWith("الفلسفة")) return <PenTool className="ml-2" />;
    if (title.startsWith("Informatique")) return <Code className="mr-2" />;
  if (title.startsWith("التاريخ والجغرافيا"))
      return <Globe className="ml-2" />;
    if (title.startsWith("Langue française"))
      return <LanguagesIcon className="mr-2" />;
   if (title.startsWith("اللغة العربية"))
      return <LanguagesIcon className="ml-2" />;
    if (title.startsWith("English")) return <LanguagesIcon className="mr-2" />;
    if (title.startsWith("Español")) return <LanguagesIcon className="mr-2" />;
    if (title.startsWith("التربية الإسلامية"))
      return <BookOpen className="ml-2" />;
    if (title.startsWith("Économie et comptabilité"))
      return <Briefcase className="mr-2" />;
    return null;
  };

  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explorez{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Les Matières les Plus Suivies
            </span>
          </h2>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center text-gray-900 mb-3"></h2>
          <p className="text-lg text-gray-600 text-center mb-8">Explorez les matières les plus populaires parmi nos étudiants et démarrez votre apprentissage.</p>
        </motion.div>
        <div className="w-full max-w-3xl mx-auto p-4 ">
          <div className="flex flex-wrap gap-4">
            <Select
              value={educationalCycle}
              onValueChange={(value) => {
                setEducationalCycle(value === "all" ? "" : value);
                setEducationalLevel("");
                setStream("");
              }}
            >
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Educational Cycle" />
                <GraduationCap className="w-4 h-4 ml-2 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cycles</SelectItem>
                <SelectItem value="Primaire">Primaire</SelectItem>
                <SelectItem value="Collège">Collège</SelectItem>
                <SelectItem value="Lycée">Lycée</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={educationalLevel}
              onValueChange={(value) =>
                setEducationalLevel(value === "all" ? "" : value)
              }
              disabled={!educationalCycle}
            >
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Educational Level" />
                <School className="w-4 h-4 ml-2 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {educationalCycle === "Primaire" && (
                  <>
                    <SelectItem value="1ère année Primaire">
                      1ère année Primaire
                    </SelectItem>
                    <SelectItem value="2ème année Primaire">
                      2ème année Primaire
                    </SelectItem>
                    <SelectItem value="3ème année Primaire">
                      3ème année Primaire
                    </SelectItem>
                    <SelectItem value="4ème année Primaire">
                      4ème année Primaire
                    </SelectItem>
                    <SelectItem value="5ème année Primaire">
                      5ème année Primaire
                    </SelectItem>
                    <SelectItem value="6ème année Primaire">
                      6ème année Primaire
                    </SelectItem>
                  </>
                )}
                {educationalCycle === "Collège" && (
                  <>
                    <SelectItem value="1ère année collège">
                      1ère année collège
                    </SelectItem>
                    <SelectItem value="2ème année collège">
                      2ème année collège
                    </SelectItem>
                    <SelectItem value="3ème année collège">
                      3ème année collège
                    </SelectItem>
                  </>
                )}
                {educationalCycle === "Lycée" && (
                  <>
                    <SelectItem value="Tronc Commun">Tronc Commun</SelectItem>
                    <SelectItem value="1ère année du Baccalauréat">
                      1ère année du Baccalauréat
                    </SelectItem>
                    <SelectItem value="2ème année du Baccalauréat">
                      2ème année du Baccalauréat
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            {educationalCycle === "Lycée" && educationalLevel && (
              <Select
                value={stream}
                onValueChange={(value) =>
                  setStream(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Stream" />
                  <BookOpen className="w-4 h-4 ml-2 opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  {educationalLevel === "Tronc Commun" && (
                    <>
                      <SelectItem value="Sciences">Sciences</SelectItem>
                      <SelectItem value="Lettres et Sciences Humaines">
                        Lettres et Sciences Humaines
                      </SelectItem>
                      <SelectItem value="Technologies">Technologies</SelectItem>
                    </>
                  )}
                  {educationalLevel === "1ère année du Baccalauréat" && (
                    <>
                      <SelectItem value="Sciences Mathématiques">
                        Sciences Mathématiques
                      </SelectItem>
                      <SelectItem value="Sciences Expérimentales">
                        Sciences Expérimentales
                      </SelectItem>
                      <SelectItem value="Sciences et Technologies Électriques">
                        Sciences et Technologies Électriques
                      </SelectItem>
                      <SelectItem value="Sciences et Technologies Mécaniques">
                        Sciences et Technologies Mécaniques
                      </SelectItem>
                      <SelectItem value="Lettres et Sciences Humaines">
                        Lettres et Sciences Humaines
                      </SelectItem>
                      <SelectItem value="Sciences Économiques et Gestion">
                        Sciences Économiques et Gestion
                      </SelectItem>
                    </>
                  )}
                  {educationalLevel === "2ème année du Baccalauréat" && (
                    <>
                      <SelectItem value="Sciences Mathématiques A">
                        Sciences Mathématiques A
                      </SelectItem>
                      <SelectItem value="Sciences Mathématiques B">
                        Sciences Mathématiques B
                      </SelectItem>
                      <SelectItem value="Sciences Physiques">
                        Sciences Physiques
                      </SelectItem>
                      <SelectItem value="Sciences de la Vie et de la Terre">
                        Sciences de la Vie et de la Terre
                      </SelectItem>
                      <SelectItem value="Sciences Agronomiques">
                        Sciences Agronomiques
                      </SelectItem>
                      <SelectItem value="Sciences et Technologies Électriques">
                        Sciences et Technologies Électriques
                      </SelectItem>
                      <SelectItem value="Sciences et Technologies Mécaniques">
                        Sciences et Technologies Mécaniques
                      </SelectItem>
                      <SelectItem value="Lettres">Lettres</SelectItem>
                      <SelectItem value="Sciences Humaines">
                        Sciences Humaines
                      </SelectItem>
                      <SelectItem value="Sciences Économiques">
                        Sciences Économiques
                      </SelectItem>
                      <SelectItem value="Techniques de Gestion et Comptabilité">
                        Techniques de Gestion et Comptabilité
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {educationalCycle && (
                <Badge variant="secondary">
                  {educationalCycle}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 hover:bg-transparent"
                    onClick={() => setEducationalCycle("")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">
                      Remove {educationalCycle} filter
                    </span>
                  </Button>
                </Badge>
              )}
              {educationalLevel && (
                <Badge variant="secondary">
                  {educationalLevel}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 hover:bg-transparent"
                    onClick={() => setEducationalLevel("")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">
                      Remove {educationalLevel} filter
                    </span>
                  </Button>
                </Badge>
              )}
              {stream && (
                <Badge variant="secondary">
                  {stream}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 hover:bg-transparent"
                    onClick={() => setStream("")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {stream} filter</span>
                  </Button>
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                getActiveFiltersCount() === 0 && "opacity-50 cursor-not-allowed"
              )}
              disabled={getActiveFiltersCount() === 0}
            >
              Clear all filters
            </Button>
          </div>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredSubjects.slice(0, 6).map((subject) => (
            <motion.div key={subject._id} variants={cardVariants}>
              <Card className="h-full flex flex-col rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group overflow-hidden relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
                <div className="absolute blur duration-500 group-hover:blur-none w-72 h-72 rounded-full group-hover:translate-x-12 group-hover:translate-y-12 bg-blue-500 right-1 -bottom-24"></div>
                <div className="absolute blur duration-500 group-hover:blur-none w-12 h-12 rounded-full group-hover:translate-x-12 group-hover:translate-y-2 bg-gradient-to-l from-blue-600 to-purple-600 right-12 bottom-12"></div>
                <div className="absolute blur duration-500 group-hover:blur-none w-36 h-36 rounded-full group-hover:translate-x-12 group-hover:-translate-y-12 bg-gradient-to-r from-blue-600 to-purple-600 right-1 -top-12"></div>
                <div className="absolute blur duration-500 group-hover:blur-none w-24 h-24 bg-purple-600 rounded-full group-hover:-translate-x-10 group-hover:-translate-y-10"></div>
                <div className="relative z-10">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge
                        variant="secondary"
                        className="mb-2 px-2 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                      >
                        {subject.educationalCycle}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-primary px-2 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                      >
                        {subject.courses.length} Courses
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 flex items-center" dir={getDirection(subject.title)}>
                      {getSubjectIcon(subject.title)}
                      {subject.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-pretty mb-4 line-clamp-3 text-gray-600 dark:text-gray-300 h-24"  dir={getDirection(subject.title)}>
                      {subject.description}
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {subject.educationalLevel}
                      </div>
                      {subject.stream && (
                        <div className="flex items-center text-muted-foreground">
                          <BookOpen className="mr-2 h-4 w-4" />
                          {subject.stream}
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        {subject.enrolls.toLocaleString()} étudiants
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter >
                    <Link to={`/subject/${subject._id}`} className="w-full">
                      <Button
                        variant="none"
                        className="w-[200px] ml-auto bg-transparent group-hover:bg-purple-600 group-hover:text-primary-foreground transition-colors duration-300"
                      >
                        Explore Subject
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        {filteredSubjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No subjects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to find more subjects.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PopularCourses;