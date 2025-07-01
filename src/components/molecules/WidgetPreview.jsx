import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ApperIcon from "@/components/ApperIcon";
import PostCard from "@/components/molecules/PostCard";

const WidgetPreview = ({ widget, posts = [], className = '', theme = null, sticky = false, stickyOffset = 4 }) => {
  const activeTheme = theme || widget?.theme || 'minimal'
  
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
    const baseLayout = (() => {
      switch (widget.layout) {
        case 'grid':
          return 'grid grid-cols-1 md:grid-cols-2 gap-4'
        case 'list':
          return 'space-y-4'
        case 'masonry':
          return 'columns-1 md:columns-2 gap-4 space-y-4'
        case 'slider':
          return 'slider-container'
        default:
          return 'grid grid-cols-1 md:grid-cols-2 gap-4'
      }
    })()

    // Theme-specific adjustments
    const themeAdjustments = {
      minimal: 'gap-6',
      card: 'gap-4',
      compact: 'gap-2',
      magazine: 'gap-5'
    }

    return `${baseLayout} ${themeAdjustments[activeTheme] || ''}`
  }

  const getContainerClasses = () => {
    const themeStyles = {
      minimal: 'bg-white border-0 shadow-none',
      card: 'bg-white border border-gray-200 shadow-premium',
      compact: 'bg-gray-50 border border-gray-100 shadow-sm',
      magazine: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-luxury'
    }
    return themeStyles[activeTheme] || themeStyles.minimal
  }

  const getHeaderClasses = () => {
    const themeStyles = {
      minimal: 'bg-white border-b border-gray-100 p-6',
      card: 'bg-gradient-to-r from-primary to-secondary p-4',
      compact: 'bg-gray-100 p-2',
      magazine: 'bg-gradient-to-r from-gray-900 to-gray-700 p-6'
    }
    return themeStyles[activeTheme] || themeStyles.minimal
  }

  const getContentClasses = () => {
    const themeStyles = {
      minimal: 'p-8',
      card: 'p-4',
      compact: 'p-2',
      magazine: 'p-6'
    }
return themeStyles[activeTheme] || themeStyles.minimal
  }

  const getMaxHeightClasses = () => {
    const themeStyles = {
      minimal: 'max-h-96',
      card: 'max-h-80',
      compact: 'max-h-64',
      magazine: 'max-h-[32rem]'
    }
    return themeStyles[activeTheme] || themeStyles.minimal
  }

const displayPosts = posts.slice(0, widget.maxPosts || 10)

  const getStickyClasses = () => {
    if (!sticky) return ''
    
    return `sticky top-${stickyOffset} z-sticky`
  }

  const getWrapperClasses = () => {
    const baseClasses = `rounded-xl overflow-hidden ${getContainerClasses()}`
    const stickyClasses = getStickyClasses()
    
    return `${baseClasses} ${stickyClasses} ${className}`.trim()
  }

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={getWrapperClasses()}
    >
      {/* Widget Header */}
      <div className={getHeaderClasses()}>
        <div className="flex items-center space-x-3">
          <div className={`rounded-lg ${activeTheme === 'minimal' ? 'p-2 bg-gray-100' : activeTheme === 'compact' ? 'p-1 bg-white/20' : 'p-2 bg-white/20 backdrop-blur-sm'}`}>
            <ApperIcon 
              name="Rss" 
              className={activeTheme === 'minimal' ? 'text-gray-600' : activeTheme === 'compact' ? 'text-gray-700' : 'text-white'} 
              size={activeTheme === 'compact' ? 16 : 20} 
            />
          </div>
          <div>
            <h3 className={`font-semibold ${
              activeTheme === 'minimal' ? 'text-gray-900 text-lg' :
              activeTheme === 'card' ? 'text-white' :
              activeTheme === 'compact' ? 'text-gray-900 text-sm' :
              'text-white text-xl'
            }`}>
              {widget.name}
            </h3>
            <p className={`text-sm ${
              activeTheme === 'minimal' ? 'text-gray-600' :
              activeTheme === 'card' ? 'text-white/80' :
              activeTheme === 'compact' ? 'text-gray-600 text-xs' :
              'text-white/90'
            }`}>
              {widget.platforms?.length || 0} platforms • {displayPosts.length} posts
            </p>
          </div>
        </div>
      </div>

{/* Widget Content */}
      <div className={`${getContentClasses()} ${getMaxHeightClasses()} overflow-y-auto overflow-x-hidden`}>
        {displayPosts.length > 0 ? (
widget.layout === 'slider' ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation={widget.sliderSettings?.navigation !== false}
              pagination={widget.sliderSettings?.pagination !== false ? { clickable: true } : false}
              autoplay={widget.sliderSettings?.autoplay !== false ? { 
                delay: widget.sliderSettings?.autoplayDelay || 3000, 
                disableOnInteraction: false 
              } : false}
              speed={widget.sliderSettings?.speed || 300}
              allowTouchMove={widget.sliderSettings?.dragControl !== false}
              loop={widget.sliderSettings?.loop !== false}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 }
              }}
              className="widget-swiper"
            >
              {displayPosts.map((post, index) => (
                <SwiperSlide key={post.Id}>
                  <PostCard
                    post={post}
                    layout={widget.layout}
                    theme={activeTheme}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className={getLayoutClasses()}>
              {displayPosts.map((post, index) => (
                <PostCard
                  key={post.Id}
                  post={post}
                  layout={widget.layout}
                  theme={activeTheme}
                  className={widget.layout === 'masonry' ? 'break-inside-avoid' : ''}
                />
              ))}
            </div>
          )
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
      {activeTheme !== 'compact' && (
        <div className={`border-t ${
          activeTheme === 'minimal' ? 'bg-gray-50 border-gray-100 p-4' :
          activeTheme === 'magazine' ? 'bg-gray-100 border-gray-200 p-4' :
          'bg-surface border-gray-200 p-3'
        }`}>
          <div className={`flex items-center justify-between text-sm text-gray-600 ${
            activeTheme === 'magazine' ? 'text-xs' : ''
          }`}>
            <span>Powered by SocialFeedEmbed</span>
            <span>{widget.layout} layout</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default WidgetPreview