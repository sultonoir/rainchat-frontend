import { useEffect, useState } from "react";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Threshold for mobile (e.g., <768px)
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
}
