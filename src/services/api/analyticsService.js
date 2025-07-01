import analyticsData from '@/services/mockData/analytics.json'

export const analyticsService = {
  async getAnalytics(timeRange = '7d') {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Simulate different data based on time range
    const baseData = { ...analyticsData }
    
    if (timeRange === '30d') {
      baseData.stats = baseData.stats.map(stat => ({
        ...stat,
        value: Math.floor(stat.value * 3.2),
        change: Math.floor(stat.change * 1.5)
      }))
    } else if (timeRange === '90d') {
      baseData.stats = baseData.stats.map(stat => ({
        ...stat,
        value: Math.floor(stat.value * 8.5),
        change: Math.floor(stat.change * 2.1)
      }))
    }
    
    return baseData
  },

  async getWidgetAnalytics(widgetId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      widgetId,
      views: Math.floor(Math.random() * 10000) + 1000,
      clicks: Math.floor(Math.random() * 1000) + 100,
      engagement: Math.floor(Math.random() * 30) + 10,
      platforms: ['twitter', 'instagram', 'facebook']
    }
  }
}