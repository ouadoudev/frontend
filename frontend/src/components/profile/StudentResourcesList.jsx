import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentResourcesBySubject, reset } from "@/store/resourcesSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const StudentResourcesList = ({ user }) => {
  const dispatch = useDispatch();
  const { studentResources, isLoading, isError, message } = useSelector(
    (state) => state.resources
  );
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [expandedTypes, setExpandedTypes] = useState(new Set());
  const [showResource, setShowResource] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [currentResourceTitle, setCurrentResourceTitle] = useState("");

  useEffect(() => {
    const studentId = user?.id || user?._id;
    if (studentId) {
      dispatch(getStudentResourcesBySubject(studentId));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, user]);

  const toggleSubject = (subject) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedSubjects(newExpanded);
  };

  const toggleType = (subject, type) => {
    const typeKey = `${subject}-${type}`;
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(typeKey)) {
      newExpanded.delete(typeKey);
    } else {
      newExpanded.add(typeKey);
    }
    setExpandedTypes(newExpanded);
  };

  const groupResourcesByType = (resources) => {
    const grouped = resources.reduce((acc, resource) => {
      const type = resource.type || "Autre";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(resource);
      return acc;
    }, {});
    return grouped;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Exercice":
        return "bg-green-100 text-green-800 border-green-200";
      case "Examen":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Card className="flex-1 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
        <CardHeader className="flex flex-row items-center  space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Mes Ressources Éducatives
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center min-h-64">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Chargement des ressources...</p>
              </div>
            </div>
          )}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 mb-2">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-red-600">{message}</p>
              <button
                onClick={() =>
                  dispatch(getStudentResourcesBySubject(user?.id || user?._id))
                }
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}
          {!studentResources ||
            (studentResources.length === 0 && !isLoading && !isError && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucune ressource disponible
                </h3>
                <p className="text-gray-500">
                  Il n'y a pas encore de ressources correspondant à votre profil
                  éducatif.
                </p>
              </div>
            ))}
          <div className="space-y-3">
            {studentResources.map((subjectGroup) => {
              const isExpanded = expandedSubjects.has(subjectGroup.subject);
              const resourcesByType = groupResourcesByType(
                subjectGroup.resources
              );

              return (
                <div
                  key={subjectGroup.subject}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleSubject(subjectGroup.subject)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <h2 className="lg:text-xl font-bold text-white">
                        {subjectGroup.subject}
                      </h2>
                      <span className="hidden lg:inline-block bg-white bg-opacity-20 text-white lg:px-3 px-1 py-1 rounded-full lg:text-sm lg:font-medium text-xs">
                        {subjectGroup.count} ressource
                        {subjectGroup.count > 1 ? "s" : ""}
                      </span>
                    </div>

                    <svg
                      className={`lg:w-6 lg:h-6 w-4 h-4 text-white transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <ScrollArea className="h-64 px-1">
                      <div className="p-2 bg-gray-50">
                        <div className="space-y-3">
                          {Object.entries(resourcesByType).map(
                            ([type, resources]) => {
                              const typeKey = `${subjectGroup.subject}-${type}`;
                              const isTypeExpanded = expandedTypes.has(typeKey);
                              return (
                                <div
                                  key={type}
                                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                                >
                                  <button
                                    onClick={() =>
                                      toggleType(subjectGroup.subject, type)
                                    }
                                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-between text-left"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(
                                          type
                                        )}`}
                                      >
                                        {type}
                                      </span>
                                      <span className="text-gray-600 lg:text-sm text-xs">
                                        {resources.length} ressource
                                        {resources.length > 1 ? "s" : ""}
                                      </span>
                                    </div>

                                    <svg
                                      className={`lg:w-5 lg:h-5 w-4 h-4 text-gray-600 transition-transform duration-300 ${
                                        isTypeExpanded
                                          ? "rotate-180"
                                          : "rotate-0"
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>

                                  <div
                                    className={`transition-all duration-300 ease-in-out ${
                                      isTypeExpanded
                                        ? "max-h-screen opacity-100"
                                        : "max-h-0 opacity-0"
                                    } overflow-hidden`}
                                  >
                                    <div className="p-2 bg-gray-25">
                                      <ScrollArea className="h-60 px-1">
                                        <div className="space-y-3">
                                          {resources.map((resource) => (
                                            <div
                                              key={resource._id}
                                              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                                            >
                                              <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                  <h3
                                                    className="font-semibold text-gray-900 lg:text-lg text-sm mb-2 cursor-pointer hover:text-blue-700"
                                                    onClick={() => {
                                                      setCurrentResource(
                                                        resource.pdf.url
                                                      );
                                                      setCurrentResourceTitle(
                                                        resource.title
                                                      );
                                                      setShowResource(true);
                                                    }}
                                                  >
                                                    {resource.title}
                                                  </h3>

                                                  {resource.description && (
                                                    <p className=" text-gray-600 lg:text-sm text-xs cursor-default ">
                                                      {resource.description}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </ScrollArea>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {showResource && currentResource && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-0 sm:p-4">
          <div className="bg-white rounded-none sm:rounded-lg shadow-xl w-full h-full sm:w-full sm:max-w-5xl sm:max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate w-full">
                {currentResourceTitle || "Ressource"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowResource(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 bg-gray-100">
              <iframe
                src={currentResource}
                title={currentResourceTitle || "Ressource"}
                className="w-full h-full sm:h-[75vh] rounded-none sm:rounded border border-gray-300"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentResourcesList;
