import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../sidebar/sidebar";
import { MainContent } from "./main-content";
import { useSidebar } from "../../hooks/use-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarVariants = {
  open: {
    width: "350px",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    width: "0px",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const contentVariants = {
  open: {
    marginLeft: "350px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    marginLeft: "0px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export function Layout({ children }: LayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={sidebarVariants}
          className="fixed left-0 top-0 h-full bg-secondary shadow-xl"
        >
          <Sidebar />
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={contentVariants}
        className="flex-1 transition-all duration-300 ease-in-out"
      >
        <MainContent>{children}</MainContent>
      </motion.div>
    </div>
  );
}
