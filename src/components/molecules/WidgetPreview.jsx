import React from 'react'
import { motion } from 'framer-motion'
import PostCard from './PostCard'
import ApperIcon from '@/components/ApperIcon'

const WidgetPreview = ({ widget, posts = [], className = '' }) => {
  if (!widget) {
    return (
      <div className={`bg-surface rounded-xl p-8 text-center ${className}`}>
        <ApperIcon name="Smartphone" className="text-gray-400 mx-auto mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Widget Preview</h3>
        <p className="text-gray-600">Configure your widget to see a live preview</p>
      </div>
    )
  }

  const getLayoutClasses = () => {
    switch (widget.layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 gap-4'
      case 'list':
        return 'space-y-4'
      case 'masonry':
        return 'columns-1 md:columns-2 gap-4 space-y-4'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4'
    }
  }

  const displayPosts = posts.slice(0, widget.maxPosts || 10)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-gray-200 shadow-premium overflow-hidden ${className}`}
    >
      {/* Widget Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <ApperIcon name="Rss" className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold">{widget.name}</h3>
            <p className="text-white/80 text-sm">
              {widget.platforms?.length || 0} platforms • {displayPosts.length} posts
            </p>
          </div>
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {displayPosts.length > 0 ? (
          <div className={getLayoutClasses()}>
            {displayPosts.map((post, index) => (
              <PostCard
                key={post.Id}
                post={post}
                layout={widget.layout}
                className={widget.layout === 'masonry' ? 'break-inside-avoid' : ''}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ApperIcon name="Inbox" className="text-gray-400 mx-auto mb-4" size={48} />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Posts Found</h4>
            <p className="text-gray-600">
              Adjust your platform selection or filters to see posts
            </p>
          </div>
        )}
      </div>

      {/* Widget Footer */}
      <div className="bg-surface p-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Powered by SocialFeedEmbed</span>
          <span>{widget.layout} layout</span>
        </div>
      </div>
    </motion.div>
  )
}

export default WidgetPreview