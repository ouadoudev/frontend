import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Loader2,
  Users as UsersIcon,
  BookOpen,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedUser } from "@/store/authSlice";
import NotificationDropdown from "@/components/NotificationDropdown";
import { fetchUserNotifications } from "@/store/notificationSlice";
import { useNavigate } from "react-router-dom";
import { getChildren } from "@/store/parentSlice";

const ParentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector(loggedUser);

  const { children, loadingChildren, childrenError } = useSelector(
    (state) => state.parent
  );

  const {
    notifications,
    isLoading: notificationsLoading,
    error: notificationError,
  } = useSelector((state) => state.notifications);

  useEffect(() => {
    console.log("Children data:", children);
    console.log("Children type:", typeof children);
    console.log("Is array?", Array.isArray(children));
  }, [children]);

  useEffect(() => {
    if (authUser?.id) {
      console.log("Fetching children for parent:", authUser.id);
      dispatch(getChildren(authUser.id));
      dispatch(fetchUserNotifications(authUser.id));
    }
  }, [authUser?.id, dispatch]);

  const refreshNotifications = () => {
    if (authUser?.id) {
      dispatch(fetchUserNotifications(authUser.id));
    }
  };

  const refreshChildren = () => {
    if (authUser?.id) {
      dispatch(getChildren(authUser.id));
    }
  };

  const getChildrenArray = () => {
    if (Array.isArray(children)) {
      return children;
    }

    if (children && typeof children === "object") {
      if (Array.isArray(children.children)) return children.children;
      if (Array.isArray(children.data)) return children.data;
      if (Array.isArray(children.students)) return children.students;
      if (Array.isArray(children.enfants)) return children.enfants;
      if (Array.isArray(children.users)) return children.users;
      if (Object.keys(children).every((key) => !isNaN(key))) {
        return Object.values(children);
      }
    }

    return [];
  };

  const childrenArray = getChildrenArray();

  if (!authUser || loadingChildren) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-muted-foreground">
                Chargement du tableau de bord...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <div className="flex justify-end items-center p-4">
          <NotificationDropdown
            notifications={notifications}
            isLoading={notificationsLoading}
            notificationError={notificationError}
            userId={authUser?.id}
            onRefresh={refreshNotifications}
          />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row gap-8 items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={authUser.user_image?.url || "/placeholder.svg"}
              alt={authUser.username}
            />
            <AvatarFallback className="text-2xl">
              {authUser.username
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-row flex-wrap justify-center sm:justify-start items-center gap-3">
              <h1 className="text-2xl font-bold">{authUser.username}</h1>
              <Badge className="bg-purple-100 text-purple-800 whitespace-nowrap">
                {authUser.role}
              </Badge>
              {authUser.isOnline && (
                <Badge className="bg-green-100 text-green-800 flex items-center whitespace-nowrap">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  En ligne
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 text-sm text-muted-foreground items-center sm:items-start justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {authUser.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {childrenArray.length > 0 && (
            <Badge variant="outline" className="text-sm">
              {childrenArray.length} enfant(s)
            </Badge>
          )}
        </div>

        {childrenError ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Erreur de chargement
              </h3>
              <p className="text-muted-foreground mb-4">
                {childrenError.message ||
                  "Impossible de charger la liste des enfants"}
              </p>
              <Button onClick={refreshChildren}>Réessayer</Button>
            </CardContent>
          </Card>
        ) : childrenArray.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucun enfant trouvé
              </h3>
              <p className="text-muted-foreground">
                {loadingChildren
                  ? "Chargement..."
                  : "Aucun enfant n'est actuellement associé à votre compte parent."}
              </p>
              {!loadingChildren && (
                <Button onClick={refreshChildren} className="mt-4">
                  Actualiser
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childrenArray.map((child) => {
              const childId =
                child._id ||
                child.id ||
                child.childId ||
                Math.random().toString();
              const username =
                child.username || child.name || "Enfant sans nom";
              const userImage =
                child.user_image?.url ||
                child.image ||
                child.avatar ||
                "/placeholder.svg";
              const educationalCycle =
                child.educationalCycle || child.cycle || "Non spécifié";
              const educationalLevel =
                child.educationalLevel || child.level || "Non spécifié";
              const stream = child.stream || child.filiere || "Non spécifié";
              const averageProgressArray = Array.isArray(child.averageProgress)
                ? child.averageProgress
                : [];
              const firstProgress = averageProgressArray[0];
              const completedLessons =
                firstProgress?.completedLessons?.length || 0;
              const totalLessons = firstProgress?.totalLessons || 0;
              const averageProgress =
                totalLessons > 0
                  ? Math.round((completedLessons / totalLessons) * 100)
                  : 0;

              const subjectsCount = Array.isArray(child.subjects)
                ? child.subjects.length
                : 0;

              return (
                <Card key={childId} className="p-6 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center text-center p-0">
                    <div className="w-full p-6 border-b">
                      <Avatar className="w-20 h-20 mb-4 mx-auto">
                        <AvatarImage src={userImage} alt={username} />
                        <AvatarFallback className="text-xl">
                          {username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold mb-2">{username}</h3>
                      <div className="flex flex-wrap gap-2 justify-center mb-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          {educationalCycle}
                        </Badge>
                        <Badge variant="outline">{stream}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {educationalLevel}
                      </p>
                    </div>

                    <div className="w-full p-6 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Progression moyenne
                        </span>
                        <span className="font-semibold text-green-600">
                          {averageProgress}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                         Matières
                        </span>
                        <span className="font-semibold">{subjectsCount}</span>
                      </div>

                      <Button
                        className="w-full mt-4"
                     onClick={() => navigate(`/parent/suivi?username=${child.username}`)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Voir le profil détaillé
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
