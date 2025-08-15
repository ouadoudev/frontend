// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Form } from "@/components/ui/form";
// import { registerUser } from "@/store/authSlice";
// import { FaGoogle } from "react-icons/fa";
// import AnimatedBackground from "@/components/AnimatedBackground";

// const Register = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [educationalCycle, setEducationalCycle] = useState("Primaire");
//   const [educationalLevel, setEducationalLevel] = useState("");
//   const [stream, setStream] = useState("");
//   const [userImage, setUserImage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imageUrl, setImageUrl] = useState("/astronauts_404.jfif");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setUserImage(file);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImageUrl(reader.result.toString());
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append("username", username);
//       formData.append("email", email);
//       formData.append("password", password);
//       formData.append("educationalCycle", educationalCycle);
//       formData.append("educationalLevel", educationalLevel);
//       formData.append("stream", stream);
//       formData.append("user_image", userImage);

//       await dispatch(registerUser(formData));

//       toast.success("Registration successful!");
//       navigate("/email-sent");
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error(
//         error.response?.data?.message || "An error occurred while registering."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = "https://tamadrus-api.onrender.com/auth/google";
//   };

//   const role = useSelector((state) => state.auth.user);

//   if (role) {
//     if (role.role === "admin" || role.role === "teacher") {
//       return <Navigate to="/dashboard" />;
//     } else if (role.role === "student") {
//       return <Navigate to="/profile" />;
//     }
//   }

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
//       <AnimatedBackground />
//     <div className="min-h-screen z-30 flex items-center justify-center py-1 px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-3xl  bg-transparent dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
//         <div className="flex flex-col lg:flex-row">
//           <div className="w-full lg:w-1/2 p-3 sm:p-4">
//             <div className="text-center mb-4">
//               <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
//                 Register to get started
//               </h2>
//               <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                 Join Us in Shaping the Future of Learning
//               </p>
//             </div>
//             <Form >
//               <form onSubmit={handleSubmit}>
//                 <div  className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
//                   <div className="flex-shrink-0">
//                     <label
//                       htmlFor="user_image"
//                       className="cursor-pointer group"
//                     >
//                       <div className="relative">
//                         <img
//                           src={imageUrl || "/placeholder-image-url"}
//                           alt="Avatar"
//                           className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg transition-transform group-hover:scale-105"
//                         />
//                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
//                         <span className="text-white text-sm">Change</span>
//                       </div>
//                     </div>
//                     </label>
//                     <input
//                       type="file"
//                       id="user_image"
//                       name="user_image"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                     />
//                   </div>
//                   <div className="flex-grow">
//                   <Label htmlFor="username" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Username
//                   </Label>
//                   <Input
//                     type="text"
//                     id="username"
//                     name="username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                     className="mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//                 </div>
//                 <div>
//                 <Label htmlFor="email" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Email
//                 </Label>
//                 <Input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="password" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Password
//                 </Label>
//                 <Input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="educationalCycle" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Educational Cycle
//                 </Label>
//                 <select
//                   id="educationalCycle"
//                   name="educationalCycle"
//                   value={educationalCycle}
//                   onChange={(e) => setEducationalCycle(e.target.value)}
//                   className="mt-1 block w-full h-6 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 >
//                   <option value="Primaire">Primaire</option>
//                   <option value="Collège">Collège</option>
//                   <option value="Lycée">Lycée</option>
//                 </select>
//               </div>
//               {educationalCycle && (
//                 <div>
//                   <Label htmlFor="educationalLevel" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Educational Level
//                   </Label>
//                   <select
//                     id="educationalLevel"
//                     name="educationalLevel"
//                     value={educationalLevel}
//                     onChange={(e) => setEducationalLevel(e.target.value)}
//                     className="mt-1 mb-2 block w-full h-6 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   >
//                     <option value="">Select an educational level</option>
//                     {educationalCycle === "Primaire" && (
//                       <>
//                         <option value="1ère année Primaire">1ère année Primaire</option>
//                         <option value="2ème année Primaire">2ème année Primaire</option>
//                         <option value="3ème année Primaire">3ème année Primaire</option>
//                         <option value="4ème année Primaire">4ème année Primaire</option>
//                         <option value="5ème année Primaire">5ème année Primaire</option>
//                         <option value="6ème année Primaire">6ème année Primaire</option>
//                       </>
//                     )}
//                     {educationalCycle === "Collège" && (
//                       <>
//                         <option value="1ère année collège">1ère année collège</option>
//                         <option value="2ème année collège">2ème année collège</option>
//                         <option value="3ème année collège">3ème année collège</option>
//                       </>
//                     )}
//                     {educationalCycle === "Lycée" && (
//                       <>
//                         <option value="Tronc Commun">Tronc Commun</option>
//                         <option value="1ère année du Baccalauréat">1ère année du Baccalauréat</option>
//                         <option value="2ème année du Baccalauréat">2ème année du Baccalauréat</option>
//                       </>
//                     )}
//                   </select>
//                 </div>
//               )}
//               {educationalCycle === "Lycée" && educationalLevel && (
//                 <div>
//                   <Label htmlFor="stream" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Stream
//                   </Label>
//                   <select
//                     id="stream"
//                     name="stream"
//                     value={stream}
//                     onChange={(e) => setStream(e.target.value)}
//                     className="mt-1 mb-2 block w-full h-6 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   >
//                     <option value="">Select a stream</option>
//                     {educationalLevel === "Tronc Commun" && (
//                       <>
//                         <option value="Sciences">Sciences</option>
//                         <option value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</option>
//                         <option value="Technologies">Technologies</option>
//                       </>
//                     )}
//                     {educationalLevel === "1ère année du Baccalauréat" && (
//                       <>
//                         <option value="Sciences Mathématiques">Sciences Mathématiques</option>
//                         <option value="Sciences Expérimentales">Sciences Expérimentales</option>
//                         <option value="Sciences et Technologies Électriques">Sciences et Technologies Électriques</option>
//                         <option value="Sciences et Technologies Mécaniques">Sciences et Technologies Mécaniques</option>
//                         <option value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</option>
//                         <option value="Sciences Économiques et Gestion">Sciences Économiques et Gestion</option>
//                       </>
//                     )}
//                     {educationalLevel === "2ème année du Baccalauréat" && (
//                       <>
//                         <option value="Sciences Mathématiques A">Sciences Mathématiques A</option>
//                         <option value="Sciences Mathématiques B">Sciences Mathématiques B</option>
//                         <option value="Sciences Physiques">Sciences Physiques</option>
//                         <option value="Sciences de la Vie et de la Terre">Sciences de la Vie et de la Terre</option>
//                         <option value="Sciences Agronomiques">Sciences Agronomiques</option>
//                         <option value="Sciences et Technologies Électriques">Sciences et Technologies Électriques</option>
//                         <option value="Sciences et Technologies Mécaniques">Sciences et Technologies Mécaniques</option>
//                         <option value="Lettres">Lettres</option>
//                         <option value="Sciences Humaines">Sciences Humaines</option>
//                         <option value="Sciences Économiques">Sciences Économiques</option>
//                         <option value="Techniques de Gestion et Comptabilité">Techniques de Gestion et Comptabilité</option>
//                       </>
//                     )}
//                   </select>
//                 </div>
//               )}
//               <div>
//                 <Button
//                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-2.5 rounded-md transition duration-150 ease-in-out"
//                   type="submit"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Registering..." : "Register"}
//                 </Button>
//               </div>
//               </form>
//             </Form>
//             <div className="mt-4 relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or</span>
//               </div>
//             </div>
//             <Button
//               className="mt-3 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1.5 px-2.5 border border-gray-400 rounded-md shadow flex items-center justify-center transition duration-150 ease-in-out"
//               type="button"
//               onClick={handleGoogleLogin}
//             >
//               <FaGoogle className="mr-2" />
//               Sign up with Google
//             </Button>
//             <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
//               >
//                 Log in
//               </Link>
//             </p>
//           </div>
//           <div className="hidden lg:block w-1/2">
//             <img
//               className="object-cover w-full h-full"
//               src="/login.jfif"
//               alt="Office"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//     </section>
//   );
// };

// export default Register;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { registerUser } from "@/store/authSlice";
import { FaGoogle } from "react-icons/fa";
import AnimatedBackground from "@/components/AnimatedBackground";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [educationalCycle, setEducationalCycle] = useState("Primaire");
  const [educationalLevel, setEducationalLevel] = useState("");
  const [stream, setStream] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("/astronauts_404.jfif");
  
  // Error state
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    educationalCycle: "",
    educationalLevel: "",
    stream: "",
    user_image: "",
    general: ""
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserImage(file);
    setErrors(prev => ({ ...prev, user_image: "" }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result.toString());
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Reset errors
    setErrors({
      username: "",
      email: "",
      password: "",
      educationalCycle: "",
      educationalLevel: "",
      stream: "",
      user_image: "",
      general: ""
    });
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("educationalCycle", educationalCycle);
      formData.append("educationalLevel", educationalLevel);
      formData.append("stream", stream);
      if (userImage) {
        formData.append("user_image", userImage);
      }

      await dispatch(registerUser(formData)).unwrap();

      navigate("/email-sent");
    } catch (error) {
      // Map error to specific field
      const errorMessage = typeof error === 'string' ? error : "Registration failed";
      
      if (errorMessage.toLowerCase().includes('username')) {
        setErrors(prev => ({ ...prev, username: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors(prev => ({ ...prev, password: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('educational cycle')) {
        setErrors(prev => ({ ...prev, educationalCycle: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('educational level')) {
        setErrors(prev => ({ ...prev, educationalLevel: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('stream')) {
        setErrors(prev => ({ ...prev, stream: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('image')) {
        setErrors(prev => ({ ...prev, user_image: errorMessage }));
      } else {
        setErrors(prev => ({ ...prev, general: errorMessage }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://tamadrus-api.onrender.com/auth/google";
  };

  const role = useSelector((state) => state.auth.user);

  if (role) {
    if (role.role === "admin" || role.role === "teacher") {
      return <Navigate to="/dashboard" />;
    } else if (role.role === "student") {
      return <Navigate to="/profile" />;
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <div className="min-h-screen z-30 flex items-center justify-center py-1 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl bg-transparent dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/5 p-3 sm:p-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Register to get started
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Join Us in Shaping the Future of Learning
                </p>
              </div>
              
              {/* General error message */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              <Form>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <label
                        htmlFor="user_image"
                        className="cursor-pointer group"
                      >
                        <div className="relative">
                          <img
                            src={imageUrl}
                            alt="Avatar"
                            className={`w-20 h-20 rounded-full object-cover border-4  ${
                          errors.user_image ? "border-red-500" : ""
                        } border-white dark:border-gray-700 shadow-lg transition-transform group-hover:scale-105`}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm">Change</span>
                          </div>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="user_image"
                        name="user_image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {errors.user_image && (
                        <p className="mt-1 text-red-500 text-sm">{errors.user_image}</p>
                      )}
                    </div>
                    <div className="flex-grow">
                      <Label htmlFor="username" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Username
                      </Label>
                      <Input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setErrors(prev => ({ ...prev, username: "" }));
                        }}
                        required
                        className={`mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.username ? "border-red-500" : ""
                        }`}
                      />
                      {errors.username && (
                        <p className="mt-1 text-red-500 text-sm">{errors.username}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      required
                      className={`mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors(prev => ({ ...prev, password: "" }));
                      }}
                      required
                      className={`mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <Label htmlFor="educationalCycle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Educational Cycle
                    </Label>
                    <select
                      id="educationalCycle"
                      name="educationalCycle"
                      value={educationalCycle}
                      onChange={(e) => {
                        setEducationalCycle(e.target.value);
                        setErrors(prev => ({ ...prev, educationalCycle: "" }));
                        // Reset dependent fields
                        setEducationalLevel("");
                        setStream("");
                      }}
                      className={`mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.educationalCycle ? "border-red-500" : ""
                      }`}
                    >
                      <option value="Primaire">Primaire</option>
                      <option value="Collège">Collège</option>
                      <option value="Lycée">Lycée</option>
                    </select>
                    {errors.educationalCycle && (
                      <p className="mt-1 text-red-500 text-sm">{errors.educationalCycle}</p>
                    )}
                  </div>
                  
                  {educationalCycle && (
                    <div className="mt-3">
                      <Label htmlFor="educationalLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Educational Level
                      </Label>
                      <select
                        id="educationalLevel"
                        name="educationalLevel"
                        value={educationalLevel}
                        onChange={(e) => {
                          setEducationalLevel(e.target.value);
                          setErrors(prev => ({ ...prev, educationalLevel: "" }));
                          // Reset stream when level changes
                          if (educationalCycle === "Lycée") setStream("");
                        }}
                        className={`mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.educationalLevel ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select an educational level</option>
                        {educationalCycle === "Primaire" && (
                          <>
                            <option value="1ère année Primaire">1ère année Primaire</option>
                            <option value="2ème année Primaire">2ème année Primaire</option>
                            <option value="3ème année Primaire">3ème année Primaire</option>
                            <option value="4ème année Primaire">4ème année Primaire</option>
                            <option value="5ème année Primaire">5ème année Primaire</option>
                            <option value="6ème année Primaire">6ème année Primaire</option>
                          </>
                        )}
                        {educationalCycle === "Collège" && (
                          <>
                            <option value="1ère année collège">1ère année collège</option>
                            <option value="2ème année collège">2ème année collège</option>
                            <option value="3ème année collège">3ème année collège</option>
                          </>
                        )}
                        {educationalCycle === "Lycée" && (
                          <>
                            <option value="Tronc Commun">Tronc Commun</option>
                            <option value="1ère année du Baccalauréat">1ère année du Baccalauréat</option>
                            <option value="2ème année du Baccalauréat">2ème année du Baccalauréat</option>
                          </>
                        )}
                      </select>
                      {errors.educationalLevel && (
                        <p className="mt-1 text-red-500 text-sm">{errors.educationalLevel}</p>
                      )}
                    </div>
                  )}
                  
                  {educationalCycle === "Lycée" && educationalLevel && (
                    <div className="mt-3">
                      <Label htmlFor="stream" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Stream
                      </Label>
                      <select
                        id="stream"
                        name="stream"
                        value={stream}
                        onChange={(e) => {
                          setStream(e.target.value);
                          setErrors(prev => ({ ...prev, stream: "" }));
                        }}
                        className={`mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.stream ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select a stream</option>
                        {educationalLevel === "Tronc Commun" && (
                          <>
                            <option value="Sciences">Sciences</option>
                            <option value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</option>
                            <option value="Technologies">Technologies</option>
                          </>
                        )}
                        {educationalLevel === "1ère année du Baccalauréat" && (
                          <>
                            <option value="Sciences Mathématiques">Sciences Mathématiques</option>
                            <option value="Sciences Expérimentales">Sciences Expérimentales</option>
                            <option value="Sciences et Technologies Électriques">Sciences et Technologies Électriques</option>
                            <option value="Sciences et Technologies Mécaniques">Sciences et Technologies Mécaniques</option>
                            <option value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</option>
                            <option value="Sciences Économiques et Gestion">Sciences Économiques et Gestion</option>
                          </>
                        )}
                        {educationalLevel === "2ème année du Baccalauréat" && (
                          <>
                            <option value="Sciences Mathématiques A">Sciences Mathématiques A</option>
                            <option value="Sciences Mathématiques B">Sciences Mathématiques B</option>
                            <option value="Sciences Physiques">Sciences Physiques</option>
                            <option value="Sciences de la Vie et de la Terre">Sciences de la Vie et de la Terre</option>
                            <option value="Sciences Agronomiques">Sciences Agronomiques</option>
                            <option value="Sciences et Technologies Électriques">Sciences et Technologies Électriques</option>
                            <option value="Sciences et Technologies Mécaniques">Sciences et Technologies Mécaniques</option>
                            <option value="Lettres">Lettres</option>
                            <option value="Sciences Humaines">Sciences Humaines</option>
                            <option value="Sciences Économiques">Sciences Économiques</option>
                            <option value="Techniques de Gestion et Comptabilité">Techniques de Gestion et Comptabilité</option>
                          </>
                        )}
                      </select>
                      {errors.stream && (
                        <p className="mt-1 text-red-500 text-sm">{errors.stream}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                  </div>
                </form>
              </Form>
              
              <div className="mt-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    Or
                  </span>
                </div>
              </div>
              
              <Button
                className="mt-3 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-md shadow flex items-center justify-center transition duration-150 ease-in-out"
                type="button"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="mr-2" />
                Sign up with Google
              </Button>
              
              <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Log in
                </Link>
              </p>
            </div>
            
            <div className="hidden lg:block w-2/5">
              <img
                className="object-cover w-full h-full"
                src="/login.jfif"
                alt="Office"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;