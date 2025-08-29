import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export default function CoursesCard({ user }) {
  const navigate = useNavigate()

  const handleViewCourse = (id) => {
    navigate(`/courses/${id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Ongoing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {user.ongoingCourses && user.ongoingCourses.length > 0 ? (
            <ScrollArea className="h-64">
              {user.ongoingCourses.map((ongoingCourse) => (
                <motion.div
                  key={ongoingCourse.course._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 last:mb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{ongoingCourse.course.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCourse(ongoingCourse.course._id)}
                    >
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Started on: {new Date(ongoingCourse.startedAt).toLocaleDateString()}
                  </p>
                  <Progress value={33} className="h-2" />
                  <p className="text-xs text-right mt-1 text-gray-500">33% Complete</p>
                </motion.div>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500">No ongoing courses.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

