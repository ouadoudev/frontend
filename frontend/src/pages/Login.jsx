// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { loginUser } from "@/store/authSlice";
// import { Form } from "@/components/ui/form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import AnimatedBackground from "@/components/AnimatedBackground";
// import { FaGoogle } from "react-icons/fa";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//     general: "",
//   });

//   useEffect(() => {
//     setErrors({ email: "", password: "", general: "" });
//   }, [email, password]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     setIsSubmitting(true);
//     setErrors({ email: "", password: "", general: "" });

//     try {
//       await dispatch(loginUser({ email, password })).unwrap();
//     } catch (error) {
//       if (error.includes("Invalid Email")) {
//         setErrors((prev) => ({ ...prev, email: error }));
//       } else if (error.includes("Invalid Password")) {
//         setErrors((prev) => ({ ...prev, password: error }));
//       } else {
//         setErrors((prev) => ({ ...prev, general: error }));
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleForgetPassword = () => {
//     navigate("/password-reset");
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = "https://tamadrus-api.onrender.com/auth/google";
//   };

//   const role = useSelector((state) => state.auth.user);

//   // Redirect logic based on user role
//   if (role) {
//     if (role.role === "admin") {
//       return <Navigate to="/dashboard" />;
//     } else if (role.role === "teacher") {
//       return <Navigate to="/teacher" />;
//     } else if (role.role === "student") {
//       return <Navigate to="/profile" />;
//     }
//   }

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
//       <AnimatedBackground />
//       <div className="min-h-screen z-30 flex items-center justify-center py-1 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-3xl  bg-transparent dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
//           <div className="flex flex-col lg:flex-row">
//             <div className="w-full lg:w-1/2 p-3 sm:p-4">
//               <div className="text-center mb-4">
//                 <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
//                   Welcome Back!
//                 </h2>
//                 <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                   Login to your account
//                 </p>
//               </div>
//               {errors.general && (
//                 <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
//                   {errors.general}
//                 </div>
//               )}
//               <Form>
//                 <form onSubmit={handleSubmit}>
//                   <div>
//                     <Label
//                       htmlFor="email"
//                       className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
//                     >
//                       Email
//                     </Label>
//                     <Input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       className={`mt-1 mb-1 block w-full h-8 rounded-xl ${
//                         errors.email ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="user@doamin.com"
//                     />
//                     {errors.email && (
//                       <p className="text-red-500 text-xs mb-2">
//                         {errors.email}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <Label
//                       htmlFor="password"
//                       className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
//                     >
//                       Password
//                     </Label>
//                     <Input
//                       type="password"
//                       id="password"
//                       name="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       className={`mt-1 mb-1 block w-full h-8 rounded-xl ${
//                         errors.password ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="********"
//                     />
//                     {errors.password && (
//                       <p className="text-red-500 text-xs mb-2">
//                         {errors.password}
//                       </p>
//                     )}
//                   </div>
//                   <div className="w-full my-3 flex justify-end">
//                     <Button
//                       type="button"
//                       className=" bg-transparent h-4 text-sm text-indigo-600 hover:text-white"
//                       onClick={handleForgetPassword}
//                     >
//                       Forgot Password?
//                     </Button>
//                   </div>
//                   <Button
//                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-2.5 rounded-md transition duration-150 ease-in-out"
//                     type="submit"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Please wait, logging in..." : "Login"}
//                   </Button>
//                 </form>
//               </Form>
//               <div className="mt-4 relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or</span>
//                 </div>
//               </div>
//               <Button
//                 className="mt-3 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1.5 px-2.5 border border-gray-400 rounded-md shadow flex items-center justify-center transition duration-150 ease-in-out"
//                 type="button"
//                 onClick={handleGoogleLogin}
//               >
//                 <FaGoogle className="mr-2" />
//                 Sign up with Google
//               </Button>
//               <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
//                 Not a Member{" "}
//                 <Link
//                   to="/register"
//                   className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
//                 >
//                   Create Account
//                 </Link>
//               </p>
//             </div>
//             <div className="hidden lg:block w-1/2">
//               <img
//                 className="object-cover w-full h-full"
//                 src="/login.jfif"
//                 alt="Office"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Login;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "@/store/authSlice";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });


  useEffect(() => {
    setErrors({ email: "", password: "", general: "" });
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (error) {
      if (error.includes("Invalid Email")) {
        setErrors(prev => ({ ...prev, email: error }));
      } else if (error.includes("Invalid Password")) {
        setErrors(prev => ({ ...prev, password: error }));
      } else {
        setErrors(prev => ({ ...prev, general: error }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const role = useSelector((state) => state.auth.user);

  // Redirect logic based on user role
  if (role) {
    if (role.role === "admin") {
      return <Navigate to="/dashboard" />;
    } else if (role.role === "teacher") {
      return <Navigate to="/teacher" />;
    } else if (role.role === "student") {
      return <Navigate to="/profile" />;
    }
  }
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <div className="min-h-screen z-30 flex items-center justify-center w-full px-4 py-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          {/* Mobile-only image */}
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Welcome Back!
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Login to your account
                </p>
              </div>

              {/* Error Messages */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              <Form>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Label 
                      htmlFor="email"
                      className="block mb-1 text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full p-3 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      placeholder="user@domain.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <Label 
                      htmlFor="password"
                      className="block mb-1 text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full p-3 rounded-lg border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      placeholder="********"
                    />
                    {errors.password && (
                      <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end mb-5">
                    <button
                      type="button"
                      className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      onClick={() => navigate("/password-reset")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition duration-200"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
              
              <div className="my-5 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg border border-gray-300 flex items-center justify-center transition duration-200"
                type="button"
                onClick={() => window.location.href = "https://tamadrus-api.onrender.com/auth/google"}
              >
                <FaGoogle className="mr-3 text-red-500" />
                Sign in with Google
              </Button>
              
              <p className="mt-5 text-center text-gray-600 dark:text-gray-400">
                Not a Member?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Create Account
                </Link>
              </p>
            </div>
            
            {/* Desktop-only image */}
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
};

export default Login;