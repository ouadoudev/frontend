import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Landing from "./pages/landing/Landing";
import Dashboard from "./pages/Dashboard";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

// Pages: Landing children
import EducationalCycle from "./pages/landing/Cycle";
import Contact from "./pages/landing/Contact";

// Pages: Student
import Lesson from "./pages/Student/Lesson";
import Course from "./pages/Student/Course";
import Subject from "./pages/Student/Subject";
import Profile from "./pages/Student/Profile";
import UserConversation from "./pages/Student/Conversation";
import ExerciseSubmission from "./pages/Student/ExerciseSubmit";
import SubmitExam from "./pages/Student/submitExam";
import Register from "./pages/Student/Register";
import EduDetails from "./pages/Student/EduDetails";
import Pricing from "./pages/Pricing";

// Pages: Teacher
import TeacherRegister from "./pages/Teacher/Register";
import TeacherProfile from "./pages/Teacher/Teacher-profile";
import ProfileTeacher from "./pages/Teacher/Profile";
import Courses from "./pages/Teacher/Courses";
import Subjects from "./pages/Teacher/Subjects";
import Lessons from "./pages/Teacher/Lessons";

// Components: Dashboard
import Layout from "./components/dashboard/layouts/Layout";
import Teachers from "./components/dashboard/users/Teachers";
import Calendar from "./components/dashboard/Calendar";
import Students from "./components/dashboard/users/Students";
import SubscriptionRequests from "./components/dashboard/operations/SubscriptionRequests";
import BankAccounts from "./components/dashboard/operations/BankAccounts";
import ManageHiring from "./components/dashboard/users/ManageHiring";
import UpdateLesson from "./components/dashboard/lesson/updateLesson";
import CreateLesson from "./components/dashboard/lesson/CreateLesson";
import CreateCourseForm from "./components/dashboard/course/CreateCourse";
import UpdateCourse from "./components/dashboard/course/updateCourse";
import CreateSubject from "./components/dashboard/subject/CreateSubject";
import UpdateSubject from "./components/dashboard/subject/updateSubject";
import Conversation from "./components/dashboard/operations/Conversation";
import TestimonialManager from "./components/dashboard/operations/TestimonialManager";
import Testimonial from "./components/dashboard/operations/TestimonialsList";
import Partenaires from "./components/dashboard/operations/Partenaires";
import CreatePartenaire from "./components/dashboard/operations/CreatePartenaire";
import UpdatePartenaire from "./components/dashboard/operations/UpdatePartenaire";
import Resources from "./components/dashboard/resource/Resources";
import SubjectResources from "./components/dashboard/resource/SubjectResources";
import CreateResource from "./components/dashboard/resource/CreateResource";

// Components: Profile
import PLayout from "./components/profile/Layout/PLayout";
import VerifyEmail from "./components/profile/verifyEmail";
import EmailSent from "./components/profile/EmailSent";
import UpdateUser from "./components/profile/updateProfile";
import PasswordResetForm from "./components/profile/PasswordResetForm";
import TodoCard from "./components/profile/TodoCard";

// Components: Exams & Quizzes
import CreateQuiz from "./components/dashboard/quiz/CreateQuiz";
import UpdateQuiz from "./components/dashboard/quiz/UpdateQuiz";
import ViewQuiz from "./components/dashboard/quiz/ViewQuiz";
import CreateExamForm from "./components/dashboard/exam/CreateExam";
import UpdateExamForm from "./components/dashboard/exam/UpdateExam";
import ExamList from "./components/dashboard/exam/ExamList";
import ExamView from "./components/dashboard/exam/ExamView";
import ExamResults from "./components/dashboard/exam/examResults";
import UserScorePage from "./components/dashboard/exam/examResults";

// Components: Misc
import ExerciseGenerator from "./components/dashboard/exercise/Exercise";
import Exercises from "./components/dashboard/exercise/Exercises";
import Procedure from "./components/Procedure";
import EditExercise from "./components/dashboard/exercise/EditExercise";
import TeacherRevenueHistory from "./pages/Teacher/TeacherRevenueHistory";
import PendingRevenuesAdmin from "./components/dashboard/revenue/PendingRevenuesAdmin";
import AdminRegister from "./pages/AdminRegister";
import UpdateResource from "./components/dashboard/resource/updateResource";
import AdminConversation from "./components/dashboard/operations/AdminConversation";
import BadgesDashboard from "./components/dashboard/badges/BadgesDashboard";
import CreateBadge from "./components/dashboard/badges/CreateBadge";
import UpdateBadge from "./components/dashboard/badges/updateBadge";
import RenewSubscription from "./components/RenewSubscription";
import ExerciseAttachmentUpload from "./components/dashboard/exercise/ExerciseAttachmentUpload";
import { logout } from "./store/authSlice";
import store from "./store/store";

axios.defaults.baseURL = "http://tamadrus-api.onrender.com";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const code = error.response?.data?.code;

    if (code === "TOKEN_EXPIRED") {
      try {
        await store.dispatch(logout());
      } catch (err) {
        console.error("Force logout failed", err);
      } finally {
        window.location.href = "/login"; 
      }
    }

    return Promise.reject(error);
  }
);

const App = () => {
  return (
    <BrowserRouter>
      <TestimonialManager>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Landing />}>
            <Route path="/password-reset" element={<PasswordResetForm />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/email-sent" element={<EmailSent />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/procedure" element={<Procedure />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/educational-cycle" element={<EducationalCycle />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register/admin" element={<AdminRegister />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/teacher" element={<TeacherRegister />} />
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path={`/teacher`} element={<ProfileTeacher />} />
            <Route path="/CreateLesson" element={<CreateLesson />} />
            <Route path="/Tasks" element={<TodoCard />} />
            <Route
              path="/revenue-teacher"
              element={<TeacherRevenueHistory />}
            />
            <Route path="/revenue-admin" element={<PendingRevenuesAdmin />} />
            <Route
              path="/subscription-requests"
              element={<SubscriptionRequests />}
            />
            <Route path="/bank" element={<BankAccounts />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/hiring" element={<ManageHiring />} />
            <Route path={`/update/:id`} element={<UpdateUser />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/dashboard/messages" element={<Conversation />} />
            <Route
              path="/dashboard/admin/messages"
              element={<AdminConversation />}
            />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/students" element={<Students />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/badges" element={<BadgesDashboard />} />
            <Route path="/badges/create" element={<CreateBadge />} />
            <Route path="/badges/update/:id" element={<UpdateBadge />} />
            <Route path="/resource/:subject" element={<SubjectResources />} />
            <Route path="/CreateResource" element={<CreateResource />} />
            <Route
              path="/update/resource/:resourceId"
              element={<UpdateResource />}
            />
            <Route path="/partenaires" element={<Partenaires />} />
            <Route path="/CreatePartenaire" element={<CreatePartenaire />} />
            <Route
              path="/update/partenaire/:id"
              element={<UpdatePartenaire />}
            />
            <Route path="/courses" element={<Courses />} />
            <Route path="/CreateCourse" element={<CreateCourseForm />} />
            <Route path="/CreateSubject" element={<CreateSubject />} />
            <Route path="/update/course/:id" element={<UpdateCourse />} />
            <Route path="/update/lesson/:id" element={<UpdateLesson />} />
            <Route path="/update/subject/:id" element={<UpdateSubject />} />
            <Route
              path={`/exercise/create/:lessonId`}
              element={<ExerciseGenerator />}
            />
            <Route
              path="/exercise/edit/:exerciseId"
              element={<EditExercise />}
            />
            <Route
              path="/exercise/upload-attachment/:exerciseId"
              element={<ExerciseAttachmentUpload />}
            />
            <Route
              path={`/exam/create/:courseId`}
              element={<CreateExamForm />}
            />
            <Route path={`/exam/edit/:examId`} element={<UpdateExamForm />} />
            <Route path={`/course/:courseId/exams`} element={<ExamList />} />
            <Route
              path="/exam/:examId/leaderboard"
              element={<LeaderboardPage />}
            />

            <Route path="/quiz/create/:lessonId" element={<CreateQuiz />} />
            <Route
              path="/quiz/update/:lessonId/:quizId"
              element={<UpdateQuiz />}
            />
            <Route path="/quiz/view/:lessonId" element={<ViewQuiz />} />
            <Route path="/exercises/:lessonId" element={<Exercises />} />
          </Route>

          <Route path={`/educational-details`} element={<EduDetails />} />
          <Route path="/" element={<PLayout />}>
            <Route path={`/profile`} element={<Profile />} />
            <Route path="/messages" element={<UserConversation />} />
            <Route path={`/update/profile/:id`} element={<UpdateUser />} />
            <Route
              path={`/subscription/:invoiceNumber`}
              element={<RenewSubscription />}
            />
          </Route>
          <Route path={`/lessons/:id`} element={<Lesson />} />
          <Route path={`/exercise/:id`} element={<ExerciseSubmission />} />
          <Route path={`/exam/view/:examId`} element={<ExamView />} />
          <Route path={`/exam/:examId/results`} element={<ExamResults />} />
          <Route path="/exam/:examId/submit" element={<SubmitExam />} />
          <Route path="/exam/:examId" element={<UserScorePage />} />
          <Route path={`/courses/:id`} element={<Course />} />
          <Route path={`/subject/:id`} element={<Subject />} />
          <Route path={`/teacher/:id`} element={<TeacherProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TestimonialManager>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
};

export default App;
