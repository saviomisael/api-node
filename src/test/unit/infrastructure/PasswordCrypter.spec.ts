import { PasswordCrypter } from '$/infrastructure/PasswordCrypter'
import chai from 'chai'

describe('PasswordCrypter', () => {
  it('should encrypt a password', async () => {
    const hash = await PasswordCrypter.encrypt('12345678')

    console.log(hash)
    chai.expect(hash).not.be.equal('12345678')
  })
})
