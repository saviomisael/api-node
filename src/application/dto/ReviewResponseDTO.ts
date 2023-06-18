import { type Owner } from '$/domain/value-objects/Owner'

export class ReviewResponseDTO {
  id!: string
  owner!: Owner
  description!: string
  star!: number
}
