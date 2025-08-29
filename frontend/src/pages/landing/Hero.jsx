import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        cy="10%"
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

// eslint-disable-next-line react/prop-types
const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayText}</span>;
};

export default function Hero() {
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <div className="flex-1 text-center lg:text-left lg:mr-8">
          <motion.h1
            className="text-4xl lg:text-5xl h-28 md:h-28 md:text-5xl font-bold my-4 bg-clip-text text-transparent text-center bg-gradient-to-r from-blue-600 to-purple-600"
            variants={itemVariants}
          >
            <TypewriterText text="Chaque cours, un pas vers l’excellence académique" />
          </motion.h1>
          <motion.p
            className="text-sm sm:text-sm mb-8 text-center text-gray-700"
            variants={itemVariants}
          >
            Rejoignez des milliers d’apprenants ambitieux et accédez à des cours
            en ligne, des ressources pédagogiques interactives et un
            accompagnement expert pour exceller dans vos études.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center lg:justify-center items-center gap-4"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300/50"
                aria-label="Commencer maintenant"
                onClick={() => navigate("/register")}
              >
                Commencer maintenant
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-300/50"
                aria-label="Comment s’abonner"
                onClick={() => navigate("/procedure")}
              >
                Comment s’abonner
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex-1 mt-8 lg:mt-0">
          <img
            alt="LMS Hero"
            className="mx-auto"
            height="500"
            src="/heroo.png"
            width="600"
          />
        </div>
      </motion.div>
    </section>
  );
}
