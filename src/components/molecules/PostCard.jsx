import React from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const PostCard = ({ post, layout = 'grid', className = '' }) => {
  const platformColors = {
    twitter: 'twitter',
    instagram: 'instagram',
    facebook: 'facebook',
    tiktok: 'tiktok',
    youtube: 'youtube',
    linkedin: 'linkedin'
  }

  const platformIcons = {
    twitter: 'Twitter',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'Music',
    youtube: 'Youtube',
    linkedin: 'Linkedin'
  }

  const isGridLayout = layout === 'grid'
  const isListLayout = layout === 'list'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-premium hover:shadow-luxury
        transition-all duration-200 overflow-hidden
        ${isListLayout ? 'flex' : ''}
        ${className}
      `}
    >
      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className={`${isListLayout ? 'w-32 flex-shrink-0' : 'aspect-video'} bg-gray-100 relative`}>
          <img
            src={post.media[0]}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={platformColors[post.platform]} size="sm">
              <ApperIcon name={platformIcons[post.platform]} size={12} className="mr-1" />
              {post.platform}
            </Badge>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={post.avatar}
            alt={post.author}
            className="w-8 h-8 rounded-full bg-gray-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{post.author}</h4>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
          {(!post.media || post.media.length === 0) && (
            <Badge variant={platformColors[post.platform]} size="sm">
              <ApperIcon name={platformIcons[post.platform]} size={12} className="mr-1" />
              {post.platform}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className={`text-gray-700 ${isGridLayout ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {post.content}
          </p>
        </div>

        {/* Engagement */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Heart" size={14} />
            <span>{post.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="MessageCircle" size={14} />
            <span>{post.comments.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PostCard