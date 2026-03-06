import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerParent } from "@/store/authSlice";
import { fetchUsers } from "@/store/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Form } from "@/components/ui/form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ParentRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get users from Redux user slice
  const { users, status, error } = useSelector((state) => state.user);
  
  // Filter students from all users
  const studentUsers = users.filter((user) => user.role === "student");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    enfants: [], // selected students {id, name}
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter out already selected students
  const availableStudents = studentUsers.filter(
    (student) => !formData.enfants.find((enfant) => enfant.id === student._id)
  );

  // Add student to enfants list
  const handleAddEnfant = (student) => {
    setFormData((prev) => ({
      ...prev,
      enfants: [...prev.enfants, { id: student._id, name: student.username }],
    }));
    setIsDropdownOpen(false);
  };

  // Remove student from enfants list
  const handleRemoveEnfant = (id) => {
    setFormData((prev) => ({
      ...prev,
      enfants: prev.enfants.filter((e) => e.id !== id),
    }));
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if ((name === "password" || name === "confirmPassword") && errors.passwordMatch)
      setErrors((prev) => ({ ...prev, passwordMatch: "" }));
  };

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "La taille de l'image ne doit pas dépasser 5MB" }));
        return;
      }
      setUserImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide";

    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";

    if (!formData.confirmPassword) newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)
      newErrors.passwordMatch = "Les mots de passe ne correspondent pas";

    if (formData.enfants.length === 0) newErrors.enfants = "Vous devez ajouter au moins un enfant";
    if (!userImage) newErrors.image = "Une image de profil est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("enfants", JSON.stringify(formData.enfants.map((e) => e.id)));
    if (userImage) formDataToSend.append("user_image", userImage);

    try {
      await dispatch(registerParent(formDataToSend)).unwrap();
      toast.success("Veuillez vérifier votre email pour activer votre compte parent.");
      navigate("/email-sent");
    } catch (error) {
      setErrors({ submit: error || "Erreur lors de l'inscription. Veuillez réessayer." });
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
            <img className="object-cover w-full h-full" src="/login.jfif" alt="Mobile login" />
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="w-full p-5 sm:p-6">
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Inscription Parent</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Créez votre compte parent LMS</p>
              </div>
              <Form>
                <form onSubmit={handleSubmit}>
                  {/* Avatar */}
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
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                  {errors.image && <p className="text-red-500 text-sm text-center">{errors.image}</p>}

                  {/* Username */}
                  <div className="mb-4">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Nom d'utilisateur <span className="text-red-500">*</span>
                    </Label>
                    <Input id="username" name="username" type="text" value={formData.username} onChange={handleInputChange} placeholder="Entrez votre nom d'utilisateur" />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Entrez votre email" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  {/* Enfants - Select Dropdown */}
                  <div className="mb-4 dropdown-container">
                    <Label htmlFor="enfants" className="text-sm font-medium text-gray-700">
                      Enfants <span className="text-red-500">*</span>
                    </Label>
                    
                    {/* Custom Select Dropdown */}
                    <div className="relative">
                      <div
                        className="w-full p-3 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center bg-white hover:border-gray-400 transition-colors"
                        onClick={toggleDropdown}
                      >
                        <span className="text-gray-500">
                          {status === 'loading' ? "Chargement des étudiants..." : "Sélectionnez un ou plusieurs étudiants"}
                        </span>
                        {status === 'loading' ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        ) : (
                          isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                      
                      {isDropdownOpen && status !== 'loading' && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {availableStudents.length > 0 ? (
                            availableStudents.map((student) => (
                              <div
                                key={student._id}
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleAddEnfant(student)}
                              >
                                <div className="font-medium">{student.username}</div>
                                {student.email && (
                                  <div className="text-sm text-gray-500">{student.email}</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-gray-500 text-center">
                              {studentUsers.length === 0 ? "Aucun étudiant trouvé" : "Tous les étudiants sont déjà sélectionnés"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected Students Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.enfants.map((enfant) => (
                        <div key={enfant.id} className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full flex items-center gap-2 text-sm">
                          {enfant.name}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveEnfant(enfant.id)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-lg w-5 h-5 flex items-center justify-center rounded-full hover:bg-indigo-200 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {errors.enfants && <p className="text-red-500 text-sm mt-1">{errors.enfants}</p>}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Mot de passe <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="Entrez votre mot de passe" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirmer le mot de passe <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirmez votre mot de passe" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    {errors.passwordMatch && <p className="text-red-500 text-sm">{errors.passwordMatch}</p>}
                  </div>

                  {/* Submit */}
                  {errors.submit && <p className="text-red-500 text-sm text-center mb-4">{errors.submit}</p>}
                  <Button type="submit" disabled={isLoading || status === 'loading'} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                  </Button>
                </form>
              </Form>
            </div>
            <div className="hidden lg:block w-1/2">
              <img className="object-cover w-full h-full" src="/login.jfif" alt="Desktop login" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParentRegister;