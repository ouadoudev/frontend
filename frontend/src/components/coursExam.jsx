import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, FileText, GraduationCap, Play, Eye, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

const exams = [
  {
    id: "1",
    name: "Midterm Examination",
    course: "Computer Science 101",
    date: "2024-02-15",
    time: "09:00 AM",
    duration: "2 hours",
    status: "completed",
    published: true,
    score: 85,
  },
  {
    id: "2",
    name: "Final Project Presentation",
    course: "Web Development",
    date: "2024-02-20",
    time: "02:00 PM",
    duration: "30 minutes",
    status: "upcoming",
    published: true,
  },
  {
    id: "3",
    name: "Quiz - Data Structures",
    course: "Advanced Programming",
    date: "2024-02-18",
    time: "11:00 AM",
    duration: "1 hour",
    status: "upcoming",
    published: true,
  },
  {
    id: "4",
    name: "Database Design Exam",
    course: "Database Systems",
    date: "2024-02-25",
    time: "10:00 AM",
    duration: "3 hours",
    status: "upcoming",
    published: false,
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "upcoming":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getButtonConfig = (exam) => {
  if (!exam.published) {
    return {
      text: "Not Available",
      icon: Lock,
      disabled: true,
      variant: "secondary",
    }
  }

  switch (exam.status) {
    case "upcoming":
      return {
        text: "Take Exam",
        icon: Play,
        disabled: false,
        variant: "default",
      }
    case "completed":
      return {
        text: "View Results",
        icon: Eye,
        disabled: false,
        variant: "outline",
      }
    default:
      return {
        text: "Not Available",
        icon: Lock,
        disabled: true,
        variant: "secondary",
      }
  }
}

export default function Cours() {
  const router = useRouter()

  const handleExamNavigation = (exam) => {
    if (!exam.published) return

    switch (exam.status) {
      case "upcoming":
        router.push(`/exam/${exam.id}/start`)
        break
      case "completed":
        router.push(`/exam/${exam.id}/results`)
        break
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <CardTitle>Course Exams</CardTitle>
        </div>
        <CardDescription>Upcoming and completed examinations for your enrolled courses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exams.map((exam, index) => (
          <div key={exam.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base leading-tight">{exam.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{exam.course}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!exam.published && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Unpublished
                      </Badge>
                    )}
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status === "upcoming" ? "Upcoming" : "Completed"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(exam.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{exam.duration}</span>
                  </div>
                  {exam.score && (
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <span>Score: {exam.score}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {(() => {
                  const buttonConfig = getButtonConfig(exam)
                  const Icon = buttonConfig.icon
                  return (
                    <Button
                      variant={buttonConfig.variant}
                      disabled={buttonConfig.disabled}
                      onClick={() => handleExamNavigation(exam)}
                      className="w-full sm:w-auto"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {buttonConfig.text}
                    </Button>
                  )
                })()}
              </div>
            </div>
            {index < exams.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
