import bcrypt from 'bcryptjs'

export class PasswordCrypter {
  private static readonly saltRounds = 10

  static async encrypt(password: string): Promise<string> {
    return await PasswordCrypter.encryptAsync(password)
  }

  private static async encryptAsync(password: string): Promise<string> {
    const salt = await PasswordCrypter.genSaltAsync()

    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (error, hash) => {
        if (error != null) {
          reject(error)
          return
        }

        resolve(hash)
      })
    })
  }

  private static async genSaltAsync(): Promise<string> {
    return await new Promise((resolve, reject) => {
      bcrypt.genSalt(PasswordCrypter.saltRounds, (error, salt) => {
        if (error != null) {
          reject(error)
          return
        }

        resolve(salt)
      })
    })
  }

  static async comparePasswords(passwordEncrypted: string, passwordNotEncrypted: string): Promise<boolean> {
    const hash = await PasswordCrypter.encrypt(passwordNotEncrypted)

    const result = await bcrypt.compare(passwordEncrypted, hash)

    return Boolean(result)
  }
}
