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

  it('should test each platform and return an error when platform is not an uuid', async () => {
    const dto = new CreateGameDTO()
    dto.platforms = ['123', '321', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d']

    const errors = await validate(dto)
    const platformsErrors = errors.find(x => x.property === 'platforms')

    chai.expect(errors.length > 0).to.be.true

    chai.expect(platformsErrors?.constraints?.matches).to.be.equal('O id da plataforma deve ser um uuid válido.')
  })

  it('should return an error when platforms is lower than 1', async () => {
    const dto = new CreateGameDTO()
    dto.platforms = []

    const errors = await validate(dto)
    const platformsErrors = errors.find(x => x.property === 'platforms')

    chai.expect(errors.length > 0).to.be.true
    chai.expect(platformsErrors?.constraints?.arrayMinSize).to.be.equal('Deve ter pelo menos uma plataforma no array.')
  })

  it('should return an error when platforms length is greater than 4', async () => {
    const dto = new CreateGameDTO()
    dto.platforms = ['9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6c', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e']

    const errors = await validate(dto)
    const platformsErrors = errors.find(x => x.property === 'platforms')

    chai.expect(errors.length > 0).to.be.true
    chai.expect(platformsErrors?.constraints?.arrayMaxSize).to.be.equal('As plataformas podem ser no máximo 4.')
  })

  it('should test each genre and return an error when genre is not an uuid', async () => {
    const dto = new CreateGameDTO()
    dto.genres = ['123', '321', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d']

    const errors = await validate(dto)
    const genresErrors = errors.find(x => x.property === 'genres')

    chai.expect(errors.length > 0).to.be.true

    chai.expect(genresErrors?.constraints?.matches).to.be.equal('O id do gênero deve ser um uuid válido.')
  })

  it('should return an error when genres length is lower than 1', async () => {
    const dto = new CreateGameDTO()
    dto.genres = []

    const errors = await validate(dto)
    const genresErrors = errors.find(x => x.property === 'genres')

    chai.expect(errors.length > 0).to.be.true
    chai.expect(genresErrors?.constraints?.arrayMinSize).to.be.equal('Deve ter pelo menos um gênero no array.')
  })

  it('should return an error when genres length is greater than 4', async () => {
    const dto = new CreateGameDTO()
    dto.genres = ['9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6c', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e']

    const errors = await validate(dto)
    const genresErrors = errors.find(x => x.property === 'genres')

    chai.expect(errors.length > 0).to.be.true
    chai.expect(genresErrors?.constraints?.arrayMaxSize).to.be.equal('Os gêneros podem ser no máximo 4.')
  })
})
