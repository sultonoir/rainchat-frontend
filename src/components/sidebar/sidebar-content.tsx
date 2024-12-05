import { motion } from "framer-motion";
import { Home, Settings, Users, BarChart } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard" },
  { icon: Users, label: "Users" },
  { icon: BarChart, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

export function SidebarContent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 space-y-2 p-4"
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-colors hover:text-white"
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
