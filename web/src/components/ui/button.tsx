import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transform hover:scale-105 active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:from-red-700 hover:to-pink-700 hover:shadow-xl transform hover:scale-105 active:scale-95",
        outline:
          "border-2 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",
        secondary:
          "bg-gradient-to-r from-slate-600 to-gray-600 text-white shadow-lg hover:from-slate-700 hover:to-gray-700 hover:shadow-xl transform hover:scale-105 active:scale-95",
        ghost:
          "text-white hover:bg-white/20 hover:backdrop-blur-sm rounded-xl transform hover:scale-105 active:scale-95",
        link: "text-purple-400 underline-offset-4 hover:underline hover:text-purple-300",
        glass:
          "bg-white/10 text-white backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/20 hover:border-white/30 hover:shadow-xl transform hover:scale-105 active:scale-95",
        glow: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/50 hover:shadow-2xl transform hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-14 rounded-2xl px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animate?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      animate = true,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const buttonContent = (
      <>
        {/* Shimmer effect */}
        {variant === "glow" && (
          <div className="absolute inset-0 -top-2 -right-2 -bottom-2 -left-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-xl opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-30" />
        )}

        {/* Ripple effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />

        {/* Content */}
        <div className="flex relative z-10 gap-2 justify-center items-center">
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4" />
            </motion.div>
          )}

          {!loading && leftIcon && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {leftIcon}
            </motion.div>
          )}

          {children && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {children}
            </motion.span>
          )}

          {!loading && rightIcon && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              {rightIcon}
            </motion.div>
          )}
        </div>
      </>
    );

    if (animate) {
      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            disabled={isDisabled}
            {...props}
          >
            {buttonContent}
          </Comp>
        </motion.div>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
