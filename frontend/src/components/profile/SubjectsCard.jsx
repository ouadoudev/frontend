import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, PlusCircle } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export default function SubjectsCard({ user }) {
  const navigate = useNavigate()
  const enrolledSubjects = user.enrolledSubjects || []

  const handlePlaySubject = (id) => {
    navigate(`/subject/${id}`)
  }

  const handleSubscribe = () => {
    navigate(`/subscribe`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Enrolled Subjects</CardTitle>
          <Button variant="outline" size="sm" onClick={handleSubscribe}>
            <PlusCircle className="mr-2 h-4 w-4" /> Enroll Subject
          </Button>
        </CardHeader>
        <CardContent>
          {enrolledSubjects.length > 0 ? (
            <ScrollArea className="h-64">
              {enrolledSubjects.map((subject) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div>
                    <span className="font-medium">{subject.title.split(" - ")[0]}</span>
                    <Badge variant="secondary" className="ml-2">In Progress</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handlePlaySubject(subject._id)}>
                    <BookOpen className="mr-2 h-4 w-4" /> Continue
                  </Button>
                </motion.div>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-gray-500">No subjects enrolled yet.</p>
              <Button variant="outline" onClick={handleSubscribe}>
                <PlusCircle className="mr-2 h-4 w-4" /> Enroll Subject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

