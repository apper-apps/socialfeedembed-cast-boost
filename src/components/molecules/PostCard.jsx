import React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const PostCard = ({ 
  post, 
  layout = 'grid', 
  theme = 'minimal', 
  className = '', 
  layoutSettings = {}, 
  isAlternate = false,
  animationDelay = 0,
  visibilitySettings = {
    showLikes: true,
    showComments: true,
    showText: true,
    showAuthor: true,
    showTimestamp: true,
    showPlatformBadge: true
  }
}) => {
const platformColors = {
    twitter: 'x',
    instagram: 'instagram',
    facebook: 'facebook',
    tiktok: 'tiktok',
    youtube: 'youtube',
    linkedin: 'linkedin'
  }

const platformIcons = {
    twitter: 'X',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'Music',
    youtube: 'Youtube',
    linkedin: 'Linkedin'
  }

  const getCardClasses = () => {
    const themeStyles = {
      minimal: 'bg-white border-0 shadow-none hover:shadow-md',
      card: 'bg-white border border-gray-200 shadow-premium hover:shadow-luxury',
      compact: 'bg-white border border-gray-100 shadow-sm hover:shadow-md',
      magazine: 'bg-white border border-gray-300 shadow-luxury hover:shadow-xl'
    }
    return themeStyles[theme] || themeStyles.minimal
  }

const getPadding = () => {
    const paddingStyles = {
      minimal: 'p-6',
      card: 'p-4',
      compact: 'p-2',
      magazine: 'p-5'
    }
    return paddingStyles[theme] || paddingStyles.minimal
  }
  const getHoverEffect = () => {
    const hoverEffect = layoutSettings.hoverEffect || 'none'
    const hoverMap = {
      none: '',
      lift: 'hover:-translate-y-2 hover:shadow-lg',
      scale: 'hover:scale-105',
      glow: 'hover:shadow-xl hover:shadow-primary/20',
      slide: 'hover:translate-x-1',
      highlight: 'hover:bg-primary/5 hover:border-primary/20'
    }
    return hoverMap[hoverEffect] || ''
  }

  const getAspectRatioClass = () => {
    if (layout !== 'grid' || !layoutSettings.aspectRatio) return ''
    const ratioMap = {
      square: 'aspect-square',
      video: 'aspect-video', 
      portrait: 'aspect-[3/4]',
      auto: ''
    }
    return ratioMap[layoutSettings.aspectRatio] || ''
  }

const isGridLayout = layout === 'grid'
  const isListLayout = layout === 'list'
  const isMasonry = layout === 'masonry'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: animationDelay / 1000 }
      }}
      whileHover={{ 
        y: theme === 'compact' ? 0 : (layoutSettings.hoverEffect === 'lift' ? -8 : -2),
        scale: layoutSettings.hoverEffect === 'scale' ? 1.02 : 1
      }}
      className={`
        rounded-xl transition-all duration-200 overflow-hidden
        ${getCardClasses()}
        ${getHoverEffect()}
        ${isListLayout ? `flex ${isAlternate ? 'flex-row-reverse' : ''}` : ''}
        ${isGridLayout && layoutSettings.equalHeight ? 'h-full' : ''}
        ${theme === 'minimal' ? 'rounded-none border-b border-gray-100 last:border-b-0' : ''}
        ${layoutSettings.compactMode ? 'p-1' : ''}
        ${className}
      `}
      style={{
        animationDelay: `${animationDelay}ms`,
        minHeight: isMasonry && layoutSettings.minItemHeight ? `${layoutSettings.minItemHeight}px` : 'auto'
      }}
>
      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className={`
          ${isListLayout ? (
            layoutSettings.compactMode || theme === 'compact' ? 'w-16 flex-shrink-0' : 'w-32 flex-shrink-0'
          ) : (
            getAspectRatioClass() || 'aspect-video'
          )} 
          bg-gray-100 relative
        `}>
          <img
            src={post.media[0]}
            alt=""
            className="w-full h-full object-cover"
          />
{visibilitySettings.showPlatformBadge && (
            <div className={`absolute ${theme === 'compact' || layoutSettings.compactMode ? 'top-1 right-1' : 'top-2 right-2'}`}>
              <Badge variant={platformColors[post.platform]} size={theme === 'compact' || layoutSettings.compactMode ? 'xs' : 'sm'}>
                <ApperIcon name={platformIcons[post.platform]} size={theme === 'compact' || layoutSettings.compactMode ? 10 : 12} className="mr-1" />
                {theme === 'compact' || layoutSettings.compactMode ? '' : post.platform}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Content */}
<div className={`${getPadding()} flex-1`}>
        {/* Header */}
        {visibilitySettings.showAuthor && (
          <div className={`flex items-center mb-3 ${theme === 'compact' ? 'space-x-2 mb-1' : 'space-x-3'}`}>
            <img
              src={post.avatar}
              alt={post.author}
              className={`rounded-full bg-gray-200 ${theme === 'compact' ? 'w-6 h-6' : 'w-8 h-8'}`}
            />
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-gray-900 truncate ${
                theme === 'compact' ? 'text-sm' : 
                theme === 'magazine' ? 'text-lg font-bold' : ''
              }`}>
                {post.author}
              </h4>
              {visibilitySettings.showTimestamp && (
                <p className={`text-gray-500 ${
                  theme === 'compact' ? 'text-xs' : 
                  theme === 'magazine' ? 'text-sm font-medium' : 'text-xs'
                }`}>
                  {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                </p>
              )}
            </div>
            {(!post.media || post.media.length === 0) && visibilitySettings.showPlatformBadge && (
              <Badge variant={platformColors[post.platform]} size={theme === 'compact' ? 'xs' : 'sm'}>
                <ApperIcon name={platformIcons[post.platform]} size={theme === 'compact' ? 10 : 12} className="mr-1" />
                {theme === 'compact' ? '' : post.platform}
              </Badge>
            )}
          </div>
        )}

{/* Content */}
        {visibilitySettings.showText && (
          <div className={theme === 'compact' ? 'mb-1' : 'mb-3'}>
            <p className={`text-gray-700 ${
              theme === 'compact' ? 'line-clamp-1 text-sm' :
              theme === 'magazine' ? 'line-clamp-4 text-base leading-relaxed' :
              isGridLayout ? 'line-clamp-3' : 'line-clamp-2'
            }`}>
              {post.content}
            </p>
          </div>
        )}

{/* Engagement */}
        {(visibilitySettings.showLikes || visibilitySettings.showComments) && (
          <div className={`flex items-center text-gray-500 ${
            theme === 'compact' ? 'space-x-2 text-xs' : 
            theme === 'magazine' ? 'space-x-6 text-base' : 'space-x-4 text-sm'
          }`}>
            {visibilitySettings.showLikes && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Heart" size={theme === 'compact' ? 12 : theme === 'magazine' ? 16 : 14} />
                <span>{post.likes.toLocaleString()}</span>
              </div>
            )}
            {visibilitySettings.showComments && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="MessageCircle" size={theme === 'compact' ? 12 : theme === 'magazine' ? 16 : 14} />
                <span>{post.comments.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PostCard