/**
 * Client API pour communiquer avec le backend
 * Version simplifiée - Fonctionnalités de base uniquement
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Produits
  async getProducts(limit = 100) {
    return this.request(`/products/?limit=${limit}`)
  }

  async getProduct(productId) {
    return this.request(`/products/${productId}`)
  }

  async createProduct(productData) {
    return this.request('/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }
}

export default new ApiClient(API_BASE_URL)

