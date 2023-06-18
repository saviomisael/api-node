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
  },
  games: {
    create: '/api/v1/games',
    getById: '/api/v1/games/:id',
    updateGameById: '/api/v1/games/:id',
    deleteById: '/api/v1/games/:id',
    getAll: '/api/v1/games'
  },
  reviewers: {
    create: '/api/v1/reviewers',
    signIn: '/api/v1/reviewers/tokens',
    refreshToken: '/api/v1/reviewers/tokens/refresh',
    changePassword: '/api/v1/reviewers',
    forgotPassword: '/api/v1/reviewers/passwords/:username',
    deleteReviewer: '/api/v1/reviewers'
  }
}
