import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUserRole, updateUserSuccess } from "@/store/authSlice"
import { educationalDetails } from "@/store/userSlice"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import AnimatedBackground from "@/components/AnimatedBackground"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GraduationCap, Loader2 } from "lucide-react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const EduDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userData, setUserData] = useState(null)
  const [educationalCycle, setEducationalCycle] = useState("")
  const [educationalLevel, setEducationalLevel] = useState("")
  const [stream, setStream] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserData = localStorage.getItem("user")

      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData)
          initializeUserData(parsedUserData)
        } catch (error) {
          console.error("Error parsing stored user data:", error)
          navigate("/login")
        }
      } else {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")
        const userId = params.get("userId")

        if (token && userId) {
          try {
            localStorage.setItem("token", token)

            const response = await axios.get("/users/me", {
              headers: { Authorization: `Bearer ${token}` },
            })

            const userData = {
              ...response.data,
              token, 
            }

            if (!Array.isArray(userData.enrolledSubjects)) {
              userData.enrolledSubjects = []
            }

            localStorage.setItem("user", JSON.stringify(userData))
            dispatch(updateUserSuccess(userData))
            window.history.replaceState({}, document.title, "/educational-details") // Clear URL params
            initializeUserData(userData)
          } catch (error) {
            console.error("Error fetching user data:", error)
            toast.error("Failed to load user data")
            navigate("/login")
          }
        } else {
          navigate("/login")
        }
      }
    }

    const initializeUserData = (userData) => {
      setUserData(userData)
      dispatch(setUserRole(userData.role))

      setEducationalCycle(userData.educationalCycle || "")
      setEducationalLevel(userData.educationalLevel || "")
      setStream(userData.stream || "")

      if (userData.role === "student" && userData.educationalCycle) {
        navigate("/profile")
      }
    }

    loadUserData()
  }, [dispatch, navigate])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const updatedDetails = {
      userId: user.id,
      educationalCycle,
      educationalLevel,
      stream,
    }

    try {
      await dispatch(educationalDetails(updatedDetails)).unwrap()
      const updatedUserData = {
        ...userData,
        ...updatedDetails,
        enrolledSubjects: userData.enrolledSubjects || [], 
      }
      localStorage.setItem("user", JSON.stringify(updatedUserData))
      setUserData(updatedUserData)
      toast.success("Educational details updated successfully.")
      navigate("/profile")
    } catch (error) {
      toast.error(error.message || "Failed to update educational details.")
      setIsSubmitting(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Redirect based on user role
  if (userData.role === "admin") {
    navigate("/dashboard")
    return null
  }

  if (userData.role === "teacher") {
    navigate("/teacher")
    return null
  }
  if (userData.role === "parent") {
    navigate("/parent")
    return null
  }

  // Form for student role and missing details
  if (userData.role === "student") {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
        <AnimatedBackground />
        <Card className="w-full max-w-2xl mx-auto z-50 bg-transparent">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <GraduationCap className="w-10 h-10" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome, <span className="text-blue-600 dark:text-blue-400">{userData.username} </span>!
            </CardTitle>
            <CardDescription className="text-lg mt-3 text-gray-600 dark:text-gray-400">
              Let's get started with your educational journey. Please fill in your details below to unlock your
              personalized learning experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="educationalCycle">Educational Cycle:</Label>
                <Select
                  value={educationalCycle}
                  onValueChange={(value) => {
                    setEducationalCycle(value)
                    setEducationalLevel("")
                    setStream("")
                  }}
                >
                  <SelectTrigger id="educationalCycle" className="bg-transparent">
                    <SelectValue placeholder="Select an educational cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primaire">Primaire</SelectItem>
                    <SelectItem value="Collège">Collège</SelectItem>
                    <SelectItem value="Lycée">Lycée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {educationalCycle && (
                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-2">
                  <Label htmlFor="educationalLevel">Educational Level</Label>
                  <Select
                    value={educationalLevel}
                    onValueChange={(value) => {
                      setEducationalLevel(value)
                      setStream("")
                    }}
                  >
                    <SelectTrigger id="educationalLevel" className="bg-transparent">
                      <SelectValue placeholder="Select an educational level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationalCycle === "Primaire" && (
                        <>
                          <SelectItem value="1ère année Primaire">1ère année Primaire</SelectItem>
                          <SelectItem value="2ème année Primaire">2ème année Primaire</SelectItem>
                          <SelectItem value="3ème année Primaire">3ème année Primaire</SelectItem>
                          <SelectItem value="4ème année Primaire">4ème année Primaire</SelectItem>
                          <SelectItem value="5ème année Primaire">5ème année Primaire</SelectItem>
                          <SelectItem value="6ème année Primaire">6ème année Primaire</SelectItem>
                        </>
                      )}
                      {educationalCycle === "Collège" && (
                        <>
                          <SelectItem value="1ère année collège">1ère année collège</SelectItem>
                          <SelectItem value="2ème année collège">2ème année collège</SelectItem>
                          <SelectItem value="3ème année collège">3ème année collège</SelectItem>
                        </>
                      )}
                      {educationalCycle === "Lycée" && (
                        <>
                          <SelectItem value="Tronc Commun">Tronc Commun</SelectItem>
                          <SelectItem value="1ère année du Baccalauréat">1ère année du Baccalauréat</SelectItem>
                          <SelectItem value="2ème année du Baccalauréat">2ème année du Baccalauréat</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              {educationalCycle === "Lycée" && educationalLevel && (
                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-2">
                  <Label htmlFor="stream">Stream</Label>
                  <Select value={stream} onValueChange={setStream}>
                    <SelectTrigger id="stream" className="bg-transparent">
                      <SelectValue placeholder="Select a stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationalLevel === "Tronc Commun" && (
                        <>
                          <SelectItem value="Sciences">Sciences</SelectItem>
                          <SelectItem value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</SelectItem>
                          <SelectItem value="Technologies">Technologies</SelectItem>
                        </>
                      )}
                      {educationalLevel === "1ère année du Baccalauréat" && (
                        <>
                          <SelectItem value="Sciences Mathématiques">Sciences Mathématiques</SelectItem>
                          <SelectItem value="Sciences Expérimentales">Sciences Expérimentales</SelectItem>
                          <SelectItem value="Sciences et Technologies Électriques">
                            Sciences et Technologies Électriques
                          </SelectItem>
                          <SelectItem value="Sciences et Technologies Mécaniques">
                            Sciences et Technologies Mécaniques
                          </SelectItem>
                          <SelectItem value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</SelectItem>
                          <SelectItem value="Sciences Économiques et Gestion">
                            Sciences Économiques et Gestion
                          </SelectItem>
                        </>
                      )}
                      {educationalLevel === "2ème année du Baccalauréat" && (
                        <>
                          <SelectItem value="Sciences Mathématiques A">Sciences Mathématiques A</SelectItem>
                          <SelectItem value="Sciences Mathématiques B">Sciences Mathématiques B</SelectItem>
                          <SelectItem value="Sciences Physiques">Sciences Physiques</SelectItem>
                          <SelectItem value="Sciences de la Vie et de la Terre">
                            Sciences de la Vie et de la Terre
                          </SelectItem>
                          <SelectItem value="Sciences Agronomiques">Sciences Agronomiques</SelectItem>
                          <SelectItem value="Sciences et Technologies Électriques">
                            Sciences et Technologies Électriques
                          </SelectItem>
                          <SelectItem value="Sciences et Technologies Mécaniques">
                            Sciences et Technologies Mécaniques
                          </SelectItem>
                          <SelectItem value="Sciences Économiques et Gestion">
                            Sciences Économiques et Gestion
                          </SelectItem>
                          <SelectItem value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Educational Details"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    )
  }

  return null
}

export default EduDetails
