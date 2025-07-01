import mockTemplates from '@/services/mockData/templates.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let templates = [...mockTemplates];
let lastId = Math.max(...templates.map(t => t.Id));

const templateService = {
  // Get all templates
  async getAll() {
    await delay(200);
    return [...templates];
  },

  // Get template by ID
  async getById(id) {
    await delay(200);
    const template = templates.find(t => t.Id === parseInt(id));
    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }
    return { ...template };
  },

  // Get templates by category
  async getByCategory(category) {
    await delay(200);
    return templates.filter(t => t.category === category).map(t => ({ ...t }));
  },

  // Search templates
  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return templates.filter(t => 
      t.name.toLowerCase().includes(lowercaseQuery) ||
      t.description.toLowerCase().includes(lowercaseQuery) ||
      t.category.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }));
  },

  // Get featured templates
  async getFeatured() {
    await delay(200);
    return templates.filter(t => t.featured).map(t => ({ ...t }));
  },

  // Create new template (for admin use)
  async create(templateData) {
    await delay(300);
    
    const newTemplate = {
      ...templateData,
      Id: ++lastId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    templates.push(newTemplate);
    return { ...newTemplate };
  },

  // Update template (for admin use)
  async update(id, templateData) {
    await delay(300);
    
    const index = templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    templates[index] = {
      ...templates[index],
      ...templateData,
      Id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    return { ...templates[index] };
  },

  // Delete template (for admin use)
  async delete(id) {
    await delay(200);
    
    const index = templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    templates.splice(index, 1);
    return true;
  },

  // Get template statistics
  async getStats() {
    await delay(200);
    
    const stats = {
      total: templates.length,
      byCategory: {},
      byLayout: {},
      byTheme: {}
    };
    
    templates.forEach(template => {
      // Category stats
      stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
      
      // Layout stats
      stats.byLayout[template.layout] = (stats.byLayout[template.layout] || 0) + 1;
      
      // Theme stats
      stats.byTheme[template.theme] = (stats.byTheme[template.theme] || 0) + 1;
    });
    
    return stats;
  }
};

export default templateService;