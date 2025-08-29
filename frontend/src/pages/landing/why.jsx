/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  BookOpen,
  MapPin,
  Smartphone,
  UserCheck,
  Globe,
  PlayCircle,
  UserCog,
  Clock,
  Shield,
} from "lucide-react";

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
        cx="90%"
        cy="20%"
        r="15%"
        fill="url(#grad1)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.circle
        cx="10%"
        cy="100%"
        r="20%"
        fill="url(#grad1)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </svg>
  </div>
);

export default function Why() {
  const [selectedReason, setSelectedReason] = useState(null);

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const reasons = [
    {
      id: 1,
      title: "Adapté au Système Éducatif Marocain",
      content:
        "Tamadrus est conçu spécifiquement pour répondre aux besoins des élèves et enseignants du Maroc, du primaire au baccalauréat. Il est aligné avec le programme national et offre une expérience d'apprentissage interactive et enrichissante, parfaitement adaptée à la pédagogie marocaine.",
      icon: MapPin,
    },
    {
      id: 2,
      title: "Accessibilité à Tous",
      content:
        "Que ce soit pour les élèves en milieu urbain ou rural, notre plateforme est accessible sur tous les types de dispositifs (PC, tablettes, smartphones). Les contenus sont optimisés pour un accès facile et fluide, quel que soit l'endroit où se trouvent les utilisateurs.",
      icon: Smartphone,
    },
    {
      id: 3,
      title: "Suivi Personnalisé de la Progression",
      content:
        "Avec Tamadrus, chaque élève bénéficie d'un suivi personnalisé. Les enseignants peuvent suivre l'évolution de chaque étudiant en temps réel, identifier les points faibles et proposer des solutions adaptées pour chaque individu.",
      icon: UserCheck,
    },
    {
      id: 4,
      title: "Support Multilingue",
      content:
        "Tamadrus propose des interfaces en plusieurs langues, y compris l'arabe et le français, afin de s'adapter aux langues d'enseignement courantes dans le système éducatif marocain, garantissant ainsi une accessibilité maximale pour tous.",
      icon: Globe,
    },
    {
      id: 5,
      title: "Plateforme Interactive et Engagée",
      content:
        "En utilisant des outils interactifs tels que des quiz, des vidéos éducatives, des forums de discussion et des exercices pratiques, Tamadrus crée un environnement d'apprentissage stimulant, engageant et moderne. Les élèves peuvent apprendre à leur rythme, avec une richesse de ressources pédagogiques.",
      icon: PlayCircle,
    },
    {
      id: 6,
      title: "Compatible avec le Programme National",
      content:
        "Nous avons intégré tous les cours et les matières enseignées au Maroc, du primaire au baccalauréat. Les élèves peuvent facilement suivre le programme tout en ayant accès à des ressources supplémentaires pour approfondir leurs connaissances.",
      icon: BookOpen,
    },
    {
      id: 7,
      title: "Facilité de Gestion pour les Enseignants",
      content:
        "Les enseignants bénéficient d'une interface simple et intuitive pour gérer leurs cours, assigner des tâches, évaluer les élèves et communiquer avec eux, facilitant ainsi le suivi de la classe et la gestion pédagogique.",
      icon: UserCog,
    },
    {
      id: 8,
      title: "Accessibilité 24/7",
      content:
        "Tamadrus permet aux étudiants et enseignants d'accéder aux contenus à tout moment, offrant ainsi une flexibilité maximale pour étudier et enseigner à leur propre rythme, en dehors des heures scolaires traditionnelles.",
      icon: Clock,
    },
    {
      id: 9,
      title: "Sécurisé et Fiable",
      content:
        "Nous accordons une grande importance à la sécurité des données des utilisateurs. Notre plateforme garantit une protection de la vie privée et des informations personnelles grâce à des protocoles de sécurité avancés.",
      icon: Shield,
    },
  ];

  return (
    <section
      id="features"
      className="relative py-24  overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <AnimatedBackground />
     <div className="container mx-auto px-4 sm:px-6 lg:w-2/3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative z-10">
            Pourquoi{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choisir Tamadrus ?
            </span>
          </h2>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center text-gray-900 mb-3"></h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            {" "}
            une expérience d’apprentissage enrichissante, accessible, et adaptée
            à vos besoins.
          </p>
        </motion.div>
       <Card className="rounded-lg shadow-xl w-full mx-auto overflow-hidden">
          <CardContent className="p-2 sm:p-4 md:p-6">
             <div className="flex flex-col lg:flex-row min-h-[400px] sm:max-h-[400px] lg:max-h-[450px]">
              <motion.div
                className="w-full md:w-1/2 lg:w-2/3"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ScrollArea className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] mt-2 sm:mt-4 md:mt-6">
                  {reasons.map((reason) => (
                    <ReasonItem
                      key={reason.id}
                      reason={reason}
                      isSelected={selectedReason === reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                    />
                  ))}
                </ScrollArea>
              </motion.div>

              {/* Right Column: Reason Details */}
              <motion.div
                className="w-full md:w-1/2  p-8 md:p-8 my-4 lg:mx-10"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AnimatePresence mode="wait">
                  {selectedReason !== null ? (
                    <motion.div
                      key={selectedReason}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl md:text-2xl font-semibold mb-4 mt-4 md:mt-24">
                        {reasons[selectedReason - 1].title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {reasons[selectedReason - 1].content}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="w-full md:w-[400px] mx-auto">
                      <motion.img
                        src="/faq.png"
                        alt=""
                        className="w-full h-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
      <motion.div
        className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-200 rounded-full opacity-50"
        variants={childVariants}
        initial="hidden"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -top-4 -right-4 w-32 h-32 bg-pink-200 rounded-full opacity-50"
        variants={childVariants}
        initial="hidden"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </section>
  );
}

function ReasonItem({ reason, isSelected, onClick }) {
  const Icon = reason.icon;

  return (
    <motion.div
      className={`flex items-center p-3 cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary text-primary-foreground bg-blue-500 rounded-3xl"
          : "hover:bg-blue-300 rounded-3xl"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-6 h-6 mr-4" />
      <span className="font-medium">{reason.title}</span>
      <ChevronRight className="w-5 h-5 ml-auto" />
    </motion.div>
  );
}
