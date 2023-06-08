export class PlatformNotExistsError extends Error {
  constructor (platformName: string) {
    super(`A plataforma ${platformName} não existe.`)
  }
}
