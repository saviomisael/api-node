import { AgeRating } from '$/domain/entities'
import { AgeRatingService } from '../service/AgeRatingService'

export const seedDB = async (): Promise<void> => {
  const ageRatingService = new AgeRatingService()

  await ageRatingService.createAgeRating(
    new AgeRating('L', 'Livre para todos os públicos.'))

  await ageRatingService.createAgeRating(
    new AgeRating('10+', 'Não recomendado para menores de 10 anos.'))

  await ageRatingService.createAgeRating(
    new AgeRating('12+', 'Não recomendado para menores de 12 anos.'))

  await ageRatingService.createAgeRating(
    new AgeRating('14+', 'Não recomendado para menores de 14 anos.'))

  await ageRatingService.createAgeRating(
    new AgeRating('16+', 'Não recomendado para menores de 16 anos.'))

  await ageRatingService.createAgeRating(
    new AgeRating('18+', 'Não recomendado para menores de 18 anos.'))
}
