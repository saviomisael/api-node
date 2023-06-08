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

  it('should return an error when description does not have 10 characters', async () => {
    const dto = new CreateGameDTO()
    dto.description = 'cool game'

    const errors = await validate(dto)

    const descriptionErrors = errors.find(x => x.property === 'description')

    chai.expect(errors.length > 0).to.be.true
    chai.expect(descriptionErrors !== undefined).to.be.true
    chai.expect(descriptionErrors?.constraints?.minLength).to.be.equal('A descrição deve ter pelo menos 10 caracteres.')
  })

  it('should return an error when releaseDate is not a valid date', async () => {
    const dto = new CreateGameDTO()
    dto.releaseDate = '01/01/2020'

    const errors = await validate(dto)

    const releaseDateErrors = errors.find(x => x.property === 'releaseDate')

    chai.expect(errors.length > 0).to.be.true
    chai.expect(releaseDateErrors?.constraints?.matches).to.be.equal('A data de lançamento deve ser uma data.')
  })

  it('should return an error when ageRatingId is not an uuid', async () => {
    const dto = new CreateGameDTO()
    dto.ageRatingId = '123'

    const errors = await validate(dto)

    const ageRatingIdErrors = errors.find(x => x.property === 'ageRatingId')

    chai.expect(errors.length > 0)
    chai.expect(ageRatingIdErrors?.constraints?.matches).to.be.equal('O id da faixa etária deve ser um uuid válido.')
  })
})
