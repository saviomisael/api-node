import { Reviewer } from '$/domain/entities/Reviewer'
import { DBConnection } from '$/infrastructure/DBConnection'
import { PasswordCrypter } from '$/infrastructure/PasswordCrypter'
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
      new Reviewer('saviomisael', await PasswordCrypter.encrypt('123aBc#@'), 'savio@email.com')
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
})
