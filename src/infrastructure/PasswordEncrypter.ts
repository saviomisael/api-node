import bcrypt from 'bcryptjs'

export class PasswordEncrypter {
  private static readonly saltRounds = 10

  static async encrypt(password: string): Promise<string> {
    return await PasswordEncrypter.encryptAsync(password)
  }

  private static async encryptAsync(password: string): Promise<string> {
    const salt = await PasswordEncrypter.genSaltAsync()

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
      bcrypt.genSalt(PasswordEncrypter.saltRounds, (error, salt) => {
        if (error != null) {
          reject(error)
          return
        }

        resolve(salt)
      })
    })
  }

  static async comparePasswords(passwordEncrypted: string, passwordNotEncrypted: string): Promise<boolean> {
    const result = await bcrypt.compare(passwordNotEncrypted, passwordEncrypted)

    return Boolean(result)
  }
}
