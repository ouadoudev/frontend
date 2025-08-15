import React, { useRef } from "react"

import { useState } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Plus, Minus } from "lucide-react"
import { Link } from "react-scroll"

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="faqGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "rgb(59,130,246)", stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: "rgb(147,51,234)", stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>
      <motion.circle
        cx="90%"
        cy="20%"
        r="15%"
        fill="url(#faqGrad1)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.circle
        cx="10%"
        cy="80%"
        r="20%"
        fill="url(#faqGrad1)"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </svg>
  </div>
)

const faqData = [
  {
    question: "Quels niveaux sont disponibles sur votre plateforme LMS ?",
    answer:
      "Tamadrus couvre l'ensemble du parcours scolaire au Maroc, du primaire au baccalauréat. Les cours incluent toutes les matières principales telles que les mathématiques, les sciences, les langues (français, arabe, anglais), ainsi que des matières spécialisées selon les options du bac.",
    category: "Général",
  },
  {
    question: "Comment les cours sont-ils organisés ?",
    answer:
      "Les cours sont structurés en modules interactifs, avec des vidéos explicatives, des quiz, des exercices pratiques et des évaluations. Le contenu est conçu pour être accessible à chaque niveau, et il est régulièrement mis à jour pour rester pertinent et engageant.",
    category: "Cours",
  },
  {
    question: "Les élèves peuvent-ils suivre les cours à leur rythme ?",
    answer:
      "Oui, notre plateforme permet aux étudiants de suivre les cours à leur propre rythme. Ils peuvent revoir les vidéos, refaire les exercices et passer les évaluations selon leur disponibilité et leurs besoins.",
    category: "Apprentissage",
  },
  {
    question: "Quels outils sont à la disposition des étudiants pour leur apprentissage ?",
    answer:
      "Les étudiants peuvent accéder à des forums de discussion, des sessions de questions-réponses en direct, des quiz interactifs, des fiches de révision et un système de suivi des progrès pour les aider à avancer dans leur apprentissage.",
    category: "Outils",
  },
  {
    question: "Est-ce que les cours sont accessibles sur mobile ?",
    answer:
      "Oui, Tamadrus est entièrement responsive et accessible sur les appareils mobiles. Les étudiants peuvent suivre leurs cours via l'application mobile disponible sur iOS et Android, ce qui leur permet d'apprendre à tout moment et en tout lieu.",
    category: "Technique",
  },
  {
    question: "Puis-je utiliser la plateforme pour me préparer aux examens de fin d'année ?",
    answer:
      "Oui, Tamadrus propose des parcours de révision spécialement conçus pour préparer les examens de fin d'année. Les étudiants peuvent accéder à des simulations d'examen, des exercices de révision et des sessions de préparation intensives pour le Bac.",
    category: "Examens",
  },
]

const FAQItem = ({
  faq,
  index,
  isOpen,
  onToggle,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <AccordionItem
        value={`item-${index}`}
        className="border border-gray-200 rounded-2xl mb-4 overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
      >
        <AccordionTrigger className="text-left px-6 py-5 hover:no-underline group" onClick={onToggle}>
          <div className="flex items-start justify-between w-full">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {faq.category}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {faq.question}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 ml-4"
            >
            </motion.div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-5">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pl-20"
              >
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  )
}

const Faq = () => {
  const [openItems, setOpenItems] = useState([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const toggleItem = (value) => {
    setOpenItems((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <AnimatedBackground />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Questions{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fréquentes
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Nous répondons à toutes vos interrogations pour une expérience d'apprentissage optimale.
            </p>
          </motion.div>

          <Accordion type="multiple" value={openItems} className="w-full ">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openItems.includes(`item-${index}`)}
                onToggle={() => toggleItem(`item-${index}`)}
              />
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Vous avez d'autres questions ?</h3>
            <Link to="contact" smooth={true} duration={600} offset={-70}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contactez-nous
            </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-200 rounded-full opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -top-4 -right-4 w-32 h-32 bg-pink-200 rounded-full opacity-30"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </section>
  )
}

export default Faq
