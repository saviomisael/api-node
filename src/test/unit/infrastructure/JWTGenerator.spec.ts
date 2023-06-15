import { JWTGenerator } from '$/infrastructure/JWTGenerator'
import chai from 'chai'
import dotenv from 'dotenv'

dotenv.config()

describe('JWTGenerator', () => {
  it('should return payload equal to values provided', async () => {
    const generator = new JWTGenerator()

    const token = generator.generateToken('9b1deb4d-3b7d-aaaa-bbbb-2b0d7b3dcb6d', 'saviao')

    const payload = await generator.verifyToken(token)

    chai.expect(payload.name).to.be.equal('saviao')
    chai.expect(payload.sub).to.be.equal('9b1deb4d-3b7d-aaaa-bbbb-2b0d7b3dcb6d')
  })
})
