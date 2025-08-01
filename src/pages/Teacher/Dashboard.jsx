import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Star, Calendar } from "lucide-react"


export default function TeacherOverview({ teacher }) {
  const totalStudents = teacher.courses.reduce((sum, course) => sum + course.enrolls, 0)
  const totalCourses = teacher.courses.length
  const averageRating = 4.5 

  return (
    <div className="container mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={teacher.user_image.url} alt={teacher.username} />
            <AvatarFallback>{teacher.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{teacher.username}</h1>
            <p className="text-muted-foreground">{teacher.discipline}</p>
          </div>
        </div>
        <Button>Edit Profile</Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Lessons</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Overview of your current courses</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {teacher.courses.slice(0, 5).map((course) => (
                <li key={course._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.enrolls} students enrolled</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Students who recently joined your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {/* This would be populated with actual recent enrollment data */}
              <li className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">Enrolled in "Introduction to Biology"</p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Alice Davis</p>
                  <p className="text-sm text-muted-foreground">Enrolled in "Advanced Mathematics"</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Schedule</CardTitle>
          <CardDescription>Your upcoming lessons and exams</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {/* This would be populated with actual upcoming lessons and exams */}
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Introduction to Biology - Lesson 5</p>
                <p className="text-sm text-muted-foreground">Cell Structure and Function</p>
              </div>
              <p className="text-sm">Tomorrow, 10:00 AM</p>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Advanced Mathematics - Exam</p>
                <p className="text-sm text-muted-foreground">Calculus Midterm</p>
              </div>
              <p className="text-sm">Friday, 2:00 PM</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

