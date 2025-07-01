import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { analyticsService } from '@/services/api/analyticsService'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await analyticsService.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (err) {
      setError('Failed to load analytics. Please try again.')
      console.error('Error loading analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#5865F2', '#00D4AA'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    xaxis: {
      categories: analytics?.chartData?.labels || [],
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      }
    }
  }

  if (loading) {
    return <Loading type="analytics" />
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadAnalytics} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your widget performance</p>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics?.stats?.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient}`}>
                    <ApperIcon name={stat.icon} className="text-white" size={24} />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stat.change >= 0 
                      ? 'bg-success/10 text-success' 
                      : 'bg-error/10 text-error'
                  }`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Over Time</h3>
            <Chart
              options={chartOptions}
              series={analytics?.chartData?.series || []}
              type="area"
              height={300}
            />
          </Card>

          {/* Platform Performance */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
            <div className="space-y-4">
              {analytics?.platformStats?.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg text-white ${platform.color}`}>
                      <ApperIcon name={platform.icon} size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{platform.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {platform.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">{platform.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Performing Widgets */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Widgets</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Widget Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Engagement</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Platforms</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topWidgets?.map((widget) => (
                  <tr key={widget.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{widget.name}</td>
                    <td className="py-3 px-4 text-gray-700">{widget.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-700">{widget.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        {widget.engagement}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-1">
                        {widget.platforms.map((platform) => (
                          <div
                            key={platform}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                              platform === 'twitter' ? 'bg-twitter' :
                              platform === 'instagram' ? 'bg-instagram' :
                              platform === 'facebook' ? 'bg-facebook' :
                              'bg-gray-400'
                            }`}
                          >
                            {platform.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Analytics