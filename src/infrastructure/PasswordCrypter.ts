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

        resolve(hash as string)
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

        resolve(salt as string)
      })
    })
  }

  static async comparePasswords(password1: string, password2: string): Promise<boolean> {
    const hash = await PasswordCrypter.encrypt(password2)

    const result = await bcrypt.compare(password1, hash)

    return Boolean(result)
  }
}
