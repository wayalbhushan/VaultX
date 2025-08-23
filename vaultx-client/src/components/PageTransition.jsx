import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0.85, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0.85, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-gray-950 min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
