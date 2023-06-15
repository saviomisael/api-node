import { PasswordCrypter } from '$/infrastructure/PasswordCrypter'
import chai from 'chai'

describe('PasswordCrypter', () => {
  it('should encrypt a password', async () => {
    const hash = await PasswordCrypter.encrypt('12345678')

    chai.expect(hash).not.be.equal('12345678')
  })

  it('should return true when two passwords are equal', async () => {
    const result = await PasswordCrypter.comparePasswords('12345678', '12345678')

    chai.expect(result).to.be.true
  })
})
