import { JWTGenerator } from '$/infrastructure/JWTGenerator'
import chai from 'chai'
import dotenv from 'dotenv'
import { JsonWebTokenError } from 'jsonwebtoken'

dotenv.config()

describe('JWTGenerator', () => {
  it('should return payload equal to values provided', async () => {
    const generator = new JWTGenerator()

    const token = generator.generateToken('9b1deb4d-3b7d-aaaa-bbbb-2b0d7b3dcb6d', 'saviao')

    const payload = await generator.verifyToken(token)

    chai.expect(payload.name).to.be.equal('saviao')
    chai.expect(payload.sub).to.be.equal('9b1deb4d-3b7d-aaaa-bbbb-2b0d7b3dcb6d')
  })

  it('should return invalid token when token provided is invalid', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    const generator = new JWTGenerator()

    try {
      await generator.verifyToken(token)
    } catch (error) {
      chai.expect(error instanceof JsonWebTokenError).to.be.true
    }
  })
})
