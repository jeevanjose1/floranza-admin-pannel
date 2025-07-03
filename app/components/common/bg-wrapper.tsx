import { type ReactElement, type ReactNode, useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  title?: string | ReactElement;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  variant?: "default" | "subtle" | "outline";
  animationDuration?: number;
};

export default function BgWrapper({
  children,
  className,
  title,
  collapsible = false,
  defaultCollapsed = false,
  variant = "default",
  animationDuration = 0.3,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  const variantStyles = {
    default: "bg-white border border-secondary/60 shadow-sm",
    subtle: "bg-slate-50 border border-slate-100",
    outline: "bg-transparent border border-slate-200",
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      className={cn(
        "rounded-lg ",
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(collapsible || title) && (
        <div 
          className={cn(
            "flex items-center justify-between px-4 py-3 border-b border-secondary/20",
            isCollapsed && collapsible && "border-b-0"
          )}
        >
          {title && (
            <motion.div 
              className="font-semibold w-full text-sm text-slate-800"
              layout="position"
            >
              {title}
            </motion.div>
          )}
          
          {collapsible && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                className="ml-auto h-8 w-8"
                variant="ghost"
                type="button"
                size="icon"
                onClick={toggleCollapse}
                aria-label={isCollapsed ? "Expand" : "Collapse"}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </div>
      )}
      
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: { 
                height: { duration: animationDuration },
                opacity: { duration: animationDuration * 0.7, delay: animationDuration * 0.3 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { 
                height: { duration: animationDuration },
                opacity: { duration: animationDuration * 0.3 }
              }
            }}
          
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}