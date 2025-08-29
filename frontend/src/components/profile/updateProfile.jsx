import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, updateUser } from "@/store/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { logout, loggedUser } from "@/store/authSlice";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user);
  const user = useSelector(loggedUser);
  console.log("Logged user from Redux:", user);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [educationalCycle, setEducationalCycle] = useState(
    user?.educationalCycle || ""
  );
  const [educationalLevel, setEducationalLevel] = useState(
    user?.educationalLevel || ""
  );
  const [bio, setBio] = useState(user?.bio || "");
  const [stream, setStream] = useState(user?.stream || "");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("user");

  useEffect(() => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setBio(user?.bio || "");
    setEducationalCycle(user?.educationalCycle || "");
    setEducationalLevel(user?.educationalLevel || "");
    setStream(user?.stream || "");
  }, [user]);

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (currentPassword && newPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    if (avatar) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(avatar.type)) {
        toast.error("Please upload a valid image file (JPEG/PNG)");
        return;
      }
      formData.append("user_image", avatar);
    }

    try {
      setLoading(true);
      const result = await dispatch(
        updateUser({ id, userData: formData })
      ).unwrap();

      setLoading(false);
      const updatedUserData = { ...user, ...result };
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      toast.success("Your profile information has been updated.");

      // ⏳ Delayed redirect after 2 seconds
      setTimeout(() => {
        if (role) {
          if (role.role === "admin") {
            navigate("/dashboard");
          } else if (role.role === "teacher") {
            navigate("/teacher");
          } else if (role.role === "student") {
            navigate("/profile");
          }
        }
      }, 1000); // 2 seconds
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while updating your profile.");
    }
  };

  const switchToUserSection = () => {
    setActiveSection("user");
  };

  const switchToEducationalSection = () => {
    setActiveSection("educational");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

    const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? "rtl" : "ltr";
  };

  const userImageSrc = user.user_image ? user.user_image.url : "/profile.png";

  return (
   <div className="h-full py-4 sm:py-8 md:py-12 z-30 flex items-center justify-center px-4">
  <Card className="w-full max-w-3xl bg-transparent dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
    <CardHeader>
  
    </CardHeader>
    <CardContent>
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          className={`px-3 py-2 text-sm sm:text-base sm:px-4 ${
            activeSection === "user"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={switchToUserSection}
        >
          Informations utilisateur
        </Button>
        <Button
          className={`px-3 py-2 text-sm sm:text-base sm:px-4 ${
            activeSection === "educational"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={switchToEducationalSection}
        >
          Détails pédagogiques
        </Button>
      </div>

      {activeSection === "user" && (
        <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <label htmlFor="avatar" className="cursor-pointer group">
              <div className="relative">
                <img
                  alt="Your avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg transition-transform group-hover:scale-105"
                  src={userImageSrc || "/placeholder.svg"}
                />
                <div className="absolute inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs sm:text-sm">Modifier</span>
                </div>
              </div>
            </label>

            <Input
              accept="image/*"
              id="avatar"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 mt-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Entrez votre email"
              type="email"
              value={email}
              readOnly
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 mt-3">
            <Label htmlFor="bio">Biographie</Label>
            <textarea
              id="bio"
              placeholder="Parlez-nous un peu de vous"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            dir={getDirection(bio)}
           />
          </div>

          <div className="space-y-2 mt-3">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input
              id="current-password"
              placeholder="Saisissez votre Nouveau mot de passe"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 mt-3">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              placeholder="Saisissez votre Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
          </div>
        </form>
      )}
      
      {activeSection === "educational" && (
        <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
          <div className="space-y-2">
            <Label htmlFor="educationalCycle">Cycle d'enseignement</Label>
            <Input
              id="educationalCycle"
              placeholder="Sélectionnez votre cycle d'enseignement"
              value={educationalCycle}
              readOnly
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 mt-3">
            <Label htmlFor="educationalLevel">Niveau d'enseignement</Label>
            <Input
              id="educationalLevel"
              placeholder="Sélectionnez votre niveau d'enseignement"
              value={educationalLevel}
              readOnly
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 mt-3">
            <Label htmlFor="stream">Filière</Label>
            <Input
              id="stream"
              placeholder="Sélectionnez votre filière"
              value={stream}
              readOnly
              className="w-full"
            />
          </div>
        </form>
      )}
      
      <CardFooter className="flex justify-center sm:justify-end mt-4">
        <Button
          size="sm"
          type="submit"
          className="w-full sm:w-auto mt-2 sm:ml-40 md:ml-60 lg:ml-80"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </CardContent>
  </Card>
</div>
  );
};

export default UpdateProfile;
