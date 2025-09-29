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
  Languages,
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
        .slice(0, 3);
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
    if (title.startsWith("Sciences de la Vie et de la Terre"))
      return <Sun className="mr-2" />;
    if (title.startsWith("الفلسفة")) return <PenTool className="ml-2" />;
    if (title.startsWith("Informatique")) return <Code className="mr-2" />;
    if (title.startsWith("التاريخ والجغرافيا"))
      return <Globe className="ml-2" />;
    if (title.startsWith("Français"))
      return <Languages className="mr-2" />;
    if (title.startsWith("اللغة العربية"))
      return <Languages className="ml-2" />;
    if (title.startsWith("English")) return <Languages className="mr-2" />;
    if (title.startsWith("Español")) return <Languages className="mr-2" />;
    if (title.startsWith("التربية الإسلامية"))
      return <BookOpen className="ml-2" />;
    if (title.startsWith("Économie et comptabilité"))
      return <Briefcase className="mr-2" />;
    return null;
  };

  return (
   <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Découvrez{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nos Matières Phares
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Plongez dans les matières les plus prisées par nos étudiants et boostez votre apprentissage dès aujourd'hui.
          </p>
        </motion.div>
        <div className="w-full max-w-3xl mx-auto p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <Select
              value={educationalCycle}
              onValueChange={(value) => {
                setEducationalCycle(value === "all" ? "" : value);
                setEducationalLevel("");
                setStream("");
              }}
            >
              <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <SelectValue placeholder="Cycle Éducatif" />
                <GraduationCap className="w-4 h-4 ml-2 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Cycles</SelectItem>
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
              <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <SelectValue placeholder="Niveau Éducatif" />
                <School className="w-4 h-4 ml-2 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Niveaux</SelectItem>
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
                <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <SelectValue placeholder="Filière" />
                  <BookOpen className="w-4 h-4 ml-2 opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les Filières</SelectItem>
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

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {educationalCycle && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
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
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
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
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
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
              Réinitialiser les filtres
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
              <Card className="h-full flex flex-col rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20" />
                  <CardHeader className="pb-3 pt-6 px-6 relative z-10">
                    <div className="flex items-start justify-between">
                      <Badge
                        variant="secondary"
                        className="mb-2 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium rounded-full"
                      >
                        {subject.educationalCycle}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-medium rounded-full"
                      >
                        {subject.courses.length} Cours
                      </Badge>
                    </div>
                    <CardTitle
                      className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 flex items-center"
                      dir={getDirection(subject.title)}
                    >
                      {getSubjectIcon(subject.title)}
                      {subject.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-4 flex-grow relative z-10">
                    <p
                      className="text-sm text-gray-600 dark:text-gray-300 h-16 mb-4 line-clamp-3 leading-relaxed"
                      dir={getDirection(subject.title)}
                    >
                      {subject.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {subject.educationalLevel}
                      </div>
                      {subject.stream && (
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" />
                          {subject.stream}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {subject.enrolls.toLocaleString()} étudiants
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0 relative z-10">
                    <Link to={`/subject/${subject._id}`} className="w-full">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300"
                      >
                        Explorer la Matière
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
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucune matière trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ajustez vos filtres pour découvrir plus de matières.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PopularCourses;