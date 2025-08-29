// import { useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import Slider from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { fetchUsers } from "@/store/userSlice"

// const Teachers = () => {
//   const dispatch = useDispatch()
//   const { users, status, error } = useSelector((state) => state.user)

//   // Filter teachers
//   const teacherUsers = users.filter((user) => user.role === "teacher")

//   useEffect(() => {
//     if (status === "idle") dispatch(fetchUsers())
//   }, [dispatch, status])

//   // Slider settings
//   const sliderSettings = {
//     dots: true,
//     infinite: teacherUsers.length > 1,
//     speed: 500,
//     slidesToShow: Math.min(4, teacherUsers.length),
//     slidesToScroll: 1,
//     responsive: [
//       { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 1 } },
//       { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
//       { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
//     ],
//   }

//   // Loading skeleton
//   if (status === "loading") {
//     return (
//       <section className="container  px-4 sm:px-6 lg:px-4 pt-16 bg-gray-50">
//         <div className="container px-4 mx-auto">
//           <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Our Teachers</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, index) => (
//               <Card key={index} className="overflow-hidden">
//                 <CardContent className="p-6">
//                   <div className="flex flex-col items-center">
//                     <Skeleton className="h-24 w-24 rounded-full mb-4" />
//                     <Skeleton className="h-4 w-3/4 mb-2" />
//                     <Skeleton className="h-3 w-1/2" />
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>
//     )
//   }

//   // Error handling
//   if (status === "failed") {
//     return (
//       <section className="container  px-4 sm:px-6 lg:px-4 pt-16 bg-gray-50">
//         <div className="container px-4 mx-auto text-center">
//           <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Teachers</h2>
//           <p className="text-lg text-red-500">Error: {error}</p>
//         </div>
//       </section>
//     )
//   }

//   // Render teachers
//   return (
//     <section className="container  px-4 sm:px-6 lg:px-4 pt-16 bg-gradient-to-br from-blue-50 to-purple-50">
//       <div className="container px-4 mx-auto">
//         <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center text-gray-900 mb-3">Découvrez Nos Enseignants</h2>
//         <p className="text-lg text-gray-600 text-center mb-8">Nos enseignants sont des experts dans leurs domaines, prêts à partager leurs connaissances avec vous.</p>
//         {teacherUsers.length > 0 ? (
//           <Slider {...sliderSettings} className="py-4 px-2">
//             {teacherUsers.map((user) => (
//               <div key={user.id} className="px-3">
//                 <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
//                   <CardContent className="p-6">
//                     <div className="flex flex-col items-center">
//                       <Avatar className="h-32 w-32 mb-6 ring-4 ring-primary/10">
//                         <AvatarImage
//                           src={user.user_image?.url || "/placeholder.svg?height=128&width=128"}
//                           alt={`${user.username}'s profile`}
//                         />
//                         <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
//                           {user.username.slice(0, 2).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                         {user.username}
//                       </h3>
//                       <Badge variant="secondary" className="mb-4">
//                         {user.discipline}
//                       </Badge>
//                       <p className="text-sm text-gray-500 text-center">
//                         {user.bio}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             ))}
//           </Slider>
//         ) : (
//           <p className="text-center text-lg text-gray-500">No teachers found.</p>
//         )}
//       </div>
//     </section>
//   )
// }

// export default Teachers


import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";
import Slider from "react-slick";
import { fetchUsers } from "@/store/userSlice";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { Star, Users, BookOpen, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherCard = ({ teacher, index }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: true });
        const getDirection = (text) => {
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlChars.test(text) ? "rtl" : "ltr";
};


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="px-3 py-4"
    >
      <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              className="relative mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="h-32 w-32 ring-4 ring-gradient-to-r from-blue-400 to-purple-500 ring-offset-4">
                <AvatarImage
                  src={teacher.user_image?.url || "/placeholder.svg"}
                  alt={`${teacher.username}'s profile`}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {teacher.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {teacher.username}
            </h3>

            <Badge
              variant="secondary"
              className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0"
            >
              {teacher.discipline}
            </Badge>

            <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed"
            dir={getDirection(teacher.bio)}>
              {teacher.bio}
            </p>

            <div className="grid grid-cols-3 gap-4 w-full mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-bold text-gray-900">
                    {teacher.rating || "—"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Note</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="font-bold text-gray-900">
                    {teacher.students?.length || "—"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Étudiants</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <BookOpen className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="font-bold text-gray-900">
                    {teacher.courses?.length || "—"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Cours</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg"
              size="sm"
              onClick={() => navigate(`/teacher/${teacher._id}`)}
            >
              Voir le profil
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Teachers = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user);
  const teacherUsers = users.filter((user) => user.role === "teacher");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [dispatch, status]);

  const sliderSettings = {
    dots: false,
    infinite: teacherUsers.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, teacherUsers.length),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (status === "loading") {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-128 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-32 w-32 rounded-full mb-6" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-16 w-full mb-6" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="container px-4 py-20 bg-red-50 text-center">
        <h2 className="text-3xl font-bold text-red-700">
          Erreur de chargement
        </h2>
        <p className="text-red-500 mt-2">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden">
      <div className="container mx-auto px-4">
                  <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrez Nos{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enseignants Experts
            </span>
          </h2>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center text-gray-900 mb-3"></h2>
          <p className="text-lg text-gray-600 text-center mb-8"> Nos enseignants sont des experts dans leurs domaines, prêts à
            partager leurs connaissances et à vous accompagner vers la réussite.</p>
        </motion.div>

        {teacherUsers.length > 0 ? (
          teacherUsers.length > 1 ? (
            <Slider {...sliderSettings} className="py-8 ">
              {teacherUsers.map((teacher, index) => (
                <TeacherCard
                  key={teacher._id || index}
                  teacher={teacher}
                  index={index}
                />
              ))}
            </Slider>
          ) : (
            <div className="flex justify-center py-4">
              <div className="w-full max-w-md">
                <TeacherCard teacher={teacherUsers[0]} index={0} />
              </div>
            </div>
          )
        ) : (
          <p className="text-center text-lg text-gray-500">
            Aucun enseignant trouvé.
          </p>
        )}
      </div>
    </section>
  );
};

export default Teachers;
