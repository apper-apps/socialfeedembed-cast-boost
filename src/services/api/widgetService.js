import widgetData from '@/services/mockData/widgets.json'

let widgets = [...widgetData]

export const widgetService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return widgets.map(widget => ({ ...widget }))
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const widget = widgets.find(w => w.Id === id)
    if (!widget) {
      throw new Error('Widget not found')
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
    const index = widgets.findIndex(w => w.Id === id)
    if (index === -1) {
      throw new Error('Widget not found')
    }
    widgets[index] = {
      ...widgets[index],
      ...widgetData,
      Id: id,
      updatedAt: new Date().toISOString()
    }
    return { ...widgets[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = widgets.findIndex(w => w.Id === id)
    if (index === -1) {
      throw new Error('Widget not found')
    }
    widgets.splice(index, 1)
    return { success: true }
  }
}