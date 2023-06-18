import { AgeRating } from '$/domain/entities'
import { CreateAgeRatingService } from '$/infrastructure/services/CreateAgeRatingService'

export const seedDB = async (): Promise<void> => {
  const ageRatingService = new CreateAgeRatingService()

  const ages = [
    { age: 'L', description: 'Livre para todos os públicos.' },
    { age: '10+', description: 'Não recomendado para menores de 10 anos.' },
    { age: '12+', description: 'Não recomendado para menores de 10 anos.' },
    { age: '14+', description: 'Não recomendado para menores de 14 anos.' },
    { age: '16+', description: 'Não recomendado para menores de 16 anos.' },
    { age: '18+', description: 'Não recomendado para menores de 18 anos.' }
  ]

  for (const { age, description } of ages) {
    const ageRating = new AgeRating()
    ageRating.age = age
    ageRating.description = description
    await ageRatingService.createAgeRating(ageRating)
  }
}
