import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  "rounded-2xl border transition-all duration-300 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 text-white border-white/20 shadow-lg backdrop-blur-xl",
        glass:
          "bg-white/5 text-white border-white/10 shadow-2xl backdrop-blur-2xl",
        solid: "bg-white text-gray-900 border-gray-200 shadow-lg",
        dark: "bg-gray-900 text-white border-gray-800 shadow-lg",
        gradient:
          "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white border-white/20 shadow-lg backdrop-blur-xl",
        premium:
          "bg-gradient-to-br from-slate-900/90 to-gray-900/90 text-white border-white/20 shadow-2xl backdrop-blur-xl",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:shadow-2xl hover:-translate-y-1",
        glow: "hover:shadow-purple-500/25 hover:shadow-2xl",
        scale: "hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "lift",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  animated?: boolean;
  glowOnHover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      hover,
      animated = true,
      glowOnHover = false,
      children,
      ...props
    },
    ref
  ) => {
    const cardContent = (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, hover, className }))}
        {...props}
      >
        {/* Animated border */}
        {glowOnHover && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50 -z-10" />
        )}

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 ease-out -translate-x-full via-white/10 group-hover:translate-x-full" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: hover === "scale" ? 1.05 : 1 }}
          className="w-full"
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn("flex flex-col pb-4 space-y-2", className)}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
  >
    <div {...props}>{children}</div>
  </motion.div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
  >
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  </motion.div>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
  >
    <p
      ref={ref}
      className={cn("text-sm leading-relaxed text-white/70", className)}
      {...props}
    >
      {children}
    </p>
  </motion.div>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.4 }}
  >
    <div ref={ref} className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  </motion.div>
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.5 }}
  >
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    >
      {children}
    </div>
  </motion.div>
));
CardFooter.displayName = "CardFooter";

// Interactive Card wrapper for enhanced UX
const InteractiveCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    onClick?: () => void;
    disabled?: boolean;
  }
>(({ onClick, disabled, className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "cursor-pointer select-none",
      disabled && "cursor-not-allowed opacity-50",
      className
    )}
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={!disabled ? onClick : undefined}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Card {...props} />
  </motion.div>
));
InteractiveCard.displayName = "InteractiveCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  InteractiveCard,
  cardVariants,
};
