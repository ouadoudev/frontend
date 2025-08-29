import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerAdmin } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Eye, EyeOff } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Form } from "@/components/ui/form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [userImage, setUserImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    //  Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    //  Clear password match error when either password field changes
    if (
      (name === "password" || name === "confirmPassword") &&
      errors.passwordMatch
    ) {
      setErrors((prev) => ({ ...prev, passwordMatch: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "La taille de l'image ne doit pas dépasser 5MB",
        }));
        return;
      }

      setUserImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    }

    //  Add password matching validation
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.passwordMatch = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (userImage) {
      formDataToSend.append("user_image", userImage);
    }

    try {
      // Dispatch Redux action
      await dispatch(registerAdmin(formDataToSend)).unwrap();

        toast.success(
          "Veuillez vérifier votre e-mail pour activer votre compte administrateur."
        );
         navigate("/email-sent");
    } catch (error) {
      // Error handling
      setErrors({
        submit: error || "Erreur lors de l'inscription. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <div className="min-h-screen z-30 flex items-center justify-center w-full px-4 py-6">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="lg:hidden w-full h-48">
            <img
              className="object-cover w-full h-full"
              src="/login.jfif"
              alt="Mobile login"
            />
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="w-full p-5 sm:p-6">
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Inscription Administrateur
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Créez votre compte administrateur LMS
                </p>
              </div>
              <Form>
                <form onSubmit={handleSubmit}>
                  {/* Avatar Upload */}
                  <div className="flex justify-center mb-4">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage src={imagePreview || "/placeholder.svg"} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          <User className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload className="w-6 h-6 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-sm text-center">
                      {errors.image}
                    </p>
                  )}
                  <div className="mb-4">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nom d'utilisateur <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Entrez votre nom d'utilisateur"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Entrez votre email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mot de passe <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pr-12"
                        placeholder="Entrez votre mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirmer le mot de passe{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pr-12"
                        placeholder="Confirmez votre mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                    {errors.passwordMatch && (
                      <p className="text-red-500 text-sm">
                        {errors.passwordMatch}
                      </p>
                    )}
                  </div>

                  {errors.submit && (
                    <p className="text-red-500 text-sm text-center">
                      {errors.submit}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                  >
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                  </Button>
                </form>
              </Form>
            </div>
            <div className="hidden lg:block w-1/2">
              <img
                className="object-cover w-full h-full"
                src="/login.jfif"
                alt="Desktop login"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
