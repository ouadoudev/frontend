// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { registerTeacher } from "@/store/userSlice";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   SelectGroup,
//   SelectLabel,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import Loader from "@/assets/Loader";

// const validSubjects = [
//   "Mathématiques",
//   "Physique et Chimie",
//   "Sciences de la vie et de la terre",
//   "Philosophie",
//   "Informatique",
//   "Histoire et géographie",
//   "Langue française",
//   "Langue arabe",
//   "Langue anglaise",
//   "Langue espagnole",
//   "Éducation islamique",
//   "Économie et comptabilité",
//   "Primaire"
// ];

// const RegisterTeacherComponent = () => {
//   const dispatch = useDispatch();
//   const { status: userStatus } = useSelector((state) => state.user);

//   const [discipline, setDiscipline] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [cv, setCv] = useState(null);
//   const [userImage, setUserImage] = useState(null);
//   const [experience, setExperience] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === "file") {
//       if (name === "cv") {
//         setCv(files[0]);
//       } else if (name === "user_image") {
//         setUserImage(files[0]);
//       }
//     } else {
//       if (name === "username") {
//         setUsername(value);
//       } else if (name === "email") {
//         setEmail(value);
//       } else if (name === "password") {
//         setPassword(value);
//       } else if (name === "experience") {
//         setExperience(value);
//       } else if (name === "discipline") {
//         setDiscipline(value);
//       }
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();
//     data.append("username", username);
//     data.append("email", email);
//     data.append("password", password);
//     data.append("discipline", discipline);
//     data.append("experience", experience);
//     if (cv) {
//       data.append("cv", cv);
//     }
//     if (userImage) {
//       data.append("user_image", userImage);
//     }

//     setTimeout(() => {
//       dispatch(registerTeacher(data))
//         .then(() => {
//           setLoading(false);
//           toast.success("Application submitted successfully!");
//         })
//         .catch((error) => {
//           setLoading(false);
//           toast.error(error.message || "Something went wrong!");
//         });
//     }, 5000); 
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <main className="flex-1 lg:flex lg:items-center">
//         <section className="w-full py-2">
//           <div className="container max-w-xl px-4 md:px-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Become a Teacher</CardTitle>
//                 <CardDescription>
//                   Fill out the form below to apply to teach at our school.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form className="grid gap-6" onSubmit={handleSubmit}>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="user_image">Upload Profile Picture</Label>
//                       <Input
//                         id="user_image"
//                         name="user_image"
//                         type="file"
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="username">Name</Label>
//                       <Input
//                         id="username"
//                         name="username"
//                         placeholder="Enter your name"
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div className="grid gap-2">
//                       <Label htmlFor="email">Email</Label>
//                       <Input
//                         id="email"
//                         name="email"
//                         type="email"
//                         placeholder="Enter your email"
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="password">Password</Label>
//                       <Input
//                         id="password"
//                         name="password"
//                         type="password"
//                         placeholder="Enter your password"
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div className="grid gap-2">
//                       <Label htmlFor="experience">Years of Experience</Label>
//                       <Select
//                         value={experience}
//                         onValueChange={setExperience}
//                         className="w-[180px]"
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select experience" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="0-2">0-2 years</SelectItem>
//                           <SelectItem value="3-5">3-5 years</SelectItem>
//                           <SelectItem value="6-10">6-10 years</SelectItem>
//                           <SelectItem value="10+">10+ years</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="discipline">discipline</Label>
//                       <Select
//                         value={discipline}
//                         onValueChange={setDiscipline}
//                         className="w-[180px]"
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a discipline" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectGroup>
//                             <SelectLabel>Subjects</SelectLabel>
//                             {validSubjects.map((discipline) => (
//                               <SelectItem
//                                 key={discipline}
//                                 value={discipline}
//                               >
//                                 {discipline}
//                               </SelectItem>
//                             ))}
//                           </SelectGroup>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="cv">Upload Resume</Label>
//                     <Input
//                       id="cv"
//                       name="cv"
//                       type="file"
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <CardFooter>
//                     <Button
//                       type="submit"
//                       className="w-full"
//                       disabled={loading || userStatus === "loading"}
//                     >
//                       {loading ? <Loader /> : "Submit Application"}
//                     </Button>
//                   </CardFooter>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>
//         </section>
//         <section className="w-full lg:w-1/3">
//           <img
//             src="/placeholder.svg"
//             alt="Animation"
//             className="w-full h-full object-cover"
//           />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default RegisterTeacherComponent;

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { registerTeacher } from "@/store/userSlice";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from 'lucide-react';

const validSubjects = [
  "Mathématiques",
  "Physique et Chimie",
  "Sciences de la vie et de la terre",
  "الفلسفة",
  "Informatique",
  "التاريخ والجغرافيا",
  "Langue française",
  "اللغة العربية",
  "English",
  "Español",
  "التربية الإسلامية",
  "Économie et comptabilité",
  "Primaire"
];

const RegisterTeacher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [experience, setExperience] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [cv, setCv] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("/astronauts_404.jfif");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleCvDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setCvFile(file);
    setCv(file);
  }, []);

  const handleCvChange = useCallback((e) => {
    const file = e.target.files[0];
    setCvFile(file);
    setCv(file);
  }, []);

  const removeCv = useCallback(() => {
    setCvFile(null);
    setCv(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("discipline", discipline);
      formData.append("experience", experience);
      formData.append("user_image", userImage);
      formData.append("cv", cvFile);

      await dispatch(registerTeacher(formData));

      toast.success("Teacher registration successful!");
      navigate("/email-sent");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while registering."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <div className="min-h-screen z-30 flex items-center justify-center py-1 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl bg-transparent dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-3 sm:p-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Register as a Teacher
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Join Us in Shaping the Future of Education
                </p>
              </div>
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
                            src={imageUrl || "/placeholder-image-url"}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg transition-transform group-hover:scale-105"
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
                    </div>
                    <div className="flex-grow">
                      <Label htmlFor="username" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </Label>
                      <Input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </Label>
                    <Select
                      value={discipline}
                      onValueChange={setDiscipline}
                    >
                      <SelectTrigger className="mt-1 w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select a subject"/>
                      </SelectTrigger>
                      <SelectContent>
                        {validSubjects.map((discipline) => (
                          <SelectItem key={discipline} value={discipline}>
                            {discipline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Years of Experience
                    </Label>
                    <Select
                        value={experience}
                        onValueChange={setExperience}
                        className="w-[180px]"
                      >
                        <SelectTrigger className="mt-1 w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  <div>
                    <Label htmlFor="cv" className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Upload CV
                    </Label>
                    <div
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                        cvFile ? 'border-green-500' : 'border-gray-300'
                      } transition-colors duration-200 ease-in-out`}
                      onDrop={handleCvDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div className="space-y-1 text-center">
                        {cvFile ? (
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm text-gray-500">{cvFile.name}</span>
                            <button
                              type="button"
                              onClick={removeCv}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="cv"
                                className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input id="cv" name="cv" type="file" className="sr-only" onChange={handleCvChange} accept=".pdf,.doc,.docx" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-2.5 rounded-md transition duration-150 ease-in-out mt-4"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register as Teacher"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            <div className="hidden lg:block w-1/2">
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

export default RegisterTeacher;

