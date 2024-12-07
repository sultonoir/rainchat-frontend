"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "../../hooks/use-sidebar";
import { Sidebar } from "@/components/sidebar/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarVariants = {
  open: {
    display: "flex",
    width: "350px", // Lebih kecil agar lebih cepat
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200, // Kurangi stiffness untuk pergerakan lebih halus
      damping: 25, // Kurangi damping untuk menghindari animasi terlalu lambat
    },
  },
  closed: {
    display: "none",
    width: "0px",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
};

const contentVariants = {
  open: {
    marginLeft: "350px",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
  closed: {
    marginLeft: "0px",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
};

export function SidebarProvider({ children }: LayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen overflow-hidden">
      <AnimatePresence>
        <motion.div
          initial="open"
          animate={isOpen ? "open" : "closed"}
          exit="closed" // Tambahkan animasi keluar
          variants={sidebarVariants}
          className="fixed left-0 top-0 h-full bg-secondary shadow-xl will-change-transform" // Optimisasi dengan will-change
        >
          <Sidebar />
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial="open"
        animate={isOpen ? "open" : "closed"}
        variants={contentVariants}
        className="flex-1 transition-transform will-change-transform" // Optimisasi dengan will-change
      >
        {children}
      </motion.div>
    </div>
  );
}
