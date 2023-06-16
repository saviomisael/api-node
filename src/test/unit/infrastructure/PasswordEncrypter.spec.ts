import { PasswordEncrypter } from '$/infrastructure/PasswordEncrypter'
import chai from 'chai'

describe('PasswordEncrypter', () => {
  it('should encrypt a password', async () => {
    const hash = await PasswordEncrypter.encrypt('12345678')

    chai.expect(hash).not.be.equal('12345678')
  })

  it('should return true when two passwords are equal', async () => {
    const hash = await PasswordEncrypter.encrypt('12345678')
    const result = await PasswordEncrypter.comparePasswords(hash, '12345678')

    chai.expect(result).to.be.true
  })

  it('should return false when two passwords are not equal', async () => {
    const hash = await PasswordEncrypter.encrypt('12345678')
    const result = await PasswordEncrypter.comparePasswords(hash, '123456789')

    chai.expect(result).to.be.false
  })
})
