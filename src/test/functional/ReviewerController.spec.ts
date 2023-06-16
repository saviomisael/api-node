import { Reviewer } from '$/domain/entities/Reviewer'
import { DBConnection } from '$/infrastructure/DBConnection'
import { JWTGenerator } from '$/infrastructure/JWTGenerator'
import { PasswordEncrypter } from '$/infrastructure/PasswordEncrypter'
import { ReviewerRepository } from '$/infrastructure/repositories/ReviewerRepository'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import app from '$/infrastructure/server'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

const clearData = async (): Promise<void> => {
  const conn = await DBConnection.getConnection()

  await conn.execute('DELETE FROM reviewers')
}

describe('POST /api/v1/reviewers', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()

    await reviewerRepository.createReviewer(
      new Reviewer('saviomisael', await PasswordEncrypter.encrypt('123aBc#@'), 'savio@email.com')
    )
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

    const { token } = response.body.data[0]

    chai.expect(response).to.have.status(201)
    chai.expect(token).not.be.empty
  })
})

describe('POST /api/v1/reviewers/tokens', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()

    await reviewerRepository.createReviewer(
      new Reviewer('saviomisael', await PasswordEncrypter.encrypt('123aBc#@'), 'savio@email.com')
    )
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
  })
})

describe('AuthMiddleware', () => {
  beforeEach(async () => {
    const reviewerRepository = new ReviewerRepository()

    await reviewerRepository.createReviewer(
      new Reviewer('saviomisael', await PasswordEncrypter.encrypt('123aBc#@'), 'savioth9@gmail.com')
    )
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
    const reviewer = new Reviewer('saviomisael', await PasswordEncrypter.encrypt('123aBc#@'), 'savioth9@gmail.com')
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
})
