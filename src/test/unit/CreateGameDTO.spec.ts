import { CreateGameDTO } from '$/presentation/dto/CreateGameDTO'
import chai from 'chai'
import { validate } from 'class-validator'

describe('CreateGameDTO', () => {
  it('should return an error when name does not have 3 characters', async () => {
    const dto = new CreateGameDTO()
    dto.name = 'ab'

    const errors = await validate(dto)

    const nameErrors = errors.find(x => x.property === 'name')

    chai.expect(errors.length > 0).to.be.true
    chai.expect(nameErrors !== undefined).to.be.true
    chai.expect(nameErrors?.constraints?.minLength).to.be.equal('O jogo deve ter pelo menos 3 caracteres.')
  })
})
