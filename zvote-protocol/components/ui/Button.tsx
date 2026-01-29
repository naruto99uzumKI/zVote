import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon = false,
  onClick,
  className = ''
}) => {
  // Premium Feel: Slower transitions, subtle glows, heavy damping on tap
  const baseStyles = "relative px-8 py-4 rounded-xl font-display font-medium text-sm tracking-wide transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden group isolate";
  
  const variants = {
    primary: "bg-electric-gradient text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.7)] border border-white/10",
    secondary: "bg-surfaceHighlight text-slate-300 hover:text-white border border-white/5 hover:bg-white/10",
    outline: "bg-transparent border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {/* Primary variant shine effect */}
      {variant === 'primary' && (
        <>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] z-0" />
          <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
        </>
      )}

      {/* Outline variant hover fill */}
      {variant === 'outline' && (
         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 z-0" />
      )}
      
      <span className="relative z-20 flex items-center gap-2">
        {children}
        {icon && (
          <motion.span
             initial={{ x: 0 }}
             whileHover={{ x: 3 }}
             transition={{ duration: 0.3 }}
          >
             <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </motion.span>
        )}
      </span>
    </motion.button>
  );
};