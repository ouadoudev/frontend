// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loggedUser } from "@/store/authSlice";
// import { fetchUserById } from "@/store/userSlice";
// import { useNotifications } from "@/hooks/use-notifications";
// import { EnrolledSubjectsCard } from "@/components/profile/EnrolledSubjectsCard";
// import { OngoingCoursesCard } from "@/components/profile/OngoingCoursesCard";
// import { AchievementsCard } from "@/components/profile/AchievementsCard";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Skeleton } from "@/components/ui/skeleton";
// import { AlertCircle } from "lucide-react";
// import { UserProfileCard } from "@/components/profile/ProfileCard";
// import QuickStats from "@/components/profile/QuickStats";
// import TodoCard from "@/components/profile/TodoCard";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { error: userError, status: userStatus } = useSelector(
//     (state) => state.user
//   );
//   const { todos, status: todosStatus } = useSelector((state) => state.todos);
//   const user = useSelector(loggedUser);

//   const {
//     notifications,
//     status: notificationsStatus,
//     error: notificationsError,
//     isLoading: notificationsLoading,
//     refetch: refetchNotifications,
//   } = useNotifications(user?.id);

//   useEffect(() => {
//     if (user && user.id) {
//       dispatch(fetchUserById(user.id));
//     } else {
//       console.log("User or user.id is undefined");
//     }
//   }, [dispatch, user]);

//   const handlePlaySubject = (id) => {
//     navigate(`/subject/${id}`);
//   };

//   const handleViewCourse = (id) => {
//     navigate(`/courses/${id}`);
//   };

//   const handleSubscribe = () => {
//     navigate(`/pricing`);
//   };

//   // Loading state
//   if (userStatus === "loading" || todosStatus === "loading") {
//     return (
//       <div className="w-full min-h-screen">

//         <div className="container mx-auto mt-8 px-4 md:px-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="md:col-span-1">
//               <Skeleton className="h-64 w-full" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error states
//   if (userStatus === "failed") {
//     return (
//       <div className="w-full min-h-screen">

//         <div className="container mx-auto mt-8 px-4 md:px-6">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               Error fetching user data: {userError}
//             </AlertDescription>
//           </Alert>
//         </div>
//       </div>
//     );
//   }

//   const enrolledSubjects = user?.enrolledSubjects || [];
//   const userImageSrc = user?.user_image ? user.user_image.url : "/profile.png";

//   return (
//     <div className="w-full min-h-screen">
//       <div className="container mx-auto p-6 max-w-7xl">
//         <div className="flex flex-col md:flex-row gap-6 mb-8">
//           <UserProfileCard
//             user={user}
//             userImageSrc={userImageSrc}
//             notifications={notifications}
//             notificationError={notificationsError}
//             isLoading={notificationsLoading}
//             onRefresh={refetchNotifications}
//           />

//           <QuickStats user={user} ongoingCourses={user?.ongoingCourses} />
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           <div className="space-y-6 lg:col-span-2">
//             <OngoingCoursesCard
//               user={user}
//               ongoingCourses={user?.ongoingCourses}
//               handleViewCourse={handleViewCourse}
//             />
//           </div>
//           <div className="space-y-6">
//             <EnrolledSubjectsCard
//               enrolledSubjects={enrolledSubjects}
//               handlePlaySubject={handlePlaySubject}
//               handleSubscribe={handleSubscribe}
//             />
//             <TodoCard />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loggedUser } from "@/store/authSlice";
import { fetchUserById } from "@/store/userSlice";
import { useNotifications } from "@/hooks/use-notifications";
import { EnrolledSubjectsCard } from "@/components/profile/EnrolledSubjectsCard";
import { OngoingCoursesCard } from "@/components/profile/OngoingCoursesCard";
import { AchievementsCard } from "@/components/profile/AchievementsCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { UserProfileCard } from "@/components/profile/ProfileCard";
import QuickStats from "@/components/profile/QuickStats";
import TodoCard from "@/components/profile/TodoCard";
import StudentResourcesList from "@/components/profile/StudentResourcesList";
import { checkAndAwardBadges } from "@/store/dynamicBadgeSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    error: userError,
    status: userStatus,
    user: detailedUser,
  } = useSelector((state) => state.user);
  const { todos, status: todosStatus } = useSelector((state) => state.todos);
  const authUser = useSelector(loggedUser);

  const {
    notifications,
    status: notificationsStatus,
    error: notificationsError,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useNotifications(authUser?.id);

  useEffect(() => {
    if (
      authUser?.id &&
      typeof authUser.id === "string" &&
      authUser.id.length > 0
    ) {
      // Only fetch if enrolledSubjects or ongoingCourses are missing
      if (!authUser.enrolledSubjects || !authUser.ongoingCourses) {
        dispatch(fetchUserById(authUser.id));
      }
      dispatch(checkAndAwardBadges(authUser.id));
    } else {
      console.warn("Invalid or missing user ID, redirecting to login");
      navigate("/login");
    }
  }, [dispatch, authUser, navigate]);

  const handlePlaySubject = (id) => {
    navigate(`/subject/${id}`);
  };

  const handleViewCourse = (id) => {
    navigate(`/courses/${id}`);
  };

  const handleSubscribe = () => {
    navigate("/pricing");
  };

  // Use detailedUser from userSlice if available, otherwise fall back to authUser
  const user = detailedUser || authUser;

  // Loading state
  if (userStatus === "loading" || todosStatus === "loading") {
    return (
      <div className="w-full min-h-screen">
        <div className="container mx-auto mt-8 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (userStatus === "failed") {
    return (
      <div className="w-full min-h-screen">
        <div className="container mx-auto mt-8 px-4 md:px-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error fetching user data:{" "}
              {typeof userError === "string"
                ? userError
                : userError?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Handle missing user
  if (!user) {
    return (
      <div className="w-full min-h-screen">
        <div className="container mx-auto mt-8 px-4 md:px-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              User not found. Please log in again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const enrolledSubjects = user.enrolledSubjects || [];
  const userImageSrc = user.user_image?.url || "/profile.png";

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto p-6 max-w-8xl">
        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <UserProfileCard
            user={user}
            userImageSrc={userImageSrc}
            notifications={notifications}
            notificationError={notificationsError}
            isLoading={notificationsLoading}
            onRefresh={refetchNotifications}
          />
          <QuickStats user={user} ongoingCourses={user.ongoingCourses || []} />
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side (2/3 width on large screens) */}
          <div className="flex flex-col gap-6 flex-1 lg:basis-2/3">
            <OngoingCoursesCard
              user={user}
              ongoingCourses={user.ongoingCourses || []}
              handleViewCourse={handleViewCourse}
            />
            <EnrolledSubjectsCard
              enrolledSubjects={enrolledSubjects}
              handlePlaySubject={handlePlaySubject}
              handleSubscribe={handleSubscribe}
            />
            <StudentResourcesList user={user} />
          </div>

          {/* Right side (1/3 width on large screens) */}
          <div className="flex flex-col gap-6 flex-1 lg:basis-1/3">
            <AchievementsCard user={user} />
            <TodoCard todos={todos} status={todosStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
