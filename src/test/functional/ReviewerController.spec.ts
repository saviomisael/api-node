import 'reflect-metadata'

import { AgeRating, Game, Genre, Platform, Review } from '$/domain/entities'
import { Reviewer } from '$/domain/entities/Reviewer'
import { AppDataSource } from '$/infrastructure/AppDataSource'
import { JWTGenerator } from '$/infrastructure/JWTGenerator'
import { PasswordEncrypter } from '$/infrastructure/PasswordEncrypter'
import { GameRepository, GenreRepository, PlatformRepository } from '$/infrastructure/repositories'
import { ReviewerRepository } from '$/infrastructure/repositories/ReviewerRepository'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import app from '$/infrastructure/server'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

AppDataSource.initialize()
  .then()
  .catch((error) => {
    throw error
  })

const clearData = async (): Promise<void> => {
  const gamesRepository = AppDataSource.getRepository(Game)
  const genresRepository = AppDataSource.getRepository(Genre)
  const platformsRepository = AppDataSource.getRepository(Platform)
  const reviewersRepository = AppDataSource.getRepository(Reviewer)
  const reviewsRepository = AppDataSource.getRepository(Review)

  await Promise.all([
    reviewsRepository.createQueryBuilder().delete().execute(),
    genresRepository.createQueryBuilder().delete().execute(),
    platformsRepository.createQueryBuilder().delete().execute(),
    reviewersRepository.createQueryBuilder().delete().execute(),
    gamesRepository.createQueryBuilder().delete().execute()
  ])
}

describe('POST /api/v1/reviewers', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()

    const reviewer = new Reviewer()
    reviewer.username = 'saviomisael'
    reviewer.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer.email = 'savio@email.com'

    await reviewerRepository.createReviewer(reviewer)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return bad request when password and confirmPassword are different', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.create).send({
      password: '123aBc#@',
      confirmPassword: '321aBc#@'
    })

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.errors[0]).to.be.equal('A senha e a confirmação de senha devem ser iguais.')
  })

  it('should return bad request when email is not valid', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.create).send({
      password: '123aBc#@',
      confirmPassword: '123aBc#@',
      email: 'saviomail.com'
    })

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.errors.some((x: string) => x === 'Você deve enviar um email válido.')).to.be.true
  })

  it('should return bad request when password is invalid', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.create).send({
      password: 'teste123',
      confirmPassword: 'teste123',
      email: 'saviomail.com'
    })

    chai.expect(response).to.have.status(400)
    chai.expect(
      response.body.errors.some(
        (x: string) =>
          x ===
          'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
      )
    ).to.be.true
  })

  it('should return bad request when email already in use', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.create).send({
      password: '123aBc#@',
      confirmPassword: '123aBc#@',
      email: 'savio@email.com',
      username: 'saviao'
    })

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.errors.some((x: string) => x === 'O email savio@email.com já está sendo usado.')).to.be
      .true
  })

  it('should return bad request when username already in use', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.create).send({
      password: '123aBc#@',
      confirmPassword: '123aBc#@',
      email: 'saviao@email.com',
      username: 'saviomisael'
    })

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.errors.some((x: string) => x === 'O usuário saviomisael já existe.')).to.be.true
  })

  it('should return created when reviewer account is valid', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.create).send({
      password: '123aBc#@',
      confirmPassword: '123aBc#@',
      email: 'saviao@email.com',
      username: 'saviao'
    })

    const { token, username } = response.body.data[0]

    chai.expect(response).to.have.status(201)
    chai.expect(token).not.be.empty
    chai.expect(username).to.be.equal('saviao')
  })
})

describe('POST /api/v1/reviewers/tokens', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()

    const reviewer = new Reviewer()
    reviewer.username = 'saviomisael'
    reviewer.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer.email = 'savio@email.com'

    await reviewerRepository.createReviewer(reviewer)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return bad request when password is weak', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.signIn).send({
      password: 'teste123',
      username: 'saviomisael'
    })

    chai.expect(response).to.have.status(400)
  })

  it('should return bad request when username is invalid', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.signIn).send({
      password: '123aBc#@',
      username:
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    })

    chai.expect(response).to.have.status(400)
  })

  it('should return not found when username does not exist', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.signIn).send({
      password: '123aBc#@',
      username: 'saviao'
    })

    chai.expect(response).to.have.status(404)
  })

  it('should return not authorized when credentials are wrong', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.signIn).send({
      password: '123aBc#@1',
      username: 'saviomisael'
    })

    chai.expect(response).to.have.status(401)
  })

  it('should sign in successfully', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.signIn).send({
      password: '123aBc#@',
      username: 'saviomisael'
    })

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data[0].token).not.be.empty
    chai.expect(response.body.data[0].username).to.be.equal('saviomisael')
  })
})

describe('POST /api/v1/reviewers/tokens 2', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()
    const reviewer = new Reviewer()
    reviewer.username = 'saviomisael'
    reviewer.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer.email = 'savio@email.com'
    reviewer.temporaryPassword = await PasswordEncrypter.encrypt('321WaBc#@')

    reviewer.generateTempPasswordTime()

    await Promise.all([reviewerRepository.createReviewer(reviewer), reviewerRepository.setTemporaryPassword(reviewer)])
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return not authorized when temporary password is wrong', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.signIn).send({
      password: '123aBc#@',
      username: 'saviomisael'
    })

    chai.expect(response).to.have.status(401)
  })

  it('should sign in with temporary password', async () => {
    const reviewerRepository = new ReviewerRepository()

    const response = await chai.request(app).post(apiRoutes.reviewers.signIn).send({
      password: '321WaBc#@',
      username: 'saviomisael'
    })

    const reviewer = await reviewerRepository.getReviewerByUsername('saviomisael')

    chai.expect(response).to.have.status(200)
    chai.expect(reviewer.tempPasswordTime).to.be.null
    chai.expect(reviewer.temporaryPassword).to.be.empty
  })
})

describe('AuthMiddleware', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()

    const reviewer = new Reviewer()
    reviewer.username = 'saviomisael'
    reviewer.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer.email = process.env.GMAIL_TEST as string
    await reviewerRepository.createReviewer(reviewer)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return a not authorized when is Authorization header is not set', async () => {
    const response = await chai.request(app).put(apiRoutes.reviewers.changePassword).send({
      newPassword: '321aBc#@',
      confirmNewPassword: '321aBc#@'
    })

    chai.expect(response).to.have.status(401)
    chai.expect(response.body.errors.some((x: string) => x === 'Authorization header não enviado.')).to.be.true
  })

  it('should return a not found when username does not exist', async () => {
    const generator = new JWTGenerator()

    const token = generator.generateToken('123', 'batata')

    const response = await chai
      .request(app)
      .put(apiRoutes.reviewers.changePassword)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword: '321aBc#@',
        confirmNewPassword: '321aBc#@'
      })

    chai.expect(response).to.have.status(404)
    chai.expect(response.body.errors.some((x: string) => x === 'Usuário não existe.')).to.be.true
  })

  it('should return a not authorized when user id is different than payload.sub', async () => {
    const generator = new JWTGenerator()

    const token = generator.generateToken('123', 'saviomisael')

    const response = await chai
      .request(app)
      .put(apiRoutes.reviewers.changePassword)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword: '321aBc#@',
        confirmNewPassword: '321aBc#@'
      })

    chai.expect(response).to.have.status(401)
    chai.expect(response.body.errors.some((x: string) => x === 'Token inválido.')).to.be.true
  })
})

describe('PUT /api/v1/reviewers', async () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()
    const reviewer = new Reviewer()
    reviewer.username = 'saviomisael'
    reviewer.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer.email = process.env.GMAIL_TEST as string
    reviewer.id = '0206a7f2-e912-4f85-8fb3-22547065a66b'

    await reviewerRepository.createReviewer(reviewer)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return bad request when newPassword and confirmNewPassword are not the same', async () => {
    const generator = new JWTGenerator()

    const token = generator.generateToken('0206a7f2-e912-4f85-8fb3-22547065a66b', 'saviomisael')

    const response = await chai
      .request(app)
      .put(apiRoutes.reviewers.changePassword)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword: '123aBc#@',
        confirmNewPassword: '321aBc#@'
      })

    chai.expect(response).to.have.status(400)
    chai.expect(
      response.body.errors.some((x: string) => x === 'A nova senha e a confirmação de senha devem ser iguais.')
    ).to.be.true
  })

  it('should return bad request when newPassword is weak', async () => {
    const generator = new JWTGenerator()

    const token = generator.generateToken('0206a7f2-e912-4f85-8fb3-22547065a66b', 'saviomisael')

    const response = await chai
      .request(app)
      .put(apiRoutes.reviewers.changePassword)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword: 'teste123',
        confirmNewPassword: 'teste123'
      })

    chai.expect(response).to.have.status(400)
  })

  /***
   * It's works but it sends email every time this is executed
   *  */
  // it('should return no content when password was changed successfully', async () => {
  //   const generator = new JWTGenerator()

  //   const token = generator.generateToken('0206a7f2-e912-4f85-8fb3-22547065a66b', 'saviomisael')

  //   const response = await chai
  //     .request(app)
  //     .put(apiRoutes.reviewers.changePassword)
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({
  //       newPassword: '321aBc@#',
  //       confirmNewPassword: '321aBc@#'
  //     })

  //   chai.expect(response).to.have.status(204)
  // })
})

describe('POST /api/v1/reviewers/passwords', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()
    const reviewer = new Reviewer()
    reviewer.username = 'saviomisael'
    reviewer.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer.email = process.env.GMAIL_TEST as string
    reviewer.id = '0206a7f2-e912-4f85-8fb3-22547065a66b'

    await reviewerRepository.createReviewer(reviewer)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return bad request when username is invalid', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.forgotPassword.replace(':username', 'ba'))

    chai.expect(response).to.have.status(400)
  })

  it('should return not found when username does not exist', async () => {
    const response = await chai.request(app).post(apiRoutes.reviewers.forgotPassword.replace(':username', 'krypto'))

    chai.expect(response).to.have.status(404)
  })

  /***
   * It's works but it sends email every time this is executed
   *  */
  // it('should return no content when randomPassword is sent', async () => {
  //   const response = await chai
  //     .request(app)
  //     .post(apiRoutes.reviewers.forgotPassword.replace(':username', 'saviomisael'))

  //   chai.expect(response).to.have.status(204)
  // })
})

describe('POST /api/v1/reviewers/tokens/refresh', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()
    const reviewer = new Reviewer()
    reviewer.username = 'saviomisael'
    reviewer.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer.email = process.env.GMAIL_TEST as string
    reviewer.id = '0206a7f2-e912-4f85-8fb3-22547065a66b'

    await reviewerRepository.createReviewer(reviewer)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return a new token', async () => {
    const generator = new JWTGenerator()

    const token = generator.generateToken('0206a7f2-e912-4f85-8fb3-22547065a66b', 'saviomisael')

    const response = await chai
      .request(app)
      .post(apiRoutes.reviewers.refreshToken)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const newToken = response.body.data[0].token as string

    const payload = await generator.verifyToken(newToken)

    chai.expect(response).to.have.status(201)
    chai.expect(payload.sub).to.be.equal('0206a7f2-e912-4f85-8fb3-22547065a66b')
    chai.expect(payload.name).to.be.equal('saviomisael')
  })
})

describe('DELETE /api/v1/reviewers', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()
    const reviewer = new Reviewer()
    reviewer.username = 'saviomisael'
    reviewer.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer.email = process.env.GMAIL_TEST as string
    reviewer.id = '0206a7f2-e912-4f85-8fb3-22547065a66b'

    await reviewerRepository.createReviewer(reviewer)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should delete a reviewer account', async () => {
    const generator = new JWTGenerator()

    const token = generator.generateToken('0206a7f2-e912-4f85-8fb3-22547065a66b', 'saviomisael')

    const response = await chai
      .request(app)
      .delete(apiRoutes.reviewers.deleteReviewer)
      .set('Authorization', `Bearer ${token}`)
      .send()

    chai.expect(response).to.have.status(204)
  })
})

describe('GET /api/v1/reviewers/:username', () => {
  beforeEach(async () => {
    const allAges = await chai.request(app).get(apiRoutes.ageRatings.getAll)
    const genreRepository = new GenreRepository()
    const platformRepository = new PlatformRepository()
    const gameRepository = new GameRepository()
    const reviewerRepository = new ReviewerRepository()

    const age = new AgeRating()
    age.age = allAges.body.data[0].age as string
    age.description = allAges.body.data[0].description as string
    age.id = allAges.body.data[0].id

    const genre1 = new Genre()
    genre1.name = 'multiplayer'
    genre1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const genre2 = new Genre()
    genre2.name = 'multiplayer 2'
    genre2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    const platform1 = new Platform()
    platform1.name = 'playstation 1'
    platform1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const platform2 = new Platform()
    platform2.name = 'playstation 2'
    platform2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    await genreRepository.createGenre(genre1)
    await genreRepository.createGenre(genre2)
    await platformRepository.create(platform1)
    await platformRepository.create(platform2)

    const game = new Game()
    game.name = 'The Witcher 3'
    game.price = 100
    game.description =
      'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!'
    game.releaseDate = new Date()
    game.ageRating = age
    game.addGenre(genre1)
    game.addGenre(genre2)
    game.addPlatform(platform1)
    game.addPlatform(platform2)
    game.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    await gameRepository.create(game)

    const game2 = new Game()
    game2.name = 'The Witcher 2'
    game2.price = 100
    game2.description =
      'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!'
    game2.releaseDate = new Date()
    game2.ageRating = age
    game2.addGenre(genre1)
    game2.addGenre(genre2)
    game2.addPlatform(platform1)
    game2.addPlatform(platform2)
    game2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'
    await gameRepository.create(game2)

    const reviewer1 = new Reviewer()
    reviewer1.username = 'saviomisael'
    reviewer1.password = await PasswordEncrypter.encrypt('123aBc#@')
    reviewer1.email = process.env.GMAIL_TEST as string
    reviewer1.createdAtUtcTime = new Date(2020, 5, 3)
    reviewer1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'

    await reviewerRepository.createReviewer(reviewer1)

    const review1 = new Review()
    review1.description = 'Jogo bem legal'
    review1.stars = 5
    review1.game = game
    review1.reviewer = reviewer1

    const review2 = new Review()
    review2.description = 'Jogo mais que legal'
    review2.stars = 5
    review2.game = game2
    review2.reviewer = reviewer1

    await gameRepository.createReview(review1)
    await gameRepository.createReview(review2)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return not found when username does not exist', async () => {
    const response = await chai.request(app).get(apiRoutes.reviewers.getDetails.replace(':username', 'batata'))

    chai.expect(response).to.have.status(404)
  })

  it('should return reviewer details when username exists', async () => {
    const response = await chai.request(app).get(apiRoutes.reviewers.getDetails.replace(':username', 'saviomisael'))
    const details = response.body.data[0]

    chai.expect(response).to.have.status(200)
    chai.expect(details.username).to.be.equal('saviomisael')
    chai.expect(new Date(details.createdAt as string).toISOString()).to.be.equal(new Date(2020, 5, 3).toISOString())
    chai.expect(details.reviewsCount).to.be.equal(2)
  })
})
