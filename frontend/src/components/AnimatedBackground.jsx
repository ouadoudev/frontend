import { motion } from "framer-motion";
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgb(59,130,246)', stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: 'rgb(147,51,234)', stopOpacity: 0.2 }} />
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
          repeatType: 'reverse',
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
          repeatType: 'reverse',
        }}
      />
    </svg>
  </div>
)
  export default AnimatedBackground;