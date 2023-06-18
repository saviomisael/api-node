import { GameResponseDTO } from '$/application/dto/GameResponseDTO'
import { type ReviewResponseDTO } from './ReviewResponseDTO'

export class SingleGameResponseDTO extends GameResponseDTO {
  reviews!: ReviewResponseDTO[]
}
