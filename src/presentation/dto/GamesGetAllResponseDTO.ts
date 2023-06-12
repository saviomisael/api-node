import { type GameResponseDTO } from '$/application/dto/GameResponseDTO'

export class GamesGetAllResponseDTO {
  games!: GameResponseDTO[]
  currentPage!: number
  lastPage!: number
  previousPage!: number | null
  nextPage!: number | null
}
