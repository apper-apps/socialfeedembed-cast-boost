import React from 'react'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    accent: "bg-gradient-to-r from-accent/10 to-emerald-500/10 text-accent border border-accent/20",
    success: "bg-gradient-to-r from-success/10 to-green-600/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-orange-600/10 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-600/10 text-error border border-error/20",
    twitter: "bg-gradient-to-r from-twitter/10 to-blue-600/10 text-twitter border border-twitter/20",
    instagram: "bg-gradient-to-r from-instagram/10 to-pink-600/10 text-instagram border border-instagram/20",
    facebook: "bg-gradient-to-r from-facebook/10 to-blue-700/10 text-facebook border border-facebook/20",
    tiktok: "bg-gradient-to-r from-gray-900/10 to-gray-800/10 text-gray-900 border border-gray-900/20",
    youtube: "bg-gradient-to-r from-youtube/10 to-red-700/10 text-youtube border border-youtube/20",
    linkedin: "bg-gradient-to-r from-linkedin/10 to-blue-700/10 text-linkedin border border-linkedin/20"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge