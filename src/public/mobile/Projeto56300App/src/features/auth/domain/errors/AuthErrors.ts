export class InvalidCredentialsError extends Error {
  constructor() {
    super('Usuário ou senha inválidos.')
    this.name = 'InvalidCredentialsError'
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super('Sessão expirada. Faça login novamente.')
    this.name = 'SessionExpiredError'
  }
}

export class TokenNotFoundError extends Error {
  constructor() {
    super('Token de recuperação inválido ou expirado.')
    this.name = 'TokenNotFoundError'
  }
}
