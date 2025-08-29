// import { useParams, useNavigate } from "react-router-dom"
// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { getQuizByLesson, deleteQuiz, clearQuizState } from "@/store/quizSlice"
// import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
// import { Badge } from "../../ui/badge"
// import { Button } from "../../ui/button"
// import {
//   Clock,
//   Target,
//   HelpCircle,
//   Edit,
//   CheckCircle,
//   ArrowLeft,
//   BarChart3,
//   TrashIcon,
//   AlertTriangle,
// } from "lucide-react"
// import { toast } from "react-toastify"

// const ViewQuiz = () => {
//   const { lessonId } = useParams()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { currentQuiz, loading } = useSelector((state) => state.quiz)

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

//   useEffect(() => {
//     dispatch(clearQuizState())
//     if (lessonId) {
//       dispatch(getQuizByLesson(lessonId))
//     }
//     return () => {
//       dispatch(clearQuizState())
//     }
//   }, [dispatch, lessonId])

//   const quiz = Array.isArray(currentQuiz) ? currentQuiz[0] : currentQuiz

//   const handleEdit = () => {
//     if (quiz?._id) {
//       dispatch(clearQuizState())
//       navigate(`/quiz/update/${lessonId}/${quiz._id}`)
//     }
//   }
//   const handleDelete = async () => {
//     try {
//       await dispatch(deleteQuiz(quiz._id)).unwrap()
//       toast.success("Quiz deleted successfully", {
//         position: "bottom-right",
//         autoClose: 3000,
//       })
//       dispatch(clearQuizState())
//       navigate("/lessons")
//     } catch (error) {
//       console.error("Delete quiz error:", error)
//       toast.error("Error deleting quiz", {
//         position: "bottom-right",
//         autoClose: 3000,
//       })
//     }
//     setShowDeleteConfirm(false)
//   }

//   const handleBackToLessons = () => {
//     dispatch(clearQuizState())
//     navigate(-1)
//   }

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins}:${secs.toString().padStart(2, "0")}`
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           <div className="text-lg text-gray-600">Loading quiz...</div>
//         </div>
//       </div>
//     )
//   }

//   if (!quiz) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto py-8">
//           <div className="mb-6">
//          <Button o onClick={handleBackToLessons} variant="outline">
//               <ArrowLeft className="w-4 h-4" />
//               Back to Lessons
//             </Button>
//           </div>

//           <Card>
//             <CardContent className="text-center py-12">
//               <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Found</h3>
//               <p className="text-gray-600 mb-4">This lesson doesn't have a quiz yet.</p>
//               <Button onClick={() => navigate(`/quiz/create/${lessonId}`)}>Create Quiz</Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="container mx-auto py-8 max-w-4xl">
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex space-x-3">
//             <Button o onClick={handleBackToLessons} variant="outline">
//               <ArrowLeft className="w-4 h-4" />
//               Back to Lessons
//             </Button>
//             <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
//               <Edit className="w-4 h-4 mr-2" />
//               Edit Quiz
//             </Button>
//             <Button
//               onClick={() => setShowDeleteConfirm(true)}
//               variant="destructive"
//               className="bg-red-600 hover:bg-red-700"
//             >
//               <TrashIcon className="w-4 h-4 mr-2" />
//               Delete Quiz
//             </Button>
//           </div>
//         </div>

//         {/* Quiz Header */}
//         <Card className="mb-6">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle className="text-2xl font-bold text-gray-900">{quiz.title}</CardTitle>
//                 <p className="text-gray-600 mt-2">{quiz.description}</p>
//               </div>
//               <Badge variant="secondary" className="bg-green-100 text-green-800">
//                 Published
//               </Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-6 text-sm">
//               <div className="flex items-center space-x-2">
//                 <Clock className="h-4 w-4 text-gray-500" />
//                 <span className="font-medium">Time Limit:</span>
//                 <span>{formatTime(quiz.timeLimit)}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Target className="h-4 w-4 text-gray-500" />
//                 <span className="font-medium">Passing Score:</span>
//                 <span>{quiz.passingScore}%</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <HelpCircle className="h-4 w-4 text-gray-500" />
//                 <span className="font-medium">Questions:</span>
//                 <span>{quiz.questions?.length || 0}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Questions */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <HelpCircle className="h-5 w-5" />
//               <span>Questions ({quiz.questions?.length || 0})</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {quiz.questions?.map((question, index) => (
//               <div key={question._id || index} className="border rounded-lg p-6 space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <Badge variant="outline" className="font-semibold">
//                     Question {index + 1}
//                   </Badge>
//                   <Badge variant="secondary" className="capitalize">
//                     {question.questionType?.replace("-", " ") || "Multiple Choice"}
//                   </Badge>
//                 </div>

//                 <div className="space-y-3">
//                   <h4 className="font-semibold text-lg text-gray-900">{question.questionText}</h4>

//                   {question.attachment && (
//                     <div className="mt-3">
//                       <img
//                         src={question.attachment || "/placeholder.svg"}
//                         alt="Question attachment"
//                         className="max-w-md h-auto rounded border shadow-sm"
//                       />
//                     </div>
//                   )}

//                   <div className="space-y-2">
//                     <h5 className="font-medium text-gray-700">Answer Options:</h5>
//                     <div className="grid gap-2">
//                       {question.options?.map((option, optIndex) => (
//                         <div
//                           key={optIndex}
//                           className={`flex items-center space-x-3 p-3 rounded-lg border ${
//                             option === question.correctAnswer
//                               ? "bg-green-50 border-green-200 text-green-800"
//                               : "bg-gray-50 border-gray-200"
//                           }`}
//                         >
//                           <div className="flex items-center space-x-2">
//                             {question.questionType !== "true-false" && (
//                               <Badge variant="outline" className="min-w-[2rem] justify-center">
//                                 {String.fromCharCode(65 + optIndex)}
//                               </Badge>
//                             )}
//                             <span className="font-medium">{option}</span>
//                           </div>
//                           {option === question.correctAnswer && (
//                             <div className="ml-auto flex items-center space-x-1 text-green-600">
//                               <CheckCircle className="h-4 w-4" />
//                               <span className="text-sm font-medium">Correct Answer</span>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {(!quiz.questions || quiz.questions.length === 0) && (
//               <div className="text-center py-8 text-gray-500">
//                 <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                 <p>No questions have been added to this quiz yet.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Card className="max-w-md w-full mx-4">
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2 text-red-600">
//                 <AlertTriangle className="h-5 w-5" />
//                 <span>Confirm Delete</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <p className="text-gray-600">
//                 Are you sure you want to delete this quiz? This action cannot be undone and will remove all associated
//                 data.
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <Button onClick={() => setShowDeleteConfirm(false)} variant="outline">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleDelete} variant="destructive">
//                   Delete
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ViewQuiz

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getQuizByLesson, deleteQuiz, clearQuizState } from "@/store/quizSlice"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import {
  Clock,
  Target,
  HelpCircle,
  Edit,
  CheckCircle,
  ArrowLeft,
  BarChart3,
  TrashIcon,
  AlertTriangle,
} from "lucide-react"
import { toast } from "react-toastify"

const ViewQuiz = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentQuiz, loading } = useSelector((state) => state.quiz)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    dispatch(clearQuizState())
    if (lessonId) {
      dispatch(getQuizByLesson(lessonId))
    }
    return () => {
      dispatch(clearQuizState())
    }
  }, [dispatch, lessonId])

  const quiz = Array.isArray(currentQuiz) ? currentQuiz[0] : currentQuiz

  const handleEdit = () => {
    if (quiz?._id) {
      dispatch(clearQuizState())
      navigate(`/quiz/update/${lessonId}/${quiz._id}`)
    }
  }
  const handleDelete = async () => {
    try {
      await dispatch(deleteQuiz(quiz._id)).unwrap()
      toast.success("Quiz supprimé avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      })
      dispatch(clearQuizState())
      navigate("/lessons")
    } catch (error) {
      console.error("Erreur lors de la suppression du quiz :", error)
      toast.error("Erreur lors de la suppression du quiz", {
        position: "bottom-right",
        autoClose: 3000,
      })
    }
    setShowDeleteConfirm(false)
  }

  const handleBackToLessons = () => {
    dispatch(clearQuizState())
    navigate(-1)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Chargement du quiz...</div>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="mb-6">
            <Button onClick={handleBackToLessons} variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Retour aux leçons
            </Button>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun quiz trouvé</h3>
              <p className="text-gray-600 mb-4">Cette leçon n'a pas encore de quiz.</p>
              <Button onClick={() => navigate(`/quiz/create/${lessonId}`)}>Créer un quiz</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-3">
            <Button onClick={handleBackToLessons} variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Retour aux leçons
            </Button>
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Modifier le quiz
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Supprimer le quiz
            </Button>
          </div>
        </div>

        {/* Quiz Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{quiz.title}</CardTitle>
                <p className="text-gray-600 mt-2">{quiz.description}</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Publié
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Limite de temps :</span>
                <span>{formatTime(quiz.timeLimit)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Score de passage :</span>
                <span>{quiz.passingScore}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Questions :</span>
                <span>{quiz.questions?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Questions ({quiz.questions?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions?.map((question, index) => (
              <div key={question._id || index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="font-semibold">
                    Question {index + 1}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {question.questionType === "multiple-choice"
                      ? "Choix multiple"
                      : question.questionType === "true-false"
                      ? "Vrai/Faux"
                      : question.questionType?.replace("-", " ") || "Choix multiple"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-gray-900">{question.questionText}</h4>

                  {question.attachment && (
                    <div className="mt-3">
                      <img
                        src={question.attachment || "/placeholder.svg"}
                        alt="Pièce jointe à la question"
                        className="max-w-md h-auto rounded border shadow-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">Options de réponse :</h5>
                    <div className="grid gap-2">
                      {question.options?.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center space-x-3 p-3 rounded-lg border ${
                            option === question.correctAnswer
                              ? "bg-green-50 border-green-200 text-green-800"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {question.questionType !== "true-false" && (
                              <Badge variant="outline" className="min-w-[2rem] justify-center">
                                {String.fromCharCode(65 + optIndex)}
                              </Badge>
                            )}
                            <span className="font-medium">{option}</span>
                          </div>
                          {option === question.correctAnswer && (
                            <div className="ml-auto flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Bonne réponse</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {(!quiz.questions || quiz.questions.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune question n'a encore été ajoutée à ce quiz.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Confirmer la suppression</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible et supprimera toutes les données associées.
              </p>
              <div className="flex justify-end space-x-3">
                <Button onClick={() => setShowDeleteConfirm(false)} variant="outline">
                  Annuler
                </Button>
                <Button onClick={handleDelete} variant="destructive">
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ViewQuiz