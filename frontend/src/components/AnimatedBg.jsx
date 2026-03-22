import { motion } from "framer-motion";

export default function AnimatedBg() {

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      <motion.div
        className="w-[600px] h-[600px] bg-blue-500 rounded-full opacity-20 blur-3xl absolute top-10 left-10"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      <motion.div
        className="w-[500px] h-[500px] bg-green-500 rounded-full opacity-20 blur-3xl absolute bottom-10 right-10"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

    </div>
  );
}