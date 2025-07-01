import postData from '@/services/mockData/posts.json'

let posts = [...postData]

export const postService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return posts.map(post => ({ ...post }))
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const post = posts.find(p => p.Id === id)
    if (!post) {
      throw new Error('Post not found')
    }
    return { ...post }
  },

  async getByPlatform(platform) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return posts.filter(post => post.platform === platform).map(post => ({ ...post }))
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const searchTerm = query.toLowerCase()
    return posts.filter(post => 
      post.content.toLowerCase().includes(searchTerm) ||
      post.author.toLowerCase().includes(searchTerm)
    ).map(post => ({ ...post }))
  }
}