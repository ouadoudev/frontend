import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { updateCourse, fetchCourseById } from "@/store/courseSlice"
import { fetchSubjects } from "@/store/subjectSlice"
import { loggedUser } from "@/store/authSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "../../ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  UploadCloudIcon,
  BookOpenIcon,
  EyeIcon,
  EyeOffIcon,
  Plus,
  CheckCircle2,
  X,
  Target,
  GripVertical,
  Edit3,
  Save,
  AlertCircle,
  Lightbulb,
  InfoIcon,
} from "lucide-react"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"

// Translation object for static text
const translations = {
  ltr: {
    courseTitle: "Titre du cours",
    educationalLevel: "Niveau éducatif",
    allAuthorizedLevels: "Tous les niveaux autorisés",
    stream: "Filière",
    allStreams: "Toutes les filières",
    subject: "Matière",
    noEducationalDetails: "Aucun détail éducatif assigné",
    noSubjectsAvailable: "Aucune matière disponible",
    selectSubject: "Sélectionner une matière",
    visibility: "Visibilité",
    public: "Public",
    private: "Privé",
    thumbnail: "Miniature",
    dragDropImage: "Glisser-déposer votre image ici, ou cliquer pour sélectionner",
    thumbnailUploadDisabled: "Téléchargement de miniature désactivé",
    selectNewThumbnail: "Sélectionner une nouvelle miniature",
    description: "Description",
    enterCourseDescription: "Saisir la description du cours",
    prerequisites: "Prérequis",
    prerequisitesSubtitle: "Quelles connaissances ou compétences sont requises avant de commencer ?",
    noPrerequisites: "Aucun prérequis ajouté pour le moment",
    getStarted: `Cliquer sur "Ajouter" pour commencer`,
    educationalDetailsRequired: "Détails éducatifs requis",
    dragToReorder: "Glisser pour réorganiser",
    pressEnterToSave: "Appuyer sur Entrée pour enregistrer, Échap pour annuler",
    thisItemIsEmpty: "Cet élément est vide",
    emptyPrerequisite: "Prérequis vide",
    emptyObjective: "Objectif vide",
    chars: "caractères",
    objectives: "Objectifs",
    objectivesSubtitle: "Que vont accomplir les apprenants à la fin ?",
    noObjectives: "Aucun objectif ajouté pour le moment",
    cancel: "Annuler",
    updateCourse: "Mettre à jour le cours",
    updating: "Mise à jour en cours...",
    educationalDetailsRequiredButton: "Détails éducatifs requis",
    noSubjectsAvailableButton: "Aucune matière disponible",
    restrictionMessage: (discipline, levels) =>
      `Aucune matière disponible pour votre discipline (${discipline}) dans vos niveaux éducatifs assignés. Vos niveaux assignés : ${levels}`,
    noEducationalDetailsMessage:
      "Vous n'avez pas de détails éducatifs assignés. Veuillez contacter un administrateur pour assigner vos niveaux d'enseignement avant de mettre à jour des cours.",
    enterPrerequisite: (index) => `Saisir le prérequis ${index}...`,
    enterObjective: (index) => `Saisir l'objectif ${index}...`,
  },
  rtl: {
    courseTitle: "عنوان الدورة",
    educationalLevel: "المستوى التعليمي",
    allAuthorizedLevels: "جميع المستويات المصرح بها",
    stream: "التيار",
    allStreams: "جميع التيارات",
    subject: "المادة",
    noEducationalDetails: "لم يتم تعيين تفاصيل تعليمية",
    noSubjectsAvailable: "لا توجد مواد متاحة",
    selectSubject: "اختر مادة",
    visibility: "الرؤية",
    public: "عام",
    private: "خاص",
    thumbnail: "الصورة المصغرة",
    dragDropImage: "اسحب وأفلت صورتك هنا، أو انقر للاختيار",
    thumbnailUploadDisabled: "تحميل الصورة المصغرة معطل",
    selectNewThumbnail: "اختر صورة مصغرة جديدة",
    description: "الوصف",
    enterCourseDescription: "أدخل وصف الدورة",
    prerequisites: "المتطلبات الأساسية",
    prerequisitesSubtitle: "ما هي المعرفة أو المهارات المطلوبة قبل البدء؟",
    noPrerequisites: "لم يتم إضافة متطلبات أساسية بعد",
    getStarted: "انقر 'إضافة' للبدء",
    educationalDetailsRequired: "التفاصيل التعليمية مطلوبة",
    dragToReorder: "اسحب لإعادة الترتيب",
    pressEnterToSave: "اضغط Enter لحفظ، Esc للإلغاء",
    thisItemIsEmpty: "هذا العنصر فارغ",
    emptyPrerequisite: "متطلب فارغ",
    emptyObjective: "هدف فارغ",
    chars: "حرف",
    objectives: "الأهداف",
    objectivesSubtitle: "ماذا سيحقق المتعلمون بنهاية الدورة؟",
    noObjectives: "لم يتم إضافة أهداف بعد",
    cancel: "إلغاء",
    updateCourse: "تحديث الدورة",
    updating: "جارٍ التحديث...", // New
    educationalDetailsRequiredButton: "التفاصيل التعليمية مطلوبة",
    noSubjectsAvailableButton: "لا توجد مواد متاحة",
    restrictionMessage: (discipline, levels) =>
      `لا توجد مواد متاحة لتخصصك (${discipline}) ضمن المستويات التعليمية المعينة. المستويات المعينة: ${levels}`,
    noEducationalDetailsMessage:
      "لم يتم تعيين تفاصيل تعليمية لك. يرجى التواصل مع المسؤول لتعيين مستويات التدريس الخاصة بك قبل تحديث الدورات.",
    enterPrerequisite: (index) => `أدخل المتطلب ${index}...`,
    enterObjective: (index) => `أدخل الهدف ${index}...`,
  },
}

function UpdateCourse() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const subjects = useSelector((state) => state.subjects.entities)
  const teacher = useSelector(loggedUser)
  const course = useSelector((state) => state.courses.courses.find((course) => course._id === id))

  // Original form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [published, setPublished] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null)
  const [hasThumbnail, setHasThumbnail] = useState(false)
  const [level, setLevel] = useState("")
  const [stream, setStream] = useState("")
  const [filteredSubjects, setFilteredSubjects] = useState([])
  const [validEducationalLevels, setValidEducationalLevels] = useState([])
  const [validStreams, setValidStreams] = useState([])
  const [loading, setLoading] = useState(true) // This loading is for initial course fetch and submission

  // New state for educational restrictions
  const [hasEducationalDetails, setHasEducationalDetails] = useState(false)
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [restrictionMessage, setRestrictionMessage] = useState("")

  // Enhanced prerequisites and objectives state
  const [prerequisites, setPrerequisites] = useState([])
  const [objectives, setObjectives] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedType, setDraggedType] = useState(null)
  const inputRefs = useRef({})

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
    return rtlChars.test(text) ? "rtl" : "ltr"
  }

  // Determine direction and translation key based on teacher.discipline
  const disciplineDirection = teacher?.discipline ? getDirection(teacher.discipline) : "ltr"
  const t = translations[disciplineDirection]

  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Helper function to parse the complex database format
  const parseComplexDatabaseFormat = (data) => {
    if (!data) return []
    try {
      // Handle different data formats from your database
      // Case 1: Already an array of strings (simple format)
      if (Array.isArray(data)) {
        // Check if it's an array of JSON strings (your current format)
        if (data.length > 0 && typeof data[0] === "string" && data[0].startsWith("[")) {
          // Parse each JSON string in the array
          const allItems = []
          for (const jsonString of data) {
            try {
              const parsed = JSON.parse(jsonString)
              if (Array.isArray(parsed)) {
                allItems.push(...parsed)
              } else {
                allItems.push(String(parsed))
              }
            } catch (e) {
              // If JSON parsing fails, treat as regular string
              allItems.push(jsonString)
            }
          }
          return allItems.filter((item) => item && item.trim().length > 0)
        } else {
          // Simple array of strings
          return data.filter((item) => item && typeof item === "string" && item.trim().length > 0)
        }
      }
      // Case 2: Single JSON string
      if (typeof data === "string") {
        // Try to parse as JSON first
        if (data.startsWith("[") || data.startsWith("{")) {
          try {
            const parsed = JSON.parse(data)
            if (Array.isArray(parsed)) {
              return parsed.filter((item) => item && item.trim().length > 0)
            }
            return [String(parsed)]
          } catch (e) {
            // If JSON parsing fails, try comma-separated
            return data
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
          }
        } else {
          // Comma-separated string
          return data
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        }
      }
      // Case 3: Other types - convert to string
      return [String(data)].filter((item) => item && item.trim().length > 0)
    } catch (error) {
      console.error("Error parsing database format:", error, "Data:", data)
      return []
    }
  }

  const convertToEnhancedFormat = (items) => {
    return items.map((text, index) => ({
      id: `item-${index}-${Date.now()}`,
      text: String(text).trim(),
      isEditing: false,
      isNew: false,
    }))
  }

  useEffect(() => {
    dispatch(fetchSubjects()).then(() => setLoading(false))
  }, [dispatch])

  // Check teacher's educational details and filter subjects accordingly
  useEffect(() => {
    if (!teacher) return

    const teacherCycles = teacher.educationalCycles || []
    const teacherLevels = teacher.educationalLevels || []

    // Check if teacher has assigned educational details
    const hasDetails = teacherCycles.length > 0 && teacherLevels.length > 0
    setHasEducationalDetails(hasDetails)

    if (!hasDetails) {
      setRestrictionMessage(t.noEducationalDetailsMessage)
      setAvailableSubjects([])
      setFilteredSubjects([])
      return
    }

    // Filter subjects based on teacher's discipline AND assigned educational details
    const matchingSubjects = subjects.filter((subject) => {
      // Must match teacher's discipline
      const matchesDiscipline = subject.title.startsWith(teacher.discipline)
      // Must match at least one of teacher's assigned cycles
      const matchesCycle = teacherCycles.includes(subject.educationalCycle)
      // Must match at least one of teacher's assigned levels
      const matchesLevel = teacherLevels.includes(subject.educationalLevel)
      return matchesDiscipline && matchesCycle && matchesLevel
    })

    setAvailableSubjects(matchingSubjects)

    if (matchingSubjects.length === 0) {
      setRestrictionMessage(t.restrictionMessage(teacher.discipline, teacherLevels.join(", ")))
    } else {
      setRestrictionMessage("")
    }

    // Set valid levels and streams based on teacher's assignments
    setValidEducationalLevels(teacherLevels)
    const teacherStreams = [...new Set(matchingSubjects.map((subject) => subject.stream).filter(Boolean))]
    setValidStreams(teacherStreams)
  }, [subjects, teacher, t])

  // Filter available subjects based on selected level and stream
  useEffect(() => {
    if (!hasEducationalDetails) {
      setFilteredSubjects([])
      return
    }

    const filtered = availableSubjects.filter(
      (subject) => (level ? subject.educationalLevel === level : true) && (stream ? subject.stream === stream : true),
    )
    setFilteredSubjects(filtered)
  }, [availableSubjects, level, stream, hasEducationalDetails])

  useEffect(() => {
    if (course) {
      setTitle(course.title || "")
      setDescription(course.description || "")
      // Handle subject - extract _id if it's an object, otherwise use as is
      if (course.subject) {
        if (typeof course.subject === "object" && course.subject._id) {
          setSubject(course.subject._id)
        } else {
          setSubject(course.subject)
        }
      } else {
        setSubject("")
      }
      setPublished(course.published || false)
      // Handle educational level - extract from subject if needed
      if (course.educationalLevel) {
        setLevel(course.educationalLevel)
      } else if (course.subject && typeof course.subject === "object" && course.subject.educationalLevel) {
        setLevel(course.subject.educationalLevel)
      } else {
        setLevel("")
      }
      // Handle stream - extract from subject if needed
      if (course.stream) {
        setStream(course.stream)
      } else if (course.subject && typeof course.subject === "object" && course.subject.stream) {
        setStream(course.subject.stream)
      } else {
        setStream("")
      }

      // Parse the complex database format
      try {
        console.log("Raw prerequisites from DB:", course.prerequisites)
        console.log("Raw objectives from DB:", course.objectives)
        const prereqArray = parseComplexDatabaseFormat(course.prerequisites)
        const objArray = parseComplexDatabaseFormat(course.objectives)
        console.log("Parsed prerequisites:", prereqArray)
        console.log("Parsed objectives:", objArray)
        setPrerequisites(convertToEnhancedFormat(prereqArray))
        setObjectives(convertToEnhancedFormat(objArray))
      } catch (error) {
        console.error("Error parsing prerequisites/objectives:", error)
        setPrerequisites([])
        setObjectives([])
        toast.error("Error loading course prerequisites and objectives")
      }

      // Set thumbnail preview if exists
      if (course.thumbnail) {
        setThumbnailPreviewUrl(course.thumbnail.url)
        setHasThumbnail(true)
      }
    } else {
      dispatch(fetchCourseById(id))
    }
  }, [course, dispatch, id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Additional validation for educational restrictions
    if (!hasEducationalDetails) {
      toast.error(t.noEducationalDetailsMessage)
      return
    }
    if (availableSubjects.length === 0) {
      toast.error(t.restrictionMessage(teacher.discipline, validEducationalLevels.join(", ")))
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)

    // Convert enhanced format to array of strings (matching schema)
    const prereqArray = prerequisites.map((item) => item.text.trim()).filter((text) => text.length > 0)
    const objArray = objectives.map((item) => item.text.trim()).filter((text) => text.length > 0)

    // Send as JSON strings since FormData doesn't handle arrays well
    formData.append("prerequisites", JSON.stringify(prereqArray))
    formData.append("objectives", JSON.stringify(objArray))

    // Ensure subject is a valid ObjectId string
    if (subject && typeof subject === "string") {
      formData.append("subject", subject)
    } else {
      toast.error("Please select a valid subject")
      return
    }

    formData.append("published", published)
    formData.append("teacher", teacher.id)

    // Only append educational level and stream if they have values
    if (level) {
      formData.append("educationalLevel", level)
    }
    if (stream) {
      formData.append("stream", stream)
    }

    if (thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail)
    }

    try {
      setLoading(true) // Set loading true at the start of submission
      await dispatch(updateCourse({ id, formData })).unwrap()
      toast.success("Course updated successfully!")
      setTimeout(() => navigate("/courses"), 1000)
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error || "An error occurred while updating the course")
    } finally {
      setLoading(false) // Set loading false after submission completes (success or failure)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const selectedFile = event.dataTransfer.files[0]
    setThumbnail(selectedFile)
    setThumbnailPreviewUrl(URL.createObjectURL(selectedFile))
    setHasThumbnail(true)
  }

  const handleThumbnailChange = (event) => {
    const selectedFile = event.target.files[0]
    setThumbnail(selectedFile)
    setThumbnailPreviewUrl(URL.createObjectURL(selectedFile))
    setHasThumbnail(true)
  }

  // Enhanced prerequisites and objectives functions
  const addPrerequisite = () => {
    const newItem = {
      id: generateId(),
      text: "",
      isEditing: true,
      isNew: true,
    }
    setPrerequisites((prev) => [...prev, newItem])
    setTimeout(() => {
      const input = inputRefs.current[newItem.id]
      if (input) input.focus()
    }, 100)
  }

  const addObjective = () => {
    const newItem = {
      id: generateId(),
      text: "",
      isEditing: true,
      isNew: true,
    }
    setObjectives((prev) => [...prev, newItem])
    setTimeout(() => {
      const input = inputRefs.current[newItem.id]
      if (input) input.focus()
    }, 100)
  }

  const updatePrerequisite = (id, text) => {
    setPrerequisites((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const updateObjective = (id, text) => {
    setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const toggleEdit = (id, type) => {
    if (type === "prerequisites") {
      setPrerequisites((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing, isNew: false } : item)),
      )
    } else {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing, isNew: false } : item)),
      )
    }
    setTimeout(() => {
      const input = inputRefs.current[id]
      if (input) input.focus()
    }, 100)
  }

  const saveItem = (id, type) => {
    if (type === "prerequisites") {
      setPrerequisites((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEditing: false, isNew: false } : item)),
      )
    } else {
      setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false, isNew: false } : item)))
    }
  }

  const removeItem = (id, type) => {
    if (type === "prerequisites") {
      setPrerequisites((prev) => prev.filter((item) => item.id !== id))
    } else {
      setObjectives((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleKeyDown = (e, id, type) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveItem(id, type)
    } else if (e.key === "Escape") {
      const items = type === "prerequisites" ? prerequisites : objectives
      const item = items.find((i) => i.id === id)
      if (item?.isNew && !item.text.trim()) {
        removeItem(id, type)
      } else {
        if (type === "prerequisites") {
          setPrerequisites((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
        } else {
          setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
        }
      }
    }
  }

  const handleDragStart = (e, id, type) => {
    setDraggedItem(id)
    setDraggedType(type)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOverItem = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDropItem = (e, targetId, type) => {
    e.preventDefault()
    if (!draggedItem || draggedType !== type) return

    const items = type === "prerequisites" ? prerequisites : objectives
    const draggedIndex = items.findIndex((item) => item.id === draggedItem)
    const targetIndex = items.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newItems = [...items]
    const [draggedItemData] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItemData)

    if (type === "prerequisites") {
      setPrerequisites(newItems)
    } else {
      setObjectives(newItems)
    }
    setDraggedItem(null)
    setDraggedType(null)
  }

  const renderEditableItem = (item, type, index) => {
    const isEmpty = !item.text.trim()
    const isLongText = item.text.length > 100
    return (
      <div
        key={item.id}
        className={cn(
          "group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
          item.isEditing ? "border-blue-200 bg-blue-50/50" : "border-gray-200 hover:border-gray-300",
          draggedItem === item.id && "opacity-50",
          isEmpty && !item.isEditing && "border-red-200 bg-red-50/30",
          disciplineDirection === "rtl" && "flex-row-reverse", // Apply flex-row-reverse for RTL
        )}
        draggable={!item.isEditing}
        onDragStart={(e) => handleDragStart(e, item.id, type)}
        onDragOver={handleDragOverItem}
        onDrop={(e) => handleDropItem(e, item.id, type)}
      >
        {/* Drag Handle */}
        <div
          className={cn(
            "flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity",
            item.isEditing && "opacity-0 pointer-events-none",
          )}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0">
          {item.isEditing ? (
            <div className="space-y-2">
              {isLongText || item.isNew ? (
                <Textarea
                  ref={(el) => {
                    inputRefs.current[item.id] = el
                  }}
                  value={item.text}
                  onChange={(e) =>
                    type === "prerequisites"
                      ? updatePrerequisite(item.id, e.target.value)
                      : updateObjective(item.id, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, item.id, type)}
                  placeholder={t[`enter${type === "prerequisites" ? "Prerequisite" : "Objective"}`](index + 1)}
                  className="min-h-[80px] resize-none"
                  dir={getDirection(item.text)}
                />
              ) : (
                <Input
                  ref={(el) => {
                    inputRefs.current[item.id] = el
                  }}
                  value={item.text}
                  onChange={(e) =>
                    type === "prerequisites"
                      ? updatePrerequisite(item.id, e.target.value)
                      : updateObjective(item.id, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, item.id, type)}
                  placeholder={t[`enter${type === "prerequisites" ? "Prerequisite" : "Objective"}`](index + 1)}
                  dir={getDirection(item.text)}
                />
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500" dir={disciplineDirection}>
                <span>{t.pressEnterToSave}</span>
                {item.text.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {item.text.length} {t.chars}
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p
                className={cn("text-sm leading-relaxed", isEmpty && "text-red-500 italic")}
                dir={getDirection(item.text)}
              >
                {item.text || t[`empty${type === "prerequisites" ? "Prerequisite" : "Objective"}`]}
              </p>
              {isEmpty && (
                <div className="flex items-center gap-1 text-xs text-red-500" dir={disciplineDirection}>
                  <AlertCircle className="h-3 w-3" />
                  <span>{t.thisItemIsEmpty}</span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {item.isEditing ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => saveItem(item.id, type)}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Save className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toggleEdit(item.id, type)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id, type)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Restriction Message */}
        {restrictionMessage && (
          <Alert className="m-6 mb-0" variant="destructive">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription dir={disciplineDirection}>{restrictionMessage}</AlertDescription>
          </Alert>
        )}
        <form className="p-6 space-y-6" onSubmit={handleSubmit} dir={disciplineDirection}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
                  <BookOpenIcon
                    className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t.courseTitle}
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  dir={disciplineDirection}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.enterCourseTitle || t.courseTitle}
                  className="mt-1"
                  disabled={!hasEducationalDetails}
                />
              </div>
              {/* Educational Level Filter */}
              {hasEducationalDetails && validEducationalLevels.length > 1 && (
                <div>
                  <Label htmlFor="level" className="text-lg font-semibold text-gray-700">
                    {t.educationalLevel}
                  </Label>
                  <select
                    id="level"
                    value={level}
                    onChange={(event) => setLevel(event.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    dir={disciplineDirection}
                  >
                    <option value="">{t.allAuthorizedLevels}</option>
                    {validEducationalLevels.map((levelOption) => (
                      <option key={levelOption} value={levelOption}>
                        {levelOption}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Stream Filter */}
              {hasEducationalDetails && validStreams.length > 0 && (
                <div>
                  <Label htmlFor="stream" className="text-lg font-semibold text-gray-700">
                    {t.stream}
                  </Label>
                  <select
                    id="stream"
                    value={stream}
                    onChange={(event) => setStream(event.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    dir={disciplineDirection}
                  >
                    <option value="">{t.allStreams}</option>
                    {validStreams.map((streamOption) => (
                      <option key={streamOption} value={streamOption}>
                        {streamOption}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <Label htmlFor="subject" className="text-lg font-semibold text-gray-700">
                  {t.subject}
                </Label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  disabled={!hasEducationalDetails || filteredSubjects.length === 0}
                  dir={disciplineDirection}
                >
                  <option value="">
                    {!hasEducationalDetails
                      ? t.noEducationalDetails
                      : filteredSubjects.length === 0
                        ? t.noSubjectsAvailable
                        : t.selectSubject}
                  </option>
                  {filteredSubjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.title} ({subject.educationalLevel})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-lg font-semibold text-gray-700">{t.visibility}</Label>
                <div
                  className={cn(
                    "mt-2 flex",
                    disciplineDirection === "rtl" ? "flex-row-reverse space-x-reverse" : "space-x-4",
                  )}
                >
                  <Label className="inline-flex items-center">
                    <Input
                      type="radio"
                      className="size-6"
                      name="visibility"
                      value="true"
                      checked={published === true}
                      onChange={() => setPublished(true)}
                      disabled={!hasEducationalDetails}
                    />
                    <span className={cn("text-gray-700", disciplineDirection === "rtl" ? "mr-2" : "ml-2")}>
                      <EyeIcon
                        className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-1" : "mr-1")}
                      />
                      {t.public}
                    </span>
                  </Label>
                  <Label className="inline-flex items-center">
                    <Input
                      type="radio"
                      className="size-6"
                      name="visibility"
                      value="false"
                      checked={published === false}
                      onChange={() => setPublished(false)}
                      disabled={!hasEducationalDetails}
                    />
                    <span className={cn("text-gray-700", disciplineDirection === "rtl" ? "mr-2" : "ml-2")}>
                      <EyeOffIcon
                        className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-1" : "mr-1")}
                      />
                      {t.private}
                    </span>
                  </Label>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <Label htmlFor="file-upload" className="text-lg font-semibold text-gray-700">
                {t.thumbnail}
              </Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center",
                  hasThumbnail && !thumbnail
                    ? "hidden"
                    : !hasEducationalDetails
                      ? "border-gray-200 bg-gray-50"
                      : "border-gray-300 hover:border-blue-500 transition-colors duration-300",
                )}
                onDragOver={hasEducationalDetails ? handleDragOver : undefined}
                onDrop={hasEducationalDetails ? handleDrop : undefined}
              >
                <div>
                  <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600" dir={disciplineDirection}>
                    {hasEducationalDetails ? t.dragDropImage : t.thumbnailUploadDisabled}
                  </p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleThumbnailChange}
                    accept="image/*"
                    disabled={!hasEducationalDetails}
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById("file-upload").click()}
                    className="mt-2"
                    disabled={!hasEducationalDetails}
                  >
                    {t.selectNewThumbnail}
                  </Button>
                </div>
              </div>
              {thumbnailPreviewUrl && (
                <div className="relative">
                  <img
                    src={thumbnailPreviewUrl || "/placeholder.svg"}
                    alt="Thumbnail Preview"
                    className="w-full h-80 rounded-lg shadow-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "absolute top-2 bg-white/90 hover:bg-white",
                      disciplineDirection === "rtl" ? "left-2" : "right-2",
                    )}
                    onClick={() => {
                      setThumbnailPreviewUrl(null)
                      setHasThumbnail(false)
                      setThumbnail(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
              <BookOpenIcon className={cn("inline-block h-5 w-5", disciplineDirection === "rtl" ? "ml-2" : "mr-2")} />
              {t.description}
            </Label>
            <Textarea
              id="description"
              value={description}
              dir={disciplineDirection}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.enterCourseDescription}
              className="min-h-[100px]"
              disabled={!hasEducationalDetails}
            />
          </div>
          {/* Enhanced Prerequisites Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <CheckCircle2
                  className={cn("h-5 w-5 text-blue-600", disciplineDirection === "rtl" ? "ml-2" : "mr-2")}
                />
                <div>
                  <h3 className="text-lg font-semibold">{t.prerequisites}</h3>
                  <p className="text-sm text-gray-500 font-normal">{t.prerequisitesSubtitle}</p>
                </div>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPrerequisite}
                className={cn(
                  "flex items-center gap-2 bg-transparent",
                  disciplineDirection === "rtl" ? "flex-row-reverse" : "",
                )}
                disabled={!hasEducationalDetails}
              >
                <Plus className={cn("h-4 w-4", disciplineDirection === "rtl" ? "ml-2" : "mr-2")} />
                {t.add}
              </Button>
            </div>
            {prerequisites.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm" dir={disciplineDirection}>
                  {t.noPrerequisites}
                </p>
                <p className="text-xs text-gray-400 mt-1" dir={disciplineDirection}>
                  {hasEducationalDetails ? t.getStarted : t.educationalDetailsRequired}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {prerequisites.map((item, index) => renderEditableItem(item, "prerequisites", index))}
              </div>
            )}
            {prerequisites.length > 0 && (
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs text-gray-500",
                    disciplineDirection === "rtl" ? "flex-row-reverse" : "",
                  )}
                >
                  <Badge variant="secondary">
                    {prerequisites.length} {t.prerequisites.toLowerCase()}
                    {prerequisites.length !== 1 ? (disciplineDirection === "rtl" ? "ات" : "s") : ""}
                  </Badge>
                  <span>•</span>
                  <span dir={disciplineDirection}>{t.dragToReorder}</span>
                </div>
              </div>
            )}
          </div>
          <Separator />
          {/* Enhanced Objectives Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Target className={cn("h-5 w-5 text-blue-600", disciplineDirection === "rtl" ? "ml-2" : "mr-2")} />
                <div>
                  <h3 className="text-lg font-semibold">{t.objectives}</h3>
                  <p className="text-sm text-gray-500 font-normal">{t.objectivesSubtitle}</p>
                </div>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addObjective}
                className={cn(
                  "flex items-center gap-2 bg-transparent",
                  disciplineDirection === "rtl" ? "flex-row-reverse" : "",
                )}
                disabled={!hasEducationalDetails}
              >
                <Plus className={cn("h-4 w-4", disciplineDirection === "rtl" ? "ml-2" : "mr-2")} />
                {t.add}
              </Button>
            </div>
            {objectives.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm" dir={disciplineDirection}>
                  {t.noObjectives}
                </p>
                <p className="text-xs text-gray-400 mt-1" dir={disciplineDirection}>
                  {hasEducationalDetails ? t.getStarted : t.educationalDetailsRequired}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {objectives.map((item, index) => renderEditableItem(item, "objectives", index))}
              </div>
            )}
            {objectives.length > 0 && (
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs text-gray-500",
                    disciplineDirection === "rtl" ? "flex-row-reverse" : "",
                  )}
                >
                  <Badge variant="secondary">
                    {objectives.length} {t.objectives.toLowerCase()}
                    {objectives.length !== 1 ? (disciplineDirection === "rtl" ? "ات" : "s") : ""}
                  </Badge>
                  <span>•</span>
                  <span dir={disciplineDirection}>{t.dragToReorder}</span>
                </div>
              </div>
            )}
          </div>
          {loading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 animate-pulse" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-center" dir={disciplineDirection}>
                {t.updating}
              </p>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/courses")} className="flex-1">
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading || !hasEducationalDetails || availableSubjects.length === 0}
              className="flex-1 px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? t.updating
                : !hasEducationalDetails
                  ? t.educationalDetailsRequiredButton
                  : availableSubjects.length === 0
                    ? t.noSubjectsAvailableButton
                    : t.updateCourse}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateCourse




// import { useEffect, useState, useRef } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useParams, useNavigate } from "react-router-dom"
// import { updateCourse, fetchCourseById } from "@/store/courseSlice"
// import { fetchSubjects } from "@/store/subjectSlice"
// import { loggedUser } from "@/store/authSlice"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Separator } from "../../ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import {
//   UploadCloudIcon,
//   BookOpenIcon,
//   EyeIcon,
//   EyeOffIcon,
//   Plus,
//   CheckCircle2,
//   X,
//   Target,
//   GripVertical,
//   Edit3,
//   Save,
//   AlertCircle,
//   Lightbulb,
//   InfoIcon,
// } from "lucide-react"
// import { toast } from "react-toastify"
// import { cn } from "@/lib/utils"

// function UpdateCourse() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { id } = useParams()
//   const subjects = useSelector((state) => state.subjects.entities)
//   const teacher = useSelector(loggedUser)
//   const course = useSelector((state) => state.courses.courses.find((course) => course._id === id))

//   // Original form state
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [subject, setSubject] = useState("")
//   const [published, setPublished] = useState(false)
//   const [thumbnail, setThumbnail] = useState(null)
//   const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null)
//   const [hasThumbnail, setHasThumbnail] = useState(false)
//   const [level, setLevel] = useState("")
//   const [stream, setStream] = useState("")
//   const [filteredSubjects, setFilteredSubjects] = useState([])
//   const [validEducationalLevels, setValidEducationalLevels] = useState([])
//   const [validStreams, setValidStreams] = useState([])
//   const [loading, setLoading] = useState(true)

//   // New state for educational restrictions
//   const [hasEducationalDetails, setHasEducationalDetails] = useState(false)
//   const [availableSubjects, setAvailableSubjects] = useState([])
//   const [restrictionMessage, setRestrictionMessage] = useState("")

//   // Enhanced prerequisites and objectives state
//   const [prerequisites, setPrerequisites] = useState([])
//   const [objectives, setObjectives] = useState([])
//   const [draggedItem, setDraggedItem] = useState(null)
//   const [draggedType, setDraggedType] = useState(null)
//   const inputRefs = useRef({})

//   const getDirection = (text) => {
//     const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
//     return rtlChars.test(text) ? "rtl" : "ltr"
//   }

//   const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

//   // Helper function to parse the complex database format
//   const parseComplexDatabaseFormat = (data) => {
//     if (!data) return []
//     try {
//       // Handle different data formats from your database
//       // Case 1: Already an array of strings (simple format)
//       if (Array.isArray(data)) {
//         // Check if it's an array of JSON strings (your current format)
//         if (data.length > 0 && typeof data[0] === "string" && data[0].startsWith("[")) {
//           // Parse each JSON string in the array
//           const allItems = []
//           for (const jsonString of data) {
//             try {
//               const parsed = JSON.parse(jsonString)
//               if (Array.isArray(parsed)) {
//                 allItems.push(...parsed)
//               } else {
//                 allItems.push(String(parsed))
//               }
//             } catch (e) {
//               // If JSON parsing fails, treat as regular string
//               allItems.push(jsonString)
//             }
//           }
//           return allItems.filter((item) => item && item.trim().length > 0)
//         } else {
//           // Simple array of strings
//           return data.filter((item) => item && typeof item === "string" && item.trim().length > 0)
//         }
//       }

//       // Case 2: Single JSON string
//       if (typeof data === "string") {
//         // Try to parse as JSON first
//         if (data.startsWith("[") || data.startsWith("{")) {
//           try {
//             const parsed = JSON.parse(data)
//             if (Array.isArray(parsed)) {
//               return parsed.filter((item) => item && item.trim().length > 0)
//             }
//             return [String(parsed)]
//           } catch (e) {
//             // If JSON parsing fails, try comma-separated
//             return data
//               .split(",")
//               .map((item) => item.trim())
//               .filter((item) => item.length > 0)
//           }
//         } else {
//           // Comma-separated string
//           return data
//             .split(",")
//             .map((item) => item.trim())
//             .filter((item) => item.length > 0)
//         }
//       }

//       // Case 3: Other types - convert to string
//       return [String(data)].filter((item) => item && item.trim().length > 0)
//     } catch (error) {
//       console.error("Error parsing database format:", error, "Data:", data)
//       return []
//     }
//   }

//   const convertToEnhancedFormat = (items) => {
//     return items.map((text, index) => ({
//       id: `item-${index}-${Date.now()}`,
//       text: String(text).trim(),
//       isEditing: false,
//       isNew: false,
//     }))
//   }

//   useEffect(() => {
//     dispatch(fetchSubjects()).then(() => setLoading(false))
//   }, [dispatch])

//   // Check teacher's educational details and filter subjects accordingly
//   useEffect(() => {
//     if (!teacher) return

//     const teacherCycles = teacher.educationalCycles || []
//     const teacherLevels = teacher.educationalLevels || []

//     // Check if teacher has assigned educational details
//     const hasDetails = teacherCycles.length > 0 && teacherLevels.length > 0
//     setHasEducationalDetails(hasDetails)

//     if (!hasDetails) {
//       setRestrictionMessage(
//         "You don't have assigned educational details. Please contact an administrator to assign your teaching levels before updating courses.",
//       )
//       setAvailableSubjects([])
//       setFilteredSubjects([])
//       return
//     }

//     // Filter subjects based on teacher's discipline AND assigned educational details
//     const matchingSubjects = subjects.filter((subject) => {
//       // Must match teacher's discipline
//       const matchesDiscipline = subject.title.startsWith(teacher.discipline)

//       // Must match at least one of teacher's assigned cycles
//       const matchesCycle = teacherCycles.includes(subject.educationalCycle)

//       // Must match at least one of teacher's assigned levels
//       const matchesLevel = teacherLevels.includes(subject.educationalLevel)

//       return matchesDiscipline && matchesCycle && matchesLevel
//     })

//     setAvailableSubjects(matchingSubjects)

//     if (matchingSubjects.length === 0) {
//       setRestrictionMessage(
//         `No subjects available for your discipline (${teacher.discipline}) within your assigned educational levels. Your assigned levels: ${teacherLevels.join(", ")}`,
//       )
//     } else {
//       setRestrictionMessage("")
//     }

//     // Set valid levels and streams based on teacher's assignments
//     setValidEducationalLevels(teacherLevels)
//     const teacherStreams = [...new Set(matchingSubjects.map((subject) => subject.stream).filter(Boolean))]
//     setValidStreams(teacherStreams)
//   }, [subjects, teacher])

//   // Filter available subjects based on selected level and stream
//   useEffect(() => {
//     if (!hasEducationalDetails) {
//       setFilteredSubjects([])
//       return
//     }

//     const filtered = availableSubjects.filter(
//       (subject) => (level ? subject.educationalLevel === level : true) && (stream ? subject.stream === stream : true),
//     )
//     setFilteredSubjects(filtered)
//   }, [availableSubjects, level, stream, hasEducationalDetails])

//   useEffect(() => {
//     if (course) {
//       setTitle(course.title || "")
//       setDescription(course.description || "")
//       // Handle subject - extract _id if it's an object, otherwise use as is
//       if (course.subject) {
//         if (typeof course.subject === "object" && course.subject._id) {
//           setSubject(course.subject._id)
//         } else {
//           setSubject(course.subject)
//         }
//       } else {
//         setSubject("")
//       }
//       setPublished(course.published || false)

//       // Handle educational level - extract from subject if needed
//       if (course.educationalLevel) {
//         setLevel(course.educationalLevel)
//       } else if (course.subject && typeof course.subject === "object" && course.subject.educationalLevel) {
//         setLevel(course.subject.educationalLevel)
//       } else {
//         setLevel("")
//       }

//       // Handle stream - extract from subject if needed
//       if (course.stream) {
//         setStream(course.stream)
//       } else if (course.subject && typeof course.subject === "object" && course.subject.stream) {
//         setStream(course.subject.stream)
//       } else {
//         setStream("")
//       }

//       // Parse the complex database format
//       try {
//         console.log("Raw prerequisites from DB:", course.prerequisites)
//         console.log("Raw objectives from DB:", course.objectives)

//         const prereqArray = parseComplexDatabaseFormat(course.prerequisites)
//         const objArray = parseComplexDatabaseFormat(course.objectives)

//         console.log("Parsed prerequisites:", prereqArray)
//         console.log("Parsed objectives:", objArray)

//         setPrerequisites(convertToEnhancedFormat(prereqArray))
//         setObjectives(convertToEnhancedFormat(objArray))
//       } catch (error) {
//         console.error("Error parsing prerequisites/objectives:", error)
//         setPrerequisites([])
//         setObjectives([])
//         toast.error("Error loading course prerequisites and objectives")
//       }

//       // Set thumbnail preview if exists
//       if (course.thumbnail) {
//         setThumbnailPreviewUrl(course.thumbnail.url)
//         setHasThumbnail(true)
//       }
//     } else {
//       dispatch(fetchCourseById(id))
//     }
//   }, [course, dispatch, id])

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // Additional validation for educational restrictions
//     if (!hasEducationalDetails) {
//       toast.error("You must have assigned educational details to update courses.")
//       return
//     }

//     if (availableSubjects.length === 0) {
//       toast.error("No subjects available for your assigned educational levels.")
//       return
//     }

//     const formData = new FormData()
//     formData.append("title", title)
//     formData.append("description", description)

//     // Convert enhanced format to array of strings (matching schema)
//     const prereqArray = prerequisites.map((item) => item.text.trim()).filter((text) => text.length > 0)
//     const objArray = objectives.map((item) => item.text.trim()).filter((text) => text.length > 0)

//     // Send as JSON strings since FormData doesn't handle arrays well
//     formData.append("prerequisites", JSON.stringify(prereqArray))
//     formData.append("objectives", JSON.stringify(objArray))

//     // Ensure subject is a valid ObjectId string
//     if (subject && typeof subject === "string") {
//       formData.append("subject", subject)
//     } else {
//       toast.error("Please select a valid subject")
//       return
//     }

//     formData.append("published", published)
//     formData.append("teacher", teacher.id)

//     // Only append educational level and stream if they have values
//     if (level) {
//       formData.append("educationalLevel", level)
//     }
//     if (stream) {
//       formData.append("stream", stream)
//     }

//     if (thumbnail instanceof File) {
//       formData.append("thumbnail", thumbnail)
//     }

//     try {
//       setLoading(true)
//       await dispatch(updateCourse({ id, formData })).unwrap()
//       toast.success("Course updated successfully!")
//       setTimeout(() => navigate("/courses"), 1000)
//     } catch (error) {
//       console.error("Update error:", error)
//       toast.error(error || "An error occurred while updating the course")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDragOver = (event) => {
//     event.preventDefault()
//   }

//   const handleDrop = (event) => {
//     event.preventDefault()
//     const selectedFile = event.dataTransfer.files[0]
//     setThumbnail(selectedFile)
//     setThumbnailPreviewUrl(URL.createObjectURL(selectedFile))
//     setHasThumbnail(true)
//   }

//   const handleThumbnailChange = (event) => {
//     const selectedFile = event.target.files[0]
//     setThumbnail(selectedFile)
//     setThumbnailPreviewUrl(URL.createObjectURL(selectedFile))
//     setHasThumbnail(true)
//   }

//   // Enhanced prerequisites and objectives functions
//   const addPrerequisite = () => {
//     const newItem = {
//       id: generateId(),
//       text: "",
//       isEditing: true,
//       isNew: true,
//     }
//     setPrerequisites((prev) => [...prev, newItem])
//     setTimeout(() => {
//       const input = inputRefs.current[newItem.id]
//       if (input) input.focus()
//     }, 100)
//   }

//   const addObjective = () => {
//     const newItem = {
//       id: generateId(),
//       text: "",
//       isEditing: true,
//       isNew: true,
//     }
//     setObjectives((prev) => [...prev, newItem])
//     setTimeout(() => {
//       const input = inputRefs.current[newItem.id]
//       if (input) input.focus()
//     }, 100)
//   }

//   const updatePrerequisite = (id, text) => {
//     setPrerequisites((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
//   }

//   const updateObjective = (id, text) => {
//     setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
//   }

//   const toggleEdit = (id, type) => {
//     if (type === "prerequisites") {
//       setPrerequisites((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing, isNew: false } : item)),
//       )
//     } else {
//       setObjectives((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing, isNew: false } : item)),
//       )
//     }
//     setTimeout(() => {
//       const input = inputRefs.current[id]
//       if (input) input.focus()
//     }, 100)
//   }

//   const saveItem = (id, type) => {
//     if (type === "prerequisites") {
//       setPrerequisites((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, isEditing: false, isNew: false } : item)),
//       )
//     } else {
//       setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false, isNew: false } : item)))
//     }
//   }

//   const removeItem = (id, type) => {
//     if (type === "prerequisites") {
//       setPrerequisites((prev) => prev.filter((item) => item.id !== id))
//     } else {
//       setObjectives((prev) => prev.filter((item) => item.id !== id))
//     }
//   }

//   const handleKeyDown = (e, id, type) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       saveItem(id, type)
//     } else if (e.key === "Escape") {
//       const items = type === "prerequisites" ? prerequisites : objectives
//       const item = items.find((i) => i.id === id)
//       if (item?.isNew && !item.text.trim()) {
//         removeItem(id, type)
//       } else {
//         if (type === "prerequisites") {
//           setPrerequisites((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
//         } else {
//           setObjectives((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
//         }
//       }
//     }
//   }

//   const handleDragStart = (e, id, type) => {
//     setDraggedItem(id)
//     setDraggedType(type)
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOverItem = (e) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "move"
//   }

//   const handleDropItem = (e, targetId, type) => {
//     e.preventDefault()
//     if (!draggedItem || draggedType !== type) return

//     const items = type === "prerequisites" ? prerequisites : objectives
//     const draggedIndex = items.findIndex((item) => item.id === draggedItem)
//     const targetIndex = items.findIndex((item) => item.id === targetId)

//     if (draggedIndex === -1 || targetIndex === -1) return

//     const newItems = [...items]
//     const [draggedItemData] = newItems.splice(draggedIndex, 1)
//     newItems.splice(targetIndex, 0, draggedItemData)

//     if (type === "prerequisites") {
//       setPrerequisites(newItems)
//     } else {
//       setObjectives(newItems)
//     }

//     setDraggedItem(null)
//     setDraggedType(null)
//   }

//   const renderEditableItem = (item, type, index) => {
//     const isEmpty = !item.text.trim()
//     const isLongText = item.text.length > 100

//     return (
//       <div
//         key={item.id}
//         className={cn(
//           "group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
//           item.isEditing ? "border-blue-200 bg-blue-50/50" : "border-gray-200 hover:border-gray-300",
//           draggedItem === item.id && "opacity-50",
//           isEmpty && !item.isEditing && "border-red-200 bg-red-50/30",
//         )}
//         draggable={!item.isEditing}
//         onDragStart={(e) => handleDragStart(e, item.id, type)}
//         onDragOver={handleDragOverItem}
//         onDrop={(e) => handleDropItem(e, item.id, type)}
//       >
//         {/* Drag Handle */}
//         <div
//           className={cn(
//             "flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity",
//             item.isEditing && "opacity-0 pointer-events-none",
//           )}
//         >
//           <GripVertical className="h-4 w-4 text-gray-400" />
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           {item.isEditing ? (
//             <div className="space-y-2">
//               {isLongText || item.isNew ? (
//                 <Textarea
//                   ref={(el) => {
//                     inputRefs.current[item.id] = el
//                   }}
//                   value={item.text}
//                   onChange={(e) =>
//                     type === "prerequisites"
//                       ? updatePrerequisite(item.id, e.target.value)
//                       : updateObjective(item.id, e.target.value)
//                   }
//                   onKeyDown={(e) => handleKeyDown(e, item.id, type)}
//                   placeholder={`Enter ${type === "prerequisites" ? "prerequisite" : "objective"} ${index + 1}...`}
//                   className="min-h-[80px] resize-none"
//                   dir={getDirection(item.text)}
//                 />
//               ) : (
//                 <Input
//                   ref={(el) => {
//                     inputRefs.current[item.id] = el
//                   }}
//                   value={item.text}
//                   onChange={(e) =>
//                     type === "prerequisites"
//                       ? updatePrerequisite(item.id, e.target.value)
//                       : updateObjective(item.id, e.target.value)
//                   }
//                   onKeyDown={(e) => handleKeyDown(e, item.id, type)}
//                   placeholder={`Enter ${type === "prerequisites" ? "prerequisite" : "objective"} ${index + 1}...`}
//                   dir={getDirection(item.text)}
//                 />
//               )}
//               <div className="flex items-center gap-2 text-xs text-gray-500">
//                 <span>Press Enter to save, Esc to cancel</span>
//                 {item.text.length > 0 && (
//                   <Badge variant="secondary" className="text-xs">
//                     {item.text.length} chars
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-1">
//               <p
//                 className={cn("text-sm leading-relaxed", isEmpty && "text-red-500 italic")}
//                 dir={getDirection(item.text)}
//               >
//                 {item.text || `Empty ${type === "prerequisites" ? "prerequisite" : "objective"}`}
//               </p>
//               {isEmpty && (
//                 <div className="flex items-center gap-1 text-xs text-red-500">
//                   <AlertCircle className="h-3 w-3" />
//                   <span>This item is empty</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex-shrink-0 flex items-center gap-1">
//           {item.isEditing ? (
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={() => saveItem(item.id, type)}
//               className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
//             >
//               <Save className="h-4 w-4" />
//             </Button>
//           ) : (
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={() => toggleEdit(item.id, type)}
//               className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <Edit3 className="h-4 w-4" />
//             </Button>
//           )}
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             onClick={() => removeItem(item.id, type)}
//             className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Restriction Message */}
//         {restrictionMessage && (
//           <Alert className="m-6 mb-0" variant="destructive">
//             <InfoIcon className="h-4 w-4" />
//             <AlertDescription>{restrictionMessage}</AlertDescription>
//           </Alert>
//         )}

//         <form className="p-6 space-y-6" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Left Column */}
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
//                   <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//                   Course Title
//                 </Label>
//                 <Input
//                   id="title"
//                   type="text"
//                   value={title}
//                   dir={getDirection(title)}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter course title"
//                   className="mt-1"
//                   disabled={!hasEducationalDetails}
//                 />
//               </div>

//               {/* Educational Level Filter */}
//               {hasEducationalDetails && validEducationalLevels.length > 1 && (
//                 <div>
//                   <Label htmlFor="level" className="text-lg font-semibold text-gray-700">
//                     Educational Level
//                   </Label>
//                   <select
//                     id="level"
//                     value={level}
//                     onChange={(event) => setLevel(event.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                   >
//                     <option value="">All authorized levels</option>
//                     {validEducationalLevels.map((levelOption) => (
//                       <option key={levelOption} value={levelOption}>
//                         {levelOption}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Stream Filter */}
//               {hasEducationalDetails && validStreams.length > 0 && (
//                 <div>
//                   <Label htmlFor="stream" className="text-lg font-semibold text-gray-700">
//                     Stream
//                   </Label>
//                   <select
//                     id="stream"
//                     value={stream}
//                     onChange={(event) => setStream(event.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                   >
//                     <option value="">All streams</option>
//                     {validStreams.map((streamOption) => (
//                       <option key={streamOption} value={streamOption}>
//                         {streamOption}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <div>
//                 <Label htmlFor="subject" className="text-lg font-semibold text-gray-700">
//                   Subject
//                 </Label>
//                 <select
//                   id="subject"
//                   value={subject}
//                   onChange={(event) => setSubject(event.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                   disabled={!hasEducationalDetails || filteredSubjects.length === 0}
//                 >
//                   <option value="">
//                     {!hasEducationalDetails
//                       ? "No educational details assigned"
//                       : filteredSubjects.length === 0
//                         ? "No subjects available"
//                         : "Select a subject"}
//                   </option>
//                   {filteredSubjects.map((subject) => (
//                     <option key={subject._id} value={subject._id}>
//                       {subject.title} ({subject.educationalLevel})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <Label className="text-lg font-semibold text-gray-700">Visibility</Label>
//                 <div className="mt-2 space-x-4">
//                   <Label className="inline-flex items-center">
//                     <Input
//                       type="radio"
//                       className="size-6"
//                       name="visibility"
//                       value="true"
//                       checked={published === true}
//                       onChange={() => setPublished(true)}
//                       disabled={!hasEducationalDetails}
//                     />
//                     <span className="ml-2 text-gray-700">
//                       <EyeIcon className="inline-block mr-1 h-5 w-5" />
//                       Public
//                     </span>
//                   </Label>
//                   <Label className="inline-flex items-center">
//                     <Input
//                       type="radio"
//                       className="size-6"
//                       name="visibility"
//                       value="false"
//                       checked={published === false}
//                       onChange={() => setPublished(false)}
//                       disabled={!hasEducationalDetails}
//                     />
//                     <span className="ml-2 text-gray-700">
//                       <EyeOffIcon className="inline-block mr-1 h-5 w-5" />
//                       Private
//                     </span>
//                   </Label>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               <Label htmlFor="file-upload" className="text-lg font-semibold text-gray-700">
//                 Thumbnail
//               </Label>
//               <div
//                 className={`border-2 border-dashed rounded-lg p-4 text-center ${
//                   hasThumbnail && !thumbnail
//                     ? "hidden"
//                     : !hasEducationalDetails
//                       ? "border-gray-200 bg-gray-50"
//                       : "border-gray-300 hover:border-blue-500 transition-colors duration-300"
//                 }`}
//                 onDragOver={hasEducationalDetails ? handleDragOver : undefined}
//                 onDrop={hasEducationalDetails ? handleDrop : undefined}
//               >
//                 <div>
//                   <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-1 text-sm text-gray-600">
//                     {hasEducationalDetails
//                       ? "Drag and drop your image here, or click to select"
//                       : "Thumbnail upload disabled"}
//                   </p>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     className="sr-only"
//                     onChange={handleThumbnailChange}
//                     accept="image/*"
//                     disabled={!hasEducationalDetails}
//                   />
//                   <Button
//                     type="button"
//                     onClick={() => document.getElementById("file-upload").click()}
//                     className="mt-2"
//                     disabled={!hasEducationalDetails}
//                   >
//                     Select New Thumbnail
//                   </Button>
//                 </div>
//               </div>
//               {thumbnailPreviewUrl && (
//                 <div className="relative">
//                   <img
//                     src={thumbnailPreviewUrl || "/placeholder.svg"}
//                     alt="Thumbnail Preview"
//                     className="w-full h-80 rounded-lg shadow-md object-cover"
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     className="absolute top-2 right-2 bg-white/90 hover:bg-white"
//                     onClick={() => {
//                       setThumbnailPreviewUrl(null)
//                       setHasThumbnail(false)
//                       setThumbnail(null)
//                     }}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
//               <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
//               Description
//             </Label>
//             <Textarea
//               id="description"
//               value={description}
//               dir={getDirection(description)}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter course description"
//               className="min-h-[100px]"
//               disabled={!hasEducationalDetails}
//             />
//           </div>

//           {/* Enhanced Prerequisites Section */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label className="flex items-center gap-2">
//                 <CheckCircle2 className="h-5 w-5 text-blue-600" />
//                 <div>
//                   <h3 className="text-lg font-semibold">Prerequisites</h3>
//                   <p className="text-sm text-gray-500 font-normal">
//                     What knowledge or skills are required before starting?
//                   </p>
//                 </div>
//               </Label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addPrerequisite}
//                 className="flex items-center gap-2 bg-transparent"
//                 disabled={!hasEducationalDetails}
//               >
//                 <Plus className="h-4 w-4" />
//                 Add
//               </Button>
//             </div>
//             {prerequisites.length === 0 ? (
//               <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
//                 <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                 <p className="text-sm">No prerequisites added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {hasEducationalDetails ? 'Click "Add" to get started' : "Educational details required"}
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {prerequisites.map((item, index) => renderEditableItem(item, "prerequisites", index))}
//               </div>
//             )}
//             {prerequisites.length > 0 && (
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                   <Badge variant="secondary">
//                     {prerequisites.length} prerequisite{prerequisites.length !== 1 ? "s" : ""}
//                   </Badge>
//                   <span>•</span>
//                   <span>Drag to reorder</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Separator />

//           {/* Enhanced Objectives Section */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label className="flex items-center gap-2">
//                 <Target className="h-5 w-5 text-blue-600" />
//                 <div>
//                   <h3 className="text-lg font-semibold">Objectives</h3>
//                   <p className="text-sm text-gray-500 font-normal">What will learners achieve by the end?</p>
//                 </div>
//               </Label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addObjective}
//                 className="flex items-center gap-2 bg-transparent"
//                 disabled={!hasEducationalDetails}
//               >
//                 <Plus className="h-4 w-4" />
//                 Add
//               </Button>
//             </div>
//             {objectives.length === 0 ? (
//               <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
//                 <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                 <p className="text-sm">No objectives added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {hasEducationalDetails ? 'Click "Add" to get started' : "Educational details required"}
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {objectives.map((item, index) => renderEditableItem(item, "objectives", index))}
//               </div>
//             )}
//             {objectives.length > 0 && (
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                   <Badge variant="secondary">
//                     {objectives.length} objective{objectives.length !== 1 ? "s" : ""}
//                   </Badge>
//                   <span>•</span>
//                   <span>Drag to reorder</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-4 pt-4">
//             <Button type="button" variant="outline" onClick={() => navigate("/courses")} className="flex-1">
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading || !hasEducationalDetails || availableSubjects.length === 0}
//               className="flex-1 px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               {loading
//                 ? "Updating..."
//                 : !hasEducationalDetails
//                   ? "Educational Details Required"
//                   : availableSubjects.length === 0
//                     ? "No Subjects Available"
//                     : "Update Course"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default UpdateCourse
