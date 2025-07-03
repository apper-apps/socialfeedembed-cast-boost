import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
    // Safely get layout settings with fallback defaults
    const settings = widget?.[`${widget.layout}Settings`] || {}
    
    const getGapClass = (gapSize) => {
      const gapMap = {
        xs: 'gap-1',
        sm: 'gap-2', 
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
      }
      return gapMap[gapSize] || 'gap-4'
    }

    const getSpacingClass = (spacing) => {
      const spacingMap = {
        xs: 'space-y-1',
        sm: 'space-y-2',
        md: 'space-y-4', 
        lg: 'space-y-6',
        xl: 'space-y-8'
      }
      return spacingMap[spacing] || 'space-y-4'
    }

    const getColumnsClass = (cols) => {
      if (cols === 'auto' || !cols) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      const colsMap = {
        '1': 'grid-cols-1',
        '2': 'grid-cols-1 md:grid-cols-2',
        '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        '5': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
      }
      return colsMap[cols] || 'grid-cols-1 md:grid-cols-2'
    }

    const getMasonryColumnsClass = (cols) => {
      if (cols === 'auto' || !cols) return 'columns-1 md:columns-2 lg:columns-3'
      const colsMap = {
        '2': 'columns-1 md:columns-2',
        '3': 'columns-1 md:columns-2 lg:columns-3', 
        '4': 'columns-1 md:columns-2 lg:columns-3 xl:columns-4',
        '5': 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5'
      }
      return colsMap[cols] || 'columns-1 md:columns-2'
    }

    const baseLayout = (() => {
      switch (widget?.layout) {
        case 'grid':
          const gridCols = getColumnsClass(settings.columns)
          const gridGap = getGapClass(settings.gap)
          const equalHeight = settings.equalHeight ? 'grid-rows-1' : ''
          return `grid ${gridCols} ${gridGap} ${equalHeight}`.trim()
        
        case 'list':
          const listSpacing = getSpacingClass(settings.spacing)
          const dividers = settings.showDividers ? 'divide-y divide-gray-100' : ''
          const compact = settings.compactMode ? 'space-y-2' : listSpacing
          return `${compact} ${dividers}`.trim()
        
        case 'masonry':
          const masonryCols = getMasonryColumnsClass(settings.columns)
          const masonryGap = getGapClass(settings.gap)
          return `${masonryCols} ${masonryGap}`.trim()
        
        case 'slider':
          return 'slider-container'
        
        default:
          return 'grid grid-cols-1 md:grid-cols-2 gap-4'
      }
    })()

    // Theme-specific adjustments (fallback for older widgets)
    const themeAdjustments = {
      minimal: widget?.layout === 'grid' && !settings.gap ? 'gap-6' : '',
      card: widget?.layout === 'grid' && !settings.gap ? 'gap-4' : '',
      compact: widget?.layout === 'grid' && !settings.gap ? 'gap-2' : '',
      magazine: widget?.layout === 'grid' && !settings.gap ? 'gap-5' : ''
    }

    return `${baseLayout} ${themeAdjustments[activeTheme] || ''}`.trim()
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
      minimal: 'py-12 px-8',
      card: 'py-8 px-4',
      compact: 'p-2',
      magazine: 'py-10 px-6'
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

  // Dummy posts for preview when no posts are provided
  const dummyPosts = [
    {
      "Id": 1,
      "platform": "twitter",
      "author": "TechStartup",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      "content": "Excited to announce our new AI-powered feature! 🚀 This will revolutionize how teams collaborate. #innovation #AI #startup",
      "media": ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"],
      "likes": 1247,
      "comments": 89,
      "timestamp": "2023-12-15T10:30:00Z"
    },
    {
      "Id": 2,
      "platform": "instagram",
      "author": "CreativeAgency",
      "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b2e6?w=100&h=100&fit=crop&crop=faces",
      "content": "Behind the scenes of our latest campaign shoot ✨ The team worked incredibly hard to bring this vision to life! #creative #campaign #teamwork",
      "media": ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop"],
      "likes": 2156,
      "comments": 134,
      "timestamp": "2023-12-15T08:15:00Z"
    },
    {
      "Id": 4,
      "platform": "linkedin",
      "author": "Sarah Chen",
      "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
      "content": "Just finished an amazing conference on digital transformation. Key takeaway: The future belongs to companies that embrace change. #conference #digitaltransformation #leadership",
      "media": ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"],
      "likes": 543,
      "comments": 32,
      "timestamp": "2023-12-14T14:20:00Z"
    },
    {
      "Id": 6,
      "platform": "instagram",
      "author": "FoodieCorner",
      "avatar": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=faces",
      "content": "Fresh ingredients, bold flavors, happy customers! 🍕 What's your favorite pizza topping? #food #pizza #fresh #local",
      "media": ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop"],
      "likes": 1834,
      "comments": 201,
      "timestamp": "2023-12-13T19:30:00Z"
    },
    {
      "Id": 8,
      "platform": "twitter",
      "author": "StartupNews",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
      "content": "BREAKING: Another unicorn startup emerges from the fintech space! 🦄 The industry continues to evolve at breakneck speed. #fintech #startup #unicorn #news",
      "media": [],
      "likes": 1923,
      "comments": 156,
      "timestamp": "2023-12-13T11:20:00Z"
    },
    {
      "Id": 13,
      "platform": "tiktok",
      "author": "CreativeContent",
      "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b2e6?w=100&h=100&fit=crop&crop=faces",
      "content": "Quick design tip: Use the rule of thirds to create more visually appealing layouts! ✨ Save this for later! #design #tips #creative",
      "media": ["https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=400&fit=crop"],
      "likes": 5432,
      "comments": 321,
      "timestamp": "2023-12-10T10:45:00Z"
    }
  ]

// Use provided posts or fallback to dummy posts for preview
  const postsToDisplay = posts.length > 0 ? posts : dummyPosts
  const displayPosts = postsToDisplay.slice(0, widget.maxPosts || 10)
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
              navigation={widget?.sliderSettings?.navigation !== false}
              pagination={widget?.sliderSettings?.pagination !== false ? { clickable: true } : false}
              autoplay={widget?.sliderSettings?.autoplay !== false ? { 
                delay: widget?.sliderSettings?.autoplayDelay || 3000,
                disableOnInteraction: false 
              } : false}
              speed={widget?.sliderSettings?.speed || 300}
              allowTouchMove={widget?.sliderSettings?.dragControl !== false}
              loop={widget?.sliderSettings?.loop !== false}
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
                    visibilitySettings={widget.visibilitySettings}
                  />
                </SwiperSlide>
              ))}
</Swiper>
          ) : (
            <div className={getLayoutClasses()}>
              {displayPosts.map((post, index) => {
                const settings = widget?.[`${widget.layout}Settings`] || {}
                const isAlternate = widget?.layout === 'list' && settings.alternateLayout && index % 2 === 1
                
return (
                  <PostCard
                    key={post.Id}
                    post={post}
                    layout={widget?.layout}
                    theme={activeTheme}
                    layoutSettings={settings}
                    isAlternate={isAlternate}
                    animationDelay={settings.animation === 'stagger' || settings.animation === 'cascade' ? index * 100 : 0}
                    visibilitySettings={widget.visibilitySettings}
                    className={`
                      ${widget?.layout === 'masonry' ? `break-inside-${settings.breakInside || 'avoid'}` : ''}
                      ${settings.animation === 'fadeIn' ? 'animate-fade-in' : ''}
                      ${settings.animation === 'slideUp' ? 'animate-slide-up' : ''}
                      ${settings.animation === 'slideIn' ? 'animate-slide-in' : ''}
                      ${settings.animation === 'stagger' ? 'animate-fade-in' : ''}
                      ${settings.animation === 'cascade' ? 'animate-cascade' : ''}
                      ${settings.animation === 'wave' ? 'animate-wave' : ''}
                      ${settings.minItemHeight ? `min-h-[${settings.minItemHeight}px]` : ''}
                    `.trim()}
                  />
                )
              })}
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