import jwt from 'jsonwebtoken'

export interface Payload {
  sub: string
  name: string
}

export class JWTGenerator {
  generateToken(userId: string, username: string): string {
    return jwt.sign(
      {
        sub: userId,
        name: username
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1800s', notBefore: '1ms' }
    )
  }

  async verifyToken(token: string): Promise<Payload> {
    return await this.verifyTokenAsync(token)
  }

  private async verifyTokenAsync(token: string): Promise<Payload> {
    return await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (error, decoded) => {
        if (error != null) {
          reject(error)
          return
        }

        resolve(decoded as Payload)
      })
    })
  }
}
