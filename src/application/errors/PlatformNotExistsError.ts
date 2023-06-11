export class PlatformNotExistsError extends Error {
  constructor(platformId: string) {
    super(`A plataforma ${platformId} não existe.`)
  }
}
