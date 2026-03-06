// import { useDispatch, useSelector } from "react-redux";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { sendEmail, updateField } from "@/store/contactSlice";
// import { motion } from "framer-motion";
// import { Mail } from 'lucide-react';

// const Contact = () => {
//   const dispatch = useDispatch();

//   const { firstName, lastName, email, message, status, error } = useSelector(
//     (state) => state.contact
//   );

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     dispatch(updateField({ field: id, value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(sendEmail({ firstName, lastName, email, message }));
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const childVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//     },
//   };

//   const circleVariants = {
//     hidden: { scale: 0, opacity: 0 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         ease: "easeInOut"
//       }
//     }
//   };

//   return (
//     <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
//       <motion.div
//         className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full -ml-32 -mt-32 opacity-50"
//         variants={circleVariants}
//         initial="hidden"
//         animate="visible"
//       />
//       <motion.div
//         className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full -mr-48 -mb-48 opacity-50"
//         variants={circleVariants}
//         initial="hidden"
//         animate="visible"
//       />
//       <div className="container px-4 md:px-6 relative z-10">
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//             className="flex flex-col lg:flex-row items-center gap-12"
//           >
//             <motion.div variants={childVariants} className="lg:w-1/2">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 mb-4">
//                 Get in Touch
//               </h2>
//               <p className="text-lg text-gray-600 mb-8">
//                 Have questions about our LMS? We re here to help you enhance your learning experience!
//               </p>
//               <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
//                 <form className="space-y-6" onSubmit={handleSubmit}>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <motion.div variants={childVariants}>
//                       <Label htmlFor="firstName" className="text-gray-700">
//                         First Name
//                       </Label>
//                       <Input
//                         id="firstName"
//                         type="text"
//                         value={firstName}
//                         onChange={handleChange}
//                         required
//                         className="mt-1 w-full transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-400"
//                       />
//                     </motion.div>
//                     <motion.div variants={childVariants}>
//                       <Label htmlFor="lastName" className="text-gray-700">
//                         Last Name
//                       </Label>
//                       <Input
//                         id="lastName"
//                         type="text"
//                         value={lastName}
//                         onChange={handleChange}
//                         required
//                         className="mt-1 w-full transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-400"
//                       />
//                     </motion.div>
//                   </div>
//                   <motion.div variants={childVariants}>
//                     <Label htmlFor="email" className="text-gray-700">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={email}
//                       onChange={handleChange}
//                       required
//                       className="mt-1 w-full transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-400"
//                     />
//                   </motion.div>
//                   <motion.div variants={childVariants}>
//                     <Label htmlFor="message" className="text-gray-700">
//                       Message
//                     </Label>
//                     <Textarea
//                       id="message"
//                       value={message}
//                       onChange={handleChange}
//                       required
//                       className="mt-1 w-full h-32 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-400"
//                     />
//                   </motion.div>
//                   <motion.div variants={childVariants}>
//                     <Button
//                       type="submit"
//                       className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
//                     >
//                       <Mail className="mr-2 h-4 w-4" /> Send Message
//                     </Button>
//                   </motion.div>
//                 </form>
//               </div>
//               {status === "loading" && (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-center text-blue-600 mt-4"
//                 >
//                   Sending...
//                 </motion.p>
//               )}
//               {status === "succeeded" && (
//                 <motion.p
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="text-center text-green-600 mt-4"
//                 >
//                   Message sent successfully!
//                 </motion.p>
//               )}
//               {status === "failed" && (
//                 <motion.p
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="text-center text-red-600 mt-4"
//                 >
//                   Error: {error}
//                 </motion.p>
//               )}
//             </motion.div>
//             <motion.div
//               variants={childVariants}
//               className="lg:w-1/2 relative"
//             >
//               <img
//                 src="/placeholder.svg?height=600&width=600"
//                 alt="Online Learning Illustration"
//                 width={600}
//                 height={600}
//                 className="rounded-lg shadow-xl"
//               />
//               <motion.div
//                 className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-200 rounded-full opacity-50"
//                 variants={circleVariants}
//                 initial="hidden"
//                 animate="visible"
//               />
//               <motion.div
//                 className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-200 rounded-full opacity-50"
//                 variants={circleVariants}
//                 initial="hidden"
//                 animate="visible"
//               />
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sendEmail, updateField } from "@/store/contactSlice";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Users,
  Headphones,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "rgb(59,130,246)", stopOpacity: 0.2 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "rgb(147,51,234)", stopOpacity: 0.2 }}
          />
        </linearGradient>
      </defs>
      <motion.circle
        cx="10%"
        cy="5%"
        r="20%"
        fill="url(#grad1)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.circle
        cx="80%"
        cy="80%"
        r="30%"
        fill="url(#grad1)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </svg>
  </div>
);

const ContactInfo = ({ icon: Icon, title, content, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
};

const Contact = () => {
  const dispatch = useDispatch();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { firstName, lastName, email, message, status, error } = useSelector(
    (state) => state.contact
  );

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    dispatch(updateField({ field: id, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendEmail({ firstName, lastName, email, message }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section id="contact" className="relative py-16 md:py-24 lg:py-24 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <div className="container px-4 md:px-6 relative z-40">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contactez{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notre Équipe
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nous sommes là pour vous aider à améliorer votre expérience
              d'apprentissage !
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="space-y-4">
                <ContactInfo
                  icon={Mail}
                  title="Email"
                  content="support@Tamadrus.ma"
                  delay={0.1}
                />
                <ContactInfo
                  icon={Phone}
                  title="Téléphone"
                  content="+212 5 22 XX XX XX"
                  delay={0.2}
                />
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-3 gap-4 pt-8"
              >
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <Headphones className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {"<2h"}
                  </div>
                  <div className="text-sm text-gray-600">Réponse</div>
                </div>
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4">
                      Formulaire de contact
                    </Badge>
                  </div>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Label
                          htmlFor="firstName"
                          className="text-gray-700 font-medium"
                        >
                          Prénom *
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={handleChange}
                          required
                          className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          placeholder="Votre prénom"
                        />
                      </motion.div>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Label
                          htmlFor="lastName"
                          className="text-gray-700 font-medium"
                        >
                          Nom *
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={handleChange}
                          required
                          className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          placeholder="Votre nom"
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-medium"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleChange}
                        required
                        className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        placeholder="votre.email@exemple.com"
                      />
                    </motion.div>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Label
                        htmlFor="message"
                        className="text-gray-700 font-medium"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 resize-none"
                        placeholder="Décrivez votre demande en détail..."
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 py-3 text-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        {status === "loading" ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Envoi en cours...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="mr-2 h-5 w-5" />
                            Envoyer le message
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                  {status === "succeeded" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <p className="text-green-800">
                        Message envoyé avec succès ! Nous vous répondrons
                        bientôt.
                      </p>
                    </motion.div>
                  )}
                  {status === "failed" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                    >
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                      <p className="text-red-800">{error}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
