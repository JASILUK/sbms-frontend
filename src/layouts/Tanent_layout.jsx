import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TenantSidebar from "../components/tanent_layout/sideBar";
import TenantHeader from "../components/tanent_layout/Header";
import { useGetCompanyContextQuery } from "../features/tanent/tanantApi";

export const SidebarContext = createContext(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within TenantLayout");
  }
  return context;
};

export default function TenantLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { isLoading } = useGetCompanyContextQuery();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);

      if (mobile) {
        setIsOpen(false);
        setIsMobileOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(prev => !prev);
    } else {
      setIsOpen(prev => !prev);
    }
  }, [isMobile]);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const contextValue = {
    isOpen,
    isMobile,
    isMobileOpen,
    toggleSidebar,
    closeMobileSidebar,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          Loading company...
        </div>
      ) : (
        <div className="h-screen flex overflow-hidden bg-[#fafafa] font-sans">

          {/* SIDEBAR */}
          <TenantSidebar />

          {/* MAIN */}
          <motion.main
            className="flex-1 flex flex-col min-w-0 min-h-0"
            initial={false}
            animate={{
              marginLeft: isMobile ? 0 : isOpen ? "280px" : "80px",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
          >

            {/* HEADER (FIXED) */}
            <TenantHeader />

            {/* 
              RESPONSIVE FIX:
              - Changed from overflow-hidden to overflow-auto
              - Added min-w-0 to prevent flex child from expanding beyond parent
              - Removed max-w-[1600px] constraint that caused overflow clipping
              - Page content now scrolls horizontally when table exceeds viewport
            */}
            <div className="flex-1 min-w-0 min-h-0 overflow-auto">
              <div className="w-full">
                <Outlet />
              </div>
            </div>

          </motion.main>

          {/* MOBILE OVERLAY */}
          <AnimatePresence>
            {isMobile && isMobileOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMobileSidebar}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

        </div>
      )}
    </SidebarContext.Provider>
  );
}