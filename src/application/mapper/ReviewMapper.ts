import { type Review } from '$/domain/entities'
import { ReviewResponseDTO } from '../dto/ReviewResponseDTO'

export class ReviewMapper {
  private constructor() {}

  static fromDomainToReviewResponse(review: Review): ReviewResponseDTO {
    const reviewResponse = new ReviewResponseDTO()
    reviewResponse.description = review.getDescription()
    reviewResponse.id = review.getId()
    reviewResponse.owner = review.getOwner()
    reviewResponse.star = review.getStars()
    return reviewResponse
  }
}
