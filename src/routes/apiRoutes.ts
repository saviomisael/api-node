export const apiRoutes = {
  genres: {
    create: '/api/v1/genres',
    getAll: '/api/v1/genres',
    deleteById: '/api/v1/genres/:id'
  },
  platforms: {
    create: '/api/v1/platforms',
    delete: '/api/v1/platforms/:id',
    getAll: '/api/v1/platforms'
  },
  ageRatings: {
    getAll: '/api/v1/age-ratings'
  }
}
