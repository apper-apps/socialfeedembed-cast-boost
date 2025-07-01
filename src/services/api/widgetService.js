import widgetData from '@/services/mockData/widgets.json'

let widgets = [...widgetData]

export const widgetService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return widgets.map(widget => ({ ...widget }))
  },

async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    // Support both 'id' and 'Id' for backward compatibility
    const widget = widgets.find(w => w.id === id || w.Id === id)
    if (!widget) {
      console.error(`Widget not found for ID: ${id}. Available widgets:`, widgets.map(w => ({ id: w.id || w.Id, name: w.name })))
      throw new Error(`Widget not found: ${id}`)
    }
    return { ...widget }
  },

  async create(widgetData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newWidget = {
      ...widgetData,
      Id: Math.max(...widgets.map(w => w.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    widgets.push(newWidget)
    return { ...newWidget }
  },

async update(id, widgetData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    // Support both 'id' and 'Id' for backward compatibility
    const index = widgets.findIndex(w => w.id === id || w.Id === id)
    if (index === -1) {
      console.error(`Widget not found for update with ID: ${id}. Available widgets:`, widgets.map(w => ({ id: w.id || w.Id, name: w.name })))
      throw new Error(`Widget not found for update: ${id}`)
    }
    widgets[index] = {
      ...widgets[index],
      ...widgetData,
      id: id, // Standardize on lowercase 'id'
      updatedAt: new Date().toISOString()
    }
    return { ...widgets[index] }
  },

async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Support both 'id' and 'Id' for backward compatibility
    const index = widgets.findIndex(w => w.id === id || w.Id === id)
    if (index === -1) {
      console.error(`Widget not found for deletion with ID: ${id}. Available widgets:`, widgets.map(w => ({ id: w.id || w.Id, name: w.name })))
      throw new Error(`Widget not found for deletion: ${id}`)
    }
    widgets.splice(index, 1)
    return { success: true }
  }
}