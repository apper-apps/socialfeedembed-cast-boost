import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ type = 'widgets' }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/6"></div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
      </div>
    </div>
  )

  const SkeletonBuilder = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Configuration Panel */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  </div>
                  <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
        <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-xl"></div>
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-1"></div>
                  <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const SkeletonAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-6 w-48"></div>
        <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {type === 'widgets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {type === 'builder' && <SkeletonBuilder />}

        {type === 'analytics' && <SkeletonAnalytics />}
      </motion.div>
    </div>
  )
}

export default Loading