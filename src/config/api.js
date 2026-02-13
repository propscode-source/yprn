// API Configuration
// Di development: VITE_API_URL=http://localhost:5000
// Di production (Vercel): set via Environment Variables dashboard

export const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`

export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`
}
