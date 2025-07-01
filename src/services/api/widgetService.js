import widgetData from '@/services/mockData/widgets.json'

let widgets = [...widgetData]

export const widgetService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return widgets.map(widget => ({ ...widget }))
  },

async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    // Convert id to number for comparison since mock data uses numeric IDs
    const numericId = parseInt(id, 10)
    const widget = widgets.find(w => w.Id === numericId)
    if (!widget) {
      console.error(`Widget not found for ID: ${id}. Available widgets:`, widgets.map(w => ({ Id: w.Id, name: w.name })))
      throw new Error(`Widget not found: ${id}`)
    }
    return { ...widget }
  },

async create(widgetData) {
    await new Promise(resolve => setTimeout(resolve, 400))
const newWidget = {
      ...widgetData,
      Id: Math.max(...widgets.map(w => w.Id || 0), 0) + 1,
      visibilitySettings: {
        showLikes: true,
        showComments: true,
        showText: true,
        showAuthor: true,
        showTimestamp: true,
        showPlatformBadge: true,
        ...(widgetData.visibilitySettings || {})
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    widgets.push(newWidget)
    return { ...newWidget }
  },

async update(id, widgetData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    // Convert id to number for comparison since mock data uses numeric IDs
    const numericId = parseInt(id, 10)
    const index = widgets.findIndex(w => w.Id === numericId)
    if (index === -1) {
      console.error(`Widget not found for update with ID: ${id}. Available widgets:`, widgets.map(w => ({ Id: w.Id, name: w.name })))
      throw new Error(`Widget not found for update: ${id}`)
    }
widgets[index] = {
      ...widgets[index],
      ...widgetData,
      Id: numericId, // Maintain consistent uppercase 'Id'
      visibilitySettings: {
        showLikes: true,
        showComments: true,
        showText: true,
        showAuthor: true,
        showTimestamp: true,
        showPlatformBadge: true,
        ...(widgets[index].visibilitySettings || {}),
        ...(widgetData.visibilitySettings || {})
      },
      updatedAt: new Date().toISOString()
    }
    return { ...widgets[index] }
  },

async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Convert id to number for comparison since mock data uses numeric IDs
    const numericId = parseInt(id, 10)
    const index = widgets.findIndex(w => w.Id === numericId)
    if (index === -1) {
      console.error(`Widget not found for deletion with ID: ${id}. Available widgets:`, widgets.map(w => ({ Id: w.Id, name: w.name })))
      throw new Error(`Widget not found for deletion: ${id}`)
    }
    widgets.splice(index, 1)
    return { success: true }
  }
}