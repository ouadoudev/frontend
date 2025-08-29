import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchSubjects } from "@/store/subjectSlice";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { motion } from "framer-motion";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Briefcase,
  Calculator,
  Code,
  Globe,
  LanguagesIcon,
  PenTool,
  Sparkles,
  Sun,
  ChevronDown,
} from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

const EducationalCycle = () => {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.subjects.entities);
  const isLoading = useSelector((state) => state.subjects.isLoading);
  const error = useSelector((state) => state.subjects.error);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCycle = queryParams.get("cycle");

  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [educationalLevel, setEducationalLevel] = useState("");
  const [stream, setStream] = useState("");

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (subjects.length > 0) {
      let filtered = subjects.filter(
        (subject) => subject.educationalCycle === selectedCycle
      );
      if (educationalLevel) {
        filtered = filtered.filter(
          (subject) => subject.educationalLevel === educationalLevel
        );
      }
      if (stream && selectedCycle === "Lycée") {
        filtered = filtered.filter((subject) => subject.stream === stream);
      }
      setFilteredSubjects(filtered);
    }
  }, [subjects, selectedCycle, educationalLevel, stream]);

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
    if (title.startsWith("Français")) return <LanguagesIcon className="mr-2" />;
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <div className="container z-30  mx-auto px-4 mt-16">
        <div className="flex justify-center">
          <div className="md:w-2/3">
          {isLoading && <p>Loading subjects...</p>}
          {error && <p>Error loading subjects: {error}</p>}
            <Card className="mb-6 bg-transparent border-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tighter sm:text-2xl md:text-3xl text-center text-gray-900 mb-3">
                  Subjects for {selectedCycle}
                </CardTitle>
                <div className="flex flex-wrap  gap-4 mb-6">
                  <Select
                    value={educationalLevel}
                    onValueChange={(value) =>
                      setEducationalLevel(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-[350px] border border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 px-6 py-5 text-left">
                      <SelectValue placeholder="Select Educational Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                      <SelectItem value="all">All Levels</SelectItem>
                      {selectedCycle === "Primaire" && (
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
                      {selectedCycle === "Collège" && (
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
                      {selectedCycle === "Lycée" && (
                        <>
                          <SelectItem value="Tronc Commun">
                            Tronc Commun
                          </SelectItem>
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

                  {selectedCycle === "Lycée" && educationalLevel && (
                    <Select
                      value={stream}
                      onValueChange={(value) =>
                        setStream(value === "all" ? "" : value)
                      }
                    >
                      <SelectTrigger className="w-[200px] border border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 px-6 py-5 text-left">
                        <SelectValue placeholder="Select Stream" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                        <SelectItem value="all">All Streams</SelectItem>
                        {educationalLevel === "Tronc Commun" && (
                          <>
                            <SelectItem value="Sciences">Sciences</SelectItem>
                            <SelectItem value="Lettres et Sciences Humaines">
                              Lettres et Sciences Humaines
                            </SelectItem>
                            <SelectItem value="Technologies">
                              Technologies
                            </SelectItem>
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
              </CardHeader>
              <CardContent>
                {filteredSubjects?.map((subject) => (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    key={subject._id}
                  >
                    <AccordionItem
                      value={`item-${subject._id}`}
                      className="border border-gray-200 rounded-2xl mb-4 overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <AccordionTrigger className="text-left px-6 py-5 hover:no-underline group">
                        <div
                          dir={getDirection(subject.title)}
                          className="flex items-center "
                        >
                          {getSubjectIcon(subject.title)}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            {subject.title}
                          </h3>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-5">
                        <p
                          className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 "
                          dir={getDirection(subject.title)}
                        >
                          {subject.description}
                        </p>
                        <Link to={`/subject/${subject._id}`} className="w-full">
                          <Button
                            variant="none"
                            className="w-[200px] ml-auto bg-transparent group-hover:bg-purple-600 group-hover:text-primary-foreground transition-colors duration-300"
                          >
                            Explore Subject
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
                {filteredSubjects?.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mt-12"
                  >
                    <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">
                      No subjects found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters to find more subjects.
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationalCycle;
