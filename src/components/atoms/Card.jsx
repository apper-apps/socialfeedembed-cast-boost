import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'default',
  shadow = 'default',
  height = 'auto',
  ...props 
}) => {
  const baseClasses = "bg-white rounded-xl border border-gray-200 transition-all duration-200"
  
  const paddings = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8"
  }
const shadows = {
    none: "",
    sm: "shadow-sm",
    default: "shadow-premium",
    lg: "shadow-luxury"
  }
  
  const heights = {
    auto: "",
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
    xl: "h-80",
    full: "h-full"
  }
  
  const hoverClasses = hover ? "hover:shadow-luxury hover:border-gray-300 cursor-pointer" : ""

  const cardClasses = `${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${heights[height]} ${hoverClasses} ${className}`

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  )
}

export default Card