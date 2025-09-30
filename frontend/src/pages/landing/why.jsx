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
    title: "Conforme au programme national marocain",
    content:
      "Tamadrus suit scrupuleusement les programmes officiels du Ministère de l’Éducation Nationale, du primaire au baccalauréat. Tous les cours sont alignés avec le référentiel marocain, pour un soutien scolaire 100 % pertinent.",
    icon: MapPin,
  },
  {
    id: 2,
    title: "Accessible partout au Maroc, même en zone rurale",
    content:
      "Que vous soyez à Casablanca, Marrakech ou dans une région rurale, Tamadrus fonctionne sur smartphone, tablette ou ordinateur, avec une consommation data optimisée pour un accès fluide partout au Maroc.",
    icon: Smartphone,
  },
  {
    id: 3,
    title: "Suivi personnalisé de la progression scolaire",
    content:
      "Chaque élève bénéficie d’un tableau de bord individuel. Les enseignants et parents peuvent suivre les progrès en temps réel, repérer les difficultés (maths, français, physique…) et intervenir avec des ressources ciblées.",
    icon: UserCheck,
  },
  {
    id: 4,
    title: "Interface en arabe et en français",
    content:
      "Tamadrus s’adapte aux langues d’enseignement du système éducatif marocain. Les élèves peuvent naviguer et apprendre en arabe ou en français, selon leur préférence ou leur niveau.",
    icon: Globe,
  },
  {
    id: 5,
    title: "Apprentissage interactif et motivant",
    content:
      "Quiz auto-correctifs, vidéos pédagogiques, exercices interactifs et forums de discussion : Tamadrus transforme l’apprentissage en une expérience engageante, moderne et adaptée aux jeunes générations.",
    icon: PlayCircle,
  },
  {
    id: 6,
    title: "Toutes les matières, du primaire au bac",
    content:
      "Mathématiques, français, physique-chimie, SVT, histoire-géo… Toutes les disciplines du cursus marocain sont couvertes, avec des contenus riches, structurés et régulièrement mis à jour selon les dernières directives pédagogiques.",
    icon: BookOpen,
  },
  {
    id: 7,
    title: "Outils intuitifs pour les enseignants",
    content:
      "Créez des devoirs, corrigez en ligne, suivez les résultats de la classe et communiquez facilement avec vos élèves — le tout depuis une interface simple, conçue spécifiquement pour les enseignants marocains.",
    icon: UserCog,
  },
  {
    id: 8,
    title: "Disponible 24h/24, 7j/7",
    content:
      "Révisez avant un devoir, rattrapez un cours manqué ou approfondissez un chapitre : Tamadrus est accessible à tout moment, offrant une flexibilité totale pour apprendre à son rythme, en dehors de la classe.",
    icon: Clock,
  },
  {
    id: 9,
    title: "Plateforme sécurisée et conforme RGPD",
    content:
      "Les données de vos élèves et enseignants sont protégées par des protocoles de sécurité avancés. Tamadrus respecte la vie privée et garantit un environnement numérique fiable et sécurisé pour l’éducation.",
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
                className="w-full md:w-2/3  p-8 md:p-8 my-4 lg:mx-10"
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
